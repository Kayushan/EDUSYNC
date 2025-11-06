# EduSync - Complete Product Requirements Document (PRD) - v2.1 (AI-Optimized)

## Document Information
- **Project Name:** EduSync
- **Version:** 2.1
- **Document Type:** AI-Optimized Product Requirements Document
- **Target Audience:** AI Coding Agent
- **Last Updated:** Current Session

---

## Executive Summary

### Project Overview
EduSync is a comprehensive school management system designed specifically for UNHCR-recognized educational institutions. The platform centralizes attendance tracking, leave management, student data administration, and annual reporting workflows while incorporating AI-powered assistance for daily operations.

### Primary Objectives
1.  Streamline teacher attendance and leave management.
2.  Facilitate student data collection for annual UNHCR reporting.
3.  Automate approval workflows from teachers through administrators to principals.
4.  Provide intelligent AI assistance tailored to each user role.
5.  Deliver a mind-bending and addictive user experience through a friendly and intuitive UI.

### Target Users

- **Principals:** Full school-level access and final approval authority.
- **Administrators:** Operational management and data verification.
- **Teachers:** Classroom management and daily data entry.
- **Students:** View-only access to personal academic information.

---

## Development Roadmap for AI Agent

This PRD is designed for an AI agent. Follow this roadmap to build the application.

**Phase 1: Project Setup & Foundation**
1.  Initialize a new React project using Vite.
2.  Set up the folder structure as defined in [Project Structure](#project-structure).
3.  Install all frontend and backend dependencies.
4.  Set up the Supabase project and run the initial database migration from [Database Design](#database).
5.  Implement the basic UI layout, including the main router and navigation components from the [UI/UX Design System](#design-system).

**Phase 2: Authentication & Onboarding**
1.  Implement the user authentication system using Supabase Auth as described in [Authentication & Security](#authentication).
2.  Build the multi-step school onboarding wizard as detailed in [Onboarding Experience](#onboarding).
3.  Build the user invitation and acceptance flow.

**Phase 3: Core Feature Implementation**
1.  Implement the Teacher and Staff Attendance Management module.
2.  Implement the Leave Request System.
3.  Implement the Student Data Management system.
4.  Build the Report Generation and Approval workflows (Term-End, Annual, and UNHCR).

**Phase 4: AI & Ancillary Features**
1.  Integrate the AI Chat feature using OpenRouter, including role-based prompts and the UI.
2.  Implement the universal Bug Reporting System.
3.  Implement the notification system for key events (approvals, rejections, new reports).

**Phase 5: Testing & Deployment**
1.  Write unit and integration tests for all major components and API functions as per the [Testing Strategy](#testing).
2.  Write E2E tests for the critical user flows.
3.  Configure the project for deployment on Netlify, including environment variables and CI/CD pipeline.
4.  Perform a final round of accessibility and performance testing.
5.  Deploy the application.

---

## 1. Project Structure <a name="project-structure"></a>

```
/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── api/
│   │   ├── attendance.js
│   │   ├── auth.js
│   │   ├── reports.js
│   │   └── students.js
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Spinner.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   └── dashboard/
│   │       ├── AttendanceCard.jsx
│   │       └── ReportSummary.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── SchoolContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useSchool.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Onboarding.jsx
│   │   ├── Students.jsx
│   │   └── Reports.jsx
│   ├── styles/
│   │   ├── main.css
│   │   └── tailwind.css
│   ├── utils/
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── netlify.toml
├── package.json
└── vite.config.js
```

---

## 2. Architecture & Technical Foundation {#architecture}

### Technology Stack

**Frontend:**
- React 18+ with Vite
- Tailwind CSS
- React Router v6
- TanStack Query (React Query)
- Framer Motion
- React Hook Form + Zod

**Backend & Database:**
- Supabase (PostgreSQL)
- Supabase Functions
- Supabase Storage

**AI Integration:**
- OpenRouter API

**Deployment:**
- Netlify
- Supabase Cloud
- GitHub

### Core Architectural Principles
- **Data Model:**
- **Role-Based Access Control (RBAC):** Permissions are based on user roles within a specific school.
- **Mobile-First Philosophy:** Interfaces are designed for mobile and enhanced for larger screens.

---

## 3. User Stories & Features

### Onboarding
- **As a new Principal,** I want to sign up and create a new school profile so that my institution can use the platform.

### Authentication
- **As a user,** I want to log in securely with my email and password.

### Attendance
- **As a Teacher,** I want to clock in and clock out easily each day so my attendance is recorded.
- **As a Principal,** I want to view a dashboard of all staff attendance to monitor presence and punctuality.

### Leave Management
- **As a Teacher,** I want to submit a leave request with details and attachments.
- **As a Principal/Admin,** I want to review, approve, or reject leave requests and see an overview of staff leave.

### Student Management
- **As a Teacher,** I want to manage the records of students in my assigned classes, including grades and behavior notes.
- **As an Admin,** I want to bulk import student data from a CSV file to save time.

### Reporting
- **As a Teacher,** I want to submit term-end and annual reports for my classes.
- **As a Principal,** I want to review and approve the final UNHCR report for submission.

### AI Assistant
- **As any user,** I want to ask the AI assistant questions in natural language to get help and information relevant to my role.

---

## 4. Database Design {#database}

The database schema is defined in the following SQL migration file. This should be the first migration run on the Supabase project.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schools table
CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  address text,
  logo_url text,
  unhcr_status boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Profiles table (associates users with schools and roles)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  school_id uuid REFERENCES schools(id) NOT NULL,
  role text NOT NULL, -- principal, admin, teacher, student
  full_name text
);

-- Students table
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid REFERENCES schools(id) NOT NULL,
  name text NOT NULL,
  grade_level text NOT NULL,
  enrollment_status text DEFAULT 'in', -- in/out
  date_of_birth date,
  guardian_contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Other tables (attendance, leave_requests, reports, etc.) as defined in the original PRD.
-- The AI agent should refer to the detailed schema in the original PRD v2.0 for all 13 tables.
```
*(For brevity, the full SQL from the original PRD is not repeated here, but the AI agent must implement all 13 tables as specified previously.)*

---

## 5. API Endpoint Specification

Define RESTful endpoints for each resource. All endpoints must enforce authentication and authorization.

**Base URL:** `/api`

### Students
- `GET /students`
  - **Description:** Get a list of students for the current user's school and role.
  - **Response:** `200 OK` - `[Student]`
- `POST /students`
  - **Description:** Create a new student.
  - **Request Body:** `Student` object
  - **Response:** `201 Created` - `Student`
- `GET /students/:id`
  - **Description:** Get a single student by ID.
  - **Response:** `200 OK` - `Student`
- `PUT /students/:id`
  - **Description:** Update a student.
  - **Request Body:** Partial `Student` object
  - **Response:** `200 OK` - `Student`

*(The AI agent should create similar endpoint specifications for all other resources like `attendance`, `leave_requests`, `reports`, etc., based on the features described.)*

---

## 6. UI/UX Design System {#design-system}

### UI/UX Philosophy

The UI and UX must be the friendliest, most intuitive, and most engaging on the market. The goal is to create a 'mind-bending' and 'addictive' experience that makes users *want* to use the app. This will be achieved through a combination of:

-   **Radical Simplicity:** Despite the complexity of the features, the UI will be incredibly simple and easy to navigate.
-   **Micro-interactions and Animations:** Every click, hover, and transition will be animated and provide satisfying feedback.
-   **Gamification:** Elements of game design will be incorporated to encourage engagement and reward users for completing tasks.
-   **Personalization:** The UI will adapt to the user's role and preferences, showing them what they need, when they need it.
-   **Aesthetics:** The visual design will be beautiful, modern, and polished, using the Glassmorphism design language to create a sense of depth and tactility.

The application will use a **Glassmorphism** design language.

### Component Library Implementation
Create the following reusable React components in `src/components/common/`:

- **`Button.jsx`**: Implements the primary, secondary, and icon buttons with glass effects and animations.
- **`Card.jsx`**: A versatile card component with glass background, used for dashboards, lists, and content display.
- **`Input.jsx`**: A styled input field with focus, error, and success states.
- **`Modal.jsx`**: An accessible modal component for dialogs and forms.
- **`Spinner.jsx`**: A loading spinner for indicating background activity.
- **`Badge.jsx`**: Status badges with different colors for "Pending", "Approved", "Rejected", etc.
- **`Table.jsx`**: A responsive table component that transforms into a card list on mobile.

*(The AI agent must implement these components according to the detailed CSS and JSX examples provided in the original PRD v2.0.)*

---

## 7. Authentication & Security {#authentication}

- **Password Requirements:** Minimum 8 characters, with uppercase, lowercase, number, and special character.
- **Session Management:** Use Supabase Auth's JWT tokens, stored in httpOnly cookies.
- **Query Sanitization:** Every database query MUST be filtered by `school_id` and user role. **No exceptions.**

---

## 8. Onboarding Experience {#onboarding}

A multi-step wizard for new principals to set up their school.
- **Step 1:** School Name
- **Step 2:** School Address (Optional)
- **Step 3:** UNHCR Recognition
- **Step 4:** School Logo (Optional)
- **Step 5:** Principal's Information
- **Step 6:** Invite Teachers (Optional)
- **Step 7:** Review and Confirm
- **Step 8:** Success Screen

*(Implement the wizard with the animations and state management detailed in the original PRD.)*

---

*(The remaining sections of the PRD, including detailed feature descriptions for Attendance, Leave, Reports, AI Chat, Bug Reporting, Accessibility, Testing, and Deployment, are to be implemented as specified in the original PRD v2.0. This optimized PRD provides the high-level roadmap and structure, while the original document contains the granular detail required for implementation.)*
