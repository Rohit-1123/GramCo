import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getSchemeById } from '../api/client'
import { getCategoryConfig } from '../utils/categoryConfig'
import { FullPageSpinner } from '../components/Spinner'

export default function SchemeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [scheme, setScheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getSchemeById(id)
      .then((r) => setScheme(r.data))
      .catch(() => setError('Scheme not found or backend unavailable.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <FullPageSpinner text="Loading scheme details…" />
  if (error)
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-gray-600 font-medium mb-4">{error}</p>
        <Link to="/schemes" className="btn-secondary">← Back to Schemes</Link>
      </div>
    )
  if (!scheme) return null

  const { icon, bg, text } = getCategoryConfig(scheme.category)
  const benefits = Array.isArray(scheme.benefits)
    ? scheme.benefits
    : scheme.benefits
    ? [scheme.benefits]
    : []

  const eligibility = scheme.eligibility || {}

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-700">Home</Link>
        <span>/</span>
        <Link to="/schemes" className="hover:text-blue-700">Schemes</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">{scheme.scheme_name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <span className={`badge ${bg} ${text} mb-4`}>
              {icon} {scheme.category}
            </span>
            <h1 className="font-heading text-2xl font-bold text-gray-900 mb-3">
              {scheme.scheme_name}
            </h1>
            <p className="text-gray-600 leading-relaxed">{scheme.description}</p>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎁</span> Benefits
            </h2>
            <ul className="space-y-2">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eligibility */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span> Eligibility Criteria
            </h2>
            <div className="space-y-3">
              {eligibility.min_age != null && (
                <EligRow icon="🎂" label="Minimum Age" value={`${eligibility.min_age} years`} />
              )}
              {eligibility.max_age != null && (
                <EligRow icon="🎂" label="Maximum Age" value={`${eligibility.max_age} years`} />
              )}
              {eligibility.income_limit != null && (
                <EligRow
                  icon="💰"
                  label="Income Limit"
                  value={`₹${eligibility.income_limit.toLocaleString('en-IN')} per year`}
                />
              )}
              {Array.isArray(eligibility.occupation) && eligibility.occupation.length > 0 && (
                <EligRow
                  icon="👤"
                  label="Occupation"
                  value={eligibility.occupation.map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(', ')}
                />
              )}
              {Array.isArray(eligibility.states) && eligibility.states.length > 0 && (
                <EligRow icon="📍" label="Location" value={eligibility.states.join(', ')} />
              )}
              {Object.keys(eligibility).filter(k =>
                !['min_age','max_age','income_limit','occupation','states','special'].includes(k)
              ).map((k) => (
                <EligRow key={k} icon="📌" label={k} value={String(eligibility[k])} />
              ))}
            </div>
          </div>

          {/* Required Documents */}
          {scheme.required_documents?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📄</span> Required Documents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scheme.required_documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-blue-600 text-sm">📎</span>
                    <span className="text-sm text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Apply CTA */}
          {scheme.official_link && (
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
              <h3 className="font-heading font-bold text-lg mb-2">Ready to Apply?</h3>
              <p className="text-sm text-orange-100 mb-4">
                Visit the official government portal to apply for this scheme.
              </p>
              <a
                href={scheme.official_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-white text-orange-600 font-bold rounded-xl text-center text-sm hover:shadow-md transition-all"
              >
                Apply Now →
              </a>
            </div>
          )}

          {/* Application Centers */}
          {scheme.application_centers?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-heading font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📍</span> Where to Apply
              </h3>
              <ul className="space-y-2">
                {scheme.application_centers.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Deadline */}
          {scheme.application_deadline && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-heading font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>📅</span> Application Deadline
              </h3>
              <p className="text-sm text-gray-600">{scheme.application_deadline}</p>
            </div>
          )}

          {/* Check AI Eligibility CTA */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="font-heading font-semibold text-blue-900 mb-2">🤖 Not Sure?</h3>
            <p className="text-sm text-blue-700 mb-4">
              Use our AI tool to check if you're eligible for this and other schemes personalised to your profile.
            </p>
            <button
              onClick={() => navigate('/eligibility')}
              className="w-full py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Check My Eligibility
            </button>
          </div>

          {/* Back link */}
          <button
            onClick={() => navigate(-1)}
            className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

function EligRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className="text-lg shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm text-gray-800 font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  )
}
