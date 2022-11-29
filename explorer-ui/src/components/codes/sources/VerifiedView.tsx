import React, { Dispatch } from "react"
import { SourceTabAction } from "../../../types/componentStates"
import FilesNavigation from "./FilesNavigation"
import MetadataView from "./MetadataView"

export default function VerifiedView (
  { codeHash, dispatch } :
  { codeHash: string,
    dispatch: Dispatch<SourceTabAction>
   }
) {
  return (
    <>
      <MetadataView codeHash={codeHash} sourceType="build" dispatch={dispatch}/>
      <FilesNavigation codeHash={codeHash} />
    </>
  )
}
