// Simple in-memory window navigation for Stage 2

const prevBtn = document.getElementById('window-prev');
const nextBtn = document.getElementById('window-next');
const labelEl = document.getElementById('window-label');

let currentWindow = 1;
let totalWindows = 3;

function updateLabel(animate = true) {
  if (labelEl) {
    labelEl.textContent = `Window ${currentWindow}/${totalWindows}`;
    if (animate) {
      labelEl.classList.add('pulse');
      setTimeout(() => labelEl.classList.remove('pulse'), 300);
    }
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

updateLabel(false);

export {};

