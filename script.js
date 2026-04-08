/* ================================================================
   SCRIPT.JS — ElderCareMatters V2 Wireframe
   Shared across all pages. Handles:
     1. Search bar (ZIP validation)
     2. Service card selection
     3. Intake chatbot multi-step flow
     4. Toast notifications
     5. Lead purchase simulation
     6. Active nav link highlighting
================================================================ */


/* ── UTILITIES ────────────────────────────────────────────── */

/** Show a temporary toast message at the bottom of the screen */
function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}


/* ── SEARCH BAR ───────────────────────────────────────────── */

/** Validate ZIP and trigger the "search" */
function handleSearch() {
  const input = document.getElementById('zip-input');
  const error = document.getElementById('search-error');
  if (!input) return;

  const zip = input.value.trim();
  error.textContent = '';

  if (!zip) {
    error.textContent = 'Please enter your ZIP code to continue.';
    input.focus();
    return;
  }
  if (!/^\d{5}$/.test(zip)) {
    error.textContent = 'Please enter a valid 5-digit ZIP code (numbers only).';
    input.focus();
    return;
  }

  showToast(`🔍 Searching for providers near ${zip}…`);
  setTimeout(() => showToast(`✅ Matched! Providers near ${zip} have been notified.`), 1900);
}

/* Allow pressing Enter in the ZIP input */
document.addEventListener('DOMContentLoaded', () => {
  const zipInput = document.getElementById('zip-input');
  if (zipInput) {
    zipInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });
  }
  highlightActiveNav();
});


/* ── SERVICE CARD SELECTION ───────────────────────────────── */

/** Highlight the clicked service card and scroll user to the search bar */
function selectService(name) {
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.service-card').forEach(c => {
    if (c.querySelector('.service-card__label')?.textContent === name) {
      c.classList.add('active');
    }
  });
  showToast(`Selected: ${name}`);
  setTimeout(() => {
    const bar = document.getElementById('search-bar');
    if (bar) { bar.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    const inp = document.getElementById('zip-input');
    if (inp) inp.focus();
  }, 500);
}


/* ── INTAKE CHATBOT ───────────────────────────────────────── */

const CHATBOT_STEPS = [
  { id: 'who',     q: 'Who needs care?',                              type: 'options', opts: ['A parent', 'A spouse', 'Myself', 'Another family member'] },
  { id: 'type',    q: 'What type of care are you looking for?',       type: 'options', opts: ['Home Care', 'Assisted Living', 'Memory Care', 'Elder Law Attorney', 'Care Management', 'Hospice', 'Not sure yet'] },
  { id: 'urgency', q: 'How soon do you need help?',                   type: 'options', opts: ['Urgent — within a week', 'Within a month', '1–3 months', 'Just researching'] },
  { id: 'budget',  q: 'What is your monthly budget? (optional)',      type: 'options', opts: ['Under $2,000', '$2,000–$4,000', '$4,000+', 'Skip'] },
  { id: 'zip',     q: 'What ZIP code are they located in?',           type: 'zip',     placeholder: 'e.g. 78701' },
  { id: 'contact', q: 'Where should we send your matches?',           type: 'contact' },
];

let chatStep    = 0;
let chatAnswers = {};

/** Render the current chatbot step */
function renderChatStep() {
  const bot  = document.getElementById('chatbot');
  if (!bot) return;

  const step   = CHATBOT_STEPS[chatStep];
  const total  = CHATBOT_STEPS.length;
  const pct    = Math.round((chatStep / total) * 100);

  bot.querySelector('.chatbot__progress-fill').style.width = pct + '%';
  bot.querySelector('.chatbot__step-label').textContent    = `Step ${chatStep + 1} of ${total}`;
  bot.querySelector('.chatbot__question').textContent      = step.q;

  const body = bot.querySelector('.chatbot__answer-area');
  body.innerHTML = '';

  /* Multiple-choice options */
  if (step.type === 'options') {
    const grid = document.createElement('div');
    grid.className = 'chatbot__options';
    (step.opts || []).forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chatbot__option';
      btn.textContent = opt;
      btn.onclick = () => { chatAnswers[step.id] = opt; chatStep++; renderChatStep(); };
      grid.appendChild(btn);
    });
    body.appendChild(grid);
  }

  /* ZIP input */
  if (step.type === 'zip') {
    const row = document.createElement('div');
    row.className = 'chatbot__input-row';
    const inp = document.createElement('input');
    inp.type = 'text'; inp.className = 'input'; inp.placeholder = step.placeholder; inp.maxLength = 5;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') submitZip(inp); });
    const btn = document.createElement('button');
    btn.className = 'btn btn--primary btn--sm'; btn.textContent = 'Next →';
    btn.onclick = () => submitZip(inp);
    row.appendChild(inp); row.appendChild(btn);
    body.appendChild(row);
    setTimeout(() => inp.focus(), 50);
  }

  /* Contact fields */
  if (step.type === 'contact') {
    const wrap = document.createElement('div');
    wrap.className = 'chatbot__contact';
    const nameInp  = createInput('text',  'Your name',           'chat-name');
    const emailInp = createInput('email', 'Your email address',  'chat-email');
    const note     = document.createElement('p');
    note.className = 'chatbot__note'; note.textContent = 'Free for families. Your info is never sold.';
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn--primary'; submitBtn.style.width = '100%';
    submitBtn.textContent = 'Get My Free Matches →';
    submitBtn.onclick = () => submitContact(nameInp, emailInp);
    wrap.appendChild(nameInp); wrap.appendChild(emailInp); wrap.appendChild(submitBtn); wrap.appendChild(note);
    body.appendChild(wrap);
  }
}

function createInput(type, placeholder, id) {
  const i = document.createElement('input');
  i.type = type; i.placeholder = placeholder; i.className = 'input'; i.id = id;
  return i;
}

function submitZip(inp) {
  const z = inp.value.trim();
  if (!/^\d{5}$/.test(z)) { inp.style.borderColor = 'var(--red-700)'; inp.focus(); return; }
  chatAnswers.zip = z;
  chatStep++;
  renderChatStep();
}

function submitContact(nameInp, emailInp) {
  if (!nameInp.value.trim()) { nameInp.style.borderColor = 'var(--red-700)'; nameInp.focus(); return; }
  if (!emailInp.value.includes('@')) { emailInp.style.borderColor = 'var(--red-700)'; emailInp.focus(); return; }
  chatAnswers.name  = nameInp.value.trim();
  chatAnswers.email = emailInp.value.trim();
  console.log('Lead captured:', chatAnswers); // In production: POST to API
  showChatDone();
}

function showChatDone() {
  const bot  = document.getElementById('chatbot');
  if (!bot) return;
  bot.querySelector('.chatbot__progress-fill').style.width = '100%';
  bot.querySelector('.chatbot__body').innerHTML = `
    <div class="chatbot__done">
      <div class="chatbot__done-icon">✅</div>
      <div class="chatbot__done-title">You're all set, ${chatAnswers.name}!</div>
      <div class="chatbot__done-sub">Providers near <strong>${chatAnswers.zip}</strong> have been notified.
        Expect a message within 24 hours.</div>
    </div>`;
}

/* Initialise chatbot if present on the page */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('chatbot')) renderChatStep();
});


/* ── LEAD PURCHASE SIMULATION ─────────────────────────────── */

/** Simulate purchasing a lead — reveals contact info */
function purchaseLead(leadId) {
  const card = document.querySelector(`[data-lead-id="${leadId}"]`);
  if (!card) return;

  const locked   = card.querySelector('.lead-card__locked');
  const contact  = card.querySelector('.lead-card__contact');
  const priceEl  = card.querySelector('.lead-card__price');
  const actionEl = card.querySelector('.lead-card__action-btn');

  // Swap UI to "purchased" state
  card.classList.add('lead-card--purchased');
  if (locked)   locked.style.display   = 'none';
  if (contact)  contact.style.display  = 'block';
  if (priceEl)  priceEl.classList.add('lead-card__price--paid');
  if (actionEl) {
    actionEl.textContent = 'Unlocked ✓';
    actionEl.disabled = true;
    actionEl.classList.remove('btn--primary');
    actionEl.classList.add('btn--ghost');
  }

  showToast('✅ Lead purchased! Contact details unlocked.');
}


/* ── ACTIVE NAV HIGHLIGHTING ──────────────────────────────── */

/** Mark the current page link in the header as active */
function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header__nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.includes(path) && path !== '') a.classList.add('active');
  });
}
