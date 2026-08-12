import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const isSupabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

// Carries any session cookies that supabase set on `source` (e.g. refreshed
// tokens or a cleared session) onto `target`. Redirects must not silently drop
// them, otherwise a just-refreshed session is lost and the user is bounced
// back to /login on the very next navigation.
function withSessionCookies(source: NextResponse, target: NextResponse) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie.name, cookie.value, {
      path: cookie.path,
      domain: cookie.domain,
      maxAge: cookie.maxAge,
      expires: cookie.expires,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      priority: cookie.priority,
      partitioned: cookie.partitioned,
    });
  }
  return target;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Optimistic, cookie-only check. This never hits the network, so a transient
  // Auth API failure cannot wrongly turn an authenticated user into `null`.
  // It also keeps the still-valid session if a token refresh glitches. The
  // authoritative validation happens inside the account/admin pages via
  // supabase.auth.getUser().
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isProtectedPage = pathname.startsWith("/account") || pathname.startsWith("/admin");

  const authCookieNames = request.cookies
    .getAll()
    .filter(
      (cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token")
    )
    .map((cookie) => cookie.name);

  // Diagnostic + prevent CDN caching of any session Set-Cookie on auth routes.
  const debugHeader = `cookies=${authCookieNames.join(",") || "none"};session=${session ? "true" : "false"}`;
  response.headers.set("x-auth-debug", debugHeader);
  response.headers.set("Cache-Control", "private, no-store, must-revalidate");

  if (isProtectedPage && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    const redirect = withSessionCookies(response, NextResponse.redirect(url));
    redirect.headers.set("x-auth-debug", debugHeader);
    return redirect;
  }

  if ((pathname === "/login") && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    url.search = "";
    const redirect = withSessionCookies(response, NextResponse.redirect(url));
    redirect.headers.set("x-auth-debug", debugHeader);
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    "/login/:path*",
    "/account/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
