(function () {
  // 1. Get DOM elements
  const themeToggleBtn = document.getElementById("theme-toggle-icon");
  const htmlElement = document.documentElement;

  // 2. Function to set theme
  function setTheme(theme) {
    htmlElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  // 3. Click event listener for the toggle button
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });

  // 4. Initial theme load (no changes needed here)
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    htmlElement.setAttribute("data-theme", savedTheme);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const systemTheme = prefersDark ? "dark" : "light";
    htmlElement.setAttribute("data-theme", systemTheme);
  }
})();
