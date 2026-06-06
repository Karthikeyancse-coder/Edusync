import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getAttendanceColor } from '@/lib/utils'

export function AttendanceWidget() {
  const attendance = [
    { subject: 'Data Structures', percentage: 85 },
    { subject: 'Algorithms', percentage: 72 },
    { subject: 'Operating Systems', percentage: 94 },
    { subject: 'Computer Networks', percentage: 55 },
  ]

  const overall = Math.round(attendance.reduce((a, b) => a + b.percentage, 0) / attendance.length)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-sm text-slate-500">Overall Attendance</p>
            <h3 className={`text-2xl font-bold ${overall >= 75 ? 'text-emerald-500' : overall >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
              {overall}%
            </h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getAttendanceColor(overall)}`}>
            {overall >= 75 ? 'Good' : overall >= 60 ? 'Warning' : 'Critical'}
          </div>
        </div>
        
        <div className="space-y-4">
          {attendance.map((subj, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">{subj.subject}</span>
                <span className={subj.percentage < 75 ? 'text-amber-500 font-bold' : 'text-slate-500'}>{subj.percentage}%</span>
              </div>
              <ProgressBar 
                value={subj.percentage} 
                height="h-1.5" 
                color={subj.percentage >= 75 ? 'bg-emerald-500' : subj.percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'} 
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
