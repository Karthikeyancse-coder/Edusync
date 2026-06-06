'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Users, GraduationCap, Building2, Activity, TrendingUp,
  UserPlus, Trash2, Search, Mail, Phone, MoreHorizontal, CheckCircle,
  XCircle, Settings, Database, RefreshCw, Download, Bell, Lock
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'

type AdminTab = 'overview' | 'users' | 'departments' | 'system'

const mockUsers = [
  { id: 'PRIN-001', name: 'Admin Principal', role: 'principal' as const, dept: 'Administration', email: 'principal@edusync.edu', status: 'active' },
  { id: 'HOD-CSE-001', name: 'Prof. Alan Turing', role: 'hod' as const, dept: 'Computer Science', email: 'a.turing@edusync.edu', status: 'active' },
  { id: 'HOD-PHY-001', name: 'Dr. Marie Curie', role: 'hod' as const, dept: 'Physics', email: 'm.curie@edusync.edu', status: 'active' },
  { id: 'FAC-CSE-001', name: 'Dr. Sarah Jenkins', role: 'faculty' as const, dept: 'Mathematics', email: 's.jenkins@edusync.edu', status: 'active' },
  { id: 'FAC-CSE-002', name: 'Dr. Grace Hopper', role: 'faculty' as const, dept: 'Computer Science', email: 'g.hopper@edusync.edu', status: 'inactive' },
  { id: 'STU-CSE-001', name: 'Aarav Shah', role: 'student' as const, dept: 'Computer Science', email: 'aarav@edusync.edu', status: 'active' },
  { id: 'STU-CSE-002', name: 'Priya Patel', role: 'student' as const, dept: 'Computer Science', email: 'priya@edusync.edu', status: 'active' },
  { id: 'STU-PHY-001', name: 'Rahul Verma', role: 'student' as const, dept: 'Physics', email: 'rahul@edusync.edu', status: 'suspended' },
]

const departments = [
  { name: 'Computer Science', hod: 'Prof. Alan Turing', students: 845, faculty: 42, avgAttend: 91 },
  { name: 'Physics', hod: 'Dr. Marie Curie', students: 620, faculty: 28, avgAttend: 88 },
  { name: 'Mathematics', hod: 'Dr. Ramanujan', students: 530, faculty: 22, avgAttend: 85 },
  { name: 'Electronics', hod: 'Dr. Tesla', students: 480, faculty: 18, avgAttend: 89 },
  { name: 'Mechanical', hod: 'Dr. Watt', students: 310, faculty: 14, avgAttend: 83 },
  { name: 'Civil', hod: 'Dr. Brunei', students: 290, faculty: 12, avgAttend: 87 },
]

const systemLogs = [
  { type: 'info', message: 'Scheduled backup completed successfully', time: '2 min ago' },
  { type: 'warn', message: 'High memory usage detected (88%)', time: '15 min ago' },
  { type: 'info', message: '14 new user accounts created today', time: '1 hour ago' },
  { type: 'error', message: 'Failed login attempt from unknown IP (3×)', time: '2 hours ago' },
  { type: 'info', message: 'Database optimization completed', time: '6 hours ago' },
  { type: 'info', message: 'Automated attendance report sent to all HODs', time: '8 hours ago' },
]

export default function AdminPage() {
  const { role } = useAuth()
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [users, setUsers] = useState(mockUsers)

  // Access guard
  if (role !== 'principal') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32 text-slate-500 dark:text-slate-400">
        <Shield size={48} className="mb-4 opacity-20" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-sm">Only the Principal can access the Admin Panel.</p>
      </div>
    )
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
  }

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const TABS: { key: AdminTab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'users', label: 'User Management', icon: Users },
    { key: 'departments', label: 'Departments', icon: Building2 },
    { key: 'system', label: 'System', icon: Settings },
  ]

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    suspended: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-500/20 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Principal-only system administration</p>
        </div>
        <Button variant="outline" className="gap-2 hidden sm:flex">
          <Download size={16} /> Export Report
        </Button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
              activeTab === tab.key
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: '2,854', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-500/20', change: '+124 this sem' },
              { label: 'Total Faculty', value: '184', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/20', change: '+8 this year' },
              { label: 'Departments', value: '8', icon: Building2, color: 'text-violet-600', bg: 'bg-violet-100 dark:bg-violet-500/20', change: 'No change' },
              { label: 'College Attendance', value: '89%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-500/20', change: '+2% this month' },
            ].map(stat => (
              <Card key={stat.label} className="group hover:shadow-md transition-all duration-300">
                <CardContent className="p-5">
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300", stat.bg, stat.color)}>
                    <stat.icon size={22} />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Department attendance overview */}
          <Card>
            <CardHeader>
              <CardTitle>Department Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {departments.slice(0, 4).map(dept => (
                <div key={dept.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{dept.name}</span>
                    <span className={cn("font-bold", dept.avgAttend >= 85 ? 'text-emerald-600' : 'text-amber-600')}>{dept.avgAttend}%</span>
                  </div>
                  <ProgressBar value={dept.avgAttend} height="h-2" color={dept.avgAttend >= 85 ? 'bg-emerald-500' : 'bg-amber-500'} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search users by name, ID, email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="principal">Principal</option>
              <option value="hod">HOD</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white ml-auto">
              <UserPlus size={16} /> Add User
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    {['User', 'Role', 'Department', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} role={user.role} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "text-xs font-semibold px-2 py-1 rounded-md capitalize",
                          user.role === 'principal' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                          user.role === 'hod' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                          user.role === 'faculty' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                          'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
                        )}>{user.role}</span>
                      </td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{user.dept}</td>
                      <td className="p-4">
                        <span className={cn("text-xs font-semibold px-2 py-1 rounded-full capitalize", (statusColors as any)[user.status])}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStatus(user.id)}
                            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                            className={cn("p-1.5 rounded-lg transition-colors", user.status === 'active' ? 'text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800')}
                          >
                            {user.status === 'active' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {/* DEPARTMENTS TAB */}
      {activeTab === 'departments' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept) => (
              <Card key={dept.name} className="hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{dept.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">HOD: {dept.hod}</p>
                    </div>
                    <div className={cn(
                      "text-sm font-black px-2.5 py-1 rounded-lg",
                      dept.avgAttend >= 85 ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400" : "text-amber-700 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400"
                    )}>
                      {dept.avgAttend}%
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                      <p className="text-lg font-black text-slate-900 dark:text-white">{dept.students}</p>
                      <p className="text-xs text-slate-500">Students</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                      <p className="text-lg font-black text-slate-900 dark:text-white">{dept.faculty}</p>
                      <p className="text-xs text-slate-500">Faculty</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Avg. Attendance</span>
                      <span className={dept.avgAttend >= 85 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{dept.avgAttend}%</span>
                    </div>
                    <ProgressBar value={dept.avgAttend} height="h-1.5" color={dept.avgAttend >= 85 ? 'bg-emerald-500' : 'bg-amber-500'} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* SYSTEM TAB */}
      {activeTab === 'system' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* System Health */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Server Status', value: 'Online', good: true, icon: Activity },
              { label: 'DB Usage', value: '68% (3.4 GB)', good: true, icon: Database },
              { label: 'Uptime', value: '99.98%', good: true, icon: TrendingUp },
            ].map(item => (
              <Card key={item.label}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.good ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-red-100 text-red-600")}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className={cn("text-sm font-bold", item.good ? "text-emerald-700 dark:text-emerald-400" : "text-red-600")}>{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Actions */}
          <Card>
            <CardHeader><CardTitle>System Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Backup Database', icon: Database, color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' },
                { label: 'Send Bulk Notifications', icon: Bell, color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
                { label: 'Reset All Passwords', icon: Lock, color: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
                { label: 'Export All Data', icon: Download, color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
              ].map(action => (
                <button
                  key={action.label}
                  className={cn("flex items-center gap-3 p-4 rounded-xl border text-sm font-semibold hover:shadow-md transition-all text-left", action.color)}
                >
                  <action.icon size={18} />
                  {action.label}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* System Logs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>System Logs</CardTitle>
              <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <RefreshCw size={16} />
              </button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
                {systemLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <span className={cn(
                      "shrink-0 mt-0.5 font-bold uppercase px-1.5 py-0.5 rounded text-[10px]",
                      log.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                      log.type === 'warn' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                    )}>
                      {log.type}
                    </span>
                    <span className="flex-1 text-slate-700 dark:text-slate-300">{log.message}</span>
                    <span className="text-slate-400 whitespace-nowrap">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
