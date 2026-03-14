// ===== 17_script_17.js =====

/* ===== Aviant polish systems patch ===== */
(function(){
  const STATUS_INFO = {
    poison: 'Poison: deals damage each turn and stacks up to your poison cap.',
    bleed: 'Bleed: physical damage over time.',
    burning: 'Burn: deals damage over time based on max HP.',
    weaken: 'Weaken: lowers outgoing damage.',
    paralyzed: 'Paralyzed: chance to lose actions.',
    feared: 'Feared: may skip actions and lose composure.',
    confused: 'Confused: chance to lose actions or act poorly.',
    slow: 'Slow: reduces Speed and Dodge.',
    mud: 'Mud: a dirty slowdown effect that impairs movement.',
    dustDevil: 'Blind: lowers Accuracy for a short time.',
    featherRuffle: 'Ruffled: enemy offense is reduced.',
    defending: 'Block: reduces incoming damage.',
    evading: 'Evade: higher chance to dodge attacks.',
    lullabied: 'Lulled: reduced offense while drowsy.',
    delayed: 'Resonance: delayed damage will detonate soon.'
  };

  function typeTags(tmpl){
    if(!tmpl) return [];
    const out = [];
    if(tmpl.type) out.push(String(tmpl.type));
    if(tmpl.btnType && tmpl.btnType !== tmpl.type) out.push(String(tmpl.btnType));
    if(Array.isArray(tmpl.tags)) out.push(...tmpl.tags.map(String));
    return [...new Set(out.filter(Boolean))];
  }

  function costForTemplate(tmpl, level){
    if(!tmpl) return 1;
    if(typeof tmpl.energyCost === 'number') return Math.max(1, tmpl.energyCost);
    if(Array.isArray(tmpl.energyByLevel)){
      const i = Math.max(0, Math.min((level||1)-1, tmpl.energyByLevel.length-1));
      return Math.max(1, tmpl.energyByLevel[i] ?? 1);
    }
    return 1;
  }

  function cooldownForTemplate(tmpl, level){
    if(!tmpl) return 0;
    if(Array.isArray(tmpl.cooldownByLevel)){
      const i = Math.max(0, Math.min((level||1)-1, tmpl.cooldownByLevel.length-1));
      return tmpl.cooldownByLevel[i] ?? 0;
    }
    return 0;
  }

  function richAbilityTooltip(tmpl, level){
    if(!tmpl) return '';
    const lv = Math.max(1, level||1);
    const row = Array.isArray(tmpl.levels) ? tmpl.levels[Math.min(lv-1, tmpl.levels.length-1)] : null;
    const tags = typeTags(tmpl).join(' · ') || 'ability';
    const cost = costForTemplate(tmpl, lv);
    const cd = cooldownForTemplate(tmpl, lv);
    return `
      <div class="tt-name">${tmpl.name}</div>
      <div class="tt-type">${tags} · Lv${lv}</div>
      <div class="tt-row"><span class="tt-lbl">Energy</span><span class="tt-val">${cost}</span></div>
      <div class="tt-row"><span class="tt-lbl">Cooldown</span><span class="tt-val">${cd>0?cd+' turns':'None'}</span></div>
      <div class="tt-desc" style="margin-top:6px">${tmpl.desc||'No description.'}</div>
      ${row?.desc ? `<div class="tt-desc" style="margin-top:6px;color:var(--text)">${row.desc}</div>` : ``}
    `;
  }

  function showRichTooltip(ev, html){
    const tt=document.getElementById('action-tooltip');
    if(!tt) return;
    tt.innerHTML=html;
    tt.style.display='block';
    if(window._isTouchDevice){
      tt.style.left='50%'; tt.style.top='50%'; tt.style.transform='translate(-50%,-50%)'; tt.style.position='fixed';
    } else if(typeof moveTooltip === 'function'){
      tt.style.position='fixed';
      moveTooltip(ev);
    }
  }

  // Status badge tooltips
  function statusTooltipHtml(badge){
    const cls = badge?.dataset?.statusId || [...badge.classList].find(c => STATUS_INFO[c]) || [...badge.classList][1];
    const detail = badge?.dataset?.statusDetail || STATUS_INFO[cls] || 'Status effect.';
    return `<div class="tt-name">${badge.textContent}</div><div class="tt-desc" style="margin-top:6px">${detail}</div>`;
  }

  document.addEventListener('mouseover', (ev)=>{
    const badge = ev.target?.closest?.('.status-badge');
    if(!badge || window._isTouchDevice) return;
    showRichTooltip(ev, statusTooltipHtml(badge));
  });
  document.addEventListener('mousemove', (ev)=>{
    if(window._isTouchDevice) return;
    if(ev.target?.closest?.('.status-badge') && typeof moveTooltip === 'function') moveTooltip(ev);
  });
  document.addEventListener('mouseout', (ev)=>{
    if(ev.target?.closest?.('.status-badge') && !window._isTouchDevice && typeof hideTooltip === 'function') hideTooltip();
  });
  document.addEventListener('click', (ev)=>{
    const badge = ev.target?.closest?.('.status-badge');
    if(!badge) return;
    showRichTooltip(ev, statusTooltipHtml(badge));
    ev.preventDefault();
    ev.stopPropagation();
  });

  // Action button cooldown indicators + tooltip enrichment
  const _oldRenderActions = globalThis.renderActions;
  if(typeof _oldRenderActions === 'function'){
    globalThis.renderActions = function(){
      const out = _oldRenderActions.apply(this, arguments);
      try{
        document.querySelectorAll('#actions-grid .action-btn').forEach((btn, idx)=>{
          const ab = G?.player?.abilities?.[idx];
          if(!ab) return;
          const tmpl = (globalThis.ABILITY_TEMPLATES && ABILITY_TEMPLATES[ab.id]) || (globalThis.ABILITY_TEMPLATES_EXTRA && ABILITY_TEMPLATES_EXTRA[ab.id]) || ab;
          const cd = (typeof getAbilityCooldown === 'function') ? (getAbilityCooldown(ab.id)||0) : 0;
          const nm = btn.querySelector('.btn-name');
          if(nm && cd>0 && !/\(\d+\)$/.test(nm.textContent||'')) nm.textContent = `${nm.textContent} (${cd})`;
          const html = richAbilityTooltip(tmpl, ab.level||1);
          btn.onmouseenter = e => { if(!window._isTouchDevice) showRichTooltip(e, html); };
          btn.onmousemove = e => { if(!window._isTouchDevice && typeof moveTooltip === 'function') moveTooltip(e); };
          btn.onmouseleave = () => { if(!window._isTouchDevice && typeof hideTooltip === 'function') hideTooltip(); };
        });
      }catch(err){ console.error(err); }
      return out;
    };
  }

  // Damage explanation tags: crit/magic/DoT helper floats.
  const _oldDealDamagePolish = globalThis.dealDamage;
  if(typeof _oldDealDamagePolish === 'function'){
    globalThis.dealDamage = function(target, amount, isCrit=false, isMagic=false, srcAbility=null){
      const out = _oldDealDamagePolish.call(this, target, amount, isCrit, isMagic, srcAbility);
      try{
        if(isCrit) spawnFloat(target, '✦ Crit', 'damage-tag-float');
        if(isMagic) spawnFloat(target, '✦ Magic', 'damage-tag-float');
      }catch(_){}
      return out;
    };
  }

  // Enemy trait system
  function enemyTraitFor(e){
    const key = String(e?.id || e?.name || '').toLowerCase();
    if(key.includes('harpy')) return {id:'predator', name:'Predator', desc:'+25% damage vs Weakened targets.'};
    if(key.includes('secretary')) return {id:'duelist', name:'Duelist', desc:'First attack each battle always crits.'};
    if(key.includes('barn_owl') || key.includes('barn owl')) return {id:'nightHunter', name:'Night Hunter', desc:'+20% dodge during the first 2 turns.'};
    return null;
  }

  const _oldRefreshBattleUIPolish = globalThis.refreshBattleUI;
  if(typeof _oldRefreshBattleUIPolish === 'function'){
    globalThis.refreshBattleUI = function(){
      try{
        if(G?.enemy && !G.enemy._traitInit){
          G.enemy._traitInit = true;
          G.enemy._trait = enemyTraitFor(G.enemy);
          if(G.enemy._trait?.id === 'nightHunter'){
            G.enemy._traitTurns = 2;
            G.enemy.stats.dodge = Math.min(100, (G.enemy.stats.dodge||0) + 20);
          }
          // elite chance for non-boss enemies
          if(!G.enemy.isBoss && !G.enemy._eliteChecked){
            G.enemy._eliteChecked = true;
            if(Math.random() < 0.12){
              G.enemy.isElite = true;
              G.enemy.name = `Elite ${G.enemy.name}`;
              G.enemy.stats.maxHp = Math.floor((G.enemy.stats.maxHp||1) * 1.5);
              G.enemy.stats.hp = G.enemy.stats.maxHp;
              G.enemy.stats.atk = Math.floor((G.enemy.stats.atk||1) * 1.2);
              G.enemy.stats.def = Math.floor((G.enemy.stats.def||0) + 2);
              logMsg(`⭐ ${G.enemy.name} appears!`, 'boss');
            }
          }
        }
      }catch(err){ console.error(err); }
      const out = _oldRefreshBattleUIPolish.apply(this, arguments);
      try{
        const host = document.getElementById('enemy-status') || document.getElementById('enemy-panel') || document.getElementById('enemy-avatar');
        if(host && G?.enemy?._trait && !document.getElementById('enemy-trait-badge')){
          const badge = document.createElement('div');
          badge.id='enemy-trait-badge';
          badge.className='enemy-trait-badge';
          badge.textContent = `${G.enemy._trait.name}`;
          badge.title = G.enemy._trait.desc;
          host.appendChild(badge);
        }
      }catch(err){ console.error(err); }
      return out;
    };
  }

  const _oldEdmgPolish = globalThis.edmg;
  if(typeof _oldEdmgPolish === 'function'){
    globalThis.edmg = function(mult=1){
      let out = _oldEdmgPolish.apply(this, arguments);
      try{
        if(G?.enemy?._trait?.id === 'predator' && (G.playerStatus?.weaken||0) > 0){
          out = Math.floor(out * 1.25);
        }
        if(G?.enemy?._trait?.id === 'duelist' && !G.enemy._duelistUsed){
          G.enemy._duelistUsed = true;
          out = Math.floor(out * 1.5);
        }
      }catch(_){}
      return out;
    };
  }

  const _oldAfterEnemyTurnPolish = globalThis.afterEnemyTurn;
  if(typeof _oldAfterEnemyTurnPolish === 'function'){
    globalThis.afterEnemyTurn = async function(){
      const out = await _oldAfterEnemyTurnPolish.apply(this, arguments);
      try{
        if(G?.enemy?._trait?.id === 'nightHunter' && G.enemy._traitTurns > 0){
          G.enemy._traitTurns--;
          if(G.enemy._traitTurns === 0){
            G.enemy.stats.dodge = Math.max(0, (G.enemy.stats.dodge||0) - 20);
          }
        }
      }catch(_){}
      return out;
    };
  }

  // Corrupted biome zones
  function assignCorruptedBiome(){
    if(!G) return;
    const stage = G.stage || 1;
    if(stage % 5 !== 0) return;
    const zones = [
      {id:'toxicMarsh', name:'Toxic Marsh', desc:'Poison effects are stronger.', apply(){ G.biomeMod = {...(G.biomeMod||{}), enemyPoisonPlus:1}; }},
      {id:'stormPeak', name:'Storm Peak', desc:'Lightning users strike harder.', apply(){ G.biomeMod = {...(G.biomeMod||{}), lightningBonus:0.15}; }},
      {id:'dreadCanopy', name:'Dread Canopy', desc:'Fear and weaken linger longer.', apply(){ G.biomeMod = {...(G.biomeMod||{}), dread:1}; }}
    ];
    if(G._lastBiomeStage === stage) return;
    G._lastBiomeStage = stage;
    const z = zones[Math.floor(Math.random()*zones.length)];
    G._corruptZone = z;
    z.apply();
    logMsg(`🌲 ${z.name}: ${z.desc}`, 'system');
  }
  const _oldAdvanceStagePolish = globalThis.advanceStage;
  if(typeof _oldAdvanceStagePolish === 'function'){
    globalThis.advanceStage = function(){
      const out = _oldAdvanceStagePolish.apply(this, arguments);
      try{ assignCorruptedBiome(); }catch(err){ console.error(err); }
      return out;
    };
  }

  // Murmuration event
  function ensureMurmurationModal(){
    const modal = document.getElementById('murmuration-modal');
    if(!modal || modal._wired) return;
    modal._wired = true;
    modal.addEventListener('click', e => { if(e.target === modal) modal.classList.remove('open'); });
  }
  ensureMurmurationModal();

  function murmurationChoices(){
    return [
      {icon:'', name:'Crow Flock', desc:'Bleed and Poison damage +2 this battle.', apply(){ G._murmurationBleedBonus = 2; }},
      {icon:'🦢', name:'Swan Flock', desc:'Gain +8 max HP and heal 10%.', apply(){ G.player.stats.maxHp += 8; G.player.stats.hp = Math.min(G.player.stats.maxHp, G.player.stats.hp + Math.floor(G.player.stats.maxHp*0.10)); }},
      {icon:'🦅', name:'Hawk Flock', desc:'First attack each battle gains +25% damage.', apply(){ G.firstAttackBonus = (G.firstAttackBonus||0) + 0.25; }}
    ];
  }

  function openMurmuration(){
    ensureMurmurationModal();
    const modal = document.getElementById('murmuration-modal');
    const row = document.getElementById('mur-row');
    if(!modal || !row) return;
    row.innerHTML = '';
    murmurationChoices().forEach(choice => {
      const div = document.createElement('div');
      div.className = 'murmuration-opt';
      div.innerHTML = `<span class="m-icon">${choice.icon}</span><div class="m-name">${choice.name}</div><div class="m-desc">${choice.desc}</div>`;
      div.onclick = () => {
        try{ choice.apply(); saveRun && saveRun(); }catch(err){ console.error(err); }
        modal.classList.remove('open');
        logMsg(`🕊 ${choice.name} blesses your run.`, 'exp-gain');
      };
      row.appendChild(div);
    });
    modal.classList.add('open');
  }

  const _oldConfirmRewardPolish = globalThis.confirmReward;
  if(typeof _oldConfirmRewardPolish === 'function'){
    globalThis.confirmReward = function(){
      const out = _oldConfirmRewardPolish.apply(this, arguments);
      try{
        if(Math.random() < 0.12) openMurmuration();
      }catch(err){ console.error(err); }
      return out;
    };
  }

  // Shop 3x4 + artifact row
  const ARTIFACTS = [
    {id:'art_goldenFeather', tier:'gold', icon:'🪶', name:'Golden Feather', desc:'+1 Max Energy permanently.', apply(p){ p.energyBonus=(p.energyBonus||0)+1; if(typeof computePlayerMaxEnergy==='function') p.energyMax=computePlayerMaxEnergy(); }},
    {id:'art_stormCrown', tier:'purple', icon:'👑', name:'Storm Crown', desc:'Burn damage is doubled.', apply(p){ p.burnBonus = (p.burnBonus||1) * 2; }},
    {id:'art_murderBanner', tier:'purple', icon:'⚑', name:'Murder Banner', desc:'Crow-tagged physical attacks deal +25% damage.', apply(p){ p.crowBonus=(p.crowBonus||0)+0.25; }},
    {id:'art_skyLantern', tier:'blue', icon:'🏮', name:'Sky Lantern', desc:'Gain +1 Energy on the first turn of each battle.', apply(p){ p.firstTurnEnergy=(p.firstTurnEnergy||0)+1; }}
  ];

  const _oldGenerateShopItemsPolish = globalThis.generateShopItems;
  if(typeof _oldGenerateShopItemsPolish === 'function'){
    globalThis.generateShopItems = function(){
      _shopItems = [];
      const used = new Set();
      // top row abilities
      for(let i=0;i<4;i++) _shopItems.push(makeAbilityOffer(true));
      // middle row grey upgrades
      for(let i=0;i<4;i++){
        const pick = pickUniqueRewardByTier('grey', used) || pickUniqueRewardByTier('green', used) || pickUniqueRewardByTier('blue', used);
        if(pick) _shopItems.push(pick);
      }
      // bottom row rare/artifacts
      for(let i=0;i<4;i++){
        if(Math.random() < 0.20){
          const art = ARTIFACTS[Math.floor(Math.random()*ARTIFACTS.length)];
          _shopItems.push({...art});
          continue;
        }
        const tier = rollShopTier({blue:56,purple:34,gold:10});
        const pick = pickUniqueRewardByTier(tier, used) || pickUniqueRewardByTier('purple', used) || pickUniqueRewardByTier('blue', used) || pickUniqueRewardByTier('grey', used);
        if(pick) _shopItems.push(pick);
      }
      renderShopItems();
    };
  }

  const _oldRenderShopItemsPolish2 = globalThis.renderShopItems;
  if(typeof _oldRenderShopItemsPolish2 === 'function'){
    globalThis.renderShopItems = function(){
      const out = _oldRenderShopItemsPolish2.apply(this, arguments);
      try{
        const grid=document.getElementById('shop-items-grid');
        if(!grid) return out;
        const cards=[...grid.querySelectorAll('.shop-item')];
        // row labels
        if(!grid.querySelector('.shop-row-label')){
          const labels = [
            {idx:0, text:'ABILITIES'},
            {idx:4, text:'UPGRADES'},
            {idx:8, text:'RARE / ARTIFACTS'}
          ];
          labels.reverse().forEach(l=>{
            if(cards[l.idx]){
              const div=document.createElement('div');
              div.className='shop-row-label';
              div.textContent=l.text;
              grid.insertBefore(div, cards[l.idx]);
            }
          });
        }
        cards.forEach((card, idx)=>{
          const item = (globalThis._shopItems||[])[idx];
          if(item?.id?.startsWith('art_')) card.classList.add('artifact-card');
        });
      }catch(err){ console.error(err); }
      return out;
    };
  }

  // Better shop swap preview
  const _oldOpenShopSwapModalPolish = globalThis.openShopSwapModal;
  if(typeof _oldOpenShopSwapModalPolish === 'function'){
    globalThis.openShopSwapModal = function(newTmpl, onPick, onCancel){
      const out = _oldOpenShopSwapModalPolish.apply(this, arguments);
      try{
        const sub=document.getElementById('shop-swap-sub');
        const list=document.getElementById('shop-swap-list');
        if(!sub || !list) return out;
        [...list.querySelectorAll('button')].forEach((btn, idx)=>{
          btn.addEventListener('mouseenter', ()=>{
            const pool=(G?.player?.abilities||[]).filter(a=>!isMainAttackAbility(a));
            const ab=pool[idx];
            if(ab) sub.innerHTML = `Replace <strong style="color:var(--text)">${ab.name}</strong> with <strong style="color:var(--gold)">${newTmpl.name}</strong>.`;
          });
        });
      }catch(err){ console.error(err); }
      return out;
    };
  }
})();


// ===== 18_script_18.js =====

/* ===== Magic scaling + upgrade sync fix ===== */
(function(){
  // Replace magic damage scaling so MATK matters directly and does not piggyback on ATK.
  globalThis.matk = function(mult=1){
    const base = Math.max(1, G?.player?.stats?.matk || 8);
    const enemyMdef = Math.max(0, G?.enemy?.stats?.mdef || 0);
    const low = Math.floor(base * 0.85);
    const high = Math.floor(base * 1.15);
    const rolled = (typeof roll === 'function') ? roll(low, high) : Math.floor((low + high) / 2);
    const statDelta = base - enemyMdef;
    const scaling = 1 + (statDelta * 0.02); // stronger feeling MATK scaling
    return Math.max(1, Math.floor(rolled * mult * Math.max(0.55, scaling)));
  };

  // Make spell ailment rolls respect MATK more clearly as well.
  globalThis.spellAilmentRoll = function(baseChance, isMultiHit=false){
    const matk = Math.max(1, G?.player?.stats?.matk || 8);
    const mdef = Math.max(0, G?.enemy?.stats?.mdef || 8);
    const statShift = (matk - mdef) * 2.5;
    const multiAdj = isMultiHit ? -0.45 : 0.2;
    const final = Math.max(3, Math.min(92, Math.floor((baseChance + statShift) * (1 + multiAdj))));
    return chance(final);
  };

  // Ensure upgrade purchases refresh visible stats immediately.
  const _oldShopBuySelectedScaleFix = globalThis.shopBuySelected;
  if(typeof _oldShopBuySelectedScaleFix === 'function'){
    globalThis.shopBuySelected = function(){
      const out = _oldShopBuySelectedScaleFix.apply(this, arguments);
      try{
        if(typeof renderShopItems === 'function') renderShopItems();
        if(typeof refreshBattleUI === 'function' && G?.enemy && G?.player) refreshBattleUI();
        if(typeof renderAllCombatUI === 'function' && G?.player) renderAllCombatUI();
        if(typeof renderEnergyOrbs === 'function' && G?.player) renderEnergyOrbs();
        if(typeof openNest === 'function'){
          // no-op; just ensure stats in nest use latest live values next time it opens
        }
      }catch(err){ console.error(err); }
      return out;
    };
  }

  // Small helper log for major hybrid stat upgrades
  const _oldGetUpgradePoolScaleFix = globalThis.getUpgradePool;
  if(typeof _oldGetUpgradePoolScaleFix === 'function'){
    globalThis.getUpgradePool = function(){
      const pool = _oldGetUpgradePoolScaleFix.apply(this, arguments);
      for(const item of pool){
        if(!item || item.__scaleFixWrapped) continue;
        const oldApply = item.apply;
        item.apply = function(p){
          oldApply && oldApply(p);
          if(typeof enforceAbilityCosts === 'function') enforceAbilityCosts(p);
        };
        item.__scaleFixWrapped = true;
      }
      return pool;
    };
  }
})();


// ===== 19_script_19.js =====

/* ===== Upgrade multiplier bug fix ===== */
(function(){
  function syncPlayerViews(){
    try{
      if(typeof renderEnergyOrbs === 'function') renderEnergyOrbs();
      if(typeof renderAllCombatUI === 'function' && G?.player) renderAllCombatUI();
      if(typeof refreshBattleUI === 'function' && G?.player && G?.enemy) refreshBattleUI();
    }catch(err){ console.error(err); }
  }

  function sanitizePlayerStats(p){
    if(!p?.stats) return;
    const s = p.stats;
    const caps = {
      atk: 300,
      matk: 300,
      def: 200,
      mdef: 200,
      spd: 100,
      acc: 200,
      dodge: 95,
      mdodge: 95,
      maxHp: 9999,
      hp: 9999
    };
    for(const [k, cap] of Object.entries(caps)){
      if(typeof s[k] === 'number'){
        if(!Number.isFinite(s[k])) s[k] = 1;
        s[k] = Math.max(0, Math.min(cap, s[k]));
      }
    }
    if(typeof s.hp === 'number' && typeof s.maxHp === 'number'){
      s.hp = Math.min(s.hp, s.maxHp);
    }
  }

  function normalizeUpgradeItem(item){
    if(!item || typeof item.apply !== 'function') return item;

    // Preserve the original base apply exactly once.
    if(!item.__baseApply){
      item.__baseApply = item.apply;
    }

    // Replace any stacked/nested wrapper chain with one clean wrapper.
    item.apply = function(p){
      if(item.__applying) return;
      item.__applying = true;
      try{
        item.__baseApply && item.__baseApply(p);
        if(typeof enforceAbilityCosts === 'function') enforceAbilityCosts(p);
        if(typeof computePlayerMaxEnergy === 'function' && p){
          p.energyMax = computePlayerMaxEnergy();
          if(typeof p.energy !== 'number') p.energy = p.energyMax;
          p.energy = Math.min(p.energy, p.energyMax);
        }
        sanitizePlayerStats(p);
        syncPlayerViews();
      } finally {
        item.__applying = false;
      }
    };

    item.__normalizedApply = true;
    return item;
  }

  const _oldGetUpgradePoolFix = globalThis.getUpgradePool;
  if(typeof _oldGetUpgradePoolFix === 'function'){
    globalThis.getUpgradePool = function(){
      const pool = _oldGetUpgradePoolFix.apply(this, arguments) || [];
      for(const item of pool){
        normalizeUpgradeItem(item);
      }
      return pool;
    };
  }

  // Also sanitize after level-up screens / reward flow so runaway values can't persist.
  const _oldShowLevelUpScreenFix = globalThis.showLevelUpScreen;
  if(typeof _oldShowLevelUpScreenFix === 'function'){
    globalThis.showLevelUpScreen = function(){
      try{ if(G?.player) sanitizePlayerStats(G.player); }catch(err){ console.error(err); }
      return _oldShowLevelUpScreenFix.apply(this, arguments);
    };
  }

  const _oldShowRewardScreenFix = globalThis.showRewardScreen;
  if(typeof _oldShowRewardScreenFix === 'function'){
    globalThis.showRewardScreen = function(){
      try{ if(G?.player) sanitizePlayerStats(G.player); }catch(err){ console.error(err); }
      return _oldShowRewardScreenFix.apply(this, arguments);
    };
  }

  // If a save already contains runaway values, clamp them when opening / continuing play.
  try{
    if(globalThis.G?.player) sanitizePlayerStats(G.player);
  }catch(err){ console.error(err); }
})();


// ===== 20_script_20.js =====

(function(){
const ENERGY_CAP = 7;

function enforceEnergyCap(p){
 if(!p) return;
 const base = Math.max(0, p.baseEnergy || (p.energyMax - (p.energyBonus||0)) || 0);
 const bonus = Math.max(0, p.energyBonus || 0);
 const total = Math.min(ENERGY_CAP, base + bonus);
 p.energyMax = total;
 if(typeof p.energy !== 'number') p.energy = total;
 p.energy = Math.min(p.energy,total);
}

const oldCompute = globalThis.computePlayerMaxEnergy;
if(typeof oldCompute === 'function'){
 globalThis.computePlayerMaxEnergy = function(){
  return Math.min(ENERGY_CAP, oldCompute.apply(this,arguments));
 }
}

const oldPool = globalThis.getUpgradePool;
if(typeof oldPool === 'function'){
 globalThis.getUpgradePool = function(){
  let pool = oldPool.apply(this,arguments)||[];

  pool = pool.filter(item=>{
   if(!item) return false;
   const txt=(item.name||'')+(item.desc||'');
   if(/energy/i.test(txt) && (item.tier==='green'||item.tier==='blue')) return false;
   return true;
  });

  if(!G._runShopFlags) G._runShopFlags={};

  pool = pool.filter(item=>{
   const txt=(item.name||'')+(item.desc||'');
   if(!/energy/i.test(txt)) return true;
   if(G._runShopFlags[item.id]) return false;
   const oldApply=item.apply;
   item.apply=function(p){
    if(G._runShopFlags[item.id]) return;
    G._runShopFlags[item.id]=true;
    oldApply&&oldApply(p);
    enforceEnergyCap(p);
   }
   return true;
  });

  return pool;
 }
}

function cooldown(id,cd){
 if(!globalThis.ABILITY_TEMPLATES) return;
 const a=ABILITY_TEMPLATES[id];
 if(!a) return;
 a.cooldown=cd;
 if(!a.cost) a.cost=1;
}

cooldown('flyby',2);
cooldown('chargeUp',3);

})();


// ===== 21_script_21.js =====

/* ===== Enemy AI memory upgrade ===== */
(function(){
  function ensureEnemyAIMemory(enemy){
    if(!enemy) return {lastActionId:null, repeatCount:0, lastDamageDealt:0, lastTurnUsedBuff:false};
    if(!enemy._aiMemory){
      enemy._aiMemory = {
        lastActionId: null,
        repeatCount: 0,
        lastDamageDealt: 0,
        lastTurnUsedBuff: false
      };
    }
    return enemy._aiMemory;
  }

  function actionIdOf(action){
    return action?.abilityId || action?.id || action?.label || action?.type || 'unknown';
  }

  function scoreEnemyAction(enemy, action, mode){
    const mem = ensureEnemyAIMemory(enemy);
    let score = 10;
    const id = actionIdOf(action);
    const hp = enemy?.stats?.hp || 1;
    const maxHp = enemy?.stats?.maxHp || 1;
    const hpPct = hp / Math.max(1, maxHp);
    const playerHpPct = (G?.player?.stats?.hp || 1) / Math.max(1, G?.player?.stats?.maxHp || 1);

    if(id === mem.lastActionId){
      score -= 4;
      if(mem.repeatCount >= 1) score -= 5;
    }

    if(action?.abilityId === 'eShield' && (G.enemyStatus?.defending || 0) > 0) score -= 100;
    if(action?.abilityId === 'eHeal' && hpPct > 0.65) score -= 100;
    if(action?.abilityId === 'eFear' && (G.playerStatus?.feared || 0) > 0) score -= 8;
    if(action?.abilityId === 'eWeaken' && (G.playerStatus?.weaken || 0) >= 3) score -= 8;
    if(action?.abilityId === 'eBlind' && (G.playerStatus?.dustDevil?.turns || 0) >= 2) score -= 8;
    if(action?.abilityId === 'eRage' && (G.enemyStatus?.rageBuff || 0) > 0) score -= 100;

    if(mode === 'execute' && action?.type === 'strike') score += 4;
    if(mode === 'execute' && action?.type === 'heavy') score += 5;
    if(mode === 'recover' && action?.abilityId === 'eHeal' && hpPct <= 0.45) score += 10;
    if(mode === 'recover' && action?.abilityId === 'eShield' && hpPct <= 0.55) score += 6;
    if(mode === 'setup' && action?.type === 'ability' && ['eWeaken','eBlind','eVenom'].includes(action?.abilityId)) score += 2;
    if(playerHpPct <= 0.5 && (action?.type === 'strike' || action?.type === 'heavy')) score += 6;

    if(mem.lastTurnUsedBuff && ['eShield','eHeal','eRage'].includes(action?.abilityId)) score -= 8;

    return score;
  }

  function chooseEnemyActionSmart(enemy, mode){
    const pool = (typeof buildEnemyActionPool === 'function') ? (buildEnemyActionPool(enemy, mode) || []) : [];
    if(!pool.length) return null;
    let best = pool[0];
    let bestScore = -9999;
    for(const action of pool){
      const score = scoreEnemyAction(enemy, action, mode) + Math.random() * 1.5;
      if(score > bestScore){
        best = action;
        bestScore = score;
      }
    }
    return {...best, energyCost: (typeof getEnemyActionEnergyCost === 'function' ? getEnemyActionEnergyCost(best) : 1)};
  }

  function rememberEnemyAction(enemy, action, damageDealt){
    const mem = ensureEnemyAIMemory(enemy);
    const id = actionIdOf(action);
    if(mem.lastActionId === id) mem.repeatCount++;
    else mem.repeatCount = 0;
    mem.lastActionId = id;
    mem.lastDamageDealt = damageDealt || 0;
    mem.lastTurnUsedBuff = !!(action && ['eShield','eHeal','eRage'].includes(action.abilityId));
  }

  globalThis.ensureEnemyAIMemory = ensureEnemyAIMemory;
  globalThis.scoreEnemyAction = scoreEnemyAction;
  globalThis.chooseEnemyActionSmart = chooseEnemyActionSmart;
  globalThis.rememberEnemyAction = rememberEnemyAction;

  const _oldPlanEnemyAction = globalThis.planEnemyAction;
  if(typeof _oldPlanEnemyAction === 'function'){
    globalThis.planEnemyAction = function(){
      try{
        if(G?.enemy && !G.enemy.isBoss){
          ensureEnemyAIMemory(G.enemy);
          const mode = (typeof getEnemyMode === 'function') ? getEnemyMode(G.enemy, G.player) : 'execute';
          const chosen = chooseEnemyActionSmart(G.enemy, mode);
          if(chosen){
            G.enemyNextAction = chosen;
            if(Array.isArray(G.enemyPlannedActions)){
              G.enemyPlannedActions = [chosen];
            }
            if(typeof renderEnemyPlan === 'function') renderEnemyPlan();
            return chosen;
          }
        }
      }catch(err){ console.error(err); }
      return _oldPlanEnemyAction.apply(this, arguments);
    };
  }

  const _oldEnemyTurn = globalThis.enemyTurn;
  if(typeof _oldEnemyTurn === 'function'){
    globalThis.enemyTurn = async function(){
      const beforeHp = G?.player?.stats?.hp || 0;
      const planned = G?.enemyNextAction || (Array.isArray(G?.enemyPlannedActions) ? G.enemyPlannedActions[0] : null);
      const out = await _oldEnemyTurn.apply(this, arguments);
      try{
        if(G?.enemy && !G.enemy.isBoss && planned){
          const afterHp = G?.player?.stats?.hp || 0;
          const dmg = Math.max(0, beforeHp - afterHp);
          rememberEnemyAction(G.enemy, planned, dmg);
        }
      }catch(err){ console.error(err); }
      return out;
    };
  }
})();


// ===== 22_script_22.js =====

/* ===== DoT + passive pass + HONK cleanup ===== */
(function(){
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }

  // 1) Make DoTs actually tick for both sides (legacy fallback only).
  if(typeof globalThis.tickDoTs !== 'function') globalThis.tickDoTs = async function(who){
    const status = who === 'player' ? G.playerStatus : G.enemyStatus;
    const stats  = who === 'player' ? G.player.stats : G.enemy.stats;
    const name   = who === 'player' ? G.player.name : G.enemy.name;
    if(!status || !stats) return;

    const applyTick = async (icon, cls, dmg, logText) => {
      dmg = Math.max(1, Math.floor(dmg));
      stats.hp = Math.max(0, stats.hp - dmg);
      spawnFloat(who, `${icon} -${dmg}`, cls);
      if(typeof setHpBar === 'function') setHpBar(who, stats.hp, stats.maxHp);
      if(typeof logMsg === 'function') logMsg(logText.replace('{dmg}', dmg).replace('{name}', name), 'poison-tick');
      if(who === 'enemy' && globalThis.BS) BS.dmgDealt = (BS.dmgDealt||0) + dmg;
      await delay(250);
    };

    if(status.poison && status.poison.stacks > 0 && status.poison.turns > 0){
      const tickMult = who === 'player' ? (G.player?.poisonTickMult || 1) : 1;
      await applyTick('☣','fn-poison', status.poison.stacks * tickMult, '☣ Avian Poison deals {dmg} damage to {name}!');
      status.poison.turns--;
      if(status.poison.turns <= 0) delete status.poison;
    }

    if(status.bleed && status.bleed.stacks > 0 && status.bleed.turns > 0){
      await applyTick('🩸','fn-dmg', status.bleed.stacks * 1.5, '🩸 Bleed deals {dmg} damage to {name}!');
      status.bleed.turns--;
      if(status.bleed.turns <= 0) delete status.bleed;
    }

    if(status.burning && ((typeof status.burning === 'number' && status.burning > 0) || (typeof status.burning === 'object' && status.burning.turns > 0))){
      const turns = typeof status.burning === 'number' ? status.burning : status.burning.turns;
      await applyTick('🔥','fn-status', Math.max(1, (stats.maxHp||1) * 0.04), '🔥 Burn deals {dmg} damage to {name}!');
      if(typeof status.burning === 'number') status.burning = turns - 1;
      else status.burning.turns = turns - 1;
      if((typeof status.burning === 'number' && status.burning <= 0) || (typeof status.burning === 'object' && status.burning.turns <= 0)) delete status.burning;
    }

    if(status.delayed && status.delayed.dmg > 0){
      await applyTick('🎵','fn-status', status.delayed.dmg, '🎵 Resonance detonates for {dmg} damage on {name}!');
      delete status.delayed;
    }
  };

  // Tick enemy DoTs at start of player turn.
  const _oldAfterEnemyTurn = globalThis.afterEnemyTurn;
  if(typeof _oldAfterEnemyTurn === 'function'){
    globalThis.afterEnemyTurn = async function(){
      try{
        if(G?.enemy?.stats?.hp > 0){
          await tickDoTs('enemy');
          if(G.enemy.stats.hp <= 0){
            if(typeof checkDeath === 'function'){
              const ended = checkDeath();
              if(ended) return;
            }
          }
        }
      }catch(err){ console.error(err); }
      return await _oldAfterEnemyTurn.apply(this, arguments);
    };
  }

  // 2) Remove Fear from Goose HONK.
  if(globalThis.ABILITY_TEMPLATES?.gooseHonk){
    const a = ABILITY_TEMPLATES.gooseHonk;
    a.desc = 'Territorial blast. Tank basic with reliability and light weaken pressure.';
    a.levels = [
      {lv:1, desc:'110% dmg, 24% miss'},
      {lv:2, desc:'125% dmg, 20% miss — Weaken 15%', newAilment:'weaken', ailChance:15},
      {lv:3, desc:'140% dmg, 16% miss — Weaken 20%', newAilment:'weaken', ailChance:20},
      {lv:4, desc:'155% dmg, 12% miss — Weaken 25% + 10% Paralysis', newAilment:'weaken', ailChance:25, newAilment2:'paralyzed', ailChance2:10},
    ];
  }

  // 3) Full passive pass: no missing passives remained, so buff weaker ones.
  if(globalThis.BIRDS){
    if(BIRDS.blackbird?.passive){
      BIRDS.blackbird.passive.name = 'Song Resilient';
      BIRDS.blackbird.passive.desc = 'Every successful spell cast restores 3 HP and grants +1 MATK this battle (max +4).';
      BIRDS.blackbird.passive.onBattleStart = function(p){ p._songResMatk = 0; };
      BIRDS.blackbird.passive.onSpell = function(p){
        p.stats.hp = Math.min(p.stats.maxHp, p.stats.hp + 3);
        if((p._songResMatk||0) < 4){
          p._songResMatk = (p._songResMatk||0) + 1;
          p.stats.matk = (p.stats.matk||0) + 1;
        }
      };
    }

    if(BIRDS.robin?.passive){
      BIRDS.robin.passive.desc = 'Ranged hits grant +3% ACC for this battle (max +15%) and every second stack grants +1% Crit (max +5%).';
      BIRDS.robin.passive.onBattleStart = function(p){ p._robinAccStacks = 0; p._robinCritStacks = 0; };
      BIRDS.robin.passive.onPhysicalHit = function(p){
        if((p._robinAccStacks||0) < 15){
          p._robinAccStacks = Math.min(15, (p._robinAccStacks||0) + 3);
          p.stats.acc = Math.min(100, (p.stats.acc||80) + 3);
          if(p._robinAccStacks % 6 === 0 && (p._robinCritStacks||0) < 5){
            p._robinCritStacks = (p._robinCritStacks||0) + 1;
            p.stats.critChance = (p.stats.critChance||5) + 1;
          }
        }
      };
    }

    if(BIRDS.toucan?.passive){
      BIRDS.toucan.passive.desc = 'Whenever you heal, gain ACC and +1 MATK (max +5 MATK, +12 ACC).';
      BIRDS.toucan.passive.onBattleStart = function(p){ p._fruitfulBonus = 0; p._fruitfulMatk = 0; };
      BIRDS.toucan.passive.onHeal = function(p, amt){
        if(!p._fruitfulBonus) p._fruitfulBonus = 0;
        if(!p._fruitfulMatk) p._fruitfulMatk = 0;
        if(p._fruitfulBonus < 12){
          const gain = Math.max(1, Math.floor((amt||0)/8));
          const actual = Math.min(gain, 12 - p._fruitfulBonus);
          p._fruitfulBonus += actual;
          p.stats.acc = Math.min((p.stats.acc||75) + actual, 100);
        }
        if(p._fruitfulMatk < 5){
          p._fruitfulMatk++;
          p.stats.matk = (p.stats.matk||0) + 1;
        }
      };
    }

    if(BIRDS.albatross?.passive){
      BIRDS.albatross.passive.name = 'Ocean Wanderer';
      BIRDS.albatross.passive.desc = '+1 SPD every 2 turns.';
      BIRDS.albatross.passive.onBattleStart = function(p){ p._oceanWandererTurns = 0; };
      BIRDS.albatross.passive.onTurnEnd = function(p){
        p._oceanWandererTurns = (p._oceanWandererTurns||0) + 1;
        if((p._oceanWandererTurns % 2) === 0){
          p.stats.spd = Math.min(20, (p.stats.spd||1) + 1);
        }
      };
    }

    if(BIRDS.macaw?.passive){
      BIRDS.macaw.passive.desc = 'After an enemy uses an ability, gain +5% Dodge for 1 turn (max 20%) and restore 1 HP.';
      BIRDS.macaw.passive.onBattleStart = function(p){ p._macawEchoDodge = 0; };
      BIRDS.macaw.passive.onEnemyAbility = function(p){
        p._macawEchoDodge = Math.min(20, (p._macawEchoDodge||0) + 5);
        G.playerStatus.humDodge = {bonus:p._macawEchoDodge, turns:1};
        p.stats.hp = Math.min(p.stats.maxHp, p.stats.hp + 1);
      };
    }
  }

  // Albatross passive support inside spell hit chance if its stack exists.
  const _oldSpellMissChance = globalThis.spellMissChance;
  if(typeof _oldSpellMissChance === 'function'){
    globalThis.spellMissChance = function(){
      let miss = _oldSpellMissChance.apply(this, arguments);
      try{
        miss -= Math.floor((G?.player?._tradeWindAcc || 0));
      }catch(_){}
      return clamp(miss, 0, 40);
    };
  }
})();


// ===== 23_script_23.js =====

/* ===== Ranger identity + ability scaling pass ===== */
(function(){
  const T = globalThis.ABILITY_TEMPLATES || {};
  function setLevels(id, desc, levels){
    if(!T[id]) return;
    T[id].desc = desc;
    T[id].levels = levels;
  }

  /* Rangers focus: accuracy + poison/burn + steady pressure */

  // Robin / ranger tools
  setLevels('dart',
    'Fast reliable strike. Ranger/assassin basic with strong accuracy and steady pressure.',
    [
      {lv:1, desc:'100% dmg, 12% miss'},
      {lv:2, desc:'112% dmg, 10% miss — Weaken 12%', newAilment:'weaken', ailChance:12},
      {lv:3, desc:'124% dmg, 8% miss — Weaken 18%', ailChance:18},
      {lv:4, desc:'136% dmg, 6% miss — Weaken 24% + Burn 10%', newAilment:'weaken', ailChance:24, newAilment2:'burning', ailChance2:10},
    ]
  );

  setLevels('mudshot',
    'Fling heavy mud. Accurate ranger control shot with slow pressure, not burst.',
    [
      {lv:1, desc:'90% dmg, 14% miss — Mud 2t'},
      {lv:2, desc:'100% dmg, 12% miss — Mud 2t, Weaken 12%', newAilment:'mud', ailChance:100, newAilment2:'weaken', ailChance2:12},
      {lv:3, desc:'110% dmg, 10% miss — Mud 3t, Weaken 18%', newAilment:'mud', ailChance:100, newAilment2:'weaken', ailChance2:18},
      {lv:4, desc:'120% dmg, 8% miss — Mud 3t, Weaken 24% + Burn 10%', newAilment:'mud', ailChance:100, newAilment2:'weaken', ailChance2:24},
    ]
  );

  setLevels('cactiSpine',
    'Spine volley. Accurate ranged pierce that injects poison.',
    [
      {lv:1, desc:'100% dmg, 12% miss — Poison 20%', newAilment:'poison', ailChance:20},
      {lv:2, desc:'110% dmg, 10% miss — Poison 25%', ailChance:25},
      {lv:3, desc:'120% dmg, 8% miss — Poison 30%', ailChance:30},
      {lv:4, desc:'130% dmg, 6% miss — Poison 35% + 1 extra stack', ailChance:35},
    ]
  );

  setLevels('rockDrop',
    'Delayed ranged hit. Size-scaled damage with reliable structure-breaking force.',
    [
      {lv:1, desc:'105% dmg, 14% miss. Ignores shields.'},
      {lv:2, desc:'118% dmg, 12% miss. Ignores shields, Burn 10%', newAilment:'burning', ailChance:10},
      {lv:3, desc:'131% dmg, 10% miss. Ignores shields, Burn 16%', ailChance:16},
      {lv:4, desc:'144% dmg, 8% miss. Ignores shields, Burn 22% + Weaken 12%', ailChance:22, newAilment2:'weaken', ailChance2:12},
    ]
  );

  setLevels('aerialPoop',
    'Bombing run. Accurate chip damage with strong accuracy disruption.',
    [
      {lv:1, desc:'80% dmg, 10% miss — ACC -15% for 2t'},
      {lv:2, desc:'90% dmg, 8% miss — ACC -18% for 2t'},
      {lv:3, desc:'100% dmg, 6% miss — ACC -20% for 3t'},
      {lv:4, desc:'110% dmg, 5% miss — ACC -24% for 3t + Burn 10%', newAilment:'burning', ailChance:10},
    ]
  );

  // Flamingo ranger
  setLevels('mudLash',
    'Whip-like strike. Ranger pressure tool focused on poison and steady sustain.',
    [
      {lv:1, desc:'95% dmg, 15% miss — 1 Poison stack, 10% Confuse', newAilment:'poison', ailChance:100},
      {lv:2, desc:'106% dmg, 12% miss — 1-2 Poison stacks, heal 8% of damage', ailChance:100},
      {lv:3, desc:'117% dmg, 10% miss — 2 Poison stacks, heal 10% of damage', ailChance:100},
      {lv:4, desc:'128% dmg, 8% miss — 2 Poison stacks, heal 12%, Burn 10%', ailChance:100, newAilment2:'burning', ailChance2:10},
    ]
  );

  // Bowerbird / ranger utility
  setLevels('stickLance',
    'Use twice in a row: first gather a stick, then strike for heavy ranged damage.',
    [
      {lv:1, desc:'Turn 1: gather. Turn 2: 140% dmg, 12% miss.'},
      {lv:2, desc:'Turn 1: gather. Turn 2: 155% dmg, 10% miss.'},
      {lv:3, desc:'Turn 1: gather. Turn 2: 170% dmg, 8% miss — Poison 15%', newAilment:'poison', ailChance:15},
      {lv:4, desc:'Turn 1: gather. Turn 2: 185% dmg, 6% miss — Poison 20% + Burn 10%', newAilment:'poison', ailChance:20, newAilment2:'burning', ailChance2:10},
    ]
  );

  // Seagull/Magpie summon support slightly flatter
  setLevels('mobSwarm',
    'Call a mob of birds. Multi-hit pressure with steady ailment scaling.',
    [
      {lv:1, desc:'2 hits, 55% mAtt each. 12% spell miss.'},
      {lv:2, desc:'2 hits, 62% mAtt each. 10% spell miss — Burn 12%', newAilment:'burning', ailChance:12},
      {lv:3, desc:'3 hits, 56% mAtt each. 9% spell miss — Burn 18%', ailChance:18},
      {lv:4, desc:'3 hits, 62% mAtt each. 8% spell miss — Burn 24% + Poison 10%', ailChance:24, newAilment2:'poison', ailChance2:10},
    ]
  );

  // Flatten a few over-swingy abilities into cleaner level curves
  setLevels('beakSlam',
    'Two-handed smash with stun pressure. Heavy burst, but smoother scaling.',
    [
      {lv:1, desc:'140% dmg, 18% miss, 25% stun'},
      {lv:2, desc:'155% dmg, 15% miss, 30% stun — Paralysis 15%', newAilment:'paralyzed', ailChance:15},
      {lv:3, desc:'170% dmg, 12% miss, 35% stun — Paralysis 20%', ailChance:20},
      {lv:4, desc:'185% dmg, 9% miss, 40% stun — Paralysis 25%', ailChance:25},
    ]
  );

  setLevels('diveBomb',
    'Heavy diving strike with stun chance. Ranger/assassin burst kept under control.',
    [
      {lv:1, desc:'150% dmg, 18% miss, 20% stun'},
      {lv:2, desc:'165% dmg, 16% miss, 24% stun'},
      {lv:3, desc:'180% dmg, 13% miss, 28% stun'},
      {lv:4, desc:'195% dmg, 10% miss, 32% stun + Burn 10%', newAilment:'burning', ailChance:10},
    ]
  );

  setLevels('shriekwave',
    'Explosive song blast. Burn-focused spell with cleaner capstone scaling.',
    [
      {lv:1, desc:'100% mAtt, 14% spell miss — Burn 20%', newAilment:'burning', ailChance:20},
      {lv:2, desc:'110% mAtt, 12% spell miss — Burn 25%', ailChance:25},
      {lv:3, desc:'120% mAtt, 10% spell miss — Burn 30%', ailChance:30},
      {lv:4, desc:'132% mAtt, 8% spell miss — Burn 35% + Weaken 12%', ailChance:35, newAilment2:'weaken', ailChance2:12},
    ]
  );

  // Flyby and Charge Up as cooldown attacks with clear level scaling
  setLevels('flyby',
    'A fast setup strike. Your next damaging attack this battle deals increased damage.',
    [
      {lv:1, desc:'1 EN, 2t cooldown. Next damaging attack this battle deals +35% damage.'},
      {lv:2, desc:'1 EN, 2t cooldown. Next damaging attack this battle deals +45% damage.'},
      {lv:3, desc:'1 EN, 2t cooldown. Next damaging attack this battle deals +55% damage.'},
      {lv:4, desc:'1 EN, 2t cooldown. Next damaging attack this battle deals +65% damage and gains +10% accuracy.'},
    ]
  );

  setLevels('chargeUp',
    'Gather power now, then strike harder later. Cooldown setup attack.',
    [
      {lv:1, desc:'1 EN, 3t cooldown. Next damaging attack deals +50% damage.'},
      {lv:2, desc:'1 EN, 3t cooldown. Next damaging attack deals +60% damage.'},
      {lv:3, desc:'1 EN, 3t cooldown. Next damaging attack deals +70% damage.'},
      {lv:4, desc:'1 EN, 3t cooldown. Next damaging attack deals +80% damage and pierces 10% DEF.'},
    ]
  );

  // Ranger class minor identity bump: more accuracy, poison/burn synergy.
  if(globalThis.BIRDS){
    ['robin','bowerbird','flamingo','magpie'].forEach(k=>{
      const b = BIRDS[k];
      if(b?.class === 'ranger' && b.stats){
        b.stats.acc = Math.min(95, (b.stats.acc||80) + 2);
      }
    });
  }
})();


// ===== 24_script_24.js =====

/* ===== Global class scaling pass ===== */
(function(){
  const T = globalThis.ABILITY_TEMPLATES || {};

  function setLevels(id, desc, levels){
    if(!T[id]) return;
    T[id].desc = desc;
    T[id].levels = levels;
  }

  /* Core scaling rule:
     Lv1 = identity
     Lv2 = modest damage/accuracy bump
     Lv3 = stronger ailment/utility
     Lv4 = capstone rider, not runaway numbers
  */

  /* ASSASSIN */
  setLevels('rapidPeck',
    'Multi-hit assassin basic. High-roll pressure with smoother scaling.',
    [
      {lv:1, desc:'2-3 hits, 8% miss each, 50% dmg, Pierce 20% DEF'},
      {lv:2, desc:'2-4 hits, 8% miss each, 56% dmg, Pierce 24% DEF — Poison 15%', newAilment:'poison', ailChance:15},
      {lv:3, desc:'3-4 hits, 7% miss each, 62% dmg, Pierce 28% DEF — Poison 20%', ailChance:20},
      {lv:4, desc:'3-5 hits, 6% miss each, 68% dmg, Pierce 32% DEF — Poison 25%', ailChance:25},
    ]
  );

  setLevels('blackPeck',
    'Weak hit that spikes through rhythm. Cleaner shadow scaling.',
    [
      {lv:1, desc:'90% dmg, 15% miss. Every 2nd use crits.'},
      {lv:2, desc:'100% dmg, 12% miss. Every 2nd use crits — Burn 15%', newAilment:'burning', ailChance:15},
      {lv:3, desc:'110% dmg, 9% miss. Every 2nd use crits — Burn 22%', ailChance:22},
      {lv:4, desc:'122% dmg, 6% miss. Every 2nd use crits — Burn 30% + crit damage up', ailChance:30},
    ]
  );

  setLevels('silentPierce',
    'A stealth strike that rarely misses and pierces defense.',
    [
      {lv:1, desc:'115% dmg, 8% miss. Pierce 15% DEF. 10% Fear'},
      {lv:2, desc:'126% dmg, 7% miss. Pierce 20% DEF. 14% Fear', newAilment:'feared', ailChance:14},
      {lv:3, desc:'138% dmg, 6% miss. Pierce 25% DEF. 18% Fear', ailChance:18},
      {lv:4, desc:'150% dmg, 5% miss. Pierce 30% DEF. 22% Fear + ignores block', ailChance:22},
    ]
  );

  setLevels('probeStrike',
    'Armor-piercing precision jab. Strong opener against healthy targets.',
    [
      {lv:1, desc:'105% dmg, 10% miss. Pierce 20% DEF'},
      {lv:2, desc:'116% dmg, 9% miss. Pierce 24% DEF'},
      {lv:3, desc:'128% dmg, 8% miss. Pierce 28% DEF — Poison 14%', newAilment:'poison', ailChance:14},
      {lv:4, desc:'140% dmg, 7% miss. Pierce 32% DEF — Poison 18% + bonus vs high HP', ailChance:18},
    ]
  );

  /* KNIGHT / TANK */
  setLevels('crowStrike',
    'Standard physical strike with steady scaling.',
    [
      {lv:1, desc:'100% dmg, 10% miss'},
      {lv:2, desc:'112% dmg, 8% miss — Poison 12%', newAilment:'poison', ailChance:12},
      {lv:3, desc:'124% dmg, 6% miss — Poison 18%', ailChance:18},
      {lv:4, desc:'136% dmg, 4% miss — Poison 24% + Weaken 10%', ailChance:24, newAilment2:'weaken', ailChance2:10},
    ]
  );

  setLevels('serpentCrusher',
    'Precise anti-poison finisher. Smooth knight scaling.',
    [
      {lv:1, desc:'115% dmg, 12% miss. +30% dmg vs Poisoned. 15% Paralysis', newAilment:'paralyzed', ailChance:15},
      {lv:2, desc:'128% dmg, 10% miss. +30% dmg vs Poisoned. 18% Paralysis', ailChance:18},
      {lv:3, desc:'141% dmg, 8% miss. +30% dmg vs Poisoned. 22% Paralysis + Weaken 14%', newAilment2:'weaken', ailChance2:14},
      {lv:4, desc:'154% dmg, 6% miss. +30% dmg vs Poisoned. 26% Paralysis + Weaken 18%', ailChance:26, ailChance2:18},
    ]
  );

  setLevels('shoebillClamp',
    'Heavy clamp with reliable stun pressure.',
    [
      {lv:1, desc:'130% dmg, 8% miss. Ignores 10% Dodge. 25% Stun'},
      {lv:2, desc:'142% dmg, 7% miss. Ignores 12% Dodge. 28% Stun + 1 Poison', newAilment:'poison', ailChance:100},
      {lv:3, desc:'155% dmg, 6% miss. Ignores 14% Dodge. 32% Stun + 2 Poison'},
      {lv:4, desc:'168% dmg, 5% miss. Ignores 16% Dodge. 36% Stun + 2 Poison + Weaken 12%', newAilment2:'weaken', ailChance2:12},
    ]
  );

  setLevels('headWhip',
    'Bruiser neck strike. Reliable impact with mild control.',
    [
      {lv:1, desc:'110% dmg, 14% miss'},
      {lv:2, desc:'122% dmg, 12% miss — Weaken 12%', newAilment:'weaken', ailChance:12},
      {lv:3, desc:'134% dmg, 10% miss — Weaken 18%', ailChance:18},
      {lv:4, desc:'146% dmg, 8% miss — Weaken 24% + Paralysis 8%', ailChance:24, newAilment2:'paralyzed', ailChance2:8},
    ]
  );

  setLevels('honkAttack',
    'Booming tank strike with reliable pressure.',
    [
      {lv:1, desc:'110% dmg, 25% miss'},
      {lv:2, desc:'122% dmg, 21% miss — Paralysis 12%', newAilment:'paralyzed', ailChance:12},
      {lv:3, desc:'134% dmg, 17% miss — Paralysis 16%', ailChance:16},
      {lv:4, desc:'146% dmg, 13% miss — Paralysis 20% + Weaken 10%', ailChance:20, newAilment2:'weaken', ailChance2:10},
    ]
  );

  setLevels('gooseHonk',
    'Territorial blast. Tank basic with reliability and weaken pressure.',
    [
      {lv:1, desc:'110% dmg, 24% miss'},
      {lv:2, desc:'122% dmg, 20% miss — Weaken 15%', newAilment:'weaken', ailChance:15},
      {lv:3, desc:'134% dmg, 16% miss — Weaken 20%', ailChance:20},
      {lv:4, desc:'146% dmg, 12% miss — Weaken 25% + 10% Paralysis', ailChance:25, newAilment2:'paralyzed', ailChance2:10},
    ]
  );

  setLevels('penguinHonk',
    'Frost-laced body check. Tank basic with chilled pressure.',
    [
      {lv:1, desc:'105% dmg, 22% miss — Chilled 18%', newAilment:'chilled', ailChance:18},
      {lv:2, desc:'118% dmg, 18% miss — Chilled 24%', ailChance:24},
      {lv:3, desc:'131% dmg, 14% miss — Chilled 30%', ailChance:30},
      {lv:4, desc:'144% dmg, 10% miss — Chilled 36% + Paralysis 10%', ailChance:36, newAilment2:'paralyzed', ailChance2:10},
    ]
  );

  /* MAGE / BARD / SUMMONER */
  setLevels('dirge',
    'Song control spell. Strong confusion with cleaner scaling.',
    [
      {lv:1, desc:'Confuse 2t, 30% skip chance'},
      {lv:2, desc:'Confuse 2t, 36% skip chance — Paralysis 18%', newAilment:'paralyzed', ailChance:18},
      {lv:3, desc:'Confuse 3t, 42% skip chance — Paralysis 24% + Resonance 12', ailChance:24},
      {lv:4, desc:'Confuse 3t, 48% skip chance — Paralysis 30% + Resonance 20', ailChance:30},
    ]
  );

  setLevels('lullaby',
    'Song debuff spell. Slows offense rather than bursting.',
    [
      {lv:1, desc:'ATK ×0.75 for 3t'},
      {lv:2, desc:'ATK ×0.68 for 3t — Resonance 12', newAilment:'delayed', delayDmg:12},
      {lv:3, desc:'ATK ×0.60 for 4t — Resonance 20'},
      {lv:4, desc:'ATK ×0.52 for 4t — Resonance 28 + Dodge down'},
    ]
  );

  setLevels('birdBrain',
    'Psychic overload. Direct magic hit with confusion pressure.',
    [
      {lv:1, desc:'110% mAtt. 18% Confuse'},
      {lv:2, desc:'120% mAtt. 22% Confuse'},
      {lv:3, desc:'130% mAtt. 26% Confuse'},
      {lv:4, desc:'142% mAtt. 30% Confuse + Weaken 10%'},
    ]
  );

  setLevels('owlPsyche',
    'Dark psychic burst. Fear-focused caster strike.',
    [
      {lv:1, desc:'100% mAtt. 18% Fear'},
      {lv:2, desc:'110% mAtt. 22% Fear'},
      {lv:3, desc:'120% mAtt. 26% Fear'},
      {lv:4, desc:'132% mAtt. 30% Fear + Weaken 10%'},
    ]
  );

  setLevels('sonicDirge',
    'Piercing wail. Spell pressure with turn disruption.',
    [
      {lv:1, desc:'100% mAtt, 14% spell miss. 18% Sonic Skip'},
      {lv:2, desc:'110% mAtt, 12% spell miss. 22% Sonic Skip'},
      {lv:3, desc:'120% mAtt, 10% spell miss. 26% Sonic Skip'},
      {lv:4, desc:'132% mAtt, 8% spell miss. 30% Sonic Skip + Burn 10%'},
    ]
  );

  setLevels('supersonic',
    'Speed-scaled sonic strike. Reliable summoner tempo tool.',
    [
      {lv:1, desc:'100% SPD-scaled dmg. Ignores dodge.'},
      {lv:2, desc:'112% SPD-scaled dmg. Ignores dodge.'},
      {lv:3, desc:'124% SPD-scaled dmg. Ignores dodge — Weaken 12%'},
      {lv:4, desc:'136% SPD-scaled dmg. Ignores dodge — Weaken 18% + Burn 8%'},
    ]
  );

  setLevels('wormRiot',
    'Bait frenzy. Utility spell that exposes the enemy.',
    [
      {lv:1, desc:'70% mAtt. Enemy becomes Vulnerable +15%'},
      {lv:2, desc:'80% mAtt. Enemy becomes Vulnerable +18%'},
      {lv:3, desc:'90% mAtt. Enemy becomes Vulnerable +20%'},
      {lv:4, desc:'100% mAtt. Enemy becomes Vulnerable +22% + Slow 10%'},
    ]
  );

  setLevels('wingStorm',
    'Storm of wings. Summoner burst with smoother end scaling.',
    [
      {lv:1, desc:'2 hits, 60% mAtt each. 12% spell miss.'},
      {lv:2, desc:'2 hits, 67% mAtt each. 10% spell miss — Slow 12%'},
      {lv:3, desc:'3 hits, 58% mAtt each. 9% spell miss — Slow 18%'},
      {lv:4, desc:'3 hits, 64% mAtt each. 8% spell miss — Slow 24% + Burn 8%'},
    ]
  );

  /* BRUISER / PREDATOR */
  setLevels('fleshRipper',
    'Hook and tear. Heavy predator strike with burn scaling.',
    [
      {lv:1, desc:'125% dmg, 10% miss. Burn 3t. +15% Crit', newAilment:'burning', ailChance:100},
      {lv:2, desc:'138% dmg, 8% miss. Burn 3t. +18% Crit', ailChance:100},
      {lv:3, desc:'151% dmg, 6% miss. Burn 4t. +20% Crit. +20% dmg vs <50% HP', ailChance:100},
      {lv:4, desc:'164% dmg, 4% miss. Burn 4t. +22% Crit. +28% dmg vs <50% HP', ailChance:100},
    ]
  );

  setLevels('fishSnatcher',
    'Spear-like finisher. Accurate strike with buff theft pressure.',
    [
      {lv:1, desc:'120% dmg, 14% miss. 20% Steal. +10% dmg vs <50% HP'},
      {lv:2, desc:'132% dmg, 11% miss. 24% Steal. +12% dmg vs <50% HP'},
      {lv:3, desc:'144% dmg, 8% miss. 28% Steal. Heal 22% of dmg dealt'},
      {lv:4, desc:'156% dmg, 5% miss. 32% Steal. Heal 28% of dmg dealt + Weaken 12%', newAilment:'weaken', ailChance:12},
    ]
  );

  setLevels('serratedSlash',
    'Rake with a comb-edged beak. Bleed-focused bard bruiser strike.',
    [
      {lv:1, desc:'105% dmg, 12% miss. 1 Bleed stack. Heal 10% HP over 2t', newAilment:'bleed', ailChance:100},
      {lv:2, desc:'116% dmg, 10% miss. 2 Bleed stacks. Cleanse 1 debuff', ailChance:100},
      {lv:3, desc:'127% dmg, 8% miss. 2 Bleed stacks. Cleanse 2 debuffs. +12% crit', ailChance:100},
      {lv:4, desc:'138% dmg, 6% miss. 3 Bleed stacks. Cleanse all debuffs. +18% crit', ailChance:100},
    ]
  );

  setLevels('serratedBill',
    'Hooked beak strike. Consistent pressure with ailment capstone.',
    [
      {lv:1, desc:'100% dmg, 14% miss'},
      {lv:2, desc:'112% dmg, 12% miss — Burn 12%', newAilment:'burning', ailChance:12},
      {lv:3, desc:'124% dmg, 10% miss — Burn 18%', ailChance:18},
      {lv:4, desc:'136% dmg, 8% miss — Burn 24% + Poison 10%', ailChance:24, newAilment2:'poison', ailChance2:10},
    ]
  );
})();
