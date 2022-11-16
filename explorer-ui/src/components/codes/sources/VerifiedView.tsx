import React from "react"
import FilesNavigation from "./FilesNavigation"
import MetadataView from "./MetadataView"

export default function VerifiedView (
  { codeHash } :
  { codeHash: string }
) {
  return (
    <div className="content">
      <MetadataView codeHash={codeHash} />
      <FilesNavigation codeHash={codeHash} />
    </div>
  )
}
