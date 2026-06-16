'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Shield, BookOpen, Users, MessageSquare,
  Bell, ClipboardList, BarChart2, Calendar, CheckCircle,
  ArrowRight, ChevronRight, Lock, Zap, Globe, Star,
  Building2, UserCheck, Clock, TrendingUp, Award, X,
  CheckSquare, AlertCircle, Search, Crown, Menu
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

/* ─────────────── helpers ─────────────── */
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function CountCard({ value, suffix = '', label, start }: { value: number; suffix?: string; label: string; start: boolean }) {
  const count = useCountUp(value, 1800, start)
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white mb-1">
        {count.toLocaleString()}<span className="text-indigo-400">{suffix}</span>
      </div>
      <div className="text-sm text-slate-400 font-medium">{label}</div>
    </div>
  )
}

/* ─────────────── data ─────────────── */
const features = [
  { icon: MessageSquare, color: 'from-indigo-500 to-violet-600', title: 'Smart Messaging', desc: 'Real-time role-based chat with edit, delete, and WhatsApp-style inbox sorting. Features a 3-tier approval chain for student-to-admin messages.' },
  { icon: Bell, color: 'from-amber-500 to-orange-600', title: 'Announcements', desc: 'Role-scoped broadcasts with real-time sync, 3-second read acknowledgment tracking, and dynamic audience targeting.' },
  { icon: ClipboardList, color: 'from-emerald-500 to-teal-600', title: 'Assignments', desc: 'Faculty publish assignments with deadlines. Students submit files, track status, and receive graded results with feedback.' },
  { icon: BarChart2, color: 'from-blue-500 to-cyan-600', title: 'Marks & Grades', desc: 'Enter marks across 9 exam types. Publish when ready — students see results instantly. Full subject-wise analytics.' },
  { icon: BookOpen, color: 'from-pink-500 to-rose-600', title: 'Attendance', desc: 'Faculty mark attendance per subject. Students track their percentage with colour-coded warnings below 75%.' },
  { icon: Calendar, color: 'from-violet-500 to-purple-600', title: 'Timetable', desc: 'Faculty build weekly schedules. Students see today\'s classes on their dashboard. Principal views any faculty\'s schedule.' },
  { icon: Users, color: 'from-sky-500 to-blue-600', title: 'Group Chats', desc: 'Create subject groups, project teams, or study groups. Principal and HOD auto-added as silent monitors.' },
  { icon: Shield, color: 'from-red-500 to-pink-600', title: 'Admin Panel', desc: 'Principal manages all users, bulk-uploads via CSV, assigns HODs, views audit logs, and handles reports.' },
]

const roles = [
  {
    icon: Crown, color: 'bg-red-500', glow: 'shadow-red-500/30',
    title: 'Principal', id: 'PRIN-001',
    desc: 'Full college oversight. Manage all users, view all departments, broadcast announcements, audit every action.',
    perms: ['Admin panel access', 'College-wide announcements', 'All dept visibility', 'Bulk user management', 'Audit logs'],
  },
  {
    icon: Shield, color: 'bg-amber-500', glow: 'shadow-amber-500/30',
    title: 'Head of Department', id: 'HOD-CSE-001',
    desc: 'Department-level authority. Approve messages from faculty, manage dept students and faculty, post dept announcements.',
    perms: ['Dept-scoped announcements', 'Approve faculty messages', 'Dept attendance overview', 'Faculty workload view'],
  },
  {
    icon: BookOpen, color: 'bg-emerald-500', glow: 'shadow-emerald-500/30',
    title: 'Faculty', id: 'FAC-CSE-001',
    desc: 'Teach and manage academics. Mark attendance, upload marks, create assignments, approve student messages.',
    perms: ['Mark attendance', 'Upload & publish marks', 'Create assignments', 'Approve student messages', 'Create class groups'],
  },
  {
    icon: GraduationCap, color: 'bg-indigo-500', glow: 'shadow-indigo-500/30',
    title: 'Student', id: 'STU-CSE-2024-001',
    desc: 'Access all academic info. View timetable, check attendance, submit assignments, message teachers with approval chain.',
    perms: ['View timetable & marks', 'Submit assignments', 'Track attendance %', 'Approval-chain messaging'],
  },
]

const approvalSteps = [
  { from: 'Student', to: 'Faculty', color: 'bg-indigo-500', label: 'Sends message' },
  { from: 'Faculty', to: 'HOD', color: 'bg-emerald-500', label: 'Approves & forwards' },
  { from: 'HOD', to: 'Principal', color: 'bg-amber-500', label: 'Approves & delivers' },
]

const useCases = [
  { icon: Building2, title: 'Engineering Colleges', desc: 'Manage CSE, ECE, Mech and other departments independently with role isolation.' },
  { icon: Globe, title: 'Multi-Branch Universities', desc: 'Each campus runs independently while the principal gets a unified view.' },
  { icon: UserCheck, title: 'Autonomous Institutions', desc: 'Heavy admin workflows — bulk user creation, CSV uploads, granular RLS policies.' },
  { icon: Clock, title: 'Semester Operations', desc: 'From timetable setup in week 1 to final marks publishing — EduSync covers the full semester.' },
]

const timeline = [
  { phase: 'Week 1', title: 'Semester Setup', desc: 'Principal bulk-uploads students & faculty. HODs assigned. Departments configured.' },
  { phase: 'Week 2', title: 'Timetable & Groups', desc: 'Faculty create weekly schedules. Class groups formed with smart dept/year/section filters.' },
  { phase: 'Ongoing', title: 'Daily Operations', desc: 'Attendance marked daily. Assignments posted. Messages flow through approval chains.' },
  { phase: 'Mid-Sem', title: 'Marks & Feedback', desc: 'Unit tests entered, drafted privately, then published to students with one click.' },
  { phase: 'End-Sem', title: 'Finals & Reports', desc: 'Final exam marks, practicals, internals all recorded. Full audit trail preserved.' },
]

/* ─────────────── main component ─────────────── */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })

  return (
    <div className="min-h-screen bg-[#060611] text-white font-sans overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#060611]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="block select-none">
            <Logo size="sm" forceDarkText />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
            <a href="#why" className="hover:text-white transition-colors">Why EduSync</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#roles" className="hover:text-white transition-colors">Roles</a>
            <a href="#how" className="hover:text-white transition-colors">How it Works</a>
            <a href="#usecases" className="hover:text-white transition-colors">Use Cases</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/login" className="text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95">
              Get Started →
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(v => !v)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-[#060611] px-6 py-4 flex flex-col gap-4">
              {['#why', '#features', '#roles', '#how', '#usecases'].map((href, i) => (
                <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-slate-300 hover:text-white transition-colors capitalize">
                  {['Why EduSync', 'Features', 'Roles', 'How it Works', 'Use Cases'][i]}
                </a>
              ))}
              <Link href="/login" className="mt-2 text-center text-sm font-bold bg-indigo-600 text-white px-5 py-3 rounded-xl">
                Get Started →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTEgMWg1OHY1OEgxVjF6IiBmaWxsPSIjZmZmZmZmMDQiLz48L2c+PC9zdmc+')] opacity-30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <Zap size={12} className="fill-indigo-400" />
            Built for Indian Engineering Colleges
          </motion.div>

          {/* Main headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            The College OS
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Built for Every Role
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            EduSync replaces messy WhatsApp groups, spreadsheet marksheets, and physical registers with one unified platform — from Principal to Student, everything flows through structured, role-aware workflows.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/login" className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95 text-base">
              Try the Live Demo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#why" className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all text-base">
              See How It Works
              <ChevronRight size={16} />
            </a>
          </motion.div>

          {/* Demo role pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 text-xs font-bold">
            {[
              { label: 'Principal', id: 'PRIN-001', color: 'bg-red-500/15 text-red-400 border-red-500/20' },
              { label: 'HOD', id: 'HOD-CSE-001', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
              { label: 'Faculty', id: 'FAC-CSE-001', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
              { label: 'Student', id: 'STU-CSE-2024-001', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20' },
            ].map(r => (
              <Link key={r.label} href="/login"
                className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-full transition-all hover:scale-105 ${r.color}`}>
                <span className="uppercase tracking-wider">{r.label}</span>
                <span className="opacity-60 font-mono text-[10px]">{r.id}</span>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-slate-600 uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 border-2 border-slate-700 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-slate-500 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Why EduSync ── */}
      <section id="why" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel label="The Problem" />
          <motion.h2 {...fadeUp(0)} className="text-4xl md:text-5xl font-black text-center mb-6">
            College Communication is <span className="text-red-400">Broken</span>
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-16">
            Most colleges rely on WhatsApp groups, printed marksheets, physical attendance registers, and email chains. It&apos;s chaotic, untracked, and insecure.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Problems */}
            <motion.div {...fadeUp(0.1)} className="bg-red-950/20 border border-red-500/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <X size={16} className="text-red-400" />
                </div>
                <h3 className="font-bold text-red-400 text-lg">Without EduSync</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Students message teachers on personal WhatsApp — no structure, no audit',
                  'Marksheets maintained in Excel — prone to errors and loss',
                  'Attendance in paper registers — no aggregation, no warnings',
                  'Assignments shared via Google Drive links in group chats',
                  'Principal has zero visibility into daily college operations',
                  'HOD cannot track faculty workload or pending tasks',
                  'No approval chain — sensitive requests go directly without oversight',
                ].map(p => (
                  <li key={p} className="flex items-start gap-3 text-slate-400 text-sm">
                    <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Solutions */}
            <motion.div {...fadeUp(0.2)} className="bg-emerald-950/20 border border-emerald-500/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle size={16} className="text-emerald-400" />
                </div>
                <h3 className="font-bold text-emerald-400 text-lg">With EduSync</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Structured messaging with role-based delivery and approval chain',
                  'Marks entered digitally per exam type, published when ready',
                  'Attendance tracked per subject with live 75% warning alerts',
                  'Assignments published with deadline, submission tracking, grading',
                  'Principal dashboard shows every department health in real-time',
                  'HOD sees faculty pending tasks, at-risk students, approval queue',
                  '3-tier approval chain: Student → Faculty → HOD → Principal',
                ].map(p => (
                  <li key={p} className="flex items-start gap-3 text-slate-400 text-sm">
                    <CheckCircle size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="py-20 border-y border-white/5 bg-indigo-950/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <CountCard value={4}   label="User Roles"        start={statsInView} />
            <CountCard value={18}  label="DB Tables"         start={statsInView} />
            <CountCard value={9}   label="Exam Types"        start={statsInView} />
            <CountCard value={100} suffix="%" label="Role-Isolated Data" start={statsInView} />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionLabel label="Platform Features" />
          <motion.h2 {...fadeUp(0)} className="text-4xl md:text-5xl font-black text-center mb-4">
            Everything a College Needs
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-slate-400 text-center text-lg max-w-xl mx-auto mb-16">
            Eight core modules, tightly integrated, role-aware from the ground up.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp(i * 0.05)}
                className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <f.icon size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section id="roles" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel label="User Roles" />
          <motion.h2 {...fadeUp(0)} className="text-4xl md:text-5xl font-black text-center mb-4">
            Built for Every Stakeholder
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-slate-400 text-center text-lg max-w-xl mx-auto mb-16">
            Four distinct roles — each with their own dashboard, permissions, and workflow.
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-6">
            {roles.map((r, i) => (
              <motion.div key={r.title} {...fadeUp(i * 0.08)}
                className={`relative bg-white/[0.03] border border-white/5 rounded-3xl p-7 hover:border-white/10 transition-all group overflow-hidden`}>
                {/* Glow */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 ${r.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${r.color} rounded-2xl flex items-center justify-center shadow-lg ${r.glow}`}>
                      <r.icon size={22} className="text-white" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                      ID: {r.id}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mb-2">{r.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-5">{r.desc}</p>

                  <div className="space-y-2">
                    {r.perms.map(p => (
                      <div key={p} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckSquare size={13} className="text-indigo-400 shrink-0" />
                        {p}
                      </div>
                    ))}
                  </div>

                  <Link href="/login"
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    Login as {r.title} <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approval Chain ── */}
      <section id="how" className="py-32 bg-gradient-to-b from-transparent via-indigo-950/15 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionLabel label="Approval Workflow" />
          <motion.h2 {...fadeUp(0)} className="text-4xl md:text-5xl font-black text-center mb-4">
            The 3-Tier Approval Chain
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-slate-400 text-center text-lg max-w-xl mx-auto mb-16">
            When a student needs to reach the Principal, the message travels through Faculty and HOD — ensuring accountability at every level.
          </motion.p>

          {/* Chain visual */}
          <motion.div {...fadeUp(0.2)} className="relative">
            <div className="flex flex-col md:flex-row items-center justify-center gap-0">
              {[
                { role: 'Student', id: 'STU-CSE-2024-001', color: 'bg-indigo-500', step: '01', action: 'Sends message' },
                { role: 'Faculty', id: 'FAC-CSE-001', color: 'bg-emerald-500', step: '02', action: 'Reviews & approves' },
                { role: 'HOD', id: 'HOD-CSE-001', color: 'bg-amber-500', step: '03', action: 'Forwards to Principal' },
                { role: 'Principal', id: 'PRIN-001', color: 'bg-red-500', step: '04', action: 'Receives message' },
              ].map((node, i) => (
                <React.Fragment key={node.role}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex flex-col items-center text-center p-6 bg-white/[0.03] border border-white/8 rounded-2xl w-full md:w-44 relative">
                    <span className="text-[10px] font-black text-slate-600 mb-2 uppercase tracking-widest">{node.step}</span>
                    <div className={`w-12 h-12 ${node.color} rounded-full flex items-center justify-center font-black text-white text-sm mb-3 shadow-lg`}>
                      {node.role[0]}
                    </div>
                    <span className="font-bold text-white text-sm mb-1">{node.role}</span>
                    <span className="text-[10px] text-slate-600 font-mono mb-2">{node.id}</span>
                    <span className="text-xs text-slate-400 italic">{node.action}</span>
                  </motion.div>
                  {i < 3 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.1 }}
                      className="hidden md:flex items-center justify-center">
                      <div className="w-10 h-px bg-gradient-to-r from-white/10 to-white/30 mx-1" />
                      <ChevronRight size={16} className="text-slate-600" />
                      <div className="w-10 h-px bg-gradient-to-r from-white/30 to-white/10 mx-1" />
                    </motion.div>
                  )}
                  {i < 3 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.1 }}
                      className="md:hidden flex flex-col items-center py-2">
                      <div className="w-px h-4 bg-white/20" />
                      <ChevronRight size={14} className="text-slate-600 rotate-90" />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Status bubbles */}
            <div className="mt-10 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Live Status Tracking in Chat</p>
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { label: 'Waiting Faculty', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' },
                  { label: 'Faculty Approved', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' },
                  { label: 'Waiting HOD', color: 'bg-amber-500/20 text-amber-400 border-amber-500/20' },
                  { label: 'Delivered', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
                  { label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/20' },
                ].map(s => (
                  <span key={s.label} className={`text-xs font-bold border px-3 py-1 rounded-full ${s.color}`}>{s.label}</span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">Students see real-time chain progress in their message bubble. Each dot fills as approvers act.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Use Cases / Where ── */}
      <section id="usecases" className="py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel label="Where & When" />
          <motion.h2 {...fadeUp(0)} className="text-4xl md:text-5xl font-black text-center mb-4">
            Where EduSync is Used
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-slate-400 text-center text-lg max-w-xl mx-auto mb-16">
            Designed for the structured hierarchy of Indian technical education institutions.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {useCases.map((u, i) => (
              <motion.div key={u.title} {...fadeUp(i * 0.07)}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/20 transition-all group">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                  <u.icon size={18} className="text-indigo-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{u.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{u.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* When — Timeline */}
          <SectionLabel label="When It's Used" />
          <motion.h2 {...fadeUp(0)} className="text-3xl md:text-4xl font-black text-center mb-12">
            A Full Semester, Covered
          </motion.h2>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-violet-500/30 to-transparent" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <motion.div key={t.phase} {...fadeUp(i * 0.08)}
                  className={`relative flex gap-6 items-start ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} pl-12 md:pl-0`}>
                  {/* Dot */}
                  <div className="absolute left-1.5 md:left-1/2 md:-translate-x-1/2 top-1 w-5 h-5 bg-indigo-600 rounded-full border-2 border-indigo-400 shadow-lg shadow-indigo-500/40 z-10" />

                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-2">{t.phase}</span>
                    <h4 className="font-bold text-white text-lg mb-1">{t.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{t.desc}</p>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-slate-600 mb-8">Built With</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { name: 'Next.js 16', color: 'text-white' },
              { name: 'Supabase', color: 'text-emerald-400' },
              { name: 'TypeScript', color: 'text-blue-400' },
              { name: 'Tailwind CSS 4', color: 'text-cyan-400' },
              { name: 'Framer Motion', color: 'text-violet-400' },
              { name: 'Row Level Security', color: 'text-amber-400' },
            ].map(t => (
              <span key={t.name} className={`text-sm font-bold ${t.color} bg-white/5 border border-white/8 px-4 py-2 rounded-xl`}>
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeUp(0)}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <Star size={12} className="fill-indigo-400" />
            Open Source Project
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-black mb-6">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Your College?
            </span>
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Log in with any demo account to explore the full platform — no sign-up required. Experience all 4 roles instantly.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 text-base">
              Launch Demo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://github.com/Karthikeyancse-coder/Edusync" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-slate-300 hover:text-white font-semibold px-10 py-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all text-base">
              View on GitHub
            </a>
          </motion.div>

          {/* Creator Badge */}
          <motion.div {...fadeUp(0.4)} className="mt-28 flex justify-center pb-10">
            <div className="flex flex-col items-center gap-6">
              <span className="text-sm uppercase tracking-[0.3em] text-slate-500 font-bold">Created By</span>
              
              <a href="https://github.com/Karthikeyancse-coder" target="_blank" rel="noopener noreferrer" className="relative group cursor-pointer block rounded-full">
                
                {/* Blurred Ambient Glow */}
                <div className="absolute -inset-1 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 rounded-full overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,theme(colors.red.500),theme(colors.fuchsia.500),theme(colors.blue.500),theme(colors.emerald.500),theme(colors.amber.500),theme(colors.red.500))]" />
                </div>

                {/* Hard RGB Border */}
                <div className="relative p-[3px] rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                  {/* Spinning Gradient */}
                  <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,theme(colors.red.500),theme(colors.fuchsia.500),theme(colors.blue.500),theme(colors.emerald.500),theme(colors.amber.500),theme(colors.red.500))]" />
                  
                  {/* Black Core */}
                  <div className="relative flex items-center gap-6 bg-[#060611] rounded-full pr-12 pl-3 py-3">
                    <img src="https://github.com/Karthikeyancse-coder.png" alt="SK" className="w-20 h-20 rounded-full object-cover z-10 shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
                    <span className="text-4xl font-black text-white tracking-widest drop-shadow-md z-10">SK</span>
                  </div>
                </div>

              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          <Logo size="sm" forceDarkText />
          
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-slate-600 text-center">
              Built for engineering colleges · Next.js + Supabase · Role-based access control
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <Link href="/login" className="hover:text-slate-400 transition-colors">Sign In</Link>
            <a href="https://github.com/Karthikeyancse-coder/Edusync" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ─── Shared helpers ─── */
function SectionLabel({ label }: { label: string }) {
  return (
    <motion.div {...fadeUp(-0.05)} className="flex justify-center mb-4">
      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full">
        {label}
      </span>
    </motion.div>
  )
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, delay },
  }
}
