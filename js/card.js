import { saveToStorage } from "./storage.js";
import { showModal } from "./modal.js";

export function createCard(text, columnId) {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;
  card.dataset.columnId = columnId;

  // Верхняя часть карточки
  const cardTop = document.createElement("div");
  cardTop.className = "card-top";

  // Текст карточки
  const cardText = document.createElement("div");
  cardText.className = "card-text";
  cardText.textContent = text;

  // Кнопка удаления
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = '<i class="fas fa-times"></i>';

  // Собираем верхнюю часть
  cardTop.appendChild(cardText);
  cardTop.appendChild(deleteBtn);
  card.appendChild(cardTop);

  // Блок приоритета
  const priorityContainer = createPriorityBlock();
  card.appendChild(priorityContainer);

  // Блок дедлайна
  const deadlineContainer = createDeadlineBlock();
  card.appendChild(deadlineContainer);

  // Блок тегов
  const tagsContainer = createTagsBlock();
  card.appendChild(tagsContainer);

  // Блок чек-листа
  const checklistContainer = createChecklistBlock();
  card.appendChild(checklistContainer);

  // Настройка событий
  setupCardEvents(card);

  return card;
}

function createPriorityBlock() {
  const container = document.createElement("div");
  container.className = "priority-container";

  const select = document.createElement("select");
  select.className = "priority-select";

  const options = [
    { value: "low", text: "Низкий" },
    { value: "medium", text: "Средний" },
    { value: "high", text: "Высокий" },
  ];

  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.text;
    select.appendChild(option);
  });

  select.addEventListener("change", function () {
    this.closest(".card").className = "card " + `priority-${this.value}`;
    saveToStorage();
  });

  container.appendChild(select);
  return container;
}

function createDeadlineBlock() {
  const container = document.createElement("div");
  container.className = "deadline-container";

  const input = document.createElement("input");
  input.type = "date";
  input.className = "deadline-input";

  input.addEventListener("change", function () {
    const card = this.closest(".card");
    card.classList.remove(
      "deadline-danger",
      "deadline-warning",
      "deadline-normal"
    );

    if (!this.value) return;

    const deadline = new Date(this.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deadline < today) {
      card.classList.add("deadline-danger");
    } else if (deadline.toDateString() === today.toDateString()) {
      card.classList.add("deadline-warning");
    } else {
      card.classList.add("deadline-normal");
    }

    saveToStorage();
  });

  container.appendChild(document.createTextNode("Дедлайн: "));
  container.appendChild(input);
  return container;
}

function createTagsBlock() {
  const container = document.createElement("div");
  container.className = "tags-container";

  const addBtn = document.createElement("button");
  addBtn.className = "add-tag-btn";
  addBtn.innerHTML = '<i class="fas fa-plus"></i> Тег';

  addBtn.addEventListener("click", function () {
    showModal("Добавить тег", (tagName) => {
      if (tagName && tagName.trim()) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = tagName.trim();

        const removeBtn = document.createElement("span");
        removeBtn.innerHTML = ' <i class="fas fa-times"></i>';
        removeBtn.addEventListener("click", () => {
          tag.remove();
          saveToStorage();
        });

        tag.appendChild(removeBtn);
        container.insertBefore(tag, addBtn);
        saveToStorage();
      }
    });
  });

  container.appendChild(addBtn);
  return container;
}

function createChecklistBlock() {
  const container = document.createElement("div");
  container.className = "checklist-container";

  const addBtn = document.createElement("button");
  addBtn.className = "add-checklist-item";
  addBtn.innerHTML = '<i class="fas fa-plus"></i> Пункт';

  addBtn.addEventListener("click", function () {
    showModal("Добавить пункт чек-листа", (itemText) => {
      if (itemText && itemText.trim()) {
        const item = document.createElement("div");
        item.className = "checklist-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const label = document.createElement("label");
        label.textContent = itemText;

        item.appendChild(checkbox);
        item.appendChild(label);
        container.insertBefore(item, addBtn);
        saveToStorage();
      }
    });
  });

  container.appendChild(addBtn);
  return container;
}

function setupCardEvents(card) {
  // Drag-and-drop
  card.addEventListener("dragstart", () => {
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });

  // Редактирование текста
  card.querySelector(".card-text").addEventListener("dblclick", function () {
    showModal(
      "Редактировать текст",
      (newText) => {
        if (newText !== null) {
          this.textContent = newText;
          saveToStorage();
        }
      },
      this.textContent
    );
  });

  // Удаление карточки
  card.querySelector(".delete-btn").addEventListener("click", function (e) {
    e.stopPropagation();
    if (confirm("Удалить эту карточку?")) {
      card.remove();
      saveToStorage();
    }
  });
}
