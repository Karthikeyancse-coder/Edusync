/**
 * EduSync — Check actual table schemas
 */
const https = require('https')

const PROJECT_REF = 'zdenaeigbucfexvzvnzk'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZW5hZWlnYnVjZmV4dnp2bnprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ2MzIzNCwiZXhwIjoyMDk2MDM5MjM0fQ.CTYiRNULOkZTM1p5GtTpwBldkk26mgAtzHyFA2j9Sac'

function get(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: `${PROJECT_REF}.supabase.co`,
      path,
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      }
    }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }) }
        catch { resolve({ status: res.statusCode, body: data }) }
      })
    })
    req.on('error', reject)
    req.end()
  })
}

async function main() {
  // Get all users - full row to see columns
  console.log('=== USERS TABLE (first row) ===')
  const u = await get('/rest/v1/users?limit=1')
  console.log('Status:', u.status)
  if (Array.isArray(u.body) && u.body.length > 0) {
    console.log('Columns:', Object.keys(u.body[0]).join(', '))
    console.log('Row:', JSON.stringify(u.body[0], null, 2))
  } else {
    console.log('Response:', JSON.stringify(u.body))
  }

  // Get messages table
  console.log('\n=== MESSAGES TABLE (first row) ===')
  const m = await get('/rest/v1/messages?limit=1')
  console.log('Status:', m.status)
  if (Array.isArray(m.body) && m.body.length > 0) {
    console.log('Columns:', Object.keys(m.body[0]).join(', '))
  } else {
    console.log('Response:', JSON.stringify(m.body))
  }

  // Count all users
  console.log('\n=== ALL USERS ===')
  const all = await get('/rest/v1/users?select=id,name,role,department,unique_id')
  if (Array.isArray(all.body)) {
    console.log(`Total: ${all.body.length} users`)
    all.body.forEach(u => console.log(`  ${u.name} [${u.role}] ${u.unique_id} - ${u.id}`))
  } else {
    console.log(JSON.stringify(all.body))
  }
}

main()
