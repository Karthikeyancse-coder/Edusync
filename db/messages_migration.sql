-- ============================================================
-- EduSync Messaging System — Database Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. MESSAGES TABLE
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references users(id) on delete cascade,
  receiver_id uuid references users(id) on delete set null,
  group_id uuid,  -- for group messages (future)
  content text not null,
  status text not null default 'delivered'
    check (status in ('sent','pending_faculty','pending_hod','approved','rejected','delivered','escalated')),
  via_faculty_id uuid references users(id) on delete set null,
  via_hod_id uuid references users(id) on delete set null,
  rejection_reason text,
  is_read boolean not null default false,
  is_cross_dept boolean not null default false,
  is_locked boolean not null default false,
  escalated_at timestamptz,
  created_at timestamptz not null default now()
);
alter table messages enable row level security;

-- RLS policies for messages
drop policy if exists "Users can view their own messages" on messages;
create policy "Users can view their own messages" on messages
  for select using (
    auth.uid() = sender_id or auth.uid() = receiver_id
  );

drop policy if exists "Users can insert messages" on messages;
create policy "Users can insert messages" on messages
  for insert with check (auth.uid() = sender_id);

drop policy if exists "Users can update message status" on messages;
create policy "Users can update message status" on messages
  for update using (
    auth.uid() = receiver_id or
    auth.uid() = sender_id or
    auth.uid() = via_faculty_id or
    auth.uid() = via_hod_id
  );

-- Enable real-time on messages
alter publication supabase_realtime add table messages;


-- 2. ATTACHMENTS TABLE
create table if not exists attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  file_size bigint not null default 0,
  file_url text not null,
  uploaded_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table attachments enable row level security;

drop policy if exists "Users can view attachments for their messages" on attachments;
create policy "Users can view attachments for their messages" on attachments
  for select using (
    exists (
      select 1 from messages m
      where m.id = attachments.message_id
        and (m.sender_id = auth.uid() or m.receiver_id = auth.uid())
    )
  );

drop policy if exists "Users can insert attachments" on attachments;
create policy "Users can insert attachments" on attachments
  for insert with check (auth.uid() = uploaded_by);


-- 3. CROSS-DEPARTMENT CONNECTIONS TABLE
create table if not exists cross_dept_connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references users(id) on delete cascade,
  target_id uuid not null references users(id) on delete cascade,
  purpose text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique(requester_id, target_id)
);
alter table cross_dept_connections enable row level security;

drop policy if exists "Users can view their connections" on cross_dept_connections;
create policy "Users can view their connections" on cross_dept_connections
  for select using (auth.uid() = requester_id or auth.uid() = target_id);

drop policy if exists "Users can request connections" on cross_dept_connections;
create policy "Users can request connections" on cross_dept_connections
  for insert with check (auth.uid() = requester_id);

drop policy if exists "Target can approve/reject connections" on cross_dept_connections;
create policy "Target can approve/reject connections" on cross_dept_connections
  for update using (auth.uid() = target_id);


-- 4. NOTIFICATIONS TABLE
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null default 'message',
  title text not null,
  body text,
  is_read boolean not null default false,
  related_id uuid,
  created_at timestamptz not null default now()
);
alter table notifications enable row level security;

drop policy if exists "Users can view own notifications" on notifications;
create policy "Users can view own notifications" on notifications
  for select using (auth.uid() = user_id);

drop policy if exists "System can insert notifications" on notifications;
create policy "System can insert notifications" on notifications
  for insert with check (true);

drop policy if exists "Users can mark own notifications read" on notifications;
create policy "Users can mark own notifications read" on notifications
  for update using (auth.uid() = user_id);

-- Enable real-time on notifications
alter publication supabase_realtime add table notifications;


-- 5. INDEXES for performance
create index if not exists idx_messages_sender on messages(sender_id);
create index if not exists idx_messages_receiver on messages(receiver_id);
create index if not exists idx_messages_status on messages(status);
create index if not exists idx_messages_created on messages(created_at);
create index if not exists idx_messages_pending_faculty on messages(status, created_at)
  where status = 'pending_faculty';
create index if not exists idx_notifications_user on notifications(user_id, is_read);

-- ============================================================
-- DONE. All tables created with RLS and real-time enabled.
-- ============================================================
