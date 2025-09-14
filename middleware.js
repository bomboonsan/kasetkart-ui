export { default } from "next-auth/middleware";

export const config = {
  // Protect all routes except API, static assets, and the login page
  matcher: [
    "/((?!api|_next/|favicon.ico|assets|images|public|Logo.png|login|strapi(?:/.*)?|phpmyadmin(?:/.*)?).*)",
  ],
};
