import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-brand-dark">
          ElderCareMatters
        </Link>

        {/* Center links — visible on desktop */}
        <div className="hidden md:flex gap-6 text-sm text-gray-600">
          <Link href="/how-it-works" className="hover:text-brand-blue">How It Works</Link>
          <Link href="/services"      className="hover:text-brand-blue">Services</Link>
          <Link href="/for-providers" className="hover:text-brand-blue">For Providers</Link>
        </div>

        {/* Right-side buttons */}
        <div className="flex gap-3 items-center">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-brand-blue"
          >
            Login
          </Link>
          <Link
            href="/"
            className="bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800"
          >
            Get Matched Free
          </Link>
        </div>

      </div>
    </nav>
  )
}
