/**
 * EduSync — Final DB seed using exact schema from Supabase
 */
const https = require('https')

const PROJECT_REF = 'zdenaeigbucfexvzvnzk'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZW5hZWlnYnVjZmV4dnp2bnprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ2MzIzNCwiZXhwIjoyMDk2MDM5MjM0fQ.CTYiRNULOkZTM1p5GtTpwBldkk26mgAtzHyFA2j9Sac'

function req(path, method, body, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : undefined
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'resolution=merge-duplicates,return=minimal',
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
        ...extraHeaders,
      },
    }
    const r = https.request(options, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        if (res.statusCode >= 400) {
          try { reject(new Error(JSON.stringify(JSON.parse(data)))) }
          catch { reject(new Error(data.slice(0, 200))) }
        } else {
          try { resolve(JSON.parse(data)) }
          catch { resolve(data) }
        }
      })
    })
    r.on('error', reject)
    if (bodyStr) r.write(bodyStr)
    r.end()
  })
}

// Exact schema: id, unique_id, name, email, phone, role, department, is_active, avatar_color, created_at
// Principal already exists: 2717998a-0e09-42cc-8b8b-835a1146b481
const ADMIN_ID = '2717998a-0e09-42cc-8b8b-835a1146b481'

// The 4 demo login IDs — we will keep principal's real UUID and update AuthProvider accordingly
const IDS = {
  student:   '11111111-1111-1111-1111-111111111111',
  faculty:   '22222222-2222-2222-2222-222222222222',
  hod:       '33333333-3333-3333-3333-333333333333',
  principal: ADMIN_ID,  // use the real existing principal UUID
}

const USERS = [
  { id: IDS.student,   unique_id: 'STU-CSE-2024-001', name: 'Aarav Shah',          email: 'aarav.shah@edusync.edu',   role: 'student',   department: 'Computer Science', is_active: true, avatar_color: '#7C6FFF' },
  { id: IDS.faculty,   unique_id: 'FAC-CSE-001',      name: 'Dr. Sarah Jenkins',   email: 's.jenkins@edusync.edu',   role: 'faculty',   department: 'Computer Science', is_active: true, avatar_color: '#00D4AA' },
  { id: IDS.hod,       unique_id: 'HOD-CSE-001',      name: 'Prof. Alan Turing',   email: 'a.turing@edusync.edu',    role: 'hod',       department: 'Computer Science', is_active: true, avatar_color: '#FFB800' },
  { id: '55555555-5555-5555-5555-555555555555', unique_id: 'STU-CSE-2024-002', name: 'Emma Thompson',       email: 'emma.t@edusync.edu',      role: 'student',   department: 'Computer Science', is_active: true, avatar_color: '#06B6D4' },
  { id: '66666666-6666-6666-6666-666666666666', unique_id: 'STU-PHY-2024-001', name: 'Michael Chen',        email: 'm.chen@edusync.edu',      role: 'student',   department: 'Physics',          is_active: true, avatar_color: '#EC4899' },
  { id: '77777777-7777-7777-7777-777777777777', unique_id: 'HOD-PHY-001',      name: 'Dr. Marie Curie',     email: 'm.curie@edusync.edu',     role: 'hod',       department: 'Physics',          is_active: true, avatar_color: '#F97316' },
  { id: '88888888-8888-8888-8888-888888888888', unique_id: 'STU-ENG-2024-001', name: 'Sarah Connor',        email: 's.connor@edusync.edu',    role: 'student',   department: 'Engineering',      is_active: true, avatar_color: '#84CC16' },
  { id: '99999999-9999-9999-9999-999999999999', unique_id: 'STU-MAT-2024-001', name: 'John Doe',            email: 'j.doe@edusync.edu',       role: 'student',   department: 'Mathematics',      is_active: true, avatar_color: '#A855F7' },
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', unique_id: 'FAC-PHY-001',      name: 'Dr. Richard Feynman', email: 'r.feynman@edusync.edu',   role: 'faculty',   department: 'Physics',          is_active: true, avatar_color: '#14B8A6' },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', unique_id: 'FAC-MAT-001',      name: 'Prof. Grace Hopper',  email: 'g.hopper@edusync.edu',    role: 'faculty',   department: 'Mathematics',      is_active: true, avatar_color: '#EF4444' },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', unique_id: 'STU-CSE-2024-003', name: 'Priya Patel',         email: 'p.patel@edusync.edu',     role: 'student',   department: 'Computer Science', is_active: true, avatar_color: '#F59E0B' },
  { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', unique_id: 'STU-CSE-2024-004', name: 'Rahul Verma',         email: 'r.verma@edusync.edu',     role: 'student',   department: 'Computer Science', is_active: true, avatar_color: '#6366F1' },
]

const TS = (mins) => new Date(Date.now() - mins * 60000).toISOString()
const P = IDS.principal

const MESSAGES = [
  // Aarav ↔ Dr. Sarah Jenkins (student ↔ faculty)
  { id: 'a1000001-0000-0000-0000-000000000001', sender_id: IDS.faculty,  receiver_id: IDS.student,  content: 'Hi Aarav! Just a reminder that the Data Structures assignment is due this Friday. Please submit through the portal.', status: 'delivered', is_read: true,  created_at: TS(2880) },
  { id: 'a1000002-0000-0000-0000-000000000002', sender_id: IDS.student,  receiver_id: IDS.faculty,  content: 'Thank you Dr. Jenkins! I have already started. Should the report be in PDF format?', status: 'delivered', is_read: true, created_at: TS(2875) },
  { id: 'a1000003-0000-0000-0000-000000000003', sender_id: IDS.faculty,  receiver_id: IDS.student,  content: 'Yes, PDF format is preferred. Also include a brief README explaining your approach. Good luck!', status: 'delivered', is_read: true, created_at: TS(2870) },
  { id: 'a1000004-0000-0000-0000-000000000004', sender_id: IDS.student,  receiver_id: IDS.faculty,  content: 'Got it! Can I use any sorting algorithm or must I use the one taught in class?', status: 'delivered', is_read: true, created_at: TS(1440) },
  { id: 'a1000005-0000-0000-0000-000000000005', sender_id: IDS.faculty,  receiver_id: IDS.student,  content: 'Any algorithm is fine, but explain your choice in the report. Bonus marks for optimized solutions!', status: 'delivered', is_read: false, created_at: TS(1437) },
  { id: 'a1000021-0000-0000-0000-000000000021', sender_id: IDS.faculty,  receiver_id: IDS.student,  content: 'Aarav, class tomorrow is rescheduled to 10 AM instead of 8 AM. Please inform your classmates.', status: 'delivered', is_read: false, created_at: TS(30) },

  // Aarav ↔ Emma Thompson (student ↔ student)
  { id: 'a1000006-0000-0000-0000-000000000006', sender_id: IDS.student,  receiver_id: '55555555-5555-5555-5555-555555555555', content: 'Hey Emma! Are you working on the DS assignment? Want to form a study group?', status: 'delivered', is_read: true, created_at: TS(1440) },
  { id: 'a1000007-0000-0000-0000-000000000007', sender_id: '55555555-5555-5555-5555-555555555555', receiver_id: IDS.student, content: 'Yes! Great idea. Let us meet in the library at 4 PM tomorrow. I have already done the first two sections.', status: 'delivered', is_read: true, created_at: TS(1425) },
  { id: 'a1000008-0000-0000-0000-000000000008', sender_id: IDS.student,  receiver_id: '55555555-5555-5555-5555-555555555555', content: 'Perfect! Do you need any help with the graph traversal part? That section is tricky.', status: 'delivered', is_read: false, created_at: TS(180) },

  // HOD ↔ Faculty
  { id: 'a1000009-0000-0000-0000-000000000009', sender_id: IDS.hod,      receiver_id: IDS.faculty,  content: 'Dr. Jenkins, please submit the updated syllabus for Data Structures by end of this week. The academic committee needs it.', status: 'delivered', is_read: true, created_at: TS(4320) },
  { id: 'a1000010-0000-0000-0000-000000000010', sender_id: IDS.faculty,  receiver_id: IDS.hod,      content: 'Understood, Prof. Turing. I will have it ready by Thursday. Should I include the practical lab component?', status: 'delivered', is_read: true, created_at: TS(4290) },
  { id: 'a1000011-0000-0000-0000-000000000011', sender_id: IDS.hod,      receiver_id: IDS.faculty,  content: 'Yes, include the lab component and assessment breakdowns too. Thank you!', status: 'delivered', is_read: false, created_at: TS(4275) },
  { id: 'a1000022-0000-0000-0000-000000000022', sender_id: IDS.hod,      receiver_id: IDS.faculty,  content: 'Sarah, the department meeting is confirmed for Friday at 2 PM in Conference Room A.', status: 'delivered', is_read: false, created_at: TS(15) },

  // HOD ↔ Principal
  { id: 'a1000012-0000-0000-0000-000000000012', sender_id: IDS.hod,      receiver_id: P, content: 'Good morning! The CS lab equipment needs upgrading urgently. I have prepared a detailed proposal document.', status: 'delivered', is_read: true, created_at: TS(5760) },
  { id: 'a1000013-0000-0000-0000-000000000013', sender_id: P,             receiver_id: IDS.hod, content: 'Good morning, Prof. Turing. Please send the proposal document — I will review it before the next board meeting.', status: 'delivered', is_read: true, created_at: TS(5640) },

  // Faculty ↔ Principal (direct)
  { id: 'a1000014-0000-0000-0000-000000000014', sender_id: IDS.faculty,  receiver_id: P, content: 'Principal, mid-semester exams have been scheduled for next month. All faculty have been notified.', status: 'delivered', is_read: true, created_at: TS(1440) },
  { id: 'a1000015-0000-0000-0000-000000000015', sender_id: P,             receiver_id: IDS.faculty, content: 'Thank you for the update, Dr. Jenkins. Please ensure all exam halls are booked in advance.', status: 'delivered', is_read: false, created_at: TS(1380) },

  // Student → Principal (pending approval — shows approval workflow)
  { id: 'a1000016-0000-0000-0000-000000000016', sender_id: IDS.student,  receiver_id: P, content: 'Respected Principal, I would like to request permission to organize a technical fest next month on behalf of the CS students.', status: 'pending_faculty', is_read: false, created_at: TS(360) },

  // Emma ↔ Faculty
  { id: 'a1000017-0000-0000-0000-000000000017', sender_id: '55555555-5555-5555-5555-555555555555', receiver_id: IDS.faculty, content: 'Dr. Jenkins, thank you for the extra help session yesterday! I understand Graph Algorithms much better now.', status: 'delivered', is_read: true, created_at: TS(300) },
  { id: 'a1000018-0000-0000-0000-000000000018', sender_id: IDS.faculty,  receiver_id: '55555555-5555-5555-5555-555555555555', content: 'You are very welcome, Emma! Your dedication is commendable. Keep it up for the final exams.', status: 'delivered', is_read: false, created_at: TS(240) },

  // Priya ↔ Aarav (student ↔ student)
  { id: 'a1000019-0000-0000-0000-000000000019', sender_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', receiver_id: IDS.student, content: 'Aarav, did you get the notes from today\'s lecture? I missed the last 20 minutes.', status: 'delivered', is_read: true, created_at: TS(120) },
  { id: 'a1000020-0000-0000-0000-000000000020', sender_id: IDS.student,  receiver_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', content: 'Yes! I\'ll share them — we covered dynamic programming and memoization.', status: 'delivered', is_read: false, created_at: TS(90) },
]

async function upsertBatch(table, rows, label) {
  console.log(`\n${label}`)
  for (const row of rows) {
    const name = row.name ?? row.id.slice(-8)
    process.stdout.write(`   ${name}... `)
    try {
      await req(`/rest/v1/${table}?on_conflict=id`, 'POST', row)
      console.log('✓')
    } catch (err) {
      console.log(`✗ ${err.message.slice(0, 100)}`)
    }
  }
}

async function updatePrincipalId() {
  // Update the existing principal record to use the real UUID
  // No change needed — we ARE using the real UUID (ADMIN_ID)
  console.log(`\n✅ Principal UUID: ${ADMIN_ID} (already in DB)`)
}

async function main() {
  console.log('🚀 EduSync Seed — Exact Schema')
  console.log('================================')
  
  // Update principal UUID in AuthProvider
  await updatePrincipalId()

  await upsertBatch('users', USERS, '👥 Seeding users...')
  await upsertBatch('messages', MESSAGES.map(m => ({
    ...m,
    is_cross_dept: false,
    is_locked: false,
  })), '💬 Seeding messages...')

  // Verify
  console.log('\n🔍 Verification...')
  const u = JSON.parse(await new Promise((res, rej) => {
    const r = https.request({ hostname: `${PROJECT_REF}.supabase.co`, path: '/rest/v1/users?select=name,role', method: 'GET', headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }, resp => {
      let d = ''; resp.on('data', c => d += c); resp.on('end', () => res(d))
    }); r.on('error', rej); r.end()
  }))
  console.log(`   Users in DB: ${u.length}`)
  u.forEach(x => console.log(`     - ${x.name} (${x.role})`))

  const m = JSON.parse(await new Promise((res, rej) => {
    const r = https.request({ hostname: `${PROJECT_REF}.supabase.co`, path: '/rest/v1/messages?select=id', method: 'GET', headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }, resp => {
      let d = ''; resp.on('data', c => d += c); resp.on('end', () => res(d))
    }); r.on('error', rej); r.end()
  }))
  console.log(`   Messages in DB: ${m.length}`)

  console.log('\n✅ Done! You can now run npm run dev and test messaging.')
  console.log('\n⚠️  IMPORTANT: The principal UUID in the real DB is:')
  console.log(`   ${ADMIN_ID}`)
  console.log('   AuthProvider has been updated to use this UUID for principal demo login.')
}

main()
