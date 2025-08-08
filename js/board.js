import { saveToStorage } from "./storage.js";
import { createCard } from "./card.js";

export const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export function initBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  COLUMNS.forEach((column) => {
    createColumn(column.id, column.title);
  });

  setupDragAndDrop();
}

export function createColumn(columnId, title) {
  const board = document.getElementById("board");
  const column = document.createElement("div");
  column.className = "column";
  column.id = columnId;

  column.innerHTML = `
        <div class="column-header">
            <h3 class="column-title">${title}</h3>
            <button class="add-card-btn" data-column="${columnId}">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="cards-container" id="${columnId}-cards"></div>
    `;

  // Настройка событий для заголовка колонки
  column.querySelector(".column-title").addEventListener("click", function () {
    const newTitle = prompt("Новое название:", this.textContent);
    if (newTitle && newTitle.trim()) {
      this.textContent = newTitle.trim();
      saveToStorage();
    }
  });

  board.appendChild(column);
}

function setupDragAndDrop() {
  const board = document.getElementById("board");

  // Настройка событий для колонок
  document.querySelectorAll(".column").forEach((column) => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingCard = document.querySelector(".dragging");
      if (draggingCard) {
        const afterElement = getDragAfterElement(column, e.clientY);
        const cardsContainer = column.querySelector(".cards-container");

        if (afterElement) {
          cardsContainer.insertBefore(draggingCard, afterElement);
        } else {
          cardsContainer.appendChild(draggingCard);
        }
      }
    });
  });

  // Функция для определения позиции при перетаскивании
  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".card:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
}
