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
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input');
    const buttons = form.querySelectorAll('button');
    
    inputs.forEach(input => input.disabled = !enabled);
    buttons.forEach(button => button.disabled = !enabled);
  });
}

function showServerAlert(show) {
  const alert = document.getElementById('serverStatusAlert');
  if (alert) {
    alert.style.display = show ? 'block' : 'none';
  }
}

// ----- Initialize server status check -----
window.addEventListener('DOMContentLoaded', async () => {
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    showServerAlert(true);
    setFormState(false);
  }
}); 