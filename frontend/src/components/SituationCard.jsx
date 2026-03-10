const SITUATION_ICONS = {
  'crop loss': '🌾',
  'farmer income support': '👨‍🌾',
  'agriculture assistance': '🚜',
  'natural disaster': '🌊',
  'medical emergency': '🏥',
  'hospitalization': '🩺',
  'healthcare support': '💊',
  'starting business': '🚀',
  'business expansion': '📈',
  'small business funding': '💳',
  'housing assistance': '🏠',
  'home construction': '🔨',
  'child education': '📖',
  'student financial support': '🎓',
  'women welfare': '👩',
  'women empowerment': '💪',
  'girl child education': '👧',
  'retirement planning': '🧓',
  'social security': '🛡️',
  'skill development': '⚡',
  'job training': '🛠️',
  'rural livelihood': '🌱',
  'self employment': '💼',
  'financial inclusion': '💰',
  'bank account support': '🏦',
  'digital literacy': '💻',
  'accident insurance': '🔒',
  'life insurance': '❤️',
  'startup funding': '🌟',
  'innovation support': '🔬',
}

const SITUATION_COLORS = [
  'from-green-500 to-green-700',
  'from-blue-500 to-blue-700',
  'from-orange-500 to-orange-700',
  'from-purple-500 to-purple-700',
  'from-red-500 to-red-700',
  'from-teal-500 to-teal-700',
  'from-indigo-500 to-indigo-700',
  'from-pink-500 to-pink-700',
  'from-yellow-500 to-yellow-600',
  'from-cyan-500 to-cyan-700',
  'from-emerald-500 to-emerald-700',
  'from-rose-500 to-rose-700',
  'from-sky-500 to-sky-700',
  'from-violet-500 to-violet-700',
  'from-fuchsia-500 to-fuchsia-700',
]

export default function SituationCard({ situation, selected, onClick, index = 0 }) {
  const slug = situation.slug || situation.label?.toLowerCase()
  const icon = SITUATION_ICONS[slug] || '📋'
  const gradient = SITUATION_COLORS[index % SITUATION_COLORS.length]

  return (
    <button
      onClick={onClick}
      className={`relative text-left w-full p-5 rounded-2xl transition-all duration-200 active:scale-95
        ${
          selected
            ? 'ring-4 ring-orange-400 ring-offset-2 shadow-lg scale-[1.02]'
            : 'hover:shadow-lg hover:scale-[1.02] shadow-sm'
        }
        bg-gradient-to-br ${gradient} text-white`}
    >
      {selected && (
        <span className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center text-orange-500 text-sm font-bold">
          ✓
        </span>
      )}
      <span className="text-3xl block mb-2">{icon}</span>
      <h3 className="font-heading font-semibold text-sm leading-tight mb-1">
        {situation.label}
      </h3>
      {situation.description && (
        <p className="text-xs text-white/80 line-clamp-2 mt-1">{situation.description}</p>
      )}
    </button>
  )
}
