/**
 * StairsLife — features/student/projects.js
 * loadProjectsFromAPI, buildProjectCard, openProject, renderHomeProjects,
 * renderBrowseProjects, filterProjects, setFilter, renderActiveProjects.
 * Phase 3 — Modularisasi.
 */
'use strict';

async function loadProjectsFromAPI(filters = {}) {
  // Tampilkan skeleton dulu sebelum API call
  const homeGrid   = document.getElementById('home-project-grid');
  const browseGrid = document.getElementById('browse-project-grid');
  if (homeGrid)   homeGrid.innerHTML   = skeletons.projectCards(4);
  if (browseGrid) browseGrid.innerHTML = skeletons.projectCards(6);

  try {
    // L8 FIX: load applied projects dari API agar tidak reset setelah refresh
    if (state.appliedProjects.size === 0) {
      try {
        const appsRes = await ApplicationsAPI.getMyApplications();
        const apps    = appsRes.data || [];
        apps.forEach(a => {
          if (a.project_id) state.appliedProjects.add(a.project_id);
        });
      } catch (_) { /* tidak critical */ }
    }

    const res      = await ProjectsAPI.getAll(filters);
    const projects = res.data || [];

    const normalized = projects.map(p => ({
      id:         p.id,
      biz:        p.users?.full_name || 'Bisnis',
      bizUserId:  p.users?.id || null,          // ← untuk chat inquiry
      bizVerified: p.users?.is_verified || false,
      title:      p.title,
      desc:       p.description,
      category:   p.category,
      skills:     p.skills || [],
      tier:       p.tier,
      budgetMin:  p.budget_min,
      budgetMax:  p.budget_max,
      deadline:   new Date(p.deadline),
      deliverables: p.deliverables || '',
      applicants: p.applicant_count || 0,
      apiId:      p.id,
    }));

    // Deduplikasi berdasarkan ID — antisipasi JOIN ganda dari backend
    const seen    = new Set();
    const unique  = normalized.filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    const homeGridEl = document.getElementById('home-project-grid');
    if (homeGridEl) homeGridEl.innerHTML = unique.slice(0, 4).map((p, i) => buildProjectCard(p, i)).join('');

    const browseGridEl = document.getElementById('browse-project-grid');
    if (browseGridEl) browseGridEl.innerHTML = unique.map((p, i) => buildProjectCard(p, i)).join('');

    const countEl = document.getElementById('browse-count-txt');
    if (countEl) countEl.textContent = `${unique.length} project tersedia untuk kamu`;

    window._cachedProjects = unique;
  } catch (error) {
    showToast('Gagal memuat project: ' + error.message, 'error');
    renderHomeProjects();
    renderBrowseProjects();
  }
}

function buildProjectCard(p, i = 0) {
  const delay   = Math.min(i, 4);
  const applied = state.appliedProjects.has(p.id);
  return `
  <article class="project-card anim-up anim-up-${delay}" style="animation-delay:${delay * 0.08}s" tabindex="0">
    <div onclick="openProject('${p.id}')" onkeydown="if(event.key==='Enter')openProject('${p.id}')">
      <div class="pc-header">${tierBadge(p.tier)}<div class="applicant-count"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>${p.applicants}</div></div>
      <div class="pc-title">${p.title}</div>
      <div class="pc-company">
        <div class="pc-avatar">${initials(p.biz)}</div>
        <span class="pc-biz-name">${p.biz}</span>
        ${p.bizVerified ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="#14B8A6"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>' : ''}
      </div>
      <div class="pc-skills">${p.skills.slice(0, 3).map(s => `<span class="skill-tag">${s}</span>`).join('')}${p.skills.length > 3 ? `<span class="skill-tag">+${p.skills.length - 3}</span>` : ''}</div>
      <div class="pc-footer">
        <span class="pc-budget">${fmtRange(p.budgetMin, p.budgetMax)}</span>
        <span class="pc-deadline"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${daysLeft(p.deadline)}</span>
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:10px">
      ${applied
        ? `<span class="badge badge-teal" style="flex:1;justify-content:center">✅ Lamaran Terkirim</span>`
        : `<button class="btn btn-primary btn-sm" style="flex:2" onclick="openProject('${p.id}')">Lihat Detail →</button>`
      }
      <button class="btn btn-ghost btn-sm" style="flex:1" onclick="event.stopPropagation();openProjectInquiry('${p.id}','${p.biz}','${p.bizUserId || ''}','${p.title.replace(/'/g, '')}')">
        💬 Tanya
      </button>
    </div>
  </article>`;
}

function renderHomeProjects() {
  const grid = document.getElementById('home-project-grid');
  if (!grid) return;
  const items = PROJECTS.filter(p => p.tier === 'pemula').slice(0, 4);
  grid.innerHTML = items.map((p, i) => buildProjectCard(p, i)).join('');
}

function renderBrowseProjects() {
  const grid = document.getElementById('browse-project-grid');
  if (!grid) return;
  const q = state.searchQuery.toLowerCase();
  const f = state.browseFilter;
  const CATEGORY_MAP = { desain: 'Desain Grafis', penulisan: 'Penulisan', teknologi: 'Pembuatan Website' };

  const filtered = PROJECTS.filter(p => {
    const tierMatch = f === 'semua' || p.tier === f;
    const catMatch  = !CATEGORY_MAP[f] || p.category === CATEGORY_MAP[f];
    const fMatch    = ['semua', 'pemula', 'menengah', 'mahir'].includes(f) ? tierMatch : catMatch;
    const qMatch    = !q || p.title.toLowerCase().includes(q) || p.biz.toLowerCase().includes(q) || p.skills.some(s => s.toLowerCase().includes(q));
    return fMatch && qMatch;
  });

  document.getElementById('browse-count-txt').textContent = `${filtered.length} project tersedia untuk kamu`;
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🔍</div><div class="empty-state-title">Tidak ada project ditemukan</div><p class="empty-state-desc">Coba ubah kata kunci atau filter.</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map((p, i) => buildProjectCard(p, i)).join('');
}

function filterProjects() {
  state.searchQuery = document.getElementById('search-input')?.value || '';
  const projects    = window._cachedProjects || PROJECTS;
  const q           = state.searchQuery.toLowerCase();
  const f           = state.browseFilter;
  const CATEGORY_MAP = { desain: 'Desain Grafis', penulisan: 'Penulisan', teknologi: 'Pembuatan Website' };

  const filtered = projects.filter(p => {
    const tierMatch = f === 'semua' || p.tier === f;
    const catMatch  = !CATEGORY_MAP[f] || p.category === CATEGORY_MAP[f];
    const fMatch    = ['semua', 'pemula', 'menengah', 'mahir'].includes(f) ? tierMatch : catMatch;
    const qMatch    = !q || p.title.toLowerCase().includes(q) || (p.biz || '').toLowerCase().includes(q);
    return fMatch && qMatch;
  });

  const browseGrid = document.getElementById('browse-project-grid');
  if (browseGrid) {
    browseGrid.innerHTML = !filtered.length
      ? `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🔍</div><div class="empty-state-title">Tidak ada project ditemukan</div><p class="empty-state-desc">Coba ubah kata kunci atau filter.</p></div>`
      : filtered.map((p, i) => buildProjectCard(p, i)).join('');
  }
  const countEl = document.getElementById('browse-count-txt');
  if (countEl) countEl.textContent = `${filtered.length} project tersedia untuk kamu`;
}

function setFilter(f, btn) {
  state.browseFilter = f;
  document.querySelectorAll('#st-tab-1 .filter-chip').forEach(c => c.classList.remove('active'));
  btn?.classList.add('active');
  // BUG FIX: pakai filterProjects() yang sudah pakai _cachedProjects,
  // bukan renderBrowseProjects() yang pakai PROJECTS (array kosong)
  filterProjects();
}

async function openProject(id) {
  const cachedProjects = window._cachedProjects || [];
  let p = cachedProjects.find(x => x.id === id) || PROJECTS.find(x => x.id === id);

  if (!p) {
    try {
      const res        = await ProjectsAPI.getById(id);
      const apiProject = res.data;
      p = {
        id: apiProject.id, biz: apiProject.users?.full_name || 'Bisnis',
        bizVerified: apiProject.users?.is_verified || false,
        title: apiProject.title, desc: apiProject.description,
        category: apiProject.category, skills: apiProject.skills || [],
        tier: apiProject.tier, budgetMin: apiProject.budget_min,
        budgetMax: apiProject.budget_max, deadline: new Date(apiProject.deadline),
        deliverables: apiProject.deliverables || '', applicants: apiProject.applicant_count || 0,
        apiId: apiProject.id,
      };
    } catch (error) {
      showToast('Project tidak ditemukan', 'error');
      return;
    }
  }

  state.currentProjectId = id;
  state.prevScreen       = state.currentScreen;

  document.getElementById('pd-title').textContent = p.title;

  const tierLabel = p.tier === 'pemula' ? '🌱 Pemula' : p.tier === 'menengah' ? '⚡ Menengah' : '🔥 Mahir';
  const tierCls   = p.tier === 'pemula' ? 'badge-teal' : p.tier === 'menengah' ? 'badge-amber' : 'badge-accent';
  const tierEl    = document.getElementById('pd-tier-badge');
  if (tierEl) { tierEl.className = `badge ${tierCls}`; tierEl.textContent = tierLabel; }

  document.getElementById('pd-biz').textContent  = p.biz + (p.bizVerified ? ' ✅' : '');
  document.getElementById('pd-desc').textContent = p.desc || p.description || '';
  document.getElementById('pd-skills').innerHTML = (p.skills || []).map(s => `<span class="skill-tag" style="font-size:13px;padding:5px 12px">${s}</span>`).join('');

  const budgetText = fmtRange(p.budgetMin || p.budget_min, p.budgetMax || p.budget_max);
  document.getElementById('pd-budget').textContent     = budgetText;
  document.getElementById('pd-budget-mob').textContent = budgetText;

  const deadline = p.deadline instanceof Date ? p.deadline : new Date(p.deadline);
  document.getElementById('pd-deadline').textContent   = fmtDate(deadline) + ` (${daysLeft(deadline)})`;
  document.getElementById('pd-applicants').textContent = `${p.applicants || 0} orang`;
  document.getElementById('pd-category').textContent   = p.category;

  if (document.getElementById('apply-modal-subtitle'))
    document.getElementById('apply-modal-subtitle').textContent = p.title;
  if (document.getElementById('apply-budget-hint'))
    document.getElementById('apply-budget-hint').textContent = `Range project: ${budgetText}`;

  const dlvEl   = document.getElementById('pd-deliverables');
  const delivStr = p.deliverables || '';
  const lines   = delivStr.split('\n').filter(Boolean);
  dlvEl.innerHTML = lines.length
    ? lines.map(l => `<div class="deliverable-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:14px;color:var(--text-secondary)">${l.replace(/^•\s*/, '')}</span></div>`).join('')
    : `<p style="font-size:14px;color:var(--text-secondary)">Lihat deskripsi project untuk detail deliverables.</p>`;

  const applied       = state.appliedProjects.has(id);
  const applyBtnDesk  = document.getElementById('pd-apply-btn-desk');
  if (applyBtnDesk) {
    if (applied) {
      applyBtnDesk.textContent = '✅ Lamaran Terkirim';
      applyBtnDesk.disabled    = true;
      applyBtnDesk.style.background = 'var(--teal-dark)';
    } else {
      applyBtnDesk.textContent = 'Lamar Project →';
      applyBtnDesk.disabled    = false;
      applyBtnDesk.style.background = '';
      applyBtnDesk.onclick     = () => openApplyModal();
    }
  }

  document.getElementById('pd-back-btn').onclick = () => goBack();
  goTo('screen-project-detail');
}

async function renderActiveProjects() {
  const list = document.getElementById('active-project-list');
  if (!list) return;

  list.innerHTML = skeletons.activeProjectCards(2);

  try {
    const res       = await ContractsAPI.getMyContracts();
    const contracts = res.data || [];
    const active    = contracts.filter(c => c.status === 'active' || c.status === 'pending_review');

    if (!active.length) {
      list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">Belum ada project aktif</div><p class="empty-state-desc">Lamar project dan tunggu diterima untuk mulai bekerja.</p></div>`;
      return;
    }

    list.innerHTML = active.map(c => {
      const project     = c.projects || {};
      const biz         = c.users_contracts_business_idTousers || {};
      const deadlineDays = Math.ceil((new Date(c.deadline) - new Date()) / 86400000);
      const deadlineStr  = new Date(c.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      const progress    = c.progress_pct || 0;
      return `
      <div class="active-proj-card" onclick="window.currentContractId='${c.id}';goTo('screen-contract-detail')" style="cursor:pointer" data-contract-id="${c.id}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:4px;gap:10px">
          <div class="active-proj-title">${project.title || 'Project'}</div>
          ${statusBadge(c.status === 'pending_review' ? 'pending' : 'aktif')}
        </div>
        <div class="active-proj-meta">${biz.full_name || 'Bisnis'} · Rp ${(c.agreed_budget || 0).toLocaleString('id-ID')}</div>
        <div class="progress-row">
          <span class="progress-row-label">Progress pengerjaan</span>
          <span class="progress-row-pct">${progress}%</span>
        </div>
        <div class="progress-bar-sm" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar-sm-fill" style="width:${progress}%"></div>
        </div>
        <div class="active-proj-footer">
          <div class="deadline-text${deadlineDays <= 7 ? ' urgent' : ''}">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Deadline: ${deadlineStr}
          </div>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();currentContractId='${c.id}';goTo('screen-deliverable-upload')">Upload Hasil</button>
        </div>
      </div>`;
    }).join('');
  } catch (error) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-title">Gagal memuat project</div><p class="empty-state-desc">${error.message}</p></div>`;
  }
}

/* ================================================================
   APPLY MODAL
   ================================================================ */
function openApplyModal() {
  if (!AuthAPI.isLoggedIn()) { showToast('Login dulu untuk melamar project', 'error'); goTo('screen-login'); return; }
  if (VERIF.status !== 'approved') {
    document.getElementById('unverified-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
    return;
  }
  const today = new Date();
  today.setDate(today.getDate() + 7);
  const dateEl = document.getElementById('apply-date');
  if (dateEl) dateEl.value = today.toISOString().split('T')[0];
  document.getElementById('apply-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeApplyModal() {
  document.getElementById('apply-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function closeApplyModalOutside(e) { if (e.target === e.currentTarget) closeApplyModal(); }
function closeUnverifiedModal() { document.getElementById('unverified-modal').classList.remove('open'); document.body.style.overflow = ''; }
function closeUnverifiedModalOutside(e) { if (e.target === e.currentTarget) closeUnverifiedModal(); }

async function submitApply() {
  const cover       = document.getElementById('apply-cover').value.trim();
  const date        = document.getElementById('apply-date').value;
  const budgetInput = document.getElementById('apply-budget').value;

  if (!cover || cover.length < 50) { showToast('Cover letter minimal 50 karakter', 'error'); document.getElementById('apply-cover').focus(); return; }
  if (!date) { showToast('Pilih estimasi tanggal selesai', 'error'); return; }

  const btn = document.getElementById('apply-submit-btn');
  btn.classList.add('loading');

  try {
    const cachedProjects  = window._cachedProjects || [];
    const currentProject  = cachedProjects.find(p => p.id === state.currentProjectId);
    const projectId       = currentProject?.apiId || state.currentProjectId;

    await ApplicationsAPI.apply({
      project_id: projectId,
      cover_letter: cover,
      estimated_completion: date,
      ...(budgetInput && { offered_budget: parseInt(budgetInput) }),
    });

    closeApplyModal();
    state.appliedProjects.add(state.currentProjectId);
    showToast('Lamaran berhasil dikirim! 🚀 Semoga berhasil!', 'success');
    await loadProjectsFromAPI();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    btn.classList.remove('loading');
  }
}

/* ================================================================
   EXPORTS
   ================================================================ */
window.loadProjectsFromAPI       = loadProjectsFromAPI;
window.buildProjectCard          = buildProjectCard;
window.renderHomeProjects        = renderHomeProjects;
window.renderBrowseProjects      = renderBrowseProjects;
window.filterProjects            = filterProjects;
window.setFilter                 = setFilter;
window.openProject               = openProject;
window.renderActiveProjects      = renderActiveProjects;
window.openApplyModal            = openApplyModal;
window.closeApplyModal           = closeApplyModal;
window.closeApplyModalOutside    = closeApplyModalOutside;
window.closeUnverifiedModal      = closeUnverifiedModal;
window.closeUnverifiedModalOutside = closeUnverifiedModalOutside;
window.submitApply               = submitApply;
