import { initBoard } from "./board.js";
import { setupEventListeners } from "./events.js";
import { loadBoard } from "./storage.js";

function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "light";

  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.checked = savedTheme === "dark";

  themeToggle.addEventListener("change", function () {
    const theme = this.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initBoard();
  loadBoard();
  setupEventListeners();
});
