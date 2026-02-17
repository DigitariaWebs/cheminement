# Project Structure & Usage Guide (Detailed)

This document provides a comprehensive, file-by-file and folder-by-folder explanation of the project structure, main pages, routes, and how to work with this project (no code, just structure and purpose).

## Overview

This is a full-stack web application built with Next.js (App Router), using MongoDB for data storage and NextAuth for authentication. The backend and frontend are integrated in a single codebase.

---

## Root Directory

- **README.md**: Project overview, tech stack, and development phases.
- **explain.md**: This file. Explains the project structure in detail.
- **package.json**: Lists dependencies, scripts, and project metadata.
- **pnpm-lock.yaml / bun.lock / package-lock.json**: Lock files for dependency managers (pnpm, bun, npm).
- **tsconfig.json**: TypeScript configuration.
- **eslint.config.mjs**: ESLint configuration for code linting.
- **postcss.config.mjs**: PostCSS configuration for CSS processing.
- **next.config.ts**: Next.js configuration.
- **.env.example**: Example environment variables with explanations.
- **.env**: Your actual environment variables (not committed).
- **BACKEND_IMPLEMENTATION_AUDIT.md, TESTING_GUIDE_UPDATED.md**: Documentation for backend and testing.
- **components.json**: Component registry or config (if used).

---

## /public

Static assets (images, icons, etc.) served directly by Next.js. Example files: HeroSection.png, Logo.png, favicon.png, etc.

---

## /messages

Localization files for different languages:

- **en.json**: English translations.
- **fr.json**: French translations.

---

## /src

Main source code for the app. Contains all logic, UI, and configuration.

### /src/app

Contains all application routes (pages and API endpoints):

- **error.tsx, not-found.tsx, loading.tsx, layout.tsx**: Global error, 404, loading, and layout components.
- **globals.css**: Global CSS for the app.
- **(auth)/**: Authentication pages (login, signup, forgot-password) and their layout.
- **(privilaged)/**: Dashboards for admin, client, and professional users, each with its own layout and subfolders.
- **(public)/**: Public-facing pages (home, about, services, etc.), each as a folder or page.
- **appointment/**: Appointment booking page (page.tsx).
- **pay/**: Payment processing page (page.tsx).
- **actions/**: Server actions (e.g., locale.ts for language switching).
- **api/**: All backend API endpoints, organized by feature (admin, appointments, auth, clients, medical-profile, payments, profile, reviews, stripe-connect, upload, users).

### /src/components

Reusable UI components, grouped by feature:

- **providers.tsx**: Context providers for the app.
- **appointments/**: Appointment dialogs and index.
- **auth/**: Authentication forms and containers.
- **dashboard/**: Modals and profile components for dashboards.
- **layout/**: Header, footer, and sidebars for different user roles.
- **payments/**: Payment forms and modals.
- **sections/**: Home page and marketing sections, further organized by topic.
- **ui/**: Generic UI elements (buttons, inputs, dialogs, tables, etc.).

### /src/lib

Utility libraries for backend logic:

- **mongodb.ts, mongodbClient.ts**: MongoDB connection logic.
- **auth.ts**: NextAuth configuration.
- **stripe.ts**: Stripe payment helpers.
- **api-client.ts**: API client utilities.
- **appointment-routing.ts, create-admin.ts, errors.ts, middleware.ts, notifications.ts, pricing.ts, utils.ts**: Various helpers for routing, admin creation, error handling, middleware, notifications, pricing logic, and general utilities.

### /src/models

Mongoose models for each MongoDB collection:

- **Admin.ts, Appointment.ts, MedicalProfile.ts, PlatformSettings.ts, Profile.ts, Resource.ts, Review.ts, User.ts**: Define the structure of each collection in the database.

### /src/types

TypeScript type definitions:

- **api.ts**: API types.
- **css.d.ts, css.ts**: CSS-related types.
- **next-auth.d.ts**: NextAuth type extensions.

### /src/hooks

Custom React hooks:

- **use-mobile.ts**: Hook for mobile device detection or behavior.

### /src/i18n

Internationalization helpers:

- **request.ts**: Utilities for handling language and translation requests.

### /src/theme.ts

Theme configuration for the app (colors, fonts, etc.).

---

## How to Work With the Project

1. **Install dependencies:** `pnpm install`
2. **Set up your .env file** with MongoDB URI, NextAuth secret, and (optionally) Stripe keys.
3. **Start the app:** `pnpm dev`
4. **Access the app** at `http://localhost:3000`.
5. **Use MongoDB Compass** to view or manage your database.
6. **Edit UI components** in `src/components/` or add new pages/routes in `src/app/` as needed.

---

## Notes

- The project is modular: UI, logic, and data models are separated for clarity.
- Most collections are created automatically when data is inserted.
- Payments (Stripe) and some features are optional and require extra environment variables.
- Localization is supported via the `messages/` folder.

---

For more details, see the README.md or ask for specifics about any part of the project!

---

## Routing & Pages

### Public Pages

- **/ (Home)**: Main landing page.
- **/approaches, /book, /contact, /professional, /school-manager, /services, /who-we-are, /why-us**: Informational pages about the platform, services, and team.

### Auth Pages

- **/auth/login**: User login page.
- **/auth/signup**: User registration page.
- **/auth/forgot-password**: Password reset page.

### Appointment & Payment

- **/appointment**: Book or manage appointments.
- **/pay**: Payment processing page.

### Privileged Areas

- **/privilaged/admin**: Admin dashboard and management tools.
- **/privilaged/client**: Client dashboard for managing appointments, profiles, etc.
- **/privilaged/professional**: Professional dashboard for managing clients, appointments, and profiles.

---

## API Routes

- **/api/**: All backend endpoints (user management, appointments, payments, etc.) are under this folder. These are used by the frontend to fetch or update data.

---

## Authentication

- Managed by NextAuth, using MongoDB to store user sessions and credentials.
- Auth pages and protected routes are handled automatically; users are redirected if not authenticated.

---

## Database

- Uses MongoDB, with collections for users, appointments, reviews, profiles, etc.
- Models are defined in `src/models/` and used throughout the app.

---

## How to Work With the Project

1. **Install dependencies:** `pnpm install`
2. **Set up your .env file** with MongoDB URI, NextAuth secret, and (optionally) Stripe keys.
3. **Start the app:** `pnpm dev`
4. **Access the app** at `http://localhost:3000`.
5. **Use MongoDB Compass** to view or manage your database.
6. **Edit UI components** in `src/components/` or add new pages/routes in `src/app/` as needed.

---

## Notes

- The project is modular: UI, logic, and data models are separated for clarity.
- Most collections are created automatically when data is inserted.
- Payments (Stripe) and some features are optional and require extra environment variables.
- Localization is supported via the `messages/` folder.

---

For more details, see the README.md or ask for specifics about any part of the project!
