import Link from 'next/link'

const steps = [
  {
    num: '1',
    title: 'You describe the care need',
    detail: 'Use our guided intake — a short chat or form. You tell us who needs care, what type of service, where they are located, how urgent it is, and your budget range. Takes under 2 minutes.',
  },
  {
    num: '2',
    title: 'We score and match your request',
    detail: 'Your submission becomes a "lead." Our system automatically scores it for quality and intent, then finds providers in your area who cover your ZIP code and service type.',
  },
  {
    num: '3',
    title: 'Providers are notified',
    detail: 'Verified providers in your area see your request (without your contact info yet). They can see your care type, city, urgency, and budget range before deciding to respond.',
  },
  {
    num: '4',
    title: 'Providers reach out to you',
    detail: 'Providers who match your needs contact you through the ElderCareMatters platform. You receive their message and can reply safely — your personal contact info stays protected until you choose to share it.',
  },
  {
    num: '5',
    title: 'You choose who to work with',
    detail: 'You are never obligated to work with any provider. Review their profiles, credentials, and messages. Then connect directly with the one that feels right.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">

      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">How ElderCareMatters Works</h1>
      <p className="text-center text-gray-500 mb-12">A simple, guided process — free for families.</p>

      {/* Step-by-step list */}
      <div className="space-y-8">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-5 items-start">
            <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold flex-shrink-0">
              {step.num}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{step.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to find care?</h3>
        <p className="text-sm text-gray-500 mb-4">Start your free match — takes less than 2 minutes.</p>
        <Link
          href="/"
          className="bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800"
        >
          Get My Free Match →
        </Link>
      </div>

    </div>
  )
}
