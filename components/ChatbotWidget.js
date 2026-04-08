'use client'   // This tells Next.js: this component uses interactivity (clicks, state)

import { useState } from 'react'

// The 6 steps of the intake flow, in order
const STEPS = [
  {
    id: 'who',
    question: 'Who needs care?',
    options: ['A parent', 'A spouse', 'Myself', 'Another family member'],
  },
  {
    id: 'type',
    question: 'What type of care are you looking for?',
    options: ['Home Care', 'Assisted Living', 'Memory Care', 'Elder Law Attorney', 'Care Management', 'Hospice', 'Not sure yet'],
  },
  {
    id: 'urgency',
    question: 'How soon do you need help?',
    options: ['Urgent — within a week', 'Within a month', '1–3 months', 'Just researching'],
  },
  {
    id: 'budget',
    question: 'What is your monthly budget range? (optional)',
    options: ['Under $2,000', '$2,000–$4,000', '$4,000+', 'Not sure / Skip'],
  },
  {
    id: 'zip',
    question: 'What ZIP code are they located in?',
    type: 'text',
    placeholder: 'e.g. 78701',
  },
  {
    id: 'contact',
    question: 'Where should we send your matches?',
    type: 'contact',
  },
]

export default function ChatbotWidget() {
  const [step, setStep]       = useState(0)        // which question we're on (0–5)
  const [answers, setAnswers] = useState({})       // stores all answers
  const [zip, setZip]         = useState('')       // ZIP input value
  const [name, setName]       = useState('')       // name input value
  const [email, setEmail]     = useState('')       // email input value
  const [done, setDone]       = useState(false)    // whether form is submitted

  const current = STEPS[step]

  // When user clicks a multiple-choice option
  function handleOption(option) {
    setAnswers({ ...answers, [current.id]: option })
    setStep(step + 1)
  }

  // When user submits ZIP
  function handleZip() {
    if (!zip.trim()) return
    setAnswers({ ...answers, zip })
    setStep(step + 1)
  }

  // Final submission
  function handleSubmit() {
    if (!name.trim() || !email.trim()) return
    const finalAnswers = { ...answers, name, email }
    console.log('Lead submitted:', finalAnswers)  // In production: send to database
    setDone(true)
  }

  // Completion screen
  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">You're all set, {name}!</h3>
        <p className="text-sm text-gray-500">
          Providers in your area have been notified. Expect a message within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((step) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="p-6">
        {/* Step counter */}
        <p className="text-xs text-gray-400 mb-3">Step {step + 1} of {STEPS.length}</p>

        {/* Question */}
        <h3 className="text-base font-semibold text-gray-800 mb-4">{current.question}</h3>

        {/* Multiple choice options */}
        {current.options && (
          <div className="grid grid-cols-2 gap-2">
            {current.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOption(opt)}
                className="border border-gray-200 text-sm text-gray-700 px-3 py-2.5 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* ZIP text input */}
        {current.type === 'text' && (
          <div className="flex gap-2">
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder={current.placeholder}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleZip()}
            />
            <button
              onClick={handleZip}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800"
            >
              Next →
            </button>
          </div>
        )}

        {/* Contact info fields */}
        {current.type === 'contact' && (
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800"
            >
              Get My Free Matches →
            </button>
            <p className="text-xs text-gray-400 text-center">
              Free for families. Your info is never sold.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
