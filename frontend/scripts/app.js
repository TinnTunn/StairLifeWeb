/**
 * StairsLife Web — app.js  v3.0
 * Entry point: global state, bootstrap, route hooks.
 *
 * Phase 3 — Modularisasi: semua fungsi dipindah ke modul.
 * File ini hanya berisi:
 *   1. State global (arrays, view state, navigation history)
 *   2. USER_PROFILES compat shim
 *   3. DOMContentLoaded bootstrap
 *   4. Route hooks registry
 *   5. renderAdminSettings + renderPortfolio (kecil, tidak perlu file sendiri)
 *   6. Global window.* exports untuk api-core.js callbacks
 */
'use strict';

/* ================================================================
   GLOBAL DATA ARRAYS
   ================================================================ */
const PROJECTS        = [];
const APPLICATIONS    = [];
const ACTIVE_PROJECTS = [];
const BIZ_PROJECTS    = [];
const BIZ_APPLICATIONS = [];
const PAYMENTS        = [];
const FULL_PAYMENTS   = [];
const NOTIFICATIONS   = [];
const DISPUTES        = [];
const CHATS           = [];
const CHAT_MESSAGES   = {};

const ADMIN_STUDENTS        = [];
const ADMIN_BUSINESSES      = [];
const ADMIN_BIZ_USERS       = [];
const ADMIN_PROJECTS_DATA   = [];
const ADMIN_USERS           = [];
const ADMIN_SUPPORT_TICKETS = [];
const ADMIN_DISPUTES        = [];
const ADMIN_ACTIVITY        = [];
const ADMIN_ANNOUNCEMENTS   = [];
const ADMIN_AUDIT_LOGS      = [];

let ADMIN_NOTIFS = [];

const ADMIN_ROLES = [
  { id: 'ra1', name: 'Super Admin', user: 'Super Admin', members: ['Super Admin'],
    permissions: ['Overview','Projects','Users','Verification','Disputes','Support','Announcement','Settings'] },
  { id: 'ra2', name: 'Admin', user: 'Ops Admin', members: ['Ops Admin'],
    permissions: ['Overview','Projects','Users','Verification','Disputes','Support'] },
];

const ADMIN_PLATFORM_SETTINGS = { fee: 10, verifSla: 2 };
const ADMIN_SETTINGS          = { fee: 10, verifSla: 2 };

/* ================================================================
   ADMIN VIEW STATE — shared with admin/* modules
   ================================================================ */
const adminUsersView   = { type: 'mhs', status: 'all', q: '', tab: 'mhs' };
const adminVerifView   = { status: 'pending' };
const adminDisputeView = { status: 'all' };
const adminSupportView = { status: 'all', q: '' };

// Backwards-compat aliases
const ADMIN_USER_VIEW    = adminUsersView;
const ADMIN_VERIF_VIEW   = adminVerifView;
const ADMIN_DISPUTE_VIEW = adminDisputeView;

/* ================================================================
   NAVIGATION HISTORY (used by router.js)
   ================================================================ */
const screenHistory = [];

/* ================================================================
   MAIN APP STATE
   ================================================================ */
const state = {
  theme:            localStorage.getItem('sl-theme') || 'light',
  currentScreen:    'screen-landing',
  prevScreen:       null,
  obPage:           0,
  loginRole:        0,
  regStep:          1,
  regRole:          null,
  regSkipKtm:       false,
  browseFilter:     'semua',
  appFilter:        'semua',
  chatFilter:       'all',
  searchQuery:      '',
  currentProjectId: null,
  appliedProjects:  new Set(),
};

/* ================================================================
   USER_PROFILES — compat shim; actual values from AuthAPI JWT
   ================================================================ */
const USER_PROFILES = {
  get student() {
    const p = (typeof getCurrentUserProfile === 'function' ? getCurrentUserProfile() : null) || {};
    return { id: p.id || 's1', name: p.role === 'student' ? p.name : (p.name || 'Mahasiswa') };
  },
  get biz() {
    const p = (typeof getCurrentUserProfile === 'function' ? getCurrentUserProfile() : null) || {};
    return { id: p.id || 'b1', name: p.role === 'biz' ? p.name : (p.name || 'Bisnis'), bizName: p.bizName || p.name || 'Bisnis' };
  },
  get admin() {
    const p = (typeof getCurrentUserProfile === 'function' ? getCurrentUserProfile() : null) || {};
    return { id: p.id || 'a1', name: p.role === 'admin' ? p.name : 'Admin StairsLife' };
  },
};

/* ================================================================
   ADMIN SETTINGS (kept here — too small for own file)
   ================================================================ */
function renderAdminSettings() {
  const roleEl  = document.getElementById('admin-role-list');
  const auditEl = document.getElementById('admin-audit-list');
  if (roleEl) {
    roleEl.innerHTML = ADMIN_ROLES.map(r => `
      <div class="card card-p-md" style="margin-bottom:8px;border:1px solid var(--border)">
        <div style="font-size:14px;font-weight:700">${r.name}</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">Anggota: ${r.members.join(', ')}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:6px">${r.permissions.join(' • ')}</div>
      </div>`).join('');
  }
  if (auditEl) {
    auditEl.innerHTML = ADMIN_AUDIT_LOGS.slice(0, 20).map(l => `
      <div class="admin-feed-item">
        <div class="admin-feed-dot"></div>
        <div style="flex:1">
          <div class="admin-feed-title">${l.who}</div>
          <div class="admin-feed-sub">${l.action}</div>
          <div class="admin-feed-time">${fmtRelative(l.at)}</div>
        </div>
      </div>`).join('');
  }

  // Load settings dari backend dan isi form
  AdminAPI.getSettings().then(res => {
    const s = res?.data || {};
    const feeEl = document.getElementById('admin-fee');
    const slaEl = document.getElementById('admin-verif-sla');
    if (feeEl && s.platform_fee   != null) feeEl.value = s.platform_fee;
    if (slaEl && s.verification_sla_days != null) slaEl.value = s.verification_sla_days;
    // Sync ke local cache
    if (s.platform_fee)           ADMIN_SETTINGS.fee      = s.platform_fee;
    if (s.verification_sla_days)  ADMIN_SETTINGS.verifSla = s.verification_sla_days;
  }).catch(() => {
    // Fallback: isi form dari local cache
    const feeEl = document.getElementById('admin-fee');
    const slaEl = document.getElementById('admin-verif-sla');
    if (feeEl) feeEl.value = ADMIN_SETTINGS.fee;
    if (slaEl) slaEl.value = ADMIN_SETTINGS.verifSla;
  });
}

async function adminSaveSettings() {
  const fee = parseFloat(document.getElementById('admin-fee')?.value || '0');
  const sla = parseInt(document.getElementById('admin-verif-sla')?.value || '0', 10);
  if (Number.isNaN(fee) || Number.isNaN(sla) || fee < 0 || sla < 1) {
    showToast('Nilai settings tidak valid', 'error');
    return;
  }

  const btn = document.getElementById('admin-settings-save-btn');
  if (btn) { btn.disabled = true; btn.classList.add('loading'); }

  try {
    await AdminAPI.updateSettings({ platform_fee: fee, verification_sla_days: sla });
    ADMIN_SETTINGS.fee      = fee;
    ADMIN_SETTINGS.verifSla = sla;
    ADMIN_AUDIT_LOGS.unshift({ who: 'Super Admin', action: `Ubah settings: fee ${fee}% / verifikasi ${sla} hari`, at: new Date() });
    renderAdminSettings();
    showToast('Pengaturan berhasil disimpan ke server ✅', 'success');
  } catch (error) {
    showToast(error.message || 'Gagal menyimpan settings', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
  }
}

/* ================================================================
   PORTFOLIO HELPER
   ================================================================ */
function renderPortfolio() {
  const grid = document.getElementById('portfolio-projects');
  if (!grid) return;
  const done = PROJECTS.slice(0, 6).map(p => ({ ...p, tier: 'menengah' }));
  grid.innerHTML = done.map((p, i) => buildProjectCard(p, i)).join('');
}

/* ================================================================
   DISPUTE MEDIATION OPENER
   ================================================================ */
function openDisputeMediation(disputeId) {
  const chat = ensureMediationChat(disputeId, getCurrentRole());
  if (chat) openChatRoom(chat.id);
}

/* ================================================================
   ROUTE HOOKS
   ================================================================ */
const _routeHooks = {
  'screen-notifications':      () => renderNotifications(),
  'screen-verification':       () => onEnterVerification(),
  'screen-chat-list':          () => renderChatList(),
  'screen-admin':              () => onEnterAdmin(),
  'screen-portfolio':          () => renderPortfolio(),
  'screen-payment-history':    () => renderPaymentHistory(),
  'screen-dispute-list':       () => renderDisputeList(),
  'screen-help':               () => renderFAQ(),
  'screen-deliverable-upload': () => {
    delivFiles.length = 0;
    renderDelivFiles();
    // Jika _currentContract belum di-set (navigasi dari daftar project aktif),
    // load via currentContractId yang di-set dari onclick
    if (!window._currentContract && window.currentContractId) {
      ContractsAPI.getMyContracts().then(res => {
        const c = (res.data || []).find(x => x.id === window.currentContractId);
        if (c) window._currentContract = c;
      }).catch(() => {});
    }
  },
  'screen-contract-detail':    () => loadContractDetail(window.currentContractId || null),
  'screen-bank-account':       () => renderBankAccounts(),
  'screen-new-dispute':        () => { /* populated by openNewDispute() */ },
};
window._routeHooks = _routeHooks;

/* ================================================================
   BOOTSTRAP
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);

  // Jika user sudah punya token (returning user / refresh page),
  // jadwalkan proactive refresh segera
  if (TokenManager.get() && TokenManager.getRefresh()) {
    _scheduleProactiveRefresh();
  }

  const initial = _screenFromLocation();
  if (initial) {
    _showScreen(initial, { fromHistory: true });
    try { history.replaceState({ screen: initial }, '', `#${initial}`); } catch {}
  } else {
    try { history.replaceState({ screen: 'screen-landing' }, '', '#screen-landing'); } catch {}
  }

  const minDate   = new Date().toISOString().split('T')[0];
  const applyDate = document.getElementById('apply-date');
  if (applyDate) applyDate.min = minDate;
  const ppDeadline = document.getElementById('pp-deadline');
  if (ppDeadline) ppDeadline.min = minDate;

  document.querySelectorAll('#ob-dots .onboarding-dot').forEach(d => {
    d.addEventListener('click', () => obGo(parseInt(d.dataset.i)));
  });

  let tsX = 0;
  const obSlides = document.querySelector('.onboarding-slides');
  if (obSlides) {
    obSlides.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; }, { passive: true });
    obSlides.addEventListener('touchend', e => {
      const dx    = tsX - e.changedTouches[0].clientX;
      const total = document.querySelectorAll('.onboarding-slide').length;
      if (Math.abs(dx) > 50) {
        if (dx > 0 && state.obPage < total - 1) obGo(state.obPage + 1);
        else if (dx < 0 && state.obPage > 0)   obGo(state.obPage - 1);
      }
    }, { passive: true });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (typeof closeApplyModal === 'function')      closeApplyModal();
      if (typeof closeUnverifiedModal === 'function') closeUnverifiedModal();
    }
  });
});

/* ================================================================
   GLOBAL EXPORTS (api-core.js 401 callback etc.)
   Catatan: handleKtmFileChange, pickKtmFile, simulateKtmUpload,
   dan regResendOTP sudah di-export oleh core/auth.js — tidak perlu
   di-export ulang di sini (menghindari overwrite yang rawan refactor bug).
   ================================================================ */
window.showToast               = showToast;
window.goTo                    = goTo;
window.handleLogout            = handleLogout;
window.openReviewScreen        = openReviewScreen;
window.submitNewDispute        = submitNewDispute;
window.onDisputeEvidenceChange = onDisputeEvidenceChange;
window.refreshNotifBadge       = refreshNotifBadge;
window.renderAdminSettings     = renderAdminSettings;
window.adminSaveSettings       = adminSaveSettings;
window.renderPortfolio         = renderPortfolio;
window.openDisputeMediation    = openDisputeMediation;
