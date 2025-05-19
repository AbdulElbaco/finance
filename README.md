💸 Simple Finance App
This is a basic finance web app built with pure HTML, CSS, and JavaScript. It includes both client and admin pages to simulate checkbook requests and simple application tracking.

⚠️ Disclaimer: This project is intentionally simple and vulnerable by design. It is meant for practice and learning only — do NOT deploy it in production or use it for handling real data.

🧠 Purpose
This project was created to:

Practice fundamental web development skills (HTML, CSS, JS).

Simulate a full app flow with client/admin roles.

Explore basic client-side logic and UI/UX.

Have fun with "vibe coding" — relaxed, intuitive development for learning.

🏗️ Features
Simple login/sign-up (no real authentication).

Dashboard for clients to request checkbooks.

Admin dashboard to view and manage client applications.

All data stored in memory (initially), then enhanced with a Node.js backend and JSON file storage.

⚙️ Setup Instructions
🔧 Prerequisites
Node.js (v18 or later recommended)

📦 Installation
bash
Copy
Edit
# Clone the repo
git clone https://github.com/AbdulElbaco/finance.git
cd finance

# Install dependencies
npm install
▶️ Running the App
bash
Copy
Edit
# Start the Node.js server
node server.js
Then open your browser and go to:

arduino
Copy
Edit
http://localhost:3000
🔐 Why It’s Vulnerable
This project is intentionally insecure as it was made for learning purposes only. Vulnerabilities include:

No encryption or password hashing.

No authentication/authorization system — anyone can access anything.

All data initially stored in memory or raw JSON files — no database.

No input validation — open to XSS or injection attacks.

No HTTPS or security headers.

📁 Project Structure
bash
Copy
Edit
finance/
├── public/                 # Frontend files (HTML, CSS, JS)
│   └── index.html          # Entry point
├── src/
│   └── style/styles.css    # App styling
├── server.js               # Simple Node.js backend
├── data/                   # JSON storage for users/applications
└── README.md               # This file
🚧 Roadmap
This is a practice sandbox, but future learning steps may include:

Adding proper authentication (JWT or sessions)

Integrating a real database (e.g., MongoDB or SQLite)

Input validation and error handling

User access control and security best practices

🤝 Contributing
This project is primarily for personal learning, but feel free to fork it and play around. Pull requests are welcome if you have interesting ideas!

🧑‍💻 Author
Abdul Elbaco
Built this as part of his learning journey in web development and backend fundamentals.
