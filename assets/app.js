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
  {
    n: 2, title: 'JavaScript מודרני א׳', topics: 'משתנים, טיפוסים, תנאים, לולאות, פונקציות, arrow functions', ready: true,
    parts: [
      { slug: 'index', title: 'סקירה ומטרות' },
      { slug: 'basics', title: 'חלק א׳: משתנים וטיפוסים' },
      { slug: 'logic', title: 'חלק ב׳: תנאים ולולאות' },
      { slug: 'functions', title: 'חלק ג׳: פונקציות' },
      { slug: 'project', title: 'פרויקט ותרגול מסכם' },
    ],
  },
  {
    n: 3, title: 'JavaScript מודרני ב׳', topics: 'מערכים ואובייקטים, map/filter/reduce, ה-DOM ואירועים, async/await, fetch', ready: true,
    parts: [
      { slug: 'index', title: 'סקירה ומטרות' },
      { slug: 'data', title: 'חלק א׳: מערכים ואובייקטים' },
      { slug: 'methods', title: 'חלק ב׳: map, filter ו-reduce' },
      { slug: 'dom', title: 'חלק ג׳: ה-DOM ואירועים' },
      { slug: 'async', title: 'חלק ד׳: async ו-fetch' },
      { slug: 'project', title: 'פרויקט ותרגול מסכם' },
    ],
  },
  { n: 4, title: 'React: יסודות', topics: 'Node ו-npm, Vite, מודולים (import/export), JSX, קומפוננטות, props', ready: false },
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

// רץ בתוך ה-iframe של עורך JavaScript: מעביר את console.log ואת השגיאות לעמוד
function captureConsole(token) {
  const fmt = (v, depth = 0) => {
    if (typeof v === 'string') return depth ? `'${v}'` : v;
    if (typeof v === 'function') return `ƒ ${v.name || 'anonymous'}()`;
    if (v instanceof Error) return `${v.name}: ${v.message}`;
    if (v instanceof Date) return v.toString();
    if (v instanceof Promise) return 'Promise {…}';
    if (typeof Response !== 'undefined' && v instanceof Response) return `Response { status: ${v.status}, ok: ${v.ok} }`;
    if (Array.isArray(v)) return depth > 2 ? '[…]' : `[${v.map((x) => fmt(x, depth + 1)).join(', ')}]`;
    if (v && typeof v === 'object') {
      if (depth > 2) return '{…}';
      const entries = Object.entries(v).map(([k, x]) => `${k}: ${fmt(x, depth + 1)}`);
      return entries.length ? `{ ${entries.join(', ')} }` : '{}';
    }
    return String(v);
  };
  const send = (type, data) => parent.postMessage({ token, type, ...data }, '*');
  ['log', 'info', 'warn', 'error', 'table'].forEach((m) => {
    const type = m === 'warn' || m === 'error' ? m : 'log';
    console[m] = (...args) => send(type, { text: args.map((a) => fmt(a)).join(' ') });
  });
  addEventListener('error', (e) => send('exception', { text: e.message.replace(/^Uncaught /, ''), line: e.lineno }));
  addEventListener('unhandledrejection', (e) => send('exception', { text: String(e.reason?.message ?? e.reason) }));
}

// הסבר בעברית לשגיאות הנפוצות של מתחילים
const ERROR_HINTS = [
  [/is not defined/, 'השם הזה לא מוגדר. אולי יש שגיאת כתיב (אותיות גדולות וקטנות נחשבות שונות), או שהמשתנה מוגדר רק בהמשך?'],
  [/before initialization/, 'השתמשתם במשתנה לפני השורה שבה הוא הוגדר. הזיזו את ההגדרה למעלה.'],
  [/Assignment to constant/, 'אי אפשר לשנות משתנה שהוגדר עם const. אם הערך צריך להשתנות, הגדירו אותו עם let.'],
  [/already been declared/, 'המשתנה הזה כבר הוגדר. מגדירים משתנה פעם אחת, ואחר כך משנים אותו בלי let.'],
  [/is not a function/, 'ניסיתם לקרוא למשהו שהוא לא פונקציה. בדקו את השם ואת הסוגריים.'],
  [/Cannot read properties of (undefined|null)/, 'ניסיתם לקרוא מאפיין מתוך ערך שהוא undefined או null.'],
  [/Unexpected|missing|Invalid or unexpected|Unterminated/, 'שגיאת תחביר: בדקו שכל סוגריים ומרכאות נסגרו, ושאין פסיק או נקודה-פסיק חסרים.'],
];

function initPlayground(root, index) {
  const id = root.id || `pg-${index}`;
  const read = (lang) => {
    const s = root.querySelector(`script[data-lang="${lang}"]`);
    return s ? dedent(s.textContent) : null;
  };
  const initial = { html: read('html'), css: read('css'), js: read('js') };
  const solution = { html: read('solution-html'), css: read('solution-css'), js: read('solution-js') };
  const isJs = initial.js !== null || solution.js !== null;
  const langs = ['html', 'css', 'js'].filter((lang) => initial[lang] !== null || solution[lang] !== null);
  if (!isJs && !langs.includes('html')) langs.unshift('html');
  if (root.dataset.tabs === 'html,css' && !langs.includes('css')) langs.push('css');
  langs.forEach((lang) => (initial[lang] ??= ''));

  const storeKey = (lang) => `pg:${location.pathname}:${id}:${lang}`;
  const code = {};
  langs.forEach((lang) => (code[lang] = localStorage.getItem(storeKey(lang)) ?? initial[lang]));
  const hasSaved = langs.some((lang) => localStorage.getItem(storeKey(lang)) !== null);
  let active = isJs ? 'js' : 'html';
  const heightPx = Number(root.dataset.height || 220);
  const height = `${heightPx}px`;

  const editor = el('textarea', { className: 'pg-editor', spellcheck: false, value: code[active] });
  editor.setAttribute('dir', 'ltr');
  editor.setAttribute('wrap', 'off');
  editor.setAttribute('aria-label', 'עורך קוד');
  editor.style.height = height;

  // מספרי שורות בעורך JavaScript, כי הודעות השגיאה מפנות למספר שורה
  const gutter = isJs ? el('div', { className: 'pg-lines', ariaHidden: 'true' }) : null;
  const updateGutter = () => {
    if (!gutter) return;
    gutter.textContent = editor.value.split('\n').map((_, i) => i + 1).join('\n');
    gutter.scrollTop = editor.scrollTop;
  };
  editor.addEventListener('scroll', () => gutter && (gutter.scrollTop = editor.scrollTop));

  const preview = el('iframe', { className: 'pg-preview', title: 'תוצאה' });
  // עורך HTML/CSS רץ בלי סקריפטים. עורך JavaScript מריץ סקריפטים, ורק בלחיצה על "הרצה".
  // allow-forms: בלעדיו אירוע submit לא נשלח, ואי אפשר לתרגל טפסים
  preview.setAttribute('sandbox', isJs ? 'allow-scripts allow-same-origin allow-forms' : 'allow-same-origin');
  const showPreview = !isJs || langs.includes('html');
  preview.style.height = isJs ? `${Math.round(heightPx / 2)}px` : height;
  preview.hidden = !showPreview;

  const consoleOut = isJs ? el('div', { className: 'pg-console', role: 'log', dir: 'ltr' }) : null;
  if (consoleOut) consoleOut.style.height = showPreview ? `${Math.round(heightPx / 2)}px` : height;
  const logLine = (type, text) => {
    consoleOut.append(el('div', { className: `pg-log ${type}`, dir: 'auto' }, text));
    consoleOut.scrollTop = consoleOut.scrollHeight;
  };

  // הרצת JavaScript: בונים מסמך עם לוכד ה-console, הקוד של המשתמש, וסימן "סיימתי"
  let runId = 0;
  let finishRun = () => {};
  const out = { logs: [], errors: [] };
  let prefixLines = 0;
  window.addEventListener('message', (e) => {
    const m = e.data;
    if (!isJs || !m || m.token !== `${id}:${runId}`) return;
    if (m.type === 'done') return finishRun();
    if (m.type === 'exception') {
      out.errors.push(m.text);
      const line = m.line ? m.line - prefixLines : 0;
      logLine('error', `✖ ${m.text}${line > 0 ? ` (שורה ${line})` : ''}`);
      const hint = ERROR_HINTS.find(([re]) => re.test(m.text));
      if (hint) logLine('hint', `💡 ${hint[1]}`);
      return;
    }
    (m.type === 'error' ? out.errors : out.logs).push(m.text);
    logLine(m.type, m.text);
  });

  const run = () => new Promise((resolve) => {
    const token = `${id}:${++runId}`;
    out.logs = [];
    out.errors = [];
    consoleOut.replaceChildren();
    let finished = false;
    // קוד אסינכרוני (fetch, setTimeout) ממשיך לרוץ אחרי סוף הסקריפט. data-wait קובע כמה מילישניות לחכות לו
    const wait = Number(root.dataset.wait || 0);
    finishRun = () => {
      if (finished) return;
      finished = true;
      setTimeout(() => {
        if (!consoleOut.childElementCount) logLine('hint', 'אין פלט. כדי לראות משהו כאן, כתבו console.log(...)');
        resolve();
      }, wait);
    };
    setTimeout(finishRun, 3000);
    const prefix = '<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="utf-8">'
      + `<style>${PREVIEW_BASE_CSS}\n${code.css || ''}</style>`
      + `<script>(${captureConsole})(${JSON.stringify(token)})</script></head><body>${code.html || ''}\n<script>\n`;
    prefixLines = (prefix.match(/\n/g) || []).length;
    const done = `<script>parent.postMessage({ token: ${JSON.stringify(token)}, type: 'done' }, '*')</script>`;
    preview.srcdoc = `${prefix}${code.js.replace(/<\/script/gi, '<\\/script')}\n</script>${done}</body></html>`;
  });

  const render = isJs ? run : () => { preview.srcdoc = buildDoc(code.html, code.css || ''); };
  let timer;
  const save = () => {
    localStorage.setItem(storeKey(active), code[active]);
    if (isJs) return; // JavaScript רץ רק בלחיצה, כדי שלולאה אינסופית לא תתקע את העמוד בזמן ההקלדה
    clearTimeout(timer);
    timer = setTimeout(render, 250);
  };

  const tabButtons = langs.map((lang) => {
    const b = el('button', { type: 'button', className: `pg-tab${lang === active ? ' active' : ''}` }, lang.toUpperCase());
    b.addEventListener('click', () => {
      active = lang;
      editor.value = code[lang];
      updateGutter();
      tabButtons.forEach((t) => t.classList.toggle('active', t === b));
      editor.focus();
    });
    return b;
  });

  editor.addEventListener('input', () => { code[active] = editor.value; updateGutter(); save(); });
  editor.addEventListener('keydown', (e) => {
    if (isJs && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      run();
      return;
    }
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
    updateGutter();
    status.replaceChildren();
    status.className = 'pg-status';
    render();
  };

  const tools = [];
  if (isJs) {
    const runBtn = el('button', { type: 'button', className: 'pg-btn run', title: 'הרצה (Ctrl+Enter)' }, '▶ הרצה');
    runBtn.addEventListener('click', run);
    tools.push(runBtn);
  }
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
    // בעורך JavaScript הבדיקה מקבלת את הפלט: { logs, errors, code }, ואת החלון שבו הקוד רץ.
    // דרך win.eval('שם') אפשר לגשת גם למשתנים ולפונקציות שהוגדרו עם const ו-let.
    const checkArgs = async () => {
      if (!isJs) return [await freshDoc(), preview.contentWindow];
      await run();
      return [{ logs: [...out.logs], errors: [...out.errors], code: code.js }, preview.contentWindow];
    };
    checkBtn.addEventListener('click', async () => {
      const args = await checkArgs();
      let failed;
      try {
        failed = window.PLAYGROUND_CHECKS[checkName](...args).filter(([ok]) => !ok);
      } catch {
        failed = [[false, isJs ? 'משהו בקוד עדיין לא תקין. בדקו את חלון הפלט.' : 'משהו בקוד עדיין לא תקין. בדקו שכל התגיות נסגרו.']];
      }
      if (isJs && out.errors.length) failed.unshift([false, 'הקוד נעצר בגלל שגיאה. ההסבר מופיע באדום בחלון הפלט.']);
      status.className = `pg-status ${failed.length ? 'fail' : 'ok'}`;
      status.replaceChildren(failed.length
        ? el('div', {}, el('strong', {}, 'כמעט! מה שעוד חסר:'), el('ul', {}, ...failed.map(([, msg]) => el('li', {}, msg))))
        : el('strong', {}, '🎉 כל הכבוד! הפתרון נכון.'));
    });
    tools.push(checkBtn);
  }

  if (Object.values(solution).some((s) => s !== null)) {
    const solBtn = el('button', { type: 'button', className: 'pg-btn' }, '💡 פתרון');
    solBtn.addEventListener('click', () => {
      if (confirm('להציג את הפתרון? הקוד שכתבתם יוחלף. כדאי לנסות קודם לבד 🙂')) setCode(solution);
    });
    tools.push(solBtn);
  }

  const toolbar = el('div', { className: 'pg-toolbar' },
    el('div', { className: 'pg-tabs' }, ...tabButtons),
    el('div', { className: 'pg-tools' }, ...tools));
  const codeArea = gutter ? el('div', { className: 'pg-code', dir: 'ltr' }, gutter, editor) : editor;
  const resultPane = isJs
    ? [preview, el('div', { className: 'pg-label' }, 'פלט (Console)'), consoleOut]
    : [preview];
  const body = el('div', { className: 'pg-body' },
    el('div', { className: 'pg-pane' }, el('div', { className: 'pg-label' }, 'הקוד'), codeArea),
    el('div', { className: 'pg-pane' }, showPreview ? el('div', { className: 'pg-label' }, 'התוצאה') : null, ...resultPane));

  root.append(toolbar, body, status);
  updateGutter();
  // קוד ששמרתם לא רץ אוטומטית: אם יש בו לולאה אינסופית, רענון העמוד עדיין יעבוד
  if (isJs && hasSaved) logLine('hint', 'הקוד ששמרתם נטען. לחצו ▶ הרצה כדי להריץ אותו.');
  else render();
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
