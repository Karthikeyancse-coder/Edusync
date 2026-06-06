'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight, Pencil, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
const SUBJECTS = ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks', 'Database Systems', 'Software Engineering', 'Discrete Math', 'Web Development']
const ROOMS = ['Room 401', 'Room 402', 'Room 403', 'Lab 1', 'Lab 2', 'Seminar Hall A', 'Seminar Hall B']
const COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
  'bg-rose-500', 'bg-blue-500', 'bg-teal-500', 'bg-orange-500'
]

const initialSlots = [
  { id: 1, day: 'Monday', time: '09:00', subject: 'Data Structures', room: 'Room 401', faculty: 'Dr. Alan Turing', duration: 1, color: 'bg-indigo-500' },
  { id: 2, day: 'Monday', time: '11:00', subject: 'Algorithms', room: 'Lab 1', faculty: 'Dr. Grace Hopper', duration: 1, color: 'bg-emerald-500' },
  { id: 3, day: 'Tuesday', time: '09:00', subject: 'Operating Systems', room: 'Room 402', faculty: 'Prof. Linus T.', duration: 2, color: 'bg-violet-500' },
  { id: 4, day: 'Wednesday', time: '10:00', subject: 'Computer Networks', room: 'Room 403', faculty: 'Dr. Vint Cerf', duration: 1, color: 'bg-amber-500' },
  { id: 5, day: 'Thursday', time: '14:00', subject: 'Database Systems', room: 'Lab 2', faculty: 'Dr. E.F. Codd', duration: 1, color: 'bg-rose-500' },
  { id: 6, day: 'Friday', time: '09:00', subject: 'Software Engineering', room: 'Seminar Hall A', faculty: 'Dr. Alan Kay', duration: 2, color: 'bg-blue-500' },
]

type Slot = typeof initialSlots[0]

export default function TimetablePage() {
  const { role } = useAuth()
  const [slots, setSlots] = useState<Slot[]>(initialSlots)
  const [weekOffset, setWeekOffset] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null)
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null)
  const [form, setForm] = useState({
    day: 'Monday', time: '09:00', subject: '', room: '', faculty: '', duration: 1, color: COLORS[0]
  })
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')
  const [selectedDay, setSelectedDay] = useState('Monday')

  // Get week dates based on offset
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)
  const weekDates = DAYS.map((_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d
  })

  const getSlotForCell = (day: string, time: string) =>
    slots.find(s => s.day === day && s.time === time) || null

  const openCreate = () => {
    setEditingSlot(null)
    setForm({ day: 'Monday', time: '09:00', subject: '', room: '', faculty: '', duration: 1, color: COLORS[0] })
    setIsModalOpen(true)
  }

  const openEdit = (slot: Slot) => {
    setEditingSlot(slot)
    setForm({ day: slot.day, time: slot.time, subject: slot.subject, room: slot.room, faculty: slot.faculty, duration: slot.duration, color: slot.color })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!form.subject || !form.room) return
    if (editingSlot) {
      setSlots(prev => prev.map(s => s.id === editingSlot.id ? { ...s, ...form } : s))
    } else {
      setSlots(prev => [...prev, { id: Date.now(), ...form }])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setSlots(prev => prev.filter(s => s.id !== id))
  }

  const canEdit = role === 'faculty' || role === 'hod' || role === 'principal'
  const displayDays = viewMode === 'day' ? [selectedDay] : DAYS

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Timetable</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {role === 'student' ? 'Your class schedule for the week.' : 'Manage and view the class schedule.'}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* View Mode */}
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {(['week', 'day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors capitalize",
                  viewMode === v
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >{v}</button>
            ))}
          </div>
          {/* Week Navigation */}
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
            <button onClick={() => setWeekOffset(w => w - 1)} className="text-slate-500 hover:text-indigo-600 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
              {weekOffset === 0 ? 'This Week' : weekOffset === 1 ? 'Next Week' : weekOffset === -1 ? 'Last Week' : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
            </span>
            <button onClick={() => setWeekOffset(w => w + 1)} className="text-slate-500 hover:text-indigo-600 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
          {canEdit && (
            <Button onClick={openCreate} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus size={16} /> Add Slot
            </Button>
          )}
        </div>
      </motion.div>

      {/* Day Selector for Day View */}
      {viewMode === 'day' && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border",
                selectedDay === day
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >{day}</button>
          ))}
        </div>
      )}

      {/* Timetable Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="w-24 p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 text-left border-b border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    Time
                  </th>
                  {displayDays.map((day, i) => {
                    const date = viewMode === 'week' ? weekDates[DAYS.indexOf(day)] : null
                    const isToday = date && date.toDateString() === today.toDateString()
                    return (
                      <th key={day} className={cn(
                        "p-3 text-xs font-semibold text-center border-b border-r border-slate-200 dark:border-slate-800 last:border-r-0 bg-slate-50 dark:bg-slate-900/50",
                        isToday ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                      )}>
                        <div>{day.slice(0, 3)}</div>
                        {date && (
                          <div className={cn(
                            "text-lg font-bold mt-0.5",
                            isToday ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-200"
                          )}>
                            {date.getDate()}
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map(time => (
                  <tr key={time}>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-400 border-r border-b border-slate-200 dark:border-slate-800 font-mono whitespace-nowrap bg-slate-50/50 dark:bg-slate-900/30">
                      {time}
                    </td>
                    {displayDays.map(day => {
                      const slot = getSlotForCell(day, time)
                      return (
                        <td
                          key={`${day}-${time}`}
                          className="border-r border-b border-slate-200 dark:border-slate-800 last:border-r-0 relative p-1 min-h-[60px] align-top"
                        >
                          {slot && (
                            <div
                              className={cn(
                                "relative group rounded-lg p-2 cursor-pointer transition-all duration-200 text-white",
                                slot.color,
                                "hover:brightness-110 shadow-sm"
                              )}
                              onMouseEnter={() => setHoveredSlot(slot.id)}
                              onMouseLeave={() => setHoveredSlot(null)}
                            >
                              <p className="text-xs font-semibold truncate">{slot.subject}</p>
                              <div className="flex items-center gap-1 mt-1 text-white/80 text-[10px]">
                                <MapPin size={9} />
                                <span className="truncate">{slot.room}</span>
                              </div>
                              {role === 'student' && (
                                <div className="text-white/70 text-[10px] truncate mt-0.5">{slot.faculty}</div>
                              )}
                              {canEdit && hoveredSlot === slot.id && (
                                <div className="absolute top-1 right-1 flex gap-1">
                                  <button
                                    onClick={() => openEdit(slot)}
                                    className="w-5 h-5 bg-white/20 hover:bg-white/40 rounded flex items-center justify-center transition-colors"
                                  >
                                    <Pencil size={10} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(slot.id)}
                                    className="w-5 h-5 bg-white/20 hover:bg-red-400/60 rounded flex items-center justify-center transition-colors"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-6">
        {slots.filter((s, i, a) => a.findIndex(x => x.subject === s.subject) === i).map(slot => (
          <div key={slot.subject} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-sm", slot.color)} />
            <span className="text-xs text-slate-600 dark:text-slate-400">{slot.subject}</span>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingSlot ? 'Edit Slot' : 'Add New Slot'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Day</label>
                    <select
                      value={form.day}
                      onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {DAYS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Start Time</label>
                    <select
                      value={form.time}
                      onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Subject...</option>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Room</label>
                  <select
                    value={form.room}
                    onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Room...</option>
                    {ROOMS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Duration (hours)</label>
                  <select
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {[1, 2, 3].map(d => <option key={d} value={d}>{d} hour{d > 1 ? 's' : ''}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setForm(f => ({ ...f, color }))}
                        className={cn(
                          "w-7 h-7 rounded-full transition-all",
                          color,
                          form.color === color ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "hover:scale-110"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                  {editingSlot ? 'Save Changes' : 'Add Slot'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
