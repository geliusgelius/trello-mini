import { initBoard, createColumn } from "./board.js";
import {
  saveBoard,
  loadBoard,
  clearBoard,
  getCurrentBoardState,
} from "./storage.js";
import { setupEventListeners } from "./events.js";
import { createCard } from "./card.js";

document.addEventListener("DOMContentLoaded", () => {
  // Инициализация доски
  initBoard();

  // Загрузка сохраненных данных
  const savedData = loadBoard();
  if (savedData) {
    Object.keys(savedData.columns).forEach((columnId) => {
      const columnData = savedData.columns[columnId];
      createColumn(columnId, columnData.title);

      columnData.cards.forEach((cardData) => {
        const card = createCard(cardData.text, columnId);

        // Восстанавливаем свойства карточки
        if (cardData.color) card.style.backgroundColor = cardData.color;
        if (cardData.priority) {
          const select = card.querySelector(".priority-select");
          if (select) select.value = cardData.priority;
        }

        document.getElementById(`${columnId}-cards`).appendChild(card);
      });
    });
  }

  // Настройка обработчиков событий
  setupEventListeners();

  // Автосохранение каждые 30 секунд
  setInterval(() => {
    saveBoard(getCurrentBoardState());
  }, 30000);
});
