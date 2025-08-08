import { createCard } from "./card.js";
import { saveToStorage, clearStorage } from "./storage.js";
import { createColumn } from "./board.js";
import { showModal } from "./modal.js";

export function setupEventListeners() {
  // Добавление новой карточки
  document.addEventListener("click", (e) => {
    if (e.target.closest(".add-card-btn")) {
      const columnId = e.target.closest(".add-card-btn").dataset.column;
      showModal("Добавить карточку", (text) => {
        if (text && text.trim()) {
          const card = createCard(text.trim(), columnId);
          document.getElementById(`${columnId}-cards`).appendChild(card);
          saveToStorage();
        }
      });
    }

    // Добавление новой колонки
    if (e.target.id === "add-column-btn") {
      showModal("Название колонки", (title) => {
        if (title && title.trim()) {
          const columnId = `col-${Date.now()}`;
          createColumn(columnId, title.trim());
          saveToStorage();
        }
      });
    }

    // Сохранение доски
    if (e.target.id === "save-board-btn") {
      saveToStorage();
      alert("Доска сохранена!");
    }
  });

  // Глобальные обработчики
  document.addEventListener("change", (e) => {
    // Сохраняем при изменении чекбоксов
    if (e.target.matches('.checklist-item input[type="checkbox"]')) {
      saveToStorage();
    }
  });

  // Кнопка очистки (можно добавить в интерфейс)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Delete" && e.ctrlKey) {
      clearStorage();
    }
  });
}
