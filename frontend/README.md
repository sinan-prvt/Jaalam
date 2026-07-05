# Frontend

This package contains the React + TypeScript client for Jaalam. It powers the marketing landing page, authentication pages, dashboard, website editor, live preview, and public business pages.

## Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- Google OAuth

## Scripts

- `npm run dev` - start the Vite development server.
- `npm run build` - type-check and build for production.
- `npm run lint` - run ESLint across the frontend source tree.
- `npm run preview` - preview the production build locally.

## Routes

- `/` - marketing landing page.
- `/login` - sign-in page.
- `/register` - account creation page.
- `/dashboard` - authenticated dashboard.
- `/admin` - authenticated admin dashboard.
- `/editor/:websiteId` - authenticated website editor.
- `/_preview` - live preview route.
- `/:businessSlug` - public website route for a business.

## Runtime Behavior

- Axios is configured to send credentials by default in [src/main.tsx](src/main.tsx).
- A global 401 response handler clears the stored user session and redirects to `/login`.
- The app is wrapped with `GoogleOAuthProvider` in [src/main.tsx](src/main.tsx).
- The Google client ID in [src/main.tsx](src/main.tsx) is currently hardcoded and should be replaced before production use.

## Project Structure

- [src/pages/](src/pages) contains route-level screens.
- [src/components/](src/components) contains shared UI, layout, renderer, modal, and theme code.
- [src/store.ts](src/store.ts), [src/authSlice.ts](src/authSlice.ts), and [src/websiteSlice.ts](src/websiteSlice.ts) hold the Redux state setup.
