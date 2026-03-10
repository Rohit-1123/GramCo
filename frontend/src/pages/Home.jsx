import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllSituations } from '../api/client'
import SituationCard from '../components/SituationCard'

const STATS = [
  { value: '20+', label: 'Government Schemes', icon: '📋' },
  { value: '15+', label: 'Life Situations', icon: '🎯' },
  { value: 'AI', label: 'Powered Analysis', icon: '🤖' },
  { value: '100%', label: 'Free to Use', icon: '✅' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Enter Your Profile',
    desc: 'Share basic details like age, income, occupation, and location.',
    icon: '👤',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    step: '02',
    title: 'Select Your Situation',
    desc: 'Choose the real-life situation you are currently facing.',
    icon: '🎯',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    step: '03',
    title: 'Get AI Recommendations',
    desc: 'Our AI analyses your details and suggests schemes you qualify for with clear explanations.',
    icon: '🤖',
    color: 'bg-green-100 text-green-700',
  },
]

const FEATURED_SITUATIONS = [
  { label: 'Crop Loss', slug: 'crop loss', description: 'Farmer suffered crop damage' },
  { label: 'Medical Emergency', slug: 'medical emergency', description: 'Need hospitalisation support' },
  { label: 'Child Education', slug: 'child education', description: 'Support for student fees' },
  { label: 'Housing Support', slug: 'housing assistance', description: 'Build or repair my home' },
  { label: 'Starting Business', slug: 'starting business', description: 'Need funding for a business' },
  { label: 'Unemployment', slug: 'skill development', description: 'Skill training & jobs' },
]

export default function Home() {
  const navigate = useNavigate()
  const [situations, setSituations] = useState([])

  useEffect(() => {
    getAllSituations()
      .then((r) => setSituations(r.data.situations || []))
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium mb-6">
              AI-Powered · Free · For Every Indian
            </span>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Discover Government{' '}
              <span className="text-orange-400">Schemes</span>{' '}
              <br className="hidden sm:block" />
              Made For You
            </h1>

            <p className="text-lg text-blue-200 mb-8 max-w-2xl leading-relaxed">
              Don't know which government scheme you qualify for? Just tell us your situation —
              our AI will match you with the right schemes instantly, with personalised explanations.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/eligibility" className="btn-primary text-base px-8 py-4 shadow-lg">
                Check My Eligibility
              </Link>
              <Link to="/schemes" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl transition-all text-base">
                Browse All Schemes →
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-blue-950/60 border-t border-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="font-heading font-extrabold text-2xl text-white">{s.value}</div>
                  <div className="text-xs text-blue-300 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Three simple steps to discover government schemes tailored just for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative text-center">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-dashed border-t-2 border-dashed border-gray-200" />
                )}
                <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 relative`}>
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/eligibility" className="btn-primary text-base">
              🚀 Get Started — It's Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Browse by Situation ───────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="section-heading mb-2">Browse by Situation</h2>
              <p className="text-gray-500">Select a situation that best matches what you are going through.</p>
            </div>
            <Link to="/situations" className="btn-outline shrink-0">
              View All Situations →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_SITUATIONS.map((sit, i) => (
              <SituationCard
                key={sit.slug}
                situation={sit}
                index={i}
                onClick={() => navigate(`/situations?q=${encodeURIComponent(sit.slug)}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Categories ───────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="section-heading mb-2">Scheme Categories</h2>
              <p className="text-gray-500">Explore welfare schemes across all major categories.</p>
            </div>
            <Link to="/schemes" className="btn-outline shrink-0">Browse All →</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { cat: 'Agriculture', schemes: 3, icon: '🌾', color: 'bg-green-50 border-green-200 hover:bg-green-100' },
              { cat: 'Health', schemes: 1, icon: '🏥', color: 'bg-red-50 border-red-200 hover:bg-red-100' },
              { cat: 'Business & Entrepreneurship', schemes: 3, icon: '💼', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
              { cat: 'Housing', schemes: 2, icon: '🏠', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
              { cat: 'Insurance & Social Security', schemes: 3, icon: '🛡️', color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' },
              { cat: 'Skill Development & Employment', schemes: 1, icon: '⚡', color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' },
              { cat: 'Women & Child Welfare', schemes: 3, icon: '💫', color: 'bg-pink-50 border-pink-200 hover:bg-pink-100' },
              { cat: 'Employment', schemes: 1, icon: '👷', color: 'bg-teal-50 border-teal-200 hover:bg-teal-100' },
            ].map((c) => (
              <Link
                key={c.cat}
                to={`/schemes?category=${encodeURIComponent(c.cat)}`}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${c.color}`}
              >
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{c.cat}</p>
                  <p className="text-xs text-gray-500">{c.schemes} scheme{c.schemes > 1 ? 's' : ''}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="font-heading text-3xl font-bold mb-3">
            Find Schemes You Actually Qualify For
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Stop guessing. Let AI analyse your eligibility against 20+ government schemes in seconds.
          </p>
          <Link to="/eligibility" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-orange-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base">
            Check Eligibility Now — Free
          </Link>
        </div>
      </section>
    </div>
  )
}
