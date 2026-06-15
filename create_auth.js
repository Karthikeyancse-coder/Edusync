const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://zdenaeigbucfexvzvnzk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZW5hZWlnYnVjZmV4dnp2bnprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ2MzIzNCwiZXhwIjoyMDk2MDM5MjM0fQ.CTYiRNULOkZTM1p5GtTpwBldkk26mgAtzHyFA2j9Sac'
);

async function createAuthUsers() {
  const demoUsers = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'aarav.shah@edusync.edu',
      password: 'password123',
      email_confirm: true,
      user_metadata: { role: 'student', name: 'Aarav Shah' }
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      email: 's.jenkins@edusync.edu',
      password: 'password123',
      email_confirm: true,
      user_metadata: { role: 'faculty', name: 'Dr. Sarah Jenkins' }
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'a.turing@edusync.edu',
      password: 'password123',
      email_confirm: true,
      user_metadata: { role: 'hod', name: 'Prof. Alan Turing' }
    }
  ];

  for (const u of demoUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: u.user_metadata
    });
    
    if (error) {
      console.log(`Failed for ${u.email}:`, error.message);
    } else {
      console.log(`Created auth user for ${u.email} with id: ${data.user.id}`);
      // Now update the public.users table to have THIS new auth id instead of the hardcoded one!
      // Wait, if I change the auth id, the messages seeded to 11111111-1111-1111-1111-111111111111 will be orphaned?
      // Supabase admin.createUser does NOT allow specifying a custom UUID.
      console.log('We must update the public.users table and messages table with this new ID:', data.user.id);
    }
  }
}

createAuthUsers();
