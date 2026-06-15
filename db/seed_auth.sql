-- Run this script in your Supabase SQL Editor to properly seed the Auth Users for demo logins

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'aarav.shah@edusync.edu', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"student"}', now(), now(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 's.jenkins@edusync.edu', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"faculty"}', now(), now(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'a.turing@edusync.edu', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"hod"}', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
)
VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', format('{"sub":"%s","email":"%s"}', '11111111-1111-1111-1111-111111111111', 'aarav.shah@edusync.edu')::jsonb, 'email', '11111111-1111-1111-1111-111111111111', now(), now(), now()),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', format('{"sub":"%s","email":"%s"}', '22222222-2222-2222-2222-222222222222', 's.jenkins@edusync.edu')::jsonb, 'email', '22222222-2222-2222-2222-222222222222', now(), now(), now()),
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', format('{"sub":"%s","email":"%s"}', '33333333-3333-3333-3333-333333333333', 'a.turing@edusync.edu')::jsonb, 'email', '33333333-3333-3333-3333-333333333333', now(), now(), now())
ON CONFLICT DO NOTHING;
