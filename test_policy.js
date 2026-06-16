const fs = require('fs');
const https = require('https');

const env = fs.readFileSync('.env.local', 'utf8');
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=https:\/\/(.*)\.supabase\.co/)[1];

function req(q) {
  return new Promise((res) => {
    const r = https.request({
      hostname: url + '.supabase.co',
      path: '/rest/v1/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': 'Bearer ' + key
      }
    }, (rs) => {
      let d = '';
      rs.on('data', c => d += c);
      rs.on('end', () => res(d));
    });
    r.write(JSON.stringify({ query: q }));
    r.end();
  });
}

async function test() {
  const d = await req('create policy "Public profiles" on public.users for select using (true);');
  console.log(d);
}
test();
