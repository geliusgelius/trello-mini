const STORAGE_KEY = "trello-board-full";

export function saveToStorage() {
  const boardData = {
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
      const cardData = {
        text: card.querySelector(".card-text")?.textContent || "",
        color: card.style.backgroundColor || "",
        priority: card.classList.contains("priority-high")
          ? "high"
          : card.classList.contains("priority-medium")
          ? "medium"
          : "low",
        deadline: card.querySelector(".deadline-input")?.value || "",
        tags: Array.from(card.querySelectorAll(".tag")).map((tag) =>
          tag.textContent.replace(" ×", "").trim()
        ),
        checklist: Array.from(card.querySelectorAll(".checklist-item")).map(
          (item) => ({
            text: item.querySelector("label")?.textContent || "",
            checked: item.querySelector("input")?.checked || false,
          })
        ),
        columnId: columnId,
      };
      boardData.columns[columnId].cards.push(cardData);
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(boardData));
}

export function loadFromStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) return;

  try {
    const boardData = JSON.parse(savedData);

    // Создаем колонки
    Object.keys(boardData.columns).forEach((columnId) => {
      const columnData = boardData.columns[columnId];
      createColumn(columnId, columnData.title);

      // Восстанавливаем карточки
      columnData.cards.forEach((cardData) => {
        const card = createCard(cardData.text, columnId);

        // Восстанавливаем свойства
        if (cardData.color) card.style.backgroundColor = cardData.color;

        // Приоритет
        const prioritySelect = card.querySelector(".priority-select");
        if (prioritySelect) {
          prioritySelect.value = cardData.priority;
          card.classList.add(`priority-${cardData.priority}`);
        }

        // Дедлайн
        const deadlineInput = card.querySelector(".deadline-input");
        if (deadlineInput && cardData.deadline) {
          deadlineInput.value = cardData.deadline;
          deadlineInput.dispatchEvent(new Event("change"));
        }

        // Теги
        if (cardData.tags && cardData.tags.length > 0) {
          const tagsContainer = card.querySelector(".tags-container");
          cardData.tags.forEach((tagText) => {
            const tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = tagText;

            const removeBtn = document.createElement("span");
            removeBtn.innerHTML = ' <i class="fas fa-times"></i>';
            removeBtn.addEventListener("click", () => {
              tag.remove();
              saveToStorage();
            });

            tag.appendChild(removeBtn);
            tagsContainer.insertBefore(tag, tagsContainer.lastElementChild);
          });
        }

        // Чек-лист
        if (cardData.checklist && cardData.checklist.length > 0) {
          const checklistContainer = card.querySelector(".checklist-container");
          cardData.checklist.forEach((item) => {
            const itemElement = document.createElement("div");
            itemElement.className = "checklist-item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = item.checked;

            const label = document.createElement("label");
            label.textContent = item.text;

            itemElement.appendChild(checkbox);
            itemElement.appendChild(label);
            checklistContainer.insertBefore(
              itemElement,
              checklistContainer.lastElementChild
            );
          });
        }

        document.getElementById(`${columnId}-cards`).appendChild(card);
      });
    });
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}

export function clearStorage() {
  if (confirm("Очистить всю доску? Это действие нельзя отменить.")) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}
