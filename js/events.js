import { createCard } from "./card.js";
import { createColumn } from "./board.js";
import { saveBoard } from "./storage.js";
import { showModal } from "./modal.js";

export function setupEventListeners() {
  // Добавление карточки
  document.addEventListener("click", (e) => {
    if (e.target.closest(".add-card-btn")) {
      const columnId = e.target.closest(".add-card-btn").dataset.column;
      showModal("Добавить карточку", (text) => {
        if (text && text.trim()) {
          const card = createCard(text.trim(), columnId);
          document.getElementById(`${columnId}-cards`).appendChild(card);
          saveBoard();
        }
      });
    }

    // Добавление колонки
    if (e.target.id === "add-column-btn") {
      showModal("Название колонки", (title) => {
        if (title && title.trim()) {
          const columnId = `column-${Date.now()}`;
          createColumn(columnId, title.trim());
          saveBoard();
        }
      });
    }

    // Удаление колонки
    if (e.target.closest(".delete-column-btn")) {
      const column = e.target.closest(".column");
      if (confirm("Удалить эту колонку и все карточки внутри?")) {
        column.remove();
        saveBoard();
      }
    }
  });

  // Сохранение при изменении названия колонки
  document.addEventListener(
    "blur",
    (e) => {
      if (e.target.classList.contains("column-title")) {
        saveBoard();
      }
    },
    true
  );
}
