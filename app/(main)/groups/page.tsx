'use client'

import React from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { Users, MoreHorizontal, UserPlus, BookOpen, MessageSquare, Search, Edit2, Trash2, Pin, Info, FolderOpen, Building2, ClipboardList, Crown, Network, X, Check } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'

const presetColors = ['#7C6FFF', '#00D4AA', '#FF4D6D', '#FFB800', '#00B4D8', '#06D6A0', '#F72585', '#7209B7']

// Sample user directory with unique IDs
const USER_DIRECTORY = [
  { unique_id: 'STU-CSE-2024-001', name: 'Aarav Shah',       role: 'student',   department: 'CSE', year: '2nd Year', section: 'a' },
  { unique_id: 'STU-CSE-2024-002', name: 'Priya Nair',       role: 'student',   department: 'CSE', year: '2nd Year', section: 'a' },
  { unique_id: 'STU-CSE-2024-003', name: 'Rohan Verma',      role: 'student',   department: 'CSE', year: '2nd Year', section: 'b' },
  { unique_id: 'STU-CSE-2024-004', name: 'Kavya Reddy',      role: 'student',   department: 'CSE', year: '3rd Year', section: 'a' },
  { unique_id: 'STU-ECE-2024-001', name: 'Arjun Mehta',      role: 'student',   department: 'ECE', year: '1st Year', section: 'a' },
  { unique_id: 'FAC-CSE-001',      name: 'Dr. Sarah Jenkins', role: 'faculty',   department: 'CSE' },
  { unique_id: 'FAC-CSE-002',      name: 'Prof. Alan Turing', role: 'faculty',   department: 'CSE' },
  { unique_id: 'FAC-MATHS-001',    name: 'Dr. Jane Austen',   role: 'faculty',   department: 'Mathematics' },
  { unique_id: 'HOD-CSE-001',      name: 'Prof. Alan Turing', role: 'hod',       department: 'CSE' },
  { unique_id: 'PRIN-001',         name: 'Admin Principal',   role: 'principal', department: 'Administration' },
]

const groups = [
  { id: 1, name: 'Advanced Mathematics', instructor: 'Dr. Sarah Jenkins', members: 124, type: 'faculty_group', group_category: 'Subject', avatar_color: '#7C6FFF', color: 'bg-indigo-500', pinned: false },
  { id: 2, name: 'Computer Science 101', instructor: 'Prof. Alan Turing', members: 340, type: 'faculty_group', group_category: 'Subject', avatar_color: '#06D6A0', color: 'bg-emerald-500', pinned: false },
  { id: 3, name: 'Physics Department', instructor: 'Dr. Marie Curie', members: 45, type: 'hod_group', group_category: 'Department', avatar_color: '#7209B7', color: 'bg-violet-500', pinned: false },
  { id: 4, name: 'Student Council', instructor: 'Admin Principal', members: 12, type: 'principal_group', group_category: 'Committee', avatar_color: '#FFB800', color: 'bg-amber-500', pinned: false },
  { id: 5, name: 'Literature 204', instructor: 'Dr. Jane Austen', members: 86, type: 'faculty_group', group_category: 'Subject', avatar_color: '#FF4D6D', color: 'bg-rose-500', pinned: false },
  { id: 6, name: 'Faculty Lounge', instructor: 'Admin Principal', members: 184, type: 'principal_group', group_category: 'College-wide', avatar_color: '#00B4D8', color: 'bg-blue-500', pinned: false },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

const getGroupIcon = (category?: string) => {
  switch (category) {
    case 'Subject': case 'Study': return BookOpen
    case 'Project': return FolderOpen
    case 'Faculty Meeting': return Users
    case 'Department': case 'College-wide': return Building2
    case 'Committee': return ClipboardList
    case 'HOD Council': return Crown
    case 'Inter-Department': return Network
    default: return Users
  }
}

const getAvatarShape = (type: string) => {
  if (type === 'faculty_group') return 'rounded-md'
  if (type === 'student_group') return 'rounded-2xl'
  return 'rounded-full'
}

type GroupData = {
  id: number
  name: string
  instructor: string
  members: number
  type: string
  group_category?: string
  subject_name?: string
  department?: string
  year?: string
  section?: string
  description?: string
  avatar_color?: string
  principal_auto_added?: boolean
  hod_auto_added?: boolean
  color: string
  pinned: boolean
}

export default function Groups() {
  const router = useRouter()
  const { role } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterType, setFilterType] = React.useState('All')
  const [groupsData, setGroupsData] = React.useState<GroupData[]>(groups)
  const [menuOpen, setMenuOpen] = React.useState<number | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<number | null>(null)
  const [renameModalOpen, setRenameModalOpen] = React.useState<number | null>(null)
  const [renameInput, setRenameInput] = React.useState('')
  const [infoModalOpen, setInfoModalOpen] = React.useState<number | null>(null)
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [memberSearch, setMemberSearch] = React.useState('')
  const [memberSearchResult, setMemberSearchResult] = React.useState<any | null>(null)
  const [addedMembers, setAddedMembers] = React.useState<any[]>([])

  const handleMemberSearch = (query: string) => {
    setMemberSearch(query)
    if (!query.trim()) { setMemberSearchResult(null); return }
    const found = USER_DIRECTORY.find(u =>
      u.unique_id.toLowerCase() === query.trim().toLowerCase() ||
      u.name.toLowerCase().includes(query.trim().toLowerCase())
    )
    setMemberSearchResult(found || null)
  }

  const handleAddMember = (member: any) => {
    if (!addedMembers.find(m => m.unique_id === member.unique_id)) {
      setAddedMembers(prev => [...prev, member])
    }
    setMemberSearch('')
    setMemberSearchResult(null)
  }

  const handleRemoveMember = (id: string) => {
    setAddedMembers(prev => prev.filter(m => m.unique_id !== id))
  }

  const [newGroupInput, setNewGroupInput] = React.useState({
    name: '',
    instructor: '',
    type: role === 'student' ? 'student_group' : role === 'faculty' ? 'faculty_group' : role === 'hod' ? 'hod_group' : 'principal_group',
    group_category: 'General',
    subject_name: '',
    department: '',
    year: '1st Year',
    section: 'a',
    description: '',
    avatar_color: '#7C6FFF',
    principal_auto_added: true,
    hod_auto_added: true,
  })

  const dynamicFilterTypes = ['All', ...Array.from(new Set(groupsData.map(g => g.group_category || g.type)))]

  React.useEffect(() => {
    const handleGlobalClick = () => setMenuOpen(null)
    window.addEventListener('click', handleGlobalClick)
    return () => window.removeEventListener('click', handleGlobalClick)
  }, [])

  const handleCreateGroup = () => setCreateModalOpen(true)
  
  const handleDeleteGroup = (id: number) => {
    setDeleteModalOpen(id)
    setMenuOpen(null)
  }

  const confirmDeleteGroup = () => {
    if (deleteModalOpen) {
      setGroupsData(prev => prev.filter(g => g.id !== deleteModalOpen))
      setDeleteModalOpen(null)
    }
  }

  const handleRenameClick = (group: any) => {
    setRenameInput(group.name)
    setRenameModalOpen(group.id)
    setMenuOpen(null)
  }

  const confirmRenameGroup = () => {
    if (renameModalOpen && renameInput.trim()) {
      setGroupsData(prev => prev.map(g => g.id === renameModalOpen ? { ...g, name: renameInput } : g))
      setRenameModalOpen(null)
    }
  }

  const handlePinToggle = (id: number) => {
    setGroupsData(prev => prev.map(g => g.id === id ? { ...g, pinned: !g.pinned } : g))
    setMenuOpen(null)
  }

  const handleInfoClick = (id: number) => {
    setInfoModalOpen(id)
    setMenuOpen(null)
  }

  const confirmCreateGroup = () => {
    if (newGroupInput.name.trim()) {
      if (groupsData.some(g => g.name.toLowerCase() === newGroupInput.name.trim().toLowerCase())) {
        if (!window.confirm("A similar group exists. Continue?")) return;
      }
      const newGroup: GroupData = {
        id: Date.now(),
        name: newGroupInput.name,
        instructor: newGroupInput.instructor || 'Current User',
        members: 1,
        type: role === 'student' ? 'student_group' : role === 'faculty' ? 'faculty_group' : role === 'hod' ? 'hod_group' : 'principal_group',
        group_category: newGroupInput.group_category,
        subject_name: newGroupInput.subject_name,
        department: newGroupInput.department,
        year: newGroupInput.year,
        section: newGroupInput.section,
        description: newGroupInput.description,
        avatar_color: newGroupInput.avatar_color,
        principal_auto_added: newGroupInput.principal_auto_added,
        hod_auto_added: newGroupInput.hod_auto_added,
        color: 'bg-emerald-500',
        pinned: false,
      }
      setGroupsData(prev => [newGroup, ...prev])
      setCreateModalOpen(false)
      setNewGroupInput({
        name: '',
        instructor: '',
        type: role === 'student' ? 'student_group' : role === 'faculty' ? 'faculty_group' : role === 'hod' ? 'hod_group' : 'principal_group',
        group_category: 'General',
        subject_name: '',
        department: '',
        year: '1st Year',
        section: 'a',
        description: '',
        avatar_color: '#7C6FFF',
        principal_auto_added: true,
        hod_auto_added: true,
      })
    }
  }

  const handleChat = (group: any) => {
    router.push(`/messages?userId=${group.id}&name=${encodeURIComponent(group.name)}&isGroup=true`)
  }

  const filteredGroups = groupsData.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          group.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    if (filterType !== 'All' && group.type !== filterType) return false
    return true
  }).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] md:h-screen p-4 md:p-6 pb-4 md:pb-6 overflow-y-auto relative bg-pink-200 dark:bg-slate-900">
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10 pb-24">
        {/* Header Section */}
        <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Groups & Classes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your courses, departments, and study groups.
          </p>
        </div>
        <Button onClick={handleCreateGroup} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
          <UserPlus size={18} />
          Create Group
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search groups..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {dynamicFilterTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filterType === type 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredGroups.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No groups found matching your search.
          </div>
        ) : (
          filteredGroups.map((group) => (
            <motion.div 
              key={group.id} 
              layout 
              variants={itemVariants}
              className={`relative ${menuOpen === group.id ? 'z-50' : 'z-10'}`}
            >
            <Card 
              onContextMenu={(e) => { e.preventDefault(); setMenuOpen(group.id); }}
              className="group h-full flex flex-col bg-white/50 dark:bg-surface/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg transition-all duration-300 overflow-visible rounded-xl"
            >
              <div 
                className={`h-24 ${!group.avatar_color ? group.color : ''} relative overflow-hidden rounded-t-xl`}
                style={group.avatar_color ? { backgroundColor: group.avatar_color } : {}}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                {React.createElement(getGroupIcon(group.group_category), {
                  className: "absolute -bottom-6 -right-6 text-white/20 w-32 h-32 transform group-hover:scale-110 transition-transform duration-500"
                })}
                {group.pinned && <Pin className="absolute top-4 left-4 text-white fill-white z-20" size={16} />}
              </div>
              <CardContent className="pt-6 flex-1 relative">
                <div className="absolute -top-10 left-6">
                  <div className={`w-16 h-16 bg-white dark:bg-slate-900 p-1 shadow-sm ${getAvatarShape(group.type)}`}>
                    <div 
                      className={`w-full h-full flex items-center justify-center text-white font-bold text-xl ${getAvatarShape(group.type)} ${!group.avatar_color ? group.color : ''}`}
                      style={group.avatar_color ? { backgroundColor: group.avatar_color } : {}}
                    >
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 z-20">
                  <Button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === group.id ? null : group.id) }} variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white" title="Options">
                    <MoreHorizontal size={20} />
                  </Button>
                  <AnimatePresence>
                    {menuOpen === group.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden py-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button onClick={() => handleRenameClick(group)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <Edit2 size={16} /> Rename Group
                        </button>
                        <button onClick={() => handlePinToggle(group.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <Pin size={16} /> {group.pinned ? 'Unpin Group' : 'Pin Group'}
                        </button>
                        <button onClick={() => handleInfoClick(group.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <Info size={16} /> Group Info
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-1 mx-4" />
                        <button onClick={() => handleDeleteGroup(group.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 size={16} /> Delete Group
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                      {group.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {group.instructor}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="rounded-b-xl border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <Users size={16} />
                  {group.members} members
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                    ))}
                  </div>
                  <Button onClick={() => handleChat(group)} size="sm" variant="outline" className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30">
                    <MessageSquare size={14} />
                    Chat
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
          ))
        )}
      </motion.div>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setDeleteModalOpen(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full border border-slate-100 dark:border-slate-700 relative z-10"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Group?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                Are you sure you want to delete this group? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button onClick={() => setDeleteModalOpen(null)} variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  Cancel
                </Button>
                <Button onClick={confirmDeleteGroup} className="bg-red-600 hover:bg-red-700 text-white border-0">
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Create Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setCreateModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-md w-full border border-slate-100 dark:border-slate-700 relative z-10 max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">Create New Group</h3>
              
              {/* Avatar Generator */}
              <div className="flex flex-col items-center mb-6">
                <div 
                  className={`w-24 h-24 mb-4 flex items-center justify-center text-white font-bold text-3xl shadow-sm ${role === 'faculty' ? 'rounded-md' : role === 'student' ? 'rounded-2xl' : 'rounded-full'}`}
                  style={{ backgroundColor: newGroupInput.avatar_color }}
                >
                  {(newGroupInput.name.charAt(0) || '?').toUpperCase()}
                </div>
                <div className="flex gap-2 flex-wrap justify-center max-w-[200px]">
                  {presetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewGroupInput(prev => ({ ...prev, avatar_color: color }))}
                      className={`w-6 h-6 rounded-full transition-transform ${newGroupInput.avatar_color === color ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Group Name <span className="text-red-500">*</span></label>
                  <Input value={newGroupInput.name} onChange={e => setNewGroupInput(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. CSE 2A Maths" />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Group Type <span className="text-red-500">*</span></label>
                  <select 
                    value={newGroupInput.group_category} 
                    onChange={e => setNewGroupInput(prev => ({ ...prev, group_category: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    {role === 'faculty' && (
                      <>
                        <option value="Subject">Subject Group</option>
                        <option value="Project">Project Group</option>
                        <option value="Study">Study Group</option>
                        <option value="General">General</option>
                      </>
                    )}
                    {role === 'student' && (
                      <>
                        <option value="Study">Study Group</option>
                        <option value="Project">Project Group</option>
                        <option value="General">General</option>
                      </>
                    )}
                    {role === 'hod' && (
                      <>
                        <option value="Faculty Meeting">Faculty Meeting</option>
                        <option value="Department">Department Group</option>
                        <option value="Committee">Committee</option>
                        <option value="Project">Project Group</option>
                        <option value="General">General</option>
                      </>
                    )}
                    {role === 'principal' && (
                      <>
                        <option value="HOD Council">HOD Council</option>
                        <option value="Inter-Department">Inter-Department</option>
                        <option value="Committee">Committee</option>
                        <option value="College-wide">College-wide</option>
                        <option value="General">General</option>
                      </>
                    )}
                  </select>
                </div>

                {role === 'faculty' && newGroupInput.group_category === 'Subject' && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Subject</label>
                    <select 
                      value={newGroupInput.subject_name} 
                      onChange={e => setNewGroupInput(prev => ({ ...prev, subject_name: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a subject...</option>
                      <option value="Maths">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                    </select>
                  </div>
                )}

                {(role === 'faculty') && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Target Students <span className="text-red-500">*</span></label>
                    <div className="flex gap-2 mb-2">
                      <select value={newGroupInput.department} onChange={e => setNewGroupInput(prev => ({...prev, department: e.target.value}))} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs">
                        <option value="">Dept</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                      </select>
                      <select value={newGroupInput.year} onChange={e => setNewGroupInput(prev => ({...prev, year: e.target.value}))} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs">
                        <option value="1st Year">1st Yr</option>
                        <option value="2nd Year">2nd Yr</option>
                        <option value="3rd Year">3rd Yr</option>
                        <option value="4th Year">4th Yr</option>
                      </select>
                      <select value={newGroupInput.section} onChange={e => setNewGroupInput(prev => ({...prev, section: e.target.value}))} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs">
                        <option value="a">Sec A</option>
                        <option value="b">Sec B</option>
                      </select>
                    </div>
                    <div className="text-xs text-slate-500 flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                      <span>{newGroupInput.department ? '42 students match' : 'Select filters to find students'}</span>
                      <Button size="sm" variant="outline" className="h-6 text-xs px-2">Add All</Button>
                    </div>
                  </div>
                )}

                {role === 'student' && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Add Members <span className="text-red-500">*</span></label>
                    <div className="relative mb-2">
                      <Input 
                        value={memberSearch} 
                        onChange={e => handleMemberSearch(e.target.value)} 
                        placeholder="Enter EduSync ID (e.g. STU-CSE-2024-002 or FAC-CSE-001)..." 
                      />
                      {memberSearch && memberSearchResult && (memberSearchResult.role === 'student' || memberSearchResult.role === 'faculty') && (
                        <div className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-2">
                          <div className="flex items-center justify-between px-2 py-1.5">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{memberSearchResult.name}</p>
                              <p className="text-xs text-slate-500">{memberSearchResult.unique_id} · <span className="capitalize">{memberSearchResult.role}</span></p>
                            </div>
                            <Button size="sm" onClick={() => handleAddMember(memberSearchResult)} className="h-7 text-xs bg-indigo-600 text-white">Add</Button>
                          </div>
                        </div>
                      )}
                      {memberSearch && memberSearchResult && (memberSearchResult.role === 'hod' || memberSearchResult.role === 'principal') && (
                        <p className="text-xs text-red-500 mt-1">⛔ HOD and Principal cannot be added to student groups.</p>
                      )}
                      {memberSearch && !memberSearchResult && <p className="text-xs text-red-500 mt-1">No user found with that ID or name.</p>}
                    </div>
                    {addedMembers.filter(m => m.role === 'student' || m.role === 'faculty').length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {addedMembers.filter(m => m.role === 'student' || m.role === 'faculty').map(m => (
                          <span key={m.unique_id} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            m.role === 'faculty'
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                              : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                          }`}>
                            {m.name} <span className="opacity-60">({m.role})</span>
                            <button onClick={() => handleRemoveMember(m.unique_id)}><X size={10}/></button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-1">
                      ⚠ Students and Faculty can be added. HOD &amp; Principal cannot.
                    </div>
                  </div>
                )}

                {role === 'hod' && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Add Members</label>
                    <div className="relative mb-2">
                      <Input 
                        value={memberSearch} 
                        onChange={e => handleMemberSearch(e.target.value)} 
                        placeholder="Enter EduSync ID (e.g. FAC-CSE-001)..." 
                      />
                      {memberSearch && memberSearchResult && memberSearchResult.role === 'faculty' && (
                        <div className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-2">
                          <div className="flex items-center justify-between px-2 py-1.5">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{memberSearchResult.name}</p>
                              <p className="text-xs text-slate-500">{memberSearchResult.unique_id} · {memberSearchResult.department}</p>
                            </div>
                            <Button size="sm" onClick={() => handleAddMember(memberSearchResult)} className="h-7 text-xs bg-indigo-600 text-white">Add</Button>
                          </div>
                        </div>
                      )}
                      {memberSearch && !memberSearchResult && <p className="text-xs text-red-500 mt-1">No faculty found with that ID or name.</p>}
                    </div>
                    {addedMembers.filter(m => m.role === 'faculty').length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {addedMembers.filter(m => m.role === 'faculty').map(m => (
                          <span key={m.unique_id} className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-1 rounded-full">
                            {m.name}
                            <button onClick={() => handleRemoveMember(m.unique_id)}><X size={10}/></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {role === 'principal' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Target (Optional)</label>
                      <div className="flex gap-2">
                         <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full cursor-pointer hover:bg-indigo-200">All College</span>
                         <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full cursor-pointer hover:bg-slate-200">Specific Depts</span>
                         <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full cursor-pointer hover:bg-slate-200">Roles</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Add Members</label>
                      <div className="relative mb-2">
                        <Input 
                          value={memberSearch} 
                          onChange={e => handleMemberSearch(e.target.value)} 
                          placeholder="Enter any EduSync ID (e.g. HOD-CSE-001)..." 
                        />
                        {memberSearch && memberSearchResult && (
                          <div className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-2">
                            <div className="flex items-center justify-between px-2 py-1.5">
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{memberSearchResult.name}</p>
                                <p className="text-xs text-slate-500">{memberSearchResult.unique_id} · {memberSearchResult.role}</p>
                              </div>
                              <Button size="sm" onClick={() => handleAddMember(memberSearchResult)} className="h-7 text-xs bg-indigo-600 text-white">Add</Button>
                            </div>
                          </div>
                        )}
                        {memberSearch && !memberSearchResult && <p className="text-xs text-red-500 mt-1">No user found with that ID or name.</p>}
                      </div>
                      {addedMembers.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {addedMembers.map(m => (
                            <span key={m.unique_id} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded-full">
                              {m.name}
                              <button onClick={() => handleRemoveMember(m.unique_id)}><X size={10}/></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Description</label>
                  <textarea 
                    value={newGroupInput.description} 
                    onChange={e => setNewGroupInput(prev => ({ ...prev, description: e.target.value }))} 
                    placeholder="Optional description" 
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 resize-none h-20"
                  />
                </div>

                {(role === 'faculty' || role === 'hod') && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Auto-add Settings</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={newGroupInput.principal_auto_added} 
                          onChange={e => setNewGroupInput(prev => ({ ...prev, principal_auto_added: e.target.checked }))} 
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Add Principal (default)</span>
                      </label>
                      {role === 'faculty' && (
                        <label className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={newGroupInput.hod_auto_added} 
                            onChange={e => setNewGroupInput(prev => ({ ...prev, hod_auto_added: e.target.checked }))} 
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">Add HOD of dept (default)</span>
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-end">
                <Button onClick={() => setCreateModalOpen(false)} variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  Cancel
                </Button>
                <Button onClick={confirmCreateGroup} disabled={!newGroupInput.name.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 disabled:opacity-50">
                  Create Group
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <AnimatePresence>
        {renameModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setRenameModalOpen(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full border border-slate-100 dark:border-slate-700 relative z-10"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Rename Group</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Enter a new name for this group.</p>
              <Input 
                value={renameInput} 
                onChange={e => setRenameInput(e.target.value)} 
                className="mb-6"
                autoFocus
                onKeyDown={e => { if(e.key === 'Enter') confirmRenameGroup() }}
              />
              <div className="flex gap-3 justify-end">
                <Button onClick={() => setRenameModalOpen(null)} variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  Cancel
                </Button>
                <Button onClick={confirmRenameGroup} className="bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                  Save
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {infoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setInfoModalOpen(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full border border-slate-100 dark:border-slate-700 relative z-10"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Group Info</h3>
                <Button onClick={() => setInfoModalOpen(null)} variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white -mr-2 -mt-2">
                  <MoreHorizontal size={20} className="rotate-45" /> {/* simple cross approximation */}
                </Button>
              </div>
              
              {groupsData.find(g => g.id === infoModalOpen) && (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Name</div>
                    <div className="text-slate-900 dark:text-white">{groupsData.find(g => g.id === infoModalOpen)?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Instructor</div>
                    <div className="text-slate-900 dark:text-white">{groupsData.find(g => g.id === infoModalOpen)?.instructor}</div>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Type</div>
                      <div className="text-slate-900 dark:text-white">{groupsData.find(g => g.id === infoModalOpen)?.type}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Members</div>
                      <div className="text-slate-900 dark:text-white">{groupsData.find(g => g.id === infoModalOpen)?.members}</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setInfoModalOpen(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200">
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    </div>
  )
}
