export function showModal(title, callback, defaultValue = "") {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  modal.innerHTML = `
        <div class="modal-content">
            <h3>${title}</h3>
            <textarea id="modal-input">${defaultValue}</textarea>
            <div class="modal-actions">
                <button id="modal-cancel">Отмена</button>
                <button id="modal-submit">OK</button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  const input = modal.querySelector("#modal-input");
  input.focus();
  if (defaultValue) input.select();

  const closeModal = () => {
    document.body.removeChild(modal);
    document.removeEventListener("keydown", handleKeyDown);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") closeModal();
  };

  modal.querySelector("#modal-submit").addEventListener("click", () => {
    callback(input.value);
    closeModal();
  });

  modal.querySelector("#modal-cancel").addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", handleKeyDown);
}
