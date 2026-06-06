'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2, Upload, Download, Search, Filter, TrendingUp, TrendingDown, Minus, ChevronDown, X, Save, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'

type ExamType = 'CIA-1' | 'CIA-2' | 'Model' | 'End-Sem'
const EXAM_TYPES: ExamType[] = ['CIA-1', 'CIA-2', 'Model', 'End-Sem']
const SUBJECTS = ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks', 'Database Systems']
const MAX_MARKS: Record<ExamType, number> = { 'CIA-1': 50, 'CIA-2': 50, 'Model': 100, 'End-Sem': 100 }

type Mark = { [K in ExamType]?: number }
type StudentMark = {
  id: string
  name: string
  roll: string
  marks: Mark
}

const generateStudentMarks = (): StudentMark[] =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `STU-${String(i + 1).padStart(3, '0')}`,
    name: ['Aarav Shah', 'Priya Patel', 'Rahul Verma', 'Sneha Iyer', 'Karan Mehta', 'Anjali Singh',
      'Vikram Rao', 'Deepa Nair', 'Arjun Kumar', 'Meera Pillai', 'Rohan Gupta', 'Lakshmi Reddy',
      'Aditya Sharma', 'Pooja Joshi', 'Suresh Babu', 'Nisha Thomas', 'Ravi Krishnan', 'Divya Menon',
      'Nikhil Jain', 'Sanjana Kulkarni'][i],
    roll: `23CS${String(i + 1).padStart(3, '0')}`,
    marks: {
      'CIA-1': Math.floor(Math.random() * 30) + 20,
      'CIA-2': Math.floor(Math.random() * 30) + 20,
      'Model': Math.floor(Math.random() * 60) + 40,
      'End-Sem': Math.floor(Math.random() * 60) + 40,
    }
  }))

// Personal marks for student view
const personalMarks = [
  { subject: 'Data Structures', 'CIA-1': 42, 'CIA-2': 38, 'Model': 78, 'End-Sem': 82 },
  { subject: 'Algorithms', 'CIA-1': 35, 'CIA-2': 40, 'Model': 68, 'End-Sem': null },
  { subject: 'Operating Systems', 'CIA-1': 47, 'CIA-2': 44, 'Model': 90, 'End-Sem': 88 },
  { subject: 'Computer Networks', 'CIA-1': 28, 'CIA-2': 32, 'Model': 55, 'End-Sem': null },
  { subject: 'Database Systems', 'CIA-1': 45, 'CIA-2': 43, 'Model': 82, 'End-Sem': null },
]

function getGrade(percentage: number): { grade: string; color: string } {
  if (percentage >= 90) return { grade: 'O', color: 'text-emerald-600' }
  if (percentage >= 80) return { grade: 'A+', color: 'text-emerald-500' }
  if (percentage >= 70) return { grade: 'A', color: 'text-blue-500' }
  if (percentage >= 60) return { grade: 'B+', color: 'text-indigo-500' }
  if (percentage >= 50) return { grade: 'B', color: 'text-violet-500' }
  return { grade: 'F', color: 'text-red-500' }
}

export default function MarksPage() {
  const { role } = useAuth()
  const [students, setStudents] = useState<StudentMark[]>(generateStudentMarks)
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0])
  const [selectedExam, setSelectedExam] = useState<ExamType>('CIA-1')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingCell, setEditingCell] = useState<{ id: string; exam: ExamType } | null>(null)
  const [cellValue, setCellValue] = useState('')
  const [saved, setSaved] = useState(false)

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const startEdit = (id: string, exam: ExamType, current?: number) => {
    if (role === 'student') return
    setEditingCell({ id, exam })
    setCellValue(current !== undefined ? String(current) : '')
  }

  const commitEdit = () => {
    if (!editingCell) return
    const val = parseInt(cellValue)
    if (!isNaN(val) && val >= 0 && val <= MAX_MARKS[editingCell.exam]) {
      setStudents(prev => prev.map(s => s.id === editingCell.id
        ? { ...s, marks: { ...s.marks, [editingCell.exam]: val } }
        : s
      ))
    }
    setEditingCell(null)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const getClassAverage = (exam: ExamType) => {
    const vals = students.map(s => s.marks[exam]).filter(v => v !== undefined) as number[]
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Marks & Results</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {role === 'student' ? 'Your academic performance and grades.' : 'Upload and manage exam marks for your class.'}
          </p>
        </div>
        {role !== 'student' && (
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2"><Download size={16} /> Export CSV</Button>
            <Button onClick={handleSave} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              {saved ? '✓ Saved!' : <><Save size={16} /> Save Marks</>}
            </Button>
          </div>
        )}
      </motion.div>

      {/* STUDENT VIEW - Report Card Style */}
      {role === 'student' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EXAM_TYPES.map(exam => {
              const vals = personalMarks.map(s => (s as any)[exam]).filter(Boolean)
              const avg = vals.length ? Math.round(vals.reduce((a: number, b: number) => a + b, 0) / vals.length) : null
              const pct = avg !== null ? Math.round((avg / MAX_MARKS[exam]) * 100) : null
              return (
                <Card key={exam} className="text-center">
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">{exam}</p>
                    {pct !== null ? (
                      <>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{pct}%</p>
                        <p className={cn("text-sm font-bold mt-1", getGrade(pct).color)}>{getGrade(pct).grade}</p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-400 mt-2">Pending</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Detailed Table */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Marks</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Subject</th>
                      {EXAM_TYPES.map(exam => (
                        <th key={exam} className="text-center p-4 text-xs font-semibold text-slate-500 uppercase">
                          {exam}<br />
                          <span className="text-slate-400 font-normal">/{MAX_MARKS[exam]}</span>
                        </th>
                      ))}
                      <th className="text-center p-4 text-xs font-semibold text-slate-500 uppercase">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personalMarks.map((row, i) => {
                      const validMarks = EXAM_TYPES.map(e => (row as any)[e]).filter(Boolean)
                      const maxTotal = EXAM_TYPES.filter(e => (row as any)[e] !== null).reduce((a, e) => a + MAX_MARKS[e], 0)
                      const total = validMarks.reduce((a: number, b: number) => a + b, 0)
                      const pct = maxTotal ? Math.round((total / maxTotal) * 100) : 0
                      const { grade, color } = getGrade(pct)
                      return (
                        <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 font-medium text-slate-900 dark:text-white">{row.subject}</td>
                          {EXAM_TYPES.map(exam => {
                            const val = (row as any)[exam]
                            return (
                              <td key={exam} className="p-4 text-center">
                                {val !== null ? (
                                  <span className={cn("font-semibold", val / MAX_MARKS[exam] < 0.5 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200')}>
                                    {val}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-xs">–</span>
                                )}
                              </td>
                            )
                          })}
                          <td className="p-4 text-center">
                            <span className={cn("font-black text-lg", color)}>{grade}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* FACULTY / HOD / PRINCIPAL VIEW */}
      {role !== 'student' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-end">
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
                <div className="relative flex-1 max-w-xs">
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Search</label>
                  <div className="relative">
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

          {/* Class Average Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EXAM_TYPES.map(exam => {
              const avg = getClassAverage(exam)
              const pct = Math.round((avg / MAX_MARKS[exam]) * 100)
              return (
                <Card key={exam}>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-slate-500 mb-1">{exam} Class Average</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{avg} <span className="text-sm font-normal text-slate-400">/ {MAX_MARKS[exam]}</span></p>
                    <p className={cn("text-sm font-semibold", getGrade(pct).color)}>{pct}% — {getGrade(pct).grade}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Marks Grid Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Student</th>
                      {EXAM_TYPES.map(exam => (
                        <th key={exam} className="text-center p-4 text-xs font-semibold text-slate-500 uppercase">
                          {exam}<br /><span className="text-slate-400 font-normal">/{MAX_MARKS[exam]}</span>
                        </th>
                      ))}
                      <th className="text-center p-4 text-xs font-semibold text-slate-500 uppercase">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => {
                      const totalPct = Math.round(
                        Object.entries(student.marks).reduce((acc, [exam, val]) => acc + (val! / MAX_MARKS[exam as ExamType]) * 100, 0) /
                        Object.keys(student.marks).length
                      )
                      const { grade, color } = getGrade(totalPct)
                      return (
                        <tr key={student.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={student.name} size="sm" />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                                <p className="text-xs text-slate-500">{student.roll}</p>
                              </div>
                            </div>
                          </td>
                          {EXAM_TYPES.map(exam => {
                            const isEditing = editingCell?.id === student.id && editingCell?.exam === exam
                            const val = student.marks[exam]
                            return (
                              <td key={exam} className="p-2 text-center">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    min={0}
                                    max={MAX_MARKS[exam]}
                                    value={cellValue}
                                    onChange={e => setCellValue(e.target.value)}
                                    onBlur={commitEdit}
                                    onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingCell(null) }}
                                    autoFocus
                                    className="w-16 text-center px-2 py-1 rounded-lg border-2 border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none"
                                  />
                                ) : (
                                  <button
                                    onClick={() => startEdit(student.id, exam, val)}
                                    className={cn(
                                      "w-full min-w-[48px] py-1.5 rounded-lg text-sm font-semibold transition-colors hover:ring-2 hover:ring-indigo-400",
                                      val !== undefined
                                        ? (val / MAX_MARKS[exam] < 0.5 ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800')
                                        : 'text-slate-400 bg-slate-50 dark:bg-slate-900'
                                    )}
                                  >
                                    {val !== undefined ? val : '–'}
                                  </button>
                                )}
                              </td>
                            )
                          })}
                          <td className="p-4 text-center">
                            <span className={cn("font-black text-lg", color)}>{grade}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
