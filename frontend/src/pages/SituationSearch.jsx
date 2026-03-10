import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllSituations, searchBySituation } from '../api/client'
import SituationCard from '../components/SituationCard'
import SchemeCard from '../components/SchemeCard'
import Spinner from '../components/Spinner'

export default function SituationSearch() {
  const [searchParams] = useSearchParams()
  const [situations, setSituations] = useState([])
  const [selected, setSelected] = useState(searchParams.get('q') || '')
  const [customInput, setCustomInput] = useState('')
  const [results, setResults] = useState(null)
  const [loadingSituations, setLoadingSituations] = useState(true)
  const [loadingResults, setLoadingResults] = useState(false)
  const [error, setError] = useState('')
  const resultsRef = useRef(null)

  useEffect(() => {
    getAllSituations()
      .then((r) => setSituations(r.data.situations || []))
      .catch(() => {})
      .finally(() => setLoadingSituations(false))
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) handleSearch(q)
  }, [])

  const handleSearch = async (query) => {
    const q = (query || customInput || selected).trim()
    if (!q) return
    setLoadingResults(true)
    setError('')
    setResults(null)
    try {
      const r = await searchBySituation(q)
      setResults(r.data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch {
      setError('Failed to search. Please try again or check if the backend is running.')
    } finally {
      setLoadingResults(false)
    }
  }

  const handleCardClick = (sit) => {
    setSelected(sit.slug)
    setCustomInput('')
    handleSearch(sit.slug)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Search by Your Situation
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Tell us what you're going through — we'll find the government schemes that can help you.
        </p>
      </div>

      {/* Custom search bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></span>
            <input
              type="text"
              placeholder='Type a situation, e.g. "crop loss", "medical help"…'
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="input-field pl-11 pr-4"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={!customInput.trim() && !selected}
            className="btn-primary px-6"
          >
            Search
          </button>
        </div>
      </div>

      {/* Situations Grid */}
      <div className="mb-4">
        <h2 className="font-heading font-semibold text-lg text-gray-800 mb-5">
          Or choose a situation below:
        </h2>

        {loadingSituations ? (
          <div className="flex justify-center py-10">
            <Spinner text="Loading situations…" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {situations.map((sit, i) => (
              <SituationCard
                key={sit.id}
                situation={sit}
                selected={selected === sit.slug}
                onClick={() => handleCardClick(sit)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div ref={resultsRef} className="mt-12">
        {loadingResults && (
          <div className="flex justify-center py-16">
            <Spinner size="lg" text="Finding matching schemes…" />
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {results && !loadingResults && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-gray-900">
                  {results.total > 0
                    ? `${results.total} Scheme${results.total > 1 ? 's' : ''} Found`
                    : 'No Schemes Found'}
                </h2>
                {selected && (
                  <p className="text-sm text-gray-500 mt-1">
                    Showing results for:{' '}
                    <span className="font-semibold text-blue-700">"{selected}"</span>
                  </p>
                )}
              </div>
              <button
                onClick={() => { setResults(null); setSelected(''); setCustomInput('') }}
                className="btn-outline text-sm"
              >
                Clear
              </button>
            </div>

            {results.total === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-600 font-medium">
                  No specific schemes found for this situation.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Try a different keyword or{' '}
                  <a href="/schemes" className="text-blue-600 hover:underline">browse all schemes</a>.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {results.schemes.map((s) => (
                  <SchemeCard key={s.id} scheme={s} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
