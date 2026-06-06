import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function AtRiskStudents() {
  const students = [
    { id: 'STU-001', name: 'John Doe', metric: 'Attendance', value: '45%', severity: 'high' },
    { id: 'STU-042', name: 'Jane Smith', metric: 'Marks', value: 'Failing 3 subjects', severity: 'medium' },
    { id: 'STU-105', name: 'Mike Ross', metric: 'Attendance', value: '58%', severity: 'medium' },
  ]

  return (
    <Card className="h-full border-red-100 dark:border-red-900/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-red-50/50 dark:bg-red-500/5 rounded-t-2xl">
        <CardTitle className="text-lg flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle size={20} />
          At-Risk Students
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-red-600">
          View All <ChevronRight size={16} />
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">{student.name} <span className="text-xs font-normal text-slate-500">({student.id})</span></p>
                <p className="text-xs font-medium mt-1 flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <span className={student.severity === 'high' ? 'text-red-500 font-bold' : 'text-amber-500 font-bold'}>
                    {student.value}
                  </span>
                  in {student.metric}
                </p>
              </div>
              <Button size="sm" variant="outline" className="h-8">Message</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
