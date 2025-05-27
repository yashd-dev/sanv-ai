import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Protect the /chat and /dashboard routes
  if (
    pathname === "/chat" ||
    pathname === "/dashboard" ||
    pathname.startsWith("/chat/")
  ) {
    // Let updateSession handle the authentication check
    // It will redirect to /auth if not authenticated
    return response;
  }

  // For all other routes, just return the response
  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
