import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // issues with users being randomly logged out.

  let user = null;
  try {
    console.log("Supabase middleware: Fetching user for path:", request.nextUrl.pathname);
    const {
      data: { user: authUser },
      error
    } = await supabase.auth.getUser()
    if (error) {
      console.error("Supabase middleware: auth.getUser() returned error:", error);
    }
    user = authUser;
    console.log("Supabase middleware: User found:", user ? user.email : "none");
  } catch (error) {
    console.error("Supabase middleware: Exception caught during getUser():", error);
  }

  // Protected routes logic is handled on the client side to support hybrid authentication (Supabase & Firebase)
  // which ensures that users logged in via client-only providers (Google Firebase) are not blocked by server middleware.

  return supabaseResponse
}
