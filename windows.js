const LS_KEY = 'mind-garden-windows';
const DEFAULT_STATE = {
  windows: [{ id: 'win-1', plantIds: [] }],
  activeWindowId: 'win-1',
  softWindowCap: 3
};

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.windows && parsed.activeWindowId) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('windows.js: failed to parse state', e);
  }
  localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_STATE));
  return { ...DEFAULT_STATE };
}

let state = load();

function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function labelIndex() {
  return state.windows.findIndex(w => w.id === state.activeWindowId);
}

function updateLabel() {
  const label = document.getElementById('window-label');
  if (!label) return;
  const idx = labelIndex();
  label.textContent = `Window ${idx + 1}/${state.windows.length}`;
  label.classList.add('pulse');
  setTimeout(() => label.classList.remove('pulse'), 300);
}

function updateView() {
  const view = document.getElementById('windows-view');
  if (!view) return;
  const active = state.windows.find(w => w.id === state.activeWindowId);
  if (!active || active.plantIds.length === 0) {
    view.textContent = 'This windowsill is ready. As your plants mature, place them here.';
  } else {
    view.textContent = '';
  }
}

function switchWindow(offset) {
  const idx = labelIndex();
  const total = state.windows.length;
  const newIdx = (idx + offset + total) % total;
  state.activeWindowId = state.windows[newIdx].id;
  save();
  updateLabel();
  updateView();
}

function addWindow() {
  const nextNum = state.windows.length + 1;
  const newId = `win-${nextNum}`;
  state.windows.push({ id: newId, plantIds: [] });
  state.activeWindowId = newId;
  save();
  updateLabel();
  updateView();
}

document.addEventListener('DOMContentLoaded', () => {
  const prev = document.getElementById('window-prev');
  const next = document.getElementById('window-next');
  const add = document.getElementById('window-add');
  if (prev) prev.addEventListener('click', () => switchWindow(-1));
  if (next) next.addEventListener('click', () => switchWindow(1));
  if (add) add.addEventListener('click', addWindow);
  updateLabel();
  updateView();
});
