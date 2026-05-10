/**
 * StairsLife — features/admin/disputes.js
 * renderAdminDisputes, openAdminDisputeDetail, adminDecision, adminResolveDisputeAPI.
 * Phase 3 — Modularisasi.
 */
'use strict';

function adminSetDisputeFilter(status, btn) {
  adminDisputeView.status = status;
  document.querySelectorAll('#admin-dispute-chips .filter-chip').forEach(c => c.classList.remove('active'));
  btn?.classList.add('active');
  renderAdminDisputes();
}

async function renderAdminDisputes() {
  const el = document.getElementById('admin-disputes-list');
  if (!el) return;

  el.innerHTML = skeletons.disputeCards(3);

  try {
    const status   = adminDisputeView.status !== 'all' ? adminDisputeView.status : undefined;
    const res      = await AdminAPI.getDisputes(status);
    const disputes = res.data || [];

    if (!disputes.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚖️</div><div class="empty-state-title">Tidak ada sengketa</div></div>`;
      return;
    }

    el.innerHTML = disputes.map(d => `
      <div class="admin-dispute-card${d.status === 'resolved' ? ' resolved' : ''}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px">
          <span style="font-size:15px;font-weight:700;flex:1">${d.contracts?.projects?.title || 'Project'}</span>
          ${statusBadge(d.status === 'resolved' ? 'selesai' : 'pending')}
        </div>
        <div class="dispute-row">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>${d.contracts?.users_contracts_student_idTousers?.full_name || 'Mahasiswa'} vs ${d.contracts?.users_contracts_business_idTousers?.full_name || 'Bisnis'}</span>
        </div>
        <div class="dispute-row">
          <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/></svg>
          <span>Rp ${(d.contracts?.agreed_budget || 0).toLocaleString('id-ID')} · ${new Date(d.created_at).toLocaleDateString('id-ID')}</span>
        </div>
        ${d.status !== 'resolved' ? `
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" onclick="adminResolveDisputeAPI('${d.id}')">✅ Resolve</button>
        </div>` : ''}
      </div>
    `).join('');
  } catch (e) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-title">Gagal memuat sengketa</div></div>`;
  }
}

async function adminResolveDisputeAPI(id) {
  // Buat modal — ganti native prompt() yang tidak bisa di-style
  const existing = document.getElementById('resolve-dispute-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'resolve-dispute-modal';
  modal.className = 'modal-backdrop open';
  modal.style.zIndex = '9999';
  modal.innerHTML = `
    <div class="modal-sheet" style="max-width:440px" role="dialog">
      <div class="modal-drag-bar"></div>
      <h2 style="font-size:17px;font-weight:800;margin-bottom:6px">Selesaikan Dispute</h2>
      <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">Masukkan keputusan final. Semua pihak akan menerima notifikasi.</p>
      <div class="form-group">
        <label class="form-label">Keputusan Final <span class="req">*</span></label>
        <textarea class="form-textarea" id="resolve-dispute-input" rows="3"
          placeholder="Contoh: Refund 100% ke bisnis / Dana dicairkan ke mahasiswa / Partial 60:40..."></textarea>
      </div>
      <div style="display:flex;gap:10px;margin-top:16px">
        <button class="btn btn-ghost" style="flex:1" onclick="document.getElementById('resolve-dispute-modal').remove()">Batal</button>
        <button class="btn btn-primary" style="flex:2;height:44px" id="resolve-dispute-confirm-btn"
          onclick="_confirmResolveDispute('${id}')">✅ Selesaikan</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('resolve-dispute-input')?.focus(), 100);
}

async function _confirmResolveDispute(id) {
  const decision = document.getElementById('resolve-dispute-input')?.value.trim();
  if (!decision || decision.length < 5) {
    showToast('Masukkan keputusan minimal 5 karakter', 'error');
    return;
  }
  const btn = document.getElementById('resolve-dispute-confirm-btn');
  if (btn) { btn.disabled = true; btn.classList.add('loading'); }
  try {
    await AdminAPI.resolveDispute(id, { resolution: decision });
    document.getElementById('resolve-dispute-modal')?.remove();
    showToast('Dispute berhasil diselesaikan ✅', 'success');
    await renderAdminDisputes();
  } catch (e) {
    showToast(e.message, 'error');
    if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
  }
}

function closeAdminDisputeDrawer(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('admin-dispute-drawer')?.classList.remove('open');
}

/* ================================================================
   EXPORTS
   ================================================================ */
window.adminSetDisputeFilter   = adminSetDisputeFilter;
window.renderAdminDisputes     = renderAdminDisputes;
window.adminResolveDisputeAPI  = adminResolveDisputeAPI;
window._confirmResolveDispute  = _confirmResolveDispute;
window.closeAdminDisputeDrawer = closeAdminDisputeDrawer;
