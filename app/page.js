import ChatbotWidget from '../components/ChatbotWidget'
import Link from 'next/link'

// The 6 service types consumers can choose from
const services = [
  { label: 'Home Care',        icon: '🏠', href: '/services/home-care' },
  { label: 'Assisted Living',  icon: '🏡', href: '/services/assisted-living' },
  { label: 'Memory Care',      icon: '🧠', href: '/services/memory-care' },
  { label: 'Elder Law',        icon: '⚖️', href: '/services/elder-law' },
  { label: 'Care Management',  icon: '📋', href: '/services/care-management' },
  { label: 'Hospice',          icon: '🤝', href: '/services/hospice' },
]

// 3-step "how it works" summary shown on the homepage
const steps = [
  { num: '1', title: 'Answer a few questions', desc: 'Tell us who needs care, where, and what type of help you need.' },
  { num: '2', title: 'Get matched instantly',  desc: 'We score your request and find qualified providers in your area.' },
  { num: '3', title: 'Providers reach out',    desc: 'Matched providers contact you. Free for families, always.' },
]

export default function HomePage() {
  return (
    <div>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="bg-brand-light py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-700 text-sm font-semibold uppercase tracking-wide mb-3">
            Trusted Elder Care Matching
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Find the Right Elder Care,<br />Close to Home
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Answer a few questions and we'll connect you with verified local providers —
            home care, assisted living, elder law, and more.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Free for families. Providers are pre-screened.
          </p>
        </div>
      </section>

      {/* ── CHATBOT INTAKE WIDGET ────────────────────────────────── */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
            Start Your Free Match
          </h2>
          <ChatbotWidget />
        </div>
      </section>

      {/* ── CARE TYPE ICONS ──────────────────────────────────────── */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Browse by Care Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {services.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-sm transition"
              >
                <span className="text-3xl mb-2">{s.icon}</span>
                <span className="text-xs text-gray-700 font-medium text-center">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-10">How ElderCareMatters Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl font-bold mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/how-it-works"
            className="inline-block mt-8 text-blue-700 text-sm hover:underline"
          >
            Learn more about the process →
          </Link>
        </div>
      </section>

      {/* ── PROVIDER CTA BANNER ──────────────────────────────────── */}
      <section className="bg-blue-700 py-12 px-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Are you a care provider or elder law attorney?</h2>
        <p className="text-blue-100 mb-6">
          Access qualified, geo-matched leads with transparent pricing and ROI.
        </p>
        <Link
          href="/for-providers"
          className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50"
        >
          See Provider Plans →
        </Link>
      </section>

    </div>
  )
}
