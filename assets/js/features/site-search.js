/**
 * Site-wide Search for Mobile Drawer
 * - Works offline with embedded index
 * - Tries to fetch assets/search/index.json when possible
 */
(function () {
  'use strict';

  const PRELOADED_SEARCH_INDEX = [
    {"url":"about.html","title":"About Us - People First Urgent Care","description":"Learn about People First Urgent Care's mission, values, and commitment to providing high-quality healthcare services to our community."},
    {"url":"allergy-testing.html","title":"Allergy Testing Services - People First Urgent Care","description":"People First Urgent Care offers comprehensive allergy testing to identify your specific triggers. Get personalized treatment plans for allergy relief."},
    {"url":"contact.html","title":"Locations - People First Urgent Care","description":"Find a People First Urgent Care location near you. We have five convenient locations across the Memphis area to serve you and your family."},
    {"url":"gallery.html","title":"Gallery - People First Urgent Care","description":"View our state-of-the-art facilities and meet our dedicated healthcare team at People First Urgent Care."},
    {"url":"index.html","title":"People First Urgent Care - Quality Healthcare When You Need It Most","description":"People First Urgent Care provides comprehensive medical services for the whole family. Our experienced team is dedicated to delivering exceptional care with minimal wait times."},
    {"url":"insurance.html","title":"Insurance - People First Urgent Care","description":"People First Urgent Care accepts most major insurance plans. Learn about our insurance options, self-pay rates, and payment policies."},
    {"url":"lab-testing.html","title":"Laboratory Testing - People First Urgent Care","description":"People First Urgent Care offers comprehensive laboratory testing services with quick results. On-site lab for your convenience."},
    {"url":"layout-test.html","title":"Layout Test - People First Urgent Care","description":""},
    {"url":"mobile-menu-test.html","title":"Mobile Menu Test - People First Urgent Care","description":""},
    {"url":"our-staff.html","title":"Our Staff - People First Urgent Care","description":"Meet the dedicated healthcare professionals at People First Urgent Care. Our experienced team is committed to providing exceptional care for you and your family."},
    {"url":"patient-services.html","title":"Patient Services - People First Urgent Care","description":"Explore the comprehensive patient services offered by People First Urgent Care, including laboratory testing, X-ray imaging, vaccinations, and more."},
    {"url":"payment.html","title":"Make a Payment - People First Urgent Care","description":"Make a secure online payment for your People First Urgent Care services. Choose your location and pay securely through our trusted payment partners."},
    {"url":"physicals.html","title":"Physicals - People First Urgent Care","description":"Comprehensive physical examinations at People First Urgent Care. Sports physicals, school physicals, DOT physicals, and annual wellness exams."},
    {"url":"primary-care.html","title":"Primary Care - People First Urgent Care","description":"People First Urgent Care offers comprehensive primary care services for the whole family. Schedule an appointment for preventive care, chronic disease management, and more."},
    {"url":"save-your-spot.html","title":"Save Your Spot - People First Urgent Care","description":"Save your spot online at People First Urgent Care and reduce your wait time. Quick and easy scheduling for urgent care and primary care visits."},
    {"url":"services.html","title":"Services - People First Urgent Care","description":"Explore the comprehensive healthcare services offered by People First Urgent Care, including urgent care, primary care, and specialty services."},
    {"url":"telemedicine.html","title":"Telemedicine - People First Urgent Care","description":"Access quality healthcare from the comfort of your home with People First Urgent Care's telemedicine services. Virtual visits available for many non-emergency conditions."},
    {"url":"test-inline-header.html","title":"Test Inline Header System - People First Urgent Care","description":""},
    {"url":"unified-header-test.html","title":"Unified Header System Test - People First Urgent Care","description":""},
    {"url":"urgent-care.html","title":"Urgent Care Services - People First Urgent Care","description":"People First Urgent Care provides comprehensive urgent care services for non-life-threatening conditions. Walk-ins welcome, minimal wait times."},
    {"url":"vaccinations.html","title":"Vaccination Services - People First Urgent Care","description":"People First Urgent Care offers comprehensive vaccination services for all ages. Protect yourself and your family with our convenient immunization options."},
    {"url":"weight-loss.html","title":"Weight Loss Services - People First Urgent Care","description":"People First Urgent Care offers personalized weight loss programs to help you achieve your health goals. Medically supervised weight management solutions."},
    {"url":"x-ray.html","title":"X-Ray & Imaging - People First Urgent Care","description":"On-site X-Ray and imaging services at People First Urgent Care. Fast, accurate diagnostics with no need for a separate appointment."}
  ];

  let INDEX = PRELOADED_SEARCH_INDEX;
  let loaded = false;

  async function loadIndex() {
    if (loaded) return INDEX;
    try {
      const res = await fetch('assets/search/index.json', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length) INDEX = json;
      }
    } catch (_) {
      // Fallback to preloaded
    } finally {
      loaded = true;
    }
    return INDEX;
  }

  function norm(s) { return (s || '').toLowerCase(); }

  // simple relevance scoring
  function score(q, item) {
    const query = norm(q);
    const terms = query.split(/\s+/).filter(Boolean);
    if (!terms.length) return 0;

    const title = norm(item.title);
    const desc = norm(item.description);
    const url = norm(item.url);

    let s = 0;
    for (const t of terms) {
      if (title.includes(t)) s += 6;
      if (url.includes(t)) s += 3;
      if (desc.includes(t)) s += 2;
      // starts-with bonus
      if (title.startsWith(t)) s += 2;
    }
    // Whole query bonus
    if (title.includes(query)) s += 4;
    return s;
  }

  function highlight(text, q) {
    if (!q) return text;
    try {
      const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(${esc})`, 'ig');
      return text.replace(re, '<mark>$1</mark>');
    } catch (_) {
      return text;
    }
  }

  function ensureResultsContainer(inputEl) {
    const util = inputEl.closest('.mobile-utility') || inputEl.parentElement;
    if (!util) return null;
    let box = util.nextElementSibling;
    if (!box || !box.classList || !box.classList.contains('mobile-search-results')) {
      box = document.createElement('div');
      box.className = 'mobile-search-results';
      box.setAttribute('role', 'listbox');
      box.setAttribute('aria-label', 'Search results');
      util.parentNode.insertBefore(box, util.nextSibling);
    }
    return box;
  }

  function renderResults(container, query, results) {
    container.innerHTML = '';
    if (!query || query.length < 2) {
      container.style.display = 'none';
      return;
    }
    if (!results.length) {
      container.innerHTML = '<div class="search-empty">No matches found</div>';
      container.style.display = 'block';
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'results-list';
    results.slice(0, 8).forEach((it, idx) => {
      const li = document.createElement('li');
      li.className = 'result-item';
      li.setAttribute('role', 'option');
      li.setAttribute('data-url', it.url);
      li.innerHTML = `
        <a href="${it.url}" class="result-link">
          <div class="result-title">${highlight(it.title, query)}</div>
          ${it.description ? `<div class="result-desc">${highlight(it.description, query)}</div>` : ''}
        </a>`;
      if (idx === 0) li.classList.add('active');
      ul.appendChild(li);
    });
    container.appendChild(ul);
    container.style.display = 'block';
  }

  function bindKeyboard(input, container) {
    input.addEventListener('keydown', (e) => {
      const list = container.querySelectorAll('.result-item');
      if (!list.length) return;
      const current = container.querySelector('.result-item.active');
      let idx = Array.prototype.indexOf.call(list, current);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        idx = (idx + 1) % list.length;
        list.forEach(li => li.classList.remove('active'));
        list[idx].classList.add('active');
        list[idx].querySelector('a').focus({ preventScroll: true });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        idx = (idx - 1 + list.length) % list.length;
        list.forEach(li => li.classList.remove('active'));
        list[idx].classList.add('active');
        list[idx].querySelector('a').focus({ preventScroll: true });
      } else if (e.key === 'Enter') {
        const target = current ? current.querySelector('a') : list[0].querySelector('a');
        if (target) {
          window.location.href = target.getAttribute('href');
        }
      }
    });
  }

  const LOCS = {
    collierville: {
      name: 'Collierville',
      slug: 'collierville',
      lat: 35.0460549,
      lon: -89.6906051,
      address: '853 West Poplar Avenue, Collierville, TN 38017'
    },
    southaven: {
      name: 'Southaven',
      slug: 'southaven',
      lat: 34.9627192,
      lon: -89.9940497,
      address: '176 Goodman Road W, Southaven, MS 38671'
    },
    millington: {
      name: 'Millington',
      slug: 'millington',
      lat: 35.3414514,
      lon: -89.9042603,
      address: '4772 Navy Road, Millington, TN 38053'
    },
    germantown: {
      name: 'Germantown',
      slug: 'germantown',
      lat: 35.0648883,
      lon: -89.7529658,
      address: '9301 Poplar Avenue, Germantown, TN 38138'
    },
    bartlett: {
      name: 'Bartlett',
      slug: 'bartlett',
      lat: 35.2258760,
      lon: -89.8484171,
      address: '6490 Memphis Arlington Road Suite 106, Bartlett, TN 38135'
    },
    cordova: {
      name: 'Cordova',
      slug: 'cordova',
      lat: 35.1693126,
      lon: -89.7933064,
      address: '1645 N Germantown Parkway, Cordova, TN 38016'
    }
  };

  function toRad(d){return d*Math.PI/180}
  function haversine(lat1,lon1,lat2,lon2){
    const R=6371; // km
    const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1);
    const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return R*c; // km
  }

  function nearestForPosition(pos){
    const { latitude, longitude } = pos.coords;
    let best=null; let bestKm=Infinity;
    Object.values(LOCS).forEach(loc=>{
      const km=haversine(latitude, longitude, loc.lat, loc.lon);
      if(km<bestKm){ bestKm=km; best=loc; }
    });
    return { loc: best, km: bestKm, mi: bestKm*0.621371 };
  }

  function renderNearest(container, result){
    if(!result||!result.loc) return;
    // Remove any existing nearest block to avoid duplicates
    Array.from(container.querySelectorAll('.nearest-result')).forEach(n => n.remove());
    const { loc, mi } = result;
    const encodedAddress = encodeURIComponent(loc.address);
    const hasCoords = typeof loc.lat === 'number' && typeof loc.lon === 'number';
    const latAttr = hasCoords ? ` data-lat="${loc.lat}"` : '';
    const lonAttr = hasCoords ? ` data-lon="${loc.lon}"` : '';
    const destination = hasCoords ? encodeURIComponent(`${loc.lat},${loc.lon}`) : encodedAddress;
    const defaultHref = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    const el=document.createElement('div');
    el.className='nearest-result';
    el.innerHTML=`
      <div class="nearest-card">
        <div class="nearest-title"><i class="fa-solid fa-location-crosshairs"></i> Nearest: ${loc.name}</div>
        <div class="nearest-meta">~${mi.toFixed(1)} miles away</div>
        <div class="nearest-actions">
          <a class="btn btn-primary btn-sm" href="contact.html#${loc.slug}"><i class="fa-solid fa-location-dot"></i> View Location</a>
          <a class="btn btn-secondary btn-sm directions-btn" href="${defaultHref}" data-address="${loc.address}"${latAttr}${lonAttr} target="_blank" rel="noopener"><i class="fa-solid fa-map"></i> Go to Maps</a>
        </div>
      </div>`;
    // insert at top of results container
    container.style.display='block';
    container.prepend(el);
  }

  function initNearestChip() {
    document.addEventListener('click', (e)=>{
      const target = e.target.closest('.mobile-quick-actions .chip[data-action="nearest"]');
      if(!target) return;
      e.preventDefault();
      const input = target.closest('.mobile-utility')?.querySelector('.mobile-search input');
      const resultsContainer = input ? ensureResultsContainer(input) : null;
      if(!resultsContainer) return;
      if(!navigator.geolocation){
        resultsContainer.style.display='block';
        resultsContainer.innerHTML = '<div class="search-empty">Geolocation not supported</div>';
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos)=>{ renderNearest(resultsContainer, nearestForPosition(pos)); },
        ()=>{ resultsContainer.style.display='block'; resultsContainer.innerHTML='<div class="search-empty">Unable to access your location</div>'; },
        { enableHighAccuracy:true, timeout:7000, maximumAge:300000 }
      );
    });
  }

  function initSearch() {
    const inputs = document.querySelectorAll('.mobile-utility .mobile-search input');
    if (!inputs.length) return;
    loadIndex();
    inputs.forEach((input) => {
      const container = ensureResultsContainer(input);
      if (!container) return;
      bindKeyboard(input, container);
      let timer = null;
      input.addEventListener('input', async () => {
        const q = (input.value || '').trim();
        if (timer) clearTimeout(timer);
        timer = setTimeout(async () => {
          const data = await loadIndex();
          if (!q || q.length < 2) { renderResults(container, q, []); return; }
          const ranked = data
            .map(d => ({ d, s: score(q, d) }))
            .filter(x => x.s > 0)
            .sort((a,b) => b.s - a.s)
            .map(x => x.d);
          renderResults(container, q, ranked);
          // See all results link
          const more = document.createElement('div');
          more.className='results-more';
          more.innerHTML = `<a class="btn btn-outline btn-sm" href="search.html?q=${encodeURIComponent(q)}">See all results</a>`;
          container.appendChild(more);
        }, 120);
      });

      // Hide when menu closes
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') container.style.display = 'none';
      });
    });
  }

  function ready(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  ready(initSearch);
  // Re-init when the mobile utility is (re)created by the nav builder
  window.addEventListener('pf:mobile-search-ready', initSearch);

  // Initialize nearest chip handler once
  ready(initNearestChip);
  window.addEventListener('pf:mobile-search-ready', initNearestChip, { once: true });

  // Expose a minimal API for the full search page
  window.PFSearch = {
    async search(q){
      const data = await loadIndex();
      const query = (q||'').trim();
      if (!query) return [];
      return data
        .map(d=>({d, s: score(query, d)}))
        .filter(x=>x.s>0)
        .sort((a,b)=>b.s-a.s)
        .map(x=>x.d);
    },
    async index(){ return loadIndex(); },
    async nearestFromBrowser(){
      return new Promise((resolve,reject)=>{
        if(!navigator.geolocation) return reject(new Error('Geolocation not supported'));
        navigator.geolocation.getCurrentPosition(
          (pos)=>{ resolve(nearestForPosition(pos)); },
          (err)=>reject(err),
          { enableHighAccuracy:true, timeout:7000, maximumAge:300000 }
        );
      });
    }
  };
})();
