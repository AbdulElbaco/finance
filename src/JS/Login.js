// finance/src/js/login.js

// ----- Static demo users -----
//const users = [
//  { id: 1, email: "admin@example.com", password: "admin123", role: "admin" },
//  { id: 2, email: "client1@example.com", password: "client123", role: "client" },
//  { id: 3, email: "client2@example.com", password: "client456", role: "client" }
//];

// ----- Helpers to persist session -----
function saveLoggedUser(user) {
  localStorage.setItem("loggedUser", JSON.stringify(user));
}

function getLoggedUser() {
  const s = localStorage.getItem("loggedUser");
  return s ? JSON.parse(s) : null;
}

// ----- Server status check -----
async function checkServerStatus() {
  try {
    const response = await fetch('http://localhost:3000/api/users');
    return response.ok;
  } catch (error) {
    return false;
  }
}

function setFormState(enabled) {
  const form = document.getElementById('loginForm');
  const inputs = form.querySelectorAll('input');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  inputs.forEach(input => input.disabled = !enabled);
  submitBtn.disabled = !enabled;
}

function showServerAlert(show) {
  const alert = document.getElementById('serverStatusAlert');
  alert.style.display = show ? 'block' : 'none';
}

// ----- Initialize page -----
window.addEventListener('DOMContentLoaded', async () => {
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    showServerAlert(true);
    setFormState(false);
  }
});

// ----- Login handler -----
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  try {
    const response = await fetch('http://localhost:3000/api/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("❌ Invalid email or password");
      return;
    }

    saveLoggedUser(user);
    // Redirect based on role
    if (user.role === "admin") {
      window.location.href = "../html/admin.html";
    } else {
      window.location.href = "../html/client.html";
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed. Please try again later.');
  }
});