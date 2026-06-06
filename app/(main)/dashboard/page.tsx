'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Users, GraduationCap, BookOpen, Bell, Calendar, ChevronRight, Activity, ArrowUpRight } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PerformanceChart } from '@/components/ui/PerformanceChart'

// Import Dashboard Widgets
import { StatCard } from '@/components/dashboard/StatCard'
import { TodayTimetable } from '@/components/dashboard/TodayTimetable'
import { AttendanceWidget } from '@/components/dashboard/AttendanceWidget'
import { AssignmentWidget } from '@/components/dashboard/AssignmentWidget'
import { AtRiskStudents } from '@/components/dashboard/AtRiskStudents'
import { FacultyPendingTasks } from '@/components/dashboard/FacultyPendingTasks'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export default function Dashboard() {
  const { profile, role } = useAuth()
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
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
            {role === 'student' ? 'Here is your academic overview for today.' :
             role === 'faculty' ? 'Here are your pending tasks and classes.' :
             role === 'hod' ? 'Here is the department overview.' :
             'Here is the college-wide overview.'}
          </p>
        </div>
        <div className="flex gap-3">
          {role !== 'student' && (
            <Button variant="outline" className="gap-2">
              <Activity size={16} /> Generate Report
            </Button>
          )}
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Calendar size={16} /> View Schedule
          </Button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
        
        {/* STUDENT DASHBOARD */}
        {role === 'student' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <motion.div variants={itemVariants}>
                <StatCard title="Current GPA" value="3.8" trend="up" change="+0.2" icon={GraduationCap} bgClass="bg-indigo-100 dark:bg-indigo-500/20" colorClass="text-indigo-600 dark:text-indigo-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="Total Credits" value="112" icon={BookOpen} bgClass="bg-emerald-100 dark:bg-emerald-500/20" colorClass="text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="Unread Messages" value="4" icon={Bell} bgClass="bg-amber-100 dark:bg-amber-500/20" colorClass="text-amber-600 dark:text-amber-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="Active Groups" value="7" icon={Users} bgClass="bg-blue-100 dark:bg-blue-500/20" colorClass="text-blue-600 dark:text-blue-400" />
              </motion.div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <TodayTimetable role={role} />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-6">
                <AttendanceWidget />
                <AssignmentWidget />
              </motion.div>
            </div>
          </>
        )}

        {/* FACULTY DASHBOARD */}
        {role === 'faculty' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <motion.div variants={itemVariants}>
                <StatCard title="Total Students" value="142" icon={Users} bgClass="bg-indigo-100 dark:bg-indigo-500/20" colorClass="text-indigo-600 dark:text-indigo-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="Classes Today" value="3" icon={BookOpen} bgClass="bg-emerald-100 dark:bg-emerald-500/20" colorClass="text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="Pending Approvals" value="12" trend="down" change="-2" icon={Bell} bgClass="bg-amber-100 dark:bg-amber-500/20" colorClass="text-amber-600 dark:text-amber-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="Avg Attendance" value="88%" trend="neutral" change="0%" icon={Activity} bgClass="bg-blue-100 dark:bg-blue-500/20" colorClass="text-blue-600 dark:text-blue-400" />
              </motion.div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                <TodayTimetable role={role} />
                <PerformanceChart />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-6">
                <FacultyPendingTasks />
                <AtRiskStudents />
              </motion.div>
            </div>
          </>
        )}

        {/* HOD DASHBOARD */}
        {role === 'hod' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <motion.div variants={itemVariants}>
                <StatCard title="Dept Students" value="845" icon={Users} bgClass="bg-indigo-100 dark:bg-indigo-500/20" colorClass="text-indigo-600 dark:text-indigo-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="Dept Faculty" value="42" icon={GraduationCap} bgClass="bg-emerald-100 dark:bg-emerald-500/20" colorClass="text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="Pending Approvals" value="28" trend="up" change="+5" icon={Bell} bgClass="bg-amber-100 dark:bg-amber-500/20" colorClass="text-amber-600 dark:text-amber-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="Dept Avg Attendance" value="91%" icon={Activity} bgClass="bg-blue-100 dark:bg-blue-500/20" colorClass="text-blue-600 dark:text-blue-400" />
              </motion.div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <PerformanceChart />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-6">
                <FacultyPendingTasks />
                <AtRiskStudents />
              </motion.div>
            </div>
          </>
        )}

        {/* PRINCIPAL DASHBOARD */}
        {role === 'principal' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <motion.div variants={itemVariants}>
                <StatCard title="Total Students" value="2,854" icon={Users} bgClass="bg-indigo-100 dark:bg-indigo-500/20" colorClass="text-indigo-600 dark:text-indigo-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="Total Faculty" value="184" icon={GraduationCap} bgClass="bg-emerald-100 dark:bg-emerald-500/20" colorClass="text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="Total Departments" value="8" icon={BookOpen} bgClass="bg-purple-100 dark:bg-purple-500/20" colorClass="text-purple-600 dark:text-purple-400" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatCard title="College Avg Attendance" value="89%" icon={Activity} bgClass="bg-blue-100 dark:bg-blue-500/20" colorClass="text-blue-600 dark:text-blue-400" />
              </motion.div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <PerformanceChart />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="h-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-white">Admin Actions</CardTitle>
                    <CardDescription className="text-indigo-100">System management tools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm">
                      User Management <ArrowUpRight size={18} className="opacity-70" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm">
                      Global Announcements <ArrowUpRight size={18} className="opacity-70" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm">
                      System Settings <ArrowUpRight size={18} className="opacity-70" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}

      </motion.div>
    </div>
  )
}
