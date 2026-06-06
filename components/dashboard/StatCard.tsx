import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  colorClass: string
  bgClass: string
}

export function StatCard({ title, value, change, trend, icon: Icon, colorClass, bgClass }: StatCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-300 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-surface/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${colorClass} transition-transform duration-300 group-hover:scale-110`}>
            <Icon size={24} />
          </div>
          {change && (
            <Badge variant={trend === 'up' ? 'success' : trend === 'down' ? 'warning' : 'default'} className="bg-opacity-10 shadow-none">
              {change}
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  )
}
