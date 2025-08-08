export function showModal(title, callback, initialValue = "") {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");

  modalBody.innerHTML = `
        <h3>${title}</h3>
        <textarea id="modal-input" rows="3">${initialValue}</textarea>
        <button id="modal-submit">OK</button>
    `;

  modal.style.display = "block";

  // Обработчик отправки
  document.getElementById("modal-submit").addEventListener("click", () => {
    const value = document.getElementById("modal-input").value;
    modal.style.display = "none";
    if (value) callback(value);
  });

  // Закрытие по клику вне модалки
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.style.display = "none";
    }
  });

  // Фокус на поле ввода
  setTimeout(() => {
    document.getElementById("modal-input").focus();
  }, 100);
}
