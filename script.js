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

/* ZIP → city/state lookup (covers major US metros) */
const ZIP_CITIES = {
  // Texas
  '78701':'Austin, TX','78702':'Austin, TX','78703':'Austin, TX','78704':'Austin, TX',
  '78741':'Austin, TX','78745':'Austin, TX','78746':'Austin, TX','78748':'Austin, TX',
  '77001':'Houston, TX','77002':'Houston, TX','77003':'Houston, TX','77004':'Houston, TX',
  '77401':'Houston, TX','77005':'Houston, TX',
  '75201':'Dallas, TX','75202':'Dallas, TX','75203':'Dallas, TX','75204':'Dallas, TX',
  '78201':'San Antonio, TX','78202':'San Antonio, TX','78203':'San Antonio, TX',
  // New York
  '10001':'New York, NY','10002':'New York, NY','10003':'New York, NY','10004':'New York, NY',
  '10021':'New York, NY','10022':'New York, NY','10023':'New York, NY','10036':'New York, NY',
  '11201':'Brooklyn, NY','11202':'Brooklyn, NY','11203':'Brooklyn, NY','11210':'Brooklyn, NY',
  '11101':'Queens, NY','11102':'Queens, NY','11103':'Queens, NY',
  // California
  '90001':'Los Angeles, CA','90002':'Los Angeles, CA','90003':'Los Angeles, CA',
  '90210':'Beverly Hills, CA','90211':'Beverly Hills, CA',
  '94102':'San Francisco, CA','94103':'San Francisco, CA','94104':'San Francisco, CA',
  '94105':'San Francisco, CA','94110':'San Francisco, CA',
  '92101':'San Diego, CA','92102':'San Diego, CA','92103':'San Diego, CA',
  // Illinois
  '60601':'Chicago, IL','60602':'Chicago, IL','60603':'Chicago, IL','60604':'Chicago, IL',
  '60611':'Chicago, IL','60614':'Chicago, IL','60615':'Chicago, IL',
  // Florida
  '33101':'Miami, FL','33102':'Miami, FL','33109':'Miami, FL','33125':'Miami, FL',
  '32801':'Orlando, FL','32802':'Orlando, FL','32803':'Orlando, FL',
  '33601':'Tampa, FL','33602':'Tampa, FL','33603':'Tampa, FL',
  // Georgia
  '30301':'Atlanta, GA','30302':'Atlanta, GA','30303':'Atlanta, GA','30308':'Atlanta, GA',
  // Arizona
  '85001':'Phoenix, AZ','85002':'Phoenix, AZ','85003':'Phoenix, AZ','85004':'Phoenix, AZ',
  // Pennsylvania
  '19101':'Philadelphia, PA','19102':'Philadelphia, PA','19103':'Philadelphia, PA',
  // Washington
  '98101':'Seattle, WA','98102':'Seattle, WA','98103':'Seattle, WA','98104':'Seattle, WA',
  // Massachusetts
  '02101':'Boston, MA','02102':'Boston, MA','02108':'Boston, MA','02109':'Boston, MA',
  '02110':'Boston, MA','02111':'Boston, MA',
  // Colorado
  '80201':'Denver, CO','80202':'Denver, CO','80203':'Denver, CO','80204':'Denver, CO',
  // Nevada
  '89101':'Las Vegas, NV','89102':'Las Vegas, NV','89103':'Las Vegas, NV',
  // North Carolina
  '27601':'Raleigh, NC','27602':'Raleigh, NC','27603':'Raleigh, NC',
  '28201':'Charlotte, NC','28202':'Charlotte, NC','28203':'Charlotte, NC',
};

/* Provider data — keyed by state abbreviation */
const PROVIDERS = [
  { name:'Sunrise Home Care',        type:'Home Care Agency',       city:'Austin',        state:'TX', rating:4.9, reviews:134, badge:true,  specialties:['Home Care','Memory Care','Respite Care'] },
  { name:'Caring Hands Agency',      type:'Home Care Agency',       city:'Austin',        state:'TX', rating:4.7, reviews:89,  badge:true,  specialties:['Home Care','Daily Living Assistance'] },
  { name:'Austin Elder Law Group',   type:'Elder Law Attorney',     city:'Austin',        state:'TX', rating:4.8, reviews:201, badge:true,  specialties:['Elder Law','Estate Planning','Medicaid'] },
  { name:'Central Texas Memory Care',type:'Memory Care Facility',   city:'Austin',        state:'TX', rating:4.6, reviews:57,  badge:false, specialties:['Memory Care','Dementia Care'] },
  { name:'Lone Star Care Management',type:'Care Manager',           city:'Austin',        state:'TX', rating:4.8, reviews:112, badge:true,  specialties:['Care Management','Hospital Discharge'] },
  { name:'HoustonCare Home Services',type:'Home Care Agency',       city:'Houston',       state:'TX', rating:4.7, reviews:98,  badge:true,  specialties:['Home Care','Personal Care','Companionship'] },
  { name:'Gulf Coast Elder Law',     type:'Elder Law Attorney',     city:'Houston',       state:'TX', rating:4.9, reviews:176, badge:true,  specialties:['Elder Law','Guardianship','Veterans Benefits'] },
  { name:'Dallas Senior Living',     type:'Assisted Living',        city:'Dallas',        state:'TX', rating:4.5, reviews:63,  badge:true,  specialties:['Assisted Living','Memory Care'] },
  { name:'Metroplex Care Partners',  type:'Care Manager',           city:'Dallas',        state:'TX', rating:4.8, reviews:88,  badge:true,  specialties:['Care Management','Geriatric Care'] },
  { name:'SA Home Health Pros',      type:'Home Care Agency',       city:'San Antonio',   state:'TX', rating:4.6, reviews:74,  badge:false, specialties:['Home Care','Skilled Nursing','Physical Therapy'] },
  { name:'Manhattan Elder Care',     type:'Home Care Agency',       city:'New York',      state:'NY', rating:4.8, reviews:312, badge:true,  specialties:['Home Care','24-Hour Care','Alzheimers Care'] },
  { name:'NYC Elder Law Associates', type:'Elder Law Attorney',     city:'New York',      state:'NY', rating:4.9, reviews:445, badge:true,  specialties:['Elder Law','Medicaid Planning','Trusts'] },
  { name:'Brooklyn Senior Services', type:'Care Manager',           city:'Brooklyn',      state:'NY', rating:4.7, reviews:143, badge:true,  specialties:['Care Management','Benefits Navigation'] },
  { name:'Queens Home Companions',   type:'Home Care Agency',       city:'Queens',        state:'NY', rating:4.6, reviews:91,  badge:false, specialties:['Home Care','Companion Care'] },
  { name:'LA Senior Care Network',   type:'Care Manager',           city:'Los Angeles',   state:'CA', rating:4.8, reviews:267, badge:true,  specialties:['Care Management','Geriatric Assessment'] },
  { name:'Pacific Elder Law',        type:'Elder Law Attorney',     city:'Los Angeles',   state:'CA', rating:4.9, reviews:389, badge:true,  specialties:['Elder Law','Medi-Cal Planning','Conservatorship'] },
  { name:'Bay Area Elder Advocates', type:'Elder Law Attorney',     city:'San Francisco', state:'CA', rating:4.9, reviews:201, badge:true,  specialties:['Elder Law','Medi-Cal','Special Needs Trusts'] },
  { name:'SF Home Care Collective',  type:'Home Care Agency',       city:'San Francisco', state:'CA', rating:4.7, reviews:118, badge:true,  specialties:['Home Care','Memory Care','Hospice Support'] },
  { name:'San Diego Senior Helpers', type:'Home Care Agency',       city:'San Diego',     state:'CA', rating:4.6, reviews:83,  badge:true,  specialties:['Home Care','Alzheimers Care','Parkinson\'s Care'] },
  { name:'Chicago Elder Law Firm',   type:'Elder Law Attorney',     city:'Chicago',       state:'IL', rating:4.8, reviews:234, badge:true,  specialties:['Elder Law','Medicaid Planning','Asset Protection'] },
  { name:'Windy City Home Care',     type:'Home Care Agency',       city:'Chicago',       state:'IL', rating:4.7, reviews:156, badge:true,  specialties:['Home Care','Overnight Care','Dementia Care'] },
  { name:'Miami Senior Advisors',    type:'Care Manager',           city:'Miami',         state:'FL', rating:4.8, reviews:147, badge:true,  specialties:['Care Management','Facility Placement'] },
  { name:'South Florida Elder Law',  type:'Elder Law Attorney',     city:'Miami',         state:'FL', rating:4.9, reviews:298, badge:true,  specialties:['Elder Law','Medicaid','Probate'] },
  { name:'Orlando Care Solutions',   type:'Home Care Agency',       city:'Orlando',       state:'FL', rating:4.6, reviews:79,  badge:false, specialties:['Home Care','Respite Care'] },
  { name:'Tampa Bay Senior Living',  type:'Assisted Living',        city:'Tampa',         state:'FL', rating:4.7, reviews:92,  badge:true,  specialties:['Assisted Living','Memory Care','Respite Stays'] },
  { name:'Peachtree Elder Law',      type:'Elder Law Attorney',     city:'Atlanta',       state:'GA', rating:4.8, reviews:188, badge:true,  specialties:['Elder Law','Medicaid Planning','Wills & Trusts'] },
  { name:'Atlanta Senior Care Group',type:'Care Manager',           city:'Atlanta',       state:'GA', rating:4.7, reviews:104, badge:true,  specialties:['Care Management','Crisis Intervention'] },
  { name:'Desert Sun Senior Care',   type:'Home Care Agency',       city:'Phoenix',       state:'AZ', rating:4.6, reviews:88,  badge:true,  specialties:['Home Care','24-Hour Care'] },
  { name:'Philly Elder Law Center',  type:'Elder Law Attorney',     city:'Philadelphia',  state:'PA', rating:4.8, reviews:212, badge:true,  specialties:['Elder Law','Medicaid','Guardianship'] },
  { name:'Seattle Senior Solutions', type:'Care Manager',           city:'Seattle',       state:'WA', rating:4.9, reviews:134, badge:true,  specialties:['Care Management','Discharge Planning'] },
  { name:'Pacific NW Home Care',     type:'Home Care Agency',       city:'Seattle',       state:'WA', rating:4.7, reviews:97,  badge:true,  specialties:['Home Care','Memory Care'] },
  { name:'Boston Elder Advocates',   type:'Elder Law Attorney',     city:'Boston',        state:'MA', rating:4.9, reviews:276, badge:true,  specialties:['Elder Law','MassHealth Planning','Trusts'] },
  { name:'Mile High Senior Care',    type:'Home Care Agency',       city:'Denver',        state:'CO', rating:4.6, reviews:71,  badge:false, specialties:['Home Care','Companion Care','Personal Care'] },
  { name:'Vegas Valley Elder Law',   type:'Elder Law Attorney',     city:'Las Vegas',     state:'NV', rating:4.7, reviews:143, badge:true,  specialties:['Elder Law','Medicaid','Estate Planning'] },
  { name:'Triangle Senior Services', type:'Care Manager',           city:'Raleigh',       state:'NC', rating:4.8, reviews:89,  badge:true,  specialties:['Care Management','Geriatric Care'] },
  { name:'Queen City Elder Care',    type:'Home Care Agency',       city:'Charlotte',     state:'NC', rating:4.6, reviews:67,  badge:false, specialties:['Home Care','Dementia Care'] },
];

const TYPE_ICONS = {
  'Home Care Agency':     '🏠',
  'Elder Law Attorney':   '⚖️',
  'Care Manager':         '📋',
  'Memory Care Facility': '🧠',
  'Assisted Living':      '🏡',
  'Hospice Provider':     '🤝',
};

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

  const cityState = ZIP_CITIES[zip] || null;
  const resultsSection = document.getElementById('search-results');
  const grid           = document.getElementById('provider-results-grid');
  const eyebrow        = document.getElementById('results-eyebrow');
  const title          = document.getElementById('results-title');
  const subtitle       = document.getElementById('results-subtitle');

  if (!resultsSection || !grid) return;

  // Show loading state
  showToast('🔍 Searching for providers near ' + zip + '…');

  setTimeout(() => {
    let matched = [];

    if (cityState) {
      const [city, state] = cityState.split(', ');
      // First try city match, then fall back to state match
      matched = PROVIDERS.filter(p => p.city === city && p.state === state);
      if (matched.length === 0) matched = PROVIDERS.filter(p => p.state === state);
    }

    // If still nothing, show nationwide sample
    if (matched.length === 0) {
      matched = PROVIDERS.filter(p => p.badge).slice(0, 4);
    }

    // Cap at 4 results
    matched = matched.slice(0, 4);

    const locationLabel = cityState || 'your area';

    eyebrow.textContent  = `ZIP ${zip} · ${locationLabel}`;
    title.textContent    = `${matched.length} Verified Providers Found`;
    subtitle.textContent = `These providers cover ${locationLabel} and are accepting new clients.`;

    grid.innerHTML = matched.map(p => `
      <div class="card" style="padding:20px; display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px;">
          <div>
            <p style="font-size:1rem; font-weight:700; color:var(--navy); margin-bottom:3px;">${p.name}</p>
            <p style="font-size:.8rem; color:var(--gray-500);">${TYPE_ICONS[p.type] || '📍'} ${p.type} · ${p.city}, ${p.state}</p>
          </div>
          ${p.badge ? '<span style="background:#dcfce7;color:#15803d;font-size:.72rem;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap;">✓ ECM Verified</span>' : ''}
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="color:#f59e0b; font-size:.9rem;">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}</span>
          <span style="font-size:.8rem; color:var(--gray-500);">${p.rating} (${p.reviews} reviews)</span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${p.specialties.map(s => `<span style="background:var(--blue-50);color:var(--blue-700);font-size:.72rem;font-weight:600;padding:3px 10px;border-radius:20px;">${s}</span>`).join('')}
        </div>
        <button class="btn btn--primary btn--sm" style="margin-top:4px;" onclick="showToast('Request sent to ${p.name}! They will contact you shortly.')">Request a Match →</button>
      </div>
    `).join('');

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('✅ ' + matched.length + ' providers found near ' + zip);
  }, 800);
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
