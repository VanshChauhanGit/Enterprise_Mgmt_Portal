document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const message = document.getElementById("loginMessage");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "yashi@synergyflow.com" && password === "yashi123") {
      message.style.color = "green";
      message.textContent = "✅ Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1200);
    } else {
      message.style.color = "red";
      message.textContent = "❌ Invalid email or password!";
    }
  });
});
