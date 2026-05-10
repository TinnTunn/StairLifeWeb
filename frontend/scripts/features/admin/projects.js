/**
 * StairsLife — features/admin/projects.js
 * renderAdminRecentProjects, renderAdminProjectManagement, adminSetProjectStatus.
 * Phase 3 — Modularisasi.
 */
'use strict';

const adminProjectView = { status: 'all', sort: 'newest', q: '' };

function adminSetProjectStatus(status, btn) {
  adminProjectView.status = status;
  document.querySelectorAll('#admin-project-status-chips .filter-chip').forEach(c => c.classList.remove('active'));
  btn?.classList.add('active');
  renderAdminProjectManagement();
}

function adminToggleProjectSort() {
  adminProjectView.sort = adminProjectView.sort === 'newest' ? 'oldest' : 'newest';
  const btn = document.getElementById('admin-project-sort-btn');
  if (btn) btn.textContent = adminProjectView.sort === 'newest' ? 'Newest' : 'Oldest';
  renderAdminProjectManagement();
}

function adminFilterProjects() {
  adminProjectView.q = document.getElementById('admin-project-search')?.value || '';
  renderAdminProjectManagement();
}

async function renderAdminRecentProjects() {
  const el = document.getElementById('admin-project-list');
  if (!el) return;

  try {
    const res      = await AdminAPI.getProjects();
    const projects = (res.data || []).slice(0, 8);

    if (!projects.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📁</div><div class="empty-state-title">Belum ada project</div></div>`;
      return;
    }

    el.innerHTML = `<div class="card" style="overflow:hidden">
      <div class="admin-project-row" style="font-weight:700;font-size:12px;color:var(--text-muted);background:var(--bg-secondary);text-transform:uppercase;letter-spacing:.05em">
        <div>Project</div><div>Pemilik Bisnis</div><div>Status</div><div style="text-align:right">Budget</div>
      </div>
      ${projects.map(p => `
      <div class="admin-project-row">
        <div style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.title}</div>
        <div style="font-size:13px;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.users?.full_name || '-'}</div>
        <div>${statusBadge(p.status === 'inProgress' ? 'aktif' : p.status === 'completed' ? 'selesai' : 'open')}</div>
        <div style="font-size:13px;font-weight:600;color:var(--accent);text-align:right">Rp ${((p.budget_min || 0) / 1000).toFixed(0)}K–${((p.budget_max || 0) / 1000).toFixed(0)}K</div>
      </div>`).join('')}
    </div>`;
  } catch (e) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-title">Gagal memuat project</div></div>`;
  }
}

async function renderAdminProjectManagement() {
  const el = document.getElementById('admin-projects-table');
  if (!el) return;

  el.innerHTML = skeletons.adminProjectRows(6);

  try {
    const status   = adminProjectView.status !== 'all' ? adminProjectView.status : undefined;
    const res      = await AdminAPI.getProjects(status);
    let   projects = res.data || [];

    const q = (adminProjectView.q || '').toLowerCase().trim();
    if (q) {
      projects = projects.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.users?.full_name || '').toLowerCase().includes(q),
      );
    }

    if (!projects.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📁</div><div class="empty-state-title">Tidak ada project</div></div>`;
      return;
    }

    el.innerHTML = `<div class="card" style="overflow:hidden">
      <div class="admin-project-row" style="font-weight:700;font-size:12px;color:var(--text-muted);background:var(--bg-secondary);text-transform:uppercase;letter-spacing:.05em">
        <div>Project</div><div>Pemilik Bisnis</div><div>Status</div><div style="text-align:right">Budget</div>
      </div>
      ${projects.map(p => `
      <div class="admin-project-row" style="cursor:pointer">
        <div style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.title}</div>
        <div style="font-size:13px;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.users?.full_name || '-'}</div>
        <div>${statusBadge(p.status === 'inProgress' ? 'aktif' : p.status === 'completed' ? 'selesai' : 'open')}</div>
        <div style="font-size:13px;font-weight:700;color:var(--accent);text-align:right">Rp ${((p.budget_min || 0) / 1000).toFixed(0)}K–${((p.budget_max || 0) / 1000).toFixed(0)}K</div>
      </div>`).join('')}
    </div>`;
  } catch (e) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-title">Gagal memuat project</div></div>`;
  }
}

function closeAdminProjectDrawer(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('admin-project-drawer')?.classList.remove('open');
}

/* ================================================================
   EXPORTS
   ================================================================ */
window.adminProjectView          = adminProjectView;
window.adminSetProjectStatus     = adminSetProjectStatus;
window.adminToggleProjectSort    = adminToggleProjectSort;
window.adminFilterProjects       = adminFilterProjects;
window.renderAdminRecentProjects = renderAdminRecentProjects;
window.renderAdminProjectManagement = renderAdminProjectManagement;
window.closeAdminProjectDrawer   = closeAdminProjectDrawer;
