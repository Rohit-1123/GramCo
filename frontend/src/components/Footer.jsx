import { Link } from 'react-router-dom'

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-blue-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-heading font-bold text-xl text-white mb-3">
              <span>Gram<span className="text-orange-400">Co</span></span>
            </div>
            <p className="text-sm text-blue-300 leading-relaxed mb-4">
              AI-powered platform helping citizens discover and access government welfare schemes
              they are eligible for — effortlessly and for free.
            </p>
            <div className="flex gap-3">
              <span className="px-3 py-1 bg-blue-800 rounded-full text-xs font-medium"> AI Powered</span>
              <span className="px-3 py-1 bg-blue-800 rounded-full text-xs font-medium">🇮🇳 Made for India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" onClick={scrollTop} className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/schemes" onClick={scrollTop} className="hover:text-white transition-colors">Browse All Schemes</Link></li>
              <li><Link to="/situations" onClick={scrollTop} className="hover:text-white transition-colors">Search by Situation</Link></li>
              <li><Link to="/eligibility" onClick={scrollTop} className="hover:text-white transition-colors">Check Eligibility</Link></li>
              <li><Link to="/privacy-policy" onClick={scrollTop} className="hover:text-white transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/schemes?category=Agriculture" onClick={scrollTop} className="hover:text-white transition-colors">🌾 Agriculture</Link></li>
              <li><Link to="/schemes?category=Health" onClick={scrollTop} className="hover:text-white transition-colors">🏥 Health</Link></li>
              <li><Link to={`/schemes?category=${encodeURIComponent('Business & Entrepreneurship')}`} onClick={scrollTop} className="hover:text-white transition-colors">💼 Business & Entrepreneurship</Link></li>
              <li><Link to="/schemes?category=Housing" onClick={scrollTop} className="hover:text-white transition-colors">🏠 Housing</Link></li>
              <li><Link to={`/schemes?category=${encodeURIComponent('Women & Child Welfare')}`} onClick={scrollTop} className="hover:text-white transition-colors">💫 Women & Child Welfare</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-blue-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-blue-400">
            <p>© 2026 GramCo. Built for the benefit of Indian citizens.</p>
            <p className="text-center">
              ⚠️ Informational platform only. Verify eligibility with official government departments.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
