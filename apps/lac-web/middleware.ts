import { loginCheck } from "@/_hooks/user/use-suspense-check-login.hook";
import { api } from "@/_lib/api";
import { SESSION_TOKEN_COOKIE } from "@/_lib/constants";
import dayjs from "dayjs";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ONLY_ROUTES = [
  "/sign-in",
  "/register",
  "/forgot-password",
  "/password-reset",
];
const PRIVATE_ROUTES = ["/osr", "/checkout", "/confirmation", "/myaccount"];

export const middleware = async (request: NextRequest) => {
  const sessionToken = request.cookies.get(SESSION_TOKEN_COOKIE);

  // Create new session token if it doesn't exist
  if (!sessionToken) {
    // TODO Find a better solution to this
    // Currently server components do not have the session token cookie
    // when opening the site for the first time, so we're using this
    // workaround to redirect the same page after setting the cookie
    // https://github.com/vercel/next.js/issues/49442#issuecomment-1538691004
    const response = NextResponse.redirect(request.url);

    const sessionResponse = await api.get("rest/session", {
      cache: "no-cache",
      credentials: "include",
    });

    // Check for the session token cookie
    for (const header of sessionResponse.headers.entries()) {
      if (
        header[0] === "set-cookie" &&
        header[1].includes(`${SESSION_TOKEN_COOKIE}=`)
      ) {
        const keyValuePairs = header[1].split("; ");
        let tokenValue = "";
        const cookieConfig: Partial<ResponseCookie> = {
          path: "/",
        };

        for (const pair of keyValuePairs) {
          const [key, value] = pair.split("=");

          if (key && value) {
            if (key === SESSION_TOKEN_COOKIE) {
              tokenValue = value;
            } else if (key === "expires") {
              cookieConfig.expires = dayjs(value).toDate();
            } else if (key === "Max-Age") {
              cookieConfig.maxAge = parseInt(value);
            }
          }
        }

        response.cookies.set(SESSION_TOKEN_COOKIE, tokenValue, cookieConfig);
      }
    }

    return response;
  }

  // Check for public routes
  const isPublicRoute = !!PUBLIC_ONLY_ROUTES.find((route) =>
    request.nextUrl.pathname.startsWith(route),
  );
  if (isPublicRoute && sessionToken) {
    const response = await loginCheck(sessionToken?.value);

    if (response.status_code === "OK") {
      // Redirect to home page if the user tries to access
      // public only routes while logged in
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Check for private routes
  const isPrivateRoute = !!PRIVATE_ROUTES.find((route) =>
    request.nextUrl.pathname.startsWith(route),
  );
  if (isPrivateRoute && sessionToken) {
    const response = await loginCheck(sessionToken?.value);

    if (response.status_code === "NOT_LOGGED_IN") {
      // Redirect to sign in page if user is not logged in
      return NextResponse.redirect(new URL("/sign-in", request.url));
    } else {
      // Do checks for individual routes

      // OSR Dashboard
      if (
        request.nextUrl.pathname.startsWith("/osr") &&
        !("sales_rep_id" in response)
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/(.*(?!opengraph-image).*)",
  ],
};
