<div align="center">

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=42&pause=1000&color=7C6FFF&center=true&vCenter=true&width=600&height=80&lines=EduSync" alt="EduSync" />

<h3>🎓 The All-in-One College Communication & Management Platform</h3>


[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion)

<br/>

> **EduSync** bridges the gap between students, faculty, HODs, and principals —  
> one premium platform for real-time messaging, attendance, marks, timetables, groups, and more.

</div>

---

## ✨ What is EduSync?

EduSync is a **full-stack college management and communication platform** designed for real educational institutions. It replaces dozens of fragmented tools — WhatsApp groups, spreadsheets, paper registers — with a single, beautiful, role-aware application.

Every user has a **unique EduSync ID**, a verified role, and a personalized dashboard that surfaces exactly what they need — no clutter, no confusion.

---

## 🧑‍🤝‍🧑 Role System

EduSync is built around **4 distinct roles**, each with tailored views, permissions, and controls:

| Role | ID Format | Capabilities |
|---|---|---|
| 🎓 **Student** | `STU-CSE-2024-001` | View marks, attendance, timetable, message faculty, join groups |
| 👩‍🏫 **Faculty** | `FAC-CSE-001` | Post marks, take attendance, manage subject groups, message students |
| 🏛️ **HOD** | `HOD-CSE-001` | Oversee department, approve requests, create department groups |
| 👔 **Principal** | `PRIN-001` | College-wide view, all announcements, inter-department controls |

> 💡 **Demo Mode** — Log in instantly as any role from the login screen with one click. No account needed.

---

## 🚀 Feature Highlights

### 💬 Real-Time Messaging
- WhatsApp-inspired chat UI with **individual & group conversations**
- Message **reply, edit, delete, forward, copy, pin**
- **Voice message** UI, **image attachments**, drag & drop file upload
- **Context menus** (right-click) on messages and contact rows
- Archive, pin, mute, and mark-as-unread per conversation
- **Group Info Panel** — slides in from the right showing member list with EduSync IDs and roles

### 👥 Groups & Classes
- Role-specific **Create Group** modal — Faculty, Student, HOD, and Principal each see different fields
- **Dynamic avatar generator** — pick from 8 preset colors, first letter auto-renders as initials
- Avatar shape varies by role: square (Faculty), rounded (Student), circle (HOD/Principal)
- Filter groups by **all 11 category types**: Subject, Study, Project, Faculty Meeting, Department, Committee, HOD Council, Inter-Department, College-wide, General
- **Go straight to group chat** with one click

### 🪪 EduSync ID System
- Every user has a unique, structured ID visible on their **Profile page**
- Copy-to-clipboard with animated feedback
- Add group members **by ID or name** — search, preview, and add with one click
- Role-aware validation: Students can add Students & Faculty, but not HOD or Principal

### 📊 Dashboard
- Role-personalized stats, at-risk student alerts, quick actions
- Beautiful animated charts and progress bars (Recharts)

### 📋 Marks & Attendance
- Faculty can input CIA / assignment marks per student
- View subject-wise performance breakdown with color-coded progress bars
- Attendance tracking with percentage and status indicators

### 📅 Timetable
- Weekly timetable view per student/faculty
- Period-by-period breakdown with subject and faculty info

### 📢 Announcements
- Role-scoped announcements (Principal → All, HOD → Dept, Faculty → Class)
- Pinnable announcements with rich metadata

### 🗂️ Directory
- Full college directory with search and filter by role/department
- **Message button** in each row — goes directly to that user's chat
- HOD, Faculty, Student, and Principal cards with contact details

### 👤 Profile
- Gradient profile banner, editable personal info, bio
- Role-specific stat cards (GPA, attendance, students taught, etc.)
- **EduSync ID card** with copy button
- Academic performance charts (students)
- Security tab: change password, danger zone

### 📱 Mobile-First Design
- **Custom bottom navigation bar** (mobile only): Dashboard · Messages · Groups · More · Profile
- Responsive layouts across all screen sizes
- Smooth spring animations via Framer Motion throughout

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Server + Client Components) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + custom design tokens |
| **Animations** | Framer Motion 12 |
| **UI Icons** | Lucide React |
| **Charts** | Recharts 3 |
| **Auth & DB** | Supabase (Auth, PostgreSQL) |
| **ORM/Client** | `@supabase/ssr`, `pg` |
| **Utilities** | clsx, tailwind-merge, papaparse |
| **3D/Canvas** | OGL (login page background) |

---

## 🏗️ Project Structure

```
edusync/
├── app/
│   ├── (auth)/              # Login, Register pages
│   └── (main)/              # Protected app pages
│       ├── dashboard/       # Role-personalized home
│       ├── messages/        # Full chat system
│       ├── groups/          # Group management
│       ├── marks/           # Marks & grades
│       ├── attendance/      # Attendance tracking
│       ├── timetable/       # Weekly schedule
│       ├── announcements/   # Broadcast messages
│       ├── directory/       # College-wide user directory
│       ├── profile/         # User profile & EduSync ID
│       ├── admin/           # Admin control panel
│       ├── assignments/     # Assignment management
│       ├── approvals/       # HOD/Principal approval queue
│       └── search/          # Global search
├── components/
│   ├── layout/              # Sidebar, MobileNav, Header
│   ├── dashboard/           # Dashboard widgets
│   └── ui/                  # Reusable UI primitives
├── providers/
│   └── AuthProvider.tsx     # Auth context & demo login
├── lib/
│   └── supabase/            # Supabase client (browser & server)
└── types/                   # Shared TypeScript types
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js `>= 18`
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/Karthikeyancse-coder/Edusync.git
cd Edusync/edusync
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

```bash
node setup_db.js
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on the login page.  
Click any **"Demo Login"** button to instantly explore as Student, Faculty, HOD, or Principal.

---

## 🔐 Demo Login IDs

You can also manually use these IDs in group member searches:

| Role | EduSync ID | Name |
|---|---|---|
| Student | `STU-CSE-2024-001` | Aarav Shah |
| Student | `STU-CSE-2024-002` | Priya Nair |
| Student | `STU-CSE-2024-003` | Rohan Verma |
| Faculty | `FAC-CSE-001` | Dr. Sarah Jenkins |
| Faculty | `FAC-CSE-002` | Prof. Alan Turing |
| HOD | `HOD-CSE-001` | Prof. Alan Turing |
| Principal | `PRIN-001` | Admin Principal |

---

## 🎨 Design Philosophy

EduSync is built to **feel premium from the first glance**:

- 🌗 **Full dark/light mode** — system preference aware
- 🎨 **Glassmorphism** — frosted card surfaces with backdrop blur
- 🌊 **Gradient backgrounds** — dynamic mesh gradients per page
- 💫 **Micro-animations** — every hover, open, and transition is spring-animated
- 🔤 **Modern typography** — clean, readable hierarchy across all breakpoints
- 📐 **Consistent design tokens** — spacing, radius, color, and shadows are unified

---

## 🗺️ Roadmap

- [ ] Real-time message delivery with Supabase Realtime subscriptions
- [ ] Push notifications (PWA)
- [ ] File & document sharing in chat
- [ ] Assignment submission portal with deadline tracking
- [ ] Bulk CSV import for marks and attendance
- [ ] Parent portal (read-only student view)
- [ ] Biometric / OTP-based attendance

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for modern education**

*EduSync — Sync your campus.*

</div>
