import { createCard } from "./card.js";
import { createColumn } from "./board.js";
import { saveBoard, getCurrentBoardState } from "./storage.js";

export function setupEventListeners() {
  // Добавление карточки
  document.addEventListener("click", (e) => {
    if (e.target.closest(".add-card-btn")) {
      const columnId = e.target.closest(".add-card-btn").dataset.column;
      const text = prompt("Текст карточки:");
      if (text) {
        const card = createCard(text, columnId);
        document.getElementById(`${columnId}-cards`).appendChild(card);
        saveBoard(getCurrentBoardState());
      }
    }

    // Добавление колонки
    if (e.target.id === "add-column-btn") {
      const title = prompt("Название колонки:");
      if (title) {
        const columnId = `column-${Date.now()}`;
        createColumn(columnId, title);
        saveBoard(getCurrentBoardState());
      }
    }
  });

  // Сохранение при редактировании заголовка колонки
  document.addEventListener(
    "blur",
    (e) => {
      if (e.target.classList.contains("column-title")) {
        saveBoard(getCurrentBoardState());
      }
    },
    true
  );
}
