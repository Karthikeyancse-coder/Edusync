'use client'

import React from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { Users, MoreHorizontal, UserPlus, BookOpen, MessageSquare, Search, Edit2, Trash2, Pin, Info, Camera } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

const groups = [
  { id: 1, name: 'Advanced Mathematics', instructor: 'Dr. Sarah Jenkins', members: 124, type: 'Course', color: 'bg-indigo-500', pinned: false },
  { id: 2, name: 'Computer Science 101', instructor: 'Prof. Alan Turing', members: 340, type: 'Course', color: 'bg-emerald-500', pinned: false },
  { id: 3, name: 'Physics Department', instructor: 'Dr. Marie Curie', members: 45, type: 'Department', color: 'bg-violet-500', pinned: false },
  { id: 4, name: 'Student Council', instructor: 'Admin Principal', members: 12, type: 'Club', color: 'bg-amber-500', pinned: false },
  { id: 5, name: 'Literature 204', instructor: 'Dr. Jane Austen', members: 86, type: 'Course', color: 'bg-rose-500', pinned: false },
  { id: 6, name: 'Faculty Lounge', instructor: 'Admin Principal', members: 184, type: 'Private', color: 'bg-blue-500', pinned: false },
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

type GroupData = {
  id: number
  name: string
  instructor: string
  members: number
  type: string
  color: string
  pinned: boolean
  imageUrl?: string
}

export default function Groups() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterType, setFilterType] = React.useState('All')
  const [groupsData, setGroupsData] = React.useState<GroupData[]>(groups)
  const [menuOpen, setMenuOpen] = React.useState<number | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<number | null>(null)
  const [renameModalOpen, setRenameModalOpen] = React.useState<number | null>(null)
  const [renameInput, setRenameInput] = React.useState('')
  const [infoModalOpen, setInfoModalOpen] = React.useState<number | null>(null)
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [newGroupInput, setNewGroupInput] = React.useState({ name: '', instructor: '', type: 'Course', imageUrl: '' })

  const dynamicFilterTypes = ['All', ...Array.from(new Set(groupsData.map(g => g.type)))]

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
    if (newGroupInput.name.trim() && newGroupInput.instructor.trim()) {
      const newGroup = {
        id: Date.now(),
        name: newGroupInput.name,
        instructor: newGroupInput.instructor,
        members: 1,
        type: newGroupInput.type || 'Course',
        color: 'bg-emerald-500',
        pinned: false,
        imageUrl: newGroupInput.imageUrl || undefined
      }
      setGroupsData(prev => [newGroup, ...prev])
      setCreateModalOpen(false)
      setNewGroupInput({ name: '', instructor: '', type: 'Course', imageUrl: '' })
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
              <div className={`h-24 ${group.color} relative overflow-hidden rounded-t-xl`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <BookOpen className="absolute -bottom-6 -right-6 text-white/20 w-32 h-32 transform group-hover:scale-110 transition-transform duration-500" />
                {group.pinned && <Pin className="absolute top-4 left-4 text-white fill-white z-20" size={16} />}
              </div>
              <CardContent className="pt-6 flex-1 relative">
                <div className="absolute -top-10 left-6">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-sm">
                    {group.imageUrl ? (
                      <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className={`w-full h-full rounded-xl ${group.color} flex items-center justify-center text-white font-bold text-xl`}>
                        {group.name.charAt(0)}
                      </div>
                    )}
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
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full border border-slate-100 dark:border-slate-700 relative z-10"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">Create New Group</h3>
              
              <div className="flex justify-center mb-6">
                <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer overflow-hidden group">
                  {newGroupInput.imageUrl ? (
                    <img src={newGroupInput.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                      <Camera size={28} className="mb-1" />
                      <span className="text-[10px] font-medium uppercase tracking-wider">Photo</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        setNewGroupInput(prev => ({ ...prev, imageUrl: url }));
                      }
                    }}
                  />
                  {newGroupInput.imageUrl && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-white text-xs font-medium">Change</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Group Name</label>
                  <Input value={newGroupInput.name} onChange={e => setNewGroupInput(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Science 101" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Instructor Name</label>
                  <Input value={newGroupInput.instructor} onChange={e => setNewGroupInput(prev => ({ ...prev, instructor: e.target.value }))} placeholder="e.g. Dr. Smith" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Group Type</label>
                  <Input 
                    value={newGroupInput.type} 
                    onChange={e => setNewGroupInput(prev => ({ ...prev, type: e.target.value }))} 
                    placeholder="e.g. Subject, Course, Department" 
                    list="group-types" 
                  />
                  <datalist id="group-types">
                    {Array.from(new Set(groupsData.map(g => g.type))).map(t => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button onClick={() => setCreateModalOpen(false)} variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  Cancel
                </Button>
                <Button onClick={confirmCreateGroup} className="bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                  Create
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
