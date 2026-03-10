export default function Spinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  )
}

export function FullPageSpinner({ text }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Spinner size="lg" text={text} />
    </div>
  )
}
