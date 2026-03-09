// ===== 25_script_25.js =====

/* ===== Cooldowns reset per battle ===== */
(function(){
  function resetAllBattleCooldowns(){
    try{
      if(!G?.player?.abilities) return;
      for(const ab of G.player.abilities){
        if(!ab) continue;
        // clear common cooldown fields used by the game
        if('cooldown' in ab) ab.cooldown = 0;
        if('cooldownLeft' in ab) ab.cooldownLeft = 0;
        if('cd' in ab) ab.cd = 0;
        if('currentCooldown' in ab) ab.currentCooldown = 0;
        if('remainingCooldown' in ab) ab.remainingCooldown = 0;
      }
      if(G.playerCooldowns && typeof G.playerCooldowns === 'object'){
        Object.keys(G.playerCooldowns).forEach(k => G.playerCooldowns[k] = 0);
      }
      if(G.cooldowns && typeof G.cooldowns === 'object'){
        Object.keys(G.cooldowns).forEach(k => G.cooldowns[k] = 0);
      }
    }catch(err){ console.error(err); }
  }

  globalThis.resetAllBattleCooldowns = resetAllBattleCooldowns;

  const _oldStartBattle = globalThis.startBattle;
  if(typeof _oldStartBattle === 'function'){
    globalThis.startBattle = function(){
      const out = _oldStartBattle.apply(this, arguments);
      resetAllBattleCooldowns();
      try{
        if(typeof renderActions === 'function') renderActions();
        if(typeof refreshBattleUI === 'function') refreshBattleUI();
      }catch(err){ console.error(err); }
      return out;
    };
  }

  const _oldStartBlakistonDebugBattle = globalThis.startBlakistonDebugBattle;
  if(typeof _oldStartBlakistonDebugBattle === 'function'){
    globalThis.startBlakistonDebugBattle = function(){
      const out = _oldStartBlakistonDebugBattle.apply(this, arguments);
      resetAllBattleCooldowns();
      try{
        if(typeof renderActions === 'function') renderActions();
        if(typeof refreshBattleUI === 'function') refreshBattleUI();
      }catch(err){ console.error(err); }
      return out;
    };
  }

  const _oldBeginAscent = globalThis.beginAscent;
  if(typeof _oldBeginAscent === 'function'){
    globalThis.beginAscent = function(){
      const out = _oldBeginAscent.apply(this, arguments);
      try{ resetAllBattleCooldowns(); }catch(err){ console.error(err); }
      return out;
    };
  }

  // Also hook the first UI refresh of a newly spawned enemy so cooldowns never leak between fights.
  const _oldRefreshBattleUI = globalThis.refreshBattleUI;
  if(typeof _oldRefreshBattleUI === 'function'){
    globalThis.refreshBattleUI = function(){
      try{
        if(G?.enemy && G.enemy !== G._lastCooldownResetEnemy){
          G._lastCooldownResetEnemy = G.enemy;
          resetAllBattleCooldowns();
        }
      }catch(err){ console.error(err); }
      return _oldRefreshBattleUI.apply(this, arguments);
    };
  }
})();


// ===== 26_script_26.js =====

/* ===== Upgrade audit fixes + 3x3 Stork Shop ===== */
(function(){
  const ENERGY_CAP = 7;

  function isEnergyItem(item){
    const t = (((item && item.name) || '') + ' ' + ((item && item.desc) || '') + ' ' + ((item && item.id) || '')).toLowerCase();
    return /energy|max energy|lung|lungs/.test(t);
  }

  function markRemoved(item){
    if(item) item._removed = true;
  }

  function markUniqueRun(item){
    if(!item || item.__uniqueRunWrapped) return;
    const oldApply = item.apply;
    item.apply = function(p){
      if(!G._runShopFlags) G._runShopFlags = {};
      if(G._runShopFlags[item.id]) return;
      G._runShopFlags[item.id] = true;
      oldApply && oldApply(p);
      if(typeof computePlayerMaxEnergy === 'function'){
        p.energyMax = Math.min(ENERGY_CAP, computePlayerMaxEnergy());
      } else {
        p.energyMax = Math.min(ENERGY_CAP, p.energyMax || 0);
      }
      if(typeof p.energy !== 'number') p.energy = p.energyMax;
      p.energy = Math.min(p.energy, p.energyMax);
    };
    item.__uniqueRunWrapped = true;
  }

  function auditPool(pool){
    if(!Array.isArray(pool)) return pool;
    for(const item of pool){
      if(!item) continue;
      const t = (((item.name||'') + ' ' + (item.desc||'') + ' ' + (item.id||'')).toLowerCase());

      // Remove Quick Breath and first-turn EN style items
      if(/quick breath|warm nest|hot blood/.test(t) || /first turn.*energy/.test(t) || /start battle.*\+1 energy/.test(t)){
        markRemoved(item);
        continue;
      }

      // Accuracy economy nerfs
      if(/keen sight/.test(t)) item.desc = 'All skills have 2% less miss chance.';
      if(/falcon focus/.test(t)) item.desc = 'All skills have 4% less miss chance.';
      if(/true sight/.test(t)) item.desc = 'All skills have 8% less miss chance.';

      // Energy economy rules
      if(isEnergyItem(item)){
        if(/sun.?blessed lungs/.test(t) || /\+3 max energy/.test(t)){
          item.tier = 'gold';
          item.desc = '+2 Max Energy. Unique this run.';
          markUniqueRun(item);
        } else if(/second lung/.test(t) || /third lung/.test(t) || /r_energymax1/.test(t) || /e_energymax2/.test(t) || /\+1 max energy/.test(t)){
          item.tier = 'purple';
          item.desc = '+1 Max Energy. Unique this run.';
          markUniqueRun(item);
        } else if(/green|blue/.test(item.tier||'')){
          markRemoved(item);
        }
      }
    }
    return pool.filter(x => x && !x._removed);
  }

  // Normalize shop costs per audit
  if(globalThis.SHOP_COSTS){
    SHOP_COSTS.grey = 4;
    SHOP_COSTS.green = 4;
    SHOP_COSTS.blue = 6;
    SHOP_COSTS.purple = 9;
    SHOP_COSTS.gold = 14;
  }

  // Audit current upgrade pool source every time it's requested.
  const _oldGetUpgradePool = globalThis.getUpgradePool;
  if(typeof _oldGetUpgradePool === 'function'){
    globalThis.getUpgradePool = function(){
      let pool = _oldGetUpgradePool.apply(this, arguments) || [];
      pool = auditPool(pool);

      // Enforce energy uniqueness visibility per run
      if(!G._runShopFlags) G._runShopFlags = {};
      pool = pool.filter(item => !(isEnergyItem(item) && G._runShopFlags[item.id]));

      return pool;
    };
  }

  // 3x3 Stork Shop
  globalThis.generateShopItems = function(){
    _shopItems = [];
    const used = new Set();

    // Top row: 3 abilities
    for(let i=0;i<3;i++){
      const offer = typeof makeAbilityOffer === 'function' ? makeAbilityOffer(true) : null;
      if(offer) _shopItems.push(offer);
    }

    // Middle row: 3 grey/green upgrades
    for(let i=0;i<3;i++){
      const pick = (typeof pickUniqueRewardByTier === 'function' ? pickUniqueRewardByTier('grey', used) : null)
        || (typeof pickUniqueRewardByTier === 'function' ? pickUniqueRewardByTier('green', used) : null)
        || (typeof pickUniqueRewardByTier === 'function' ? pickUniqueRewardByTier('blue', used) : null);
      if(pick && !pick._removed) _shopItems.push(pick);
    }

    // Bottom row: 3 blue/purple, small gold chance
    for(let i=0;i<3;i++){
      const tier = typeof rollShopTier === 'function' ? rollShopTier({blue:58,purple:34,gold:8}) : 'blue';
      const pick = (typeof pickUniqueRewardByTier === 'function' ? pickUniqueRewardByTier(tier, used) : null)
        || (typeof pickUniqueRewardByTier === 'function' ? pickUniqueRewardByTier('purple', used) : null)
        || (typeof pickUniqueRewardByTier === 'function' ? pickUniqueRewardByTier('blue', used) : null);
      if(pick && !pick._removed) _shopItems.push(pick);
    }

    // Remove items banned by audit and rerender
    _shopItems = _shopItems.filter(item => item && !item._removed && !(isEnergyItem(item) && G._runShopFlags && G._runShopFlags[item.id]));
    if(typeof renderShopItems === 'function') renderShopItems();
  };

  // Add row labels for 3x3 layout
  const _oldRenderShopItems = globalThis.renderShopItems;
  if(typeof _oldRenderShopItems === 'function'){
    globalThis.renderShopItems = function(){
      const out = _oldRenderShopItems.apply(this, arguments);
      try{
        const grid = document.getElementById('shop-items-grid');
        if(!grid) return out;
        const cards = [...grid.querySelectorAll('.shop-item')];
        grid.querySelectorAll('.shop-row-label').forEach(x=>x.remove());
        const labels = [
          {idx:0, text:'ABILITIES'},
          {idx:3, text:'UPGRADES'},
          {idx:6, text:'RARE'}
        ];
        labels.reverse().forEach(l=>{
          if(cards[l.idx]){
            const div = document.createElement('div');
            div.className = 'shop-row-label';
            div.textContent = l.text;
            grid.insertBefore(div, cards[l.idx]);
          }
        });
      }catch(err){ console.error(err); }
      return out;
    };
  }
})();


// ===== 32_penguin-realistic-sheet-script-patch.js =====

(() => {
  const selectSizeForCard = (bird) => {
    try {
      if (typeof resolveBirdSpriteClass === 'function') return resolveBirdSpriteClass(bird, 'select');
    } catch (_) {}
    const raw = String(bird?.size || bird?.birdSize || '').toLowerCase();
    if (raw.includes('tiny')) return 'tiny';
    if (raw.includes('small')) return 'small';
    if (raw.includes('xlarge') || raw.includes('xl')) return 'xl';
    if (raw.includes('large')) return 'large';
    return 'medium';
  };

  if (typeof globalThis.buildBirdCard === 'function') {
    const previous = globalThis.buildBirdCard;
    globalThis.buildBirdCard = function(key, bird, locked, globalMax) {
      const card = previous.apply(this, arguments);
      try {
        const portrait = card && card.querySelector ? card.querySelector('.bird-portrait') : null;
        if (!portrait || typeof renderBirdIconHTML !== 'function') return card;
        const sizeClass = selectSizeForCard(bird);
        portrait.innerHTML = renderBirdIconHTML(key, sizeClass, locked);
        if (!locked) {
          card.addEventListener('mouseenter', () => {
            const s = portrait.querySelector('.sprite4');
            if (!s) return;
            s.classList.remove('frame-0','frame-1','frame-2','frame-3');
            s.classList.add('frame-1');
          }, { passive:true });
          card.addEventListener('mouseleave', () => {
            const s = portrait.querySelector('.sprite4');
            if (!s) return;
            s.classList.remove('frame-0','frame-1','frame-2','frame-3');
            s.classList.add('frame-0');
          }, { passive:true });
        }
      } catch (_) {}
      return card;
    };
  }
})();


