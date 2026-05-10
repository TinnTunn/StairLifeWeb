/**
 * StairsLife — features/admin/users.js
 * renderAdminUsers, switchUserTab, adminUserAction, adminToggleSuspendUser.
 * Phase 3 — Modularisasi.
 */
'use strict';

function switchUserTab(tab, btn) {
  // BUG FIX: harus update .type bukan hanya .tab
  adminUsersView.type = tab;
  adminUsersView.tab  = tab;
  document.querySelectorAll('#admin-tab-2 #user-tab-mhs, #admin-tab-2 #user-tab-biz').forEach(c => c.classList.remove('active'));
  btn?.classList.add('active');
  renderAdminUsers();
}

function adminSetUserStatus(status, btn) {
  adminUsersView.status = status;
  document.querySelectorAll('#admin-user-status-chips .filter-chip').forEach(c => c.classList.remove('active'));
  btn?.classList.add('active');
  renderAdminUsers();
}

function adminFilterUsers() {
  adminUsersView.q = (document.getElementById('admin-user-search')?.value || '').trim().toLowerCase();
  renderAdminUsers();
}

async function renderAdminUsers(tab) {
  const el = document.getElementById('admin-users-list');
  if (!el) return;

  el.innerHTML = skeletons.adminUserRows(5);

  try {
    const role = (tab === 'mhs' || adminUsersView.type === 'mhs') ? 'mahasiswa' : 'bisnis';
    const res  = await AdminAPI.getUsers(role);
    let users  = res.data || [];

    // Deduplikasi berdasarkan ID
    const seen = new Set();
    users = users.filter(u => { if (seen.has(u.id)) return false; seen.add(u.id); return true; });

    // Update label chip dengan jumlah real
    if (role === 'mahasiswa') {
      const mhsBtn = document.getElementById('user-tab-mhs');
      if (mhsBtn) mhsBtn.textContent = `Mahasiswa (${users.length})`;
    } else {
      const bizBtn = document.getElementById('user-tab-biz');
      if (bizBtn) bizBtn.textContent = `Bisnis (${users.length})`;
    }

    const q = adminUsersView.q.toLowerCase().trim();
    if (q) users = users.filter(u => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    if (adminUsersView.status !== 'all') {
      users = users.filter(u => {
        if (adminUsersView.status === 'active')    return !u.is_suspended;
        if (adminUsersView.status === 'suspended') return u.is_suspended;
        return true;
      });
    }

    if (!users.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-title">Tidak ada pengguna ditemukan</div></div>`;
      return;
    }

    el.innerHTML = users.map(u => `
      <div class="card card-p-md" style="margin-bottom:10px;display:flex;align-items:center;gap:14px">
        <div style="width:44px;height:44px;border-radius:50%;background:${u.role === 'bisnis' ? 'var(--teal-light)' : 'var(--accent-light)'};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:${u.role === 'bisnis' ? 'var(--teal-dark)' : 'var(--accent)'};flex-shrink:0">
          ${(u.full_name || 'U').charAt(0)}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:600">${u.full_name || '-'}</div>
          <div style="font-size:12px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            ${u.email} · ${u.role === 'bisnis' ? 'Pemilik Bisnis' : 'Mahasiswa'}
          </div>
        </div>
        ${u.is_suspended ? `<span class="badge badge-rose">Suspended</span>` : `<span class="badge badge-teal">Aktif</span>`}
        <button class="btn btn-ghost btn-sm" onclick="adminToggleSuspendUser('${u.id}', ${!!u.is_suspended})">
          ${u.is_suspended ? 'Aktifkan' : 'Suspend'}
        </button>
        <button class="btn btn-danger btn-sm" onclick="adminDeleteUser('${u.id}','${(u.full_name || '').replace(/'/g,"\\'")}','${u.role}')">
          🗑️
        </button>
      </div>
    `).join('');
  } catch (e) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-title">Gagal memuat pengguna</div><p class="empty-state-desc">${e.message}</p></div>`;
  }
}

async function adminToggleSuspendUser(userId, isSuspended) {
  try {
    await AdminAPI.suspendUser(userId);
    showToast(`Akun berhasil ${isSuspended ? 'diaktifkan' : 'disuspend'}`, 'success');
    await renderAdminUsers(adminUsersView.type);
  } catch (e) {
    showToast(e.message, 'error');
  }
}

function closeAdminUserDrawer(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('admin-user-drawer')?.classList.remove('open');
}

function adminDeleteUser(userId, userName, userRole) {
  const existing = document.getElementById('admin-delete-user-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'admin-delete-user-modal';
  modal.className = 'modal-backdrop open';
  modal.style.zIndex = '9999';
  modal.innerHTML = `
    <div class="modal-sheet" style="max-width:420px" role="dialog">
      <div class="modal-drag-bar"></div>
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:40px;margin-bottom:8px">⚠️</div>
        <h2 style="font-size:17px;font-weight:800;margin-bottom:6px;color:var(--rose)">Hapus Akun Permanen?</h2>
        <p style="font-size:13px;color:var(--text-secondary);line-height:1.6">
          <b>${userName}</b> (${userRole === 'bisnis' ? 'Pemilik Bisnis' : 'Mahasiswa'})<br>
          Tindakan ini <b>tidak bisa dibatalkan</b>.<br>
          Semua data, project, kontrak, dan riwayat transaksi akan terhapus.
        </p>
      </div>
      <div style="background:var(--rose-light,#fef2f2);border:1px solid rgba(239,68,68,0.2);border-radius:var(--radius-md);padding:12px;margin-bottom:16px">
        <div style="font-size:13px;color:var(--rose);font-weight:600">⚠️ Perhatian</div>
        <div style="font-size:12px;color:var(--rose);margin-top:4px">Jika user punya kontrak aktif atau escrow yang belum selesai, hapus hanya setelah semua transaksi selesai.</div>
      </div>
      <div class="form-group" style="margin-bottom:16px">
        <label class="form-label" style="color:var(--rose)">Ketik <b>"HAPUS"</b> untuk konfirmasi</label>
        <input class="form-input" id="admin-delete-confirm-input" type="text" placeholder="Ketik HAPUS">
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-ghost" style="flex:1" onclick="document.getElementById('admin-delete-user-modal').remove()">Batal</button>
        <button class="btn btn-danger" style="flex:1;height:44px" id="admin-delete-confirm-btn"
          onclick="_confirmAdminDeleteUser('${userId}', '${userRole}')">Hapus Akun</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('admin-delete-confirm-input')?.focus(), 100);
}

async function _confirmAdminDeleteUser(userId, userRole) {
  const input = document.getElementById('admin-delete-confirm-input')?.value.trim();
  if (input !== 'HAPUS') {
    showToast('Ketik "HAPUS" untuk mengkonfirmasi', 'error');
    return;
  }

  const btn = document.getElementById('admin-delete-confirm-btn');
  if (btn) { btn.disabled = true; btn.classList.add('loading'); }

  try {
    await AdminAPI.deleteUser(userId);
    document.getElementById('admin-delete-user-modal')?.remove();

    ADMIN_AUDIT_LOGS.unshift({
      who: 'Admin',
      action: `Hapus akun user ID: ${userId} (${userRole})`,
      at: new Date(),
    });

    showToast('Akun berhasil dihapus permanen', 'success');
    await renderAdminUsers(adminUsersView.type);
  } catch (e) {
    showToast(e.message || 'Gagal menghapus akun', 'error');
    if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
  }
}

/* ================================================================
   EXPORTS
   ================================================================ */
window.switchUserTab           = switchUserTab;
window.adminSetUserStatus      = adminSetUserStatus;
window.adminFilterUsers        = adminFilterUsers;
window.renderAdminUsers        = renderAdminUsers;
window.adminToggleSuspendUser  = adminToggleSuspendUser;
window.closeAdminUserDrawer    = closeAdminUserDrawer;
window.adminDeleteUser         = adminDeleteUser;
window._confirmAdminDeleteUser = _confirmAdminDeleteUser;
