document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message").value.trim();
  const messageBox = document.getElementById("formMessage");

  if (!name || !email || !msg) {
    messageBox.textContent = "⚠️ Please fill in all fields.";
    messageBox.style.color = "red";
    return;
  }

  messageBox.textContent = "✅ Message sent successfully!";
  messageBox.style.color = "green";

  e.target.reset();
  setTimeout(() => (messageBox.textContent = ""), 3000);
});
