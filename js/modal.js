export function showModal(title, callback, initialValue = "") {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");

  modalTitle.textContent = title;

  // Очищаем тело модального окна
  modalBody.innerHTML = "";

  // Создаем поле ввода в зависимости от типа данных
  if (typeof initialValue === "string") {
    const textarea = document.createElement("textarea");
    textarea.id = "modal-input";
    textarea.rows = 3;
    textarea.value = initialValue;
    modalBody.appendChild(textarea);
  }

  // Показываем модальное окно
  modal.style.display = "flex";

  // Фокус на поле ввода
  setTimeout(() => {
    const input = modalBody.querySelector("textarea, input");
    if (input) input.focus();
  }, 100);

  // Обработчик отправки
  document.getElementById("modal-submit").onclick = () => {
    const input = modalBody.querySelector("textarea, input");
    if (input) {
      callback(input.value);
    }
    modal.style.display = "none";
  };

  // Обработчик отмены
  document.getElementById("modal-cancel").onclick = () => {
    modal.style.display = "none";
  };

  // Закрытие по клику вне модалки
  modal.querySelector(".close-btn").onclick = () => {
    modal.style.display = "none";
  };

  // Закрытие по Escape
  document.addEventListener("keydown", function closeOnEscape(e) {
    if (e.key === "Escape") {
      modal.style.display = "none";
      document.removeEventListener("keydown", closeOnEscape);
    }
  });
}
