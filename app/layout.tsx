import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { RealtimeProvider } from '@/providers/RealtimeProvider'

export const metadata: Metadata = {
  title: 'EduSync — The College OS Built for Every Role',
  description: 'EduSync is a structured college communication platform for Indian engineering colleges. Role-based messaging, attendance tracking, marks management, and 3-tier approval workflows — for Principal, HOD, Faculty, and Students.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <RealtimeProvider>
              {children}
            </RealtimeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
