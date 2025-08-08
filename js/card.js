import { getCurrentBoardState, saveBoard } from "./storage.js";

// Создает новую карточку
export function createCard(text, columnId) {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;
  card.dataset.columnId = columnId;

  card.innerHTML = `
        <div class="card-top">
            <div class="card-text">${text}</div>
            <div class="card-controls">
                <button class="color-btn"><i class="fas fa-palette"></i></button>
                <button class="delete-btn"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="priority-container">
            <span>Приоритет:</span>
            <select class="priority-select">
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
            </select>
        </div>
    `;

  setupCardEvents(card);
  return card;
}

// Настройка обработчиков событий карточки
function setupCardEvents(card) {
  // Drag-and-drop
  card.addEventListener("dragstart", () => card.classList.add("dragging"));
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    saveBoard(getCurrentBoardState());
  });

  // Редактирование текста
  card.querySelector(".card-text").addEventListener("dblclick", function () {
    const newText = prompt("Новый текст:", this.textContent);
    if (newText) {
      this.textContent = newText;
      saveBoard(getCurrentBoardState());
    }
  });

  // Выбор цвета
  card.querySelector(".color-btn").addEventListener("click", function (e) {
    e.stopPropagation();
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.addEventListener("change", () => {
      card.style.backgroundColor = colorPicker.value;
      saveBoard(getCurrentBoardState());
    });
    colorPicker.click();
  });

  // Удаление карточки
  card.querySelector(".delete-btn").addEventListener("click", function (e) {
    e.stopPropagation();
    if (confirm("Удалить карточку?")) {
      card.remove();
      saveBoard(getCurrentBoardState());
    }
  });

  // Изменение приоритета
  card.querySelector(".priority-select").addEventListener("change", () => {
    saveBoard(getCurrentBoardState());
  });
}
