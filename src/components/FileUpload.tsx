'use client'
import { UploadToS3 } from '@/lib/s3'
import { Inbox } from 'lucide-react'
import React from 'react'
import { useDropzone } from 'react-dropzone'

const FileUpload = () => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: {'application/pdf': ['.pdf']},
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles)
            const file = acceptedFiles[0]
            if (file.size > 10 * 1024 * 1024) {
                alert('Please upload smaller size file!')
                return
            }

            try {
                const data = await UploadToS3(file)
                console.log('data', data)
            } catch (error) {
                console.log('error', error)
            }
        }
    })
  return (
    <div className="p-2 bg-white rounded-xl">
        <div {...getRootProps({
            className: 'p-8 border-dashed border-2 border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:border-gray-500 transition-colors duration-300 ease-in-out'
        })}>
            <input {...getInputProps()} />
            <>
                <Inbox className='w-10 h-10 text-blue-500'/>
                <p className='mt-2 text-sm text-slate-500'>Drop PDF here</p>
            </>
        </div>
    </div>
  )
}

export default FileUpload