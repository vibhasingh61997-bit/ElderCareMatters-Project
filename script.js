// ============================================================
// SCRIPT.JS — ElderCareMatters
// All interactivity lives here.
// Each function is explained with a comment above it.
// ============================================================


// ── SEARCH BAR ────────────────────────────────────────────────
// Called when the user clicks "Find Care Near Me"
function handleSearch() {
  const input = document.getElementById('zip-input')
  const error = document.getElementById('search-error')
  const zip   = input.value.trim()

  // Clear any previous error message
  error.textContent = ''

  // Validation: ZIP must be 5 digits
  const isValidZip = /^\d{5}$/.test(zip)

  if (!zip) {
    error.textContent = 'Please enter your ZIP code to continue.'
    input.focus()
    return
  }

  if (!isValidZip) {
    error.textContent = 'Please enter a valid 5-digit ZIP code.'
    input.focus()
    return
  }

  // ZIP is valid — show a success toast
  showToast(`Finding care providers near ${zip}…`)

  // In a real app, this would redirect to the intake chatbot
  // or submit the ZIP to the server. For now we just show the toast.
  setTimeout(() => {
    showToast(`✓ Matched! Showing providers near ${zip}`)
  }, 1800)
}


// ── SERVICE CARD SELECTION ────────────────────────────────────
// Called when the user clicks one of the 6 care type cards.
// Highlights the selected card and confirms the choice.
function selectService(serviceName) {
  // Remove 'selected' highlight from any previously selected card
  document.querySelectorAll('.service-card').forEach(card => {
    card.classList.remove('selected')
  })

  // Highlight the card that was just clicked
  // We find it by matching the label text
  document.querySelectorAll('.service-card').forEach(card => {
    const label = card.querySelector('.service-card__label').textContent
    if (label === serviceName) {
      card.classList.add('selected')
    }
  })

  // Show a confirmation toast
  showToast(`Selected: ${serviceName}`)

  // Scroll the user up to the search bar so they can enter their ZIP
  setTimeout(() => {
    document.getElementById('search-bar').scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    document.getElementById('zip-input').focus()
  }, 600)
}


// ── TOAST NOTIFICATION ────────────────────────────────────────
// Shows a small popup message at the bottom of the screen.
// It disappears automatically after 2.5 seconds.
function showToast(message) {
  const toast = document.getElementById('toast')
  toast.textContent = message
  toast.classList.add('show')

  // Remove it after 2.5 seconds
  setTimeout(() => {
    toast.classList.remove('show')
  }, 2500)
}


// ── ENTER KEY SUPPORT ─────────────────────────────────────────
// Lets users press Enter in the ZIP input instead of clicking the button
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('zip-input')
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    })
  }
})
