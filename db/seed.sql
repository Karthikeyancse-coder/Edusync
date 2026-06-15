-- ============================================================
-- EduSync — Full Seed Data (Demo Users + Sample Messages)
-- Run this in your Supabase SQL Editor AFTER messages_migration.sql
-- ============================================================

-- Step 1: Fix RLS on users table to allow public reads
-- (Needed for contacts list to work in demo mode)
drop policy if exists "Public profiles are viewable by everyone" on public.users;
create policy "Public profiles are viewable by everyone" on public.users
  for select using (true);

drop policy if exists "Users can update their own profile" on public.users;
create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

drop policy if exists "Allow insert for authenticated users" on public.users;
create policy "Allow insert for authenticated users" on public.users
  for insert with check (true);


-- Step 2: Fix RLS on messages table to allow demo-mode reads
-- Allow reads if either party matches OR no auth session (demo mode)
drop policy if exists "Users can view their own messages" on public.messages;
create policy "Users can view their own messages" on public.messages
  for select using (
    auth.uid() = sender_id or 
    auth.uid() = receiver_id or
    -- Demo mode: allow reads by looking at the request context
    -- In production, remove the line below
    auth.uid() is null
  );

drop policy if exists "Users can insert messages" on public.messages;
create policy "Users can insert messages" on public.messages
  for insert with check (true);

drop policy if exists "Users can update message status" on public.messages;
create policy "Users can update message status" on public.messages
  for update using (true);

-- Fix notifications RLS
drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications" on public.notifications
  for select using (auth.uid() = user_id or auth.uid() is null);

drop policy if exists "System can insert notifications" on public.notifications;
create policy "System can insert notifications" on public.notifications
  for insert with check (true);


-- Step 3: Insert demo users with STABLE UUIDs
-- These UUIDs are referenced in AuthProvider.tsx
INSERT INTO public.users (id, unique_id, name, email, role, department, is_cr, is_active, avatar_color, created_at)
VALUES
  -- Core 4 demo login users
  ('11111111-1111-1111-1111-111111111111', 'STU-CSE-2024-001', 'Aarav Shah',       'aarav.shah@edusync.edu',     'student',   'Computer Science', false, true, '#7C6FFF', now()),
  ('22222222-2222-2222-2222-222222222222', 'FAC-CSE-001',      'Dr. Sarah Jenkins','s.jenkins@edusync.edu',      'faculty',   'Computer Science', false, true, '#00D4AA', now()),
  ('33333333-3333-3333-3333-333333333333', 'HOD-CSE-001',      'Prof. Alan Turing','a.turing@edusync.edu',       'hod',       'Computer Science', false, true, '#FFB800', now()),
  ('44444444-4444-4444-4444-444444444444', 'PRIN-001',         'Admin Principal',  'principal@edusync.edu',      'principal', 'Administration',   false, true, '#FF4D6D', now()),

  -- Extra sample users for richer demo
  ('55555555-5555-5555-5555-555555555555', 'STU-CSE-2024-002', 'Emma Thompson',    'emma.t@edusync.edu',         'student',   'Computer Science', true,  true, '#06B6D4', now()),
  ('66666666-6666-6666-6666-666666666666', 'STU-PHY-2024-001', 'Michael Chen',     'm.chen@edusync.edu',         'student',   'Physics',          false, true, '#EC4899', now()),
  ('77777777-7777-7777-7777-777777777777', 'HOD-PHY-001',      'Dr. Marie Curie',  'm.curie@edusync.edu',        'hod',       'Physics',          false, true, '#F97316', now()),
  ('88888888-8888-8888-8888-888888888888', 'STU-ENG-2024-001', 'Sarah Connor',     's.connor@edusync.edu',       'student',   'Engineering',      false, true, '#84CC16', now()),
  ('99999999-9999-9999-9999-999999999999', 'STU-MAT-2024-001', 'John Doe',         'j.doe@edusync.edu',          'student',   'Mathematics',      false, true, '#A855F7', now()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'FAC-PHY-001',      'Dr. Richard Feynman','r.feynman@edusync.edu',    'faculty',   'Physics',          false, true, '#14B8A6', now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'FAC-MAT-001',      'Prof. Grace Hopper','g.hopper@edusync.edu',      'faculty',   'Mathematics',      false, true, '#EF4444', now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'STU-CSE-2024-003', 'Priya Patel',      'p.patel@edusync.edu',        'student',   'Computer Science', false, true, '#F59E0B', now()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'STU-CSE-2024-004', 'Rahul Verma',      'r.verma@edusync.edu',        'student',   'Computer Science', false, true, '#6366F1', now())
ON CONFLICT (id) DO UPDATE SET
  name         = EXCLUDED.name,
  email        = EXCLUDED.email,
  role         = EXCLUDED.role,
  department   = EXCLUDED.department,
  is_active    = EXCLUDED.is_active,
  avatar_color = EXCLUDED.avatar_color;


-- Step 4: Insert sample messages between demo users
INSERT INTO public.messages (id, sender_id, receiver_id, content, status, is_read, is_cross_dept, is_locked, created_at)
VALUES

  -- Conversation 1: Dr. Sarah Jenkins (faculty) → Aarav Shah (student)
  ('msg-00000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   'Hi Aarav! Just a reminder that the Data Structures assignment is due this Friday. Please submit it through the portal.', 
   'delivered', true, false, false, now() - interval '2 days'),

  ('msg-00000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
   'Thank you Dr. Jenkins! I have already started working on it. Should the report be in PDF format?', 
   'delivered', true, false, false, now() - interval '2 days' + interval '5 minutes'),

  ('msg-00000003-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   'Yes, PDF format is preferred. Also include a brief README explaining your approach. Good luck!', 
   'delivered', true, false, false, now() - interval '2 days' + interval '10 minutes'),

  ('msg-00000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
   'Got it! One more question — can I use any sorting algorithm or must I use the one taught in class?', 
   'delivered', false, false, false, now() - interval '1 day'),

  ('msg-00000005-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   'You can use any algorithm, but make sure to explain your choice in the report. Bonus marks for optimized solutions!', 
   'delivered', false, false, false, now() - interval '1 day' + interval '3 minutes'),

  -- Conversation 2: Aarav Shah (student) → Emma Thompson (student)
  ('msg-00000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555',
   'Hey Emma! Are you also working on the DS assignment? Want to form a study group?', 
   'delivered', true, false, false, now() - interval '1 day'),

  ('msg-00000007-0000-0000-0000-000000000007', '55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111',
   'Yes! Great idea. Let us meet in the library at 4 PM tomorrow. I have already done the first two sections.', 
   'delivered', true, false, false, now() - interval '1 day' + interval '15 minutes'),

  ('msg-00000008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555',
   'Perfect! I will bring my laptop. Do you need any help with the graph traversal part? That section is tricky.', 
   'delivered', false, false, false, now() - interval '3 hours'),

  -- Conversation 3: Prof. Alan Turing (HOD) → Dr. Sarah Jenkins (faculty)
  ('msg-00000009-0000-0000-0000-000000000009', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222',
   'Dr. Jenkins, please submit the updated syllabus for Data Structures by end of this week. The academic committee needs it.', 
   'delivered', true, false, false, now() - interval '3 days'),

  ('msg-00000010-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333',
   'Understood, Prof. Turing. I will have it ready by Thursday. Should I include the practical lab component as well?', 
   'delivered', true, false, false, now() - interval '3 days' + interval '30 minutes'),

  ('msg-00000011-0000-0000-0000-000000000011', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222',
   'Yes, please include the lab component and assessment breakdowns too. Thank you!', 
   'delivered', false, false, false, now() - interval '3 days' + interval '45 minutes'),

  -- Conversation 4: Prof. Alan Turing (HOD) → Admin Principal (Principal)
  ('msg-00000012-0000-0000-0000-000000000012', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444',
   'Good morning! I wanted to bring to your attention that the CS department lab equipment needs upgrading. I have prepared a detailed proposal.', 
   'delivered', true, false, false, now() - interval '4 days'),

  ('msg-00000013-0000-0000-0000-000000000013', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333',
   'Good morning, Prof. Turing. Please send me the proposal document and I will review it before the next board meeting.', 
   'delivered', true, false, false, now() - interval '4 days' + interval '2 hours'),

  -- Conversation 5: Dr. Sarah Jenkins (faculty) → Admin Principal (Principal) [direct]
  ('msg-00000014-0000-0000-0000-000000000014', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444',
   'Principal, I wanted to inform you that the mid-semester exams have been scheduled for next month. All faculty have been notified.', 
   'delivered', true, false, false, now() - interval '1 day'),

  ('msg-00000015-0000-0000-0000-000000000015', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222',
   'Thank you for the update, Dr. Jenkins. Please ensure all exam halls are booked in advance.', 
   'delivered', false, false, false, now() - interval '1 day' + interval '1 hour'),

  -- Conversation 6: Aarav (student) → Principal - pending approval chain
  ('msg-00000016-0000-0000-0000-000000000016', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444',
   'Respected Principal, I would like to request permission to organize a technical fest next month on behalf of the CS department students.', 
   'pending_faculty', false, false, false, now() - interval '6 hours'),

  -- Conversation 7: Emma Thompson → Dr. Sarah Jenkins
  ('msg-00000017-0000-0000-0000-000000000017', '55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222',
   'Dr. Jenkins, I wanted to thank you for the extra help session yesterday. I understand Graph Algorithms much better now!', 
   'delivered', true, false, false, now() - interval '5 hours'),

  ('msg-00000018-0000-0000-0000-000000000018', '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555',
   'You are very welcome, Emma! Your dedication is commendable. Keep it up for the final exams.', 
   'delivered', false, false, false, now() - interval '4 hours'),

  -- Conversation 8: Priya Patel → Aarav Shah (student to student)
  ('msg-00000019-0000-0000-0000-000000000019', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111',
   'Aarav, did you get the notes from today''s lecture? I missed the last 20 minutes.', 
   'delivered', true, false, false, now() - interval '2 hours'),

  ('msg-00000020-0000-0000-0000-000000000020', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
   'Yes! I will share them with you in the study group chat. We covered dynamic programming and memoization.', 
   'delivered', false, false, false, now() - interval '1 hour 30 minutes'),

  -- Recent messages (today)
  ('msg-00000021-0000-0000-0000-000000000021', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   'Aarav, the class tomorrow has been rescheduled to 10 AM instead of 8 AM. Please inform your classmates.', 
   'delivered', false, false, false, now() - interval '30 minutes'),

  ('msg-00000022-0000-0000-0000-000000000022', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222',
   'Sarah, the department meeting is confirmed for Friday at 2 PM in Conference Room A.', 
   'delivered', false, false, false, now() - interval '15 minutes')

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- DONE! Demo users and sample messages are seeded.
-- ============================================================
-- Summary of seeded data:
--   9 demo users (4 main roles + 5 additional students/faculty/HOD)
--   22 sample messages across 8 conversations
--   All key role pairs represented: student↔student, student↔faculty,
--   faculty↔HOD, HOD↔principal, faculty↔principal
--   1 pending_faculty message to show approval workflow
-- ============================================================
