'use client'
import { UploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import { Inbox, Loader2 } from 'lucide-react'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'

const FileUpload = () => {
    const [uploading, setUploading] = React.useState(false)

    const { mutate, isLoading } = useMutation({
        mutationFn: async ({
            file_key,
            file_name
        }: {
            file_key: string,
            file_name: string
        }) => {
            const response = await axios.post('/api/create-chat', {
                file_key,
                file_name
            })
            return response.data
        }
    })

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles)
            const file = acceptedFiles[0]
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size more than 10MB!')
                return
            }

            try {
                setUploading(true)
                const data = await UploadToS3(file)
                if (!data?.file_key || !data.file_name) {
                    toast.error('Error uploading file')
                    return
                }
                mutate(data, {
                    onSuccess: (data) => {
                        toast.success(data.message)
                    },
                    onError: (error) => {
                        toast.error('Error creating chat')
                    }
                })
                console.log('data', data)
            } catch (error) {
                console.log('error', error)
            } finally {
                setUploading(false)
            }
        }
    })
    return (
        <div className="p-2 bg-white rounded-xl">
            <div {...getRootProps({
                className: 'p-8 border-dashed border-2 border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:border-gray-500 transition-colors duration-300 ease-in-out'
            })}>
                <input {...getInputProps()} />
                {(uploading || isLoading) ? (
                    <>
                    {/*Loading state */}
                    <Loader2  className='w-10 h-10 text-blue-500 animate-spin' />
                    <p className='mt-2 text-sm'>
                        Spilling tea...
                    </p>
                    </>
                ) : (

                    <>
                        <Inbox className='w-10 h-10 text-blue-500' />
                        <p className='mt-2 text-sm text-slate-500'>Drop PDF here</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default FileUpload