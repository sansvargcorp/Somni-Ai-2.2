<script>
/*
====================================================
 SOMNI AI — SESSION MANAGER
 File: js/session.js
====================================================
*/

function restoreSession() {
  return getCurrentUser();
}

function isLoggedIn() {
  return !!getCurrentUser();
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = "dashboard.html";
  }
}

function redirectIfNotLoggedIn() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

function handleLogout() {
  logoutUser();
  window.location.href = "login.html";
}

/*
Auto-run on every page
*/
document.addEventListener("DOMContentLoaded", () => {
  restoreSession();
});
</script>
