import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import BrowseSchemes from './pages/BrowseSchemes'
import SchemeDetail from './pages/SchemeDetail'
import SituationSearch from './pages/SituationSearch'
import EligibilityCheck from './pages/EligibilityCheck'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  const [showConsentBanner, setShowConsentBanner] = useState(true)

  const handleConsentChoice = (choice) => {
    setShowConsentBanner(false)
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schemes" element={<BrowseSchemes />} />
            <Route path="/schemes/:id" element={<SchemeDetail />} />
            <Route path="/situations" element={<SituationSearch />} />
            <Route path="/eligibility" element={<EligibilityCheck />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        <Footer />

        {showConsentBanner && (
          <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.16)] backdrop-blur-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-800">Security and privacy consent</p>
                  <p className="mt-1 text-sm text-gray-700">
                    By continuing, you confirm that you will follow our security policies, respect privacy requirements,
                    and understand that any personal information shared will be used only for the intended service purposes.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => handleConsentChoice('declined')}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConsentChoice('accepted')}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-900"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  )
}
