// Hana Korean Academy - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScheduleTabs();
  initSoundboard();
  initFAQ();
  initModal();
  initCounterStats();
  initTestimonialFilter();
});

// 1. Sticky Navigation with dynamic glassmorphism
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('bg-white/95', 'shadow-md', 'backdrop-blur-md', 'py-2');
      navbar.classList.remove('bg-transparent', 'py-3.5');
    } else {
      navbar.classList.remove('bg-white/95', 'shadow-md', 'backdrop-blur-md', 'py-2');
      navbar.classList.add('bg-transparent', 'py-3.5');
    }
  });

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on click link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// 2. Schedule & Batches Tabs
function initScheduleTabs() {
  const tabButtons = document.querySelectorAll('[data-schedule-tab]');
  const scheduleCards = document.querySelectorAll('[data-schedule-category]');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetCategory = button.getAttribute('data-schedule-tab');

      // Update button styles
      tabButtons.forEach(btn => {
        btn.classList.remove('bg-brand-red', 'text-white', 'shadow-md');
        btn.classList.add('text-ink-soft', 'hover:text-ink');
      });
      button.classList.add('bg-brand-red', 'text-white', 'shadow-md');
      button.classList.remove('text-ink-soft', 'hover:text-ink');

      // Filter cards
      scheduleCards.forEach(card => {
        const cardCategory = card.getAttribute('data-schedule-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.style.display = 'flex';
          card.classList.add('animate-fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 3. Korean Alphabet Soundboard using Web Speech API + Audio Synthesizer
function initSoundboard() {
  const soundButtons = document.querySelectorAll('.sound-btn');
  
  soundButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const hangulText = btn.getAttribute('data-hangul');
      playSound(hangulText);

      // Visual feedback
      btn.classList.add('playing');
      setTimeout(() => {
        btn.classList.remove('playing');
      }, 500);
    });
  });
}

function playSound(text) {
  if (!text) return;

  // Use SpeechSynthesis if available
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.pitch = 1.0;

    // Check if Korean voice exists
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find(v => v.lang.startsWith('ko'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    window.speechSynthesis.speak(utterance);
  } else {
    // Audio tone fallback
    playWebAudioBeep();
  }
}

function playWebAudioBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch(e) {
    console.log('Audio not supported', e);
  }
}

// 4. FAQ Accordion
function initFAQ() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const header = item.querySelector('.accordion-trigger');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        const trigger = otherItem.querySelector('.accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// 5. Registration Modal & WhatsApp Integration
function initModal() {
  const modal = document.getElementById('enrollment-modal');
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const enrollForm = document.getElementById('enroll-form');
  const successState = document.getElementById('enroll-success');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const defaultBatch = btn.getAttribute('data-batch-preset');
      if (defaultBatch && document.getElementById('form-batch')) {
        document.getElementById('form-batch').value = defaultBatch;
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (successState) successState.classList.add('hidden');
      if (enrollForm) enrollForm.classList.remove('hidden');
    });
  });

  // Close on outer click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Handle Form Submission
  if (enrollForm) {
    enrollForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const district = document.getElementById('form-district').value;
      const batch = document.getElementById('form-batch').value;
      const mode = document.querySelector('input[name="study-mode"]:checked')?.value || 'භෞතික පන්ති (නිකවැරටිය)';

      // Format WhatsApp message
      const text = `ආයුබෝවන් Hana Korean Academy! 🇰🇷\nමම නව පන්තියට ලියාපදිංචි වීමට කැමැත්තෙමි.\n\n👤 නම: ${name}\n📞 දුරකථන: ${phone}\n📍 දිස්ත්‍රික්කය: ${district}\n📚 බඳවාගැනීම: ${batch}\n🏫 පන්ති ක්‍රමය: ${mode}\n\nකරුණාකර පන්ති විස්තර සහ ගෙවීම් තොරතුරු එවන්න.`;
      
      const whatsappUrl = `https://wa.me/+94768031043?text=${encodeURIComponent(text)}`;

      // Show success celebration inside modal
      enrollForm.classList.add('hidden');
      successState.classList.remove('hidden');

      // Open WhatsApp in new tab after 800ms
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 900);
    });
  }
}

// 6. Number Counter Animation for Telemetry
function initCounterStats() {
  const counters = document.querySelectorAll('[data-target]');
  const speed = 60;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const isDecimal = counter.getAttribute('data-decimal') === 'true';

        let count = 0;
        const inc = target / speed;

        const updateCount = () => {
          count += inc;
          if (count < target) {
            counter.innerText = isDecimal ? count.toFixed(1) : Math.ceil(count).toLocaleString();
            setTimeout(updateCount, 25);
          } else {
            counter.innerText = isDecimal ? target.toFixed(1) : target.toLocaleString();
          }
        };

        updateCount();
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// 7. Achievers / Batch Toggle Filter
function initTestimonialFilter() {
  const resultTabs = document.querySelectorAll('[data-results-year]');
  const resultGrids = document.querySelectorAll('[data-results-content]');

  resultTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const year = tab.getAttribute('data-results-year');

      resultTabs.forEach(t => {
        t.classList.remove('bg-brand-red', 'text-white', 'shadow-md');
        t.classList.add('text-ink-soft', 'hover:text-ink');
      });
      tab.classList.add('bg-brand-red', 'text-white', 'shadow-md');
      tab.classList.remove('text-ink-soft', 'hover:text-ink');

      resultGrids.forEach(grid => {
        if (grid.getAttribute('data-results-content') === year) {
          grid.classList.remove('hidden');
          grid.classList.add('flex');
        } else {
          grid.classList.add('hidden');
          grid.classList.remove('flex');
        }
      });
    });
  });
}
