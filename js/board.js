import { saveBoard, getCurrentBoardState } from "./storage.js";

export const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

// Создает новую колонку
export function createColumn(columnId, title) {
  const board = document.getElementById("board");
  const column = document.createElement("div");
  column.className = "column";
  column.id = columnId;

  column.innerHTML = `
        <div class="column-header">
            <h3 class="column-title" contenteditable="true">${title}</h3>
            <button class="delete-column-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="cards-container" id="${columnId}-cards"></div>
        <button class="add-card-btn" data-column="${columnId}">
            <i class="fas fa-plus"></i> Добавить карточку
        </button>
    `;

  // Удаление колонки
  column.querySelector(".delete-column-btn").addEventListener("click", () => {
    if (confirm("Удалить колонку и все карточки?")) {
      column.remove();
      saveBoard(getCurrentBoardState());
    }
  });

  board.appendChild(column);
  setupDragAndDrop(column);
  return column;
}

// Настройка drag-and-drop для колонки
function setupDragAndDrop(column) {
  const cardsContainer = column.querySelector(".cards-container");

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggingCard = document.querySelector(".dragging");
    if (draggingCard) {
      const afterElement = getDragAfterElement(cardsContainer, e.clientY);
      if (afterElement) {
        cardsContainer.insertBefore(draggingCard, afterElement);
      } else {
        cardsContainer.appendChild(draggingCard);
      }
    }
  });
}

// Инициализация доски
export function initBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  COLUMNS.forEach((column) => {
    createColumn(column.id, column.title);
  });
}

// Вспомогательная функция для определения позиции при переносе
function getDragAfterElement(container, y) {
  const cards = [...container.querySelectorAll(".card:not(.dragging)")];
  return cards.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      return offset < 0 && offset > closest.offset
        ? { offset: offset, element: child }
        : closest;
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
