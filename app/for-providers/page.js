import Link from 'next/link'

const plans = [
  {
    name: 'Base',
    price: '$149/mo',
    coverage: '1 city',
    leads: 'Up to 10 leads/month',
    features: ['Lead inbox', 'Basic profile listing', 'Email notifications'],
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$299/mo',
    coverage: 'City + radius or 3 cities',
    leads: 'Up to 20 leads/month',
    features: ['Everything in Base', 'Lead scoring visibility', 'Priority placement', 'Lead status tracking'],
    highlight: true,
  },
  {
    name: 'Premium',
    price: 'Custom',
    coverage: 'State or multi-state',
    leads: 'Unlimited',
    features: ['Everything in Professional', 'Dedicated account manager', 'CRM integration (coming soon)', 'Featured badge'],
    highlight: false,
  },
]

const benefits = [
  { icon: '📍', title: 'Geo-matched leads', desc: 'Only receive leads from ZIP codes and cities you actually serve.' },
  { icon: '📊', title: 'Scored before you buy', desc: 'See Lead Quality + Intent scores before purchasing. Know what you\'re getting.' },
  { icon: '💰', title: 'Transparent pricing', desc: 'Each lead has a clear price based on city, category, and quality. No surprises.' },
  { icon: '🔒', title: 'Limited competition', desc: 'Each lead is sold to a maximum of 3 providers. You\'re not competing with 20 others.' },
]

export default function ForProvidersPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">

      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          A Predictable Source of Qualified Leads
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          ElderCareMatters connects elder care professionals with families actively seeking help —
          scored, geo-matched, and priced transparently.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {benefits.map((b) => (
          <div key={b.title} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
            <span className="text-2xl">{b.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">{b.title}</h3>
              <p className="text-sm text-gray-500">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing plans */}
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Subscription Plans</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-6 flex flex-col ${
              plan.highlight
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white'
            }`}
          >
            {plan.highlight && (
              <span className="text-xs font-bold text-blue-700 uppercase mb-2">Most Popular</span>
            )}
            <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
            <p className="text-3xl font-bold text-gray-900 my-2">{plan.price}</p>
            <p className="text-sm text-gray-500 mb-1">Coverage: {plan.coverage}</p>
            <p className="text-sm text-gray-500 mb-4">{plan.leads}</p>
            <ul className="text-sm text-gray-600 space-y-1 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={`text-center py-2.5 rounded-lg text-sm font-medium ${
                plan.highlight
                  ? 'bg-blue-700 text-white hover:bg-blue-800'
                  : 'border border-blue-700 text-blue-700 hover:bg-blue-50'
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      {/* Pay-per-lead option */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <h3 className="font-semibold text-gray-800 mb-1">Prefer pay-per-lead?</h3>
        <p className="text-sm text-gray-500 mb-4">
          Buy lead credits and purchase only the leads you want. Priced per city, category, and lead quality.
        </p>
        <Link
          href="/signup"
          className="text-blue-700 text-sm font-medium hover:underline"
        >
          Learn about pay-per-lead →
        </Link>
      </div>

    </div>
  )
}
