import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'HI', full: 'Hindi' },
  { code: 'ta', label: 'TA', full: 'Tamil' },
  { code: 'te', label: 'TE', full: 'Telugu' },
  { code: 'kn', label: 'KN', full: 'Kannada' },
  { code: 'mr', label: 'MR', full: 'Marathi' },
  { code: 'bn', label: 'BN', full: 'Bengali' },
  { code: 'gu', label: 'GU', full: 'Gujarati' },
  { code: 'pa', label: 'PA', full: 'Punjabi' },
  { code: 'ml', label: 'ML', full: 'Malayalam' },
  { code: 'or', label: 'OR', full: 'Odia' },
]

function applyGoogleTranslateLanguage(code, attempt = 0) {
  if (code === 'en') {
    return
  }

  const select = document.querySelector('.goog-te-combo')
  if (select) {
    select.value = code
    select.dispatchEvent(new Event('change', { bubbles: true }))
    return
  }

  if (attempt < 20) {
    window.setTimeout(() => applyGoogleTranslateLanguage(code, attempt + 1), 200)
  }
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/schemes', label: 'Browse Schemes' },
  { to: '/situations', label: 'By Situation' },
  { to: '/eligibility', label: 'Check Eligibility' },
  { to: '/privacy-policy', label: 'Privacy & Terms' },
]

function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('en')
  const ref = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('gramco_lang') || 'en'
    setSelected(saved)
    applyGoogleTranslateLanguage(saved)
  }, [])

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative notranslate" ref={ref} translate="no" lang="en">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors notranslate"
        title="Select Language"
        translate="no"
        lang="en"
      >
        <span>🌐</span>
        <span>Language</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 notranslate" translate="no" lang="en">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelected(lang.code)
                setOpen(false)
                localStorage.setItem('gramco_lang', lang.code)

                if (lang.code === 'en') {
                  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
                  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + window.location.hostname
                  window.location.reload()
                  return
                }

                applyGoogleTranslateLanguage(lang.code)
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                selected === lang.code
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              translate="no"
              lang="en"
            >
              <span>{lang.full}</span>
              {selected === lang.code && <span className="text-blue-500">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl">
            <span className="text-2xl">🏛️</span>
            <span>
              Gram<span className="text-orange-400">Co</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* CTA + Language */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/eligibility"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shadow"
            >
              🤖 Check My Eligibility
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-white/15 text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/eligibility"
              onClick={() => setMenuOpen(false)}
              className="block mt-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg text-center"
            >
              🤖 Check My Eligibility
            </Link>
            <div className="mt-2 flex justify-start">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
