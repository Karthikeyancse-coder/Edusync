const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];
const s = createClient(url, key);

async function check() {
  const { data, error } = await s.rpc('run_sql', { sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'announcements'" });
  console.log(data, error);
}
check();
