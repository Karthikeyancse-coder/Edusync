const https = require('https')
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZW5hZWlnYnVjZmV4dnp2bnprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ2MzIzNCwiZXhwIjoyMDk2MDM5MjM0fQ.CTYiRNULOkZTM1p5GtTpwBldkk26mgAtzHyFA2j9Sac'
const HOST = 'zdenaeigbucfexvzvnzk.supabase.co'

function post(path, body) {
  return new Promise((resolve, reject) => {
    const b = JSON.stringify(body)
    const opts = {
      hostname: HOST, path, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': KEY, 'Authorization': 'Bearer ' + KEY,
        'Content-Length': Buffer.byteLength(b),
        'Prefer': 'return=representation'
      }
    }
    const r = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c)
      res.on('end', () => {
        console.log('Status:', res.statusCode)
        console.log(d.slice(0, 500))
        resolve({ status: res.statusCode, body: d })
      })
    })
    r.on('error', reject)
    r.write(b); r.end()
  })
}

// Test insert with minimal fields
post('/rest/v1/messages', {
  sender_id: '11111111-1111-1111-1111-111111111111',
  receiver_id: '22222222-2222-2222-2222-222222222222',
  content: 'test message to probe schema'
})
