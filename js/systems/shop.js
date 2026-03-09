// ===== 27_oai-bugfix-bowedwing-shop-unlocks.js =====

(function(){
  // ---------- Bowed Wing reliability ----------
  if(typeof globalThis.applySlowToEnemy !== 'function'){
    globalThis.applySlowToEnemy = function(percentLike, turnsLike, weakenChanceLike){
      try{
        const spdPenalty = Math.max(1, Math.round((turnsLike || 2))); // keeps old authored values meaningful
        const dodgePenalty = Math.max(5, Math.round(percentLike || 10));
        if(typeof globalThis.applyEnemySlow === 'function'){
          globalThis.applyEnemySlow(spdPenalty, dodgePenalty, 2 + (weakenChanceLike ? 1 : 0));
        }else{
          const st = globalThis.G.enemyStatus || (globalThis.G.enemyStatus = {});
          const en = globalThis.G.enemy && globalThis.G.enemy.stats ? globalThis.G.enemy.stats : null;
          if(en){
            if(!st.slow){
              const spdDrop = Math.min(spdPenalty, Math.max(0, (en.spd || 1) - 1));
              en.spd = Math.max(1, (en.spd || 1) - spdDrop);
              en.dodge = Math.max(0, (en.dodge || 0) - dodgePenalty);
              st.slow = {turns: 2 + (weakenChanceLike ? 1 : 0), spdPenalty: spdDrop, dodgePenalty: dodgePenalty};
            }else{
              st.slow.turns = Math.max(st.slow.turns || 0, 2 + (weakenChanceLike ? 1 : 0));
              st.slow.spdPenalty = Math.max(st.slow.spdPenalty || 0, spdPenalty);
              st.slow.dodgePenalty = Math.max(st.slow.dodgePenalty || 0, dodgePenalty);
            }
          }
        }
        if(weakenChanceLike && typeof globalThis.chance === 'function' && chance(weakenChanceLike)){
          if(typeof globalThis.applyAilment === 'function') applyAilment('enemy', 'weaken', 1);
          if(typeof globalThis.spawnFloat === 'function') spawnFloat('enemy','🐔 Weaken!','fn-status');
        }
        if(typeof globalThis.renderStatuses === 'function') renderStatuses('enemy-status', globalThis.G.enemyStatus);
        return true;
      }catch(err){
        console.error('applySlowToEnemy failed:', err);
        return false;
      }
    };
  }

  // Hard patch Bowed Wing so it can never silently do nothing on its effect line.
  if(globalThis.ACTIONS && typeof globalThis.ACTIONS.bowedWing === 'function'){
    globalThis.ACTIONS.bowedWing = async function(ab){
      const lv = Math.max(1, Math.min(ab?.level || 1, 4));
      if(typeof globalThis.playerAttackMisses === 'function' && playerAttackMisses(ab)){
        if(typeof globalThis.doMiss === 'function') await doMiss('player');
        if(typeof globalThis.logMsg === 'function') logMsg('Bowed Wing missed!','miss');
        return;
      }
      const dmg = (typeof globalThis.dealDamage === 'function')
        ? dealDamage('enemy', pdmg([0.95,1.10,1.25,1.40][lv-1], ab), chance(getPlayerCritChance(ab)))
        : {dmgDealt:0};
      if(typeof globalThis.doAttack === 'function') await doAttack('player','enemy',dmg);
      if(typeof globalThis.setHpBar === 'function' && globalThis.G?.enemy?.stats){
        setHpBar('enemy', G.enemy.stats.hp, G.enemy.stats.maxHp);
      }
      applySlowToEnemy([15,20,20,25][lv-1], [2,3,3,5][lv-1], lv >= 3 ? 10 : 0);
      if(typeof globalThis.logMsg === 'function') logMsg(`🏹 Bowed Wing hits for ${dmg.dmgDealt||0}. Slow applied.`, 'player-action');
    };
  }

  // ---------- Rich descriptions in Stork Shop ----------
  function resolveShopAbility(item){
    if(!item || !item.id) return null;
    let id = null;
    if(item.id.startsWith('shop_ab_learn_')) id = item.id.replace('shop_ab_learn_','');
    else if(item.id.startsWith('shop_ab_upgrade_')) id = item.id.replace('shop_ab_upgrade_','');
    if(!id) return null;
    return (globalThis.ABILITY_TEMPLATES && ABILITY_TEMPLATES[id]) ||
           (globalThis.ABILITY_TEMPLATES_EXTRA && ABILITY_TEMPLATES_EXTRA[id]) ||
           null;
  }

  function abilityLongDesc(tmpl, level){
    if(!tmpl) return '';
    const lv = Math.max(1, Math.min(level || 1, Array.isArray(tmpl.levels) ? tmpl.levels.length : 1));
    const row = Array.isArray(tmpl.levels) ? tmpl.levels[lv-1] : null;
    const cost = (typeof tmpl.energyCost === 'number')
      ? tmpl.energyCost
      : (Array.isArray(tmpl.energyByLevel) ? (tmpl.energyByLevel[lv-1] ?? tmpl.energyByLevel[0] ?? 1) : 1);
    const cd = Array.isArray(tmpl.cooldownByLevel) ? (tmpl.cooldownByLevel[lv-1] ?? tmpl.cooldownByLevel[0] ?? 0) : 0;
    const baseDesc = tmpl.desc || 'No description.';
    const lvDesc = row && row.desc ? row.desc : '';
    return `${baseDesc} ${lvDesc ? '• ' + lvDesc : ''} • EN ${cost}${cd>0 ? ' • CD ' + cd : ''}`;
  }

  function wireShopDescriptions(){
    try{
      const grid = document.getElementById('shop-items-grid');
      if(!grid || !globalThis._shopItems) return;
      const cards = [...grid.querySelectorAll('.shop-item')];
      cards.forEach((card, idx)=>{
        const item = _shopItems[idx];
        const tmpl = resolveShopAbility(item);
        if(!tmpl) return;
        const descNode = card.querySelector('.reward-desc');
        const rich = abilityLongDesc(tmpl, 1);
        if(descNode) descNode.textContent = rich;
        card.setAttribute('title', rich);
      });
    }catch(err){ console.error('wireShopDescriptions failed:', err); }
  }

  const oldRenderShopItems = globalThis.renderShopItems;
  if(typeof oldRenderShopItems === 'function'){
    globalThis.renderShopItems = function(){
      const out = oldRenderShopItems.apply(this, arguments);
      wireShopDescriptions();
      return out;
    };
  }

  const oldOpenShopSwapModal = globalThis.openShopSwapModal;
  if(typeof oldOpenShopSwapModal === 'function'){
    globalThis.openShopSwapModal = function(newTmpl, onPick, onCancel){
      const out = oldOpenShopSwapModal.apply(this, arguments);
      try{
        const list = document.getElementById('shop-swap-list');
        if(!list) return out;
        const btns = [...list.querySelectorAll('button')];
        const pool = (globalThis.G?.player?.abilities || []).filter(a => !(typeof globalThis.isMainAttackAbility === 'function' && isMainAttackAbility(a)));
        btns.forEach((btn, idx)=>{
          const ab = pool[idx];
          if(!ab) return;
          const tmpl = (globalThis.ABILITY_TEMPLATES && ABILITY_TEMPLATES[ab.id]) ||
                       (globalThis.ABILITY_TEMPLATES_EXTRA && ABILITY_TEMPLATES_EXTRA[ab.id]) ||
                       ab;
          const rich = abilityLongDesc(tmpl, ab.level || 1);
          btn.setAttribute('title', rich);
          const detail = btn.querySelector('div div:last-child');
          if(detail) detail.textContent = rich;
        });
      }catch(err){ console.error('shop swap details failed:', err); }
      return out;
    };
  }

  // ---------- Unlock popup rendering + selection refresh ----------
  const oldRenderUnlockPopupsOnGameover = globalThis.renderUnlockPopupsOnGameover;
  if(typeof oldRenderUnlockPopupsOnGameover === 'function'){
    globalThis.renderUnlockPopupsOnGameover = function(){
      const out = oldRenderUnlockPopupsOnGameover.apply(this, arguments);
      try{
        const wrap = document.getElementById('run-unlocks');
        if(!wrap) return out;
        [...wrap.querySelectorAll('.unlock-card')].forEach(card=>{
          const portrait = card.querySelector('.bird-portrait');
          const title = card.closest('.unlock-popup')?.querySelector('.unlock-title')?.textContent || '';
          if(!portrait) return;
          let key = '';
          if(/hummingbird/i.test(title)) key = 'hummingbird';
          else if(/shoebill/i.test(title)) key = 'shoebill';
          else if(/secretary/i.test(title)) key = 'secretarybird';
          else if(/magpie/i.test(title)) key = 'magpie';
          else if(/kookaburra/i.test(title)) key = 'kookaburra';
          else if(/peregrine/i.test(title)) key = 'peregrine';
          else if(/lyrebird/i.test(title)) key = 'lyrebird';
          else if(/penguin/i.test(title)) key = 'penguin';
          else if(/emu/i.test(title)) key = 'emu';
          else if(/swan/i.test(title)) key = 'swan';
          else if(/flamingo/i.test(title)) key = 'flamingo';
          else if(/seagull/i.test(title)) key = 'seagull';
          else if(/albatross/i.test(title)) key = 'albatross';
          else if(/toucan/i.test(title)) key = 'toucan';
          if(key && typeof globalThis.renderBirdIconHTML === 'function'){
            portrait.innerHTML = renderBirdIconHTML(key, 'small', false);
          }
        });
      }catch(err){ console.error('unlock popup sprite render failed:', err); }
      return out;
    };
  }

  const oldShowVictory = globalThis.showVictory;
  if(typeof oldShowVictory === 'function'){
    globalThis.showVictory = function(){
      try{ if(typeof globalThis.handleBossClearUnlocks === 'function') handleBossClearUnlocks(); }catch(err){ console.error(err); }
      return oldShowVictory.apply(this, arguments);
    };
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    try{ wireShopDescriptions(); }catch(err){ console.error(err); }
  });
})();


// ===== 29_oai-shop-tier-class-fix.js =====

(function(){
  function inferTier(item){
    if(!item) return '';
    return (item.tier || item.rarity || item.color || '').toString().toLowerCase();
  }

  function applyShopTierClasses(){
    try{
      const grid = document.getElementById('shop-items-grid');
      if(!grid || !globalThis._shopItems) return;
      const cards = [...grid.querySelectorAll('.shop-item, .reward-card')];
      cards.forEach((card, idx)=>{
        ['tier-grey','tier-green','tier-blue','tier-purple','tier-gold'].forEach(c=>card.classList.remove(c));
        const tier = inferTier(globalThis._shopItems[idx]);
        if(['grey','green','blue','purple','gold'].includes(tier)){
          card.classList.add('tier-' + tier);
        }
      });
    }catch(err){ console.error('applyShopTierClasses failed:', err); }
  }

  const oldRenderShopItems = globalThis.renderShopItems;
  if(typeof oldRenderShopItems === 'function'){
    globalThis.renderShopItems = function(){
      const out = oldRenderShopItems.apply(this, arguments);
      setTimeout(applyShopTierClasses, 0);
      return out;
    };
  }

  const oldRefreshShopUI = globalThis.refreshShopUI;
  if(typeof oldRefreshShopUI === 'function'){
    globalThis.refreshShopUI = function(){
      const out = oldRefreshShopUI.apply(this, arguments);
      setTimeout(applyShopTierClasses, 0);
      return out;
    };
  }

  document.addEventListener('DOMContentLoaded', ()=>setTimeout(applyShopTierClasses, 0));
})();


// ===== 30_oai-final-shop-bindings.js =====

(function(){
  function bindShopButtons(){
    const buy = document.getElementById('shop-buy-btn');
    const refresh = document.getElementById('shop-refresh-btn');
    const exit = document.getElementById('shop-exit-btn') || document.querySelector('[data-shop-action="exit"]');
    if(buy && buy.dataset.bound !== '1'){
      buy.dataset.bound = '1';
      buy.addEventListener('click', function(e){ e.preventDefault(); shopBuySelected(); });
    }
    if(refresh && refresh.dataset.bound !== '1'){
      refresh.dataset.bound = '1';
      refresh.addEventListener('click', function(e){ e.preventDefault(); shopRefresh(); });
    }
    if(exit && exit.dataset.bound !== '1'){
      exit.dataset.bound = '1';
      exit.addEventListener('click', function(e){ e.preventDefault(); exitStorkShop(); });
    }
  }
  const oldRenderShopItems = globalThis.renderShopItems;
  if(typeof oldRenderShopItems === 'function'){
    globalThis.renderShopItems = function(){
      const out = oldRenderShopItems.apply(this, arguments);
      bindShopButtons();
      return out;
    };
  }
  document.addEventListener('DOMContentLoaded', bindShopButtons);
})();

