(function () {
  var STORAGE_KEY = 'mg_windows_v1';
  var prev  = document.getElementById('window-prev');
  var next  = document.getElementById('window-next');
  var add   = document.getElementById('window-add');
  var label = document.getElementById('window-label');
  var view  = document.getElementById('windows-view');
  if (!prev || !next || !add || !label || !view) return;

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; }
    catch(e){ return null; }
  }
  function save(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
  function init() {
    var s = load();
    if (!s || !Array.isArray(s.windows) || !s.windows.length) {
      s = { windows: [ { id: 'win-1', plantIds: [] } ], activeWindowId: 'win-1', softWindowCap: 3 };
      save(s);
    }
    return s;
  }
  function activeIndex(s) {
    var idx = s.windows.findIndex(function(w){ return w.id === s.activeWindowId; });
    return idx < 0 ? 0 : idx;
  }
  function setActiveByIndex(s, idx) {
    var i = ((idx % s.windows.length) + s.windows.length) % s.windows.length;
    s.activeWindowId = s.windows[i].id;
    save(s);
    render(s);
  }
  function addWindow(s) {
    var id = 'win-' + (s.windows.length + 1);
    s.windows.push({ id: id, plantIds: [] });
    s.activeWindowId = id;
    save(s);
    render(s);
  }
  function render(s) {
    var i = activeIndex(s);
    label.textContent = 'Window ' + (i + 1) + '/' + s.windows.length;
    label.classList.remove('pulse'); void label.offsetWidth; label.classList.add('pulse');
    setTimeout(function(){ label.classList.remove('pulse'); }, 250);
    var active = s.windows[i];
    view.textContent = (active.plantIds && active.plantIds.length)
      ? '' // (plants would render here later)
      : 'This windowsill is ready. As your plants mature, place them here.';
  }

  var state = init();
  prev.addEventListener('click', function(){ setActiveByIndex(state, activeIndex(state) - 1); });
  next.addEventListener('click', function(){ setActiveByIndex(state, activeIndex(state) + 1); });
  add .addEventListener('click', function(){ addWindow(state); });
  render(state);
})();
