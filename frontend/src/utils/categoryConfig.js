export const CATEGORY_CONFIG = {
  Agriculture: {
    icon: '🌾',
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    hero: 'from-green-600 to-green-800',
  },
  Health: {
    icon: '🏥',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    hero: 'from-red-500 to-red-700',
  },
  Housing: {
    icon: '🏠',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    hero: 'from-blue-500 to-blue-700',
  },
  'Business & Entrepreneurship': {
    icon: '💼',
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    hero: 'from-orange-500 to-orange-700',
  },
  Employment: {
    icon: '👷',
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-200',
    hero: 'from-teal-500 to-teal-700',
  },
  'Skill Development & Employment': {
    icon: '⚡',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    hero: 'from-yellow-500 to-yellow-600',
  },
  'Insurance & Social Security': {
    icon: '🛡️',
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    hero: 'from-indigo-500 to-indigo-700',
  },
  'Senior Citizens': {
    icon: '👴',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
    hero: 'from-slate-500 to-slate-700',
  },
  'Women & Child Welfare': {
    icon: '💫',
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-200',
    hero: 'from-pink-500 to-pink-700',
  },
  'Food & Nutrition': {
    icon: '🌽',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    hero: 'from-emerald-500 to-emerald-700',
  },
}

export function getCategoryConfig(category) {
  return (
    CATEGORY_CONFIG[category] || {
      icon: '📋',
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
      hero: 'from-gray-500 to-gray-700',
    }
  )
}
