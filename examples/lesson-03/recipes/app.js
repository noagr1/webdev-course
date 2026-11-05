// חיפוש מתכונים: הגרסה הסופית של הפרויקט משיעור 3.
// בשיעור 4 נבנה את אותה אפליקציה בדיוק ב-React, ונשווה.

const API = 'https://dummyjson.com/recipes';
const FAVORITES_KEY = 'recipe-finder:favorites';

// ---------- אלמנטים מהדף ----------
const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const difficultySelect = document.querySelector('#difficulty');
const statusEl = document.querySelector('#status');
const results = document.querySelector('#results');
const favCount = document.querySelector('#fav-count');

// ---------- ה-state: כל מה שהאפליקציה "זוכרת" ----------
let recipes = [];             // המתכונים שהגיעו מהשרת
let status = '';              // הודעת טעינה או שגיאה. מחרוזת ריקה = הכול בסדר
let difficulty = 'all';       // הסינון שנבחר
let favorites = loadFavorites(); // מערך של id של מתכונים מועדפים

// ---------- localStorage ----------
function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// ---------- פעולות שמשנות את ה-state, ואז מציירות מחדש ----------
function toggleFavorite(id) {
  favorites = favorites.includes(id)
    ? favorites.filter((favId) => favId !== id)
    : [...favorites, id];
  saveFavorites();
  render();
}

async function loadRecipes(url) {
  status = 'טוען מתכונים...';
  recipes = [];
  render();
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`השרת החזיר שגיאה ${res.status}`);
    const data = await res.json();
    recipes = data.recipes;
    status = '';
  } catch (err) {
    status = `אופס, משהו השתבש: ${err.message}`;
  }
  render();
}

// ---------- ציור: בונים את הדף מחדש לפי ה-state ----------
function visibleRecipes() {
  if (difficulty === 'all') return recipes;
  return recipes.filter((recipe) => recipe.difficulty === difficulty);
}

function createCard(recipe) {
  const card = document.createElement('article');
  card.className = 'card';

  const img = document.createElement('img');
  img.src = recipe.image;
  img.alt = recipe.name;

  const title = document.createElement('h3');
  title.textContent = recipe.name;

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = `${recipe.cuisine} · ${recipe.difficulty} · ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} דק׳`;

  const isFavorite = favorites.includes(recipe.id);
  const favButton = document.createElement('button');
  favButton.type = 'button';
  favButton.className = 'fav';
  favButton.textContent = isFavorite ? '⭐ במועדפים' : '☆ למועדפים';
  favButton.setAttribute('aria-pressed', isFavorite);
  favButton.addEventListener('click', () => toggleFavorite(recipe.id));

  card.append(img, title, meta, favButton);
  return card;
}

function render() {
  const list = visibleRecipes();
  results.replaceChildren(...list.map(createCard));
  favCount.textContent = `⭐ ${favorites.length} מועדפים`;

  if (status) statusEl.textContent = status;
  else if (list.length === 0) statusEl.textContent = 'לא נמצאו מתכונים. נסו מילה אחרת.';
  else statusEl.textContent = `מציגים ${list.length} מתכונים`;
}

// ---------- אירועים ----------
form.addEventListener('submit', (event) => {
  event.preventDefault(); // בלי זה הדפדפן שולח את הטופס וטוען את הדף מחדש
  const query = input.value.trim();
  loadRecipes(query ? `${API}/search?q=${encodeURIComponent(query)}` : `${API}?limit=12`);
});

difficultySelect.addEventListener('change', () => {
  difficulty = difficultySelect.value;
  render();
});

// ---------- התחלה ----------
loadRecipes(`${API}?limit=12`);
