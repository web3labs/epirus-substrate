import React from "react"
import ActivityList from "../activities/ActivityList"
import Box from "../Box"
import ContractList from "../contracts/ContractList"

export default function HomePage () {
  return (
    <div className="content flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-2">
      <Box>
        <ActivityList
          short={true}
          title="Latest Activity"
          description="Contract related activities"
        />
      </Box>
      <Box>
        <ContractList
          short={true}
          title="Latest Contracts"
          description="Contracts deployed"
        />
      </Box>
    </div>
  )
}