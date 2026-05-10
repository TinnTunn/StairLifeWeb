/**
 * StairsLife — features/student/applications.js
 * renderApplications, setAppFilter.
 * Phase 3 — Modularisasi.
 */
'use strict';

async function renderApplications() {
  const list = document.getElementById('application-list');
  if (!list) return;

  list.innerHTML = skeletons.applicationCards(3);

  try {
    const res          = await ApplicationsAPI.getMyApplications();
    const applications = res.data || [];

    const f        = state.appFilter;
    const filtered = f === 'semua' ? applications : applications.filter(a => a.status === f);

    if (!filtered.length) {
      list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📤</div><div class="empty-state-title">Tidak ada lamaran ditemukan</div><p class="empty-state-desc">Coba filter lain atau lamar project baru!</p><button class="btn btn-primary" onclick="switchStudentTab(1)" style="margin-top:12px">Cari Project</button></div>`;
      return;
    }

    list.innerHTML = filtered.map(a => {
      const project     = a.projects || {};
      const biz         = project.users || {};
      const bizName     = biz.full_name || 'Pemilik Bisnis';
      const projectTitle = project.title || 'Project';

      return `
      <div class="application-card">
        <div class="application-icon">
          <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
        </div>
        <div style="flex:1">
          <div class="application-title">${projectTitle}</div>
          <div class="application-meta">${bizName} · Dilamar ${timeAgo(a.created_at)}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap">
            ${statusBadge(a.status)}
            ${a.status !== 'rejected' ? `
              <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openDirectChatWith('${bizName}','bisnis','Project: ${projectTitle}')">
                💬 Chat Bisnis
              </button>
            ` : ''}
            ${a.status === 'approved' ? `
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();goTo('screen-contract-detail')">
                📄 Lihat Kontrak
              </button>
            ` : ''}
          </div>
        </div>
      </div>`;
    }).join('');
  } catch (error) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-title">Gagal memuat lamaran</div><p class="empty-state-desc">${error.message}</p></div>`;
  }
}

function setAppFilter(f, btn) {
  state.appFilter = f;
  document.querySelectorAll('#st-tab-2 .filter-chip').forEach(c => c.classList.remove('active'));
  btn?.classList.add('active');
  renderApplications();
}

/* ================================================================
   EXPORTS
   ================================================================ */
window.renderApplications = renderApplications;
window.setAppFilter       = setAppFilter;
