'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, X, Search, ChevronDown, Users, Calendar, Save, BarChart2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'

const CLASSES = ['CSE-A', 'CSE-B', 'ECE-A', 'MECH-B']
const SUBJECTS = ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks']

type StudentRecord = {
  id: string
  name: string
  roll: string
  overall: number
  present: boolean | null
}

const generateStudents = (): StudentRecord[] =>
  Array.from({ length: 24 }, (_, i) => ({
    id: `STU-${String(i + 1).padStart(3, '0')}`,
    name: ['Aarav Shah', 'Priya Patel', 'Rahul Verma', 'Sneha Iyer', 'Karan Mehta', 'Anjali Singh',
      'Vikram Rao', 'Deepa Nair', 'Arjun Kumar', 'Meera Pillai', 'Rohan Gupta', 'Lakshmi Reddy',
      'Aditya Sharma', 'Pooja Joshi', 'Suresh Babu', 'Nisha Thomas', 'Ravi Krishnan', 'Divya Menon',
      'Nikhil Jain', 'Sanjana Kulkarni', 'Akash Pandey', 'Kavita Yadav', 'Sachin Mishra', 'Uma Chandran'][i],
    roll: `23CS${String(i + 1).padStart(3, '0')}`,
    overall: Math.floor(Math.random() * 40) + 55,
    present: null,
  }))

type AttendanceView = 'mark' | 'overview'

export default function AttendancePage() {
  const { role } = useAuth()
  const [view, setView] = useState<AttendanceView>(role === 'student' ? 'overview' : 'mark')
  const [selectedClass, setSelectedClass] = useState(CLASSES[0])
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0])
  const [students, setStudents] = useState<StudentRecord[]>(generateStudents)
  const [searchQuery, setSearchQuery] = useState('')
  const [saved, setSaved] = useState(false)

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  // Student view – personal attendance data
  const personalAttendance = [
    { subject: 'Data Structures', total: 45, attended: 40, percentage: 89 },
    { subject: 'Algorithms', total: 42, attended: 30, percentage: 71 },
    { subject: 'Operating Systems', total: 40, attended: 38, percentage: 95 },
    { subject: 'Computer Networks', total: 38, attended: 20, percentage: 53 },
    { subject: 'Database Systems', total: 35, attended: 32, percentage: 91 },
  ]

  const overall = Math.round(personalAttendance.reduce((a, b) => a + b.percentage, 0) / personalAttendance.length)

  const getAttendanceColor = (p: number) =>
    p >= 75 ? 'text-emerald-600 dark:text-emerald-400' : p >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'

  const getBarColor = (p: number) =>
    p >= 75 ? 'bg-emerald-500' : p >= 60 ? 'bg-amber-500' : 'bg-red-500'

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const markAll = (status: boolean) => {
    setStudents(prev => prev.map(s => ({ ...s, present: status })))
  }

  const toggle = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, present: !s.present } : s))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const presentCount = students.filter(s => s.present === true).length
  const absentCount = students.filter(s => s.present === false).length
  const unmarkedCount = students.filter(s => s.present === null).length

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{today}</p>
        </div>

        {role !== 'student' && (
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {(['mark', 'overview'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-5 py-2 text-sm font-medium transition-colors capitalize",
                  view === v ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >{v === 'mark' ? 'Mark Attendance' : 'Overview'}</button>
            ))}
          </div>
        )}
      </motion.div>

      {/* STUDENT VIEW */}
      {role === 'student' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Overall Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className={cn(
              "sm:col-span-1 flex flex-col items-center justify-center py-8 border-2",
              overall >= 75 ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-500/5" :
              overall >= 60 ? "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-500/5" :
              "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-500/5"
            )}>
              <div className={cn("text-5xl font-black mb-1", getAttendanceColor(overall))}>{overall}%</div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overall Attendance</p>
              <div className={cn(
                "mt-3 px-3 py-1 rounded-full text-xs font-semibold",
                overall >= 75 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                overall >= 60 ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
              )}>
                {overall >= 75 ? 'On Track' : overall >= 60 ? 'At Risk' : 'Critical – Detain Alert'}
              </div>
            </Card>
            <Card className="sm:col-span-2">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Subject-wise Breakdown</h3>
                <div className="space-y-4">
                  {personalAttendance.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.subject}</span>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-500">{s.attended}/{s.total} classes</span>
                          <span className={cn("font-bold", getAttendanceColor(s.percentage))}>{s.percentage}%</span>
                        </div>
                      </div>
                      <ProgressBar value={s.percentage} height="h-2" color={getBarColor(s.percentage)} />
                      {s.percentage < 75 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                          <AlertTriangle size={11} />
                          Need {Math.ceil((0.75 * s.total - s.attended) / 0.25)} more classes to reach 75%
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* FACULTY / HOD / PRINCIPAL VIEWS */}
      {role !== 'student' && view === 'mark' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Class</label>
                  <select
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CLASSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={e => setSelectedSubject(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex-1 flex items-end gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Present', count: presentCount, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-900/30' },
              { label: 'Absent', count: absentCount, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30' },
              { label: 'Unmarked', count: unmarkedCount, color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
            ].map(stat => (
              <Card key={stat.label} className={cn("border", stat.bg)}>
                <CardContent className="p-4 text-center">
                  <div className={cn("text-2xl font-black", stat.color)}>{stat.count}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mark All Buttons */}
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" onClick={() => markAll(true)} className="gap-2 text-emerald-600 border-emerald-300 hover:bg-emerald-50">
              <CheckSquare size={16} /> Mark All Present
            </Button>
            <Button variant="outline" onClick={() => markAll(false)} className="gap-2 text-red-600 border-red-300 hover:bg-red-50">
              <X size={16} /> Mark All Absent
            </Button>
            <Button onClick={handleSave} className="gap-2 ml-auto bg-indigo-600 hover:bg-indigo-700 text-white">
              {saved ? '✓ Saved!' : <><Save size={16} /> Save Attendance</>}
            </Button>
          </div>

          {/* Student Grid */}
          <Card>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredStudents.map(student => (
                <div
                  key={student.id}
                  onClick={() => toggle(student.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 cursor-pointer transition-colors",
                    student.present === true ? "bg-emerald-50/70 dark:bg-emerald-500/5 hover:bg-emerald-100/70 dark:hover:bg-emerald-500/10" :
                    student.present === false ? "bg-red-50/70 dark:bg-red-500/5 hover:bg-red-100/70 dark:hover:bg-red-500/10" :
                    "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    student.present === true ? "bg-emerald-500 border-emerald-500 text-white" :
                    student.present === false ? "bg-red-500 border-red-500 text-white" :
                    "border-slate-300 dark:border-slate-600"
                  )}>
                    {student.present === true && <CheckSquare size={14} />}
                    {student.present === false && <X size={14} />}
                  </div>
                  <Avatar name={student.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.roll}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", getAttendanceColor(student.overall))}>{student.overall}%</p>
                    <p className="text-xs text-slate-500">Overall</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* OVERVIEW VIEW */}
      {role !== 'student' && view === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Average Attendance', value: '82%', trend: 'good' },
              { label: 'Below 75%', value: '14 students', trend: 'warn' },
              { label: 'Below 60%', value: '3 students', trend: 'danger' },
              { label: 'Perfect (100%)', value: '8 students', trend: 'good' },
            ].map(stat => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className={cn(
                    "text-2xl font-black",
                    stat.trend === 'good' ? 'text-emerald-600' : stat.trend === 'warn' ? 'text-amber-600' : 'text-red-600'
                  )}>{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SUBJECTS.map((subject, i) => {
                  const pct = [84, 71, 92, 65][i] || 80
                  return (
                    <div key={subject}>
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{subject}</span>
                        <span className={cn("font-bold", getAttendanceColor(pct))}>{pct}%</span>
                      </div>
                      <ProgressBar value={pct} height="h-2.5" color={getBarColor(pct)} />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
