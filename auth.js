<script>
/*
====================================================
 SOMNI AI — AUTH CONTROLLER
 File: js/auth.js
====================================================

Handles:
- Signup
- Login
- Validation
- Error messages
- Redirects

Depends on:
- db.js
- session.js
*/

/* =========================
   HELPERS
========================= */

function $(id) {
  return document.getElementById(id);
}

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
}

function clearError(el) {
  if (!el) return;
  el.textContent = "";
  el.style.display = "none";
}

function validInput(username, password) {
  if (!username || !password) {
    return "All fields are required";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }
  if (password.length < 5) {
    return "Password must be at least 5 characters";
  }
  return null;
}

/* =========================
   SIGNUP
========================= */

function handleSignup() {
  const username = $("signup-username")?.value.trim();
  const password = $("signup-password")?.value.trim();
  const errorEl = $("signup-error");

  clearError(errorEl);

  const validationError = validInput(username, password);
  if (validationError) {
    showError(errorEl, validationError);
    return;
  }

  const result = createUser(username, password);

  if (result.error) {
    showError(errorEl, result.error);
    return;
  }

  // Auto-login on signup
  window.location.href = "dashboard.html";
}

/* =========================
   LOGIN
========================= */

function handleLogin() {
  const username = $("login-username")?.value.trim();
  const password = $("login-password")?.value.trim();
  const errorEl = $("login-error");

  clearError(errorEl);

  if (!username || !password) {
    showError(errorEl, "Enter username and password");
    return;
  }

  const result = authenticateUser(username, password);

  if (result.error) {
    showError(errorEl, result.error);
    return;
  }

  window.location.href = "dashboard.html";
}

/* =========================
   AUTO-BIND (SAFE)
========================= */

document.addEventListener("DOMContentLoaded", () => {
  // Signup page
  const signupBtn = $("signup-btn");
  if (signupBtn) {
    signupBtn.addEventListener("click", handleSignup);
  }

  // Login page
  const loginBtn = $("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", handleLogin);
  }
 function redirectIfNotLoggedIn() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    window.location.href = "login.html";
  }
}
});
</script>
