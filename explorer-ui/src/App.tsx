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
import ContractPage from "./components/pages/ContractPage"
import ContractsPage from "./components/pages/ContractsPage"
import ChainContextProvider from "./contexts/ChainContext"
import AccountsPage from "./components/pages/AccountsPage"
import AccountPage from "./components/pages/AccountPage"
import HomePage from "./components/pages/HomePage"

const client = createClient({
  url: process.env.SQUID_ENDPOINT || "http://localhost:4350/graphql"
})

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
              <div className="relative bg-white pt-3 border-b border-neutral-300 md:pb-3 md:mt-3">
                <div className="max-w-7xl mx-auto md:px-2">
                  <Nav />
                </div>
              </div>
              <main className="max-w-7xl mx-auto">
                <Routes>
                  <Route index element={<HomePage/>}/>
                  <Route path="accounts" element={<AccountsPage/>} />
                  <Route path="accounts/:id/*" element={<AccountPage/>} />
                  <Route path="contracts" element={<ContractsPage/>} />
                  <Route path="contracts/:id/*" element={<ContractPage/>} />
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
