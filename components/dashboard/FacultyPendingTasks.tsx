import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CheckSquare, ListTodo, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function FacultyPendingTasks() {
  const tasks = [
    { id: 1, title: 'Approve 5 Message Broadcasts', type: 'approval', icon: UserCheck, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
    { id: 2, title: 'Mark Attendance for CS101', type: 'attendance', icon: CheckSquare, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/20' },
    { id: 3, title: 'Grade 34 Midterm Papers', type: 'grading', icon: ListTodo, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Action Required</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${task.bg} ${task.color}`}>
                <task.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{task.title}</p>
                <Button variant="ghost" className="h-auto p-0 text-xs text-indigo-600 mt-0.5 hover:bg-transparent hover:underline">
                  Action now →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
