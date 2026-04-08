import Link from 'next/link'

// Sample data: what the consumer sees after submitting their request
const request = {
  type: 'Home Care',
  location: 'Austin, TX 78701',
  urgency: 'Urgent',
  budget: '$3,000–$4,000/mo',
  submitted: 'April 8, 2026',
  status: 'Matched — providers have been notified',
}

const providerResponses = [
  {
    id: 1,
    name: 'Sunrise Home Care',
    type: 'Home Care Agency',
    city: 'Austin, TX',
    verified: true,
    message: 'Hi! We specialize in home care services in the Austin area. We\'d love to discuss how we can help your family. Are you available for a quick call this week?',
    time: '2 hours ago',
    replied: false,
  },
  {
    id: 2,
    name: 'Caring Hands Agency',
    type: 'Home Care Agency',
    city: 'Austin, TX',
    verified: true,
    message: 'Hello! We have availability in your area and our caregivers are fully licensed. Would you like to schedule a free consultation?',
    time: 'Yesterday',
    replied: true,
  },
]

export default function ConsumerDashboardPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Care Request</h1>
      <p className="text-sm text-gray-500 mb-8">Track provider responses and manage your search.</p>

      {/* Request summary card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
        <h2 className="font-semibold text-gray-800 mb-3">Request Summary</h2>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">Care type:</span> <span className="text-gray-800 font-medium">{request.type}</span></div>
          <div><span className="text-gray-500">Location:</span> <span className="text-gray-800 font-medium">{request.location}</span></div>
          <div><span className="text-gray-500">Urgency:</span> <span className="text-gray-800 font-medium">{request.urgency}</span></div>
          <div><span className="text-gray-500">Budget:</span> <span className="text-gray-800 font-medium">{request.budget}</span></div>
          <div><span className="text-gray-500">Submitted:</span> <span className="text-gray-800 font-medium">{request.submitted}</span></div>
          <div>
            <span className="text-gray-500">Status: </span>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">{request.status}</span>
          </div>
        </div>
      </div>

      {/* Provider messages */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Provider Responses ({providerResponses.length})
      </h2>

      <div className="space-y-4">
        {providerResponses.map((p) => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-semibold text-gray-800">{p.name}</span>
                {p.verified && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    ECM Verified ✓
                  </span>
                )}
                <p className="text-xs text-gray-500 mt-0.5">{p.type} · {p.city}</p>
              </div>
              <span className="text-xs text-gray-400">{p.time}</span>
            </div>

            <p className="text-sm text-gray-600 mb-3 leading-relaxed">"{p.message}"</p>

            {p.replied ? (
              <span className="text-xs text-green-600 font-medium">✓ You replied</span>
            ) : (
              <button className="bg-blue-700 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-blue-800">
                Reply to {p.name.split(' ')[0]}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Helpful note */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
        <p>
          <span className="font-medium text-gray-700">You are never obligated</span> to work with any provider.
          Review their messages and profiles, then decide who to connect with directly.
        </p>
      </div>

    </div>
  )
}
