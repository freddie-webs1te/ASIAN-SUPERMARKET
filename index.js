// ── Open/Closed status ──────────────────────────────
function checkOpenStatus() {
  const now = new Date();
  const hour = now.getHours();
  const isOpen = hour >= 6 && hour < 20;
  const statusEl = document.getElementById('open-status');
  const dot = document.querySelector('.live-dot');
  if (!statusEl) return;
  if (isOpen) {
    statusEl.textContent = 'Open now · Closes 8 pm · Bodorp, George';
    dot.style.background = '#3ddc84';
  } else {
    statusEl.textContent = 'Currently closed · Opens 6 am · Book for tomorrow';
    dot.style.background = '#f97316';
  }
}
checkOpenStatus();

// ── Reviews data ──────────────────────────────────────
const reviews = [
  { initials: 'VM', name: 'Vilje Maritz', meta: 'Local Guide · 8 months ago', text: 'Probably the best sushi in town. Was so surprised — and the combos are epic!' },
  { initials: 'HC', name: 'Hendrik Combrinck', meta: 'Local Guide · 113 reviews · 3 months ago', text: 'A hidden gem! Excellent variety of authentic Asian ingredients at great prices. Staff are friendly and helpful. Highly recommended.' },
  { initials: 'MA', name: 'Melvin Alihusain', meta: '5 reviews · 3 months ago', text: 'Best dim sum in town! Great food, very nice selection of Asian products. Would definitely go again!' },
  { initials: 'JV', name: 'Johan Van Tonder', meta: 'Local Guide · 55 reviews · 4 months ago', text: 'If you miss the food from SE Asia, it\'s all here. Takeout menu is cheap and great value for money.' },
  { initials: 'ML', name: 'M. Louw', meta: 'Local Guide · 31 reviews · 4 months ago', text: 'The best Asian market in George. Tons of dumplings, Asian snacks and drinks. I go here often — highly recommended.' },
  { initials: 'HF', name: 'Heila Fourie', meta: 'Local Guide · 19 reviews · 2 months ago', text: 'Great, fresh sushi! Delicious tempura prawn fashion sandwiches! We will definitely be back soon!' },
];

function renderReviews() {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;
  grid.innerHTML = reviews.map((r, i) => `
    <div class="review-card reveal" style="transition-delay:${i * 0.06}s">
      <div class="review-stars">★★★★★</div>
      <p class="review-text">${r.text}</p>
      <div class="reviewer">
        <div class="rv-avatar">${r.initials}</div>
        <div>
          <div class="rv-name">${r.name}</div>
          <div class="rv-meta">${r.meta}</div>
        </div>
      </div>
    </div>
  `).join('');
  // Re-observe new elements
  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

renderReviews();
