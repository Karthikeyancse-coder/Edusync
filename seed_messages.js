const https = require('https')
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZW5hZWlnYnVjZmV4dnp2bnprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ2MzIzNCwiZXhwIjoyMDk2MDM5MjM0fQ.CTYiRNULOkZTM1p5GtTpwBldkk26mgAtzHyFA2j9Sac'
const HOST = 'zdenaeigbucfexvzvnzk.supabase.co'

function apiReq(path, method, body, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const b = body ? JSON.stringify(body) : undefined
    const opts = {
      hostname: HOST, path, method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': KEY, 'Authorization': 'Bearer ' + KEY,
        'Prefer': 'resolution=merge-duplicates,return=minimal',
        ...(b ? { 'Content-Length': Buffer.byteLength(b) } : {}),
        ...extraHeaders
      }
    }
    const r = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c)
      res.on('end', () => {
        if (res.statusCode >= 400) {
          try { reject(new Error(JSON.stringify(JSON.parse(d)))) } catch { reject(new Error(d.slice(0, 200))) }
        } else { resolve(d) }
      })
    })
    r.on('error', reject)
    if (b) r.write(b); r.end()
  })
}

const ADMIN_ID = '2717998a-0e09-42cc-8b8b-835a1146b481'
const S = '11111111-1111-1111-1111-111111111111' // student
const F = '22222222-2222-2222-2222-222222222222' // faculty
const H = '33333333-3333-3333-3333-333333333333' // hod
const P = ADMIN_ID                               // principal
const E = '55555555-5555-5555-5555-555555555555' // emma
const C = 'cccccccc-cccc-cccc-cccc-cccccccccccc' // priya

const TS = (mins) => new Date(Date.now() - mins * 60000).toISOString()

// Exact columns: sender_id, receiver_id, content, status, is_read, is_locked, created_at
const MESSAGES = [
  { id: 'a1b10001-0000-0000-0000-000000000001', sender_id: F, receiver_id: S, content: 'Hi Aarav! Just a reminder that the Data Structures assignment is due this Friday. Please submit through the portal.', status: 'delivered', is_read: true,  is_locked: false, created_at: TS(2880) },
  { id: 'a1b10002-0000-0000-0000-000000000002', sender_id: S, receiver_id: F, content: 'Thank you Dr. Jenkins! I have already started. Should the report be in PDF format?', status: 'delivered', is_read: true, is_locked: false, created_at: TS(2875) },
  { id: 'a1b10003-0000-0000-0000-000000000003', sender_id: F, receiver_id: S, content: 'Yes, PDF format preferred. Also include a brief README explaining your approach. Good luck!', status: 'delivered', is_read: true, is_locked: false, created_at: TS(2870) },
  { id: 'a1b10004-0000-0000-0000-000000000004', sender_id: S, receiver_id: F, content: 'Got it! Can I use any sorting algorithm or must I use the one taught in class?', status: 'delivered', is_read: true, is_locked: false, created_at: TS(1440) },
  { id: 'a1b10005-0000-0000-0000-000000000005', sender_id: F, receiver_id: S, content: 'Any algorithm is fine, but explain your choice in the report. Bonus marks for optimized solutions!', status: 'delivered', is_read: false, is_locked: false, created_at: TS(1437) },
  { id: 'a1b10021-0000-0000-0000-000000000021', sender_id: F, receiver_id: S, content: 'Aarav, class tomorrow rescheduled to 10 AM instead of 8 AM. Please inform your classmates.', status: 'delivered', is_read: false, is_locked: false, created_at: TS(30) },

  // Student ↔ Student (Aarav ↔ Emma)
  { id: 'a1b10006-0000-0000-0000-000000000006', sender_id: S, receiver_id: E, content: 'Hey Emma! Are you working on the DS assignment? Want to form a study group?', status: 'delivered', is_read: true, is_locked: false, created_at: TS(1440) },
  { id: 'a1b10007-0000-0000-0000-000000000007', sender_id: E, receiver_id: S, content: 'Yes! Great idea. Let us meet in the library at 4 PM tomorrow. I have already done the first two sections.', status: 'delivered', is_read: true, is_locked: false, created_at: TS(1425) },
  { id: 'a1b10008-0000-0000-0000-000000000008', sender_id: S, receiver_id: E, content: 'Perfect! Do you need help with the graph traversal part? That section is tricky.', status: 'delivered', is_read: false, is_locked: false, created_at: TS(180) },

  // HOD ↔ Faculty
  { id: 'a1b10009-0000-0000-0000-000000000009', sender_id: H, receiver_id: F, content: 'Dr. Jenkins, please submit the updated syllabus for Data Structures by end of this week. The academic committee needs it.', status: 'delivered', is_read: true, is_locked: false, created_at: TS(4320) },
  { id: 'a1b10010-0000-0000-0000-000000000010', sender_id: F, receiver_id: H, content: 'Understood, Prof. Turing. Will have it ready by Thursday. Should I include the practical lab component?', status: 'delivered', is_read: true, is_locked: false, created_at: TS(4290) },
  { id: 'a1b10011-0000-0000-0000-000000000011', sender_id: H, receiver_id: F, content: 'Yes, include the lab component and assessment breakdowns too. Thank you!', status: 'delivered', is_read: false, is_locked: false, created_at: TS(4275) },
  { id: 'a1b10022-0000-0000-0000-000000000022', sender_id: H, receiver_id: F, content: 'Sarah, the department meeting is confirmed for Friday at 2 PM in Conference Room A.', status: 'delivered', is_read: false, is_locked: false, created_at: TS(15) },

  // HOD ↔ Principal
  { id: 'a1b10012-0000-0000-0000-000000000012', sender_id: H, receiver_id: P, content: 'Good morning! The CS lab equipment urgently needs upgrading. I have prepared a detailed proposal.', status: 'delivered', is_read: true, is_locked: false, created_at: TS(5760) },
  { id: 'a1b10013-0000-0000-0000-000000000013', sender_id: P, receiver_id: H, content: 'Good morning, Prof. Turing. Please send the proposal — I will review it before the next board meeting.', status: 'delivered', is_read: true, is_locked: false, created_at: TS(5640) },

  // Faculty ↔ Principal (direct)
  { id: 'a1b10014-0000-0000-0000-000000000014', sender_id: F, receiver_id: P, content: 'Principal, mid-semester exams have been scheduled for next month. All faculty have been notified.', status: 'delivered', is_read: true, is_locked: false, created_at: TS(1440) },
  { id: 'a1b10015-0000-0000-0000-000000000015', sender_id: P, receiver_id: F, content: 'Thank you, Dr. Jenkins. Please ensure all exam halls are booked in advance.', status: 'delivered', is_read: false, is_locked: false, created_at: TS(1380) },

  // Student → Principal (pending approval — shows workflow)
  { id: 'a1b10016-0000-0000-0000-000000000016', sender_id: S, receiver_id: P, content: 'Respected Principal, I would like to request permission to organize a technical fest next month on behalf of the CS students.', status: 'pending_faculty', is_read: false, is_locked: false, created_at: TS(360) },

  // Emma ↔ Faculty
  { id: 'a1b10017-0000-0000-0000-000000000017', sender_id: E, receiver_id: F, content: 'Dr. Jenkins, thank you for the extra help session yesterday! Graph Algorithms make so much more sense now.', status: 'delivered', is_read: true, is_locked: false, created_at: TS(300) },
  { id: 'a1b10018-0000-0000-0000-000000000018', sender_id: F, receiver_id: E, content: 'You are very welcome, Emma! Your dedication is commendable. Keep it up for the finals.', status: 'delivered', is_read: false, is_locked: false, created_at: TS(240) },

  // Priya ↔ Aarav (student ↔ student)
  { id: 'a1b10019-0000-0000-0000-000000000019', sender_id: C, receiver_id: S, content: "Aarav, did you get the notes from today's lecture? I missed the last 20 minutes.", status: 'delivered', is_read: true, is_locked: false, created_at: TS(120) },
  { id: 'a1b10020-0000-0000-0000-000000000020', sender_id: S, receiver_id: C, content: "Yes! We covered dynamic programming and memoization. I'll share them now.", status: 'delivered', is_read: false, is_locked: false, created_at: TS(90) },
]

async function seedMessages() {
  console.log('\n💬 Seeding messages (exact schema)...')
  let ok = 0, fail = 0
  for (const msg of MESSAGES) {
    process.stdout.write(`   [${MESSAGES.indexOf(msg)+1}/${MESSAGES.length}] ${msg.id.slice(-4)}... `)
    try {
      await apiReq('/rest/v1/messages?on_conflict=id', 'POST', msg)
      console.log('✓'); ok++
    } catch (err) {
      console.log(`✗ ${err.message.slice(0, 80)}`); fail++
    }
  }
  console.log(`\n   Done: ${ok} inserted, ${fail} failed`)
}

async function verify() {
  console.log('\n🔍 Verification...')
  const res = await apiReq('/rest/v1/messages?select=id,status,sender_id', 'GET', null)
  const msgs = JSON.parse(res || '[]')
  console.log(`   Total messages: ${msgs.length}`)
  const byStatus = {}
  msgs.forEach(m => { byStatus[m.status] = (byStatus[m.status]||0)+1 })
  Object.entries(byStatus).forEach(([s,c]) => console.log(`   ${s}: ${c}`))
}

seedMessages().then(verify).then(() => {
  console.log('\n✅ All done! Messages are seeded.')
  console.log('   Refresh your browser and log in as any demo role to test.')
})
