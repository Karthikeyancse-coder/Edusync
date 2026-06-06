'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, Phone, Building2, GraduationCap, Calendar, Edit2, 
  Save, X, Camera, Lock, Shield, BookOpen, CheckCircle, Award,
  BarChart2, Clock, MessageSquare, Bell
} from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/lib/utils'

const STAT_CONFIGS = {
  student: [
    { label: 'Current GPA', value: '3.8', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
    { label: 'Attendance', value: '82%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
    { label: 'Assignments', value: '24/28', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-500/20' },
    { label: 'Messages Sent', value: '142', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-500/20' },
  ],
  faculty: [
    { label: 'Classes Taken', value: '128', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
    { label: 'Avg Attendance', value: '88%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
    { label: 'Students Taught', value: '324', icon: GraduationCap, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-500/20' },
    { label: 'Pending Approvals', value: '12', icon: Bell, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-500/20' },
  ],
  hod: [
    { label: 'Dept Size', value: '845', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
    { label: 'Faculty Count', value: '42', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
    { label: 'Dept Avg Attend.', value: '91%', icon: CheckCircle, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-500/20' },
    { label: 'Pending Requests', value: '28', icon: Bell, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-500/20' },
  ],
  principal: [
    { label: 'Total Students', value: '2,854', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
    { label: 'Total Faculty', value: '184', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
    { label: 'Departments', value: '8', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-500/20' },
    { label: 'College Attend.', value: '89%', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-500/20' },
  ],
}

const SUBJECT_PERFORMANCE = [
  { name: 'Data Structures', score: 84 },
  { name: 'Algorithms', score: 71 },
  { name: 'Operating Systems', score: 92 },
  { name: 'Computer Networks', score: 65 },
  { name: 'Database Systems', score: 88 },
]

export default function ProfilePage() {
  const { profile, role } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'security'>('overview')
  const [editForm, setEditForm] = useState({
    name: profile?.name || 'Demo User',
    email: 'user@edusync.edu',
    phone: '+91 98765 43210',
    department: profile?.department || 'Computer Science',
    bio: 'Passionate about learning and technology.',
  })

  const stats = STAT_CONFIGS[role || 'student'] || STAT_CONFIGS.student

  const handleSave = () => {
    setIsEditing(false)
  }

  const roleColors: Record<string, string> = {
    principal: 'from-rose-500 to-pink-600',
    hod: 'from-amber-500 to-orange-600',
    faculty: 'from-emerald-500 to-teal-600',
    student: 'from-indigo-500 to-violet-600',
  }

  const gradientClass = roleColors[role || 'student'] || roleColors.student

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
      {/* Hero Profile Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="overflow-hidden border-none shadow-lg">
          {/* Banner */}
          <div className={`h-36 bg-gradient-to-r ${gradientClass} relative`}>
            <div className="absolute inset-0 bg-black/10" />
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -right-4 top-8 w-32 h-32 rounded-full bg-white/10" />
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              {/* Avatar */}
              <div className="flex items-end gap-4 -mt-14 relative">
                <div className="relative">
                  <Avatar
                    name={profile?.name || 'Demo User'}
                    role={role || 'student'}
                    size="xl"
                    showRoleBadge
                    className="ring-4 ring-white dark:ring-slate-900 shadow-xl"
                  />
                  <button className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors">
                    <Camera size={13} />
                  </button>
                </div>
                <div className="pb-1">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {isEditing ? editForm.name : (profile?.name || 'Demo User')}
                  </h1>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold capitalize">
                    {role}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {profile?.unique_id || 'DEMO-ID'} · {editForm.department}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pb-1">
                {isEditing ? (
                  <>
                    <Button variant="ghost" onClick={() => setIsEditing(false)} className="gap-2">
                      <X size={16} /> Cancel
                    </Button>
                    <Button onClick={handleSave} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Save size={16} /> Save Changes
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit2 size={16} /> Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, i) => (
          <Card key={i} className="group hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon size={20} />
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-slate-800">
        {(['overview', 'security'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
              activeTab === tab
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}
          >{tab}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={18} className="text-indigo-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Full Name', value: editForm.name, icon: User, field: 'name' },
                  { label: 'Email', value: editForm.email, icon: Mail, field: 'email' },
                  { label: 'Phone', value: editForm.phone, icon: Phone, field: 'phone' },
                  { label: 'Department', value: editForm.department, icon: Building2, field: 'department' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon size={16} className="text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{item.label}</p>
                      {isEditing ? (
                        <input
                          className="w-full text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={(editForm as any)[item.field]}
                          onChange={e => setEditForm(f => ({ ...f, [item.field]: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{(editForm as any)[item.field]}</p>
                      )}
                    </div>
                  </div>
                ))}
                <div>
                  <p className="text-xs text-slate-400 mb-1 ml-12">Bio</p>
                  {isEditing ? (
                    <textarea
                      className="w-full ml-12 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      rows={2}
                      value={editForm.bio}
                      onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400 ml-12 italic">&ldquo;{editForm.bio}&rdquo;</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance / Subject breakdown for student */}
            {role === 'student' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 size={18} className="text-emerald-500" />
                    Academic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {SUBJECT_PERFORMANCE.map((subj) => {
                    const color = subj.score >= 75 ? 'bg-emerald-500' : subj.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    const textColor = subj.score >= 75 ? 'text-emerald-600' : subj.score >= 60 ? 'text-amber-600' : 'text-red-600'
                    return (
                      <div key={subj.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{subj.name}</span>
                          <span className={cn("font-bold", textColor)}>{subj.score}%</span>
                        </div>
                        <ProgressBar value={subj.score} height="h-2" color={color} />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {/* Recent Activity (for non-students) */}
            {role !== 'student' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock size={18} className="text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Marked attendance for CSE-A', time: '2 hours ago' },
                      { action: 'Uploaded marks for CIA-2', time: '4 hours ago' },
                      { action: 'Approved 3 student requests', time: 'Yesterday' },
                      { action: 'Posted new assignment', time: '2 days ago' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0" />
                        <div>
                          <p className="text-sm text-slate-700 dark:text-slate-300">{item.action}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="max-w-lg space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock size={18} className="text-indigo-500" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                  <div key={label}>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">{label}</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="••••••••"
                    />
                  </div>
                ))}
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Shield size={18} />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 mb-4">These actions are irreversible. Please be careful.</p>
                <Button variant="danger" className="gap-2">
                  <X size={16} /> Delete Account
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
