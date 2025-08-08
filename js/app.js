import { initBoard } from "./board.js";
import { setupEventListeners } from "./events.js";
import { loadBoard } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  initBoard();
  loadBoard();
  setupEventListeners();
});
