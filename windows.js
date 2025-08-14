// Simple in-memory window navigation with demo toast

const prevBtn = document.getElementById('window-prev');
const nextBtn = document.getElementById('window-next');
const labelEl = document.getElementById('window-label');
const toastEl = document.getElementById('window-toast');

let currentWindow = 1;
let totalWindows = 1;
let toastTimeout;

function updateLabel(animate = true) {
  if (labelEl) {
    labelEl.textContent = `Window ${currentWindow}/${totalWindows}`;
    if (animate) {
      labelEl.classList.add('pulse');
      setTimeout(() => labelEl.classList.remove('pulse'), 300);
    }
  }
}

function showToast() {
  if (!toastEl) return;
  toastEl.textContent = `Switched to Window ${currentWindow}/${totalWindows} (demo)`;
  toastEl.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 1000);
}

function showPrev() {
  currentWindow = currentWindow === 1 ? totalWindows : currentWindow - 1;
  updateLabel();
  showToast();
}

function showNext() {
  currentWindow = currentWindow === totalWindows ? 1 : currentWindow + 1;
  updateLabel();
  showToast();
}

if (prevBtn) prevBtn.addEventListener('click', showPrev);
if (nextBtn) nextBtn.addEventListener('click', showNext);

updateLabel(false);

export {};

