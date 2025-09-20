# Gemini Code Assistant Context

## Project Overview

This is a Next.js web application for Kasetsart University. It serves as a portfolio system for managing academic works, projects, and publications. The application features a user authentication system, a dashboard for data visualization, and forms for submitting and managing academic information.

**Key Technologies:**

*   **Framework:** Next.js
*   **Styling:** Tailwind CSS, daisyUI
*   **UI Components:** `lucide-react` for icons
*   **Authentication:** NextAuth.js
*   **Data Fetching:** SWR, Axios
*   **Data Visualization:** ApexCharts
*   **Language:** JavaScript (with some Thai comments)

**Architecture:**

*   The application is structured as a standard Next.js project with the `app` directory for routing.
*   The main layout is defined in `app/layout.js`.
*   The application uses a client-side rendering approach with SWR for data fetching.
*   Authentication is handled by NextAuth.js, with the main page redirecting to `/login`.
*   The application interacts with a backend API for data, with the base URL configured in `next.config.mjs`.
*   The UI is composed of React components located in the `components` directory.

## Building and Running

To run the development server, use one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

**Available Scripts:**

*   `dev`: Starts the development server with Turbopack.
*   `build`: Creates a production build of the application.
*   `start`: Starts the production server.
*   `lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `test:team`: Runs a test script related to team utilities.

## Development Conventions

*   The project uses functional components and React Hooks.
*   Styling is done using Tailwind CSS utility classes.
*   Code includes comments in both English and Thai.
*   API interactions are managed through a centralized API library in `lib/api.js`.
*   Authentication is handled by NextAuth.js.
*   The project uses SWR for data fetching and caching.
