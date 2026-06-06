import React from 'react'
import { Modal } from './Modal'
import { FileType } from '@/types'

interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  fileUrl: string
  fileName: string
  fileType: FileType | string
}

export function FilePreviewModal({ isOpen, onClose, fileUrl, fileName, fileType }: FilePreviewModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={fileName} size="lg">
      <div className="w-full h-[70vh] bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
        {fileType === 'pdf' || fileType.includes('pdf') ? (
          <iframe src={fileUrl} className="w-full h-full bg-white" />
        ) : fileType === 'image' || fileType.includes('image') ? (
          <img src={fileUrl} alt={fileName} className="max-w-full max-h-full object-contain" />
        ) : fileType === 'video' || fileType.includes('video') ? (
          <video src={fileUrl} controls className="max-w-full max-h-full" />
        ) : (
          <div className="text-center p-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">Preview not available for this file type.</p>
            <a href={fileUrl} download={fileName} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Download File
            </a>
          </div>
        )}
      </div>
    </Modal>
  )
}
