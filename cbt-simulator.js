// Hana Korean Academy - Interactive CBT Exam Simulator

const cbtQuestions = [
  {
    id: 1,
    type: 'reading',
    typeLabel: '읽기 (Reading Comprehension)',
    number: '01',
    instructionSinhala: 'පහත රූපය බලා නිවැරදි වචනය හෝ ප්‍රකාශය තෝරන්න.',
    instructionKorean: '다음 그림을 보고 맞는 단어나 문장을 고르십시오.',
    imageSvg: `
      <svg viewBox="0 0 200 130" class="w-full max-w-[240px] h-auto rounded-xl border border-slate-200 shadow-inner bg-slate-50 mx-auto" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="15" width="150" height="100" rx="8" fill="#1e293b" />
        <rect x="35" y="25" width="130" height="80" rx="4" fill="#334155" />
        <circle cx="100" cy="55" r="18" fill="#d97706" opacity="0.9" />
        <path d="M100 42 L103 52 L113 52 L105 58 L108 68 L100 62 L92 68 L95 58 L87 52 L97 52 Z" fill="#ffffff" />
        <text x="100" y="90" font-family="'Space Grotesk', sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="2">PASSPORT</text>
        <text x="100" y="100" font-family="'Noto Sans KR', sans-serif" font-size="7" fill="#cbd5e1" text-anchor="middle">대한민국 여권</text>
      </svg>
    `,
    options: [
      { id: 1, korean: '통장', sinhala: 'බැංකු පොත (Bankbook)' },
      { id: 2, korean: '신분증', sinhala: 'හැඳුනුම්පත (ID Card)' },
      { id: 3, korean: '여권', sinhala: 'ගමන් බලපත්‍රය (Passport)' },
      { id: 4, korean: '운전면허증', sinhala: 'රියදුරු බලපත්‍රය (Driver\'s License)' }
    ],
    correctAnswer: 3,
    explanation: 'නිවැරදි පිළිතුර: <b>③ 여권 (Passport - ගමන් බලපත්‍රය)</b>.<br>විදේශගත වීමේදී භාවිත කරන නිල අනන්‍යතා ලියවිල්ල 여권 (යෝ-ග්වොන්) ලෙස හඳුන්වයි. 통장 යනු බැංකු පොත වන අතර 신분증 යනු සාමාන්‍ය හැඳුනුම්පතයි.'
  },
  {
    id: 2,
    type: 'listening',
    typeLabel: '듣기 (Listening Audio Test)',
    number: '02',
    instructionSinhala: 'ශ්‍රවණය කළ වචනයට අදාළ නිවැරදි පිළිතුර තෝරන්න.',
    instructionKorean: '잘 듣고 들은 것을 고르십시오.',
    audioText: '공장',
    pronunciationHint: 'ශ්‍රවණය කිරීමට පහත Listen බොත්තම ඔබන්න',
    options: [
      { id: 1, korean: '공장', sinhala: 'කර්මාන්තශාලාව (Factory)' },
      { id: 2, korean: '극장', sinhala: 'සිනමාහල (Cinema / Theatre)' },
      { id: 3, korean: '시장', sinhala: 'වෙළඳපොළ (Market)' },
      { id: 4, korean: '식당', sinhala: 'ආපනශාලාව (Restaurant)' }
    ],
    correctAnswer: 1,
    explanation: 'නිවැරදි පිළිතුර: <b>① 공장 (Gong-jang - කර්මාන්තශාලාව / Factory)</b>.<br>කොරියාවේ නිෂ්පාදන අංශයේ (Manufacturing) රැකියා ස්ථානය හඳුන්වන්නේ 공장 නමිනි. 극장 (සිනමාහල) හෝ 식당 (ආපනශාලාව) සමඟ උච්චාරණය පටලවා නොගන්න.'
  }
];

let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval = null;
let secondsRemaining = 120; // 2 minutes for demo

document.addEventListener('DOMContentLoaded', () => {
  initCBT();
});

function initCBT() {
  const container = document.getElementById('cbt-question-container');
  if (!container) return;

  renderQuestion();
  startTimer();

  // Navigation handlers
  const prevBtn = document.getElementById('cbt-prev-btn');
  const nextBtn = document.getElementById('cbt-next-btn');
  const submitBtn = document.getElementById('cbt-submit-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentQuestionIndex < cbtQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      evaluateCurrentAnswer();
    });
  }
}

function startTimer() {
  const timerDisplay = document.getElementById('cbt-timer');
  if (!timerDisplay) return;

  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (secondsRemaining > 0) {
      secondsRemaining--;
      const mins = Math.floor(secondsRemaining / 60);
      const secs = secondsRemaining % 60;
      timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      clearInterval(timerInterval);
      timerDisplay.innerText = "00:00 (Time's Up)";
      evaluateCurrentAnswer();
    }
  }, 1000);
}

function renderQuestion() {
  const q = cbtQuestions[currentQuestionIndex];
  const container = document.getElementById('cbt-question-container');
  const prevBtn = document.getElementById('cbt-prev-btn');
  const nextBtn = document.getElementById('cbt-next-btn');
  const typeBadge = document.getElementById('cbt-type-badge');
  const qNumberDisplay = document.getElementById('cbt-q-number');
  const feedbackBox = document.getElementById('cbt-feedback-box');

  if (feedbackBox) feedbackBox.classList.add('hidden');

  if (typeBadge) typeBadge.innerText = q.typeLabel;
  if (qNumberDisplay) qNumberDisplay.innerText = `Question ${currentQuestionIndex + 1} of ${cbtQuestions.length}`;

  if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
  if (nextBtn) nextBtn.disabled = currentQuestionIndex === cbtQuestions.length - 1;

  let mediaHtml = '';
  if (q.type === 'reading' && q.imageSvg) {
    mediaHtml = `<div class="my-3 text-center">${q.imageSvg}</div>`;
  } else if (q.type === 'listening') {
    mediaHtml = `
      <div class="my-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col items-center justify-center gap-3">
        <button type="button" id="cbt-audio-play-btn" class="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-brand-blue text-white font-semibold text-sm shadow-md hover:bg-blue-800 transition-transform active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          Listen Audio (ශ්‍රවණය කරන්න)
        </button>
        <span class="text-xs text-slate-500 font-mono tracking-wide">Audio Repeat: 2 Times Available</span>
      </div>
    `;
  }

  const selectedAnswer = userAnswers[q.id];

  const optionsHtml = q.options.map(opt => {
    const isChecked = selectedAnswer === opt.id;
    return `
      <label class="cbt-option flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white ${isChecked ? 'selected' : ''}" data-option-id="${opt.id}">
        <input type="radio" name="cbt-answer" value="${opt.id}" ${isChecked ? 'checked' : ''} class="w-4 h-4 text-brand-red focus:ring-brand-red" />
        <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">${opt.id}</span>
        <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 flex-1">
          <span class="font-hangul font-bold text-base text-slate-900">${opt.korean}</span>
          <span class="font-sinhala text-xs text-slate-500">(${opt.sinhala})</span>
        </div>
      </label>
    `;
  }).join('');

  container.innerHTML = `
    <div class="flex flex-col gap-3">
      <div class="border-b border-slate-200 pb-3">
        <h4 class="font-hangul font-bold text-lg text-slate-900 mb-1">${q.instructionKorean}</h4>
        <p class="font-sinhala text-sm text-slate-600">${q.instructionSinhala}</p>
      </div>

      ${mediaHtml}

      <div class="flex flex-col gap-2.5 mt-2">
        ${optionsHtml}
      </div>
    </div>
  `;

  // Option select handler
  const optionLabels = container.querySelectorAll('.cbt-option');
  optionLabels.forEach(label => {
    label.addEventListener('click', () => {
      optionLabels.forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
      const radio = label.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        userAnswers[q.id] = parseInt(radio.value, 10);
      }
    });
  });

  // Audio play handler for listening
  if (q.type === 'listening') {
    const audioBtn = document.getElementById('cbt-audio-play-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        playCBTAudio(q.audioText);
        audioBtn.classList.add('ring-4', 'ring-blue-300');
        setTimeout(() => audioBtn.classList.remove('ring-4', 'ring-blue-300'), 1500);
      });
    }
  }
}

function playCBTAudio(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const koVoice = voices.find(v => v.lang.startsWith('ko'));
    if (koVoice) utterance.voice = koVoice;
    window.speechSynthesis.speak(utterance);
  } else {
    alert(`Audio prompt: "${text}"`);
  }
}

function evaluateCurrentAnswer() {
  const q = cbtQuestions[currentQuestionIndex];
  const selected = userAnswers[q.id];
  const feedbackBox = document.getElementById('cbt-feedback-box');
  const optionLabels = document.querySelectorAll('.cbt-option');

  if (!selected) {
    if (feedbackBox) {
      feedbackBox.className = 'mt-4 p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-sm font-sinhala block';
      feedbackBox.innerHTML = '⚠️ කරුණාකර පිළිතුරක් තෝරන්න.';
    }
    return;
  }

  const isCorrect = selected === q.correctAnswer;

  optionLabels.forEach(lbl => {
    const optId = parseInt(lbl.getAttribute('data-option-id'), 10);
    lbl.classList.remove('selected', 'correct', 'wrong');
    if (optId === q.correctAnswer) {
      lbl.classList.add('correct');
    } else if (optId === selected && !isCorrect) {
      lbl.classList.add('wrong');
    }
  });

  if (feedbackBox) {
    feedbackBox.className = `mt-4 p-4 rounded-2xl border ${isCorrect ? 'border-green-300 bg-green-50/80 text-green-950' : 'border-rose-300 bg-rose-50/80 text-rose-950'} block`;
    feedbackBox.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-xl shrink-0">${isCorrect ? '🎉' : '❌'}</span>
        <div class="flex flex-col gap-1 text-sm font-sinhala">
          <p class="font-bold text-base">${isCorrect ? 'ඉතා විශිෂ්ටයි! ඔබගේ පිළිතුර නිවැරදියි.' : 'පිළිතුර වැරදියි. නිවැරදි පිළිතුර අධ්‍යයනය කරන්න.'}</p>
          <p class="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">${q.explanation}</p>
        </div>
      </div>
    `;
  }
}
