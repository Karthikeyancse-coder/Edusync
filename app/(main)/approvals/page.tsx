'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Clock, XCircle, MessageSquare, Eye, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'

type ApprovalStatus = 'pending' | 'approved' | 'rejected'

type ApprovalRequest = {
  id: number
  from: string
  fromRole: string
  to: string
  toRole: string
  subject: string
  message: string
  requestedAt: string
  status: ApprovalStatus
  reason?: string
}

const initialRequests: ApprovalRequest[] = [
  {
    id: 1, from: 'Aarav Shah', fromRole: 'student', to: 'Dr. Sarah Jenkins', toRole: 'faculty',
    subject: 'Assignment Extension Request',
    message: 'I was unable to complete the AVL Trees assignment due to a medical emergency. I would appreciate a 2-day extension.',
    requestedAt: '2 hours ago', status: 'pending'
  },
  {
    id: 2, from: 'Priya Patel', fromRole: 'student', to: 'Dr. Alan Turing', toRole: 'faculty',
    subject: 'Query about Exam Marks',
    message: 'I noticed my CIA-2 marks seem lower than expected. Could you please clarify the marking scheme?',
    requestedAt: '4 hours ago', status: 'pending'
  },
  {
    id: 3, from: 'Dr. Sarah Jenkins', fromRole: 'faculty', to: 'HOD – CSE', toRole: 'hod',
    subject: 'Request to conduct extra class',
    message: 'Due to the campus closure last week, I need to schedule an extra class on Saturday to cover the missed topics.',
    requestedAt: 'Yesterday', status: 'approved', reason: 'Approved. Please coordinate with the timetable committee.'
  },
  {
    id: 4, from: 'Rahul Verma', fromRole: 'student', to: 'Dr. Sarah Jenkins', toRole: 'faculty',
    subject: 'Project Topic Change',
    message: 'I would like to change my final project topic from Graph Algorithms to Distributed Systems.',
    requestedAt: '2 days ago', status: 'rejected', reason: 'Topic change deadline has passed.'
  },
]

const STATUS_CONFIG: Record<ApprovalStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-500/20', icon: Clock },
  approved: { label: 'Approved', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/20', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-500/20', icon: XCircle },
}

export default function ApprovalsPage() {
  const { role, profile } = useAuth()
  const [requests, setRequests] = useState<ApprovalRequest[]>(initialRequests)
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [rejectModalId, setRejectModalId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const displayRequests = requests.filter(r => {
    const matchStatus = statusFilter === 'All' || r.status === statusFilter.toLowerCase()
    // Faculty sees requests TO them, student sees their own sent requests
    return matchStatus
  })

  const pendingCount = requests.filter(r => r.status === 'pending').length

  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', reason: 'Request approved.' } : r))
    setExpandedId(null)
  }

  const handleReject = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', reason: rejectReason || 'Request rejected.' } : r))
    setRejectModalId(null)
    setRejectReason('')
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Approvals</h1>
            {pendingCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {role === 'student' ? 'Track the status of your requests.' : 'Review and manage approval requests.'}
          </p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              statusFilter === s
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >{s}</button>
        ))}
      </div>

      {/* Requests List */}
      <motion.div className="space-y-4">
        <AnimatePresence>
          {displayRequests.map(request => {
            const conf = STATUS_CONFIG[request.status]
            const isExpanded = expandedId === request.id
            const canAction = role !== 'student' && request.status === 'pending'

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className={cn(
                  "overflow-hidden hover:shadow-md transition-shadow",
                  request.status === 'pending' && role !== 'student' && "border-amber-200 dark:border-amber-900/30"
                )}>
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : request.id)}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar name={request.from} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">{request.from}</span>
                          <span className="text-xs text-slate-400">→</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{request.to}</span>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white">{request.subject}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{request.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1", conf.color, conf.bg)}>
                            <conf.icon size={11} />
                            {conf.label}
                          </span>
                          <span className="text-xs text-slate-400">{request.requestedAt}</span>
                        </div>
                      </div>
                      <ChevronDown
                        size={18}
                        className={cn("text-slate-400 transition-transform shrink-0 mt-1", isExpanded && "rotate-180")}
                      />
                    </div>
                  </div>

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
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Full Message</h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                              {request.message}
                            </p>
                          </div>

                          {request.reason && (
                            <div className={cn(
                              "p-3 rounded-lg border",
                              request.status === 'approved'
                                ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-900/30"
                                : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30"
                            )}>
                              <h4 className={cn(
                                "text-xs font-semibold uppercase mb-1",
                                request.status === 'approved' ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"
                              )}>
                                {request.status === 'approved' ? 'Approval Note' : 'Rejection Reason'}
                              </h4>
                              <p className={cn(
                                "text-sm",
                                request.status === 'approved' ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"
                              )}>
                                {request.reason}
                              </p>
                            </div>
                          )}

                          {canAction && (
                            <div className="flex gap-3">
                              <Button
                                onClick={() => handleApprove(request.id)}
                                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                              >
                                <CheckCircle2 size={16} /> Approve
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setRejectModalId(request.id)}
                                className="gap-2 text-red-600 border-red-300 hover:bg-red-50 flex-1"
                              >
                                <XCircle size={16} /> Reject
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

        {displayRequests.length === 0 && (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <CheckCircle2 size={40} className="mx-auto mb-3 opacity-20" />
            <p>No requests found.</p>
          </div>
        )}
      </motion.div>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModalId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setRejectModalId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Reject Request</h2>
                <button onClick={() => setRejectModalId(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Provide a reason for rejection (optional but recommended).</p>
              <textarea
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                rows={3}
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              />
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setRejectModalId(null)} className="flex-1">Cancel</Button>
                <Button
                  onClick={() => handleReject(rejectModalId!)}
                  className="flex-1 gap-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  <XCircle size={16} /> Confirm Reject
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
