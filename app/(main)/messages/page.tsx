'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Search, X, CheckCheck, Check, ArrowLeft,
  Shield, GraduationCap, Crown, Users, Clock,
  AlertCircle, CheckCircle, XCircle, ChevronRight,
  RefreshCw, Lock, Paperclip, Globe, User, MessageSquare,
  Info, Bell, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import { useContacts, type Contact } from '@/hooks/useContacts'
import { useMessages } from '@/hooks/useMessages'
import { getPendingApprovals } from '@/lib/messaging'
import type { Role } from '@/types'

// ─── Role helpers ─────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  principal: { label: 'Principal', color: 'text-red-500',    icon: Crown },
  hod:       { label: 'HOD',       color: 'text-amber-500',  icon: Shield },
  faculty:   { label: 'Faculty',   color: 'text-emerald-500',icon: GraduationCap },
  student:   { label: 'Student',   color: 'text-indigo-500', icon: User },
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  delivered:       { label: 'Delivered',            color: 'text-emerald-500', icon: CheckCheck },
  sent:            { label: 'Sent',                 color: 'text-slate-400',   icon: Check },
  pending_faculty: { label: 'Awaiting Faculty',     color: 'text-amber-500',   icon: Clock },
  pending_hod:     { label: 'Awaiting HOD',         color: 'text-amber-600',   icon: Clock },
  escalated:       { label: 'Escalated to HOD',     color: 'text-orange-500',  icon: AlertCircle },
  rejected:        { label: 'Rejected',             color: 'text-red-500',     icon: XCircle },
  approved:        { label: 'Approved',             color: 'text-emerald-500', icon: CheckCircle },
}

// ─── Avatar component ─────────────────────────────────────────────────────────
function ContactAvatar({ name, color, size = 'md' }: { name: string; color?: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sz = size === 'sm' ? 'w-9 h-9 text-sm' : size === 'lg' ? 'w-14 h-14 text-xl' : 'w-11 h-11 text-base'
  const bg = color || '#7C6FFF'

  return (
    <div
      className={cn('rounded-full flex items-center justify-center font-bold text-white shrink-0', sz)}
      style={{ background: bg }}
    >
      {initials}
    </div>
  )
}

// ─── Message status badge ─────────────────────────────────────────────────────
function StatusBadge({ status, rejectionReason }: { status: string; rejectionReason?: string | null }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.sent
  const Icon = cfg.icon
  return (
    <div className={cn('flex items-center gap-1 text-xs', cfg.color)} title={rejectionReason ?? cfg.label}>
      <Icon size={11} />
      <span>{cfg.label}</span>
      {rejectionReason && <span className="text-red-400 ml-1">— {rejectionReason}</span>}
    </div>
  )
}

// ─── Format time helper ───────────────────────────────────────────────────────
function formatChatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatLastSeen(iso: string | null) {
  if (!iso) return 'Unknown'
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return d.toLocaleDateString()
}

// ─── Pending Approvals Panel ──────────────────────────────────────────────────
function ApprovalsPanel({
  userId,
  role,
  onAction,
}: {
  userId: string
  role: Role
  onAction: () => void
}) {
  const [pending, setPending] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPendingApprovals(userId, role)
      setPending(data)
    } catch {
      // silently ignore
    } finally {
      setLoading(false)
    }
  }, [userId, role])

  useEffect(() => { load() }, [load])

  const { approve, reject } = useMessages(userId, null, role, null)

  const handleApprove = async (id: string) => {
    await approve(id, role)
    setPending(prev => prev.filter(m => m.id !== id))
    onAction()
  }

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) return
    await reject(id, rejectReason)
    setPending(prev => prev.filter(m => m.id !== id))
    setRejectingId(null)
    setRejectReason('')
    onAction()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <RefreshCw size={20} className="animate-spin text-indigo-500" />
      </div>
    )
  }

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-400">
        <CheckCircle size={32} className="text-emerald-400" />
        <p className="text-sm font-medium">No pending approvals</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-amber-500" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {pending.length} message{pending.length > 1 ? 's' : ''} awaiting approval
        </span>
      </div>
      {pending.map(msg => (
        <div key={msg.id} className="bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-900/40 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <ContactAvatar name={msg.sender?.name ?? '?'} color={msg.sender?.avatar_color} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {msg.sender?.name}
                </span>
                <span className={cn('text-xs', ROLE_CONFIG[msg.sender?.role]?.color)}>
                  {ROLE_CONFIG[msg.sender?.role]?.label}
                </span>
                {msg.status === 'escalated' && (
                  <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-2 py-0.5 rounded-full">
                    Escalated
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                → {msg.receiver?.name} · {formatChatTime(msg.created_at)}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/40 rounded-lg px-3 py-2 italic">
            &ldquo;{msg.content}&rdquo;
          </p>

          {rejectingId === msg.id ? (
            <div className="space-y-2">
              <input
                autoFocus
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReject(msg.id)}
                  disabled={!rejectReason.trim()}
                  className="flex-1 text-sm py-1.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50"
                >
                  Confirm Reject
                </button>
                <button
                  onClick={() => { setRejectingId(null); setRejectReason('') }}
                  className="px-3 text-sm py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(msg.id)}
                className="flex-1 text-sm py-1.5 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 flex items-center justify-center gap-1.5"
              >
                <CheckCircle size={14} /> Approve
              </button>
              <button
                onClick={() => setRejectingId(msg.id)}
                className="flex-1 text-sm py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center gap-1.5"
              >
                <XCircle size={14} /> Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const { profile, role, department } = useAuth()

  const [activeContact, setActiveContact] = useState<Contact | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [crossDeptEnabled, setCrossDeptEnabled] = useState(false)
  const [showApprovals, setShowApprovals] = useState(false)
  const [filterMode, setFilterMode] = useState<'all' | 'direct'>('all')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [pendingCount, setPendingCount] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Contacts from Supabase
  const {
    contacts,
    isLoading: contactsLoading,
    refetch: refetchContacts,
  } = useContacts(profile?.id, role, department, crossDeptEnabled)

  // Messages for active conversation from Supabase
  const {
    messages,
    isLoading: messagesLoading,
    send,
    approve,
    reject,
  } = useMessages(
    profile?.id,
    activeContact?.id ?? null,
    role,
    (activeContact?.role as Role) ?? null
  )

  // Load pending count for faculty/HOD badge
  useEffect(() => {
    if (!profile?.id || (role !== 'faculty' && role !== 'hod')) return
    getPendingApprovals(profile.id, role).then(list => setPendingCount(list.length)).catch(() => {})
  }, [profile?.id, role, messages]) // refresh whenever messages change

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when contact changes
  useEffect(() => {
    if (activeContact) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [activeContact?.id])

  const handleSend = async () => {
    const content = messageInput.trim()
    if (!content || isSending || !activeContact) return

    setSendError(null)
    setIsSending(true)
    setMessageInput('')
    try {
      await send(content, crossDeptEnabled && activeContact.department !== department)
    } catch (e: any) {
      setSendError(e.message)
      setMessageInput(content) // restore on error
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Filtered contacts by search + mode
  const filteredContacts = contacts.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.department ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchMode =
      filterMode === 'all' ||
      (filterMode === 'direct' && c.role !== 'student')
    return matchSearch && matchMode
  })

  const myRole = role ?? 'student'
  const myProfile = profile

  // ── Left sidebar ─────────────────────────────────────────────────────────
  const sidebar = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h1>
          {/* Approvals badge for faculty/HOD */}
          {(role === 'faculty' || role === 'hod') && (
            <button
              onClick={() => setShowApprovals(!showApprovals)}
              className="relative p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition-colors"
              title="Pending Approvals"
            >
              <Bell size={18} />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                  {pendingCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Cross-dept toggle for students */}
        {role === 'student' && (
          <button
            onClick={() => setCrossDeptEnabled(!crossDeptEnabled)}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors',
              crossDeptEnabled
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            )}
          >
            <Globe size={14} />
            {crossDeptEnabled ? 'Cross-dept ON — showing all faculty' : 'Show cross-department faculty'}
          </button>
        )}
      </div>

      {/* Approvals panel (inline for faculty/HOD) */}
      <AnimatePresence>
        {showApprovals && profile?.id && role && (role === 'faculty' || role === 'hod') && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-900/10"
          >
            <ApprovalsPanel
              userId={profile.id}
              role={role}
              onAction={() => {
                refetchContacts()
                getPendingApprovals(profile.id, role).then(list => setPendingCount(list.length)).catch(() => {})
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {contactsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-32" />
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-48" />
              </div>
            </div>
          ))
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-400">
            <Users size={32} />
            <p className="text-sm text-center px-4">
              {searchQuery ? 'No contacts match your search' : 'No contacts available for your role'}
            </p>
          </div>
        ) : (
          filteredContacts.map(contact => {
            const roleCfg = ROLE_CONFIG[contact.role] ?? ROLE_CONFIG.student
            const RoleIcon = roleCfg.icon
            const isActive = activeContact?.id === contact.id
            return (
              <button
                key={contact.id}
                onClick={() => {
                  setActiveContact(contact)
                  setShowInfo(false)
                  setSendError(null)
                }}
                className={cn(
                  'w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60',
                  isActive && 'bg-indigo-50 dark:bg-indigo-900/20 border-r-2 border-indigo-500'
                )}
              >
                <div className="relative shrink-0">
                  <ContactAvatar name={contact.name} color={contact.avatar_color} size="md" />
                  {contact.unread && contact.unread > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {contact.unread}
                    </span>
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {contact.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <RoleIcon size={11} className={roleCfg.color} />
                    <span className={cn('text-xs font-medium', roleCfg.color)}>{roleCfg.label}</span>
                    {contact.department && (
                      <span className="text-xs text-slate-400 truncate">· {contact.department}</span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )

  // ── Chat window ──────────────────────────────────────────────────────────
  const chatWindow = activeContact ? (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <button
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 shrink-0"
          onClick={() => setActiveContact(null)}
        >
          <ArrowLeft size={18} />
        </button>
        <ContactAvatar name={activeContact.name} color={activeContact.avatar_color} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{activeContact.name}</p>
          <div className="flex items-center gap-1">
            {(() => {
              const rc = ROLE_CONFIG[activeContact.role]
              if (!rc) return null
              const Icon = rc.icon
              return (
                <>
                  <Icon size={11} className={rc.color} />
                  <span className={cn('text-xs', rc.color)}>{rc.label}</span>
                </>
              )
            })()}
            {activeContact.department && (
              <span className="text-xs text-slate-400">· {activeContact.department}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={cn(
            'p-2 rounded-xl transition-colors',
            showInfo
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'
              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <Info size={18} />
        </button>
      </div>

      {/* Contact info panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-4 p-4">
              <ContactAvatar name={activeContact.name} color={activeContact.avatar_color} size="lg" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{activeContact.name}</p>
                <p className="text-sm text-slate-500">{activeContact.unique_id}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Last seen {formatLastSeen(activeContact.last_active_at)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <RefreshCw size={24} className="animate-spin text-indigo-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
            <MessageSquare size={40} className="text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs text-center">
              Send your first message to {activeContact.name}
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_id === profile?.id
            const pending = ['pending_faculty', 'pending_hod', 'escalated'].includes(msg.status)
            const rejected = msg.status === 'rejected'
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex items-end gap-2', isMe ? 'flex-row-reverse' : 'flex-row')}
              >
                {!isMe && (
                  <ContactAvatar name={msg.sender?.name ?? '?'} color={msg.sender?.avatar_color} size="sm" />
                )}
                <div className={cn('max-w-[72%] space-y-1', isMe ? 'items-end' : 'items-start', 'flex flex-col')}>
                  <div
                    className={cn(
                      'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                      isMe
                        ? rejected
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-br-sm'
                          : pending
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-br-sm'
                          : 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm shadow-sm',
                      msg.is_optimistic && 'opacity-70'
                    )}
                  >
                    {msg.is_locked && <Lock size={12} className="inline mr-1 opacity-60" />}
                    {msg.content}
                  </div>
                  <div className={cn('flex items-center gap-2', isMe ? 'flex-row-reverse' : 'flex-row')}>
                    <span className="text-[10px] text-slate-400">{formatChatTime(msg.created_at)}</span>
                    {isMe && <StatusBadge status={msg.status} rejectionReason={msg.rejection_reason} />}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send error */}
      <AnimatePresence>
        {sendError && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-2 px-4 py-2">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400 flex-1">{sendError}</p>
              <button onClick={() => setSendError(null)} className="text-red-400 hover:text-red-600">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approval notice for student messages to principal */}
      {role === 'student' &&
        (activeContact.role === 'principal' || activeContact.role === 'hod') && (
          <div className="mx-4 mb-2 flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2">
            <Clock size={13} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Messages to {ROLE_CONFIG[activeContact.role]?.label} require faculty + HOD approval before delivery
            </p>
          </div>
        )}

      {/* Input bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <input
          ref={inputRef}
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${activeContact.name}...`}
          disabled={isSending}
          className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!messageInput.trim() || isSending}
          className={cn(
            'w-10 h-10 rounded-2xl flex items-center justify-center transition-colors shrink-0',
            messageInput.trim() && !isSending
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          )}
        >
          {isSending ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </motion.button>
      </div>
    </div>
  ) : (
    // Empty state when no contact selected
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-4">
      <div className="w-20 h-20 rounded-3xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
        <MessageSquare size={36} className="text-indigo-500" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Messages</h2>
        <p className="text-sm text-slate-500 mt-1">
          Select a contact to start a conversation
        </p>
      </div>
      {/* Role summary */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 max-w-xs w-full mx-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
          Your messaging permissions
        </p>
        {myRole === 'student' && (
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500" /> Any student</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500" /> Faculty (own dept · cross-dept toggle)</li>
            <li className="flex items-center gap-2"><Clock size={12} className="text-amber-500" /> HOD / Principal (needs approval)</li>
          </ul>
        )}
        {myRole === 'faculty' && (
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500" /> Students (own department)</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500" /> Other faculty</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500" /> HOD (direct)</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500" /> Principal (direct)</li>
          </ul>
        )}
        {myRole === 'hod' && (
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500" /> Faculty (own department)</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500" /> Students (own department)</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500" /> Principal (direct)</li>
          </ul>
        )}
        {myRole === 'principal' && (
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500" /> Everyone</li>
          </ul>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar — hidden on mobile when chat is open */}
      <div
        className={cn(
          'w-full md:w-80 lg:w-96 flex-shrink-0 h-full',
          activeContact ? 'hidden md:flex md:flex-col' : 'flex flex-col'
        )}
      >
        {sidebar}
      </div>

      {/* Chat area */}
      <div
        className={cn(
          'flex-1 h-full',
          activeContact ? 'flex flex-col' : 'hidden md:flex md:flex-col'
        )}
      >
        {chatWindow}
      </div>
    </div>
  )
}
