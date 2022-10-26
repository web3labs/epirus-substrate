import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline"
import React, { ReactElement, useState } from "react"

export default function Copy ({ text, children }: {text: string, children: ReactElement}) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="flex gap-2 items-center">
      {children}
      <div className="bg-neutral-100 rounded-full p-1 cursor-pointer hover:bg-neutral-200" onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 1000)
      }}>
        {copied
          ? <CheckIcon width={18} height={18} />
          : <DocumentDuplicateIcon width={18} height={18} />
        }
      </div>
    </div>
  )
}
