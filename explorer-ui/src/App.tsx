import Nav from "./components/Nav"
import React from "react"

import { createClient, Provider } from "urql"
import ListContractActivity from "./components/contracts/ListContractActivity"
import ListContract from "./components/contracts/ListContract"

const client = createClient({
  url: process.env.SQUID_ENDPOINT || "http://localhost:4350/graphql"
})

function App () {
  return (
    <Provider value={client}>
      <div className="v-screen h-screen bg-neutral-200">
        <div className="relative bg-white pt-3 md:pb-3 border-b border-neutral-300">
          <div className="max-w-7xl mx-auto md:px-4">
            <Nav />
          </div>
        </div>
        <main className="max-w-7xl mx-auto md:px-4 pt-6">
          <div className="flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-2">
            <ListContractActivity />
            <ListContract />
          </div>
        </main>
      </div>
    </Provider>
  )
}

export default App
