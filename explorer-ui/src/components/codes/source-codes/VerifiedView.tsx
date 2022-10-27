import React, { useEffect, useState } from "react"
import { useChainProperties } from "../../../contexts/ChainContext"
import api from "./verifierApi"
// import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
// import hljs from "highlight.js/lib/common"
// import "highlight.js/styles/github.css"
// import Copy from "../../commons/Copy"
// import { classNames } from "../../../utils/strings"

export default function VerifiedView ({
  id
} : {
  id: string
}) {
  const { info } = useChainProperties()
  const [source, setSource] = useState("")

  useEffect(() => {
    async function loadSource () {
      try {
        const data = await api.resources({ chain: info, codeHash: id })
        console.log(data)
        setSource(data)
      } catch (error) {
        // TODO: handle error
        console.log(error)
      }
    }
    if (source === "") {
      loadSource()
    }
  }, [])

  return (
    <div>Verified</div>
  )

  // function toggleExpanded () {
  //   setExpanded(prev => !prev)
  // }

  // const highlightedJson = hljs.highlight(JSON.stringify(abi, null, 2), { language: "json" }).value
  // const highlightedInk = hljs.highlight(source, { language: "rust" }).value
  // return (
  //   <>
  //     <div className="px-4 pt-4 pb-2 flex text-neutral-500">
  //       <div className="pr-2 text-sm font-semibold">Contract Source Code</div>
  //     </div>

  //     <div className="my-2 mx-4 border border-neutral-200 rounded text-xs">
  //       <div className="p-2 flex justify-between bg-neutral-100 items-center">
  //         <div className="font-mono">lib.rs</div>
  //         <div className="grid grid-cols-2 gap-2 items-center">
  //           <Copy text={source}/>
  //           <div className="bg-neutral-100 rounded-full p-1 cursor-pointer hover:bg-neutral-200">
  //             {
  //               expanded
  //                 ? <ArrowsPointingInIcon width={18} height={18} onClick={toggleExpanded}/>
  //                 : <ArrowsPointingOutIcon width={18} height={18} onClick={toggleExpanded}/>
  //             }
  //           </div>
  //         </div>
  //       </div>
  //       <pre className={classNames(
  //         expanded ? "" : "break-normal max-h-80 overflow-y-auto scroll-smooth",
  //         "github p-2"
  //       )}>
  //         <code dangerouslySetInnerHTML={{ __html: highlightedInk }}/>
  //       </pre>
  //     </div>
  //   </>
  // )
}
