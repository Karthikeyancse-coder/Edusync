import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Calendar, Clock, MapPin } from 'lucide-react'

export function TodayTimetable({ role }: { role: string }) {
  // Mock data for today
  const slots = [
    { id: 1, subject: 'Data Structures', time: '09:00 AM - 10:30 AM', room: 'Room 402', faculty: 'Dr. Alan Turing' },
    { id: 2, subject: 'Algorithms', time: '11:00 AM - 12:30 PM', room: 'Room 405', faculty: 'Dr. Grace Hopper' },
    { id: 3, subject: 'Operating Systems', time: '01:30 PM - 03:00 PM', room: 'Lab 1', faculty: 'Prof. Linus Torvalds' },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar size={20} className="text-indigo-500" />
          Today's Timetable
        </CardTitle>
      </CardHeader>
      <CardContent>
        {slots.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No classes scheduled for today.</p>
        ) : (
          <div className="space-y-4 mt-2">
            {slots.map((slot) => (
              <div key={slot.id} className="relative pl-4 border-l-2 border-indigo-500/30">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{slot.subject}</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1"><Clock size={12} /> {slot.time}</div>
                  <div className="flex items-center gap-1"><MapPin size={12} /> {slot.room}</div>
                  {role === 'student' && <div className="text-slate-400 font-medium">By {slot.faculty}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
