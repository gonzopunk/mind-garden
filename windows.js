(function(global){
  function initWindowsState(s){
    if (!s.windows){
      const firstId = 'win-1';
      s.windows = [{id:firstId, plants: s.gallery || []}];
      s.activeWindowId = firstId;
      s.softWindowCap = 3;
      delete s.gallery;
    }
    if (!s.activeWindowId && s.windows.length) s.activeWindowId = s.windows[0].id;
    if (!s.softWindowCap) s.softWindowCap = 3;
  }
  function getActiveWindow(){
    return state.windows.find(w=>w.id===state.activeWindowId);
  }
  function setActiveWindow(id){ state.activeWindowId=id; save(); render(); }
  function canAddWindow(){ return getActiveWindow().plants.length>=4; }
  function addWindow(){
    if (state.windows.length>=state.softWindowCap){ alert('More windows coming soon.'); return; }
    const id = 'win-'+(state.windows.length+1);
    state.windows.push({id, plants:[]});
    setActiveWindow(id);
  }
  function prevWindow(){ const idx=state.windows.findIndex(w=>w.id===state.activeWindowId); if (idx>0) setActiveWindow(state.windows[idx-1].id); }
  function nextWindow(){ const idx=state.windows.findIndex(w=>w.id===state.activeWindowId); if (idx<state.windows.length-1) setActiveWindow(state.windows[idx+1].id); }
  function placePlantToActiveWindow(p, index){
    const w=getActiveWindow();
    const g=w.plants;
    const base = TYPE_HEIGHT[p.flowerStyle] || 0.42;
    const tier = Math.floor(Math.random()*HEIGHT_STEPS.length);
    const h = Math.max(0.34, Math.min(0.62, base + HEIGHT_STEPS[tier]));
    const xPct = (g.length===0)? 50 : Math.max(3, Math.min(97, ((index+1)/(g.length+1) * 94 + 3)));
    g.splice(index,0,{...p, galleryH:h, heightTier:tier, xPct});
  }
  function undoPlacement(){
    const lp=state.__lastPlacement; if (!lp) return;
    const w=state.windows.find(w=>w.id===lp.windowId);
    if (w){ const idx=w.plants.indexOf(lp.plant); if (idx>-1) w.plants.splice(idx,1); }
    state.day.plants[0]=lp.plant;
    state.__lastPlacement=null;
    save(); render();
  }
  global.initWindowsState=initWindowsState;
  global.getActiveWindow=getActiveWindow;
  global.setActiveWindow=setActiveWindow;
  global.canAddWindow=canAddWindow;
  global.addWindow=addWindow;
  global.prevWindow=prevWindow;
  global.nextWindow=nextWindow;
  global.placePlantToActiveWindow=placePlantToActiveWindow;
  global.undoPlacement=undoPlacement;
})(this);
