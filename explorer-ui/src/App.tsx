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
import ActivityList from "./components/activities/ActivityList"
import ContractList from "./components/contracts/ContractList"
import ContractPage from "./components/pages/ContractPage"
import Box from "./components/Box"
import ContractsPage from "./components/pages/ContractsPage"
import ChainContextProvider from "./contexts/ChainContext"
import AccountsPage from "./components/pages/AccountsPage"
import AccountPage from "./components/pages/AccountPage"

const client = createClient({
  url: process.env.SQUID_ENDPOINT || "http://localhost:4350/graphql"
})

function HomePage () {
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
          <ChainContextProvider>
            <div className="min-h-screen bg-neutral-200">
              <div className="relative bg-white pt-3 md:pb-3 border-b border-neutral-300">
                <div className="max-w-7xl mx-auto">
                  <Nav />
                </div>
              </div>
              <main className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<HomePage/>}/>
                  <Route path="accounts" element={<AccountsPage/>} />
                  <Route path="accounts/:id" element={<AccountPage/>} />
                  <Route path="contracts/:id" element={<ContractPage/>} />
                  <Route path="contracts" element={<ContractsPage/>} />
                </Routes>
              </main>
            </div>
          </ChainContextProvider>
        </Router>
      </Provider>
    </ThemeProvider>
  )
}

export default App
