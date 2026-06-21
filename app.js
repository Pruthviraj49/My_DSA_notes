// ═══════════════════════════════════════════════════════════
//  DSA Revision Notes — Interactive App
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ─── State ───────────────────────────────────────────────
  let reviewed = JSON.parse(localStorage.getItem('dsa_reviewed') || '{}');
  let activeFilter = 'all';
  let searchQuery = '';

  // ─── DOM refs ────────────────────────────────────────────
  const topicListEl = document.getElementById('topic-list');
  const navEl = document.getElementById('main-nav');
  const container = document.getElementById('questions-container');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const searchInput = document.getElementById('search-input');
  const ringFill = document.getElementById('ring-fill');
  const ringText = document.getElementById('ring-text');

  // ─── Compute topic data ──────────────────────────────────
  const topics = [];
  const topicMap = {};
  ALL_QUESTIONS.forEach(q => {
    if (!topicMap[q.topic]) {
      topicMap[q.topic] = [];
      topics.push(q.topic);
    }
    topicMap[q.topic].push(q);
  });

  // Collect unique patterns
  const allPatterns = new Set();
  ALL_QUESTIONS.forEach(q => allPatterns.add(q.pattern));

  // ─── Stats ───────────────────────────────────────────────
  document.getElementById('stat-topics').textContent = topics.length;
  document.getElementById('stat-questions').textContent = ALL_QUESTIONS.length;
  document.getElementById('stat-patterns').textContent = allPatterns.size;

  // Animate stat numbers
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.textContent);
    let current = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 30);
  });

  // ─── Build sidebar ──────────────────────────────────────
  function buildSidebar() {
    topicListEl.innerHTML = '';
    const allLi = document.createElement('li');
    allLi.className = activeFilter === 'all' ? 'active' : '';
    allLi.innerHTML = `<span class="topic-icon">📋</span>All<span class="topic-count">${ALL_QUESTIONS.length}</span>`;
    allLi.onclick = () => { activeFilter = 'all'; renderAll(); };
    topicListEl.appendChild(allLi);

    topics.forEach(topic => {
      const meta = TOPIC_META[topic] || {icon:'📝',color:'#7c3aed'};
      const li = document.createElement('li');
      li.className = activeFilter === topic ? 'active' : '';
      li.innerHTML = `<span class="topic-icon">${meta.icon}</span>${topic}<span class="topic-count">${topicMap[topic].length}</span>`;
      li.onclick = () => { activeFilter = topic; renderAll(); scrollToTopic(topic); };
      topicListEl.appendChild(li);
    });
  }

  // ─── Build nav buttons ──────────────────────────────────
  function buildNav() {
    navEl.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.className = 'nav-btn' + (activeFilter === 'all' ? ' active' : '');
    allBtn.textContent = `All (${ALL_QUESTIONS.length})`;
    allBtn.onclick = () => { activeFilter = 'all'; renderAll(); };
    navEl.appendChild(allBtn);

    topics.forEach(topic => {
      const btn = document.createElement('button');
      btn.className = 'nav-btn' + (activeFilter === topic ? ' active' : '');
      btn.dataset.filter = topic;
      btn.textContent = `${(TOPIC_META[topic]||{}).icon||''} ${topic}`;
      btn.onclick = () => { activeFilter = topic; renderAll(); scrollToTopic(topic); };
      navEl.appendChild(btn);
    });
  }

  // ─── Filter questions ───────────────────────────────────
  function getFilteredQuestions() {
    let qs = ALL_QUESTIONS;
    if (activeFilter !== 'all') {
      qs = qs.filter(q => q.topic === activeFilter);
    }
    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      qs = qs.filter(q =>
        q.title.toLowerCase().includes(sq) ||
        q.topic.toLowerCase().includes(sq) ||
        q.pattern.toLowerCase().includes(sq) ||
        q.intuition.toLowerCase().includes(sq)
      );
    }
    return qs;
  }

  // ─── Render questions ───────────────────────────────────
  function renderQuestions() {
    const filtered = getFilteredQuestions();
    container.innerHTML = '';

    // Group by topic
    const grouped = {};
    filtered.forEach(q => {
      if (!grouped[q.topic]) grouped[q.topic] = {};
      if (!grouped[q.topic][q.pattern]) grouped[q.topic][q.pattern] = [];
      grouped[q.topic][q.pattern].push(q);
    });

    Object.keys(grouped).forEach((topic, topicIdx) => {
      const meta = TOPIC_META[topic] || {icon:'📝',color:'#7c3aed'};
      const section = document.createElement('div');
      section.className = 'topic-section';
      section.id = 'topic-' + topic.replace(/\s+/g, '-');
      section.style.animationDelay = (topicIdx * 0.1) + 's';

      // Topic header
      const questions = Object.values(grouped[topic]).flat();
      section.innerHTML = `
        <div class="topic-header">
          <span class="topic-emoji">${meta.icon}</span>
          <span class="topic-name">${topic}</span>
          <span class="topic-badge">${questions.length} Questions</span>
        </div>
      `;

      // Pattern groups
      Object.keys(grouped[topic]).forEach(pattern => {
        const patternLabel = document.createElement('div');
        patternLabel.className = 'pattern-label';
        patternLabel.textContent = pattern;
        section.appendChild(patternLabel);

        const grid = document.createElement('div');
        grid.className = 'questions-grid';

        grouped[topic][pattern].forEach((q, qi) => {
          const card = document.createElement('div');
          card.className = 'q-card' + (reviewed[q.id] ? ' reviewed' : '');
          card.style.animationDelay = (qi * 0.05) + 's';
          card.innerHTML = `
            <div class="q-num">Q${q.id} · ${q.topic}</div>
            <div class="q-title">${q.title}</div>
            <span class="q-diff ${q.difficulty}">${q.difficulty}</span>
            <div class="q-tags">
              <span class="q-tag">${q.pattern}</span>
              <span class="q-tag">${q.timeComplexity}</span>
            </div>
          `;
          card.onclick = () => openModal(q);
          grid.appendChild(card);
        });

        section.appendChild(grid);
      });

      container.appendChild(section);
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text3);font-size:18px;">No questions match your search.</div>';
    }
  }

  // ─── Scroll to topic ────────────────────────────────────
  function scrollToTopic(topic) {
    const el = document.getElementById('topic-' + topic.replace(/\s+/g, '-'));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ─── Update progress ring ──────────────────────────────
  function updateProgress() {
    const total = ALL_QUESTIONS.length;
    const done = Object.keys(reviewed).length;
    const pct = Math.round((done / total) * 100);
    const circumference = 2 * Math.PI * 17; // r=17
    ringFill.style.strokeDashoffset = circumference * (1 - done / total);
    ringText.textContent = pct + '%';
  }

  // ─── Escape HTML helper ─────────────────────────────────
  function escapeHtml(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ─── Format Visual Walkthrough ──────────────────────────
  function formatVisual(text) {
    let html = escapeHtml(text);
    html = html.replace(/(✓|★|YES)/g, "<span style='color:var(--green);font-weight:bold'>$1</span>");
    html = html.replace(/(✗|NO|fail)/g, "<span style='color:var(--red);font-weight:bold'>$1</span>");
    html = html.replace(/(→|=>|↓|↑|←)/g, "<span style='color:var(--accent2);font-weight:bold'>$1</span>");
    html = html.replace(/(\[.*?\])/g, "<span style='color:var(--cyan)'>$1</span>");
    return html;
  }

  // ─── Syntax highlight Java code ─────────────────────────
  function highlightJava(code) {
    const escaped = escapeHtml(code);
    return escaped
      .replace(/\b(public|private|protected|class|static|void|int|long|double|boolean|char|new|return|if|else|while|for|do|switch|case|break|continue|null|true|false|this|import|final|extends|implements|interface|abstract|try|catch|throw|throws|instanceof|super|default)\b/g, "<span class='kw'>$1</span>")
      .replace(/\b(String|Integer|Long|Boolean|List|ArrayList|Map|HashMap|Set|HashSet|Queue|LinkedList|Deque|ArrayDeque|TreeNode|ListNode|Node|Stack|Collections|Arrays|PriorityQueue|StringBuilder|Math|Character)\b/g, "<span class='tp'>$1</span>")
      .replace(/\b(\d+)\b/g, "<span class='num'>$1</span>")
      .replace(/(\/\/.*)/g, "<span class='cm'>$1</span>")
      .replace(/"([^"]*)"/g, "<span class='st'>\"$1\"</span>");
  }

  // ─── Open modal ─────────────────────────────────────────
  function openModal(q) {
    const diffClass = q.difficulty;
    const diffColor = diffClass === 'easy' ? 'var(--green)' : diffClass === 'medium' ? 'var(--orange)' : 'var(--red)';

    const stepsHtml = q.steps.map((s, i) =>
      `<div class="step-pill${i === 0 ? ' active' : ''}">${i+1}. ${escapeHtml(s)}</div>`
    ).join('');

    const mistakesHtml = q.mistakes.map(m =>
      `<li>${escapeHtml(m)}</li>`
    ).join('');

    const isReviewed = reviewed[q.id];

    modalContent.innerHTML = `
      <div class="m-header">
        <div class="m-qnum">Question ${q.id} of ${ALL_QUESTIONS.length}</div>
        <div class="m-title">${escapeHtml(q.title)}</div>
        <div class="m-meta">
          <span class="m-diff q-diff ${diffClass}">${q.difficulty}</span>
          <span class="m-pattern">${escapeHtml(q.topic)}</span>
          <span class="m-pattern">${escapeHtml(q.pattern)}</span>
        </div>
      </div>

      <div class="m-section">
        <div class="m-section-title"><span class="sec-icon">💡</span> Intuition</div>
        <div class="intuition-box">${escapeHtml(q.intuition)}</div>
      </div>

      <div class="m-section">
        <div class="m-section-title"><span class="sec-icon">👁️</span> Visual Walkthrough</div>
        <div class="visual-box">
          <pre>${formatVisual(q.visual)}</pre>
          <div class="step-anim">${stepsHtml}</div>
        </div>
      </div>

      <div class="m-section">
        <div class="m-section-title"><span class="sec-icon">☕</span> Optimal Java Solution</div>
        <div class="code-block">
          <div class="code-header">
            <span class="code-lang">Java</span>
            <button class="code-copy" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(q.code)}')).then(()=>this.textContent='Copied!').catch(()=>{})">Copy</button>
          </div>
          <pre>${highlightJava(q.code)}</pre>
        </div>
      </div>

      <div class="m-section">
        <div class="m-section-title"><span class="sec-icon">⏱️</span> Complexity</div>
        <div class="complexity-grid">
          <div class="cx-card">
            <div class="cx-label">Time</div>
            <div class="cx-value time">${escapeHtml(q.timeComplexity)}</div>
          </div>
          <div class="cx-card">
            <div class="cx-label">Space</div>
            <div class="cx-value space">${escapeHtml(q.spaceComplexity)}</div>
          </div>
        </div>
      </div>

      <div class="m-section">
        <div class="m-section-title"><span class="sec-icon">❌</span> Common Mistakes</div>
        <ul class="mistake-list">${mistakesHtml}</ul>
      </div>

      <div class="m-section">
        <div class="m-section-title"><span class="sec-icon">⚡</span> 30-Second Memory Trick</div>
        <div class="trick-box">
          <span class="trick-icon">🧠</span>
          <span class="trick-text">${escapeHtml(q.trick.replace(/^🧠\s*/, ''))}</span>
        </div>
      </div>

      <button class="review-btn ${isReviewed ? 'unmark' : 'mark'}" id="review-btn">
        ${isReviewed ? '✓ Reviewed — Click to Unmark' : 'Mark as Reviewed ✓'}
      </button>
    `;

    // Review button
    document.getElementById('review-btn').onclick = () => {
      if (reviewed[q.id]) {
        delete reviewed[q.id];
      } else {
        reviewed[q.id] = true;
      }
      localStorage.setItem('dsa_reviewed', JSON.stringify(reviewed));
      updateProgress();
      renderQuestions();
      openModal(q); // refresh modal
    };

    // Step animation
    const pills = modalContent.querySelectorAll('.step-pill');
    let activeStep = 0;
    if (pills.length > 1) {
      setInterval(() => {
        pills[activeStep].classList.remove('active');
        activeStep = (activeStep + 1) % pills.length;
        pills[activeStep].classList.add('active');
      }, 2000);
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // ─── Close modal ────────────────────────────────────────
  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose.onclick = closeModal;
  modalOverlay.onclick = (e) => { if (e.target === modalOverlay) closeModal(); };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ─── Search ─────────────────────────────────────────────
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchQuery = searchInput.value.trim();
      renderQuestions();
    }, 200);
  });

  // ─── Render all ─────────────────────────────────────────
  function renderAll() {
    buildSidebar();
    buildNav();
    renderQuestions();
    updateProgress();
  }

  // ─── Initialize ─────────────────────────────────────────
  renderAll();

})();
