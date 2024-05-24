import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // set the page route here for the login page (optional). If you leave empty it uses default NextAuth.js one
  },

  /* NOTES
    logic to protect your routes. This will prevent users from accessing the dashboard pages unless they are logged in.
    - The authorized callback is used to verify if the request is authorized to access a page via Next.js Middleware.
    It is called before a request is completed, and it receives an object with the auth and request properties.
    - The auth property contains the user's session, and the request property contains the incoming request.
    - The providers option is an array where you list different login options.
    For now, it's an empty array to satisfy NextAuth config. */
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
