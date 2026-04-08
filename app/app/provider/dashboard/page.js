import Link from 'next/link'

// Sample data representing what a real provider would see
const stats = [
  { label: 'New Leads This Week', value: '4' },
  { label: 'Leads This Month',    value: '12' },
  { label: 'Leads Purchased',     value: '9' },
  { label: 'Won / Converted',     value: '3' },
]

const recentLeads = [
  { id: 1, name: 'Sarah M.',  type: 'Home Care',       city: 'Austin, TX',    urgency: 'Urgent',         status: 'New',       lqs: 88, lis: 92, price: '$38' },
  { id: 2, name: 'John D.',   type: 'Assisted Living', city: 'Austin, TX',    urgency: '1 month',        status: 'New',       lqs: 74, lis: 68, price: '$22' },
  { id: 3, name: 'Maria K.',  type: 'Memory Care',     city: 'Round Rock, TX',urgency: '1–3 months',     status: 'Contacted', lqs: 91, lis: 80, price: '$29' },
  { id: 4, name: 'Robert L.', type: 'Elder Law',       city: 'Cedar Park, TX',urgency: 'Just researching',status: 'Won',      lqs: 65, lis: 40, price: '$14' },
]

const statusColor = {
  New:       'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  Won:       'bg-green-100 text-green-700',
  Lost:      'bg-red-100 text-red-700',
}

export default function ProviderDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, Sunrise Home Care</p>
        </div>
        <Link
          href="/app/provider/leads"
          className="bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800"
        >
          Browse New Leads →
        </Link>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-4 border-b border-gray-200 mb-8 text-sm text-gray-500">
        {[
          { label: 'Dashboard', href: '/app/provider/dashboard', active: true },
          { label: 'Lead Inbox', href: '/app/provider/leads', active: false },
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

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-700">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Plan status */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center mb-8 text-sm">
        <div>
          <span className="font-semibold text-gray-800">Plan: Professional</span>
          <span className="ml-2 text-gray-500">· Renews May 8, 2026 · 12 / 20 leads used</span>
        </div>
        <Link href="/app/provider/billing" className="text-blue-700 hover:underline font-medium">
          Manage Plan →
        </Link>
      </div>

      {/* Recent leads table */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Leads</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Consumer</th>
              <th className="text-left px-4 py-3">Care Type</th>
              <th className="text-left px-4 py-3">Location</th>
              <th className="text-left px-4 py-3">Urgency</th>
              <th className="text-left px-4 py-3">LQS / LIS</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{lead.name}</td>
                <td className="px-4 py-3 text-gray-600">{lead.type}</td>
                <td className="px-4 py-3 text-gray-600">{lead.city}</td>
                <td className="px-4 py-3 text-gray-600">{lead.urgency}</td>
                <td className="px-4 py-3">
                  <span className="text-green-700 font-medium">{lead.lqs}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-blue-700 font-medium">{lead.lis}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
