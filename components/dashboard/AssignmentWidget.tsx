import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Clock, FileText, Upload } from 'lucide-react'

export function AssignmentWidget() {
  const assignments = [
    { id: 1, subject: 'Data Structures', title: 'Binary Trees Implementation', due: 'Tomorrow, 11:59 PM', status: 'pending' },
    { id: 2, subject: 'Algorithms', title: 'Dynamic Programming Set', due: 'In 3 days', status: 'pending' },
    { id: 3, subject: 'Operating Systems', title: 'Process Scheduling', due: 'Submitted', status: 'submitted' },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText size={20} className="text-amber-500" />
          Pending Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mt-2">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{assignment.subject}</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{assignment.title}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <Clock size={12} /> {assignment.due}
                </div>
              </div>
              {assignment.status === 'pending' ? (
                <Button size="sm" variant="outline" className="shrink-0 h-8 text-xs gap-1">
                  <Upload size={14} /> Submit
                </Button>
              ) : (
                <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md shrink-0">
                  Done
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
