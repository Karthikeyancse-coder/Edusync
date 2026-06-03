const { Client } = require('pg');

// Use the connection string provided earlier, but URL-encode the '@' in the password as '%40'
const connectionString = 'postgresql://postgres:edusync%401234@db.zdenaeigbucfexvzvnzk.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

const sql = `
-- Create extension for UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the users table (we drop the auth.users reference so we don't have dependency issues while setting up)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  unique_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('principal', 'hod', 'faculty', 'student')),
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  avatar_color TEXT DEFAULT '#7C6FFF',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  hod_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  department TEXT,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('faculty_group', 'student_group')),
  principal_auto_added BOOLEAN DEFAULT false,
  hod_auto_added BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES public.users(id) NOT NULL,
  receiver_id UUID REFERENCES public.users(id),
  group_id UUID REFERENCES public.groups(id),
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'pending_faculty', 'pending_hod', 'approved', 'rejected', 'delivered')),
  via_faculty_id UUID REFERENCES public.users(id),
  via_hod_id UUID REFERENCES public.users(id),
  is_locked BOOLEAN DEFAULT false,
  rejection_reason TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create group members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role_in_group TEXT NOT NULL CHECK (role_in_group IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- 6. Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES public.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_role TEXT,
  target_department TEXT,
  total_targets INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  performed_by UUID REFERENCES public.users(id) NOT NULL,
  target_user_id UUID REFERENCES public.users(id),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn off Row Level Security (RLS) temporarily so we can test everything easily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;

-- Insert user safely
INSERT INTO public.users (id, unique_id, name, email, role, is_active)
VALUES (
  '2717998a-0e09-42cc-8b8b-835a1146b481', 
  'PRIN-001', 
  'Admin Principal', 
  'admin@edusync.edu', 
  'principal', 
  true
) ON CONFLICT (id) DO NOTHING;
`;

async function run() {
  try {
    await client.connect();
    console.log("Connected to database successfully");
    await client.query(sql);
    console.log("Schema applied and user inserted successfully!");
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
  }
}

run();
