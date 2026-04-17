// =====================================================
// English Practice App — Main Logic
// =====================================================

const App = (() => {
  'use strict';

  // ── Config ──
  const PRACTICE_Q_COUNT = 5;
  const CUSTOM_LESSONS_KEY = 'eng_custom_lessons_v1';
  const ENG_SYNC_KEY = 'eng_sync_config_v1';
  const JSONBIN_BASE = 'https://api.jsonbin.io/v3';

  // ── Custom Lessons ──
  function loadCustomLessons() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_LESSONS_KEY) || '[]'); } catch { return []; }
  }

  function saveCustomLessons(lessons) {
    localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(lessons));
  }

  function getLessons() {
    const custom = loadCustomLessons();
    const all = [...LESSONS_DATA, ...custom];
    return all.sort((a, b) => (a.classDate || '').localeCompare(b.classDate || ''));
  }

  function getLessonById(id) {
    return getLessons().find(l => l.id === id) || null;
  }

  function importLesson(jsonText) {
    let lesson;
    try { lesson = JSON.parse(jsonText.trim()); } catch { throw new Error('JSON 格式有誤，請重新複製'); }
    if (!lesson.id || !lesson.title) throw new Error('缺少必要欄位（id 或 title）');
    const custom = loadCustomLessons();
    const existing = custom.findIndex(l => l.id === lesson.id);
    if (existing >= 0) custom[existing] = lesson;
    else custom.push(lesson);
    saveCustomLessons(custom);
    pushToCloud();
    return lesson;
  }

  function deleteCustomLesson(id) {
    const custom = loadCustomLessons().filter(l => l.id !== id);
    saveCustomLessons(custom);
    pushToCloud();
  }

  // ── Sync (JSONBin) ──
  function loadSyncConfig() {
    try { return JSON.parse(localStorage.getItem(ENG_SYNC_KEY) || '{"apiKey":"","binId":""}'); } catch { return { apiKey: '', binId: '' }; }
  }

  function saveSyncConfig(cfg) {
    localStorage.setItem(ENG_SYNC_KEY, JSON.stringify(cfg));
  }

  function isSyncEnabled() {
    const cfg = loadSyncConfig();
    return !!(cfg.apiKey && cfg.binId);
  }

  let syncStatus = 'idle';

  function setSyncStatus(s) {
    syncStatus = s;
    const el = document.getElementById('eng-sync-dot');
    if (!el) return;
    el.title = s === 'ok' ? '已同步' : s === 'syncing' ? '同步中…' : s === 'error' ? '同步失敗' : '';
    el.textContent = s === 'ok' ? '☁️' : s === 'syncing' ? '⏳' : s === 'error' ? '⚠️' : '';
  }

  function buildCloudPayload() {
    return {
      progress: {
        completedLessons: state.completedLessons,
        practiceHistory: state.practiceHistory,
        streak: state.streak,
        practiceCount: state.practiceCount
      },
      customLessons: loadCustomLessons()
    };
  }

  async function pushToCloud() {
    if (!isSyncEnabled()) return;
    const cfg = loadSyncConfig();
    setSyncStatus('syncing');
    try {
      const res = await fetch(`${JSONBIN_BASE}/b/${cfg.binId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': cfg.apiKey },
        body: JSON.stringify(buildCloudPayload())
      });
      if (!res.ok) throw new Error();
      setSyncStatus('ok');
    } catch { setSyncStatus('error'); }
  }

  async function pullFromCloud() {
    if (!isSyncEnabled()) return false;
    const cfg = loadSyncConfig();
    setSyncStatus('syncing');
    try {
      const res = await fetch(`${JSONBIN_BASE}/b/${cfg.binId}/latest`, {
        headers: { 'X-Master-Key': cfg.apiKey }
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const data = json.record;
      if (!data) throw new Error();
      if (data.progress) {
        state.completedLessons = data.progress.completedLessons || [];
        state.practiceHistory  = data.progress.practiceHistory  || [];
        state.streak           = data.progress.streak           || { count: 0, lastDate: '' };
        state.practiceCount    = data.progress.practiceCount    || 0;
        saveState();
      }
      if (Array.isArray(data.customLessons)) {
        saveCustomLessons(data.customLessons);
      }
      setSyncStatus('ok');
      return true;
    } catch { setSyncStatus('error'); return false; }
  }

  async function createSyncBin(apiKey) {
    const res = await fetch(`${JSONBIN_BASE}/b`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey,
        'X-Bin-Name': 'English Practice',
        'X-Bin-Private': 'true'
      },
      body: JSON.stringify(buildCloudPayload())
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || '建立失敗，請確認 API Key');
    }
    const json = await res.json();
    return json.metadata.id;
  }

  async function setupSync(apiKey, binId) {
    if (binId) {
      const res = await fetch(`${JSONBIN_BASE}/b/${binId}/latest`, {
        headers: { 'X-Master-Key': apiKey }
      });
      if (!res.ok) throw new Error('找不到這個 Sync Code');
      saveSyncConfig({ apiKey, binId });
      await pullFromCloud();
    } else {
      const newBinId = await createSyncBin(apiKey);
      saveSyncConfig({ apiKey, binId: newBinId });
    }
  }

  async function handleSyncSetup() {
    const apiKey = document.getElementById('eng-sync-api-key').value.trim();
    const binId  = document.getElementById('eng-sync-bin-id').value.trim();
    const btn    = document.getElementById('eng-sync-btn');
    const msg    = document.getElementById('eng-sync-msg');
    if (!apiKey) { msg.textContent = '請輸入 API Key'; return; }
    btn.disabled = true; btn.textContent = '處理中…'; msg.textContent = '';
    try {
      await setupSync(apiKey, binId);
      showNotifBanner('✅ 同步已啟用！');
      renderSettings();
    } catch(e) {
      msg.textContent = e.message || '發生錯誤';
      btn.disabled = false; btn.textContent = '啟用同步';
    }
  }

  function disableSync() {
    if (!confirm('確定要關閉同步嗎？')) return;
    saveSyncConfig({ apiKey: '', binId: '' });
    setSyncStatus('idle');
    renderSettings();
  }

  async function manualSync() {
    await pushToCloud();
    await pullFromCloud();
    renderHome();
    renderSettings();
    showNotifBanner('同步完成');
  }

  async function handleImportLesson() {
    const txt = document.getElementById('import-lesson-input').value.trim();
    const msg = document.getElementById('import-lesson-msg');
    if (!txt) { msg.textContent = '請貼上課程 JSON'; return; }
    try {
      const lesson = importLesson(txt);
      msg.style.color = 'green';
      msg.textContent = `✅ 已匯入：${lesson.title}`;
      document.getElementById('import-lesson-input').value = '';
      renderHome();
    } catch(e) {
      msg.style.color = 'red';
      msg.textContent = e.message;
    }
  }

  // ── State ──
  let state = {
    screen: 'loading',
    completedLessons: [],   // lesson IDs
    practiceHistory: [],    // [{ date, correct, total }]
    streak: { count: 0, lastDate: '' },
    practiceCount: 0,
    notificationsOn: false,
    currentLesson: null,    // lesson object being previewed
    session: null,          // current practice session
    test: null              // current test state
  };

  // ── DOM helpers ──
  const $ = id => document.getElementById(id);
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  };

  // ── Init ──
  function init() {
    loadState();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
    renderHome();
    showScreen('home');
    pullFromCloud().then(synced => {
      if (synced) renderHome();
    }).catch(() => {});
  }

  // ── Persistence ──
  function loadState() {
    try {
      state.completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
      state.practiceHistory  = JSON.parse(localStorage.getItem('practiceHistory') || '[]');
      state.streak           = JSON.parse(localStorage.getItem('streak') || '{"count":0,"lastDate":""}');
      state.practiceCount    = parseInt(localStorage.getItem('practiceCount') || '0');
      state.notificationsOn  = localStorage.getItem('notificationsOn') === 'true';
    } catch(e) {}
  }

  function saveState() {
    localStorage.setItem('completedLessons', JSON.stringify(state.completedLessons));
    localStorage.setItem('practiceHistory',  JSON.stringify(state.practiceHistory));
    localStorage.setItem('streak',           JSON.stringify(state.streak));
    localStorage.setItem('practiceCount',    String(state.practiceCount));
    localStorage.setItem('notificationsOn',  String(state.notificationsOn));
    pushToCloud();
  }

  // ── Screen navigation ──
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
    });
    const target = $('screen-' + id);
    if (target) {
      target.classList.add('active');
      state.screen = id;
    }
  }

  function navTo(dest) {
    // Update bottom nav active state
    ['home','lessons','test','settings'].forEach(d => {
      const btn  = $('nav-' + d);
      const btnS = $('nav-' + d + '-s');
      if (btn)  btn.classList.toggle('active', d === dest);
      if (btnS) btnS.classList.toggle('active', d === dest);
    });

    if (dest === 'home')     { renderHome(); showScreen('home'); }
    else if (dest === 'lessons') { openFirstLesson(); }
    else if (dest === 'test')    { goToTest(); }
    else if (dest === 'settings') { renderSettings(); showScreen('settings'); }
  }

  function openFirstLesson() {
    const lesson = getLessons()[0];
    if (lesson) openLessonPreview(lesson);
  }

  // ── Date / Schedule helpers ──
  function todayStr() {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }

  function dayOfWeek() { return new Date().getDay(); } // 0=Sun…6=Sat

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['日','一','二','三','四','五','六'];
    return `${d.getMonth()+1}/${d.getDate()} (週${days[d.getDay()]})`;
  }

  function getTodayMode() {
    const day = dayOfWeek();
    switch(day) {
      case 1: return { mode:'preview',  label:'預習日', title:'預習下一堂課', desc:'明天是週二課程日，今天先預習語錄和俚語，上課效果更好！', emoji:'📖' };
      case 2: return { mode:'class',    label:'上課日', title:'今天上課！', desc:'今天是週二，上完課記得明天回來做複習練習。', emoji:'🎓' };
      case 3: return { mode:'both',     label:'複習 + 預習', title:'複習 & 預習', desc:'今天先複習週二的內容，再預習週四的課程！', emoji:'📝' };
      case 4: return { mode:'class',    label:'上課日', title:'今天上課！', desc:'今天是週四，上完課記得週五回來做複習練習。', emoji:'🎓' };
      case 5: return { mode:'review',   label:'複習日', title:'混合複習', desc:'綜合所有上過的課程，加深記憶效果最好！', emoji:'🔄' };
      case 6: return { mode:'free',     label:'自由練習', title:'週末練習', desc:'利用零碎時間複習，保持英文語感。', emoji:'☀️' };
      default: return { mode:'free',   label:'自由練習', title:'隨時練習', desc:'今天是週日，做幾題熱個身！', emoji:'🌟' };
    }
  }

  function isLastWeekendOfMonth() {
    const today = new Date();
    const day = today.getDay();
    if (day !== 0 && day !== 6) return false;
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return nextWeek.getMonth() !== today.getMonth();
  }

  function practicedToday() {
    return state.practiceHistory.some(h => h.date === todayStr());
  }

  // ── Streak ──
  function updateStreak(didPractice = true) {
    if (!didPractice) return;
    const today = todayStr();
    if (state.streak.lastDate === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    state.streak.count = (state.streak.lastDate === yStr) ? state.streak.count + 1 : 1;
    state.streak.lastDate = today;
    saveState();
  }

  // ── Home Screen ──
  function renderHome() {
    const modeInfo = getTodayMode();
    const today = new Date();
    const days = ['週日','週一','週二','週三','週四','週五','週六'];
    $('home-date').textContent = `${today.getMonth()+1}/${today.getDate()} ${days[today.getDay()]}`;

    $('mode-label').textContent = modeInfo.label;
    $('mode-title').textContent = modeInfo.emoji + ' ' + modeInfo.title;
    $('mode-desc').textContent  = modeInfo.desc;

    $('streak-count').textContent   = state.streak.count;
    $('lessons-count').textContent  = state.completedLessons.length;
    $('practice-count').textContent = state.practiceCount;

    $('reminder-banner').classList.toggle('hidden', practicedToday());
    $('test-banner').classList.toggle('hidden', !isLastWeekendOfMonth());

    renderLessonList();
  }

  function renderLessonList() {
    const container = $('lesson-list');
    container.innerHTML = '';

    getLessons().forEach(lesson => {
      const isCompleted = state.completedLessons.includes(lesson.id);
      const classDate   = new Date(lesson.classDate + 'T00:00:00');
      const today       = new Date();
      today.setHours(0,0,0,0);
      const isUpcoming  = classDate >= today;

      const item = document.createElement('div');
      item.className = 'lesson-item';
      item.innerHTML = `
        <div class="lesson-item-header">
          <div class="lesson-num ${isCompleted ? 'completed' : ''}">${isCompleted ? '✓' : lesson.lessonNumber}</div>
          <div class="lesson-info">
            <div class="lesson-title">${lesson.title}</div>
            <div class="lesson-subtitle">${lesson.titleZh} · ${formatDate(lesson.classDate)}</div>
          </div>
          <span class="lesson-badge ${isCompleted ? 'completed' : 'upcoming'}">
            ${isCompleted ? '已完成' : (isUpcoming ? '即將上課' : '待複習')}
          </span>
        </div>
        <div class="lesson-item-actions">
          <button class="btn-outline" onclick="App.openLessonPreview(App.getLessonById('${lesson.id}'))">
            ${isCompleted ? '查看內容' : '預習'}
          </button>
          <button class="btn-primary" onclick="App.startLessonPractice('${lesson.id}')">
            練習
          </button>
        </div>
      `;
      container.appendChild(item);
    });

    if (getLessons().length === 0) {
      container.innerHTML = '<div class="text-muted text-center" style="padding:24px">還沒有課程資料</div>';
    }
  }

  // ── Lesson Preview ──
  function openLessonPreview(lesson) {
    if (!lesson) return;
    state.currentLesson = lesson;

    $('preview-header-title').textContent = `第 ${lesson.lessonNumber} 堂`;
    $('preview-course').textContent       = lesson.courseTitle;
    $('preview-title').textContent        = lesson.title;
    $('preview-subtitle').textContent     = lesson.titleZh;
    $('preview-date').textContent         = `📅 上課日期：${formatDate(lesson.classDate)}`;

    // Tab 0: Overview
    const ovList = $('preview-overview-list');
    ovList.innerHTML = '<div style="padding:0 0 16px">';
    const ul = el('div', 'card', '');
    ul.style.marginBottom = '12px';
    let ovHTML = '<div class="card-body">';
    lesson.overview.forEach((item, i) => {
      ovHTML += `<div class="overview-item"><span>✦</span><span>${item}</span></div>`;
    });
    ovHTML += '</div>';
    ul.innerHTML = ovHTML;
    ovList.innerHTML = '';
    ovList.appendChild(ul);

    // Tab 1: Quotes
    const qList = $('preview-quotes-list');
    qList.innerHTML = '';
    lesson.quotes.forEach(q => {
      const card = el('div', 'quote-card');
      card.innerHTML = `
        <div class="quote-text">"${q.text}"</div>
        <div class="quote-author">— ${q.author} ${mkSpeakBtn(q.text)}</div>
      `;
      qList.appendChild(card);
    });

    // Tab 2: Reading
    const rList = $('preview-reading-list');
    rList.innerHTML = '';
    const rCard = el('div', 'card');
    let rHTML = '';
    lesson.reading.sections.forEach(s => {
      rHTML += `
        <div class="card-body">
          <div style="font-size:14px;font-weight:700;margin-bottom:6px;color:var(--primary-dark)">${s.title}</div>
          <div style="font-size:14px;line-height:1.7;color:var(--text)">${s.content}</div>
        </div>
      `;
    });
    rCard.innerHTML = rHTML;
    rList.appendChild(rCard);

    // Tab 3: Idioms
    const iList = $('preview-idioms-list');
    iList.innerHTML = '';
    lesson.idioms.forEach(idiom => {
      const card = el('div', 'idiom-card');
      card.innerHTML = `
        <div class="idiom-phrase">${idiom.phrase} ${mkSpeakBtn(idiom.phrase)}</div>
        <div class="idiom-meaning">📌 ${idiom.meaning}</div>
        <div class="idiom-example">"${idiom.example}" ${mkSpeakBtn(idiom.example)}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:4px">${idiom.exampleZh}</div>
      `;
      iList.appendChild(card);
    });

    // Tab 4: Discussion
    const dList = $('preview-discussion-list');
    dList.innerHTML = '';
    lesson.discussion.forEach((d, i) => {
      const card = el('div', 'card');
      card.style.marginBottom = '12px';
      card.innerHTML = `
        <div class="card-body">
          <div style="font-size:13px;font-weight:700;color:var(--primary-dark);margin-bottom:6px">討論 ${i+1}</div>
          <div style="font-size:15px;line-height:1.6;margin-bottom:8px">${d.question}</div>
          <div style="font-size:13px;color:var(--muted)">${d.hint}</div>
        </div>
      `;
      dList.appendChild(card);
    });

    // Reset to first tab
    switchTab(0);
    showScreen('preview');
  }

  function switchTab(idx) {
    document.querySelectorAll('.tab-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
    });
    document.querySelectorAll('.tab-panel').forEach((panel, i) => {
      panel.classList.toggle('active', i === idx);
    });
  }

  // ── Exercise Generation ──
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getAllAuthors(lessons) {
    const authors = new Set();
    lessons.forEach(l => l.quotes.forEach(q => authors.add(q.author)));
    return [...authors];
  }

  function buildExercisePool(lessons) {
    const pool = [];
    const allAuthors = getAllAuthors(lessons);

    lessons.forEach(lesson => {
      // Idiom fill-in-blank
      lesson.idiomExercises.forEach(ex => {
        pool.push({
          type: 'idiom-fill',
          typeLabel: '俚語',
          typeEmoji: '🗣️',
          lessonId: lesson.id,
          question: ex.sentence,
          answer: ex.answer,
          options: shuffle(ex.options),
          speakText: ex.sentence
        });
      });

      // Quote author matching
      lesson.quotes.forEach(q => {
        const others = allAuthors.filter(a => a !== q.author);
        const distractors = shuffle(others).slice(0, 3);
        pool.push({
          type: 'quote-author',
          typeLabel: '語錄',
          typeEmoji: '💬',
          lessonId: lesson.id,
          question: `誰說了這句話？\n\n"${q.shortText}"`,
          answer: q.author,
          options: shuffle([q.author, ...distractors]),
          speakText: q.shortText
        });
      });

      // Reading comprehension
      lesson.comprehension.forEach(c => {
        pool.push({
          type: 'comprehension',
          typeLabel: '閱讀理解',
          typeEmoji: '📖',
          lessonId: lesson.id,
          question: c.question,
          answer: c.answer,
          options: shuffle(c.options),
          explanation: c.explanation
        });
      });

      // Vocabulary
      const vocabPool = shuffle(lesson.vocabulary);
      vocabPool.slice(0, 4).forEach(v => {
        const others = lesson.vocabulary.filter(x => x.word !== v.word);
        const distractors = shuffle(others).map(x => x.zh).slice(0, 3);
        pool.push({
          type: 'vocabulary',
          typeLabel: '字彙',
          typeEmoji: '📝',
          lessonId: lesson.id,
          question: `"${v.word}" 是什麼意思？\n\n${v.example}`,
          answer: v.zh,
          options: shuffle([v.zh, ...distractors]),
          speakText: v.word + '. ' + v.example
        });
      });
    });

    return shuffle(pool);
  }

  // ── Flashcard 預習模式 ──
  function buildFlashcards(lesson) {
    const cards = [];

    // 俚語卡（最重要，放最前面）
    lesson.idioms.forEach(idiom => {
      cards.push({
        type: 'idiom',
        typeLabel: '俚語',
        typeEmoji: '🗣️',
        front: idiom.phrase,
        frontHint: '這個俚語是什麼意思？',
        meaning: idiom.meaning,
        englishMeaning: idiom.englishMeaning,
        example: idiom.example,
        exampleZh: idiom.exampleZh
      });
    });

    // 字彙卡
    lesson.vocabulary.slice(0, 5).forEach(v => {
      cards.push({
        type: 'vocab',
        typeLabel: '字彙',
        typeEmoji: '📝',
        front: v.word,
        frontHint: '這個單字的中文意思是？',
        meaning: v.zh,
        englishMeaning: v.definition,
        example: v.example,
        exampleZh: ''
      });
    });

    // 語錄卡（只要讀，不需要翻轉）
    lesson.quotes.slice(0, 4).forEach(q => {
      cards.push({
        type: 'quote',
        typeLabel: '語錄',
        typeEmoji: '💬',
        readOnly: true,
        quoteText: q.text,
        author: q.author
      });
    });

    return cards;
  }

  function startFlashcards(lesson) {
    const cards = buildFlashcards(lesson);
    state.flashcard = {
      lesson,
      cards,
      index: 0,
      knewCount: 0,
      revealed: false
    };
    renderFlashcard();
    showScreen('flashcard');
  }

  function renderFlashcard() {
    const fc    = state.flashcard;
    const card  = fc.cards[fc.index];
    const total = fc.cards.length;
    const idx   = fc.index;

    $('fc-counter').textContent = `${idx + 1} / ${total}`;

    const body      = $('fc-body');
    const actionBtn = $('fc-action-btn');
    body.innerHTML  = '';
    fc.revealed     = false;

    // Type tag
    const tag = el('div', '');
    tag.innerHTML = `<span class="fc-type-tag">${card.typeEmoji} ${card.typeLabel}</span>`;
    body.appendChild(tag);

    if (card.readOnly) {
      // 語錄：直接顯示，無需翻轉
      const qCard = el('div', 'fc-quote-card');
      qCard.innerHTML = `
        <div class="fc-quote-text">"${card.quoteText}"</div>
        <div class="fc-quote-author">— ${card.author}</div>
      `;
      body.appendChild(qCard);

      const readNote = el('div', 'text-muted text-center');
      readNote.style.fontSize = '13px';
      readNote.textContent = '讀一讀，記一下這句話的感覺';
      body.appendChild(readNote);

      actionBtn.textContent = idx < total - 1 ? '下一張 →' : '完成預習 ✓';
      actionBtn.className = 'btn-full';
      actionBtn.onclick = () => nextFlashcard(true);

    } else {
      // 一般卡片：正面 + 翻轉
      const fcCard = el('div', 'fc-card');
      fcCard.id = 'fc-card-main';
      fcCard.innerHTML = `
        <div class="fc-front">
          <div class="fc-front-word">${card.front} ${mkSpeakBtn(card.front)}</div>
          <div class="fc-front-hint">${card.frontHint}</div>
        </div>
        <div class="fc-back" id="fc-back-area">
          <div class="fc-meaning">${card.meaning}</div>
          <div class="fc-definition">${card.englishMeaning}</div>
          <div class="fc-example-box">
            <div class="fc-example-en">"${card.example}" ${mkSpeakBtn(card.example)}</div>
            ${card.exampleZh ? `<div class="fc-example-zh">${card.exampleZh}</div>` : ''}
          </div>
          <div class="fc-selfcheck" id="fc-selfcheck">
            <button class="fc-btn-again" onclick="App.flashcardAgain()">再看一次 🔁</button>
            <button class="fc-btn-knew"  onclick="App.flashcardKnew()">知道了 ✓</button>
          </div>
        </div>
      `;
      body.appendChild(fcCard);

      actionBtn.textContent = '翻轉看答案 ↓';
      actionBtn.className = 'btn-full';
      actionBtn.onclick = revealFlashcard;
    }
  }

  function revealFlashcard() {
    const fc = state.flashcard;
    fc.revealed = true;

    $('fc-back-area').classList.add('revealed');
    $('fc-selfcheck').classList.add('show');

    const actionBtn = $('fc-action-btn');
    actionBtn.textContent = '跳過，下一張 →';
    actionBtn.onclick = () => nextFlashcard(false);
  }

  function flashcardKnew() {
    state.flashcard.knewCount++;
    nextFlashcard(true);
  }

  function flashcardAgain() {
    // 把這張卡推到最後面再出現
    const fc = state.flashcard;
    const current = fc.cards[fc.index];
    fc.cards.push({ ...current });
    nextFlashcard(false);
  }

  function nextFlashcard(knew) {
    const fc = state.flashcard;
    fc.index++;

    if (fc.index >= fc.cards.length) {
      showFlashcardSummary();
    } else {
      renderFlashcard();
    }
  }

  function showFlashcardSummary() {
    const fc    = state.flashcard;
    const body  = $('fc-body');
    const total = fc.cards.filter(c => !c.readOnly).length;

    $('fc-counter').textContent = '完成！';
    body.innerHTML = '';

    const summary = el('div', 'fc-progress-summary');
    summary.innerHTML = `
      <div style="font-size:48px;margin-bottom:8px">${fc.knewCount >= total * 0.8 ? '🎉' : '📖'}</div>
      <div class="fc-progress-title">預習完成！</div>
      <div class="fc-progress-sub">
        ${total} 個俚語＆單字中，你記住了 ${fc.knewCount} 個。<br>
        上完課之後，再來做複習練習會更有效果！
      </div>
      <div style="background:var(--primary-light);border-radius:8px;padding:12px;font-size:13px;color:#7A4000;text-align:left;margin-top:8px">
        💡 上課時留意老師怎麼用這些俚語，<br>有印象才能真正記住！
      </div>
    `;
    body.appendChild(summary);

    const actionBtn = $('fc-action-btn');
    actionBtn.textContent = '回首頁';
    actionBtn.className = 'btn-full';
    actionBtn.onclick = () => { showScreen('home'); renderHome(); };
  }

  function exitFlashcard() {
    showScreen('home');
    renderHome();
  }

  // ── Practice Session ──
  function startTodayPractice() {
    const mode = getTodayMode().mode;
    let exercises;

    if (mode === 'preview' || mode === 'class') {
      // 預習日或上課日：進入翻卡片預習模式
      const next = getLessons().find(l => !state.completedLessons.includes(l.id));
      if (!next) { startReviewPractice(); return; }
      startFlashcards(next);
      return;
    } else {
      startReviewPractice();
      return;
    }

    beginSession(exercises, 'daily');
  }

  function startReviewPractice() {
    const completed = getLessons().filter(l => state.completedLessons.includes(l.id));
    const source = completed.length > 0 ? completed : getLessons();
    const pool = buildExercisePool(source);
    beginSession(pool.slice(0, PRACTICE_Q_COUNT), 'review');
  }

  function startLessonPractice(lessonId) {
    const lesson = getLessonById(lessonId);
    if (!lesson) return;
    const pool = buildExercisePool([lesson]);
    beginSession(pool.slice(0, PRACTICE_Q_COUNT), 'lesson', lessonId);
  }

  function startPreviewPractice() {
    const lesson = state.currentLesson;
    if (!lesson) return;
    startFlashcards(lesson);
  }

  function beginSession(exercises, type, lessonId = null) {
    state.session = {
      exercises,
      type,
      lessonId,
      currentIndex: 0,
      correct: 0,
      answers: [],
      selectedOption: null,
      confirmed: false
    };
    renderPracticeQuestion();
    showScreen('practice');
  }

  function renderPracticeQuestion() {
    const sess = state.session;
    const q    = sess.exercises[sess.currentIndex];
    const total = sess.exercises.length;
    const idx   = sess.currentIndex;

    // Progress
    $('practice-prog-fill').style.width = `${(idx / total) * 100}%`;
    $('practice-counter').textContent   = `${idx + 1} / ${total}`;

    // Body
    const body = $('practice-body');
    body.innerHTML = '';

    const typeTag = el('div', '');
    typeTag.innerHTML = `<span class="exercise-type-tag">${q.typeEmoji} ${q.typeLabel}</span>`;
    body.appendChild(typeTag);

    const qCard = el('div', 'question-card');
    qCard.textContent = q.question;
    qCard.style.whiteSpace = 'pre-line';
    body.appendChild(qCard);

    if (q.speakText) {
      const spkBtn = el('button', 'speak-btn-row');
      spkBtn.innerHTML = '🔊 聆聽發音';
      spkBtn.onclick = () => speakWord(q.speakText);
      body.appendChild(spkBtn);
    }

    const optList = el('div', 'options-list');
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, i) => {
      const btn = el('button', 'option-btn');
      btn.dataset.value = opt;
      btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${opt}</span>`;
      btn.onclick = () => selectOption(opt);
      optList.appendChild(btn);
    });

    body.appendChild(optList);

    // Feedback placeholder
    const fb = el('div', 'feedback-box', '');
    fb.id = 'feedback-box';
    body.appendChild(fb);

    // Reset submit
    const submitBtn = $('practice-submit-btn');
    submitBtn.textContent = '確認答案';
    submitBtn.disabled = true;
    submitBtn.onclick = submitAnswer;
    submitBtn.classList.remove('btn-success');

    sess.selectedOption = null;
    sess.confirmed = false;
  }

  function selectOption(value) {
    if (state.session.confirmed) return;
    state.session.selectedOption = value;

    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.value === value);
    });

    $('practice-submit-btn').disabled = false;
  }

  function submitAnswer() {
    const sess = state.session;
    if (!sess.selectedOption || sess.confirmed) return;

    const q        = sess.exercises[sess.currentIndex];
    const isCorrect = sess.selectedOption === q.answer;
    sess.confirmed  = true;
    if (isCorrect) sess.correct++;

    sess.answers.push({
      question: q.question,
      selected: sess.selectedOption,
      answer: q.answer,
      correct: isCorrect,
      type: q.typeLabel,
      explanation: q.explanation || ''
    });

    // Update option styles
    document.querySelectorAll('.option-btn').forEach(btn => {
      const val = btn.dataset.value;
      btn.classList.remove('selected');
      if (val === q.answer) btn.classList.add('correct');
      else if (val === sess.selectedOption && !isCorrect) btn.classList.add('wrong');
    });

    // Show feedback
    const fb = $('feedback-box');
    if (isCorrect) {
      fb.className = 'feedback-box correct-fb show';
      fb.innerHTML = `<div class="fb-title">✅ 答對了！</div>${q.explanation || '繼續保持！'}`;
    } else {
      fb.className = 'feedback-box wrong-fb show';
      fb.innerHTML = `<div class="fb-title">❌ 答錯了</div>正確答案是：<span class="fb-answer">${q.answer}</span>${q.explanation ? '<br><small>' + q.explanation + '</small>' : ''}`;
    }

    // Scroll to show feedback
    setTimeout(() => { fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);

    // Change button
    const submitBtn = $('practice-submit-btn');
    const isLast    = sess.currentIndex === sess.exercises.length - 1;

    if (isLast) {
      submitBtn.textContent = '查看結果';
      submitBtn.classList.add('btn-success');
      submitBtn.onclick = finishSession;
    } else {
      submitBtn.textContent = '下一題 →';
      submitBtn.onclick = nextQuestion;
    }
    submitBtn.disabled = false;
  }

  function nextQuestion() {
    state.session.currentIndex++;
    state.session.confirmed = false;
    renderPracticeQuestion();
  }

  function finishSession() {
    const sess = state.session;

    // Update state
    state.practiceCount++;
    updateStreak(true);
    state.practiceHistory.push({
      date: todayStr(),
      correct: sess.correct,
      total: sess.exercises.length,
      type: sess.type
    });

    // Mark lesson as completed if lesson practice
    if (sess.type === 'lesson' && sess.lessonId && !state.completedLessons.includes(sess.lessonId)) {
      state.completedLessons.push(sess.lessonId);
    }

    saveState();
    renderResults(sess);
    showScreen('results');
  }

  function renderResults(sess) {
    const pct   = Math.round((sess.correct / sess.exercises.length) * 100);
    const score = sess.correct;
    const total = sess.exercises.length;

    let emoji, title;
    if (pct === 100)       { emoji = '🏆'; title = '完美！全對！'; }
    else if (pct >= 80)    { emoji = '🎉'; title = '做得很好！'; }
    else if (pct >= 60)    { emoji = '👍'; title = '繼續加油！'; }
    else                   { emoji = '💪'; title = '下次會更好的！'; }

    $('results-emoji').textContent    = emoji;
    $('results-title').textContent    = title;
    $('results-subtitle').textContent = `答對 ${score} / ${total} 題 (${pct}%)`;
    $('score-num').textContent        = score;
    $('score-denom').textContent      = `/ ${total}`;
    $('score-ring').style.setProperty('--score', pct);

    const reviewEl = $('review-items');
    reviewEl.innerHTML = '';

    sess.answers.forEach((a, i) => {
      const item = el('div', 'review-item');
      const shortQ = a.question.split('\n')[0].substring(0, 60) + (a.question.length > 60 ? '…' : '');
      item.innerHTML = `
        <span class="ri-icon">${a.correct ? '✅' : '❌'}</span>
        <div>
          <div class="ri-text">${shortQ}</div>
          ${!a.correct ? `<div class="ri-answer">正確答案：${a.answer}</div>` : ''}
        </div>
      `;
      reviewEl.appendChild(item);
    });
  }

  function exitPractice() {
    if (confirm('確定要結束練習嗎？')) {
      showScreen('home');
    }
  }

  // ── Monthly Test ──
  function goToTest() {
    const allLessons = getLessons();
    const testContent = $('test-content');
    testContent.innerHTML = '';

    // Header
    const header = el('div', 'test-header-card');
    const month = new Date().getMonth() + 1;
    header.innerHTML = `
      <div class="test-title">📋 ${month} 月小考</div>
      <div class="test-subtitle">聽說讀寫全面測驗 · 約 15 分鐘</div>
    `;
    testContent.appendChild(header);

    // Sections overview
    const sections = el('div', 'test-sections');
    const sectionDefs = [
      { icon: '🎧', name: '聽力 Listening', desc: '聆聽段落，回答問題', pts: '25 分' },
      { icon: '📖', name: '閱讀 Reading',   desc: '閱讀理解選擇題',   pts: '25 分' },
      { icon: '✏️', name: '寫作 Writing',   desc: '用俚語完成句子',   pts: '25 分' },
      { icon: '🗣️', name: '口說 Speaking',  desc: '討論問題，自我評分', pts: '25 分' }
    ];

    sectionDefs.forEach(s => {
      const card = el('div', 'test-section-card');
      card.innerHTML = `
        <div class="test-section-icon">${s.icon}</div>
        <div style="flex:1">
          <div class="test-section-name">${s.name}</div>
          <div class="test-section-desc">${s.desc}</div>
        </div>
        <div class="test-section-points">${s.pts}</div>
      `;
      sections.appendChild(card);
    });

    testContent.appendChild(sections);

    const startBtn = el('button', 'test-start-btn');
    startBtn.textContent = '開始月考';
    startBtn.style.marginBottom = '24px';
    startBtn.onclick = () => runTest(allLessons);
    testContent.appendChild(startBtn);

    showScreen('test');
  }

  function runTest(lessons) {
    const pool = buildExercisePool(lessons);
    state.test = {
      sections: {
        listening: { questions: buildListeningTest(lessons), score: 0, done: false },
        reading:   { questions: pool.filter(q => q.type === 'comprehension').slice(0, 4), score: 0, done: false },
        writing:   { questions: buildWritingTest(lessons), score: 0, done: false },
        speaking:  { questions: buildSpeakingTest(lessons), score: 0, done: false }
      },
      currentSection: 'listening',
      totalScore: 0
    };
    renderTestSection('listening');
  }

  function buildListeningTest(lessons) {
    const lesson = lessons[0];
    const passage = lesson.reading.sections[0];
    return [{
      passageTitle: passage.title,
      passageText: passage.content,
      question: 'Where was Elon Musk born?',
      options: ['United States', 'South Africa', 'Canada', 'United Kingdom'],
      answer: 'South Africa'
    }, {
      passageTitle: passage.title,
      passageText: passage.content,
      question: 'How long did Musk stay at Stanford University?',
      options: ['Two weeks', 'Two months', 'Two days', 'Two years'],
      answer: 'Two days'
    }, {
      passageTitle: 'Founding PayPal',
      passageText: lesson.reading.sections[1].content,
      question: 'How much did eBay pay to acquire PayPal?',
      options: ['$300 million', '$165 million', '$1.5 billion', '$2 billion'],
      answer: '$1.5 billion'
    }];
  }

  function buildWritingTest(lessons) {
    return lessons[0].idiomExercises.slice(0, 3).map(ex => ({
      sentence: ex.sentence,
      answer: ex.answer,
      idiomOptions: lessons[0].idioms.map(i => i.phrase)
    }));
  }

  function buildSpeakingTest(lessons) {
    return shuffle(lessons[0].discussion).slice(0, 2);
  }

  function renderTestSection(sectionName) {
    const testContent = $('test-content');
    const section = state.test.sections[sectionName];
    state.test.currentSection = sectionName;
    testContent.innerHTML = '';

    const sectionTitles = {
      listening: '🎧 聽力 Listening',
      reading:   '📖 閱讀 Reading',
      writing:   '✏️ 寫作 Writing',
      speaking:  '🗣️ 口說 Speaking'
    };

    const header = el('div', 'test-header-card');
    header.innerHTML = `
      <div class="test-title">${sectionTitles[sectionName]}</div>
      <div class="test-subtitle">25 分 · ${section.questions.length} 題</div>
    `;
    testContent.appendChild(header);

    const body = el('div', '');
    body.style.padding = '16px';

    if (sectionName === 'listening') {
      renderListeningSection(body, section);
    } else if (sectionName === 'reading') {
      renderReadingSection(body, section);
    } else if (sectionName === 'writing') {
      renderWritingSection(body, section);
    } else if (sectionName === 'speaking') {
      renderSpeakingSection(body, section);
    }

    testContent.appendChild(body);
  }

  function renderListeningSection(container, section) {
    let currentQ = 0;
    let score = 0;
    let answered = new Array(section.questions.length).fill(null);

    const render = () => {
      container.innerHTML = '';
      const q = section.questions[currentQ];

      // Listen button
      const listenCard = el('div', 'card');
      listenCard.style.marginBottom = '16px';
      listenCard.innerHTML = `
        <div class="card-body">
          <div style="font-size:13px;font-weight:700;color:var(--muted);margin-bottom:8px">段落 ${currentQ + 1}</div>
          <button class="listen-btn" id="listen-btn" onclick="App.speakText(this, '${q.passageText.replace(/'/g,"\\'")}')">
            🎧 播放段落
          </button>
          <div style="font-size:12px;color:var(--muted);margin-top:8px">點擊播放，仔細聆聽後回答問題</div>
        </div>
      `;
      container.appendChild(listenCard);

      // Question
      const qCard = el('div', 'card');
      qCard.style.marginBottom = '16px';
      let optHTML = `<div class="card-body"><div style="font-size:15px;font-weight:600;margin-bottom:14px">${q.question}</div><div class="options-list" id="listen-opts">`;
      const letters = ['A','B','C','D'];
      q.options.forEach((opt, i) => {
        const sel = answered[currentQ] === opt;
        const correct = answered[currentQ] !== null && opt === q.answer;
        const wrong   = answered[currentQ] === opt && opt !== q.answer;
        optHTML += `<button class="option-btn ${sel?'selected':''} ${correct?'correct':''} ${wrong?'wrong':''}"
          data-value="${opt}" onclick="App._listenSelect(this, '${opt}', '${q.answer}', ${score}, ${currentQ})">
          <span class="option-letter">${letters[i]}</span><span>${opt}</span>
        </button>`;
      });
      optHTML += '</div></div>';
      qCard.innerHTML = optHTML;
      container.appendChild(qCard);

      // Nav buttons
      const nav = el('div', '');
      nav.style.display = 'flex';
      nav.style.gap = '10px';

      if (currentQ < section.questions.length - 1) {
        const nextBtn = el('button', 'btn-full');
        nextBtn.textContent = '下一題 →';
        nextBtn.onclick = () => { currentQ++; render(); };
        nav.appendChild(nextBtn);
      } else {
        const doneBtn = el('button', 'btn-full btn-success');
        doneBtn.textContent = '完成聽力 →';
        doneBtn.style.background = 'var(--success)';
        doneBtn.onclick = () => {
          let s = 0;
          answered.forEach((a, i) => { if (a === section.questions[i].answer) s++; });
          section.score = Math.round((s / section.questions.length) * 25);
          section.done = true;
          renderTestSection('reading');
        };
        nav.appendChild(doneBtn);
      }
      container.appendChild(nav);
    };

    // Store for onclick callback
    App._listenSelect = (btn, val, answer, sc, qi) => {
      answered[currentQ] = val;
      render();
    };

    render();
  }

  function renderReadingSection(container, section) {
    let answers = new Array(section.questions.length).fill(null);

    section.questions.forEach((q, qi) => {
      const card = el('div', 'card');
      card.style.marginBottom = '14px';
      const letters = ['A','B','C','D'];
      let html = `<div class="card-body">
        <div style="font-size:13px;font-weight:700;color:var(--muted);margin-bottom:6px">問題 ${qi+1}</div>
        <div style="font-size:15px;font-weight:600;margin-bottom:12px">${q.question}</div>
        <div class="options-list">`;
      q.options.forEach((opt, i) => {
        html += `<button class="option-btn" data-qi="${qi}" data-value="${opt}"
          onclick="App._readSelect(this, ${qi}, '${opt}')">
          <span class="option-letter">${letters[i]}</span><span>${opt}</span>
        </button>`;
      });
      html += '</div></div>';
      card.innerHTML = html;
      container.appendChild(card);
    });

    App._readSelect = (btn, qi, val) => {
      answers[qi] = val;
      const parent = btn.closest('.options-list');
      parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    };

    const doneBtn = el('button', 'btn-full');
    doneBtn.textContent = '完成閱讀 →';
    doneBtn.style.background = 'var(--success)';
    doneBtn.onclick = () => {
      let s = 0;
      answers.forEach((a, i) => { if (a === section.questions[i].answer) s++; });
      section.score = Math.round((s / section.questions.length) * 25);
      section.done = true;
      renderTestSection('writing');
    };
    container.appendChild(doneBtn);
  }

  function renderWritingSection(container, section) {
    const inputs = [];

    section.questions.forEach((q, i) => {
      const card = el('div', 'card');
      card.style.marginBottom = '14px';
      const sentHTML = q.sentence.replace('________', '<span style="font-weight:700;color:var(--primary)">________</span>');
      card.innerHTML = `<div class="card-body">
        <div style="font-size:13px;font-weight:700;color:var(--muted);margin-bottom:6px">填空 ${i+1}</div>
        <div style="font-size:14px;line-height:1.7;margin-bottom:12px">${sentHTML}</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:8px">提示：${q.idiomOptions.join(' / ')}</div>
        <textarea class="writing-input" placeholder="輸入答案..." id="writing-input-${i}"></textarea>
      </div>`;
      container.appendChild(card);
      inputs.push({ id: `writing-input-${i}`, answer: q.answer });
    });

    const doneBtn = el('button', 'btn-full');
    doneBtn.textContent = '完成寫作 →';
    doneBtn.style.background = 'var(--success)';
    doneBtn.onclick = () => {
      let s = 0;
      inputs.forEach(inp => {
        const val = $(inp.id)?.value.trim().toLowerCase();
        if (val && inp.answer.toLowerCase().includes(val)) s++;
      });
      section.score = Math.round((s / inputs.length) * 25);
      section.done = true;
      renderTestSection('speaking');
    };
    container.appendChild(doneBtn);
  }

  function renderSpeakingSection(container, section) {
    section.questions.forEach((q, i) => {
      const card = el('div', 'speaking-card');
      card.style.marginBottom = '14px';
      card.innerHTML = `
        <div style="font-size:13px;font-weight:700;opacity:0.8;margin-bottom:6px">口說 ${i+1}</div>
        <div class="q-text">${q.question}</div>
        <div class="hint">${q.hint}</div>
        <div class="self-assess-row">
          <button class="assess-btn good" onclick="App._speakScore(this, 'good', ${i})">答得好 👍</button>
          <button class="assess-btn ok"   onclick="App._speakScore(this, 'ok', ${i})">還可以 😊</button>
          <button class="assess-btn hard" onclick="App._speakScore(this, 'hard', ${i})">不太會 😓</button>
        </div>
      `;
      container.appendChild(card);
    });

    let speakScores = new Array(section.questions.length).fill(null);
    App._speakScore = (btn, level, idx) => {
      speakScores[idx] = level;
      const row = btn.closest('.self-assess-row');
      row.querySelectorAll('.assess-btn').forEach(b => b.style.opacity = '0.4');
      btn.style.opacity = '1';
      btn.style.transform = 'scale(1.05)';
    };

    const doneBtn = el('button', 'btn-full');
    doneBtn.textContent = '完成口說 · 查看結果 →';
    doneBtn.style.background = '#6C3483';
    doneBtn.onclick = () => {
      const map = { good: 1, ok: 0.6, hard: 0.2 };
      let total = 0;
      speakScores.forEach(s => { total += map[s] || 0; });
      section.score = Math.round((total / section.questions.length) * 25);
      section.done = true;
      finishTest();
    };
    container.appendChild(doneBtn);
  }

  function finishTest() {
    const t = state.test;
    const total = Object.values(t.sections).reduce((sum, s) => sum + s.score, 0);
    t.totalScore = total;

    let emoji, title;
    if (total >= 90)     { emoji = '🏆'; title = '優秀！月考高分！'; }
    else if (total >= 75) { emoji = '🎉'; title = '通過月考！繼續加油！'; }
    else if (total >= 60) { emoji = '💪'; title = '月考完成，下個月再努力！'; }
    else                  { emoji = '📖'; title = '多複習，下次會更好！'; }

    $('test-result-emoji').textContent = emoji;
    $('test-result-title').textContent = title;
    $('test-score-num').textContent    = total;
    $('test-score-ring').style.setProperty('--score', total);

    const breakdown = $('test-section-breakdown');
    breakdown.innerHTML = '';
    const sectionInfo = {
      listening: '🎧 聽力',
      reading:   '📖 閱讀',
      writing:   '✏️ 寫作',
      speaking:  '🗣️ 口說'
    };

    Object.entries(t.sections).forEach(([key, s]) => {
      const item = el('div', 'review-item');
      item.innerHTML = `
        <span class="ri-icon">${s.score >= 18 ? '✅' : '📌'}</span>
        <div class="ri-text">${sectionInfo[key]}</div>
        <div style="font-weight:700;color:var(--primary)">${s.score} / 25</div>
      `;
      breakdown.appendChild(item);
    });

    showScreen('test-results');
  }

  // ── TTS (Text-to-Speech) ──
  function speakText(btn, text) {
    if (!('speechSynthesis' in window)) {
      showNotifBanner('你的瀏覽器不支援語音播放，請升級至最新版本。');
      return;
    }

    window.speechSynthesis.cancel();

    if (btn.classList.contains('playing')) {
      btn.classList.remove('playing');
      btn.textContent = '🎧 播放段落';
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.88;
    utter.pitch = 1;

    btn.classList.add('playing');
    btn.textContent = '⏹ 停止播放';

    utter.onend = () => {
      btn.classList.remove('playing');
      btn.textContent = '🎧 再次播放';
    };

    window.speechSynthesis.speak(utter);
  }

  // 簡易朗讀（不需要 button 參數）
  function speakWord(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  }

  // 回傳 🔊 按鈕 HTML 字串（供 innerHTML 模板使用）
  function mkSpeakBtn(text) {
    const safe = (text || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    return `<button class="speak-btn" onclick="App.speakWord('${safe}')" title="聆聽發音">🔊</button>`;
  }

  // ── Notifications ──
  async function toggleNotifications() {
    if (state.notificationsOn) {
      state.notificationsOn = false;
      saveState();
      renderSettings();
      return;
    }

    if (!('Notification' in window)) {
      showNotifBanner('你的瀏覽器不支援通知功能。');
      return;
    }

    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      state.notificationsOn = true;
      saveState();
      scheduleNotification();
      renderSettings();
      showNotifBanner('通知已開啟！記得把 App 加入主畫面以確保收到提醒。');
    } else {
      showNotifBanner('通知權限被拒絕。請在手機設定中允許此網站發送通知。');
    }
  }

  function scheduleNotification() {
    if (!state.notificationsOn) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const day = dayOfWeek();
    const now = new Date();
    let msg = '';

    if      (day === 1) msg = '📖 早安！今天預習週二課程，開個好頭！';
    else if (day === 3) msg = '📝 早安！今天複習週二 + 預習週四，加油！';
    else if (day === 5) msg = '🔄 早安！週五來複習週四的課吧。';
    else if (day === 6) msg = '☀️ 早安！週末自由練習，保持英文語感！';
    else if (day === 0) msg = '🌟 早安！週日練幾題，明天預習更輕鬆！';

    if (msg && !practicedToday()) {
      const target = new Date(now);
      target.setHours(8, 0, 0, 0);
      const delay = target - now;

      if (delay > 0) {
        setTimeout(() => {
          if (!practicedToday()) {
            new Notification('英文練習提醒', {
              body: msg,
              icon: './icon.svg',
              badge: './icon.svg'
            });
          }
        }, Math.min(delay, 2147483647));
      }
    }
  }

  function showNotifBanner(msg) {
    $('notif-banner-text').textContent = msg;
    $('notif-banner').classList.add('show');
    setTimeout(() => { $('notif-banner').classList.remove('show'); }, 4000);
  }

  function hideNotifBanner() {
    $('notif-banner').classList.remove('show');
  }

  // ── Settings ──
  function renderSettings() {
    const toggle = $('notif-toggle');
    toggle.classList.toggle('on', state.notificationsOn);

    const statusText = $('notif-status-text');
    if (!('Notification' in window)) {
      statusText.textContent = '瀏覽器不支援通知';
    } else if (Notification.permission === 'denied') {
      statusText.textContent = '通知已在系統設定中被封鎖';
    } else {
      statusText.textContent = state.notificationsOn ? '提醒已開啟' : '點擊開啟通知';
    }

    $('completed-lessons-text').textContent = `${state.completedLessons.length} 堂`;

    // Render dynamic sync + import section
    const dynEl = $('settings-dynamic');
    if (!dynEl) return;
    const cfg = loadSyncConfig();
    const synced = isSyncEnabled();

    dynEl.innerHTML = `
      <div class="settings-section mt-8">
        <div class="section-title">☁️ 跨裝置同步</div>
        ${synced ? `
          <div class="settings-card" style="background:#e8f5e9;border-radius:12px;padding:14px 16px;margin-bottom:10px">
            <div style="font-weight:700;font-size:15px;margin-bottom:4px">跨裝置同步已啟用</div>
            <div style="font-size:13px;color:#555">資料會自動在手機和電腦間同步</div>
          </div>
          <div class="settings-card" style="padding:12px 16px;margin-bottom:8px">
            <div style="font-size:13px;font-weight:700;margin-bottom:6px">你的 SYNC CODE</div>
            <div style="font-size:13px;color:#666;margin-bottom:8px">在新裝置上設定同步時，需要輸入這組代碼</div>
            <div style="background:#f5f5f5;border-radius:8px;padding:10px;font-size:13px;word-break:break-all;margin-bottom:8px">${cfg.binId}</div>
            <button class="btn-outline" style="width:100%;margin-bottom:6px" onclick="navigator.clipboard.writeText('${cfg.binId}').then(()=>App.showNotifBanner('已複製'))">複製 Sync Code</button>
            <button class="btn-outline" style="width:100%" onclick="App.manualSync()">立即同步</button>
          </div>
          <button style="width:100%;padding:12px;border:1.5px solid #e53935;border-radius:10px;background:white;color:#e53935;font-size:14px;cursor:pointer" onclick="App.disableSync()">關閉同步</button>
        ` : `
          <div class="settings-card" style="padding:14px 16px">
            <div style="font-size:13px;color:#666;margin-bottom:12px;line-height:1.6">
              啟用後，練習進度和課程資料會自動同步到所有裝置。<br>需要先有 JSONBin API Key（免費）。
            </div>
            <input id="eng-sync-api-key" type="password" placeholder="JSONBin API Key（$2a$...）"
              style="width:100%;padding:10px 12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;box-sizing:border-box;margin-bottom:8px">
            <input id="eng-sync-bin-id" type="text" placeholder="Sync Code（已有帳號的裝置貼上）"
              style="width:100%;padding:10px 12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;box-sizing:border-box;margin-bottom:8px">
            <div id="eng-sync-msg" style="color:red;font-size:13px;min-height:18px;margin-bottom:8px"></div>
            <button id="eng-sync-btn" class="btn-primary" style="width:100%" onclick="App.handleSyncSetup()">啟用同步</button>
          </div>
        `}
      </div>

      <div class="settings-section mt-8">
        <div class="section-title">📚 匯入新課程</div>
        <div class="settings-card" style="padding:14px 16px">
          <div style="font-size:13px;color:#666;margin-bottom:10px;line-height:1.6">
            把 Claude 整理好的課程 JSON 貼在這裡，不需要重新部署 App。
          </div>
          <textarea id="import-lesson-input" rows="6"
            style="width:100%;padding:10px 12px;border:1.5px solid #ddd;border-radius:8px;font-size:13px;box-sizing:border-box;margin-bottom:8px;font-family:monospace"
            placeholder='貼上 Claude 給的課程 JSON，例如：{"id":"b2c-02","title":"..."}'></textarea>
          <div id="import-lesson-msg" style="font-size:13px;min-height:18px;margin-bottom:8px"></div>
          <button class="btn-primary" style="width:100%" onclick="App.handleImportLesson()">匯入課程</button>
        </div>
        ${loadCustomLessons().length > 0 ? `
          <div class="settings-card" style="padding:14px 16px;margin-top:8px">
            <div style="font-size:13px;font-weight:700;margin-bottom:8px">已匯入的課程</div>
            ${loadCustomLessons().map(l => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0">
                <div style="font-size:13px">${l.lessonNumber ? `第 ${l.lessonNumber} 堂 · ` : ''}${l.title}</div>
                <button style="background:none;border:none;color:#e53935;font-size:13px;cursor:pointer" onclick="App.deleteCustomLesson('${l.id}');App.renderSettings()">刪除</button>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  function resetProgress() {
    if (!confirm('確定要重置所有練習進度嗎？這個動作無法復原。')) return;
    state.completedLessons = [];
    state.practiceHistory  = [];
    state.streak           = { count: 0, lastDate: '' };
    state.practiceCount    = 0;
    saveState();
    renderSettings();
    showNotifBanner('進度已重置。');
  }

  // ── DOMContentLoaded ──
  document.addEventListener('DOMContentLoaded', init);

  // ── Public API ──
  return {
    showScreen,
    navTo,
    openLessonPreview,
    switchTab,
    startTodayPractice,
    startPreviewPractice,
    startLessonPractice,
    submitAnswer,
    exitPractice,
    goToTest,
    speakText,
    speakWord,
    toggleNotifications,
    hideNotifBanner,
    resetProgress,
    // Flashcard
    revealFlashcard,
    flashcardKnew,
    flashcardAgain,
    exitFlashcard,
    // Sync & Import
    getLessonById,
    handleSyncSetup,
    disableSync,
    manualSync,
    handleImportLesson,
    deleteCustomLesson,
    renderSettings,
    showNotifBanner,
    _listenSelect: null,
    _readSelect: null,
    _speakScore: null
  };
})();
