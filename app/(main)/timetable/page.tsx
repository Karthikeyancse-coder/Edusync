'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight,
  Pencil, Trash2, X, BookOpen, Trophy, Star, AlertCircle,
  GraduationCap, Users, Megaphone, Building2, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'

/* ─── Constants ─── */
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
const COLORS = ['bg-indigo-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-blue-500', 'bg-teal-500', 'bg-orange-500']

const DEPT_SUBJECTS: Record<string, string[]> = {
  'Computer Science': ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks', 'Database Systems', 'Software Engineering', 'Web Development', 'Machine Learning'],
  'Electronics': ['Digital Electronics', 'Signals & Systems', 'VLSI Design', 'Microprocessors', 'Communication Systems', 'Embedded Systems', 'Control Systems', 'Analog Circuits'],
  'Mechanical': ['Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Manufacturing Processes', 'CAD/CAM', 'Heat Transfer', 'Machine Design', 'Engineering Drawing'],
  'Civil': ['Structural Analysis', 'Geotechnical Engineering', 'Transportation Engineering', 'Fluid Dynamics', 'Construction Management', 'Surveying', 'Environmental Engineering'],
  'Mathematics': ['Calculus', 'Linear Algebra', 'Discrete Mathematics', 'Statistics', 'Numerical Methods', 'Complex Analysis', 'Differential Equations'],
  'Administration': [],
}
const ROOMS = ['Room 401', 'Room 402', 'Room 403', 'Lab 1', 'Lab 2', 'Lab 3', 'Seminar Hall A', 'Seminar Hall B', 'Lecture Hall 1', 'Lecture Hall 2']

/* ─── Dept-based timetable seeds ─── */
const DEPT_SLOTS: Record<string, TimetableSlot[]> = {
  'Computer Science': [
    { id: 101, dept: 'Computer Science', day: 'Monday',    time: '09:00', subject: 'Data Structures',     room: 'Room 401',      faculty: 'Dr. Alan Turing',   duration: 1, color: 'bg-indigo-500' },
    { id: 102, dept: 'Computer Science', day: 'Monday',    time: '11:00', subject: 'Algorithms',            room: 'Lab 1',         faculty: 'Dr. Grace Hopper',  duration: 1, color: 'bg-emerald-500' },
    { id: 103, dept: 'Computer Science', day: 'Tuesday',   time: '09:00', subject: 'Operating Systems',     room: 'Room 402',      faculty: 'Prof. Linus T.',    duration: 2, color: 'bg-violet-500' },
    { id: 104, dept: 'Computer Science', day: 'Wednesday', time: '10:00', subject: 'Computer Networks',     room: 'Room 403',      faculty: 'Dr. Vint Cerf',     duration: 1, color: 'bg-amber-500' },
    { id: 105, dept: 'Computer Software', day: 'Wednesday', time: '14:00', subject: 'Database Systems',     room: 'Lab 2',         faculty: 'Dr. E.F. Codd',     duration: 1, color: 'bg-rose-500' },
    { id: 106, dept: 'Computer Science', day: 'Thursday',  time: '14:00', subject: 'Database Systems',     room: 'Lab 2',         faculty: 'Dr. E.F. Codd',     duration: 1, color: 'bg-rose-500' },
    { id: 107, dept: 'Computer Science', day: 'Friday',    time: '09:00', subject: 'Software Engineering', room: 'Seminar Hall A', faculty: 'Dr. Alan Kay',      duration: 2, color: 'bg-blue-500' },
    { id: 108, dept: 'Computer Science', day: 'Friday',    time: '14:00', subject: 'Web Development',      room: 'Lab 1',         faculty: 'Dr. Tim Berners-Lee', duration: 1, color: 'bg-teal-500' },
  ],
  'Electronics': [
    { id: 201, dept: 'Electronics', day: 'Monday',    time: '09:00', subject: 'Digital Electronics',    room: 'Room 402',      faculty: 'Dr. Jack Kilby',   duration: 1, color: 'bg-blue-500' },
    { id: 202, dept: 'Electronics', day: 'Monday',    time: '11:00', subject: 'Signals & Systems',      room: 'Room 403',      faculty: 'Dr. Claude Shannon', duration: 1, color: 'bg-emerald-500' },
    { id: 203, dept: 'Electronics', day: 'Tuesday',   time: '10:00', subject: 'VLSI Design',            room: 'Lab 3',         faculty: 'Prof. Carver Mead', duration: 2, color: 'bg-violet-500' },
    { id: 204, dept: 'Electronics', day: 'Wednesday', time: '09:00', subject: 'Microprocessors',        room: 'Lab 2',         faculty: 'Dr. Andy Grove',   duration: 1, color: 'bg-amber-500' },
    { id: 205, dept: 'Electronics', day: 'Thursday',  time: '11:00', subject: 'Communication Systems',  room: 'Seminar Hall B', faculty: 'Dr. Nikola Tesla',  duration: 1, color: 'bg-rose-500' },
    { id: 206, dept: 'Electronics', day: 'Friday',    time: '10:00', subject: 'Embedded Systems',       room: 'Lab 1',         faculty: 'Dr. Guido Torvalds', duration: 2, color: 'bg-teal-500' },
  ],
  'Mechanical': [
    { id: 301, dept: 'Mechanical', day: 'Monday',    time: '08:00', subject: 'Thermodynamics',          room: 'Lecture Hall 1', faculty: 'Dr. James Watt',    duration: 1, color: 'bg-orange-500' },
    { id: 302, dept: 'Mechanical', day: 'Monday',    time: '10:00', subject: 'Fluid Mechanics',         room: 'Lab 2',          faculty: 'Dr. Daniel Bernoulli', duration: 2, color: 'bg-blue-500' },
    { id: 303, dept: 'Mechanical', day: 'Tuesday',   time: '09:00', subject: 'Strength of Materials',   room: 'Room 401',       faculty: 'Prof. Euler',       duration: 1, color: 'bg-indigo-500' },
    { id: 304, dept: 'Mechanical', day: 'Wednesday', time: '11:00', subject: 'Manufacturing Processes', room: 'Lab 3',          faculty: 'Dr. Henry Ford',    duration: 1, color: 'bg-emerald-500' },
    { id: 305, dept: 'Mechanical', day: 'Thursday',  time: '09:00', subject: 'CAD/CAM',                room: 'Lab 1',          faculty: 'Dr. Ivan Sutherland', duration: 2, color: 'bg-violet-500' },
    { id: 306, dept: 'Mechanical', day: 'Friday',    time: '10:00', subject: 'Heat Transfer',           room: 'Room 402',       faculty: 'Dr. Fourier',       duration: 1, color: 'bg-rose-500' },
  ],
}

/* ─── Exams (college-wide) ─── */
const initialExams: ExamEntry[] = [
  { id: 1, name: 'Unit Test 1 — All Departments', date: '2026-07-05', startTime: '10:00', endTime: '12:00', room: 'All Rooms', type: 'unit_test', dept: null },
  { id: 2, name: 'Mid Semester Exam — CSE',        date: '2026-08-10', startTime: '09:00', endTime: '12:00', room: 'Lecture Hall 1', type: 'mid_sem', dept: 'Computer Science' },
  { id: 3, name: 'Mid Semester Exam — ECE',        date: '2026-08-11', startTime: '09:00', endTime: '12:00', room: 'Lecture Hall 2', type: 'mid_sem', dept: 'Electronics' },
  { id: 4, name: 'Mid Semester Exam — Mech',       date: '2026-08-12', startTime: '09:00', endTime: '12:00', room: 'Seminar Hall A', type: 'mid_sem', dept: 'Mechanical' },
  { id: 5, name: 'Practical Exam — Lab (CSE)',     date: '2026-08-20', startTime: '14:00', endTime: '17:00', room: 'Lab 1',          type: 'practical', dept: 'Computer Science' },
  { id: 6, name: 'Final Semester Exam',            date: '2026-11-10', startTime: '09:00', endTime: '13:00', room: 'All Halls',      type: 'final', dept: null },
]

/* ─── Events (college-wide) ─── */
const initialEvents: EventEntry[] = [
  { id: 1, title: 'Tech Fest 2026',           date: '2026-07-20', category: 'fest',     desc: '2-day national level technical festival open to all departments.', venue: 'Main Campus Grounds' },
  { id: 2, title: 'Independence Day',          date: '2026-08-15', category: 'holiday',  desc: 'National holiday. No classes.', venue: 'College Auditorium' },
  { id: 3, title: 'Industry Expert Seminar',   date: '2026-07-12', category: 'seminar',  desc: 'Guest lecture by industry leaders from IT sector.', venue: 'Seminar Hall A' },
  { id: 4, title: 'Sports Day',                date: '2026-09-05', category: 'sports',   desc: 'Annual inter-department sports competition.', venue: 'College Grounds' },
  { id: 5, title: 'Cultural Night',            date: '2026-09-20', category: 'cultural', desc: 'Inter-college cultural festival with dance, music, and drama.', venue: 'Open-air Theatre' },
  { id: 6, title: 'Semester End',              date: '2026-11-28', category: 'holiday',  desc: 'End of semester. Results will be published.', venue: 'All departments' },
]

const EXAM_TYPE_COLORS: Record<string, string> = {
  unit_test: 'bg-amber-500',
  mid_sem:   'bg-rose-500',
  practical: 'bg-teal-500',
  final:     'bg-red-600',
}
const EVENT_CATEGORY_COLORS: Record<string, string> = {
  fest:     'bg-violet-500',
  holiday:  'bg-emerald-500',
  seminar:  'bg-blue-500',
  sports:   'bg-orange-500',
  cultural: 'bg-pink-500',
}

/* ─── Types ─── */
interface TimetableSlot {
  id: number; dept: string; day: string; time: string; subject: string
  room: string; faculty: string; duration: number; color: string
}
interface ExamEntry {
  id: number; name: string; date: string; startTime: string
  endTime: string; room: string; type: string; dept: string | null
}
interface EventEntry {
  id: number; title: string; date: string; category: string; desc: string; venue: string
}

type Tab = 'timetable' | 'exams' | 'events'

/* ─── Component ─── */
export default function TimetablePage() {
  const { role, department } = useAuth()
  const canEdit = role === 'faculty' || role === 'hod' || role === 'principal'
  const isPrincipal = role === 'principal'

  /* Tab */
  const [tab, setTab] = useState<Tab>('timetable')

  /* Timetable state */
  const [allSlots, setAllSlots] = useState<TimetableSlot[]>(() => {
    const all: TimetableSlot[] = []
    Object.values(DEPT_SLOTS).forEach(slots => all.push(...slots))
    return all
  })
  const [weekOffset, setWeekOffset] = useState(0)
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null)
  const [selectedDept, setSelectedDept] = useState<string>(department || 'Computer Science')

  /* Exams state */
  const [exams, setExams] = useState<ExamEntry[]>(initialExams)
  const [examFilter, setExamFilter] = useState<string>('all')

  /* Events state */
  const [events, setEvents] = useState<EventEntry[]>(initialEvents)

  /* Modal state */
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false)
  const [isExamModalOpen, setIsExamModalOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null)

  const [slotForm, setSlotForm] = useState({ day: 'Monday', time: '09:00', subject: '', room: '', faculty: '', duration: 1, color: COLORS[0] })
  const [examForm, setExamForm] = useState({ name: '', date: '', startTime: '09:00', endTime: '12:00', room: '', type: 'unit_test', dept: '' })
  const [eventForm, setEventForm] = useState({ title: '', date: '', category: 'seminar', desc: '', venue: '' })

  /* Week dates */
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)
  const weekDates = DAYS.map((_, i) => { const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate() + i); return d })

  /* Dept selection: students/faculty/hod fixed to their dept; principal can switch */
  const effectiveDept = isPrincipal ? selectedDept : (department || 'Computer Science')

  /* Filtered slots for current dept */
  const deptSlots = useMemo(() =>
    allSlots.filter(s => s.dept === effectiveDept),
    [allSlots, effectiveDept]
  )

  const getSlotForCell = (day: string, time: string) =>
    deptSlots.find(s => s.day === day && s.time === time) || null

  const displayDays = viewMode === 'day' ? [selectedDay] : DAYS

  /* Slot handlers */
  const openCreateSlot = () => {
    setEditingSlot(null)
    setSlotForm({ day: 'Monday', time: '09:00', subject: '', room: '', faculty: '', duration: 1, color: COLORS[0] })
    setIsSlotModalOpen(true)
  }
  const openEditSlot = (slot: TimetableSlot) => {
    setEditingSlot(slot)
    setSlotForm({ day: slot.day, time: slot.time, subject: slot.subject, room: slot.room, faculty: slot.faculty, duration: slot.duration, color: slot.color })
    setIsSlotModalOpen(true)
  }
  const handleSaveSlot = () => {
    if (!slotForm.subject || !slotForm.room) return
    if (editingSlot) {
      setAllSlots(prev => prev.map(s => s.id === editingSlot.id ? { ...s, ...slotForm } : s))
    } else {
      setAllSlots(prev => [...prev, { id: Date.now(), dept: effectiveDept, ...slotForm }])
    }
    setIsSlotModalOpen(false)
  }
  const handleDeleteSlot = (id: number) => setAllSlots(prev => prev.filter(s => s.id !== id))

  /* Exam handlers */
  const handleSaveExam = () => {
    if (!examForm.name || !examForm.date) return
    setExams(prev => [...prev, { id: Date.now(), ...examForm, dept: examForm.dept || null }])
    setIsExamModalOpen(false)
    setExamForm({ name: '', date: '', startTime: '09:00', endTime: '12:00', room: '', type: 'unit_test', dept: '' })
  }
  const handleDeleteExam = (id: number) => setExams(prev => prev.filter(e => e.id !== id))

  /* Event handlers */
  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.date) return
    setEvents(prev => [...prev, { id: Date.now(), ...eventForm }])
    setIsEventModalOpen(false)
    setEventForm({ title: '', date: '', category: 'seminar', desc: '', venue: '' })
  }
  const handleDeleteEvent = (id: number) => setEvents(prev => prev.filter(e => e.id !== id))

  /* Visible exams: students/faculty see their dept + college-wide; principal sees all */
  const visibleExams = useMemo(() => {
    if (isPrincipal) return exams
    return exams.filter(e => e.dept === null || e.dept === effectiveDept)
  }, [exams, isPrincipal, effectiveDept])

  const filteredExams = examFilter === 'all' ? visibleExams : visibleExams.filter(e => e.type === examFilter)

  const deptList = Object.keys(DEPT_SUBJECTS)

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-28">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar size={22} className="text-indigo-500" /> Timetable & Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {effectiveDept} · Weekly schedule, exams & events
          </p>
        </div>

        {/* Dept switcher for Principal */}
        {isPrincipal && (
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {deptList.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl mb-6 w-fit">
        {([
          { key: 'timetable', label: 'Timetable', icon: Clock },
          { key: 'exams',     label: 'Exams',     icon: BookOpen },
          { key: 'events',    label: 'Events',    icon: Star },
        ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
              tab === key
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            )}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════════════════ TIMETABLE TAB ══════════════════════ */}
        {tab === 'timetable' && (
          <motion.div key="timetable" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
              <div className="flex gap-2 flex-wrap">
                {/* View mode */}
                <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {(['week', 'day'] as const).map(v => (
                    <button key={v} onClick={() => setViewMode(v)}
                      className={cn('px-4 py-2 text-sm font-medium transition-colors capitalize',
                        viewMode === v ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}>{v}</button>
                  ))}
                </div>
                {/* Week nav */}
                <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                  <button onClick={() => setWeekOffset(w => w - 1)} className="text-slate-400 hover:text-indigo-600 transition-colors"><ChevronLeft size={16} /></button>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[90px] text-center">
                    {weekOffset === 0 ? 'This Week' : weekOffset === 1 ? 'Next Week' : weekOffset === -1 ? 'Last Week' : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
                  </span>
                  <button onClick={() => setWeekOffset(w => w + 1)} className="text-slate-400 hover:text-indigo-600 transition-colors"><ChevronRight size={16} /></button>
                </div>
              </div>
              {canEdit && (
                <Button onClick={openCreateSlot} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm">
                  <Plus size={15} /> Add Slot
                </Button>
              )}
            </div>

            {/* Day selector for Day view */}
            {viewMode === 'day' && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {DAYS.map(day => (
                  <button key={day} onClick={() => setSelectedDay(day)}
                    className={cn('px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border',
                      selectedDay === day
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}>{day}</button>
                ))}
              </div>
            )}

            {/* Grid */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr>
                      <th className="w-20 p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 text-left border-b border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">Time</th>
                      {displayDays.map(day => {
                        const date = viewMode === 'week' ? weekDates[DAYS.indexOf(day)] : null
                        const isToday = date && date.toDateString() === today.toDateString()
                        return (
                          <th key={day} className={cn('p-3 text-xs font-semibold text-center border-b border-r border-slate-200 dark:border-slate-700 last:border-r-0 bg-slate-50 dark:bg-slate-900/50',
                            isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400')}>
                            <div>{day.slice(0, 3)}</div>
                            {date && <div className={cn('text-lg font-bold mt-0.5', isToday ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-200')}>{date.getDate()}</div>}
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map(time => (
                      <tr key={time}>
                        <td className="p-3 text-xs text-slate-500 dark:text-slate-400 border-r border-b border-slate-200 dark:border-slate-700 font-mono bg-slate-50/50 dark:bg-slate-900/30 whitespace-nowrap">{time}</td>
                        {displayDays.map(day => {
                          const slot = getSlotForCell(day, time)
                          return (
                            <td key={`${day}-${time}`} className="border-r border-b border-slate-200 dark:border-slate-700 last:border-r-0 relative p-1 min-h-[60px] align-top">
                              {slot && (
                                <div
                                  className={cn('relative group rounded-lg p-2 cursor-pointer transition-all duration-200 text-white hover:brightness-110 shadow-sm', slot.color)}
                                  onMouseEnter={() => setHoveredSlot(slot.id)}
                                  onMouseLeave={() => setHoveredSlot(null)}
                                >
                                  <p className="text-xs font-semibold truncate">{slot.subject}</p>
                                  <div className="flex items-center gap-1 mt-1 text-white/80 text-[10px]">
                                    <MapPin size={9} /><span className="truncate">{slot.room}</span>
                                  </div>
                                  <div className="text-white/70 text-[10px] truncate mt-0.5">{slot.faculty}</div>
                                  {slot.duration > 1 && (
                                    <div className="text-white/60 text-[10px] mt-0.5 flex items-center gap-1"><Clock size={8} />{slot.duration}h</div>
                                  )}
                                  {canEdit && hoveredSlot === slot.id && (
                                    <div className="absolute top-1 right-1 flex gap-1">
                                      <button onClick={() => openEditSlot(slot)} className="w-5 h-5 bg-white/20 hover:bg-white/40 rounded flex items-center justify-center transition-colors"><Pencil size={10} /></button>
                                      <button onClick={() => handleDeleteSlot(slot.id)} className="w-5 h-5 bg-white/20 hover:bg-red-400/60 rounded flex items-center justify-center transition-colors"><Trash2 size={10} /></button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4">
              {deptSlots.filter((s, i, a) => a.findIndex(x => x.subject === s.subject) === i).map(slot => (
                <div key={slot.subject} className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-sm', slot.color)} />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{slot.subject}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════ EXAMS TAB ══════════════════════ */}
        {tab === 'exams' && (
          <motion.div key="exams" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
              {/* Filter */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'All Exams' },
                  { key: 'unit_test', label: 'Unit Tests' },
                  { key: 'mid_sem',   label: 'Mid Sem' },
                  { key: 'practical', label: 'Practicals' },
                  { key: 'final',     label: 'Finals' },
                ].map(f => (
                  <button key={f.key} onClick={() => setExamFilter(f.key)}
                    className={cn('px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors',
                      examFilter === f.key ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}>{f.label}</button>
                ))}
              </div>
              {canEdit && (
                <Button onClick={() => setIsExamModalOpen(true)} className="gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm">
                  <Plus size={15} /> Schedule Exam
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredExams.sort((a, b) => a.date.localeCompare(b.date)).map((exam, i) => (
                <motion.div key={exam.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-5 hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between mb-3">
                      <span className={cn('text-[10px] font-black uppercase tracking-widest text-white px-2.5 py-1 rounded-full', EXAM_TYPE_COLORS[exam.type] || 'bg-slate-500')}>
                        {exam.type.replace('_', ' ')}
                      </span>
                      {exam.dept ? (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{exam.dept}</span>
                      ) : (
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-full flex items-center gap-1"><Building2 size={9} /> College-wide</span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 leading-snug">{exam.name}</h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar size={12} className="text-indigo-400 shrink-0" />
                        {new Date(exam.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Clock size={12} className="text-emerald-400 shrink-0" />
                        {exam.startTime} – {exam.endTime}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin size={12} className="text-rose-400 shrink-0" />
                        {exam.room}
                      </div>
                    </div>
                    {canEdit && (
                      <button onClick={() => handleDeleteExam(exam.id)}
                        className="mt-3 opacity-0 group-hover:opacity-100 w-full text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1">
                        <Trash2 size={11} /> Remove
                      </button>
                    )}
                  </Card>
                </motion.div>
              ))}
              {filteredExams.length === 0 && (
                <div className="col-span-full text-center py-16 text-slate-400">
                  <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No exams found for this filter.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════ EVENTS TAB ══════════════════════ */}
        {tab === 'events' && (
          <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">College-wide events, fests, seminars &amp; holidays</p>
              {canEdit && (
                <Button onClick={() => setIsEventModalOpen(true)} className="gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm">
                  <Plus size={15} /> Add Event
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.sort((a, b) => a.date.localeCompare(b.date)).map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-5 hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-3">
                      <span className={cn('text-[10px] font-black uppercase tracking-widest text-white px-2.5 py-1 rounded-full', EVENT_CATEGORY_COLORS[event.category] || 'bg-slate-500')}>
                        {event.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{event.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{event.desc}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin size={12} className="text-violet-400 shrink-0" />
                      {event.venue}
                    </div>
                    {canEdit && (
                      <button onClick={() => handleDeleteEvent(event.id)}
                        className="mt-3 opacity-0 group-hover:opacity-100 w-full text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1">
                        <Trash2 size={11} /> Remove
                      </button>
                    )}
                  </Card>
                </motion.div>
              ))}
              {events.length === 0 && (
                <div className="col-span-full text-center py-16 text-slate-400">
                  <Star size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No events planned yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ══ SLOT Modal ══ */}
      <AnimatePresence>
        {isSlotModalOpen && (
          <Modal title={editingSlot ? 'Edit Slot' : 'Add Class Slot'} onClose={() => setIsSlotModalOpen(false)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Day">
                  <select value={slotForm.day} onChange={e => setSlotForm(f => ({ ...f, day: e.target.value }))} className={selectCls}>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </FormField>
                <FormField label="Start Time">
                  <select value={slotForm.time} onChange={e => setSlotForm(f => ({ ...f, time: e.target.value }))} className={selectCls}>
                    {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </FormField>
              </div>
              <FormField label="Subject">
                <select value={slotForm.subject} onChange={e => setSlotForm(f => ({ ...f, subject: e.target.value }))} className={selectCls}>
                  <option value="">Select subject...</option>
                  {(DEPT_SUBJECTS[effectiveDept] || []).map(s => <option key={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="Room">
                <select value={slotForm.room} onChange={e => setSlotForm(f => ({ ...f, room: e.target.value }))} className={selectCls}>
                  <option value="">Select room...</option>
                  {ROOMS.map(r => <option key={r}>{r}</option>)}
                </select>
              </FormField>
              <FormField label="Faculty Name">
                <input value={slotForm.faculty} onChange={e => setSlotForm(f => ({ ...f, faculty: e.target.value }))} placeholder="e.g. Dr. Alan Turing" className={inputCls} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Duration (hrs)">
                  <select value={slotForm.duration} onChange={e => setSlotForm(f => ({ ...f, duration: parseInt(e.target.value) }))} className={selectCls}>
                    {[1, 2, 3].map(d => <option key={d} value={d}>{d}h</option>)}
                  </select>
                </FormField>
                <FormField label="Color">
                  <div className="flex gap-2 flex-wrap pt-1">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setSlotForm(f => ({ ...f, color: c }))}
                        className={cn('w-6 h-6 rounded-full transition-all', c, slotForm.color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110')} />
                    ))}
                  </div>
                </FormField>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" onClick={() => setIsSlotModalOpen(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSaveSlot} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">{editingSlot ? 'Save Changes' : 'Add Slot'}</Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ══ Exam Modal ══ */}
      <AnimatePresence>
        {isExamModalOpen && (
          <Modal title="Schedule Exam" onClose={() => setIsExamModalOpen(false)}>
            <div className="space-y-4">
              <FormField label="Exam Name">
                <input value={examForm.name} onChange={e => setExamForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Unit Test 1 — CSE" className={inputCls} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Date">
                  <input type="date" value={examForm.date} onChange={e => setExamForm(f => ({ ...f, date: e.target.value }))} className={inputCls} />
                </FormField>
                <FormField label="Exam Type">
                  <select value={examForm.type} onChange={e => setExamForm(f => ({ ...f, type: e.target.value }))} className={selectCls}>
                    <option value="unit_test">Unit Test</option>
                    <option value="mid_sem">Mid Semester</option>
                    <option value="practical">Practical</option>
                    <option value="final">Final</option>
                  </select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Time">
                  <input type="time" value={examForm.startTime} onChange={e => setExamForm(f => ({ ...f, startTime: e.target.value }))} className={inputCls} />
                </FormField>
                <FormField label="End Time">
                  <input type="time" value={examForm.endTime} onChange={e => setExamForm(f => ({ ...f, endTime: e.target.value }))} className={inputCls} />
                </FormField>
              </div>
              <FormField label="Room / Venue">
                <input value={examForm.room} onChange={e => setExamForm(f => ({ ...f, room: e.target.value }))} placeholder="e.g. Lecture Hall 1" className={inputCls} />
              </FormField>
              <FormField label="Department (leave blank for college-wide)">
                <select value={examForm.dept} onChange={e => setExamForm(f => ({ ...f, dept: e.target.value }))} className={selectCls}>
                  <option value="">College-wide (all departments)</option>
                  {deptList.map(d => <option key={d}>{d}</option>)}
                </select>
              </FormField>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" onClick={() => setIsExamModalOpen(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSaveExam} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white">Schedule Exam</Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ══ Event Modal ══ */}
      <AnimatePresence>
        {isEventModalOpen && (
          <Modal title="Add Event" onClose={() => setIsEventModalOpen(false)}>
            <div className="space-y-4">
              <FormField label="Event Title">
                <input value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Tech Fest 2026" className={inputCls} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Date">
                  <input type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} className={inputCls} />
                </FormField>
                <FormField label="Category">
                  <select value={eventForm.category} onChange={e => setEventForm(f => ({ ...f, category: e.target.value }))} className={selectCls}>
                    <option value="fest">Fest</option>
                    <option value="seminar">Seminar</option>
                    <option value="holiday">Holiday</option>
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </FormField>
              </div>
              <FormField label="Venue">
                <input value={eventForm.venue} onChange={e => setEventForm(f => ({ ...f, venue: e.target.value }))} placeholder="e.g. Main Grounds" className={inputCls} />
              </FormField>
              <FormField label="Description">
                <textarea value={eventForm.desc} onChange={e => setEventForm(f => ({ ...f, desc: e.target.value }))} rows={3} placeholder="Brief description..." className={inputCls} />
              </FormField>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" onClick={() => setIsEventModalOpen(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSaveEvent} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white">Add Event</Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  )
}

/* ─── Shared modal wrapper ─── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X size={18} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

const selectCls = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
const inputCls  = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
