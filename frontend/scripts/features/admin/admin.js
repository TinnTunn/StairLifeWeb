/**
 * StairsLife — features/admin/admin.js
 * onEnterAdmin, switchAdminTab, renderAdminOverview, loadAdminStats.
 * Phase 3 — Modularisasi.
 */
'use strict';

let _adminChartProjects = null;
let _adminChartRegs     = null;

function _destroyAdminCharts() {
  try { _adminChartProjects?.destroy?.(); } catch {}
  try { _adminChartRegs?.destroy?.(); } catch {}
  _adminChartProjects = null;
  _adminChartRegs     = null;
}

async function renderAdminOverview() {
  try {
    const res   = await AdminAPI.getStats();
    const stats = res.data || {};
    const kpiProjects = document.getElementById('admin-kpi-projects');
    const kpiUsers    = document.getElementById('admin-kpi-users');
    const kpiDisputes = document.getElementById('admin-kpi-disputes');
    const kpiVerif    = document.getElementById('admin-kpi-verif');
    if (kpiProjects) kpiProjects.textContent = stats.active_projects || 0;
    if (kpiUsers)    kpiUsers.textContent    = stats.total_users || 0;
    if (kpiDisputes) kpiDisputes.textContent = stats.active_disputes || 0;
    if (kpiVerif)    kpiVerif.textContent    = stats.pending_verifications || 0;
  } catch (e) {
    console.error('Gagal load admin stats:', e);
  }

  const notifEl = document.getElementById('admin-internal-notifs');
  if (notifEl) notifEl.innerHTML = `<div class="empty-state" style="padding:22px 10px"><div class="empty-state-icon">🔔</div><div class="empty-state-title">Tidak ada notifikasi</div></div>`;

  const actEl = document.getElementById('admin-activity-feed');
  if (actEl) actEl.innerHTML = `<div class="empty-state" style="padding:22px 10px"><div class="empty-state-icon">🗂️</div><div class="empty-state-title">Belum ada aktivitas</div></div>`;
}

async function loadAdminStats() {
  try {
    const res   = await AdminAPI.getStats();
    const stats = res.data;
    const kpiProjects = document.getElementById('admin-kpi-projects');
    const kpiUsers    = document.getElementById('admin-kpi-users');
    const kpiDisputes = document.getElementById('admin-kpi-disputes');
    const kpiVerif    = document.getElementById('admin-kpi-verif');
    if (kpiProjects) kpiProjects.textContent = stats.active_projects || 0;
    if (kpiUsers)    kpiUsers.textContent    = stats.total_users || 0;
    if (kpiDisputes) kpiDisputes.textContent = stats.active_disputes || 0;
    if (kpiVerif)    kpiVerif.textContent    = stats.pending_verifications || 0;
  } catch (error) {
    console.error('Gagal load stats:', error);
  }
}

async function onEnterAdmin() {
  await loadAdminStats();
  renderAdminOverview();
  renderAdminRecentProjects();
  renderAdminProjectManagement();
  renderAdminUsers(adminUsersView.type);
  await renderAdminVerifListAPI();
  renderAdminDisputes();
  renderAdminSupportInbox();
  renderAdminAnnouncements();
  renderAdminSettings();
}

async function switchAdminTab(i) {
  document.querySelectorAll('#screen-admin .sidebar-item').forEach(el => el.classList.toggle('active', parseInt(el.dataset.atab) === i));
  document.querySelectorAll('#admin-bnav .bnav-item').forEach(el => el.classList.toggle('active', parseInt(el.dataset.atab) === i));
  document.querySelectorAll('[id^="admin-tab-"]').forEach(el => el.classList.toggle('active', el.id === `admin-tab-${i}`));
  document.getElementById('admin-main')?.scrollTo(0, 0);

  if (i === 0) { renderAdminOverview(); await loadAdminStats(); }
  if (i === 1) renderAdminProjectManagement();
  if (i === 2) renderAdminUsers(adminUsersView.type);
  if (i === 3) await renderAdminVerifListAPI();
  if (i === 4) renderAdminDisputes();
  if (i === 5) renderAdminSupportInbox();
  if (i === 6) renderAdminAnnouncements();
  if (i === 7) renderAdminSettings();
}

/* ================================================================
   EXPORTS
   ================================================================ */
window.renderAdminOverview = renderAdminOverview;
window.loadAdminStats      = loadAdminStats;
window.onEnterAdmin        = onEnterAdmin;
window.switchAdminTab      = switchAdminTab;
