import Nav from "./components/Nav"
import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom"

import { createClient, Provider } from "urql"
import { ThemeProvider } from "styled-components"
import colors from "tailwindcss/colors"
import ListContractActivities from "./components/contracts/ListContractActivities"
import ListContracts from "./components/contracts/ListContracts"
import ContractPage from "./components/contracts/ContractPage"
import Box from "./components/Box"
import ContractsPage from "./components/contracts/ContractsPage"

const client = createClient({
  url: process.env.SQUID_ENDPOINT || "http://localhost:4350/graphql"
})

function HomePage () {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-2">
      <Box>
        <ListContractActivities
          short={true}
          title="Latest Transactions"
          description="Contract related extrinsics"
        />
      </Box>
      <Box>
        <ListContracts
          short={true}
          title="Latest Contracts"
          description="Contracts deployed"
        />
      </Box>
    </div>
  )
}

function App () {
  return (
    <ThemeProvider theme={{
      reactDatepicker: {
        colors: {
          selectedDay: colors.purple[300],
          selectedDayHover: colors.purple[400],
          primaryColor: colors.purple[500]
        }
      }
    }}>
      <Provider value={client}>
        <Router>
          <div className="min-h-screen bg-neutral-200">
            <div className="relative bg-white pt-3 md:pb-3 border-b border-neutral-300">
              <div className="max-w-7xl mx-auto md:px-4">
                <Nav />
              </div>
            </div>
            <main className="max-w-7xl mx-auto md:px-4 pt-6">
              <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="contracts/:id" element={<ContractPage/>} />
                <Route path="contracts" element={<ContractsPage/>} />
              </Routes>
            </main>
          </div>
        </Router>
      </Provider>
    </ThemeProvider>
  )
}

export default App
