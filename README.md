# Geez Registration - Cybersecurity Course Registration System

A full-stack application for Geez Security's cybersecurity course registration system. This project includes a Next.js frontend and an Express.js backend.

## Project Structure

```
geez-registration/
├── app/              # Frontend Next.js app routes
├── components/       # React components 
├── styles/           # Global styles
├── public/           # Static assets
└── backend/          # Express.js backend
    ├── src/          # Backend source code
    ├── prisma/       # Prisma schema and migrations
    └── uploads/      # Uploaded files storage
```

## Features

- Interactive course registration form
- Ethiopian payment integration (CBE & TeleBirr)
- Receipt data extraction using Gemini AI
- Coupon system with usage limits
- Payment verification system
- Responsive design for all devices

## Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL or Neon Database account
- Cloudinary account for image storage
- Google Gemini API key for receipt processing

## Getting Started

### Environment Setup

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/geez-registration.git
   cd geez-registration
   ```

2. Install frontend dependencies
   ```bash
   npm install
   ```

3. Install backend dependencies
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. Set up environment variables:
   - Copy `frontend.env.example` to `.env.local` for the frontend
   - Copy `backend/.env.example` to `backend/.env` for the backend

### Database Setup

1. Set up your database (using Neon or local PostgreSQL)
2. Update the `DATABASE_URL` in `backend/.env`
3. Run Prisma migrations:
   ```bash
   cd backend
   npm run prisma:migrate
   npm run seed
   cd ..
   ```

## Development

Run both frontend and backend in development mode:

```bash
# In the project root directory
npm run backend:dev  # In one terminal
npm run dev          # In another terminal
```

Or, if you have concurrently installed:

```bash
npm run dev:all
```

## Production Deployment

1. Build both frontend and backend:
   ```bash
   npm run build:all
   ```

2. Start the servers:
   ```bash
   npm run start:all
   ```

3. For containerized deployment:
   ```bash
   # For the backend
   cd backend
   docker-compose up -d
   ```

## API Documentation

The API endpoints are documented in the backend README.md file. The main endpoints are:

- `/api/register` - Registration management
- `/api/verify-payment` - Payment verification
- `/api/extract-receipt-data` - Receipt data extraction
- `/api/coupons` - Coupon management
- `/api/courses` - Course management

## Technologies Used

### Frontend
- Next.js 15
- React 19
- Tailwind CSS
- shadcn/ui components

### Backend
- Express.js
- Prisma ORM
- PostgreSQL (Neon Database)
- Cloudinary for image storage
- Google Gemini AI for receipt processing

## License

[MIT](LICENSE)

# Geez Registration Frontend

This is the frontend for the Geez Security course registration system. It allows students to browse available cybersecurity courses, register for courses, and verify payments.

## Tech Stack

- Next.js 15
- TypeScript
- TanStack React Query for API integration
- Tailwind CSS for styling
- Shadcn UI components

## API Integration

The frontend connects to the Geez Registration backend API deployed at `https://geez-reg-back.onrender.com/api` (configurable via environment variables).

### Key Features

1. **Course Listing & Details**
   - Fetch and display all available courses
   - Display detailed course information

2. **Course Registration**
   - Multi-step registration form
   - Personal information collection
   - Payment option selection (CBE or TeleBirr)
   - Payment plan options (one-time or two-time payment)

3. **Payment Processing**
   - Receipt data extraction from uploaded images
   - Payment verification
   - Automatic Telegram invite generation upon successful payment

4. **Coupon System**
   - Coupon code validation
   - Automatic price adjustment

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_URL=https://geez-reg-back.onrender.com/api
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Endpoints

The frontend interacts with the following API endpoints:

### Courses
- `GET /courses` - Fetch all courses
- `GET /courses/:idOrSlug` - Fetch a specific course

### Registration
- `POST /register` - Register for a course
- `GET /register/:id` - Get registration details
- `GET /register/email/:email` - Get registrations by email

### Payment Verification
- `POST /verify-payment` - Verify a payment
- `POST /extract-receipt-data` - Extract data from a payment receipt image

### Coupons
- `GET /coupons/:code/validate` - Validate a coupon code

## Frontend Integration Structure

The frontend integration is built using TanStack React Query for efficient data fetching, caching, and state management:

1. **API Client** (`app/lib/api-client.ts`) - Type-safe client for interacting with the backend API

2. **Custom Hooks**:
   - `useGetAllCourses`, `useGetCourse` - For course data
   - `useRegister`, `useGetRegistration` - For registration
   - `useVerifyPayment`, `useExtractReceiptData` - For payment handling
   - `useValidateCoupon` - For coupon validation

3. **Component Integration**:
   - Course listings with loading states
   - Registration form with multi-step validation
   - Real-time API integration for payment processing

## Folder Structure

```
├── app/                  # Next.js app directory
│   ├── course/           # Course pages
│   ├── lib/              # Library code
│   │   ├── api-client.ts # API client
│   │   ├── hooks/        # React Query hooks
│   │   └── providers.tsx # React Query provider
│   └── page.tsx          # Home page
├── components/           # UI components
│   ├── courses-section.tsx      # Course listings
│   ├── course-detail.tsx        # Course detail
│   ├── registration-form.tsx    # Registration form
│   └── ui/                      # UI components
├── public/               # Static assets
└── README.md             # This file
```# geez-security-frontend
