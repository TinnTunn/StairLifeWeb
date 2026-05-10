/**
 * StairsLife — features/admin/support.js
 * renderAdminSupportInbox, adminFilterSupportTickets, adminResolveSupport.
 * Phase 3 — Modularisasi.
 */
'use strict';

// Reference to shared view state in app.js
const ADMIN_SUPPORT_VIEW = adminSupportView;

function adminSetSupportFilter(status, btn) {
  ADMIN_SUPPORT_VIEW.status = status;
  document.querySelectorAll('#admin-support-chips .filter-chip').forEach(c => c.classList.remove('active'));
  btn?.classList.add('active');
  renderAdminSupportInbox();
}

function adminFilterSupportTickets() {
  ADMIN_SUPPORT_VIEW.q = (document.getElementById('admin-support-search')?.value || '').trim().toLowerCase();
  renderAdminSupportInbox();
}

function adminGetSupportStatus(c) {
  if (c.status === 'resolved') return 'resolved';
  if ((c.unreadBy?.admin || 0) > 0) return 'open';
  return 'inProgress';
}

function renderAdminSupportInbox() {
  const listEl = document.getElementById('admin-support-list');
  const histEl = document.getElementById('admin-support-history');
  if (!listEl) return;

  let items = CHATS.filter(c => c.type === 'support' && (c.members || []).includes('admin'));
  const q   = ADMIN_SUPPORT_VIEW.q;
  if (q) {
    items = items.filter(c =>
      (c.last || '').toLowerCase().includes(q) ||
      ((c.members || []).includes('student') ? USER_PROFILES.student.name : USER_PROFILES.biz.name).toLowerCase().includes(q),
    );
  }
  if (ADMIN_SUPPORT_VIEW.status !== 'all') {
    items = items.filter(c => adminGetSupportStatus(c) === ADMIN_SUPPORT_VIEW.status);
  }

  if (!items.length) {
    listEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">💬</div><div class="empty-state-title">Tidak ada tiket support</div></div>`;
    if (histEl) histEl.innerHTML = '';
    return;
  }

  const active   = items.filter(c => adminGetSupportStatus(c) !== 'resolved');
  const resolved = items.filter(c => adminGetSupportStatus(c) === 'resolved');

  listEl.innerHTML = active.map(c => {
    const unread = (c.unreadBy?.admin) || 0;
    const who    = (c.members || []).includes('student') ? USER_PROFILES.student.name : USER_PROFILES.biz.name;
    const label  = (c.members || []).includes('student') ? 'Mahasiswa' : 'Bisnis';
    const status = adminGetSupportStatus(c);
    return `
      <div class="card card-p-md" style="margin-bottom:10px;display:flex;align-items:center;gap:14px;cursor:pointer">
        <div style="width:44px;height:44px;border-radius:50%;background:var(--accent-light);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:var(--accent);flex-shrink:0">${who.charAt(0)}</div>
        <div style="flex:1;min-width:0" onclick="openChatRoom('${c.id}')">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
            <div style="font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${who}</div>
            <div style="font-size:12px;color:var(--text-muted)">${fmtRelative(c.time)}</div>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${label} · ${status === 'open' ? 'Open' : 'In Progress'}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.last || ''}</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="adminResolveSupport('${c.id}')">Resolve</button>
        ${unread ? `<span class="chat-unread-badge" style="position:static">${unread}</span>` : ''}
      </div>`;
  }).join('') || `<div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title">Tidak ada tiket aktif</div></div>`;

  if (histEl) {
    histEl.innerHTML = resolved.map(c => `
      <div class="card card-p-md" style="margin-bottom:8px">
        <div style="font-size:14px;font-weight:700">${(c.members || []).includes('student') ? USER_PROFILES.student.name : USER_PROFILES.biz.name}</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${c.last || ''}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:6px">Resolved ${fmtRelative(c.time)}</div>
      </div>
    `).join('') || `<div class="empty-state" style="padding:18px 10px"><div class="empty-state-title">Belum ada tiket resolved</div></div>`;
  }
}

function adminResolveSupport(chatId) {
  const c = CHATS.find(x => x.id === chatId);
  if (!c) return;
  c.status = 'resolved';
  c.time   = new Date();
  ADMIN_AUDIT_LOGS.unshift({ who: 'Admin Operasional', action: `Resolve support ticket ${chatId}`, at: new Date() });
  renderAdminSupportInbox();
  showToast('Tiket support ditandai resolved', 'success');
}

/* ================================================================
   EXPORTS
   ================================================================ */
window.adminSetSupportFilter      = adminSetSupportFilter;
window.adminFilterSupportTickets  = adminFilterSupportTickets;
window.renderAdminSupportInbox    = renderAdminSupportInbox;
window.adminResolveSupport        = adminResolveSupport;
