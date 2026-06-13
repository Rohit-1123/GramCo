const sections = [
  {
    title: 'Privacy: What We Collect',
    body:
      'GramCo collects only the details needed to check eligibility and provide recommendations, such as profile inputs (age range, income range, occupation, and state) and optional situation keywords. If third-party sign-in is ever enabled, basic account identifiers such as name and email may be received from that provider.',
  },
  {
    title: 'Privacy: How We Use Data',
    body:
      'We use submitted information to match you with schemes and generate an eligibility response. If AI assistance is used for better explanations, only relevant context is sent to our AI provider for processing.',
  },
  {
    title: 'Privacy: Storage and Retention',
    body:
      'Usage records and eligibility checks may be stored securely to improve service quality and troubleshooting. We aim to retain data for a limited period and remove or anonymize it when no longer necessary for service operations.',
  },
  {
    title: 'Privacy: Analytics and Controls',
    body:
      'We may use limited analytics to understand feature usage and app performance. Where applicable, you can choose consent preferences and request deletion of your stored check history through account controls.',
  },
  {
    title: 'Terms: Service Scope',
    body:
      'GramCo offers educational and informational guidance to help discover government schemes. Results are not official determinations and should be verified with the relevant government department before applying.',
  },
  {
    title: 'Terms: Responsibilities and Liability',
    body:
      'You are responsible for providing accurate information and protecting your account access. While we work to keep the service reliable, uninterrupted availability cannot be guaranteed. To the extent allowed by law, GramCo is not liable for indirect or consequential losses related to service use.',
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Privacy Policy & Terms
        </h1>
        <p className="text-gray-600 leading-relaxed">
          We only use your information for eligibility checking and service improvement. This
          page explains what we collect, how we use it, and the terms for using GramCo.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <section key={section.title} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-blue-900 mb-2">{section.title}</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-8">
        Last updated: March 16, 2026
      </p>
    </div>
  )
}
