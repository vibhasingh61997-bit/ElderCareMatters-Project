import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-8 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500">

        {/* Brand */}
        <div>
          <p className="font-bold text-gray-800 mb-1">ElderCareMatters</p>
          <p>Connecting families with trusted elder care.</p>
        </div>

        {/* Links */}
        <div className="flex gap-8">
          <div>
            <p className="font-semibold text-gray-700 mb-2">Families</p>
            <ul className="space-y-1">
              <li><Link href="/how-it-works" className="hover:text-blue-700">How It Works</Link></li>
              <li><Link href="/services"      className="hover:text-blue-700">Services</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-2">Providers</p>
            <ul className="space-y-1">
              <li><Link href="/for-providers"          className="hover:text-blue-700">Get Started</Link></li>
              <li><Link href="/app/provider/dashboard" className="hover:text-blue-700">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-2">Company</p>
            <ul className="space-y-1">
              <li><Link href="/about"   className="hover:text-blue-700">About</Link></li>
              <li><Link href="/contact" className="hover:text-blue-700">Contact</Link></li>
            </ul>
          </div>
        </div>

      </div>
      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
        © 2026 ElderCareMatters. All rights reserved.
      </div>
    </footer>
  )
}
