import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkEligibility, getAllSituations } from '../api/client'
import SituationCard from '../components/SituationCard'
import Spinner from '../components/Spinner'
import { getCategoryConfig } from '../utils/categoryConfig'

const OCCUPATIONS = [
  'Farmer', 'Student', 'Employee (Salaried)', 'Self-Employed',
  'Entrepreneur', 'Small Business Owner', 'Street Vendor',
  'Labourer / Daily Wage', 'Homemaker', 'Unemployed', 'Other',
]

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Delhi (NCT)',
  'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

const STEPS = [
  { num: 1, label: 'Your Profile' },
  { num: 2, label: 'Your Situation' },
  { num: 3, label: 'AI Results' },
]

const INITIAL_PROFILE = { age: '', income: '', occupation: '', location: '' }

export default function EligibilityCheck() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState(INITIAL_PROFILE)
  const [situation, setSituation] = useState('')
  const [situations, setSituations] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllSituations()
      .then((r) => setSituations(r.data.situations || []))
      .catch(() => {})
  }, [])

  const profileValid =
    profile.age && profile.income && profile.occupation && profile.location

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    if (!profileValid) return
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCheck = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        user_profile: {
          age: parseInt(profile.age, 10),
          income: parseInt(profile.income, 10),
          occupation: profile.occupation.toLowerCase().replace(' / ', '/').replace(' (salaried)', ''),
          location: profile.location,
        },
        situation: situation || null,
      }
      const r = await checkEligibility(payload)
      setResults(r.data)
      setStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      const msg = err?.response?.data?.detail || 'AI service unavailable. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setStep(1)
    setProfile(INITIAL_PROFILE)
    setSituation('')
    setResults(null)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          🤖 AI Eligibility Check
        </h1>
        <p className="text-gray-500">
          Answer a few quick questions and let AI find the schemes you qualify for.
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator steps={STEPS} current={step} />

      {/* ── Step 1: Profile ───────────────────────────────── */}
      {step === 1 && (
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-8">
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Tell Us About Yourself
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Age" required>
              <input
                type="number"
                min="0" max="120"
                placeholder="e.g. 30"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                className="input-field"
                required
              />
            </Field>

            <Field label="Annual Income (₹)" required>
              <input
                type="number"
                min="0"
                placeholder="e.g. 180000"
                value={profile.income}
                onChange={(e) => setProfile({ ...profile, income: e.target.value })}
                className="input-field"
                required
              />
              {profile.income && (
                <p className="text-xs text-gray-400 mt-1">
                  ≈ ₹{Number(profile.income).toLocaleString('en-IN')} / year
                </p>
              )}
            </Field>

            <Field label="Occupation" required>
              <select
                value={profile.occupation}
                onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select occupation…</option>
                {OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>

            <Field label="State / Location" required>
              <select
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select state…</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-8 flex justify-end">
            <button type="submit" disabled={!profileValid} className="btn-primary px-10">
              Next: Select Situation →
            </button>
          </div>
        </form>
      )}

      {/* ── Step 2: Situation ─────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-8">
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            What Are You Looking For?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Select the situation that best matches what you are currently facing. (Optional — skipping will search all schemes)
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            {situations.map((sit, i) => (
              <SituationCard
                key={sit.id}
                situation={sit}
                selected={situation === sit.slug}
                onClick={() => setSituation(situation === sit.slug ? '' : sit.slug)}
                index={i}
              />
            ))}
          </div>

          {situation && (
            <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
              ✓ Selected: <strong>{situations.find((s) => s.slug === situation)?.label || situation}</strong>
            </div>
          )}

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
            <button onClick={() => setStep(1)} className="btn-outline">
              ← Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleCheck}
                disabled={loading}
                className="btn-outline text-gray-500"
              >
                {loading ? 'Checking…' : 'Skip & Check All'}
              </button>
              <button
                onClick={handleCheck}
                disabled={loading}
                className="btn-primary px-8"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" /> Analysing with AI…
                  </span>
                ) : (
                  '🤖 Check My Eligibility →'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Results ───────────────────────────────── */}
      {step === 3 && results && (
        <div className="mt-8 space-y-6">
          {/* AI Summary */}
          {results.ai_summary && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  🤖
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-blue-900 mb-1">AI Analysis Summary</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">{results.ai_summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile recap */}
          <div className="flex flex-wrap gap-2">
            <Chip label={`👤 ${profile.occupation}`} />
            <Chip label={`🎂 Age ${profile.age}`} />
            <Chip label={`💰 ₹${Number(profile.income).toLocaleString('en-IN')}/yr`} />
            <Chip label={`📍 ${profile.location}`} />
            {results.situation && <Chip label={`🎯 ${results.situation}`} color="orange" />}
          </div>

          {/* Result count heading */}
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-gray-900">
              {results.total_recommended > 0 ? (
                <>
                  <span className="text-green-600">{results.total_recommended}</span>{' '}
                  Scheme{results.total_recommended > 1 ? 's' : ''} You May Qualify For
                </>
              ) : (
                'No Matching Schemes Found'
              )}
            </h2>
            <button onClick={reset} className="btn-outline text-sm">
              ↺ Start Over
            </button>
          </div>

          {results.total_recommended === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-gray-600 font-medium">
                No schemes matched your current profile.
              </p>
              <p className="text-sm text-gray-500 mt-1 mb-5">
                Try updating your profile details or selecting a different situation.
              </p>
              <button onClick={reset} className="btn-primary">Try Again</button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.recommended_schemes.map((scheme, i) => (
                <RecommendedCard key={scheme.scheme_id} scheme={scheme} rank={i + 1} />
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center mt-6 px-4">
            ⚠️ These recommendations are AI-generated and informational only. Please verify eligibility with the respective government departments before applying.
          </p>
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ────────────────────────────────────────── */

function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                current > s.num
                  ? 'bg-green-500 text-white'
                  : current === s.num
                  ? 'bg-blue-700 text-white ring-4 ring-blue-200'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {current > s.num ? '✓' : s.num}
            </div>
            <span className={`text-xs mt-1.5 font-medium hidden sm:block ${current === s.num ? 'text-blue-700' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-16 sm:w-24 mx-1 mb-5 ${
                current > s.num ? 'bg-green-400' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

function Chip({ label, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
  }
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {label}
    </span>
  )
}

function RecommendedCard({ scheme, rank }) {
  const { icon, bg, text } = getCategoryConfig(scheme.category)
  const benefits = Array.isArray(scheme.benefits)
    ? scheme.benefits
    : scheme.benefits
    ? [scheme.benefits]
    : []

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
              #{rank}
            </div>
            <div>
              <span className={`badge ${bg} ${text} mb-1`}>
                {icon} {scheme.category}
              </span>
              <h3 className="font-heading font-bold text-gray-900 text-lg leading-tight">
                {scheme.scheme_name}
              </h3>
            </div>
          </div>
        </div>

        {/* AI Reason */}
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-green-600 shrink-0 font-semibold">✓ Why you qualify:</span>
            <span>{scheme.reason}</span>
          </p>
        </div>

        {/* Benefits */}
        {benefits.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Benefits</p>
            <ul className="space-y-1">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-orange-500">●</span> {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Documents & Apply */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
          {scheme.required_documents?.length > 0 && (
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Documents Needed</p>
              <div className="flex flex-wrap gap-1">
                {scheme.required_documents.map((d, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:items-end justify-end">
            {scheme.official_link && (
              <a
                href={scheme.official_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                Apply Now ↗
              </a>
            )}
            <Link
              to={`/schemes/${scheme.scheme_id}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
