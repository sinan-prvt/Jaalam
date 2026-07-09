# Jaalam Website Builder

## Overview & Purpose

**What is Jaalam?**
Jaalam is a powerful monorepo platform designed for generating and managing stunning storefront websites. It features an AI-driven Website Builder that allows users to create themed, dynamic websites in seconds, complete with built-in analytics, SEO, and Razorpay subscription management. 

**What is its purpose?**
The primary purpose of Jaalam is to empower small businesses, creators, and entrepreneurs to establish a professional online presence instantly, with zero coding required. By answering a few prompts or selecting a business type, users get a fully deployed, themed website with integrated booking, contact forms, and custom branding.

---

## User Journey (How to Use)

Here is the step-by-step process of how a user interacts with the Jaalam platform:

1. **Onboarding & Registration**
   - The user arrives at the marketing landing page and signs up (typically using Google OAuth).
   - They enter the **Dashboard**, which provides an overview of their current sites, subscription tier, and analytics.

2. **Creating a Website**
   - **AI Generation:** The user clicks "New Project", inputs their business details (e.g., "A modern coffee shop in downtown"), and the AI instantly generates a themed layout, writes the copy, and creates the site structure.
   - **Manual Creation:** Alternatively, the user can manually select a template category (e.g., Restaurant, Retail, Gym) and a specific theme layout.

3. **Live Editing**
   - The user is taken to the **Website Editor**. This interface uses a split-pane view: the left side contains configuration controls (updating text, images, social links, and theme colors) and the right side is a **Live Preview** showing the exact website in real-time.
   - Any change made in the editor updates the live preview instantly via a seamless `postMessage` architecture.

4. **Publishing & Management**
   - Once satisfied, the user clicks "Publish". The website is instantly live at their unique URL slug (e.g., `jaalam.com/my-coffee-shop`).
   - The user can return to the dashboard at any time to view visitor analytics, upgrade their subscription via Razorpay, or order physical marketing materials (like NFC cards or custom QR code stickers).

---

## How It Works (System Architecture)

Jaalam combines a robust Django REST backend with a reactive React/Vite frontend.

- **The Frontend (React/Vite)**: 
  - Manages the UI state using **Redux Toolkit**. 
  - Uses **Tailwind CSS** for rapid styling and **Framer Motion** for smooth micro-animations.
  - The live editor works by loading the website renderer inside an `<iframe>` and passing state updates down to it dynamically, ensuring the user sees exactly what their customers will see.
  
- **The Backend (Django REST Framework)**:
  - Acts as the source of truth, storing user accounts, subscription states, and the JSON configuration for every website created.
  - Exposes RESTful API endpoints (`/api/users/`, `/api/websites/`) for the frontend to consume.
  - Integrates securely with **Razorpay** to verify payments and automatically upgrade user tiers.

---

## Core Features

- **AI Website Builder**: Instantly generate websites with beautiful designs using AI.
- **Theming Engine**: Multiple templates (Grocery, Retail, Restaurant, Real Estate, etc.) with responsive layouts.
- **Live Editor & Preview**: Edit website content with a live split-pane preview that updates instantly.
- **Subscription Management**: Built-in pricing plans and tiered memberships using Razorpay.
- **Dashboard Analytics**: Track website performance, visitors, and active sites.
- **Physical Orders**: Integration for purchasing and tracking physical items like stickers or NFC cards for websites.

## Project Structure & Components Breakdown

### Frontend (`frontend/src/`)
- **`pages/`**: Contains the main route views of the application.
  - **`auth/`**: Login, registration, and Google OAuth callback handling.
  - **`dashboard/`**: The main user dashboard for managing sites, `AdminDashboard` for platform-wide metrics, `Pricing` for subscription tiers, and `NotificationsPage`.
  - **`marketing/`**: The public-facing `LandingPage` that introduces Jaalam to new users.
  - **`website/`**: Core website building pages including the `WebsiteEditor` (drag-and-drop / AI interface), `LivePreview` (iframe previewer), and `PublicWebsite` (the dynamic renderer for published sites).
- **`components/`**: Reusable React components.
  - **`layout/`**: Structural components like the `DashboardSidebar` and navigation bars.
  - **`modals/`**: Dialogs such as the `AIGeneratorModal` which interfaces with the AI builder.
  - **`themes/`**: Distinct UI templates mapped to specific business types (e.g., Grocery, Retail, Restaurant).
  - **`ui/`**: Generic, reusable UI elements (buttons, inputs, alerts).
- **`Router.tsx`**: Defines all application routes, including protected routes that require authentication.
- **`store.ts` & Slices**: Redux state management (e.g., `authSlice` for user sessions, `websiteSlice` for builder state).

### Backend (`backend/`)
- **`users/`**: Django app managing user accounts, authentication tokens, Razorpay subscriptions, and onboarding status.
- **`websites/`**: Django app handling website models, themes, physical orders, and image uploads.
- **`db.sqlite3`**: Default local database for development.

## Documentation

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## Tech Stack

### Frontend
- React 19 & Vite
- TypeScript
- Tailwind CSS
- Redux Toolkit (State Management)
- Lucide React (Icons)
- Framer Motion (Animations)
- Axios

### Backend
- Django & Django REST Framework
- SQLite Database
- Razorpay Integration

## Quick Start

### 1. Backend Setup
Navigate to the `backend/` directory:
```bash
cd backend
# Create virtual environment and install requirements
pip install -r requirements.txt
# Run migrations
python manage.py migrate
# Start the server (defaults to port 8000)
python manage.py runserver
```

### 2. Frontend Setup
Navigate to the `frontend/` directory:
```bash
cd frontend
# Install dependencies
npm install
# Start the Vite development server (defaults to port 5173)
npm run dev
```

## Project Notes

- **Database**: The backend uses SQLite with the database file located at `backend/db.sqlite3`.
- **API Endpoints**: API routes are mounted under `/api/users/` and `/api/websites/`.
- **OAuth**: The frontend currently wraps the app with Google OAuth in `frontend/src/main.tsx`. Replace the default client ID with your own before production use.
- **Payments**: Razorpay keys need to be configured in both backend environment variables and frontend integration files.
