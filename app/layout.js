import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'ElderCareMatters V2 — Wireframe',
  description: 'Lead generation platform for elder care services',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        {/* Navbar appears on every page */}
        <Navbar />

        {/* Page content fills the space between nav and footer */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer appears on every page */}
        <Footer />
      </body>
    </html>
  )
}
