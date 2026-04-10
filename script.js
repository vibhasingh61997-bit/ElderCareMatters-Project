/* ================================================================
   SCRIPT.JS — ElderCareMatters
   Handles:
     1. Auto-location detection + location modal
     2. Search bar (type + location)
     3. Provider results with tier badges + empty state
     4. Results in-page filtering
     5. Service card selection
     6. Intake chatbot (multi-step, with auto-fill)
     7. Toast notifications
     8. Lead purchase simulation
     9. Active nav highlighting
================================================================ */


/* ── UTILITIES ────────────────────────────────────────────── */

function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}


/* ── ZIP → CITY LOOKUP ────────────────────────────────────── */

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

// City name → normalized city key for provider lookup
const CITY_ALIASES = {
  'new york city':'New York','nyc':'New York','manhattan':'New York',
  'la':'Los Angeles','los angeles':'Los Angeles',
  'sf':'San Francisco','san francisco':'San Francisco',
  'chicago':'Chicago','austin':'Austin','houston':'Houston',
  'dallas':'Dallas','miami':'Miami','atlanta':'Atlanta',
  'seattle':'Seattle','boston':'Boston','denver':'Denver',
  'philadelphia':'Philadelphia','philly':'Philadelphia',
  'phoenix':'Phoenix','orlando':'Orlando','tampa':'Tampa',
  'san antonio':'San Antonio','san diego':'San Diego',
  'brooklyn':'Brooklyn','queens':'Queens',
  'las vegas':'Las Vegas','raleigh':'Raleigh','charlotte':'Charlotte',
};


/* ── PROVIDER DATA ────────────────────────────────────────── */

// tier: 'premium' | 'promoted' | 'basic' | 'free'
const PROVIDERS = [
  { name:'Sunrise Home Care',         type:'Home Care Agency',       city:'Austin',        state:'TX', rating:4.9, reviews:134, badge:true,  tier:'premium',  specialties:['Home Care','Memory Care','Respite Care'] },
  { name:'Caring Hands Agency',       type:'Home Care Agency',       city:'Austin',        state:'TX', rating:4.7, reviews:89,  badge:true,  tier:'promoted', specialties:['Home Care','Daily Living Assistance'] },
  { name:'Austin Elder Law Group',    type:'Elder Law Attorney',     city:'Austin',        state:'TX', rating:4.8, reviews:201, badge:true,  tier:'premium',  specialties:['Elder Law','Estate Planning','Medicaid'] },
  { name:'Central Texas Memory Care', type:'Memory Care Facility',   city:'Austin',        state:'TX', rating:4.6, reviews:57,  badge:false, tier:'basic',    specialties:['Memory Care','Dementia Care'] },
  { name:'Lone Star Care Management', type:'Care Manager',           city:'Austin',        state:'TX', rating:4.8, reviews:112, badge:true,  tier:'promoted', specialties:['Care Management','Hospital Discharge'] },
  { name:'HoustonCare Home Services', type:'Home Care Agency',       city:'Houston',       state:'TX', rating:4.7, reviews:98,  badge:true,  tier:'promoted', specialties:['Home Care','Personal Care','Companionship'] },
  { name:'Gulf Coast Elder Law',      type:'Elder Law Attorney',     city:'Houston',       state:'TX', rating:4.9, reviews:176, badge:true,  tier:'premium',  specialties:['Elder Law','Guardianship','Veterans Benefits'] },
  { name:'Dallas Senior Living',      type:'Assisted Living',        city:'Dallas',        state:'TX', rating:4.5, reviews:63,  badge:true,  tier:'promoted', specialties:['Assisted Living','Memory Care'] },
  { name:'Metroplex Care Partners',   type:'Care Manager',           city:'Dallas',        state:'TX', rating:4.8, reviews:88,  badge:true,  tier:'basic',    specialties:['Care Management','Geriatric Care'] },
  { name:'SA Home Health Pros',       type:'Home Care Agency',       city:'San Antonio',   state:'TX', rating:4.6, reviews:74,  badge:false, tier:'basic',    specialties:['Home Care','Skilled Nursing','Physical Therapy'] },
  { name:'Manhattan Elder Care',      type:'Home Care Agency',       city:'New York',      state:'NY', rating:4.8, reviews:312, badge:true,  tier:'premium',  specialties:['Home Care','24-Hour Care','Alzheimers Care'] },
  { name:'NYC Elder Law Associates',  type:'Elder Law Attorney',     city:'New York',      state:'NY', rating:4.9, reviews:445, badge:true,  tier:'premium',  specialties:['Elder Law','Medicaid Planning','Trusts'] },
  { name:'Brooklyn Senior Services',  type:'Care Manager',           city:'Brooklyn',      state:'NY', rating:4.7, reviews:143, badge:true,  tier:'promoted', specialties:['Care Management','Benefits Navigation'] },
  { name:'Queens Home Companions',    type:'Home Care Agency',       city:'Queens',        state:'NY', rating:4.6, reviews:91,  badge:false, tier:'basic',    specialties:['Home Care','Companion Care'] },
  { name:'LA Senior Care Network',    type:'Care Manager',           city:'Los Angeles',   state:'CA', rating:4.8, reviews:267, badge:true,  tier:'premium',  specialties:['Care Management','Geriatric Assessment'] },
  { name:'Pacific Elder Law',         type:'Elder Law Attorney',     city:'Los Angeles',   state:'CA', rating:4.9, reviews:389, badge:true,  tier:'premium',  specialties:['Elder Law','Medi-Cal Planning','Conservatorship'] },
  { name:'Bay Area Elder Advocates',  type:'Elder Law Attorney',     city:'San Francisco', state:'CA', rating:4.9, reviews:201, badge:true,  tier:'premium',  specialties:['Elder Law','Medi-Cal','Special Needs Trusts'] },
  { name:'SF Home Care Collective',   type:'Home Care Agency',       city:'San Francisco', state:'CA', rating:4.7, reviews:118, badge:true,  tier:'promoted', specialties:['Home Care','Memory Care','Hospice Support'] },
  { name:'San Diego Senior Helpers',  type:'Home Care Agency',       city:'San Diego',     state:'CA', rating:4.6, reviews:83,  badge:true,  tier:'basic',    specialties:['Home Care','Alzheimers Care','Parkinson\'s Care'] },
  { name:'Chicago Elder Law Firm',    type:'Elder Law Attorney',     city:'Chicago',       state:'IL', rating:4.8, reviews:234, badge:true,  tier:'premium',  specialties:['Elder Law','Medicaid Planning','Asset Protection'] },
  { name:'Windy City Home Care',      type:'Home Care Agency',       city:'Chicago',       state:'IL', rating:4.7, reviews:156, badge:true,  tier:'promoted', specialties:['Home Care','Overnight Care','Dementia Care'] },
  { name:'Miami Senior Advisors',     type:'Care Manager',           city:'Miami',         state:'FL', rating:4.8, reviews:147, badge:true,  tier:'promoted', specialties:['Care Management','Facility Placement'] },
  { name:'South Florida Elder Law',   type:'Elder Law Attorney',     city:'Miami',         state:'FL', rating:4.9, reviews:298, badge:true,  tier:'premium',  specialties:['Elder Law','Medicaid','Probate'] },
  { name:'Orlando Care Solutions',    type:'Home Care Agency',       city:'Orlando',       state:'FL', rating:4.6, reviews:79,  badge:false, tier:'free',     specialties:['Home Care','Respite Care'] },
  { name:'Tampa Bay Senior Living',   type:'Assisted Living',        city:'Tampa',         state:'FL', rating:4.7, reviews:92,  badge:true,  tier:'promoted', specialties:['Assisted Living','Memory Care','Respite Stays'] },
  { name:'Peachtree Elder Law',       type:'Elder Law Attorney',     city:'Atlanta',       state:'GA', rating:4.8, reviews:188, badge:true,  tier:'premium',  specialties:['Elder Law','Medicaid Planning','Wills & Trusts'] },
  { name:'Atlanta Senior Care Group', type:'Care Manager',           city:'Atlanta',       state:'GA', rating:4.7, reviews:104, badge:true,  tier:'basic',    specialties:['Care Management','Crisis Intervention'] },
  { name:'Desert Sun Senior Care',    type:'Home Care Agency',       city:'Phoenix',       state:'AZ', rating:4.6, reviews:88,  badge:true,  tier:'basic',    specialties:['Home Care','24-Hour Care'] },
  { name:'Philly Elder Law Center',   type:'Elder Law Attorney',     city:'Philadelphia',  state:'PA', rating:4.8, reviews:212, badge:true,  tier:'promoted', specialties:['Elder Law','Medicaid','Guardianship'] },
  { name:'Seattle Senior Solutions',  type:'Care Manager',           city:'Seattle',       state:'WA', rating:4.9, reviews:134, badge:true,  tier:'premium',  specialties:['Care Management','Discharge Planning'] },
  { name:'Pacific NW Home Care',      type:'Home Care Agency',       city:'Seattle',       state:'WA', rating:4.7, reviews:97,  badge:true,  tier:'basic',    specialties:['Home Care','Memory Care'] },
  { name:'Boston Elder Advocates',    type:'Elder Law Attorney',     city:'Boston',        state:'MA', rating:4.9, reviews:276, badge:true,  tier:'premium',  specialties:['Elder Law','MassHealth Planning','Trusts'] },
  { name:'Mile High Senior Care',     type:'Home Care Agency',       city:'Denver',        state:'CO', rating:4.6, reviews:71,  badge:false, tier:'free',     specialties:['Home Care','Companion Care','Personal Care'] },
  { name:'Vegas Valley Elder Law',    type:'Elder Law Attorney',     city:'Las Vegas',     state:'NV', rating:4.7, reviews:143, badge:true,  tier:'promoted', specialties:['Elder Law','Medicaid','Estate Planning'] },
  { name:'Triangle Senior Services',  type:'Care Manager',           city:'Raleigh',       state:'NC', rating:4.8, reviews:89,  badge:true,  tier:'basic',    specialties:['Care Management','Geriatric Care'] },
  { name:'Queen City Elder Care',     type:'Home Care Agency',       city:'Charlotte',     state:'NC', rating:4.6, reviews:67,  badge:false, tier:'free',     specialties:['Home Care','Dementia Care'] },
];

const TYPE_ICONS = {
  'Home Care Agency':     '🏠',
  'Elder Law Attorney':   '⚖️',
  'Care Manager':         '📋',
  'Memory Care Facility': '🧠',
  'Assisted Living':      '🏡',
  'Hospice Provider':     '🤝',
};

const TIER_CONFIG = {
  premium:  { label: '🏆 Premium',  cls: 'tier-badge--premium',  cardCls: 'provider-card--premium' },
  promoted: { label: '⭐ Promoted', cls: 'tier-badge--promoted', cardCls: 'provider-card--promoted' },
  basic:    { label: '📌 Basic',    cls: 'tier-badge--basic',    cardCls: '' },
  free:     { label: 'Free',        cls: 'tier-badge--basic',    cardCls: '' },
};


/* ── AUTO-LOCATION STATE ──────────────────────────────────── */

// currentLocation holds { cityState: "Austin, TX", city: "Austin", state: "TX" } or null
let currentLocation = null;

// Restore saved location from localStorage
function initLocation() {
  const saved = localStorage.getItem('ecm_location');
  if (saved) {
    try {
      currentLocation = JSON.parse(saved);
      updateLocationDisplay();
    } catch(e) { /* ignore */ }
  }
}

function saveLocation(cityState) {
  const parts = cityState.split(', ');
  currentLocation = { cityState, city: parts[0], state: parts[1] || '' };
  localStorage.setItem('ecm_location', JSON.stringify(currentLocation));
  updateLocationDisplay();
}

function updateLocationDisplay() {
  const disp = document.getElementById('location-display');
  const em   = document.getElementById('hero-city-em');
  if (!currentLocation) return;
  if (disp) disp.textContent = currentLocation.cityState;
  if (em)   em.textContent   = currentLocation.city;
}


/* ── LOCATION MODAL ───────────────────────────────────────── */

function openLocationModal() {
  const overlay = document.getElementById('loc-modal-overlay');
  if (overlay) {
    overlay.classList.add('open');
    setTimeout(() => {
      const inp = document.getElementById('loc-zip-input');
      if (inp) inp.focus();
    }, 120);
  }
}

function closeLocationModal() {
  const overlay = document.getElementById('loc-modal-overlay');
  if (overlay) overlay.classList.remove('open');
}

function handleModalOverlayClick(e) {
  if (e.target === e.currentTarget) closeLocationModal();
}

function applyLocation() {
  const zipInp   = document.getElementById('loc-zip-input');
  const cityInp  = document.getElementById('loc-city-input');
  const stateSel = document.getElementById('loc-state-select');

  const zip  = zipInp  ? zipInp.value.trim()  : '';
  const city = cityInp ? cityInp.value.trim()  : '';
  const st   = stateSel? stateSel.value        : '';

  // Try ZIP first
  if (/^\d{5}$/.test(zip) && ZIP_CITIES[zip]) {
    saveLocation(ZIP_CITIES[zip]);
    closeLocationModal();
    showToast('📍 Location set to ' + ZIP_CITIES[zip]);
    return;
  }

  // Try city + state
  if (city && st) {
    const normalized = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    const cityState  = normalized + ', ' + st;
    saveLocation(cityState);
    closeLocationModal();
    showToast('📍 Location set to ' + cityState);
    return;
  }

  // Try city alias alone
  if (city) {
    const alias = CITY_ALIASES[city.toLowerCase()];
    if (alias) {
      // Find a provider in that city to get the state
      const match = PROVIDERS.find(p => p.city === alias);
      if (match) {
        saveLocation(alias + ', ' + match.state);
        closeLocationModal();
        showToast('📍 Location set to ' + alias + ', ' + match.state);
        return;
      }
    }
  }

  // Show error
  if (zipInp) {
    zipInp.style.borderColor = '#ef4444';
    setTimeout(() => { zipInp.style.borderColor = ''; }, 2000);
  }
  showToast('Please enter a valid ZIP code or city + state.');
}

// Allow Enter key in modal inputs
document.addEventListener('DOMContentLoaded', () => {
  ['loc-zip-input', 'loc-city-input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') applyLocation(); });
  });
  if (document.getElementById('loc-modal-overlay')) {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLocationModal();
    });
  }
});


/* ── SEARCH LOGIC ─────────────────────────────────────────── */

// Stores the last full matched set for in-page filtering
let _lastMatchedProviders = [];
let _lastLocationLabel    = '';

function handleSearch() {
  const typeSel = document.getElementById('care-type-select');
  const selectedType = typeSel ? typeSel.value : '';

  const resultsSection = document.getElementById('search-results');
  const grid           = document.getElementById('provider-results-grid');
  const eyebrow        = document.getElementById('results-eyebrow');
  const title          = document.getElementById('results-title');
  const subtitle       = document.getElementById('results-subtitle');
  if (!resultsSection || !grid) return;

  // Determine location
  let matched = [];
  let locationLabel = 'your area';

  if (currentLocation) {
    const { city, state, cityState } = currentLocation;
    locationLabel = cityState;
    matched = PROVIDERS.filter(p => p.city === city && p.state === state);
    if (matched.length === 0) matched = PROVIDERS.filter(p => p.state === state);
  }

  if (matched.length === 0) {
    // No location set or no local providers — show top verified nationwide
    matched = PROVIDERS.filter(p => p.tier === 'premium' || p.tier === 'promoted');
    locationLabel = 'your area';
  }

  // Filter by type if selected
  if (selectedType) {
    const typeFiltered = matched.filter(p => p.type === selectedType);
    matched = typeFiltered; // may be empty — handled below
  }

  // Sort: premium first, then promoted, basic, free
  const tierOrder = { premium: 0, promoted: 1, basic: 2, free: 3 };
  matched = matched.sort((a, b) => (tierOrder[a.tier] ?? 9) - (tierOrder[b.tier] ?? 9));

  // Save for in-page filter
  _lastMatchedProviders = matched;
  _lastLocationLabel    = locationLabel;

  // Sync results filter dropdown to search dropdown
  const resFilt = document.getElementById('results-type-filter');
  if (resFilt && selectedType) resFilt.value = selectedType;

  // Update header text
  eyebrow.textContent  = locationLabel !== 'your area' ? '📍 ' + locationLabel : '📍 Based on your location';
  const typeLabel = selectedType
    ? selectedType.replace(' Agency','').replace(' Facility','').replace(' Attorney','')
    : 'All care types';
  title.textContent    = matched.length > 0
    ? `${matched.length} ${typeLabel} Provider${matched.length !== 1 ? 's' : ''} Found`
    : 'No Providers Found';
  subtitle.textContent = matched.length > 0
    ? `Showing ${matched.length} verified provider${matched.length !== 1 ? 's' : ''} in ${locationLabel} — sorted by listing tier.`
    : '';

  renderProviderCards(matched, grid, locationLabel, selectedType || 'this care type');

  resultsSection.style.display = 'block';
  showToast(matched.length > 0 ? `✅ ${matched.length} providers found` : '⚠️ No providers found — try expanding your search');
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

/* Filter the already-displayed results by type */
function filterResults() {
  const sel = document.getElementById('results-type-filter');
  if (!sel) return;
  const type = sel.value;
  const grid = document.getElementById('provider-results-grid');
  if (!grid) return;

  const filtered = type
    ? _lastMatchedProviders.filter(p => p.type === type)
    : _lastMatchedProviders;

  // Update title count
  const title = document.getElementById('results-title');
  if (title) {
    const typeLabel = type ? type.replace(' Agency','').replace(' Facility','').replace(' Attorney','') : 'All';
    title.textContent = filtered.length > 0
      ? `${filtered.length} ${typeLabel} Provider${filtered.length !== 1 ? 's' : ''} Found`
      : 'No Providers Found';
  }

  renderProviderCards(filtered, grid, _lastLocationLabel, type || 'this care type');
}

/* Build and inject provider cards */
function renderProviderCards(providers, grid, locationLabel, typeLabel) {
  const countTag = document.getElementById('results-count-tag');
  if (countTag) countTag.textContent = providers.length + ' result' + (providers.length !== 1 ? 's' : '');

  if (providers.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <h3 class="empty-state__title">No providers found in ${locationLabel}</h3>
        <p class="empty-state__sub">
          We couldn't find ${typeLabel} providers in this area yet.
          Try changing your location or selecting a different care type.
        </p>
        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
          <button class="btn btn--secondary" onclick="openLocationModal()">Change Location</button>
          <a href="#chatbot-section" class="btn btn--primary"
             onclick="document.getElementById('chatbot-section').scrollIntoView({behavior:'smooth'}); return false;">
            Request a Match →
          </a>
        </div>
      </div>`;
    return;
  }

  grid.innerHTML = providers.map(p => {
    const tier   = TIER_CONFIG[p.tier] || TIER_CONFIG.basic;
    const icon   = TYPE_ICONS[p.type] || '📍';
    const stars  = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));

    return `
      <div class="provider-card ${tier.cardCls}">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px;">
          <div style="flex:1;">
            <p style="font-size:1rem; font-weight:700; color:var(--navy); margin-bottom:3px;">${p.name}</p>
            <p style="font-size:.8rem; color:var(--gray-500);">${icon} ${p.type} · ${p.city}, ${p.state}</p>
          </div>
          <div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end; flex-shrink:0;">
            <span class="tier-badge ${tier.cls}">${tier.label}</span>
            ${p.badge ? '<span class="ecm-badge">✓ ECM Verified</span>' : ''}
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="color:#f59e0b; font-size:.9rem;">${stars}</span>
          <span style="font-size:.8rem; font-weight:700; color:var(--gray-700);">${p.rating}</span>
          <span style="font-size:.8rem; color:var(--gray-400);">(${p.reviews} reviews)</span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${p.specialties.map(s => `<span style="background:var(--blue-50);color:var(--blue-700);font-size:.72rem;font-weight:600;padding:3px 10px;border-radius:20px;">${s}</span>`).join('')}
        </div>
        <button class="btn btn--primary btn--sm" style="margin-top:4px; align-self:flex-start;"
          onclick="requestMatch('${p.name.replace(/'/g,"\\'")}')">
          Request Info →
        </button>
      </div>`;
  }).join('');
}

function requestMatch(providerName) {
  showToast('✅ Request sent to ' + providerName + '! They will contact you shortly.');
  // Scroll to chatbot for full intake
  setTimeout(() => {
    const cb = document.getElementById('chatbot-section');
    if (cb) cb.scrollIntoView({ behavior: 'smooth' });
  }, 1200);
}


/* ── SERVICE CARD SELECTION ───────────────────────────────── */

function selectServiceType(type) {
  // Highlight the card
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.service-card').forEach(c => {
    if (c.querySelector('.service-card__label')?.textContent.trim() ===
        type.replace(' Agency','').replace(' Facility','').replace(' Attorney','')) {
      c.classList.add('active');
    }
  });

  // Set the search dropdown and trigger search
  const sel = document.getElementById('care-type-select');
  if (sel) sel.value = type;

  showToast('Searching for ' + type + ' providers…');
  setTimeout(() => handleSearch(), 300);

  // Scroll to results
  setTimeout(() => {
    const bar = document.getElementById('search-bar');
    if (bar) bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

// Legacy alias (used by some pages)
function selectService(name) {
  selectServiceType(name);
}


/* ── INTAKE CHATBOT ───────────────────────────────────────── */

const CHATBOT_STEPS = [
  { id:'who',     q:'Who needs care?',                              type:'options', opts:['A parent','A spouse','Myself','Another family member'] },
  { id:'type',    q:'What type of care are you looking for?',       type:'options', opts:['Home Care','Assisted Living','Memory Care','Elder Law Attorney','Care Management','Hospice','Not sure yet'] },
  { id:'urgency', q:'How soon do you need help?',                   type:'options', opts:['Urgent — within a week','Within a month','1–3 months','Just researching'] },
  { id:'budget',  q:'What is your monthly budget? (optional)',      type:'options', opts:['Under $2,000','$2,000–$4,000','$4,000+','Skip'] },
  { id:'zip',     q:'What ZIP code are they located in?',           type:'zip',     placeholder:'e.g. 78701' },
  { id:'contact', q:'Where should we send your matches?',           type:'contact' },
];

let chatStep    = 0;
let chatAnswers = {};

function renderChatStep() {
  const bot = document.getElementById('chatbot');
  if (!bot) return;

  const step  = CHATBOT_STEPS[chatStep];
  const total = CHATBOT_STEPS.length;
  const pct   = Math.round((chatStep / total) * 100);

  bot.querySelector('.chatbot__progress-fill').style.width = pct + '%';
  bot.querySelector('.chatbot__step-label').textContent    = `Step ${chatStep + 1} of ${total}`;
  bot.querySelector('.chatbot__question').textContent      = step.q;

  const body = bot.querySelector('.chatbot__answer-area');
  body.innerHTML = '';

  if (step.type === 'options') {
    const grid = document.createElement('div');
    grid.className = 'chatbot__options';
    (step.opts || []).forEach(opt => {
      const btn = document.createElement('button');
      btn.className  = 'chatbot__option';
      btn.textContent = opt;
      btn.onclick = () => { chatAnswers[step.id] = opt; chatStep++; renderChatStep(); };
      grid.appendChild(btn);
    });
    body.appendChild(grid);
  }

  if (step.type === 'zip') {
    const row = document.createElement('div');
    row.className = 'chatbot__input-row';

    const inp = document.createElement('input');
    inp.type        = 'text';
    inp.className   = 'input';
    inp.maxLength   = 5;

    // Auto-fill from current location if available
    if (currentLocation && /^\d{5}$/.test('')) {
      // Find any ZIP for this city
      const matchingZip = Object.entries(ZIP_CITIES)
        .find(([z, cs]) => cs === currentLocation.cityState);
      if (matchingZip) inp.value = matchingZip[0];
    }
    inp.placeholder = step.placeholder;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') submitZip(inp); });

    const btn = document.createElement('button');
    btn.className   = 'btn btn--primary btn--sm';
    btn.textContent = 'Next →';
    btn.onclick     = () => submitZip(inp);

    row.appendChild(inp); row.appendChild(btn);
    body.appendChild(row);
    setTimeout(() => inp.focus(), 50);
  }

  if (step.type === 'contact') {
    const wrap = document.createElement('div');
    wrap.className = 'chatbot__contact';

    const nameInp  = createInput('text',  'Your name',          'chat-name');
    const emailInp = createInput('email', 'Your email address', 'chat-email');

    const note = document.createElement('p');
    note.className  = 'chatbot__note';
    note.textContent = 'Free for families. Your info is never sold.';

    const submitBtn = document.createElement('button');
    submitBtn.className   = 'btn btn--primary';
    submitBtn.style.width = '100%';
    submitBtn.textContent = 'Get My Free Matches →';
    submitBtn.onclick     = () => submitContact(nameInp, emailInp);

    wrap.appendChild(nameInp);
    wrap.appendChild(emailInp);
    wrap.appendChild(submitBtn);
    wrap.appendChild(note);
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
  // Also save as location
  if (ZIP_CITIES[z]) saveLocation(ZIP_CITIES[z]);
  chatStep++;
  renderChatStep();
}

function submitContact(nameInp, emailInp) {
  if (!nameInp.value.trim()) { nameInp.style.borderColor = 'var(--red-700)'; nameInp.focus(); return; }
  if (!emailInp.value.includes('@')) { emailInp.style.borderColor = 'var(--red-700)'; emailInp.focus(); return; }
  chatAnswers.name  = nameInp.value.trim();
  chatAnswers.email = emailInp.value.trim();
  console.log('Lead captured:', chatAnswers);
  showChatDone();
}

function showChatDone() {
  const bot = document.getElementById('chatbot');
  if (!bot) return;
  bot.querySelector('.chatbot__progress-fill').style.width = '100%';
  const location = chatAnswers.zip && ZIP_CITIES[chatAnswers.zip]
    ? ZIP_CITIES[chatAnswers.zip]
    : (currentLocation ? currentLocation.cityState : chatAnswers.zip || 'your area');
  bot.querySelector('.chatbot__body').innerHTML = `
    <div class="chatbot__done">
      <div class="chatbot__done-icon">✅</div>
      <div class="chatbot__done-title">You're all set, ${chatAnswers.name}!</div>
      <div class="chatbot__done-sub">Providers near <strong>${location}</strong> have been notified.
        Expect a message within 24 hours.</div>
    </div>`;
}


/* ── LEAD PURCHASE SIMULATION ─────────────────────────────── */

function purchaseLead(leadId) {
  const card = document.querySelector(`[data-lead-id="${leadId}"]`);
  if (!card) return;
  const locked   = card.querySelector('.lead-card__locked');
  const contact  = card.querySelector('.lead-card__contact');
  const priceEl  = card.querySelector('.lead-card__price');
  const actionEl = card.querySelector('.lead-card__action-btn');
  card.classList.add('lead-card--purchased');
  if (locked)   locked.style.display   = 'none';
  if (contact)  contact.style.display  = 'block';
  if (priceEl)  priceEl.classList.add('lead-card__price--paid');
  if (actionEl) { actionEl.textContent = 'Unlocked ✓'; actionEl.disabled = true; actionEl.classList.remove('btn--primary'); actionEl.classList.add('btn--ghost'); }
  showToast('✅ Lead purchased! Contact details unlocked.');
}


/* ── ACTIVE NAV HIGHLIGHTING ──────────────────────────────── */

function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header__nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.includes(path) && path !== '') a.classList.add('active');
  });
}


/* ── INIT ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initLocation();
  highlightActiveNav();
  if (document.getElementById('chatbot')) renderChatStep();

  // Enter key on search
  const typeSel = document.getElementById('care-type-select');
  if (typeSel) {
    typeSel.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });
  }
});
