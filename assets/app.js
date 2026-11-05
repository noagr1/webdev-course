// רשימת השיעורים — מקור אחד לניווט, לדף הבית ולכפתורי הבא/הקודם.
// לשיעור עם parts יש כמה עמודים; העמוד הראשון תמיד index.
const LESSONS = [
  {
    n: 1, title: 'ווב מודרני: HTML, CSS ו-Git', topics: 'איך הווב עובד, HTML מאפס, CSS ו-Flexbox, Git ו-GitHub', ready: true,
    parts: [
      { slug: 'index', title: 'סקירה ומטרות' },
      { slug: 'html', title: 'חלק א׳: HTML מאפס' },
      { slug: 'css', title: 'חלק ב׳: עיצוב עם CSS' },
      { slug: 'git', title: 'חלק ג׳: Git ו-GitHub' },
      { slug: 'project', title: 'פרויקט ותרגול מסכם' },
    ],
  },
  { n: 2, title: 'JavaScript מודרני א׳', topics: 'let/const, טיפוסים, תנאים, לולאות, פונקציות, arrow functions', ready: false },
  { n: 3, title: 'JavaScript מודרני ב׳', topics: 'מערכים ואובייקטים, map/filter/reduce, destructuring, spread, מודולים, async/await, fetch', ready: false },
  { n: 4, title: 'React: יסודות', topics: 'Node ו-npm, Vite, JSX, קומפוננטות, props', ready: false },
  { n: 5, title: 'State ואירועים', topics: 'useState, אירועים, רינדור מותנה, רשימות ו-key', ready: false },
  { n: 6, title: 'טפסים ונתונים מהרשת', topics: 'טפסים מבוקרים, ולידציה, useEffect, fetch, מצבי טעינה ושגיאה', ready: false },
  { n: 7, title: 'ניתוב ומבנה אפליקציה', topics: 'React Router, layouts, פרמטרים ב-URL, custom hooks', ready: false },
  { n: 8, title: 'State גלובלי ועיצוב', topics: 'Context, useReducer, Tailwind CSS', ready: false },
  { n: 9, title: 'צד שרת', topics: 'REST, Express, MongoDB Atlas, משתני סביבה', ready: false },
  { n: 10, title: 'Full-Stack והעלאה לאוויר', topics: 'חיבור React לשרת, CORS, Netlify ו-Render, פרויקט סיום', ready: false },
];

const pad = (n) => String(n).padStart(2, '0');
const base = document.body.dataset.base || '';
const partsOf = (l) => l.parts || [{ slug: 'index', title: l.title }];
const pageHref = (l, slug = 'index') => `${base}lessons/lesson-${pad(l.n)}/${slug}.html`;
const currentLesson = Number(document.body.dataset.lesson) || null;
const currentPart = document.body.dataset.part || 'index';

// יצירת אלמנט: el('a', { href: '#', className: 'x' }, 'טקסט', childEl)
function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children.filter((c) => c != null));
  return node;
}

// ---------- ניווט בין שיעורים (סרגל צד) ----------
const nav = document.getElementById('lesson-nav');
if (nav) {
  const items = LESSONS.map((l) => {
    const label = `${l.n}. ${l.title}`;
    if (!l.ready) return el('li', { className: 'soon' }, el('span', {}, label), el('small', {}, 'בקרוב'));
    const isCurrent = l.n === currentLesson;
    const li = el('li', { className: isCurrent ? 'current' : '' }, el('a', { href: pageHref(l) }, label));
    if (isCurrent && l.parts) {
      li.append(el('ol', { className: 'parts' }, ...l.parts.map((p) =>
        el('li', { className: p.slug === currentPart ? 'current-part' : '' }, el('a', { href: pageHref(l, p.slug) }, p.title)))));
    }
    return li;
  });
  nav.append(el('a', { className: 'nav-home', href: `${base}index.html` }, '🏠 דף הבית'), el('ol', {}, ...items));
}

// ---------- כרטיסי השיעורים בדף הבית ----------
const grid = document.getElementById('lessons-grid');
if (grid) {
  LESSONS.forEach((l) => {
    const children = [
      el('span', { className: 'lesson-num' }, `שיעור ${l.n}`),
      el('h3', {}, l.title),
      el('p', {}, l.topics),
      l.ready ? null : el('span', { className: 'badge' }, 'בקרוב'),
    ];
    grid.append(l.ready
      ? el('a', { className: 'lesson-card', href: pageHref(l) }, ...children)
      : el('div', { className: 'lesson-card disabled' }, ...children));
  });
}

// ---------- תוכן עניינים לעמוד, נבנה מכותרות h2 ----------
const toc = document.getElementById('toc');
if (toc) {
  // הכותרת בלי תגית הזמן (span.time)
  const headingText = (h) => {
    const copy = h.cloneNode(true);
    copy.querySelectorAll('.time').forEach((t) => t.remove());
    return copy.textContent.trim();
  };
  const links = [...document.querySelectorAll('main h2[id]')]
    .map((h) => el('li', {}, el('a', { href: `#${h.id}` }, headingText(h))));
  toc.append(el('h4', {}, 'בעמוד הזה'), el('ul', {}, ...links));
}

// ---------- כפתורי הבא/הקודם: עוברים על כל העמודים לפי הסדר ----------
const pager = document.getElementById('lesson-pager');
if (pager && currentLesson) {
  const pages = LESSONS.filter((l) => l.ready).flatMap((l) => partsOf(l).map((p) => ({ l, p })));
  const i = pages.findIndex(({ l, p }) => l.n === currentLesson && p.slug === currentPart);
  const link = (page, label) => {
    if (!page) return el('span');
    const title = page.l.n === currentLesson ? page.p.title : `שיעור ${page.l.n}: ${page.l.title}`;
    return el('a', { href: pageHref(page.l, page.p.slug) }, `${label}: ${title}`);
  };
  pager.append(link(pages[i - 1], '→ הקודם'), link(pages[i + 1], 'הבא ←'));
}

// ---------- מצב מרצה: מציג את הערות המרצה, ונשמר בדפדפן ----------
const toggle = document.getElementById('lecturer-toggle');
const setLecturer = (on) => {
  document.body.classList.toggle('lecturer-mode', on);
  localStorage.setItem('lecturerMode', on ? '1' : '0');
  toggle?.setAttribute('aria-pressed', on);
};
setLecturer(localStorage.getItem('lecturerMode') === '1' || new URLSearchParams(location.search).has('lecturer'));
toggle?.addEventListener('click', () => setLecturer(!document.body.classList.contains('lecturer-mode')));

// ---------- עורך קוד חי (Playground) ----------
// <div class="playground" id="pg-x" data-height="220" data-check="pg-x">
//   <script type="text/plain" data-lang="html">...</script>
//   <script type="text/plain" data-lang="css">...</script>          (לא חובה)
//   <script type="text/plain" data-lang="solution-html">...</script> (לאתגרים)
//   <script type="text/plain" data-lang="solution-css">...</script>
// </div>
// בדיקות אוטומטיות: window.PLAYGROUND_CHECKS[id] = (doc, win) => [[תנאי, 'הודעה כשהתנאי לא מתקיים'], ...]

function dedent(text) {
  const lines = text.replace(/^\n+/, '').replace(/\s+$/, '').split('\n');
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(indent)).join('\n');
}

const PREVIEW_BASE_CSS = 'body { font-family: system-ui, sans-serif; margin: 12px; line-height: 1.5; }';

function buildDoc(html, css) {
  const style = `<style>${PREVIEW_BASE_CSS}\n${css}</style>`;
  if (/<html[\s>]/i.test(html)) {
    return /<\/head>/i.test(html) ? html.replace(/<\/head>/i, `${style}</head>`) : style + html;
  }
  return `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="utf-8">${style}</head><body>${html}</body></html>`;
}

function initPlayground(root, index) {
  const id = root.id || `pg-${index}`;
  const read = (lang) => {
    const s = root.querySelector(`script[data-lang="${lang}"]`);
    return s ? dedent(s.textContent) : null;
  };
  const initial = { html: read('html') ?? '', css: read('css') };
  const solution = { html: read('solution-html'), css: read('solution-css') };
  const langs = ['html'];
  if (initial.css !== null || solution.css !== null || root.dataset.tabs === 'html,css') langs.push('css');
  initial.css ??= '';

  const storeKey = (lang) => `pg:${location.pathname}:${id}:${lang}`;
  const code = {};
  langs.forEach((lang) => (code[lang] = localStorage.getItem(storeKey(lang)) ?? initial[lang]));
  let active = 'html';
  const height = `${root.dataset.height || 220}px`;

  const editor = el('textarea', { className: 'pg-editor', spellcheck: false, value: code.html });
  editor.setAttribute('dir', 'ltr');
  editor.setAttribute('aria-label', 'עורך קוד');
  editor.style.height = height;

  const preview = el('iframe', { className: 'pg-preview', title: 'תוצאה' });
  preview.setAttribute('sandbox', 'allow-same-origin'); // בלי סקריפטים: רק HTML ו-CSS
  preview.style.height = height;

  const render = () => { preview.srcdoc = buildDoc(code.html, code.css || ''); };
  let timer;
  const save = () => {
    localStorage.setItem(storeKey(active), code[active]);
    clearTimeout(timer);
    timer = setTimeout(render, 250);
  };

  const tabButtons = langs.map((lang) => {
    const b = el('button', { type: 'button', className: `pg-tab${lang === active ? ' active' : ''}` }, lang.toUpperCase());
    b.addEventListener('click', () => {
      active = lang;
      editor.value = code[lang];
      tabButtons.forEach((t) => t.classList.toggle('active', t === b));
      editor.focus();
    });
    return b;
  });

  editor.addEventListener('input', () => { code[active] = editor.value; save(); });
  editor.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || e.shiftKey) return;
    e.preventDefault();
    editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end');
    code[active] = editor.value;
    save();
  });

  const status = el('div', { className: 'pg-status', role: 'status' });
  const setCode = (source) => {
    langs.forEach((lang) => {
      if (source[lang] == null) return;
      code[lang] = source[lang];
      localStorage.setItem(storeKey(lang), code[lang]);
    });
    editor.value = code[active];
    status.replaceChildren();
    status.className = 'pg-status';
    render();
  };

  const tools = [];
  const resetBtn = el('button', { type: 'button', className: 'pg-btn', title: 'חזרה לקוד המקורי' }, '↺ איפוס');
  resetBtn.addEventListener('click', () => {
    langs.forEach((lang) => localStorage.removeItem(storeKey(lang)));
    setCode(initial);
  });
  tools.push(resetBtn);

  const wideBtn = el('button', { type: 'button', className: 'pg-btn', title: 'עורך ותוצאה אחד מעל השני, ברוחב מלא' }, '⤢ הרחבה');
  wideBtn.addEventListener('click', () => root.classList.toggle('wide'));
  tools.push(wideBtn);

  const checkName = root.dataset.check;
  if (checkName) {
    const freshDoc = () => new Promise((resolve) => {
      clearTimeout(timer);
      preview.addEventListener('load', () => resolve(preview.contentDocument), { once: true });
      render();
    });
    const checkBtn = el('button', { type: 'button', className: 'pg-btn primary' }, '✓ בדיקה');
    checkBtn.addEventListener('click', async () => {
      const doc = await freshDoc();
      let failed;
      try {
        failed = window.PLAYGROUND_CHECKS[checkName](doc, preview.contentWindow).filter(([ok]) => !ok);
      } catch {
        failed = [[false, 'משהו בקוד עדיין לא תקין. בדקו שכל התגיות נסגרו.']];
      }
      status.className = `pg-status ${failed.length ? 'fail' : 'ok'}`;
      status.replaceChildren(failed.length
        ? el('div', {}, el('strong', {}, 'כמעט! מה שעוד חסר:'), el('ul', {}, ...failed.map(([, msg]) => el('li', {}, msg))))
        : el('strong', {}, '🎉 כל הכבוד! הפתרון נכון.'));
    });
    tools.push(checkBtn);
  }

  if (solution.html !== null || solution.css !== null) {
    const solBtn = el('button', { type: 'button', className: 'pg-btn' }, '💡 פתרון');
    solBtn.addEventListener('click', () => {
      if (confirm('להציג את הפתרון? הקוד שכתבתם יוחלף. כדאי לנסות קודם לבד 🙂')) setCode(solution);
    });
    tools.push(solBtn);
  }

  const toolbar = el('div', { className: 'pg-toolbar' },
    el('div', { className: 'pg-tabs' }, ...tabButtons),
    el('div', { className: 'pg-tools' }, ...tools));
  const body = el('div', { className: 'pg-body' },
    el('div', { className: 'pg-pane' }, el('div', { className: 'pg-label' }, 'הקוד'), editor),
    el('div', { className: 'pg-pane' }, el('div', { className: 'pg-label' }, 'התוצאה'), preview));

  root.append(toolbar, body, status);
  render();
}

document.querySelectorAll('.playground').forEach(initPlayground);

// ---------- חוקר Flexbox: לוחצים על ערכים ורואים את התוצאה ----------
const FLEX_OPTIONS = {
  'flex-direction': ['row', 'column', 'row-reverse', 'column-reverse'],
  'justify-content': ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
  'align-items': ['stretch', 'flex-start', 'center', 'flex-end'],
  'flex-wrap': ['nowrap', 'wrap'],
  gap: ['0', '8px', '16px', '32px'],
};

function initFlexExplorer(root) {
  const state = { 'flex-direction': 'row', 'justify-content': 'flex-start', 'align-items': 'stretch', 'flex-wrap': 'nowrap', gap: '8px' };
  const only = root.dataset.props ? root.dataset.props.split(',') : Object.keys(FLEX_OPTIONS);
  let count = Number(root.dataset.items) || 4;

  const stage = el('div', { className: 'fx-stage' });
  const codeOut = el('code');
  const draw = () => {
    stage.replaceChildren(...Array.from({ length: count }, (_, i) => el('div', { className: `fx-item fx-h${i % 3}` }, String(i + 1))));
    Object.entries(state).forEach(([prop, value]) => stage.style.setProperty(prop, value));
    stage.style.display = 'flex';
    codeOut.textContent = ['.container {', '  display: flex;',
      ...only.map((prop) => `  ${prop}: ${state[prop]};`), '}'].join('\n');
  };

  const controls = only.map((prop) => {
    const buttons = FLEX_OPTIONS[prop].map((value) => {
      const b = el('button', { type: 'button', className: `fx-opt${state[prop] === value ? ' active' : ''}` }, value);
      b.setAttribute('dir', 'ltr');
      b.addEventListener('click', () => {
        state[prop] = value;
        buttons.forEach((x) => x.classList.toggle('active', x === b));
        draw();
      });
      return b;
    });
    return el('div', { className: 'fx-row' }, el('code', { className: 'fx-prop' }, prop), el('div', { className: 'fx-opts' }, ...buttons));
  });

  const minus = el('button', { type: 'button', className: 'fx-opt' }, '−');
  const plus = el('button', { type: 'button', className: 'fx-opt' }, '+');
  minus.addEventListener('click', () => { count = Math.max(1, count - 1); draw(); });
  plus.addEventListener('click', () => { count = Math.min(12, count + 1); draw(); });
  controls.push(el('div', { className: 'fx-row' }, el('span', { className: 'fx-prop' }, 'מספר פריטים'), el('div', { className: 'fx-opts' }, minus, plus)));

  root.append(el('div', { className: 'fx-controls' }, ...controls), stage, el('pre', {}, codeOut));
  draw();
}

document.querySelectorAll('.flex-explorer').forEach(initFlexExplorer);

// ---------- שאלות "בדקו את עצמכם" ----------
// <div class="quiz"><p class="quiz-q">שאלה</p><ul><li>…</li><li data-correct>…</li></ul><p class="quiz-explain">הסבר</p></div>
document.querySelectorAll('.quiz').forEach((quiz) => {
  quiz.querySelectorAll('li').forEach((li) => {
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    const answer = () => {
      const correct = li.hasAttribute('data-correct');
      li.classList.add(correct ? 'right' : 'wrong');
      if (correct) quiz.classList.add('answered');
    };
    li.addEventListener('click', answer);
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); answer(); } });
  });
});

// ---------- טרמינל: שורות שמתחילות ב-$ הן פקודות ----------
document.querySelectorAll('pre.terminal > code').forEach((code) => {
  const lines = dedent(code.textContent).split('\n');
  code.replaceChildren(...lines.flatMap((line, i) => {
    const node = line.startsWith('$ ')
      ? el('span', { className: 'cmd' }, el('span', { className: 'prompt' }, '$ '), line.slice(2))
      : el('span', { className: line.startsWith('#') ? 'comment' : 'out' }, line);
    return i < lines.length - 1 ? [node, '\n'] : [node];
  }));
  code.dataset.copy = lines.filter((l) => l.startsWith('$ ')).map((l) => l.slice(2)).join('\n');
});

// ---------- הדגשת תחביר, ואחריה כפתור העתקה לכל בלוק קוד ----------
window.hljs?.highlightAll();
document.querySelectorAll('pre > code').forEach((code) => {
  if (code.closest('.flex-explorer')) return;
  const btn = el('button', { className: 'copy-btn', type: 'button' }, 'העתקה');
  btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(code.dataset.copy || code.innerText);
    btn.textContent = 'הועתק ✓';
    setTimeout(() => (btn.textContent = 'העתקה'), 1500);
  });
  code.parentElement.append(btn);
});
