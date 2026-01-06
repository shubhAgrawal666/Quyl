# Quyl Learning Platform

A full-stack e-learning platform built with React and Node.js that enables users to explore, enroll in, and track progress through various courses. Features admin capabilities for course and user management, OTP-based email verification, and comprehensive progress tracking.

## 🌐 Live Demo

- **Frontend**: [https://quyl-frontend.vercel.app/](https://quyl-frontend.vercel.app/)

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Admin Features](#-admin-features)
- [Deployment](#-deployment)

## ✨ Features

### For Students
- **User Authentication**: Secure registration and login with OTP email verification
- **Course Browsing**: Explore courses by category with search functionality
- **Course Enrollment**: Enroll in courses and track your learning journey
- **Progress Tracking**: Mark lessons as complete and monitor completion percentage
- **Password Recovery**: Reset forgotten passwords via OTP verification
- **Responsive Design**: Seamless experience across desktop and mobile devices

### For Administrators
- **User Management**: View all users, update roles, and manage verification status
- **Course Management**: Create, update, and delete courses with full CRUD operations
- **Lesson Management**: Add, edit, and remove lessons within courses
- **Dashboard Analytics**: View platform statistics including user counts, enrollments, and popular courses
- **Role-Based Access**: Secure admin routes with role verification middleware

### Technical Features
- **Slug-Based URLs**: SEO-friendly course and lesson URLs
- **JWT Authentication**: Secure token-based authentication with HTTP-only cookies
- **Real-time Progress**: Dynamic progress calculation based on completed lessons
- **Email Notifications**: Automated OTP delivery via Nodemailer
- **MongoDB Integration**: Efficient data storage with Mongoose ODM
- **CORS Support**: Configured for cross-origin requests in development and production

## 🛠 Tech Stack

### Frontend
- **Framework**: React
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer (Gmail SMTP)
- **URL Slugs**: slugify

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.19.0 or higher
- **MongoDB**: Atlas account or local MongoDB instance
- **Gmail Account**: For sending OTP emails (with App Password enabled)
- **npm**: v6 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quyl
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

#### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URL=mongodb+srv://<username>:<PASSWORD>@cluster.mongodb.net/
DB_PASS=your_mongodb_password
DB_NAME=quyl

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (Gmail)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password

# Admin Configuration
ADMIN_SECRET_KEY=your_admin_secret_key
```

**Important Notes:**
- Replace `<username>` in `MONGODB_URL` with your MongoDB username
- Generate a strong random string for `JWT_SECRET`
- Use Gmail App Password (not your regular password) for `GMAIL_PASS`
- Set a secure `ADMIN_SECRET_KEY` for admin registration

**Setting up Gmail App Password:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → 2-Step Verification
3. Scroll to "App passwords" and generate a new password
4. Use this 16-character password in `GMAIL_PASS`

#### Frontend Environment Variables

Create a `.env` file in the `client/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:4000

# For production, use:
# VITE_API_URL=https://quyl-backend.vercel.app
```

## 🎮 Running the Application

### Development Mode

**1. Start Backend Server:**
```bash
cd server
npm run server  # Runs with nodemon for hot reload
```
The backend server will start on `http://localhost:4000`

**2. Start Frontend Development Server:**
```bash
cd client
npm run dev     # Runs Vite development server
```
The frontend will start on `http://localhost:5173` (or another available port)

**Note:** Make sure to start the backend before the frontend to ensure API connectivity.

### Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build   # Build for production
```

### Accessing the Application

- **Local Development:**
  - Frontend: `http://localhost:5173`
  - Backend API: `http://localhost:4000/api`

- **Production (Deployed):**
  - Frontend: [https://quyl-frontend.vercel.app/](https://quyl-frontend.vercel.app/)
  - Backend API: [https://quyl-backend.vercel.app/api](https://quyl-backend.vercel.app/api)

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:4000/api`
- **Production**: `https://quyl-backend.vercel.app/api`

### API Health Check
```http
GET /api/health

Response:
{
  "success": true,
  "message": "Backend running on Vercel",
  "timestamp": "2026-01-06T00:00:00.000Z"
}
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "adminKey": "optional_admin_secret" // Include for admin registration
}
```

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "userId": "user_id_from_registration",
  "otp": "123456"
}
```

#### Resend OTP
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "userId": "user_id"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```http
POST /api/auth/logout
```

#### Check Authentication
```http
GET /api/auth/is-auth
Authorization: Bearer <token>
```

#### Send Password Reset OTP
```http
POST /api/auth/send-reset-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

### Course Endpoints

#### Get All Courses
```http
GET /api/courses?category=programming&search=react
```

#### Get Course by Slug
```http
GET /api/courses/:slug
```

#### Create Course (Admin)
```http
POST /api/courses/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "React Fundamentals",
  "description": "Learn React from scratch",
  "category": "Web Development",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "lessons": []
}
```

#### Update Course (Admin)
```http
PUT /api/courses/update/:slug
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Course (Admin)
```http
DELETE /api/courses/delete/:slug
Authorization: Bearer <admin_token>
```

#### Add Lesson (Admin)
```http
POST /api/courses/:slug/lessons/add
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Introduction to React",
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "duration": "15:30"
}
```

#### Update Lesson (Admin)
```http
PUT /api/courses/:slug/lessons/:lessonSlug
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Lesson Title",
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "duration": "20:00"
}
```

#### Delete Lesson (Admin)
```http
DELETE /api/courses/:slug/lessons/:lessonSlug
Authorization: Bearer <admin_token>
```

#### Enroll in Course
```http
POST /api/courses/enroll
Authorization: Bearer <token>
Content-Type: application/json

{
  "slug": "course-slug"
}
```

#### Toggle Lesson Completion
```http
POST /api/courses/toggleLesson
Authorization: Bearer <token>
Content-Type: application/json

{
  "slug": "course-slug",
  "lessonIndex": 0
}
```

#### Get Course Progress
```http
GET /api/courses/progress/:slug
Authorization: Bearer <token>
```

#### Get Enrolled Courses
```http
GET /api/courses/my/enrolled
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get Dashboard Statistics
```http
GET /api/admin/dashboard-stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "totalUsers": 150,
  "totalStudents": 145,
  "totalAdmins": 5,
  "totalCourses": 25,
  "totalEnrollments": 450,
  "verifiedUsers": 140,
  "recentEnrollments": 12,
  "popularCourses": [...]
}
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Get User by ID
```http
GET /api/admin/user/:id
Authorization: Bearer <admin_token>
```

#### Update User Role
```http
PUT /api/admin/update-role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "userId": "user_id",
  "role": "admin" // or "student"
}
```

#### Toggle User Verification
```http
PUT /api/admin/toggle-verification
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "userId": "user_id"
}
```

#### Delete User
```http
DELETE /api/admin/delete-user/:id
Authorization: Bearer <admin_token>
```

## 🔐 Admin Features

### Becoming an Admin

To register as an admin, include the `adminKey` in your registration request:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "securepassword",
  "adminKey": "your_admin_secret_key_from_env"
}
```

### Admin Capabilities

1. **User Management**
   - View all registered users with enrollment details
   - Change user roles (student ↔ admin)
   - Toggle user verification status
   - Delete user accounts (with cascade deletion of enrollments and progress)

2. **Course Management**
   - Create new courses with custom slugs
   - Edit course details (title, description, category, thumbnail)
   - Delete courses (removes all associated enrollments and progress)

3. **Lesson Management**
   - Add lessons to courses with YouTube integration
   - Update lesson information
   - Delete lessons (updates user progress accordingly)

4. **Dashboard Analytics**
   - Total users, students, and admins
   - Course statistics and enrollment counts
   - Recent activity monitoring
   - Popular courses ranking

### Admin Restrictions
- Admins cannot change their own role
- Admins cannot delete their own account
- Admins cannot modify their own verification status
- Unverified admins are automatically downgraded to student role

## 🚀 Deployment

Both frontend and backend are deployed on Vercel.

### Backend Deployment

The backend is configured for serverless deployment with `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Deploy Backend:**
```bash
cd server
vercel --prod
```

**Environment Variables on Vercel:**
Add all environment variables from your `.env` file to Vercel's environment settings:
- `MONGODB_URL`
- `DB_PASS`
- `DB_NAME`
- `JWT_SECRET`
- `GMAIL_USER`
- `GMAIL_PASS`
- `ADMIN_SECRET_KEY`
- `NODE_ENV` (set to "production")

### Frontend Deployment

**Deploy Frontend:**
```bash
cd client
vercel --prod
```

**Frontend Environment Variables:**
Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=https://quyl-backend.vercel.app
```

## 📧 Contact

For questions or support, please contact at [quyl.feedback1@gmail.com](quyl.feedback1@gmail.com).

---

**Built with ❤️ using the MERN Stack**
