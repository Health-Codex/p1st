/* Provider File Adapter
 * Bridges provider-page.html to the new File-Based Staff Management System
 * - Uses window.fileStaffManager (from assets/js/file-staff-manager.js)
 * - Works on http://localhost via /api/staff + /api/upload and file:// with File System API/download fallback
 * - Listens to BroadcastChannel updates for cross-tab sync
 */
(function(){
  const isHttp = location.protocol.startsWith('http');

  const state = {
    filter: 'all',
    search: '',
    editingId: null,
  };

  function onReady(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  function waitForManager(maxTries=40, interval=150){
    return new Promise((resolve, reject) => {
      let tries = 0;
      (function tick(){
        tries++;
        if (window.fileStaffManager && Array.isArray(window.fileStaffManager.staff)) return resolve(window.fileStaffManager);
        if (tries >= maxTries) return reject(new Error('fileStaffManager not available'));
        setTimeout(tick, interval);
      })();
    });
  }

  function qs(sel){ return document.querySelector(sel); }

  function getStaff(){
    return (window.fileStaffManager && window.fileStaffManager.staff) ? window.fileStaffManager.staff.slice() : [];
  }

  function computeStats(list){
    const total = list.length;
    const medical = list.filter(s => (s.type||'').toLowerCase()==='medical').length;
    const support = list.filter(s => (s.type||'').toLowerCase()==='support').length;
    const specialties = new Set();
    list.forEach(s => { if (s.specialty) s.specialty.split(',').forEach(x => { const t=x.trim(); if (t) specialties.add(t); }); });
    const thirtyDaysAgo = Date.now() - 30*24*60*60*1000;
    const recent = list.filter(s => { const d = Date.parse(s.dateAdded||s.createdAt||0); return !isNaN(d) && d>=thirtyDaysAgo; }).length;
    return { total, medical, support, uniqueSpecialties: specialties.size, recentlyAdded: recent };
  }

  function applyFilters(list){
    let out = list;
    if (state.filter && state.filter !== 'all') out = out.filter(s => (s.type||'').toLowerCase() === state.filter);
    if (state.search){
      const q = state.search.toLowerCase();
      out = out.filter(s => (s.name||'').toLowerCase().includes(q)
        || (s.title||'').toLowerCase().includes(q)
        || (s.specialty||'').toLowerCase().includes(q)
        || (s.credentials||'').toLowerCase().includes(q)
        || (s.bio||'').toLowerCase().includes(q));
    }
    return out;
  }

  function cardHTML(m){
    const creds = (m.credentials||'').split(',').map(c=>c.trim()).filter(Boolean).map(c=>`<span class="credential"><i class="fa-solid fa-graduation-cap"></i> ${c}</span>`).join('');
    const tags = (m.specialty||'').split(',').map(s=>s.trim()).filter(Boolean).map(s=>`<span class="specialty-tag">${s}</span>`).join('');
    const badge = m.specialty ? `<div class="staff-specialty-badge">${m.specialty.split(',')[0].trim()}</div>` : '';
    return `
      <div class="provider-card-interactive staff-card hover-lift shadow-soft" data-id="${m.id}">
        ${badge}
        <div class="provider-actions">
          <button class="action-btn edit-btn" data-id="${m.id}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="action-btn delete-btn" data-id="${m.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="staff-image image-zoom-container">
          <img src="${m.image || 'assets/images/default-staff.jpg'}" alt="${m.name}" loading="lazy" class="image-zoom">
          <div class="staff-social">
            <a href="#" class="social-link hover-scale" aria-label="LinkedIn Profile"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="#" class="social-link hover-scale" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
          </div>
        </div>
        <div class="staff-info">
          <h3 class="staff-name">${m.name}</h3>
          <p class="staff-title"><i class="fa-solid fa-stethoscope"></i> ${m.title||''}</p>
          ${creds ? `<div class="staff-credentials">${creds}</div>` : ''}
          ${m.bio ? `<p>${m.bio}</p>` : ''}
          ${tags ? `<div class="staff-specialties">${tags}</div>` : ''}
        </div>
      </div>`;
  }

  function render(){
    const all = getStaff();
    const filtered = applyFilters(all);
    const grid = qs('#providersGrid');
    if (!grid) return;
    if (filtered.length === 0){
      grid.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><i class="fa-solid fa-user-doctor"></i><h3>No Providers Found</h3><p>${all.length? 'Try adjusting your search or filter.' : 'Use the form above to add your first team member.'}</p></div>`;
    } else {
      grid.innerHTML = filtered.map(cardHTML).join('');
      grid.querySelectorAll('.edit-btn').forEach(btn=>btn.addEventListener('click',()=>edit(btn.dataset.id)));
      grid.querySelectorAll('.delete-btn').forEach(btn=>btn.addEventListener('click',()=>del(btn.dataset.id)));
    }
    const stats = computeStats(all);
    const map = {
      '#totalStaff': stats.total,
      '#medicalProviders': stats.medical,
      '#supportStaff': stats.support,
      '#specialtyCount': stats.uniqueSpecialties,
      '#recentlyAdded': stats.recentlyAdded,
    };
    Object.entries(map).forEach(([sel,val])=>{ const el=qs(sel); if (el) el.textContent = String(val); });
  }

  function formToData(){
    const get = id => (qs('#'+id)||{}).value || '';
    return {
      name: get('providerName'),
      title: get('providerTitle'),
      type: get('staffType') || 'medical',
      specialty: get('providerSpecialty'),
      credentials: get('providerCredentials'),
      bio: get('providerBio'),
      // providerSpecialties maps into specialty tags appended
      // keep specialty as the primary badge; tags can be appended to bio or ignored
    };
  }

  function resetForm(){
    const form = qs('#providerForm');
    if (form) form.reset();
    const preview = qs('#imagePreview');
    if (preview){ preview.style.display='none'; preview.removeAttribute('data-validated'); preview.src=''; }
    state.editingId = null;
    const btn = qs('.add-provider-btn');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Staff Member';
  }

  async function submit(e){
    e.preventDefault();
    const mgr = window.fileStaffManager;
    const data = formToData();
    const imgInput = qs('#providerImage');
    const imageFile = imgInput && imgInput.files && imgInput.files[0] ? imgInput.files[0] : null;
    try{
      if (state.editingId){
        await mgr.updateStaff(state.editingId, data, imageFile||null);
      } else {
        await mgr.addStaff(data, imageFile||null);
      }
      render();
      resetForm();
    }catch(err){ console.error('Save failed', err); }
  }

  function edit(id){
    const m = getStaff().find(x=>x.id===id); if (!m) return;
    state.editingId = id;
    const set = (id,val)=>{ const el=qs('#'+id); if (el) el.value = val || ''; };
    set('staffType', (m.type||'').toLowerCase()||'medical');
    set('providerName', m.name);
    set('providerTitle', m.title);
    set('providerSpecialty', m.specialty);
    set('providerCredentials', m.credentials);
    set('providerBio', m.bio);
    set('providerSpecialties', '');
    const btn = qs('.add-provider-btn'); if (btn) btn.innerHTML = '<i class="fa-solid fa-save"></i> Update Staff Member';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function del(id){
    if (!confirm('Delete this staff member?')) return;
    try{ await window.fileStaffManager.deleteStaff(id); render(); } catch(e){ console.error(e); }
  }

  function bindUI(){
    const form = qs('#providerForm'); if (form) form.addEventListener('submit', submit);
    const search = qs('#searchProviders'); if (search) search.addEventListener('input', e=>{ state.search = e.target.value; render(); });
    const filter = qs('#staffTypeFilter'); if (filter) filter.addEventListener('change', e=>{ state.filter = e.target.value; render(); });
    const refreshBtn = qs('button[onclick*="refreshData"]'); if (refreshBtn) refreshBtn.addEventListener('click', (e)=>{ e.preventDefault(); render(); });
  }

  function setupBroadcast(){
    if ('BroadcastChannel' in window){
      const ch = new BroadcastChannel('staff-updates');
      ch.addEventListener('message', (ev)=>{
        if (ev.data && ev.data.type === 'staff-data-updated') { render(); }
      });
    }
    window.addEventListener('staffDataUpdated', ()=>render());
  }

  // Backward-compat API for existing onclick handlers
  function installCompat(){
    window.providerManager = {
      refreshData: () => { render(); },
      publishToWebsiteFile: () => { try { return window.fileStaffManager.saveStaffData(); } catch(_){} },
      exportProviders: () => {
        const list = getStaff();
        const json = JSON.stringify(list, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'providers_backup.json'; a.click(); URL.revokeObjectURL(url);
      }
    };
  }

  onReady(async ()=>{
    try{
      await waitForManager();
      installCompat();
      bindUI();
      setupBroadcast();
      render();
    }catch(e){ console.error('Provider adapter failed to initialize:', e); }
  });
})();

