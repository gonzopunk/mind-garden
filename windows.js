const TYPE_HEIGHT = { daisy:0.42, sunflower:0.50, tulip:0.36, lotus:0.46, bell:0.40 };
const HEIGHT_STEPS = [0, 0.12, 0.24];

function migrateIfNeeded(){
  const s = window.state;
  if (!s) return;
  if (!s.windows){
    const firstId = 'win-1';
    s.windows = [{id:firstId, plants:s.gallery || []}];
    s.activeWindowId = firstId;
    s.softWindowCap = 3;
    delete s.gallery;
    window.save && window.save();
  }
  if (!s.activeWindowId && s.windows.length) s.activeWindowId = s.windows[0].id;
  if (!s.softWindowCap) s.softWindowCap = 3;
}

function getActiveWindow(){
  return window.state.windows.find(w=>w.id===window.state.activeWindowId);
}

function setActiveWindow(id){
  window.state.activeWindowId = id;
  window.save && window.save();
  renderToolbar();
  renderView();
  window.render && window.render();
}

function canAddWindow(){
  return getActiveWindow().plants.length>=4;
}

function addWindow(){
  if (window.state.windows.length>=window.state.softWindowCap){
    alert('More windows coming soon.');
    return;
  }
  const id = 'win-'+(window.state.windows.length+1);
  window.state.windows.push({id, plants:[]});
  setActiveWindow(id);
}

function prevWindow(){
  const idx=window.state.windows.findIndex(w=>w.id===window.state.activeWindowId);
  if (idx>0) setActiveWindow(window.state.windows[idx-1].id);
}

function nextWindow(){
  const idx=window.state.windows.findIndex(w=>w.id===window.state.activeWindowId);
  if (idx<window.state.windows.length-1) setActiveWindow(window.state.windows[idx+1].id);
}

function placePlantToActiveWindow(p, index){
  const w=getActiveWindow();
  const g=w.plants;
  const base = TYPE_HEIGHT[p.flowerStyle] || 0.42;
  const tier = Math.floor(Math.random()*HEIGHT_STEPS.length);
  const h = Math.max(0.34, Math.min(0.62, base + HEIGHT_STEPS[tier]));
  const xPct = (g.length===0)? 50 : Math.max(3, Math.min(97, ((index+1)/(g.length+1) * 94 + 3)));
  g.splice(index,0,{...p, galleryH:h, heightTier:tier, xPct});
  window.save && window.save();
  renderView();
}

function undoPlacement(){
  const lp=window.state.__lastPlacement; if (!lp) return;
  const w=window.state.windows.find(w=>w.id===lp.windowId);
  if (w){ const idx=w.plants.indexOf(lp.plant); if (idx>-1) w.plants.splice(idx,1); }
  window.state.day.plants[0]=lp.plant;
  window.state.__lastPlacement=null;
  window.save && window.save();
  renderView();
  window.render && window.render();
}

function renderToolbar(){
  const root=document.getElementById('windows-toolbar');
  if (!root) return;
  const idx = window.state.windows.findIndex(w=>w.id===window.state.activeWindowId);
  const total = window.state.windows.length;
  const canAdd = canAddWindow();
  const addAttr = canAdd ? '' : 'disabled title="Unlock after 4 plants on this windowsill."';
  root.innerHTML = `<button class="btn secondary" id="win-prev" ${idx===0?'disabled':''}>‹</button><div class="label">Window ${idx+1}/${total}</div><button class="btn secondary" id="win-next" ${idx===total-1?'disabled':''}>›</button><button class="btn secondary" id="win-add" ${addAttr}>+ Window</button>`;
  root.querySelector('#win-prev').onclick=()=>prevWindow();
  root.querySelector('#win-next').onclick=()=>nextWindow();
  root.querySelector('#win-add').onclick=()=>{ if (canAdd) addWindow(); else alert('Unlock after 4 plants on this windowsill.'); };
}

function renderView(){
  const root=document.getElementById('windows-view');
  if (!root) return;
  const w=getActiveWindow();
  const g=w.plants||[];
  const plants = g.map((gp,i,arr)=>{
    const h = gp.galleryH!=null ? gp.galleryH : 0.5;
    const x = gp.xPct!=null ? gp.xPct : ((i+1)/(arr.length+1)*94+3);
    return `<div class=\"drag-plant ${window.state.arrangeMode? 'is-arrange':''}\" data-gindex=\"${i}\" data-xpct=\"${x}\" style=\"height: calc(var(--win-h) * ${h}); left:0px;\"><div style=\"width:100%; height:92%; display:flex; align-items:flex-end; justify-content:center; overflow:visible\"><div>${window.plantSVG ? window.plantSVG({...gp, growth:100}) : ''}</div></div></div>`;
  }).join('');
  const empty = g.length===0 ? `<div class="sign"><p>This windowsill is ready. As your plants mature, place them here.</p></div>` : '';
  root.innerHTML = `<div class="window" id="window-el"><div class="sky" id="sky-bg"></div><div id="sun" class="sun"></div><div id="moon" class="moon"></div><div id="clouds1" class="cloud-band" style="top: 40px; animation: cloudRL1 120s linear infinite"></div><div id="clouds2" class="cloud-band" style="top: calc(((var(--win-h) - var(--ground-h)) * 0.35) - 60px); animation: cloudRL2 180s linear infinite"></div><div class="ground"></div><div class="mullion-h"></div><div class="mullion-v"></div><div class="frame"></div><div class="sill"></div><div class="window-inner"><div class="gallery-layer" id="gallery-layer">${plants}</div></div></div>${empty}`;
  window.positionAstronomy && window.positionAstronomy();
}

function bootstrap(){
  migrateIfNeeded();
  renderToolbar();
  renderView();
}

document.addEventListener('DOMContentLoaded', bootstrap);

window.getActiveWindow = getActiveWindow;
window.setActiveWindow = setActiveWindow;
window.canAddWindow = canAddWindow;
window.addWindow = addWindow;
window.prevWindow = prevWindow;
window.nextWindow = nextWindow;
window.placePlantToActiveWindow = placePlantToActiveWindow;
window.undoPlacement = undoPlacement;
window.renderToolbar = renderToolbar;
window.renderView = renderView;
window.migrateWindowsState = migrateIfNeeded;
