'use client'

import React, { useState } from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { Search, Filter, Mail, Phone, MoreHorizontal, UserPlus, X, Briefcase, GraduationCap, User, Trash2, Pencil } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

const users = [
  { id: 1, name: 'Emma Thompson', role: 'student', department: 'Computer Science', email: 'emma.t@edusync.edu', status: 'online' },
  { id: 2, name: 'Dr. Sarah Jenkins', role: 'faculty', department: 'Mathematics', email: 's.jenkins@edusync.edu', status: 'offline' },
  { id: 3, name: 'Admin Principal', role: 'principal', department: 'Administration', email: 'principal@edusync.edu', status: 'online' },
  { id: 4, name: 'Prof. Alan Turing', role: 'hod', department: 'Computer Science', email: 'a.turing@edusync.edu', status: 'offline' },
  { id: 5, name: 'Michael Chen', role: 'student', department: 'Physics', email: 'm.chen@edusync.edu', status: 'online' },
  { id: 6, name: 'Sarah Connor', role: 'student', department: 'Engineering', email: 's.connor@edusync.edu', status: 'offline' },
  { id: 7, name: 'Dr. Marie Curie', role: 'hod', department: 'Physics', email: 'm.curie@edusync.edu', status: 'online' },
  { id: 8, name: 'John Doe', role: 'student', department: 'Mathematics', email: 'j.doe@edusync.edu', status: 'offline' },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export default function Directory() {
  const [usersData, setUsersData] = useState(users)
  const [filter, setFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [studentTypeFilter, setStudentTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ id: number; x: number; y: number } | null>(null)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [newUser, setNewUser] = useState({ name: '', role: 'student', department: '', email: '' })

  React.useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null)
    window.addEventListener('click', handleGlobalClick)
    return () => window.removeEventListener('click', handleGlobalClick)
  }, [])

  const departments = ['all', ...Array.from(new Set(usersData.map(u => u.department)))]

  const filteredUsers = usersData.filter(u => {
    const matchesFilter = filter === 'all' || u.role === filter
    const matchesDept = deptFilter === 'all' || u.department === deptFilter
    const matchesYear = filter !== 'student' || yearFilter === 'all' || (u as any).year === yearFilter
    const matchesSection = filter !== 'student' || sectionFilter === 'all' || (u as any).section === sectionFilter
    const matchesStudentType = filter !== 'student' || studentTypeFilter === 'all' || (u as any).studentType === studentTypeFilter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = u.name.toLowerCase().includes(searchLower) || u.email.toLowerCase().includes(searchLower) || u.department.toLowerCase().includes(searchLower)
    return matchesFilter && matchesDept && matchesYear && matchesSection && matchesStudentType && matchesSearch
  })

  const handleAddUser = () => {
    const nextId = Math.max(...usersData.map(u => u.id)) + 1
    setUsersData(prev => [{ id: nextId, ...newUser, status: 'offline' }, ...prev])
    setIsAddUserModalOpen(false)
    setNewUser({ name: '', role: 'student', department: '', email: '' })
  }

  const handleEditUser = () => {
    if (!editingUser) return
    setUsersData(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...editingUser } : u))
    setEditingUser(null)
  }

  const handleDeleteUser = (id: number) => {
    setUsersData(prev => prev.filter(u => u.id !== id))
    setSelectedUser(null)
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] md:h-screen p-4 md:p-6 pb-4 md:pb-6 overflow-y-auto relative bg-emerald-200 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10 pb-24">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Campus Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Find and connect with students, faculty, and staff.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search name, email, or dept..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-surface border-slate-200 dark:border-slate-800" 
            />
          </div>
          <Button onClick={() => setIsAddUserModalOpen(true)} className="gap-2 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white">
            <UserPlus size={18} />
            Add User
          </Button>
            <Button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} variant="outline" className="gap-2 shrink-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-surface relative">
              <Filter size={18} />
              Filters
              {(deptFilter !== 'all' || filter !== 'all' || yearFilter !== 'all' || sectionFilter !== 'all' || studentTypeFilter !== 'all') && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-900" />
              )}
            </Button>
        </div>
      </motion.div>

      {/* Inline Filter Menu */}
      <AnimatePresence>
        {isFilterMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter Settings</span>
                {(deptFilter !== 'all' || filter !== 'all' || yearFilter !== 'all' || sectionFilter !== 'all' || studentTypeFilter !== 'all') && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    setFilter('all')
                    setDeptFilter('all')
                    setYearFilter('all')
                    setSectionFilter('all')
                    setStudentTypeFilter('all')
                  }} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 h-7 px-2 text-xs">
                    Clear Filters
                  </Button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Role Column */}
                    <div className="flex-1 min-w-[120px]">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs border-b border-slate-100 dark:border-slate-700 pb-2">Role</h4>
                      <div className="flex flex-col gap-1.5">
                        {['all', 'student', 'faculty', 'hod', 'principal', 'admin'].map(role => (
                          <button
                            key={role}
                            onClick={() => setFilter(role)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all text-left ${
                              filter === role
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Department Column */}
                    <div className="flex-1 min-w-[120px]">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs border-b border-slate-100 dark:border-slate-700 pb-2">Department</h4>
                      <div className="flex flex-col gap-1.5">
                        {departments.map(dept => (
                          <button
                            key={dept}
                            onClick={() => setDeptFilter(dept)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all text-left ${
                              deptFilter === dept
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            {dept}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Class Year Column (Only visible if Role === student) */}
                    <AnimatePresence>
                      {filter === 'student' && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex-1 min-w-[120px] overflow-hidden whitespace-nowrap"
                        >
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs border-b border-slate-100 dark:border-slate-700 pb-2">Class (Year)</h4>
                          <div className="flex flex-col gap-1.5">
                            {['all', '1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
                              <button
                                key={year}
                                onClick={() => setYearFilter(year)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all text-left ${
                                  yearFilter === year
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Section Column (Only visible if Role === student) */}
                    <AnimatePresence>
                      {filter === 'student' && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex-1 min-w-[120px] overflow-hidden whitespace-nowrap"
                        >
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs border-b border-slate-100 dark:border-slate-700 pb-2">Section</h4>
                          <div className="flex flex-col gap-1.5">
                            {['all', 'a', 'b', 'c'].map(sec => (
                              <button
                                key={sec}
                                onClick={() => setSectionFilter(sec)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all text-left ${
                                  sectionFilter === sec
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                              >
                                {sec === 'all' ? 'All Sections' : `Section ${sec.toUpperCase()}`}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Student Type Column (Only visible if Role === student) */}
                    <AnimatePresence>
                      {filter === 'student' && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex-1 min-w-[120px] overflow-hidden whitespace-nowrap"
                        >
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs border-b border-slate-100 dark:border-slate-700 pb-2">Student Type</h4>
                          <div className="flex flex-col gap-1.5">
                            {['all', 'rep'].map(stype => (
                              <button
                                key={stype}
                                onClick={() => setStudentTypeFilter(stype)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all text-left ${
                                  studentTypeFilter === stype
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                              >
                                {stype === 'all' ? 'All Students' : 'Class Rep'}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>



      {/* Directory Grid */}
      <Card className="bg-white/50 dark:bg-surface/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-slate-100 dark:divide-slate-800/60"
            >
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    key={user.id} 
                    onContextMenu={(e) => {
                      e.preventDefault()
                      setContextMenu({ id: user.id, x: e.clientX, y: e.clientY })
                    }}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar name={user.name} role={user.role as any} size="sm" showRoleBadge />
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-surface ${
                          user.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-500 sm:hidden mt-0.5">{user.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                      user.role === 'principal' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' :
                      user.role === 'hod' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                      user.role === 'faculty' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                      'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {user.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Mail size={14} />
                      <span className="truncate max-w-[200px]">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button onClick={(e) => { e.stopPropagation(); alert(`Calling ${user.name}...`) }} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        <Phone size={16} />
                      </Button>
                      <Button onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${user.email}` }} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        <Mail size={16} />
                      </Button>
                      <Button onClick={(e) => { e.stopPropagation(); setSelectedUser(user) }} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New User</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsAddUserModalOpen(false)} className="-mr-2 -mt-2">
                <X size={20} />
              </Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Full Name</label>
                <Input value={newUser.name} onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Email Address</label>
                <Input value={newUser.email} onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))} placeholder="jane.doe@edusync.edu" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Department</label>
                <Input value={newUser.department} onChange={e => setNewUser(prev => ({ ...prev, department: e.target.value }))} placeholder="e.g. Science" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Role</label>
                <select 
                  value={newUser.role} 
                  onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-400"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="hod">HOD</option>
                  <option value="principal">Principal</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button onClick={() => setIsAddUserModalOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={handleAddUser} className="bg-indigo-600 hover:bg-indigo-700 text-white">Add User</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit User</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)} className="-mr-2 -mt-2">
                <X size={20} />
              </Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Full Name</label>
                <Input value={editingUser.name} onChange={e => setEditingUser((prev: any) => prev ? ({ ...prev, name: e.target.value }) : null)} placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Email Address</label>
                <Input value={editingUser.email} onChange={e => setEditingUser((prev: any) => prev ? ({ ...prev, email: e.target.value }) : null)} placeholder="jane.doe@edusync.edu" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Department</label>
                <Input value={editingUser.department} onChange={e => setEditingUser((prev: any) => prev ? ({ ...prev, department: e.target.value }) : null)} placeholder="e.g. Science" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Role</label>
                <select 
                  value={editingUser.role} 
                  onChange={e => setEditingUser((prev: any) => prev ? ({ ...prev, role: e.target.value }) : null)}
                  className="w-full flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-400"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="hod">HOD</option>
                  <option value="principal">Principal</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button onClick={() => setEditingUser(null)} variant="outline">Cancel</Button>
              <Button onClick={handleEditUser} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-end -mt-12 mb-4">
                <div className="relative">
                  <Avatar name={selectedUser.name} role={selectedUser.role as any} size="lg" className="border-4 border-white dark:border-slate-800 h-24 w-24 text-3xl" showRoleBadge />
                  <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                    selectedUser.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.location.href = `mailto:${selectedUser.email}`}>
                    <Mail size={16} className="mr-2" /> Message
                  </Button>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedUser.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 capitalize">{selectedUser.role} • {selectedUser.department}</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Mail size={18} className="text-slate-400" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Briefcase size={18} className="text-slate-400" />
                  <span>Department of {selectedUser.department}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <GraduationCap size={18} className="text-slate-400" />
                  <span className="capitalize">{selectedUser.role} Role</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between">
                <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteUser(selectedUser.id)}>
                  Delete User
                </Button>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 overflow-hidden"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
              <Mail size={16} /> Message
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
              onClick={() => {
                const u = usersData.find(u => u.id === contextMenu.id)
                if (u) setEditingUser(u)
                setContextMenu(null)
              }}
            >
              <Pencil size={16} /> Edit User
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
              onClick={() => {
                const u = usersData.find(u => u.id === contextMenu.id)
                if (u) setSelectedUser(u)
                setContextMenu(null)
              }}
            >
              <User size={16} /> View Profile
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
              onClick={() => {
                handleDeleteUser(contextMenu.id)
                setContextMenu(null)
              }}
            >
              <Trash2 size={16} /> Delete User
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </div>
  )
}
