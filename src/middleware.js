// src/middleware.js
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ["/", "/contact", "/portfolio"], // pages accessible without login
});

export const config = {
  matcher: [
    "/dashboard(.*)",
    "/admin(.*)",
    "/((?!.+\\..*|_next).*)", // apply to all normal pages
  ],
};
