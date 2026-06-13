import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllSchemes } from '../api/client'
import SchemeCard from '../components/SchemeCard'
import { FullPageSpinner } from '../components/Spinner'
import { CATEGORY_CONFIG } from '../utils/categoryConfig'

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG)

export default function BrowseSchemes() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const activeCategory = searchParams.get('category') || 'All'

  useEffect(() => {
    getAllSchemes()
      .then((r) => setSchemes(r.data.schemes || []))
      .catch(() => setError('Failed to load schemes. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = schemes.filter((s) => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      s.scheme_name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const categories = ['All', ...Array.from(new Set(schemes.map((s) => s.category))).sort()]

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
          All Government Schemes
        </h1>
        <p className="text-gray-500">
          Browse <span className="font-semibold text-blue-700">{schemes.length}</span> welfare schemes across multiple categories.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          placeholder="Search schemes by name, category, or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-11 text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              scrollTop()
              setSearchParams(cat === 'All' ? {} : { category: cat })
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-blue-800 text-white shadow'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            {cat === 'All' ? '📋 All' : `${CATEGORY_CONFIG[cat]?.icon || ''} ${cat}`}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-5">
        Showing{' '}
        <span className="font-semibold text-gray-800">{filtered.length}</span>{' '}
        {filtered.length === 1 ? 'scheme' : 'schemes'}
        {activeCategory !== 'All' && ` in ${activeCategory}`}
        {search && ` matching "${search}"`}
      </p>

      {/* Content */}
      {loading ? (
        <FullPageSpinner text="Loading schemes…" />
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-600 font-medium">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-600 font-medium">No schemes found.</p>
          <button
            onClick={() => {
              scrollTop()
              setSearch('')
              setSearchParams({})
            }}
            className="mt-4 btn-outline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  )
}
