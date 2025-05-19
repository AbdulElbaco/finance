// ----- Handle signup form submission -----
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Get form values
  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();
  const confirmPassword = e.target.confirmPassword.value.trim();

  // Validate form
  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    // Check if email already exists
    const usersResponse = await fetch('http://localhost:3000/api/users');
    if (!usersResponse.ok) {
      throw new Error(`HTTP error! status: ${usersResponse.status}`);
    }
    const users = await usersResponse.json();
    
    if (users.some(u => u.email === email)) {
      alert("Email already in use");
      return;
    }

    // Create new user
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role: 'client' // All new signups are clients
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    alert("✅ Account created successfully! You can now login.");
    window.location.href = "login.html";
  } catch (error) {
    console.error('Signup failed:', error);
    alert('Failed to create account. Please try again later.');
  }
});
  