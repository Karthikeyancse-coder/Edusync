import React from 'react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  targetId: string
  targetType: 'message' | 'user'
}

export function ReportModal({ isOpen, onClose, targetId, targetType }: ReportModalProps) {
  const [reason, setReason] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) return
    setIsSubmitting(true)
    // Supabase submission will be implemented here
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsSubmitting(false)
    setReason('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Report ${targetType === 'message' ? 'Message' : 'User'}`}>
      <div className="space-y-4 pt-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Please provide a detailed reason for reporting this {targetType}. This will be reviewed by the principal.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for report..."
          rows={4}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50"
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="danger" onClick={handleSubmit} disabled={!reason.trim()} loading={isSubmitting}>
            Submit Report
          </Button>
        </div>
      </div>
    </Modal>
  )
}
