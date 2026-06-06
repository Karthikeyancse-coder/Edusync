'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList, Plus, Clock, Upload, CheckCircle2, XCircle, ChevronDown, X, Paperclip, Search, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'

type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'overdue'

type Assignment = {
  id: number
  subject: string
  title: string
  description: string
  dueDate: string
  maxMarks: number
  submittedCount?: number
  totalStudents?: number
  status?: AssignmentStatus
  submittedAt?: string
  grade?: number
  feedback?: string
}

const studentAssignments: Assignment[] = [
  {
    id: 1, subject: 'Data Structures', title: 'Implement AVL Trees from Scratch',
    description: 'Implement a fully functional AVL tree in C++ with insertion, deletion, and rotation methods. Include time complexity analysis.',
    dueDate: 'Tomorrow, 11:59 PM', maxMarks: 50, status: 'pending'
  },
  {
    id: 2, subject: 'Algorithms', title: 'Dynamic Programming — LCS Problem',
    description: 'Solve the Longest Common Subsequence problem using dynamic programming. Submit both the code and a written explanation.',
    dueDate: 'In 3 days', maxMarks: 30, status: 'submitted', submittedAt: '2 days ago'
  },
  {
    id: 3, subject: 'Operating Systems', title: 'Process Scheduling Simulation',
    description: 'Simulate FCFS, SJF, and Round Robin scheduling algorithms and compare their performance metrics.',
    dueDate: '3 days ago', maxMarks: 40, status: 'graded', grade: 36, feedback: 'Good implementation! Minor issues with the Round Robin time quantum.'
  },
  {
    id: 4, subject: 'Computer Networks', title: 'TCP/IP Wireshark Analysis',
    description: 'Capture and analyze at least 200 packets using Wireshark. Document your findings in a report.',
    dueDate: '1 week ago', maxMarks: 25, status: 'overdue'
  },
]

const facultyAssignments: Assignment[] = [
  {
    id: 1, subject: 'Data Structures', title: 'Implement AVL Trees from Scratch',
    description: 'Implement a fully functional AVL tree in C++ with insertion, deletion, and rotation methods.',
    dueDate: 'Tomorrow, 11:59 PM', maxMarks: 50, submittedCount: 18, totalStudents: 42
  },
  {
    id: 2, subject: 'Algorithms', title: 'Dynamic Programming — LCS Problem',
    description: 'Solve the Longest Common Subsequence problem using dynamic programming.',
    dueDate: 'In 3 days', maxMarks: 30, submittedCount: 35, totalStudents: 42
  },
  {
    id: 3, subject: 'Operating Systems', title: 'Process Scheduling Simulation',
    description: 'Simulate FCFS, SJF, and Round Robin scheduling algorithms.',
    dueDate: '3 days ago', maxMarks: 40, submittedCount: 42, totalStudents: 42
  },
]

const STATUS_CONFIG: Record<AssignmentStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-500/20', icon: Clock },
  submitted: { label: 'Submitted', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-500/20', icon: CheckCircle2 },
  graded: { label: 'Graded', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/20', icon: CheckCircle2 },
  overdue: { label: 'Overdue', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-500/20', icon: XCircle },
}

export default function AssignmentsPage() {
  const { role } = useAuth()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [submitModalId, setSubmitModalId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [newAssignment, setNewAssignment] = useState({
    subject: 'Data Structures', title: '', description: '', dueDate: '', maxMarks: 50
  })
  const [assignments, setAssignments] = useState<Assignment[]>(
    role === 'student' ? studentAssignments : facultyAssignments
  )

  const SUBJECTS = ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks']

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || (a.status === statusFilter.toLowerCase())
    return matchesSearch && matchesStatus
  })

  const handleCreate = () => {
    if (!newAssignment.title || !newAssignment.dueDate) return
    setAssignments(prev => [{
      id: Date.now(),
      ...newAssignment,
      submittedCount: 0,
      totalStudents: 42,
    }, ...prev])
    setIsCreateModalOpen(false)
    setNewAssignment({ subject: 'Data Structures', title: '', description: '', dueDate: '', maxMarks: 50 })
  }

  const handleSubmit = (id: number) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'submitted' as const, submittedAt: 'Just now' } : a))
    setSubmitModalId(null)
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assignments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {role === 'student' ? 'Your tasks and submission status.' : 'Create and manage assignments for your class.'}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          {role !== 'student' && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus size={16} /> New Assignment
            </Button>
          )}
        </div>
      </motion.div>

      {/* Status Filter Tabs (Student view) */}
      {role === 'student' && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {['All', 'Pending', 'Submitted', 'Graded', 'Overdue'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                statusFilter === status
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >{status}</button>
          ))}
        </div>
      )}

      {/* Assignments List */}
      <motion.div className="space-y-4">
        <AnimatePresence>
          {filteredAssignments.map(assignment => {
            const isExpanded = expandedId === assignment.id
            const statusConf = assignment.status ? STATUS_CONFIG[assignment.status] : null
            const submissionProgress = assignment.submittedCount !== undefined
              ? Math.round((assignment.submittedCount! / assignment.totalStudents!) * 100)
              : null

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <Card className={cn(
                  "overflow-hidden transition-shadow hover:shadow-md",
                  assignment.status === 'overdue' && "border-red-200 dark:border-red-900/30"
                )}>
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
                            {assignment.subject}
                          </span>
                          {statusConf && (
                            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1", statusConf.color, statusConf.bg)}>
                              <statusConf.icon size={12} />
                              {statusConf.label}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{assignment.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                          <div className="flex items-center gap-1"><Clock size={12} /> Due: {assignment.dueDate}</div>
                          <div className="font-medium">Max: {assignment.maxMarks} marks</div>
                          {assignment.grade !== undefined && (
                            <div className="font-bold text-emerald-600">Score: {assignment.grade}/{assignment.maxMarks}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Faculty: submission progress */}
                        {submissionProgress !== null && (
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{assignment.submittedCount}/{assignment.totalStudents}</p>
                            <p className="text-xs text-slate-500">submitted</p>
                          </div>
                        )}
                        {/* Student: Submit button */}
                        {role === 'student' && assignment.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={e => { e.stopPropagation(); setSubmitModalId(assignment.id) }}
                            className="gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                          >
                            <Upload size={13} /> Submit
                          </Button>
                        )}
                        <ChevronDown
                          size={18}
                          className={cn("text-slate-400 transition-transform", isExpanded && "rotate-180")}
                        />
                      </div>
                    </div>

                    {/* Submission progress bar for faculty */}
                    {submissionProgress !== null && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Submissions</span>
                          <span>{submissionProgress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${submissionProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100 dark:border-slate-800"
                      >
                        <div className="p-5 space-y-4">
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Description</h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{assignment.description}</p>
                          </div>

                          {assignment.feedback && (
                            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-900/30">
                              <h4 className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase mb-1">Faculty Feedback</h4>
                              <p className="text-sm text-emerald-800 dark:text-emerald-300">{assignment.feedback}</p>
                            </div>
                          )}

                          {role !== 'student' && (
                            <div className="flex gap-3">
                              <Button variant="outline" size="sm" className="gap-2">
                                <Eye size={14} /> View Submissions
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                                <X size={14} /> Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredAssignments.length === 0 && (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-20" />
            <p>No assignments found.</p>
          </div>
        )}
      </motion.div>

      {/* Submit Modal */}
      <AnimatePresence>
        {submitModalId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSubmitModalId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Submit Assignment</h2>
                <button onClick={() => setSubmitModalId(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={18} /></button>
              </div>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center mb-4 hover:border-indigo-400 transition-colors cursor-pointer">
                <Paperclip size={32} className="mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Drag & drop your file or click to browse</p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOC, ZIP — max 50MB</p>
              </div>
              <textarea
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                rows={3}
                placeholder="Add a note to your submission (optional)..."
              />
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setSubmitModalId(null)} className="flex-1">Cancel</Button>
                <Button
                  onClick={() => handleSubmit(submitModalId!)}
                  className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Upload size={16} /> Submit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Assignment Modal (Faculty) */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-slate-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New Assignment</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Subject</label>
                  <select
                    value={newAssignment.subject}
                    onChange={e => setNewAssignment(a => ({ ...a, subject: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Title</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Assignment title..."
                    value={newAssignment.title}
                    onChange={e => setNewAssignment(a => ({ ...a, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={3}
                    placeholder="Describe the assignment requirements..."
                    value={newAssignment.description}
                    onChange={e => setNewAssignment(a => ({ ...a, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Due Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={newAssignment.dueDate}
                      onChange={e => setNewAssignment(a => ({ ...a, dueDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Max Marks</label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={newAssignment.maxMarks}
                      onChange={e => setNewAssignment(a => ({ ...a, maxMarks: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleCreate} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                  Create Assignment
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
