import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Landing from "./pages/Landing"
import Upload from "./pages/Upload"
import MyFiles from "./pages/MyFiles"
import Subscription from "./pages/Subscription"
import Transaction from "./pages/Transaction"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/upload" element={<Upload />}/>
        <Route path="/my-files" element={<MyFiles />}/>
        <Route path="/subscriptions" element={<Subscription />}/>
        <Route path="/transaction" element={<Transaction />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App