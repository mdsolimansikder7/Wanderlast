# Wanderlast 🌍

**Wanderlast** is a travel discovery and booking web application built with Next.js, React, and TypeScript. It lets visitors explore featured destinations, view destination details, book trips, and manage their account through a responsive web interface.

**Repository:** https://github.com/mdsolimansikder7/Wanderlast

## ✨ Features

- Browse and discover travel destinations
- View detailed destination pages and featured destinations
- Booking flow and a page for viewing personal bookings
- Sign in and sign up with credentials
- Google OAuth sign-in when configured
- User profile page
- Destination management pages for adding, editing, and deleting destination information
- Responsive UI built from reusable React components
- Backend API integration for destination data, bookings, and login events

## 🧰 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui with Base UI
- **Authentication:** NextAuth.js (Auth.js)
- **Icons:** Lucide React
- **Date utilities:** date-fns
- **Backend:** External REST API (configurable through environment variables)

## 📁 Project Structure

```text
Wanderlast/
├── public/
│   └── images/                # Images and other static assets
├── src/
│   ├── app/                   # Next.js routes and pages
│   │   ├── add-destination/
│   │   ├── api/auth/           # Auth.js route handler
│   │   ├── destination/        # Destination listing and details
│   │   ├── login/
│   │   ├── my-booking/
│   │   ├── profile/
│   │   └── signup/
│   ├── components/            # Shared UI and page sections
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # API helpers and shared data/utilities
│   ├── auth.ts                # Auth.js configuration
│   └── proxy.ts               # Request/session handling
├── .env.example
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (a current LTS release is recommended)
- npm
- Google OAuth credentials if you want Google sign-in
- Access to the Wanderlast backend API, or a backend URL of your own

### 1. Clone the repository

```bash
git clone https://github.com/mdsolimansikder7/Wanderlast.git
cd Wanderlast
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file to a local environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

**macOS/Linux:**

```bash
cp .env.example .env.local
```

Configure the values in `.env.local`:

```env
# Google OAuth (needed only for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API URL
API_URL=https://wanderlust-backend-olive.vercel.app
NEXT_PUBLIC_API_URL=https://wanderlust-backend-olive.vercel.app

# Recommended for Auth.js deployments; use a long, random secret
AUTH_SECRET=replace-with-a-long-random-secret
```

The API helper uses `API_URL` for server-side requests and `NEXT_PUBLIC_API_URL` for browser-side requests. If neither is provided, it falls back to the backend URL configured in `src/lib/api.ts`.

Create Google OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/), and configure the authorized redirect URI to match your Auth.js deployment and Google provider setup. Keep client secrets private.

> **Security:** Never commit `.env.local`, real OAuth credentials, passwords, or other secrets. Keep `.env.example` limited to placeholder values.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server after building |
| `npm run lint` | Run ESLint |

## 🔐 Authentication

Wanderlast uses Auth.js (NextAuth.js) with credentials and Google OAuth providers. Google sign-in requires valid OAuth credentials. The credentials provider and the application’s booking/profile data should be tested alongside the configured backend API.

## 🌐 Deployment

You can deploy the frontend on [Vercel](https://vercel.com/).

1. Import this repository into Vercel.
2. Add the required environment variables in the Vercel project settings.
3. Set `API_URL` and `NEXT_PUBLIC_API_URL` to the backend API origin you intend to use.
4. Configure Google OAuth redirect settings for your deployed domain.
5. Deploy, then test authentication, destination loading, booking, and profile pages.

For details, see the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying).

## 🛣️ Potential Improvements

- Add automated tests for authentication and booking flows
- Expand destination search and filtering
- Improve loading, empty, and error states
- Document the backend API endpoints and deployment configuration

## 👨‍💻 Author

**Md. Soliman Sikder**

- GitHub: [@mdsolimansikder7](https://github.com/mdsolimansikder7)

## 📄 License

No license is currently specified in this repository. Please contact the author before redistributing or reusing the project beyond the permissions granted by GitHub.

---

If you find this project useful, consider giving the repository a ⭐.
