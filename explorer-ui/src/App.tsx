import Nav from "./components/Nav"
import List from "./components/List"
import React from "react"
import MockCalls from "./_mocks/MockExtrinsics"

function App () {
  return (
    <div className="v-screen h-screen bg-neutral-200">
      <div className="relative bg-white pt-3 md:pb-3 border-b border-neutral-300">
        <div className="max-w-7xl mx-auto md:px-4">
          <Nav />
        </div>
      </div>
      <main className="max-w-7xl mx-auto md:px-4 pt-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-2">
          <List title="Latest Transactions" description="Contract related extrinsics" items={MockCalls()} />
          <List title="Latest Contracts" items={MockCalls()} />
        </div>
      </main>
    </div>
  )
}

export default App
