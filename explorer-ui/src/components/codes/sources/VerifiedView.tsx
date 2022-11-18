import React from "react"
import FilesNavigation from "./FilesNavigation"
import MetadataView from "./MetadataView"

export default function VerifiedView (
  { codeHash } :
  { codeHash: string }
) {
  return (
    <>
      <MetadataView codeHash={codeHash} sourceType="build" />
      <FilesNavigation codeHash={codeHash} />
    </>
  )
}
