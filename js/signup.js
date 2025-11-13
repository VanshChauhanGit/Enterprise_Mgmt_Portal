// js/signup.js — client-side validation + friendly message + redirect
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const btn = document.getElementById("signupBtn");
  const msgBox = document.getElementById("signupMessage");

  const showError = (id, text) => {
    const el = document.getElementById(id);
    el.textContent = text;
    el.classList.add("show");
  };
  const clearError = (id) => {
    const el = document.getElementById(id);
    el.textContent = "";
    el.classList.remove("show");
  };
  const validateEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // clear
    ["err-name","err-email","err-pass","err-confirm","err-terms"].forEach(clearError);
    msgBox.textContent = "";
    msgBox.style.color = "";

    const name = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;
    const terms = document.getElementById("terms").checked;

    let valid = true;
    if (!name || name.length < 2) { showError("err-name", "Please enter your full name."); valid = false; }
    if (!email || !validateEmail(email)) { showError("err-email", "Please enter a valid email."); valid = false; }
    if (!pass || pass.length < 8) { showError("err-pass", "Password must be at least 8 characters."); valid = false; }
    if (pass !== confirm) { showError("err-confirm", "Passwords do not match."); valid = false; }
    if (!terms) { showError("err-terms", "You must accept Terms & Conditions."); valid = false; }

    if (!valid) {
      msgBox.style.color = "#d9534f";
      msgBox.textContent = "Please fix the highlighted errors.";
      return;
    }

    // simulate server processing
    btn.disabled = true;
    btn.textContent = "Creating account...";

    setTimeout(() => {
      msgBox.style.color = "green";
      msgBox.textContent = "✅ Signup successful! Redirecting to login...";
      btn.disabled = false;
      btn.textContent = "Create account";

      // redirect after 2s
      setTimeout(() => { window.location.href = "login.html"; }, 2000);
    }, 900);
  });
});
