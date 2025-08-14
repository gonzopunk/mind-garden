// Simple in-memory window navigation

const prevBtn = document.getElementById('window-prev');
const nextBtn = document.getElementById('window-next');
const labelEl = document.getElementById('window-label');

let currentWindow = 1;
let totalWindows = 1;

function updateLabel() {
  if (labelEl) {
    labelEl.textContent = `Window ${currentWindow}/${totalWindows}`;
  }
}

function showPrev() {
  currentWindow = currentWindow === 1 ? totalWindows : currentWindow - 1;
  updateLabel();
}

function showNext() {
  currentWindow = currentWindow === totalWindows ? 1 : currentWindow + 1;
  updateLabel();
}

if (prevBtn) prevBtn.addEventListener('click', showPrev);
if (nextBtn) nextBtn.addEventListener('click', showNext);

updateLabel();

export {};

