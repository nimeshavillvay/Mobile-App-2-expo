import { api } from "@/_lib/api";
import { SESSION_TOKEN_COOKIE } from "@/_lib/constants";
import dayjs from "dayjs";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse, type NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next();
  const sessionToken = request.cookies.get(SESSION_TOKEN_COOKIE);

  // Create new session token if it doesn't exist
  if (!sessionToken) {
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
  }

  return response;
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
