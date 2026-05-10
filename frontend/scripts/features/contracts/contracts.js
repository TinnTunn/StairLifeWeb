/**
 * StairsLife — features/contracts/contracts.js
 * loadContractDetail, submitDeliverable, approveContract, renderDelivFiles.
 * Depends on: ContractsAPI, PaymentsAPI, showToast, goTo, goBack, statusBadge.
 * Phase 3 — Modularisasi.
 */
'use strict';

/* ================================================================
   DELIVERABLE UPLOAD
   ================================================================ */
const delivFiles = [];

/**
 * Dipanggil dari onclick tombol "+ Tambah File" di index.html.
 * Trigger hidden <input type="file"> secara programatik.
 */
function addDeliverableFile() {
  const input = document.getElementById('deliv-file-input');
  if (input) { input.value = ''; input.click(); }
}

/**
 * Handler untuk <input type="file" id="deliv-file-input" onchange="handleDelivFileChange(event)">
 * Validasi ukuran, lalu push ke delivFiles[].
 */
function handleDelivFileChange(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;

  const MAX_MB = 20;
  if (file.size > MAX_MB * 1024 * 1024) {
    showToast(`File maksimal ${MAX_MB}MB`, 'error');
    return;
  }

  const sizeKb = Math.round(file.size / 1024);
  delivFiles.push({ name: file.name, size: sizeKb, _file: file });
  renderDelivFiles();
  showToast('File ditambahkan ✅', 'success');
  // Reset input agar file yang sama bisa dipilih lagi
  if (event.target) event.target.value = '';
}

function renderDelivFiles() {
  const el = document.getElementById('deliv-file-list');
  if (!el) return;
  el.innerHTML = delivFiles.map((f, i) => `
    <div class="deliv-file-item">
      <div class="deliv-file-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
      <div style="flex:1">
        <div class="deliv-file-name">${f.name}</div>
        <div class="deliv-file-size">${f.size >= 1024 ? (f.size / 1024).toFixed(1) + ' MB' : f.size + ' KB'}</div>
      </div>
      <div class="deliv-file-remove" onclick="removeDelivFile(${i})">
        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
      </div>
    </div>`).join('');
}

function removeDelivFile(i) { delivFiles.splice(i, 1); renderDelivFiles(); }

async function submitDeliverable() {
  if (!delivFiles.length) { showToast('Upload minimal 1 file deliverable', 'error'); return; }

  // Coba dapatkan contractId dari berbagai sumber
  let contractId = window._currentContract?.id || window.currentContractId || null;

  // Jika masih null, coba ambil kontrak aktif dari API sebagai last resort
  if (!contractId) {
    try {
      showToast('Mencari kontrak aktif...', 'info');
      const res       = await ContractsAPI.getMyContracts();
      const contracts = res.data || [];
      const active    = contracts.find(c => c.status === 'active' || c.status === 'pending_review');
      if (active) {
        contractId             = active.id;
        window._currentContract = active;
      }
    } catch (_) {}
  }

  if (!contractId) {
    showToast('Kontrak tidak ditemukan. Buka halaman "Project Aktif" dulu.', 'error');
    return;
  }

  const btn = document.getElementById('deliv-submit-btn');
  if (btn) { btn.disabled = true; btn.classList.add('loading'); }

  try {
    showToast('Mengupload file...', 'info');

    const urls = [];
    for (const f of delivFiles) {
      if (f._file) {
        const res = await UploadAPI.uploadFile(f._file, 'deliverable');
        urls.push(res?.data?.url || res?.url || f.name);
      }
    }

    const note = document.getElementById('deliv-note')?.value?.trim() || '';

    await ContractsAPI.uploadDeliverable(contractId, {
      deliverable_urls: urls,
      note,
    });

    showToast('Deliverable berhasil dikirim! ✅ Menunggu review klien.', 'success');
    delivFiles.length = 0;
    renderDelivFiles();
    // Reset contract reference setelah submit
    window.currentContractId = null;
    setTimeout(() => goBack(), 900);
  } catch (error) {
    showToast(error.message || 'Gagal mengirim deliverable', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
  }
}

/* ================================================================
   CONTRACT DETAIL
   ================================================================ */
/**
 * loadContractDetail(contractId?)
 * Jika contractId diberikan (dari klik card), tampilkan kontrak itu.
 * Jika tidak, ambil kontrak aktif pertama (fallback).
 */
async function loadContractDetail(contractId = null) {
  const contentEl = document.getElementById('contract-detail-content');
  if (contentEl) contentEl.innerHTML = skeletons.activeProjectCards(1);

  try {
    const res       = await ContractsAPI.getMyContracts();
    const contracts = res.data || [];

    // L3 FIX: gunakan contractId spesifik jika tersedia
    let contract = contractId
      ? contracts.find(c => c.id === contractId)
      : contracts.find(c => c.status === 'active' || c.status === 'pending_review')
        || contracts[0];

    if (!contract) { showToast('Kontrak tidak ditemukan', 'info'); return; }

    window._currentContract = contract;

    const project     = contract.projects || {};
    const student     = contract.users_contracts_student_idTousers || {};
    const business    = contract.users_contracts_business_idTousers || {};
    const currentUser = AuthAPI.getCurrentUser();
    const isStudent   = currentUser?.role === 'mahasiswa';

    const deadlineDate = new Date(contract.deadline);
    const deadlineStr  = deadlineDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const startedStr   = new Date(contract.started_at || contract.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const statusConfig = {
      active:         { label: 'Kontrak Aktif',      color: 'var(--teal-dark)',  bg: 'var(--teal-light)',  icon: '🔵' },
      pending_review: { label: 'Menunggu Review',    color: 'var(--amber-dark)', bg: 'var(--amber-light)', icon: '⏳' },
      completed:      { label: 'Selesai',             color: 'var(--teal-dark)',  bg: 'var(--teal-light)',  icon: '✅' },
      disputed:       { label: 'Sengketa',            color: 'var(--rose)',       bg: 'var(--rose-light)',  icon: '⚠️' },
    };
    const statusCfg = statusConfig[contract.status] || statusConfig.active;

    const statusBar = document.getElementById('contract-detail-content');
    if (statusBar) {
      statusBar.innerHTML = `
        <div style="background:${statusCfg.bg};border:1px solid rgba(0,0,0,0.1);border-radius:var(--radius-md);padding:14px;display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <svg viewBox="0 0 24 24" fill="none" stroke="${statusCfg.color}" stroke-width="2" width="24" height="24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div>
            <div style="font-size:14px;font-weight:700;color:${statusCfg.color}">${statusCfg.label}</div>
            <div style="font-size:12px;color:${statusCfg.color}">Dimulai ${startedStr} · Deadline ${deadlineStr}</div>
          </div>
          <span class="badge" style="margin-left:auto;background:${statusCfg.color};color:white">${statusCfg.icon} ${statusCfg.label}</span>
        </div>
        <h3 style="font-size:16px;font-weight:700;margin-bottom:14px">${project.title || 'Kontrak'}</h3>
        <div style="display:grid;gap:10px">
          <div style="display:flex;justify-content:space-between;font-size:14px;padding:8px 0;border-bottom:1px solid var(--divider)">
            <span style="color:var(--text-secondary)">${isStudent ? 'Klien' : 'Freelancer'}</span>
            <span style="font-weight:600">${isStudent ? (business.full_name || '-') : (student.full_name || '-')}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:14px;padding:8px 0;border-bottom:1px solid var(--divider)">
            <span style="color:var(--text-secondary)">Nilai Kontrak</span>
            <span style="font-weight:700;color:var(--accent)">Rp ${(contract.agreed_budget || 0).toLocaleString('id-ID')}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:14px;padding:8px 0;border-bottom:1px solid var(--divider)">
            <span style="color:var(--text-secondary)">Status Escrow</span>
            <span class="badge badge-teal">🔒 Dana Ditahan</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:14px;padding:8px 0">
            <span style="color:var(--text-secondary)">Progress</span>
            <span style="font-weight:600;color:var(--accent)">${contract.progress_pct || 0}%</span>
          </div>
        </div>
        <div class="progress-bar" style="margin-top:10px">
          <div class="progress-fill" style="width:${contract.progress_pct || 0}%"></div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
          ${isStudent ? `
            <button class="btn btn-primary" style="flex:2;height:48px;font-size:15px" onclick="window.currentContractId='${contract.id}';goTo('screen-deliverable-upload')">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="18"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload Deliverable
            </button>
            <button class="btn btn-ghost" style="flex:1;height:48px" onclick="openDirectChatWith('${business.full_name || 'Klien'}','bisnis','Kontrak: ${project.title || ''}')">💬 Chat Klien</button>
          ` : `
            ${contract.status === 'pending_review' ? `
            <button class="btn btn-primary" style="flex:2;height:48px;font-size:15px" onclick="approveDeliverableFromContract()">
              ✅ Approve Deliverable
            </button>` : ''}
            <button class="btn btn-ghost" style="flex:1;height:48px" onclick="openDirectChatWith('${student.full_name || 'Freelancer'}','mahasiswa','Kontrak: ${project.title || ''}')">💬 Chat Freelancer</button>
          `}
          <button class="btn btn-danger" style="height:48px;padding:0 16px" onclick="goTo('screen-dispute-list')">⚠️ Sengketa</button>
        </div>
        ${contract.deliverable_url ? `
        <div style="margin-top:16px;padding:14px;background:var(--teal-light);border-radius:var(--radius-md)">
          <div style="font-size:13px;font-weight:700;color:var(--teal-dark);margin-bottom:6px">📎 Deliverable Dikirim</div>
          <div style="font-size:13px;color:var(--teal-dark)">${contract.deliverable_notes || 'File sudah diupload'}</div>
          <a href="${contract.deliverable_url}" target="_blank" class="btn btn-ghost btn-sm" style="margin-top:8px">Lihat File →</a>
        </div>` : ''}
      `;
    }
  } catch (error) {
    showToast('Gagal load kontrak: ' + error.message, 'error');
  }
}

async function approveDeliverableFromContract() {
  const contract = window._currentContract;
  if (!contract) return;

  try {
    await ContractsAPI.approve(contract.id);
    const paymentRes = await PaymentsAPI.getByContract(contract.id);
    if (paymentRes.data?.id) {
      await PaymentsAPI.releaseEscrow(paymentRes.data.id);
      showToast('✅ Deliverable disetujui! Dana dicairkan ke mahasiswa.', 'success');
    } else {
      showToast('✅ Deliverable disetujui!', 'success');
    }
    await loadContractDetail();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

/* ================================================================
   EXPORTS
   ================================================================ */
window.delivFiles                  = delivFiles;
window.addDeliverableFile          = addDeliverableFile;
window.handleDelivFileChange       = handleDelivFileChange;
window.renderDelivFiles            = renderDelivFiles;
window.removeDelivFile             = removeDelivFile;
window.submitDeliverable           = submitDeliverable;
window.loadContractDetail          = loadContractDetail;
window.approveDeliverableFromContract = approveDeliverableFromContract;
