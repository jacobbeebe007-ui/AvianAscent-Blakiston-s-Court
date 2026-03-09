// ===== 02_seagull-animation-script-patch.js =====

/* ===== Seagull animation hooks ===== */
(function(){
  function getSeagullEl(){
    return document.querySelector('#enemy-avatar .sprite-seagull, #player-avatar .sprite-seagull, .sprite-seagull');
  }

  function clearSeagullAnim(el){
    if(!el) return;
    el.classList.remove(
      'frame-0','frame-1','frame-2','frame-3',
      'seagull-idle-anim','seagull-call-anim','seagull-dash-anim'
    );
  }

  function setSeagullState(state){
    const els = document.querySelectorAll('.sprite-seagull');
    els.forEach(el=>{
      clearSeagullAnim(el);
      if(state === 'call'){
        el.classList.add('frame-1','seagull-call-anim');
      }else if(state === 'dash'){
        el.classList.add('frame-2','seagull-dash-anim');
      }else if(state === 'power'){
        el.classList.add('frame-3');
      }else{
        el.classList.add('frame-0','seagull-idle-anim');
      }
    });
  }

  const _oldRefreshBattleUI = globalThis.refreshBattleUI;
  if(typeof _oldRefreshBattleUI === 'function'){
    globalThis.refreshBattleUI = function(){
      const out = _oldRefreshBattleUI.apply(this, arguments);
      try{
        setSeagullState('idle');
      }catch(err){ console.error(err); }
      return out;
    };
  }

  const _oldRenderEnemyPlan = globalThis.renderEnemyPlan;
  if(typeof _oldRenderEnemyPlan === 'function'){
    globalThis.renderEnemyPlan = function(){
      const out = _oldRenderEnemyPlan.apply(this, arguments);
      try{
        const enemyName = String(globalThis.G?.enemy?.name || '').toLowerCase();
        if(!enemyName.includes('seagull')) return out;

        const label = String(globalThis.G?.enemyNextAction?.label || '').toLowerCase();
        if(/call|shriek|summon|mob|flock/.test(label)){
          setSeagullState('call');
        }else if(/dash|dart|swoop|rush|strike|dive/.test(label)){
          setSeagullState('dash');
        }else if(/power|buff|stance|charge/.test(label)){
          setSeagullState('power');
        }else{
          setSeagullState('idle');
        }
      }catch(err){ console.error(err); }
      return out;
    };
  }

  const _oldEnemyTurn = globalThis.enemyTurn;
  if(typeof _oldEnemyTurn === 'function'){
    globalThis.enemyTurn = async function(){
      try{
        const enemyName = String(globalThis.G?.enemy?.name || '').toLowerCase();
        if(enemyName.includes('seagull')){
          const label = String(globalThis.G?.enemyNextAction?.label || '').toLowerCase();
          if(/call|shriek|summon|mob|flock/.test(label)){
            setSeagullState('call');
          }else if(/dash|dart|swoop|rush|strike|dive/.test(label)){
            setSeagullState('dash');
          }else{
            setSeagullState('idle');
          }
        }
      }catch(err){ console.error(err); }
      return await _oldEnemyTurn.apply(this, arguments);
    };
  }

  // Select-screen hover polish for seagull cards
  document.addEventListener('mouseover', function(ev){
    const card = ev.target && ev.target.closest ? ev.target.closest('.bird-card, .ascent-panel-portrait, .ascent-face') : null;
    if(!card) return;
    const s = card.querySelector('.sprite-seagull');
    if(!s) return;
    clearSeagullAnim(s);
    s.classList.add('frame-1','seagull-call-anim');
  }, true);

  document.addEventListener('mouseout', function(ev){
    const card = ev.target && ev.target.closest ? ev.target.closest('.bird-card, .ascent-panel-portrait, .ascent-face') : null;
    if(!card) return;
    const s = card.querySelector('.sprite-seagull');
    if(!s) return;
    clearSeagullAnim(s);
    s.classList.add('frame-0','seagull-idle-anim');
  }, true);

  // Initialize any visible seagulls into idle state
  try{ setSeagullState('idle'); }catch(err){ console.error(err); }
})();


// ===== 03_all-birds-menu-animation-script-patch.js =====

/* ===== All birds generic sprite animation hooks ===== */
(function(){
  function isSprite(el){
    return !!(el && el.classList && el.classList.contains('sprite4'));
  }

  function setFrame(el, frame){
    if(!isSprite(el)) return;
    el.classList.remove('frame-0','frame-1','frame-2','frame-3');
    el.classList.add(frame || 'frame-0');
  }

  function clearMenuAnim(el){
    if(!isSprite(el)) return;
    el.classList.remove('menu-idle-anim','menu-hover-anim','menu-dash-anim');
  }

  function applyIdle(el){
    if(!isSprite(el)) return;
    clearMenuAnim(el);
    setFrame(el, 'frame-0');
    el.classList.add('menu-idle-anim');
  }

  function applyHover(el){
    if(!isSprite(el)) return;
    clearMenuAnim(el);
    setFrame(el, 'frame-1');
    el.classList.add('menu-hover-anim');
  }

  function applyDash(el){
    if(!isSprite(el)) return;
    clearMenuAnim(el);
    setFrame(el, 'frame-2');
    el.classList.add('menu-dash-anim');
  }

  function applyPower(el){
    if(!isSprite(el)) return;
    clearMenuAnim(el);
    setFrame(el, 'frame-3');
  }

  function spriteForContainer(container){
    if(!container || !container.querySelector) return null;
    return container.querySelector('.sprite4');
  }

  function applyIdleToVisibleMenuSprites(){
    document.querySelectorAll(
      '.bird-card .sprite4, .bird-portrait .sprite4, .ascent-panel-portrait .sprite4, .ascent-face .sprite4, .ascent-card .sprite4, .select-panel .sprite4'
    ).forEach(applyIdle);
  }

  // Menu/select hover behavior for all bird sprites
  document.addEventListener('mouseover', function(ev){
    const container = ev.target && ev.target.closest
      ? ev.target.closest('.bird-card, .bird-portrait, .ascent-panel-portrait, .ascent-face, .ascent-card, .select-panel')
      : null;
    if(!container) return;
    const s = spriteForContainer(container);
    if(!s) return;
    applyHover(s);
  }, true);

  document.addEventListener('mouseout', function(ev){
    const container = ev.target && ev.target.closest
      ? ev.target.closest('.bird-card, .bird-portrait, .ascent-panel-portrait, .ascent-face, .ascent-card, .select-panel')
      : null;
    if(!container) return;
    const s = spriteForContainer(container);
    if(!s) return;
    applyIdle(s);
  }, true);

  // Touch/click polish: brief dash then return to idle
  document.addEventListener('click', function(ev){
    const container = ev.target && ev.target.closest
      ? ev.target.closest('.bird-card, .bird-portrait, .ascent-panel-portrait, .ascent-face, .ascent-card, .select-panel')
      : null;
    if(!container) return;
    const s = spriteForContainer(container);
    if(!s) return;
    applyDash(s);
    setTimeout(()=>applyIdle(s), 260);
  }, true);

  // Keep select-screen cards animated after rebuilds
  const _oldBuildBirdCard = globalThis.buildBirdCard;
  if(typeof _oldBuildBirdCard === 'function'){
    globalThis.buildBirdCard = function(){
      const card = _oldBuildBirdCard.apply(this, arguments);
      try{
        const s = card && card.querySelector ? card.querySelector('.sprite4') : null;
        if(s) applyIdle(s);
      }catch(err){ console.error(err); }
      return card;
    };
  }

  const _oldInitSelectionSafe = globalThis.initSelectionSafe;
  if(typeof _oldInitSelectionSafe === 'function'){
    globalThis.initSelectionSafe = function(){
      const out = _oldInitSelectionSafe.apply(this, arguments);
      try{ applyIdleToVisibleMenuSprites(); }catch(err){ console.error(err); }
      return out;
    };
  }

  // Battle-side generic intent mapping for all birds that use sprite sheets
  function battleSpriteFor(side){
    const host = side === 'enemy'
      ? document.querySelector('#enemy-avatar .sprite4')
      : document.querySelector('#player-avatar .sprite4');
    return host || null;
  }

  function animateBattleSpriteFromIntent(side){
    const el = battleSpriteFor(side);
    if(!el) return;
    const label = side === 'enemy'
      ? String(globalThis.G?.enemyNextAction?.label || '').toLowerCase()
      : '';
    clearMenuAnim(el);
    if(side === 'enemy'){
      if(/call|song|summon|shriek|dirge|buff|chant|flock/.test(label)){
        setFrame(el, 'frame-1');
        el.classList.add('menu-hover-anim');
      }else if(/dash|dart|swoop|rush|strike|dive|slash|rake|peck|jab/.test(label)){
        setFrame(el, 'frame-2');
        el.classList.add('menu-dash-anim');
      }else if(/power|stance|charge|guard|bulwark|roost|focus/.test(label)){
        setFrame(el, 'frame-3');
      }else{
        setFrame(el, 'frame-0');
        el.classList.add('menu-idle-anim');
      }
    }else{
      setFrame(el, 'frame-0');
      el.classList.add('menu-idle-anim');
    }
  }

  const _oldRenderEnemyPlanGeneric = globalThis.renderEnemyPlan;
  if(typeof _oldRenderEnemyPlanGeneric === 'function'){
    globalThis.renderEnemyPlan = function(){
      const out = _oldRenderEnemyPlanGeneric.apply(this, arguments);
      try{ animateBattleSpriteFromIntent('enemy'); }catch(err){ console.error(err); }
      return out;
    };
  }

  const _oldRefreshBattleUIGeneric = globalThis.refreshBattleUI;
  if(typeof _oldRefreshBattleUIGeneric === 'function'){
    globalThis.refreshBattleUI = function(){
      const out = _oldRefreshBattleUIGeneric.apply(this, arguments);
      try{
        animateBattleSpriteFromIntent('enemy');
        const p = battleSpriteFor('player');
        if(p){ clearMenuAnim(p); setFrame(p, 'frame-0'); p.classList.add('menu-idle-anim'); }
        applyIdleToVisibleMenuSprites();
      }catch(err){ console.error(err); }
      return out;
    };
  }

  // Initial pass
  try{ applyIdleToVisibleMenuSprites(); }catch(err){ console.error(err); }
})();


// ===== 31_peregrine-snowyowl-menu-fix-and-living-motion.js =====

(function(){
  function normalizeBirdEntity(e){
    if(!e) return;
    const nm = String(e.name || '').toLowerCase();
    const pk = String(e.portraitKey || '').toLowerCase();
    const bk = String(e.birdKey || '').toLowerCase();
    const id = String(e.id || '').toLowerCase();

    if(nm === 'peregrine falcon' || nm === 'peregrine' || pk === 'peregrinefalcon' || pk === 'peregrine' || bk === 'peregrinefalcon' || bk === 'peregrine' || id === 'peregrinefalcon' || id === 'peregrine'){
      e.sprite = 'peregrine';
      e.portraitKey = 'peregrine';
      e.birdKey = 'peregrine';
      e.id = 'peregrine';
    }
    if(nm === 'snowy owl' || nm === 'snowyowl' || pk === 'snowy owl' || pk === 'snowyowl' || bk === 'snowy owl' || bk === 'snowyowl' || id === 'snowy owl' || id === 'snowyowl'){
      e.sprite = 'snowyowl';
      e.portraitKey = 'snowyowl';
      e.birdKey = 'snowyowl';
      e.id = 'snowyowl';
    }
  }

  function fixAllBirdData(){
    try{
      if(globalThis.BIRDS && typeof globalThis.BIRDS === 'object') Object.values(globalThis.BIRDS).forEach(normalizeBirdEntity);
      if(globalThis.ENEMIES && typeof globalThis.ENEMIES === 'object'){
        if(Array.isArray(globalThis.ENEMIES)) globalThis.ENEMIES.forEach(normalizeBirdEntity);
        else Object.values(globalThis.ENEMIES).forEach(normalizeBirdEntity);
      }
      if(globalThis.G?.player) normalizeBirdEntity(globalThis.G.player);
      if(globalThis.G?.enemy) normalizeBirdEntity(globalThis.G.enemy);
    }catch(err){ console.error(err); }
  }

  const oldBuildBirdCard = globalThis.buildBirdCard;
  if(typeof oldBuildBirdCard === 'function'){
    globalThis.buildBirdCard = function(key, bird, locked, globalMax){
      normalizeBirdEntity(bird);
      const card = oldBuildBirdCard.apply(this, arguments);
      try{
        const lowerKey = String(key || '').toLowerCase().replace(/[^a-z]/g,'');
        let spriteKey = null;
        if(lowerKey === 'peregrine' || lowerKey === 'peregrinefalcon' || /peregrine falcon/i.test(bird?.name||'')) spriteKey = 'peregrine';
        if(lowerKey === 'snowyowl' || lowerKey === 'snowy' || /snowy owl/i.test(bird?.name||'')) spriteKey = 'snowyowl';
        if(spriteKey){
          const wrap = [...card.querySelectorAll('div')].find(el => {
            const html = el.innerHTML || '';
            return html.includes('bird-emo') || html.includes('bird-fallback-svg') || html.includes('sprite-' + spriteKey);
          });
          if(wrap){
            wrap.innerHTML = `<div class="sprite4 small sprite-${spriteKey} frame-0 ${locked?'locked':''}"></div>`;
            wrap.style.display = 'flex';
            wrap.style.justifyContent = 'center';
            wrap.style.margin = '2px auto 6px';
          }
        }
      }catch(err){ console.error(err); }
      return card;
    };
  }

  const oldRenderBirdIconHTML = globalThis.renderBirdIconHTML;
  if(typeof oldRenderBirdIconHTML === 'function'){
    globalThis.renderBirdIconHTML = function(birdKey, sizeClass, locked){
      const k = String(birdKey || '').toLowerCase().replace(/[^a-z]/g,'');
      if(k === 'peregrine' || k === 'peregrinefalcon'){
        return `<div class="sprite4 ${sizeClass||''} sprite-peregrine frame-0 ${locked?'locked':''}"></div>`;
      }
      if(k === 'snowyowl' || k === 'snowy'){
        return `<div class="sprite4 ${sizeClass||''} sprite-snowyowl frame-0 ${locked?'locked':''}"></div>`;
      }
      return oldRenderBirdIconHTML.apply(this, arguments);
    };
  }

  const oldRenderEntityAvatarHTML = globalThis.renderEntityAvatarHTML;
  if(typeof oldRenderEntityAvatarHTML === 'function'){
    globalThis.renderEntityAvatarHTML = function(entity, context='battle', locked=false){
      normalizeBirdEntity(entity);
      const k = String(entity?.portraitKey || entity?.birdKey || entity?.id || '').toLowerCase().replace(/[^a-z]/g,'');
      const sizeClass = (typeof getUISizeClass === 'function') ? getUISizeClass(entity, context) : '';
      if(k === 'peregrine' || k === 'peregrinefalcon'){
        return `<div class="sprite4 ${sizeClass||''} sprite-peregrine frame-0 ${locked?'locked':''}"></div>`;
      }
      if(k === 'snowyowl' || k === 'snowy'){
        return `<div class="sprite4 ${sizeClass||''} sprite-snowyowl frame-0 ${locked?'locked':''}"></div>`;
      }
      return oldRenderEntityAvatarHTML.apply(this, arguments);
    };
  }

  const oldBuildBirdGrid = globalThis.buildBirdGrid;
  if(typeof oldBuildBirdGrid === 'function'){
    globalThis.buildBirdGrid = function(){
      fixAllBirdData();
      return oldBuildBirdGrid.apply(this, arguments);
    };
  }

  const oldInitSelectionSafe = globalThis.initSelectionSafe;
  if(typeof oldInitSelectionSafe === 'function'){
    globalThis.initSelectionSafe = function(){
      fixAllBirdData();
      return oldInitSelectionSafe.apply(this, arguments);
    };
  }

  const oldRefreshBattleUI = globalThis.refreshBattleUI;
  if(typeof oldRefreshBattleUI === 'function'){
    globalThis.refreshBattleUI = function(){
      fixAllBirdData();
      return oldRefreshBattleUI.apply(this, arguments);
    };
  }

  document.addEventListener('DOMContentLoaded', fixAllBirdData);
  fixAllBirdData();
})();


