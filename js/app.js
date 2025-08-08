import { initBoard, createColumn } from "./board.js";
import { loadFromStorage, saveToStorage } from "./storage.js";
import { setupEventListeners } from "./events.js";
import { showModal } from "./modal.js";

document.addEventListener("DOMContentLoaded", () => {
  // Инициализация приложения
  initBoard();
  loadFromStorage();
  setupEventListeners();

  // Автосохранение каждые 30 секунд
  setInterval(saveToStorage, 30000);

  // Проверка дедлайнов при загрузке
  setTimeout(() => {
    document.querySelectorAll(".deadline-input").forEach((input) => {
      input.dispatchEvent(new Event("change"));
    });
  }, 1000);
});
