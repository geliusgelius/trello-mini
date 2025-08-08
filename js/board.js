import { saveBoard } from "./storage.js";

export const DEFAULT_COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export function createColumn(columnId, title) {
  const board = document.getElementById("board");

  if (document.getElementById(columnId)) {
    console.warn(`Column with ID "${columnId}" already exists`);
    return null;
  }

  const column = document.createElement("div");
  column.className = "column";
  column.id = columnId;

  column.innerHTML = `
        <div class="column-header">
            <h3 class="column-title">${title}</h3>
            <button class="delete-column-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="cards-container" id="${columnId}-cards"></div>
        <button class="add-card-btn" data-column="${columnId}">
            <i class="fas fa-plus"></i> Add a card
        </button>
    `;

  board.appendChild(column);
  setupDragAndDrop(column);
  return column;
}

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

export function initBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  DEFAULT_COLUMNS.forEach((column) => {
    createColumn(column.id, column.title);
  });
}
