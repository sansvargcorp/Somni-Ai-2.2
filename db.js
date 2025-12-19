<script>
/*
====================================================
 SOMNI AI — LOCAL DATABASE ENGINE
 File: js/db.js
====================================================
*/

const DB_KEY = "somni_db_v1";

/*
DB STRUCTURE

{
  users: {
    userId: {
      id,
      username,
      password,
      createdAt,
      features,
      purchases,
      promoOverride
    }
  },
  sessions: {
    currentUserId
  }
}
*/

function initDB() {
  if (!localStorage.getItem(DB_KEY)) {
    const emptyDB = {
      users: {},
      sessions: {
        currentUserId: null
      }
    };
    localStorage.setItem(DB_KEY, JSON.stringify(emptyDB));
  }
}

function loadDB() {
  initDB();
  return JSON.parse(localStorage.getItem(DB_KEY));
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

/* =========================
   HELPERS
========================= */

function generateId() {
  return "u_" + Math.random().toString(36).substring(2, 11);
}

function now() {
  return new Date().toISOString();
}

/* =========================
   FEATURES
========================= */

function emptyFeatures() {
  return {
    sleep_log: false,
    sleep_debt: false,
    feeling_ai: false,
    habits: false,
    analytics: false,
    elite: false
  };
}

const PLAN_FEATURES = {
  core: ["sleep_log", "sleep_debt", "feeling_ai"],
  pro: ["sleep_log", "sleep_debt", "feeling_ai", "habits", "analytics"],
  elite: ["sleep_log", "sleep_debt", "feeling_ai", "habits", "analytics", "elite"]
};

/* =========================
   USERS
========================= */

function createUser(username, password) {
  const db = loadDB();

  for (let id in db.users) {
    if (db.users[id].username === username) {
      return { error: "Username already exists" };
    }
  }

  const userId = generateId();

  db.users[userId] = {
    id: userId,
    username,
    password,
    createdAt: now(),
    features: emptyFeatures(),
    purchases: [],
    promoOverride: false
  };

  db.sessions.currentUserId = userId;
  saveDB(db);

  return { success: true };
}

function authenticateUser(username, password) {
  const db = loadDB();

  for (let id in db.users) {
    const u = db.users[id];
    if (u.username === username && u.password === password) {
      db.sessions.currentUserId = id;
      saveDB(db);
      return { success: true };
    }
  }

  return { error: "Invalid credentials" };
}

function logoutUser() {
  const db = loadDB();
  db.sessions.currentUserId = null;
  saveDB(db);
}

function getCurrentUser() {
  const db = loadDB();
  const id = db.sessions.currentUserId;
  if (!id) return null;
  return db.users[id] || null;
}

/* =========================
   AUTH GUARDS
========================= */

function requireAuth() {
  if (!getCurrentUser()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

/* =========================
   FEATURE UNLOCKING
========================= */

function unlockPlan(plan) {
  const db = loadDB();
  const user = getCurrentUser();
  if (!user || !PLAN_FEATURES[plan]) return;

  PLAN_FEATURES[plan].forEach(f => {
    user.features[f] = true;
  });

  user.purchases.push({ plan, date: now() });
  db.users[user.id] = user;
  saveDB(db);
}

function unlockAllFeatures() {
  const db = loadDB();
  const user = getCurrentUser();
  if (!user) return;

  Object.keys(user.features).forEach(f => {
    user.features[f] = true;
  });

  user.promoOverride = true;
  db.users[user.id] = user;
  saveDB(db);
}

/* =========================
   FEATURE GUARD
========================= */

function requireFeature(feature) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "../login.html";
    return;
  }

  if (!user.features[feature]) {
    window.location.href = "../checkout/core.html";
  }
}

/* =========================
   PROMO CODE
========================= */

function applyPromoCode(code) {
  if (code === "TEST123") {
    unlockAllFeatures();
    return true;
  }
  return false;
}

/* =========================
   INIT
========================= */

initDB();
</script>
