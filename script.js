/* ================================================================
   SCRIPT.JS — ElderCareMatters
================================================================ */


/* ── TOAST ────────────────────────────────────────────────── */

function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}


/* ── ZIP → CITY ───────────────────────────────────────────── */

const ZIP_CITIES = {
  '78701':'Austin, TX','78702':'Austin, TX','78703':'Austin, TX','78704':'Austin, TX',
  '78741':'Austin, TX','78745':'Austin, TX','78746':'Austin, TX','78748':'Austin, TX',
  '77001':'Houston, TX','77002':'Houston, TX','77003':'Houston, TX','77004':'Houston, TX',
  '77401':'Houston, TX','77005':'Houston, TX',
  '75201':'Dallas, TX','75202':'Dallas, TX','75203':'Dallas, TX','75204':'Dallas, TX',
  '78201':'San Antonio, TX','78202':'San Antonio, TX','78203':'San Antonio, TX',
  '10001':'New York, NY','10002':'New York, NY','10003':'New York, NY','10004':'New York, NY',
  '10021':'New York, NY','10022':'New York, NY','10023':'New York, NY','10036':'New York, NY',
  '11201':'Brooklyn, NY','11202':'Brooklyn, NY','11203':'Brooklyn, NY','11210':'Brooklyn, NY',
  '11101':'Queens, NY','11102':'Queens, NY','11103':'Queens, NY',
  '90001':'Los Angeles, CA','90002':'Los Angeles, CA','90003':'Los Angeles, CA',
  '90210':'Beverly Hills, CA','90211':'Beverly Hills, CA',
  '94102':'San Francisco, CA','94103':'San Francisco, CA','94104':'San Francisco, CA',
  '94105':'San Francisco, CA','94110':'San Francisco, CA',
  '92101':'San Diego, CA','92102':'San Diego, CA','92103':'San Diego, CA',
  '60601':'Chicago, IL','60602':'Chicago, IL','60603':'Chicago, IL','60604':'Chicago, IL',
  '60611':'Chicago, IL','60614':'Chicago, IL','60615':'Chicago, IL',
  '33101':'Miami, FL','33102':'Miami, FL','33109':'Miami, FL','33125':'Miami, FL',
  '32801':'Orlando, FL','32802':'Orlando, FL','32803':'Orlando, FL',
  '33601':'Tampa, FL','33602':'Tampa, FL','33603':'Tampa, FL',
  '30301':'Atlanta, GA','30302':'Atlanta, GA','30303':'Atlanta, GA','30308':'Atlanta, GA',
  '85001':'Phoenix, AZ','85002':'Phoenix, AZ','85003':'Phoenix, AZ','85004':'Phoenix, AZ',
  '19101':'Philadelphia, PA','19102':'Philadelphia, PA','19103':'Philadelphia, PA',
  '98101':'Seattle, WA','98102':'Seattle, WA','98103':'Seattle, WA','98104':'Seattle, WA',
  '02101':'Boston, MA','02102':'Boston, MA','02108':'Boston, MA','02109':'Boston, MA',
  '02110':'Boston, MA','02111':'Boston, MA',
  '80201':'Denver, CO','80202':'Denver, CO','80203':'Denver, CO','80204':'Denver, CO',
  '89101':'Las Vegas, NV','89102':'Las Vegas, NV','89103':'Las Vegas, NV',
  '27601':'Raleigh, NC','27602':'Raleigh, NC','27603':'Raleigh, NC',
  '28201':'Charlotte, NC','28202':'Charlotte, NC','28203':'Charlotte, NC',
};

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


/* ── PROVIDERS ────────────────────────────────────────────── */

const PROVIDERS = [
  // ── Home Care ──
  { name:'Sunrise Home Care',           type:'Home Care Agency',       city:'Austin',        state:'TX', rating:4.9, reviews:134, badge:true,  tier:'premium',  specialties:['Home Care','Memory Care','Respite Care'] },
  { name:'Caring Hands Agency',         type:'Home Care Agency',       city:'Austin',        state:'TX', rating:4.7, reviews:89,  badge:true,  tier:'promoted', specialties:['Home Care','Daily Living Assistance'] },
  { name:'HoustonCare Home Services',   type:'Home Care Agency',       city:'Houston',       state:'TX', rating:4.7, reviews:98,  badge:true,  tier:'promoted', specialties:['Home Care','Personal Care','Companionship'] },
  { name:'SA Home Health Pros',         type:'Home Care Agency',       city:'San Antonio',   state:'TX', rating:4.6, reviews:74,  badge:false, tier:'basic',    specialties:['Home Care','Skilled Nursing'] },
  { name:'Manhattan Elder Care',        type:'Home Care Agency',       city:'New York',      state:'NY', rating:4.8, reviews:312, badge:true,  tier:'premium',  specialties:['Home Care','24-Hour Care','Alzheimers Care'] },
  { name:'Queens Home Companions',      type:'Home Care Agency',       city:'Queens',        state:'NY', rating:4.6, reviews:91,  badge:false, tier:'basic',    specialties:['Home Care','Companion Care'] },
  { name:'SF Home Care Collective',     type:'Home Care Agency',       city:'San Francisco', state:'CA', rating:4.7, reviews:118, badge:true,  tier:'promoted', specialties:['Home Care','Memory Care','Hospice Support'] },
  { name:'San Diego Senior Helpers',    type:'Home Care Agency',       city:'San Diego',     state:'CA', rating:4.6, reviews:83,  badge:true,  tier:'basic',    specialties:['Home Care','Alzheimers Care'] },
  { name:'Windy City Home Care',        type:'Home Care Agency',       city:'Chicago',       state:'IL', rating:4.7, reviews:156, badge:true,  tier:'promoted', specialties:['Home Care','Overnight Care','Dementia Care'] },
  { name:'Orlando Care Solutions',      type:'Home Care Agency',       city:'Orlando',       state:'FL', rating:4.6, reviews:79,  badge:false, tier:'free',     specialties:['Home Care','Respite Care'] },
  { name:'Desert Sun Senior Care',      type:'Home Care Agency',       city:'Phoenix',       state:'AZ', rating:4.6, reviews:88,  badge:true,  tier:'basic',    specialties:['Home Care','24-Hour Care'] },
  { name:'Pacific NW Home Care',        type:'Home Care Agency',       city:'Seattle',       state:'WA', rating:4.7, reviews:97,  badge:true,  tier:'basic',    specialties:['Home Care','Memory Care'] },
  { name:'Mile High Senior Care',       type:'Home Care Agency',       city:'Denver',        state:'CO', rating:4.6, reviews:71,  badge:false, tier:'free',     specialties:['Home Care','Companion Care'] },
  { name:'Queen City Elder Care',       type:'Home Care Agency',       city:'Charlotte',     state:'NC', rating:4.6, reviews:67,  badge:false, tier:'free',     specialties:['Home Care','Dementia Care'] },
  { name:'LA Senior Home Helpers',      type:'Home Care Agency',       city:'Los Angeles',   state:'CA', rating:4.7, reviews:142, badge:true,  tier:'promoted', specialties:['Home Care','Personal Care','Companion Care'] },
  { name:'Boston Home Care Alliance',   type:'Home Care Agency',       city:'Boston',        state:'MA', rating:4.8, reviews:103, badge:true,  tier:'promoted', specialties:['Home Care','Overnight Care'] },

  // ── Elder Law ──
  { name:'Austin Elder Law Group',      type:'Elder Law Attorney',     city:'Austin',        state:'TX', rating:4.8, reviews:201, badge:true,  tier:'premium',  specialties:['Elder Law','Estate Planning','Medicaid'] },
  { name:'Gulf Coast Elder Law',        type:'Elder Law Attorney',     city:'Houston',       state:'TX', rating:4.9, reviews:176, badge:true,  tier:'premium',  specialties:['Elder Law','Guardianship','Veterans Benefits'] },
  { name:'NYC Elder Law Associates',    type:'Elder Law Attorney',     city:'New York',      state:'NY', rating:4.9, reviews:445, badge:true,  tier:'premium',  specialties:['Elder Law','Medicaid Planning','Trusts'] },
  { name:'Pacific Elder Law',           type:'Elder Law Attorney',     city:'Los Angeles',   state:'CA', rating:4.9, reviews:389, badge:true,  tier:'premium',  specialties:['Elder Law','Medi-Cal Planning','Conservatorship'] },
  { name:'Bay Area Elder Advocates',    type:'Elder Law Attorney',     city:'San Francisco', state:'CA', rating:4.9, reviews:201, badge:true,  tier:'premium',  specialties:['Elder Law','Medi-Cal','Special Needs Trusts'] },
  { name:'Chicago Elder Law Firm',      type:'Elder Law Attorney',     city:'Chicago',       state:'IL', rating:4.8, reviews:234, badge:true,  tier:'premium',  specialties:['Elder Law','Medicaid Planning','Asset Protection'] },
  { name:'South Florida Elder Law',     type:'Elder Law Attorney',     city:'Miami',         state:'FL', rating:4.9, reviews:298, badge:true,  tier:'premium',  specialties:['Elder Law','Medicaid','Probate'] },
  { name:'Peachtree Elder Law',         type:'Elder Law Attorney',     city:'Atlanta',       state:'GA', rating:4.8, reviews:188, badge:true,  tier:'premium',  specialties:['Elder Law','Medicaid Planning','Wills & Trusts'] },
  { name:'Philly Elder Law Center',     type:'Elder Law Attorney',     city:'Philadelphia',  state:'PA', rating:4.8, reviews:212, badge:true,  tier:'promoted', specialties:['Elder Law','Medicaid','Guardianship'] },
  { name:'Boston Elder Advocates',      type:'Elder Law Attorney',     city:'Boston',        state:'MA', rating:4.9, reviews:276, badge:true,  tier:'premium',  specialties:['Elder Law','MassHealth Planning','Trusts'] },
  { name:'Vegas Valley Elder Law',      type:'Elder Law Attorney',     city:'Las Vegas',     state:'NV', rating:4.7, reviews:143, badge:true,  tier:'promoted', specialties:['Elder Law','Medicaid','Estate Planning'] },

  // ── Care Managers ──
  { name:'Lone Star Care Management',   type:'Care Manager',           city:'Austin',        state:'TX', rating:4.8, reviews:112, badge:true,  tier:'promoted', specialties:['Care Management','Hospital Discharge'] },
  { name:'Metroplex Care Partners',     type:'Care Manager',           city:'Dallas',        state:'TX', rating:4.8, reviews:88,  badge:true,  tier:'basic',    specialties:['Care Management','Geriatric Care'] },
  { name:'Brooklyn Senior Services',    type:'Care Manager',           city:'Brooklyn',      state:'NY', rating:4.7, reviews:143, badge:true,  tier:'promoted', specialties:['Care Management','Benefits Navigation'] },
  { name:'LA Senior Care Network',      type:'Care Manager',           city:'Los Angeles',   state:'CA', rating:4.8, reviews:267, badge:true,  tier:'premium',  specialties:['Care Management','Geriatric Assessment'] },
  { name:'Miami Senior Advisors',       type:'Care Manager',           city:'Miami',         state:'FL', rating:4.8, reviews:147, badge:true,  tier:'promoted', specialties:['Care Management','Facility Placement'] },
  { name:'Atlanta Senior Care Group',   type:'Care Manager',           city:'Atlanta',       state:'GA', rating:4.7, reviews:104, badge:true,  tier:'basic',    specialties:['Care Management','Crisis Intervention'] },
  { name:'Seattle Senior Solutions',    type:'Care Manager',           city:'Seattle',       state:'WA', rating:4.9, reviews:134, badge:true,  tier:'premium',  specialties:['Care Management','Discharge Planning'] },
  { name:'Triangle Senior Services',    type:'Care Manager',           city:'Raleigh',       state:'NC', rating:4.8, reviews:89,  badge:true,  tier:'basic',    specialties:['Care Management','Geriatric Care'] },

  // ── Assisted Living ──
  { name:'Dallas Senior Living',        type:'Assisted Living',        city:'Dallas',        state:'TX', rating:4.5, reviews:63,  badge:true,  tier:'promoted', specialties:['Assisted Living','Memory Care'] },
  { name:'Tampa Bay Senior Living',     type:'Assisted Living',        city:'Tampa',         state:'FL', rating:4.7, reviews:92,  badge:true,  tier:'promoted', specialties:['Assisted Living','Memory Care','Respite Stays'] },
  { name:'NYC Senior Residences',       type:'Assisted Living',        city:'New York',      state:'NY', rating:4.6, reviews:118, badge:true,  tier:'promoted', specialties:['Assisted Living','Memory Care'] },
  { name:'Windy City Senior Living',    type:'Assisted Living',        city:'Chicago',       state:'IL', rating:4.5, reviews:74,  badge:false, tier:'basic',    specialties:['Assisted Living','Respite Stays'] },
  { name:'Phoenix Senior Villas',       type:'Assisted Living',        city:'Phoenix',       state:'AZ', rating:4.6, reviews:81,  badge:true,  tier:'basic',    specialties:['Assisted Living','Independent Living'] },
  { name:'Seattle Senior Living',       type:'Assisted Living',        city:'Seattle',       state:'WA', rating:4.7, reviews:96,  badge:true,  tier:'promoted', specialties:['Assisted Living','Memory Care'] },
  { name:'Boston Senior Residences',    type:'Assisted Living',        city:'Boston',        state:'MA', rating:4.6, reviews:67,  badge:false, tier:'basic',    specialties:['Assisted Living','Independent Living'] },

  // ── Memory Care ──
  { name:'Central Texas Memory Care',   type:'Memory Care Facility',   city:'Austin',        state:'TX', rating:4.6, reviews:57,  badge:false, tier:'basic',    specialties:['Memory Care','Dementia Care'] },
  { name:'Phoenix Memory Care Center',  type:'Memory Care Facility',   city:'Phoenix',       state:'AZ', rating:4.7, reviews:84,  badge:true,  tier:'promoted', specialties:['Memory Care','Alzheimer\'s Care','Behavioral Support'] },
  { name:'Pacific Memory Care',         type:'Memory Care Facility',   city:'San Francisco', state:'CA', rating:4.8, reviews:102, badge:true,  tier:'premium',  specialties:['Memory Care','Dementia Care','Family Education'] },
  { name:'Magnolia Memory Care',        type:'Memory Care Facility',   city:'Atlanta',       state:'GA', rating:4.6, reviews:73,  badge:true,  tier:'basic',    specialties:['Memory Care','Dementia Care'] },
  { name:'Chicago Memory & Wellness',   type:'Memory Care Facility',   city:'Chicago',       state:'IL', rating:4.7, reviews:91,  badge:true,  tier:'promoted', specialties:['Memory Care','Alzheimer\'s Care'] },
  { name:'Seattle Memory Gardens',      type:'Memory Care Facility',   city:'Seattle',       state:'WA', rating:4.8, reviews:68,  badge:true,  tier:'promoted', specialties:['Memory Care','Secure Living','Dementia Programs'] },

  // ── Hospice ──
  { name:'Lone Star Hospice Care',      type:'Hospice Provider',       city:'Austin',        state:'TX', rating:4.8, reviews:38,  badge:true,  tier:'premium',  specialties:['Palliative Care','Grief Support','In-Home Hospice'] },
  { name:'Dallas Comfort Hospice',      type:'Hospice Provider',       city:'Dallas',        state:'TX', rating:4.7, reviews:52,  badge:true,  tier:'promoted', specialties:['Hospice','Palliative Care','Family Support'] },
  { name:'CompassionCare Hospice',      type:'Hospice Provider',       city:'Chicago',       state:'IL', rating:4.9, reviews:76,  badge:true,  tier:'premium',  specialties:['Hospice','Pain Management','Grief Support'] },
  { name:'Pacific Comfort Hospice',     type:'Hospice Provider',       city:'Los Angeles',   state:'CA', rating:4.8, reviews:91,  badge:true,  tier:'premium',  specialties:['Hospice','Palliative Care','Bereavement'] },
  { name:'Sunshine Hospice',            type:'Hospice Provider',       city:'Miami',         state:'FL', rating:4.7, reviews:44,  badge:true,  tier:'promoted', specialties:['Hospice','Family Support','Home-Based Care'] },
  { name:'New England Hospice',         type:'Hospice Provider',       city:'Boston',        state:'MA', rating:4.9, reviews:63,  badge:true,  tier:'premium',  specialties:['Hospice','Pain Management','End-of-Life Planning'] },
  { name:'Heartland Hospice',           type:'Hospice Provider',       city:'Phoenix',       state:'AZ', rating:4.6, reviews:39,  badge:false, tier:'basic',    specialties:['Hospice','Palliative Care'] },
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
  premium:  { label:'🏆 Premium',  cls:'tier-badge--premium',  cardCls:'provider-card--premium' },
  promoted: { label:'⭐ Promoted', cls:'tier-badge--promoted', cardCls:'provider-card--promoted' },
  basic:    { label:'📌 Basic',    cls:'tier-badge--basic',    cardCls:'' },
  free:     { label:'Free',        cls:'tier-badge--basic',    cardCls:'' },
};

const TIER_ORDER = { premium:0, promoted:1, basic:2, free:3 };


/* ── SERVICE CARD COUNTS ──────────────────────────────────── */

function initServiceCounts() {
  const counts = {};
  PROVIDERS.forEach(p => { counts[p.type] = (counts[p.type] || 0) + 1; });

  document.querySelectorAll('.service-card[data-type]').forEach(card => {
    const type  = card.getAttribute('data-type');
    const n     = counts[type] || 0;
    const el    = card.querySelector('.service-card__count');
    if (el) el.textContent = n + ' provider' + (n !== 1 ? 's' : '');
  });
}


/* ── AUTO-LOCATION ────────────────────────────────────────── */

let currentLocation = null;

function initLocation() {
  try {
    const saved = localStorage.getItem('ecm_location');
    if (saved) { currentLocation = JSON.parse(saved); updateLocationDisplay(); }
  } catch(e) {}
}

function saveLocation(cityState) {
  const parts = cityState.split(', ');
  currentLocation = { cityState, city: parts[0], state: parts[1] || '' };
  try { localStorage.setItem('ecm_location', JSON.stringify(currentLocation)); } catch(e) {}
  updateLocationDisplay();
}

function updateLocationDisplay() {
  if (!currentLocation) return;
  const disp = document.getElementById('location-display');
  const em   = document.getElementById('hero-city-em');
  if (disp) disp.textContent = currentLocation.cityState;
  if (em)   em.textContent   = currentLocation.city;
}


/* ── LOCATION MODAL ───────────────────────────────────────── */

function openLocationModal() {
  const o = document.getElementById('loc-modal-overlay');
  if (o) { o.classList.add('open'); setTimeout(() => { const i = document.getElementById('loc-zip-input'); if (i) i.focus(); }, 120); }
}
function closeLocationModal() {
  const o = document.getElementById('loc-modal-overlay');
  if (o) o.classList.remove('open');
}
function handleModalOverlayClick(e) { if (e.target === e.currentTarget) closeLocationModal(); }

function applyLocation() {
  const zip  = (document.getElementById('loc-zip-input')  || {}).value?.trim() || '';
  const city = (document.getElementById('loc-city-input') || {}).value?.trim() || '';
  const st   = (document.getElementById('loc-state-select')|| {}).value || '';

  if (/^\d{5}$/.test(zip) && ZIP_CITIES[zip]) {
    saveLocation(ZIP_CITIES[zip]); closeLocationModal(); showToast('📍 Location set to ' + ZIP_CITIES[zip]); return;
  }
  if (city && st) {
    const cs = city.charAt(0).toUpperCase() + city.slice(1) + ', ' + st;
    saveLocation(cs); closeLocationModal(); showToast('📍 Location set to ' + cs); return;
  }
  if (city) {
    const alias = CITY_ALIASES[city.toLowerCase()];
    if (alias) {
      const match = PROVIDERS.find(p => p.city === alias);
      if (match) { saveLocation(alias + ', ' + match.state); closeLocationModal(); showToast('📍 Location set to ' + alias); return; }
    }
  }
  const inp = document.getElementById('loc-zip-input');
  if (inp) { inp.style.borderColor = '#ef4444'; setTimeout(() => inp.style.borderColor = '', 2000); }
  showToast('Please enter a valid ZIP code or city + state.');
}


/* ── SEARCH ───────────────────────────────────────────────── */

let _lastMatched = [];
let _lastLocLabel = '';

function handleSearch() {
  const typeSel = document.getElementById('care-type-select');
  const selectedType = typeSel ? typeSel.value : '';

  const resultsSection = document.getElementById('search-results');
  const grid = document.getElementById('provider-results-grid');
  if (!resultsSection || !grid) return;

  let matched = [];
  let locationLabel = 'your area';

  if (currentLocation) {
    const { city, state, cityState } = currentLocation;
    locationLabel = cityState;
    matched = PROVIDERS.filter(p => p.city === city && p.state === state);
    if (!matched.length) matched = PROVIDERS.filter(p => p.state === state);
  }
  if (!matched.length) {
    matched = PROVIDERS.filter(p => p.tier === 'premium' || p.tier === 'promoted');
    locationLabel = 'nationwide';
  }

  if (selectedType) matched = matched.filter(p => p.type === selectedType);
  matched = matched.sort((a,b) => (TIER_ORDER[a.tier]??9)-(TIER_ORDER[b.tier]??9));

  _lastMatched  = matched;
  _lastLocLabel = locationLabel;

  const resFilt = document.getElementById('results-type-filter');
  if (resFilt && selectedType) resFilt.value = selectedType;

  const eyebrow  = document.getElementById('results-eyebrow');
  const title    = document.getElementById('results-title');
  const subtitle = document.getElementById('results-subtitle');
  const typeLabel = selectedType ? selectedType.replace(/ Agency| Facility| Attorney/g,'') : 'Care';

  if (eyebrow)  eyebrow.textContent  = '📍 ' + (locationLabel !== 'nationwide' ? locationLabel : 'Nationwide');
  if (title)    title.textContent    = matched.length ? matched.length + ' ' + typeLabel + ' Provider' + (matched.length!==1?'s':'') + ' Found' : 'No Providers Found';
  if (subtitle) subtitle.textContent = matched.length ? 'Sorted by listing tier — Premium providers shown first.' : '';

  renderProviderCards(matched, grid, locationLabel, selectedType || 'this care type');
  resultsSection.style.display = 'block';
  showToast(matched.length ? '✅ ' + matched.length + ' providers found' : '⚠️ No providers found — try expanding your search');
  setTimeout(() => resultsSection.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
}

function filterResults() {
  const type = (document.getElementById('results-type-filter') || {}).value || '';
  const grid = document.getElementById('provider-results-grid');
  if (!grid) return;
  const filtered = type ? _lastMatched.filter(p => p.type === type) : _lastMatched;
  const title = document.getElementById('results-title');
  if (title) {
    const tl = type ? type.replace(/ Agency| Facility| Attorney/g,'') : 'Care';
    title.textContent = filtered.length ? filtered.length+' '+tl+' Provider'+(filtered.length!==1?'s':'')+' Found' : 'No Providers Found';
  }
  renderProviderCards(filtered, grid, _lastLocLabel, type || 'this care type');
}

function renderProviderCards(providers, grid, locLabel, typeLabel) {
  const countTag = document.getElementById('results-count-tag');
  if (countTag) countTag.textContent = providers.length + ' result' + (providers.length!==1?'s':'');

  if (!providers.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <h3 class="empty-state__title">No providers found in ${locLabel}</h3>
        <p class="empty-state__sub">We couldn't find ${typeLabel} providers in this area yet. Try changing your location or a different care type.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn--secondary" onclick="openLocationModal()">Change Location</button>
          <a href="#chatbot-section" class="btn btn--primary"
             onclick="document.getElementById('chatbot-section').scrollIntoView({behavior:'smooth'});return false;">
            Request a Match →
          </a>
        </div>
      </div>`;
    return;
  }

  grid.innerHTML = providers.map(p => {
    const tier  = TIER_CONFIG[p.tier] || TIER_CONFIG.basic;
    const icon  = TYPE_ICONS[p.type] || '📍';
    const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5-Math.round(p.rating));
    return `
      <div class="provider-card ${tier.cardCls}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">
          <div style="flex:1;">
            <p style="font-size:1rem;font-weight:700;color:var(--navy);margin-bottom:3px;">${p.name}</p>
            <p style="font-size:.8rem;color:var(--gray-500);">${icon} ${p.type} · ${p.city}, ${p.state}</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;align-items:flex-end;flex-shrink:0;">
            <span class="tier-badge ${tier.cls}">${tier.label}</span>
            ${p.badge ? '<span class="ecm-badge">✓ ECM Verified</span>' : ''}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:#f59e0b;font-size:.9rem;">${stars}</span>
          <span style="font-size:.8rem;font-weight:700;color:var(--gray-700);">${p.rating}</span>
          <span style="font-size:.8rem;color:var(--gray-400);">(${p.reviews} reviews)</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${p.specialties.map(s => `<span style="background:var(--blue-50);color:var(--blue-700);font-size:.72rem;font-weight:600;padding:3px 10px;border-radius:20px;">${s}</span>`).join('')}
        </div>
        <button class="btn btn--primary btn--sm" style="margin-top:4px;align-self:flex-start;"
          onclick="requestMatch('${p.name.replace(/'/g,"\\'")}')">Request Info →</button>
      </div>`;
  }).join('');
}

function requestMatch(name) {
  showToast('✅ Request sent to ' + name + '! They will contact you shortly.');
  setTimeout(() => {
    const cb = document.getElementById('chatbot-section');
    if (cb) cb.scrollIntoView({ behavior:'smooth' });
  }, 1200);
}


/* ── SERVICE CARD SELECTION ───────────────────────────────── */

function selectServiceType(type) {
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.service-card[data-type]').forEach(c => {
    if (c.getAttribute('data-type') === type) c.classList.add('active');
  });
  const sel = document.getElementById('care-type-select');
  if (sel) sel.value = type;
  setTimeout(handleSearch, 200);
}
function selectService(name) { selectServiceType(name); }


/* ── CHAT-STYLE INTAKE CHATBOT ────────────────────────────── */

const CHAT_STEPS = [
  { id:'who',     question:'Who needs care?',                       type:'options', opts:['A parent','A spouse','Myself','Another family member'] },
  { id:'type',    question:'What type of care are you looking for?', type:'options', opts:['Home Care','Assisted Living','Memory Care','Elder Law Attorney','Care Management','Hospice','Not sure yet'] },
  { id:'urgency', question:'How soon do you need help?',             type:'options', opts:['Urgent — within a week','Within a month','1–3 months','Just researching'] },
  { id:'budget',  question:'What\'s your approximate monthly budget?', type:'options', opts:['Under $2,000','$2,000–$4,000','$4,000+','Prefer not to say'] },
  { id:'zip',     question:'What ZIP code should we search?',        type:'zip',     placeholder:'e.g. 78701' },
  { id:'contact', question:'Last step — where should we send your matches?', type:'contact' },
];

let chatStep    = 0;
let chatAnswers = {};
let chatHistory = []; // { role: 'bot'|'user', text: string }

function initChat() {
  const widget = document.getElementById('chatbot');
  if (!widget) return;
  chatStep    = 0;
  chatAnswers = {};
  chatHistory = [];
  renderChatStep();
}

function renderChatStep() {
  const widget = document.getElementById('chatbot');
  if (!widget) return;

  const step  = CHAT_STEPS[chatStep];
  const total = CHAT_STEPS.length;
  const pct   = Math.round((chatStep / total) * 100);

  // Progress
  const prog = widget.querySelector('.chat-widget__progress-fill');
  const ind  = widget.querySelector('.chat-widget__step-indicator');
  if (prog) prog.style.width = pct + '%';
  if (ind)  ind.textContent  = 'Step ' + (chatStep+1) + ' of ' + total;

  // Add bot message to history
  chatHistory.push({ role:'bot', text: step.question });

  // Render message history
  renderChatHistory(widget);

  // Render input area
  const inputArea = widget.querySelector('.chat-widget__input');
  if (!inputArea) return;
  inputArea.innerHTML = '';

  if (step.type === 'options') {
    const wrap = document.createElement('div');
    wrap.className = 'chat-options';
    step.opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className   = 'chat-option-btn';
      btn.textContent = opt;
      btn.onclick = () => {
        chatAnswers[step.id] = opt;
        chatHistory.push({ role:'user', text: opt });
        chatStep++;
        if (chatStep < CHAT_STEPS.length) renderChatStep();
        else showChatDone(widget);
      };
      wrap.appendChild(btn);
    });
    inputArea.appendChild(wrap);
  }

  if (step.type === 'zip') {
    const row = document.createElement('div');
    row.className = 'chat-zip-row';
    const inp = document.createElement('input');
    inp.type = 'text'; inp.className = 'chat-text-input'; inp.placeholder = step.placeholder; inp.maxLength = 5;
    // Pre-fill from saved location
    if (currentLocation) {
      const match = Object.entries(ZIP_CITIES).find(([z,cs]) => cs === currentLocation.cityState);
      if (match) inp.value = match[0];
    }
    const btn = document.createElement('button');
    btn.className = 'btn btn--primary btn--sm'; btn.textContent = 'Continue →';
    btn.onclick = () => {
      const z = inp.value.trim();
      if (!/^\d{5}$/.test(z)) { inp.style.borderColor='#ef4444'; inp.focus(); return; }
      chatAnswers.zip = z;
      chatHistory.push({ role:'user', text: z + (ZIP_CITIES[z] ? ' (' + ZIP_CITIES[z] + ')' : '') });
      if (ZIP_CITIES[z]) saveLocation(ZIP_CITIES[z]);
      chatStep++;
      renderChatStep();
    };
    inp.addEventListener('keydown', e => { if (e.key==='Enter') btn.click(); });
    row.appendChild(inp); row.appendChild(btn);
    inputArea.appendChild(row);
    setTimeout(() => inp.focus(), 80);
  }

  if (step.type === 'contact') {
    const wrap = document.createElement('div');
    wrap.className = 'chat-contact-form';
    const nameInp  = makeInput('text',  'Your name',         'chat-name');
    const emailInp = makeInput('email', 'Email address',     'chat-email');
    const note = document.createElement('p');
    note.className = 'chat-privacy-note'; note.textContent = '🔒 Free for families. Your info is never sold.';
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn--primary'; submitBtn.style.width = '100%';
    submitBtn.textContent = 'Get My Free Matches →';
    submitBtn.onclick = () => {
      if (!nameInp.value.trim())       { nameInp.style.borderColor='#ef4444';  nameInp.focus();  return; }
      if (!emailInp.value.includes('@')){ emailInp.style.borderColor='#ef4444'; emailInp.focus(); return; }
      chatAnswers.name  = nameInp.value.trim();
      chatAnswers.email = emailInp.value.trim();
      chatHistory.push({ role:'user', text: chatAnswers.name + ' · ' + chatAnswers.email });
      console.log('Lead captured:', chatAnswers);
      showChatDone(widget);
    };
    wrap.appendChild(nameInp); wrap.appendChild(emailInp); wrap.appendChild(submitBtn); wrap.appendChild(note);
    inputArea.appendChild(wrap);
  }

  // Scroll messages to bottom
  const body = widget.querySelector('.chat-widget__body');
  if (body) setTimeout(() => { body.scrollTop = body.scrollHeight; }, 60);
}

function makeInput(type, placeholder, id) {
  const el = document.createElement('input');
  el.type = type; el.placeholder = placeholder; el.className = 'chat-text-input'; el.id = id;
  return el;
}

function renderChatHistory(widget) {
  const body = widget.querySelector('.chat-widget__body');
  if (!body) return;
  body.innerHTML = chatHistory.map(m => {
    if (m.role === 'bot') {
      return `<div class="chat-msg chat-msg--bot">
        <div class="chat-msg__avatar">👩‍⚕️</div>
        <div class="chat-msg__bubble">${m.text}</div>
      </div>`;
    } else {
      return `<div class="chat-msg chat-msg--user">
        <div class="chat-msg__bubble chat-msg__bubble--user">${m.text}</div>
        <div class="chat-msg__avatar chat-msg__avatar--user">You</div>
      </div>`;
    }
  }).join('');
}

function showChatDone(widget) {
  const prog = widget.querySelector('.chat-widget__progress-fill');
  if (prog) prog.style.width = '100%';
  const ind  = widget.querySelector('.chat-widget__step-indicator');
  if (ind) ind.textContent = 'Complete ✓';

  const body = widget.querySelector('.chat-widget__body');
  if (body) body.innerHTML = `
    <div class="chat-done">
      <div class="chat-done__icon">✅</div>
      <h3 class="chat-done__title">You're all set, ${chatAnswers.name || 'there'}!</h3>
      <p class="chat-done__sub">
        We've notified providers near <strong>${chatAnswers.zip && ZIP_CITIES[chatAnswers.zip] ? ZIP_CITIES[chatAnswers.zip] : (currentLocation?.cityState || 'your area')}</strong>.<br>
        Expect to hear from up to 3 matched providers within 24 hours.
      </p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:20px;">
        <a href="consumer-dashboard.html" class="btn btn--primary btn--sm">View My Dashboard →</a>
        <button class="btn btn--secondary btn--sm" onclick="initChat()">Start New Search</button>
      </div>
    </div>`;
  const inputArea = widget.querySelector('.chat-widget__input');
  if (inputArea) inputArea.innerHTML = '';
}


/* ── LEAD PURCHASE ────────────────────────────────────────── */

function purchaseLead(leadId) {
  const card = document.querySelector(`[data-lead-id="${leadId}"]`);
  if (!card) return;
  const locked   = card.querySelector('.lead-card__locked');
  const contact  = card.querySelector('.lead-card__contact');
  const priceEl  = card.querySelector('.lead-card__price');
  const actionEl = card.querySelector('.lead-card__action-btn');
  card.classList.add('lead-card--purchased');
  if (locked)  locked.style.display  = 'none';
  if (contact) contact.style.display = 'block';
  if (priceEl) priceEl.classList.add('lead-card__price--paid');
  if (actionEl) { actionEl.textContent = 'Unlocked ✓'; actionEl.disabled = true; actionEl.classList.remove('btn--primary'); actionEl.classList.add('btn--ghost'); }
  showToast('✅ Lead purchased! Contact details unlocked.');
}


/* ── ACTIVE NAV ───────────────────────────────────────────── */

function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header__nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.includes(path) && path) a.classList.add('active');
  });
}


/* ── INIT ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initLocation();
  initServiceCounts();
  highlightActiveNav();
  initChat();

  // Modal keyboard shortcuts
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLocationModal(); });
  ['loc-zip-input','loc-city-input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') applyLocation(); });
  });
});
