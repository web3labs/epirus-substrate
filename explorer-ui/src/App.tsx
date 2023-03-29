import MainNav from "./components/navigation/MainNav"
import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom"

import { createClient, Provider } from "urql"
import { ThemeProvider } from "styled-components"
import colors from "tailwindcss/colors"
import ContractPage from "./components/contracts/ContractPage"
import ContractsPage from "./components/contracts/ContractsPage"
import ChainContextProvider from "./contexts/ChainContext"
import AccountsPage from "./components/accounts/AccountsPage"
import AccountPage from "./components/accounts/AccountPage"
import HomePage from "./components/HomePage"
import { Toaster } from "react-hot-toast"
import CodePage from "./components/codes/CodePage"
import CodesPage from "./components/codes/CodesPage"
import ActivitiesPage from "./components/activities/ActivitiesPage"
import BlocksPage from "./components/blocks/BlocksPage"
import BlockPage from "./components/blocks/BlockPage"
import ExtrinsicPage from "./components/extrinsics/ExtrinsicPage"

const client = createClient({
  url: window.__RUNTIME_CONFIG__?.REACT_APP_SQUID_ENDPOINT ||
    process.env.REACT_APP_SQUID_ENDPOINT ||
    "http://localhost:4350/graphql"
})

const archiveClient = createClient({
  url: window.__RUNTIME_CONFIG__?.REACT_APP_SQUID_ARCHIVE_ENDPOINT ||
    process.env.REACT_APP_SQUID_ARCHIVE_ENDPOINT ||
    "http://localhost:4444/graphql"
})

function App () {
  return (
    <ThemeProvider theme={{
      reactDatepicker: {
        colors: {
          selectedDay: colors.blue[300],
          selectedDayHover: colors.blue[400],
          primaryColor: colors.blue[500]
        },
        inputLabelMargin: "0px",
        inputLabelBorderRadius: "0px",
        inputLabelBorder: `1px solid ${colors.gray[200]}`,
        datepickerZIndex: 10
      }
    }}>
      <Provider value={client}>
        <Router>
          <ChainContextProvider>
            <Toaster position="bottom-right"/>
            <div className="min-h-screen bg-page overflow-hidden">
              <div className="relative header pt-3 md:pb-3 md:pt-6">
                <div className="max-w-7xl mx-auto md:px-2">
                  <MainNav />
                </div>
              </div>
              <main className="max-w-7xl mx-auto z-10">
                <Routes>
                  <Route index element={<HomePage/>}/>
                  <Route path="accounts" element={<AccountsPage/>} />
                  <Route path="accounts/:id/*" element={<AccountPage/>} />
                  <Route path="contracts" element={<ContractsPage/>} />
                  <Route path="contracts/:id/*" element={<ContractPage/>} />
                  <Route path="codes" element={<CodesPage/>} />
                  <Route path="codes/:id/*" element={<CodePage/>} />
                  <Route path="activities" element={<ActivitiesPage/>} />
                </Routes>
              </main>
            </div>
          </ChainContextProvider>
        </Router>
      </Provider>
      <Provider value={archiveClient}>
        <Router>
          <ChainContextProvider>
            <Routes>
              <Route path="extrinsic/:id/*" element={<ExtrinsicPage/>} />
              <Route path="blocks" element={<BlocksPage/>} />
              <Route path="blocks/:id/*" element={<BlockPage/>} />
            </Routes>
          </ChainContextProvider>
        </Router>
      </Provider>
    </ThemeProvider>
  )
}

export default App
