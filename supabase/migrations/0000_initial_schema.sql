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