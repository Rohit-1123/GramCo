import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import BrowseSchemes from './pages/BrowseSchemes'
import SchemeDetail from './pages/SchemeDetail'
import SituationSearch from './pages/SituationSearch'
import EligibilityCheck from './pages/EligibilityCheck'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schemes" element={<BrowseSchemes />} />
            <Route path="/schemes/:id" element={<SchemeDetail />} />
            <Route path="/situations" element={<SituationSearch />} />
            <Route path="/eligibility" element={<EligibilityCheck />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
