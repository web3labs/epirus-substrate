import React from "react"

export function Warning ({ title, message }: { title: string, message:string }) {
  return (
    <div
      className="flex items-start max-w mb-3 px-2 py-1 border-orange-200 border text-gray-500 bg-white gap-x-2"
      role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 h-7 text-orange-500">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="text-base font-medium" >{title}</div>
        <div className="text-sm font-normal">{message}</div>
      </div>
    </div>
  )
}
