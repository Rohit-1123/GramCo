import { useNavigate } from 'react-router-dom'
import { getCategoryConfig } from '../utils/categoryConfig'

export default function SchemeCard({ scheme }) {
  const navigate = useNavigate()
  const { icon, bg, text } = getCategoryConfig(scheme.category)

  const benefits = Array.isArray(scheme.benefits)
    ? scheme.benefits
    : scheme.benefits
    ? [scheme.benefits]
    : []

  return (
    <div className="card flex flex-col h-full">
      <div className="p-5 flex flex-col flex-1">
        {/* Category Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`badge ${bg} ${text}`}>
            {icon} {scheme.category}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-heading text-base font-semibold text-gray-900 mb-2 leading-snug">
          {scheme.scheme_name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{scheme.description}</p>

        {/* Benefit preview */}
        {benefits.length > 0 && (
          <div className="mt-auto">
            <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              <span className="text-green-600 mt-0.5 shrink-0">✓</span>
              <p className="text-xs text-green-800 font-medium line-clamp-2">{benefits[0]}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={() => navigate(`/schemes/${scheme.id}`)}
          className="w-full py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-sm font-semibold transition-colors"
        >
          View Details →
        </button>
      </div>
    </div>
  )
}
