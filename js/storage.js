import { DEFAULT_COLUMNS } from "./board.js";
import { createCard } from "./card.js"; // Изменено с board.js на card.js

const STORAGE_KEY = "trello-board-data";

export function saveBoard() {
  const boardData = {
    theme: localStorage.getItem("theme") || "light",
    columns: {},
    lastUpdated: new Date().toISOString(),
  };

  document.querySelectorAll(".column").forEach((column) => {
    const columnId = column.id;
    boardData.columns[columnId] = {
      title: column.querySelector(".column-title").textContent,
      cards: [],
    };

    column.querySelectorAll(".card").forEach((card) => {
      boardData.columns[columnId].cards.push({
        text: card.querySelector(".card-text").textContent,
        color: card.style.backgroundColor || "",
        priority: card.querySelector(".priority-select").value,
      });
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(boardData));
}

export function loadBoard() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) return;

  try {
    const boardData = JSON.parse(savedData);
    const board = document.getElementById("board");

    if (boardData.theme) {
      document.documentElement.setAttribute("data-theme", boardData.theme);
      document.getElementById("theme-toggle").checked =
        boardData.theme === "dark";
    }

    // Создаем колонки из сохраненных данных
    Object.keys(boardData.columns).forEach((columnId) => {
      const columnData = boardData.columns[columnId];

      // Проверяем, не является ли колонка одной из стандартных
      const isDefaultColumn = DEFAULT_COLUMNS.some(
        (col) => col.id === columnId
      );
      if (!isDefaultColumn) {
        createColumn(columnId, columnData.title);
      }

      // Добавляем карточки
      columnData.cards.forEach((cardData) => {
        const card = createCard(cardData.text, columnId);

        if (cardData.color) {
          card.style.backgroundColor = cardData.color;
        }

        const prioritySelect = card.querySelector(".priority-select");
        if (prioritySelect && cardData.priority) {
          prioritySelect.value = cardData.priority;
          card.classList.add(`priority-${cardData.priority}`);
        }

        const cardsContainer = document.getElementById(`${columnId}-cards`);
        if (cardsContainer) {
          cardsContainer.appendChild(card);
        }
      });
    });
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}
