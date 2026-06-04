'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Users, GraduationCap, BookOpen, Bell, Calendar, ChevronRight, Activity, ArrowUpRight } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PerformanceChart } from '@/components/ui/PerformanceChart'

const stats = [
  {
    title: 'Total Students',
    value: '2,854',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100 dark:bg-indigo-900/20',
  },
  {
    title: 'Total Faculty',
    value: '184',
    change: '+3%',
    trend: 'up',
    icon: GraduationCap,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
  },
  {
    title: 'Active Courses',
    value: '432',
    change: '0%',
    trend: 'neutral',
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    title: 'Pending Requests',
    value: '28',
    change: '-5%',
    trend: 'down',
    icon: Bell,
    color: 'text-amber-600',
    bg: 'bg-amber-100 dark:bg-amber-900/20',
  },
]

const recentActivity = [
  { id: 1, title: 'New syllabus uploaded for CS101', time: '2 hours ago', type: 'document' },
  { id: 2, title: 'Dr. Smith updated office hours', time: '4 hours ago', type: 'update' },
  { id: 3, title: 'Midterm schedule published', time: 'Yesterday', type: 'announcement' },
  { id: 4, title: 'Server maintenance scheduled', time: 'Yesterday', type: 'system' },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export default function Dashboard() {
  const { profile } = useAuth()
  
  // Format current date beautifully
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">{today}</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {profile?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Here's what's happening at your institution today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar size={16} />
            Schedule
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Activity size={16} />
            Generate Report
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="group hover:shadow-md transition-all duration-300 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-surface/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                      <stat.icon size={24} />
                    </div>
                    <Badge variant={stat.trend === 'up' ? 'success' : stat.trend === 'down' ? 'warning' : 'default'} className="bg-opacity-10 shadow-none">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Performance Chart */}
        <motion.div variants={itemVariants}>
          <PerformanceChart />
        </motion.div>

        {/* Main Content Area Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2/3) - Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates across the campus</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  View All <ChevronRight size={16} className="ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4 sm:px-6 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column (1/3) - Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-indigo-100">Frequently used tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm">
                  Add New Student
                  <ArrowUpRight size={18} className="opacity-70" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm">
                  Create Announcement
                  <ArrowUpRight size={18} className="opacity-70" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm">
                  System Settings
                  <ArrowUpRight size={18} className="opacity-70" />
                </button>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}
