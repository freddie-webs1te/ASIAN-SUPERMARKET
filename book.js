// ── Booking chatbot ──────────────────────────────────
const steps = [
  { field: 'name',   ask: "Hi there! 👋 I\'m the after-hours booking assistant.\n\nThe restaurant may be closed right now, but I\'ll save your booking and the team will confirm it when they open.\n\nWhat\'s your full name?", placeholder: "Your full name" },
  { field: 'phone',  ask: "Great, {name}! What\'s the best number to reach you on?", placeholder: "e.g. 072 123 4567" },
  { field: 'email',  ask: "And your email address?", placeholder: "you@example.com" },
  { field: 'date',   ask: "What date would you like to book?", placeholder: "e.g. 15 April, Saturday", quickReplies: ['Tomorrow', 'This Saturday', 'This Sunday', 'Next Friday'] },
  { field: 'time',   ask: "What time works for you?", placeholder: "e.g. 7:00 PM", quickReplies: ['12:00 PM','1:00 PM','6:00 PM','7:00 PM','7:30 PM'] },
  { field: 'guests', ask: "How many people will be joining you?", placeholder: "e.g. 2", quickReplies: ['1','2','3','4','5','6+'] },
  { field: 'notes',  ask: "Any special requests or dietary requirements? (Type 'none' if not)", placeholder: "e.g. vegetarian, birthday..." },
];

let currentStep = 0;
let booking = {};

function addMsg(text, sender) {
  const msgs = document.getElementById('messages');
  const wrapper = document.createElement('div');
  wrapper.className = `msg ${sender}`;
  if (sender === 'bot') {
    const av = document.createElement('div');
    av.className = 'msg-avatar';
    av.textContent = '🍣';
    wrapper.appendChild(av);
  }
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = text.replace(/\n/g, '<br>');
  wrapper.appendChild(bubble);
  msgs.appendChild(wrapper);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('messages');
  const wrapper = document.createElement('div');
  wrapper.className = 'msg bot';
  wrapper.id = 'typing-indicator';
  const av = document.createElement('div');
  av.className = 'msg-avatar';
  av.textContent = '🍣';
  const t = document.createElement('div');
  t.className = 'typing';
  t.innerHTML = '<span></span><span></span><span></span>';
  wrapper.appendChild(av);
  wrapper.appendChild(t);
  msgs.appendChild(wrapper);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

function setQuickReplies(options) {
  const qr = document.getElementById('quick-replies');
  qr.innerHTML = '';
  if (!options) return;
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'qr-btn';
    btn.textContent = opt;
    btn.onclick = () => {
      document.getElementById('user-input').value = opt;
      handleSend();
    };
    qr.appendChild(btn);
  });
}

function askStep(step) {
  const input = document.getElementById('user-input');
  let text = steps[step].ask.replace('{name}', booking.name || '');
  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMsg(text, 'bot');
      input.placeholder = steps[step].placeholder || 'Type your reply...';
      setQuickReplies(steps[step].quickReplies || null);
      input.focus();
    }, 650);
  }, 300);
}

async function submitBooking() {
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
}

async function showConfirmation() {
  const msgs = document.getElementById('messages');
  setTimeout(() => {
    showTyping();
    setTimeout(async () => {
      removeTyping();
      addMsg(`Perfect! Here's your booking summary:\n\n📅 <strong>${booking.date}</strong> at <strong>${booking.time}</strong>\n👥 <strong>${booking.guests}</strong> guest(s)\n📞 ${booking.phone}\n📧 ${booking.email}${booking.notes && booking.notes.toLowerCase() !== 'none' ? '\n💬 ' + booking.notes : ''}`, 'bot');

      const result = await submitBooking();

      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          removeTyping();
          if (result.success) {
            addMsg(`✅ Your booking has been saved! The team will confirm it when they open.\n\nSee you soon, ${booking.name}! 🍣`, 'bot');
            const banner = document.createElement('div');
            banner.className = 'success-banner';
            banner.textContent = 'Booking received · The restaurant will confirm shortly';
            msgs.appendChild(banner);
          } else {
            addMsg('⚠️ There was an issue saving your booking. Please call us on 044 871 8672 to confirm.', 'bot');
          }
          msgs.scrollTop = msgs.scrollHeight;
          document.getElementById('user-input').disabled = true;
          document.getElementById('send-btn').disabled = true;
          document.getElementById('user-input').placeholder = 'Booking submitted!';
          setQuickReplies(null);
        }, 700);
      }, 1200);
    }, 850);
  }, 400);
}

function handleSend() {
  const input = document.getElementById('user-input');
  const val = input.value.trim();
  if (!val || currentStep >= steps.length) return;
  addMsg(val, 'user');
  input.value = '';
  setQuickReplies(null);
  booking[steps[currentStep].field] = val;
  currentStep++;
  if (currentStep < steps.length) {
    askStep(currentStep);
  } else {
    showConfirmation();
  }
}

document.getElementById('user-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSend();
});
document.getElementById('send-btn').addEventListener('click', handleSend);

// Start
askStep(0);
