// ── Admin dashboard ───────────────────────────────────
let allBookings = [];
let currentFilter = 'all';

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const stats = await res.json();
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-pending').textContent = stats.pending;
    document.getElementById('stat-confirmed').textContent = stats.confirmed;
    document.getElementById('stat-guests').textContent = stats.guests;
    document.getElementById('pending-badge').textContent = `${stats.pending} pending`;
  } catch (e) {
    console.error('Stats error:', e);
  }
}

async function loadBookings() {
  try {
    const res = await fetch('/api/bookings');
    allBookings = await res.json();
    allBookings.reverse();
    renderBookings();
    loadStats();
  } catch (e) {
    document.getElementById('bookings-list').innerHTML =
      '<div class="empty-state"><div class="empty-state-icon">⚠️</div>Could not load bookings. Is the server running?</div>';
  }
}

function renderBookings() {
  const search = (document.getElementById('search')?.value || '').toLowerCase();
  const list = allBookings.filter(b => {
    if (currentFilter !== 'all' && b.status !== currentFilter) return false;
    if (search && !b.name?.toLowerCase().includes(search) && !b.email?.toLowerCase().includes(search)) return false;
    return true;
  });

  const container = document.getElementById('bookings-list');

  if (list.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div>No bookings found.<br><a href="/book" style="color:var(--orange);text-decoration:none">Share the booking link →</a></div>`;
    return;
  }

  container.innerHTML = list.map(b => `
    <div class="booking-card ${b.status || 'pending'}">
      <div class="b-avatar">${initials(b.name)}</div>
      <div>
        <div class="b-name">${b.name || 'Unknown'}</div>
        <div class="b-meta">
          <span>📞 ${b.phone || '–'}</span>
          <span>✉️ ${b.email || '–'}</span>
        </div>
        ${b.notes && b.notes.toLowerCase() !== 'none' ? `<span class="b-notes">💬 ${b.notes}</span>` : ''}
      </div>
      <div class="b-datetime">
        <div class="b-date">${b.date || '–'}</div>
        <div class="b-time">${b.time || '–'}</div>
        <div class="b-guests">${b.guests || '?'} guest(s)</div>
      </div>
      <div class="b-actions">
        <span class="status-pill ${b.status || 'pending'}">${b.status || 'pending'}</span>
        ${b.status === 'pending' ? `
          <button class="action-btn confirm" onclick="updateStatus(${b.id}, 'confirmed')">Confirm</button>
          <button class="action-btn cancel" onclick="updateStatus(${b.id}, 'cancelled')">Cancel</button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

async function updateStatus(id, status) {
  try {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    await loadBookings();
  } catch (e) {
    alert('Failed to update booking.');
  }
}

function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderBookings();
}

async function loadDemo() {
  const demos = [
    { name: 'Liezel van Wyk', phone: '082 345 6789', email: 'liezel@gmail.com', date: '15 April', time: '7:00 PM', guests: '4', notes: 'Vegetarian options please' },
    { name: 'Pieter Joubert', phone: '071 222 3333', email: 'pieter@outlook.com', date: '16 April', time: '1:00 PM', guests: '2', notes: 'none' },
    { name: 'Fatima Adams', phone: '064 111 9988', email: 'fatima@webmail.co.za', date: '16 April', time: '7:30 PM', guests: '6', notes: 'Birthday celebration!' },
  ];
  for (const d of demos) {
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d)
    });
  }
  await loadBookings();
}

async function clearAll() {
  if (!confirm('Clear all bookings from the server?')) return;
  // Reset by re-writing empty file via custom endpoint isn't set up,
  // so we just reload and inform
  alert('To fully clear, delete bookings.json on the server and restart.');
  await loadBookings();
}

// Init
loadBookings();
setInterval(loadBookings, 30000); // auto-refresh every 30s
