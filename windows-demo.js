const totalWindows = 3;
let currentIndex = 0;

function updateLabel() {
  const label = document.getElementById('window-label');
  if (!label) return;
  label.textContent = `Window ${currentIndex + 1}/${totalWindows}`;
  label.classList.add('pulse');
  setTimeout(() => label.classList.remove('pulse'), 300);
  console.log('stage2-demo: switched to', currentIndex + 1, '/', totalWindows);
}

document.addEventListener('DOMContentLoaded', () => {
  const prev = document.getElementById('window-prev');
  const next = document.getElementById('window-next');
  if (prev) {
    prev.addEventListener('click', () => {
      currentIndex = (currentIndex + totalWindows - 1) % totalWindows;
      updateLabel();
    });
  }
  if (next) {
    next.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalWindows;
      updateLabel();
    });
  }
  updateLabel();
});
