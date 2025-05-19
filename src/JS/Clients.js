// finance/src/js/client.js

// ----- Session helper -----
function getLoggedUser() {
  const s = localStorage.getItem("loggedUser");
  return s ? JSON.parse(s) : null;
}

// ----- Check for pending applications -----
async function hasPendingApplication(userId) {
  try {
    const response = await fetch('http://localhost:3000/api/applications');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const applications = await response.json();
    return applications.some(app => app.userId === userId && app.status === 'pending');
  } catch (error) {
    console.error('Failed to check pending applications:', error);
    return false;
  }
}

// ----- Update form state based on pending applications -----
async function updateFormState() {
  const user = getLoggedUser();
  if (!user) return;

  const form = document.getElementById('applyForm');
  const hasPending = await hasPendingApplication(user.id);
  
  if (hasPending) {
    form.style.display = 'none';
    const message = document.createElement('p');
    message.className = 'pending-message';
    message.innerHTML = '⚠️ You already have a pending application. Please wait for it to be processed.';
    form.parentNode.insertBefore(message, form);
  } else {
    form.style.display = 'flex';
    const message = form.parentNode.querySelector('.pending-message');
    if (message) {
      message.remove();
    }
  }
}

// ----- Render applications for this client -----
async function renderApplications() {
  const listBody = document.getElementById("applicationList");
  listBody.innerHTML = "";

  const user = getLoggedUser();
  if (!user || user.role !== "client") {
    alert("Please login as a client.");
    return window.location.href = "login.html";
  }

  try {
    const response = await fetch('http://localhost:3000/api/applications');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const applications = await response.json();
    const theirApps = applications.filter(a => a.userId === user.id);

    if (theirApps.length === 0) {
      listBody.innerHTML = `<tr><td colspan="4">No applications yet.</td></tr>`;
      return;
    }

    theirApps.forEach(app => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${new Date(app.date).toLocaleDateString()}</td>
        <td>${app.account}</td>
        <td>${app.address}</td>
        <td>${app.status}</td>
      `;
      listBody.appendChild(tr);
    });
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    listBody.innerHTML = `<tr><td colspan="4">Failed to load applications. Please try again later.</td></tr>`;
  }
}

// ----- Handle new checkbook application -----
document.getElementById("applyForm").addEventListener("submit", async e => {
  e.preventDefault();
  const user = getLoggedUser();
  if (!user) return alert("Not logged in.");

  // Check for pending applications before submitting
  const hasPending = await hasPendingApplication(user.id);
  if (hasPending) {
    alert("You already have a pending application. Please wait for it to be processed.");
    return;
  }

  const account = e.target.account.value.trim();
  const address = e.target.address.value.trim();
  const date = new Date().toISOString();

  try {
    const response = await fetch('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        account,
        address,
        date,
        status: 'pending'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    alert("✅ Application submitted!");
    e.target.reset(); // Clear the form
    await updateFormState(); // Update form visibility
    await renderApplications(); // Refresh the list
  } catch (error) {
    console.error('Failed to submit application:', error);
    alert('Failed to submit application. Please try again later.');
  }
});

// ----- Initialize page -----
window.addEventListener("DOMContentLoaded", async () => {
  const user = getLoggedUser();
  if (!user || user.role !== "client") {
    alert("Please login as a client.");
    return window.location.href = "login.html";
  }
  document.getElementById("clientName").textContent = user.name || user.email;
  await updateFormState(); // Check and update form state
  await renderApplications();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  });
});
