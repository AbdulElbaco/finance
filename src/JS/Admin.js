// finance/src/js/admin.js

// ----- Session helper -----
function getLoggedUser() {
  const s = localStorage.getItem("loggedUser");
  return s ? JSON.parse(s) : null;
}

// ----- API base URL -----
const API_URL = 'http://localhost:3000/api';

// ----- Fetch data -----
async function fetchData(endpoint) {
  const response = await fetch(`${API_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// ----- Update status -----
async function updateStatus(id, status) {
  try {
    const response = await fetch(`${API_URL}/applications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await renderQueue(); // re-render table with updated status
  } catch (error) {
    console.error('Failed to update status:', error);
    alert('Failed to update application status. Please try again.');
  }
}

// ----- Render admin queue -----
async function renderQueue() {
  const tbody = document.getElementById("adminQueue");
  tbody.innerHTML = "";

  const admin = getLoggedUser();
  if (!admin || admin.role !== "admin") {
    alert("Please login as an admin.");
    return window.location.href = "login.html";
  }

  try {
    const [users, applications] = await Promise.all([
      fetchData('users'),
      fetchData('applications'),
    ]);

    if (applications.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No applications in queue.</td></tr>';
      return;
    }

    applications.forEach(app => {
      const client = users.find(u => u.id === app.userId);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${client ? client.email : "Unknown"}</td>
        <td>${app.account}</td>
        <td>${app.address}</td>
        <td>${new Date(app.date).toLocaleDateString()}</td>
        <td>${app.status}</td>
        <td>
          ${app.status === 'pending' ? `
            <button class="approve" data-id="${app.id}" data-action="approve">Approve</button>
            <button class="reject" data-id="${app.id}" data-action="reject">Reject</button>
          ` : ''}
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Attach event listeners after table is rendered
    tbody.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;
        updateStatus(id, action === "approve" ? "approved" : "rejected");
      });
    });
  } catch (error) {
    console.error('Failed to render queue:', error);
    tbody.innerHTML = '<tr><td colspan="6">Failed to load data. Please try refreshing the page.</td></tr>';
  }
}

// ----- Initialize page -----
window.addEventListener("DOMContentLoaded", async () => {
  const admin = getLoggedUser();
  if (!admin || admin.role !== "admin") {
    alert("Please login as an admin.");
    return window.location.href = "login.html";
  }

  document.getElementById("adminName").textContent = admin.name || admin.email; // Use name if available, fallback to email
  await renderQueue();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  });
});