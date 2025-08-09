import { AlertCircle } from 'lucide-react'
import React from 'react'

const ErrorDisplay = ({ error }: { error: string }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center  border-2 border-red-200 rounded-md p-6 bg-custom-light-grey">
            <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <h3 className="text-lg font-semibold text-red-500">Rendering Error</h3>
            </div>
            <div className="border-2 border-red-500 rounded-md p-4 w-full max-w-2xl">
                <p className="text-sm text-red-500 font-mono whitespace-pre-wrap break-words">
                    {error}
                </p>
            </div>
            <p className="text-sm text-white mt-3 text-center">
                Check your JSX syntax and make sure all tags are properly closed.
            </p>
        </div>
    )
}

export default ErrorDisplay