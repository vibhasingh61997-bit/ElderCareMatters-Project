import Link from 'next/link'

// Sample leads in the marketplace — contact info is hidden until purchased
const availableLeads = [
  {
    id: 1,
    type: 'Home Care',
    city: 'Austin, TX',
    urgency: 'Urgent',
    budget: '$3,000–$4,000/mo',
    lqs: 88,
    lis: 92,
    price: '$38',
    purchased: false,
    name: 'Sarah M.',
    phone: '(512) 555-0101',
    email: 'sarah.m@email.com',
  },
  {
    id: 2,
    type: 'Assisted Living',
    city: 'Austin, TX',
    urgency: 'Within 1 month',
    budget: '$4,000+/mo',
    lqs: 74,
    lis: 68,
    price: '$22',
    purchased: false,
    name: 'John D.',
    phone: '(512) 555-0188',
    email: 'john.d@email.com',
  },
  {
    id: 3,
    type: 'Memory Care',
    city: 'Round Rock, TX',
    urgency: 'Within 1 month',
    budget: '$4,000+/mo',
    lqs: 91,
    lis: 80,
    price: '$29',
    purchased: true,
    name: 'Maria K.',
    phone: '(512) 555-0234',
    email: 'maria.k@email.com',
  },
  {
    id: 4,
    type: 'Elder Law',
    city: 'Cedar Park, TX',
    urgency: 'Just researching',
    budget: 'Not specified',
    lqs: 65,
    lis: 40,
    price: '$14',
    purchased: false,
    name: 'Robert L.',
    phone: '(512) 555-0312',
    email: 'robert.l@email.com',
  },
]

export default function LeadMarketplacePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lead Marketplace</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse leads matched to your coverage area. Purchase to unlock full contact info.
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-4 border-b border-gray-200 mb-8 text-sm text-gray-500">
        {[
          { label: 'Dashboard', href: '/app/provider/dashboard', active: false },
          { label: 'Lead Inbox', href: '/app/provider/leads', active: true },
          { label: 'Billing',   href: '/app/provider/billing', active: false },
          { label: 'Profile',   href: '/app/provider/profile', active: false },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`pb-3 border-b-2 ${tab.active ? 'border-blue-700 text-blue-700 font-medium' : 'border-transparent hover:text-gray-700'}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500 mb-6">
        <span><span className="font-semibold text-green-700">LQS</span> = Lead Quality Score (data reliability)</span>
        <span><span className="font-semibold text-blue-700">LIS</span> = Lead Intent Score (conversion likelihood)</span>
      </div>

      {/* Lead cards */}
      <div className="space-y-4">
        {availableLeads.map((lead) => (
          <div
            key={lead.id}
            className={`bg-white border rounded-xl p-5 ${lead.purchased ? 'border-green-300' : 'border-gray-200'}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              {/* Left: lead details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{lead.type}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{lead.urgency}</span>
                  {lead.purchased && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Purchased</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">📍 {lead.city} &nbsp;·&nbsp; Budget: {lead.budget}</p>

                {/* Show full info only if purchased */}
                {lead.purchased ? (
                  <div className="mt-2 text-sm text-gray-700 space-y-0.5">
                    <p><span className="font-medium">Name:</span> {lead.name}</p>
                    <p><span className="font-medium">Phone:</span> {lead.phone}</p>
                    <p><span className="font-medium">Email:</span> {lead.email}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-400 italic">
                    Contact info hidden — purchase to unlock
                  </p>
                )}
              </div>

              {/* Right: scores + price + CTA */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-0.5">LQS</p>
                  <p className="text-xl font-bold text-green-700">{lead.lqs}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-0.5">LIS</p>
                  <p className="text-xl font-bold text-blue-700">{lead.lis}</p>
                </div>
                {!lead.purchased ? (
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Price</p>
                    <p className="text-xl font-bold text-gray-800 mb-2">{lead.price}</p>
                    <button className="bg-blue-700 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-blue-800">
                      Purchase Lead
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Paid</p>
                    <p className="text-xl font-bold text-green-700">{lead.price}</p>
                    <p className="text-xs text-green-600 mt-1">Unlocked ✓</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
