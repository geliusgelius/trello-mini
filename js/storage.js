const STORAGE_KEY = "trello-board-final";

// Сохраняет текущее состояние доски
export function saveBoard(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Загружает данные из localStorage
export function loadBoard() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

// Очищает хранилище
export function clearBoard() {
  localStorage.removeItem(STORAGE_KEY);
}

// Получает текущее состояние доски
export function getCurrentBoardState() {
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
      boardData.columns[columnId].cards.push({
        text: card.querySelector(".card-text").textContent,
        color: card.style.backgroundColor || "",
        priority: card.querySelector(".priority-select").value,
      });
    });
  });

  return boardData;
}
