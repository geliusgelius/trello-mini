import { saveBoard } from "./storage.js";

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

function setupCardEvents(card) {
  card.addEventListener("dragstart", () => {
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    saveBoard();
  });

  card.querySelector(".card-text").addEventListener("dblclick", function () {
    const newText = prompt("Редактировать текст:", this.textContent);
    if (newText !== null) {
      this.textContent = newText;
      saveBoard();
    }
  });

  card.querySelector(".color-btn").addEventListener("click", function (e) {
    e.stopPropagation();
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = card.style.backgroundColor || "#ffffff";

    colorPicker.addEventListener("change", function () {
      card.style.backgroundColor = this.value;
      saveBoard();
    });

    colorPicker.click();
  });

  card.querySelector(".delete-btn").addEventListener("click", function (e) {
    e.stopPropagation();
    if (confirm("Удалить эту карточку?")) {
      card.remove();
      saveBoard();
    }
  });

  card
    .querySelector(".priority-select")
    .addEventListener("change", function () {
      card.className = "card";
      card.classList.add(`priority-${this.value}`);
      saveBoard();
    });
}
