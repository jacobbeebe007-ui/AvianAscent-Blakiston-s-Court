// ===== 09_script_09.js =====

/* ===== Duke Blakiston sprite + plan fix ===== */
(function(){
  const _origRenderBirdIconHTML = globalThis.renderBirdIconHTML;
  if(typeof _origRenderBirdIconHTML === 'function'){
    globalThis.renderBirdIconHTML = function(birdKey, sizeClass, locked){
      const k = String(birdKey||'').toLowerCase().replace(/[^a-z]/g,'');
      if(k === 'dukeblakiston'){
        return `<div class="sprite4 ${sizeClass||'boss'} sprite-dukeblakiston frame-0 ${locked?'locked':''}"></div>`;
      }
      return _origRenderBirdIconHTML.apply(this, arguments);
    };
  }

  const _origMakeDuke = globalThis.makeDukeBlakiston;
  if(typeof _origMakeDuke === 'function'){
    globalThis.makeDukeBlakiston = function(){
      const e = _origMakeDuke.apply(this, arguments);
      e.portraitKey = 'duke_blakiston';
      e.id = e.id || 'duke_blakiston';
      return e;
    };
  }

  function setBlakistonFrame(frameClass){
    try{
      const el = document.querySelector('#enemy-avatar .sprite-dukeblakiston');
      if(!el) return;
      el.classList.remove('frame-0','frame-1','frame-2','frame-3','boss-power');
      el.classList.add(frameClass);
    }catch(_){}
  }

  function animateBlakistonFromIntent(){
    try{
      const el = document.querySelector('#enemy-avatar .sprite-dukeblakiston');
      if(!el) return;
      el.classList.add('boss-hover');

      const label = String(globalThis.G?.enemyNextAction?.label || '').toLowerCase();
      if(label.includes('nightfall') || label.includes('verdict') || label.includes('ultimate') || label.includes('power')){
        setBlakistonFrame('frame-3');
        el.classList.add('boss-power');
      }else if(label.includes('river') || label.includes('dash') || label.includes('talon') || label.includes('rending')){
        setBlakistonFrame('frame-2');
      }else if(label.includes('summon') || label.includes('call') || label.includes('court')){
        setBlakistonFrame('frame-1');
      }else{
        setBlakistonFrame('frame-0');
      }
    }catch(_){}
  }

  const _origRenderEnemyPlan = globalThis.renderEnemyPlan;
  if(typeof _origRenderEnemyPlan === 'function'){
    globalThis.renderEnemyPlan = function(){
      const G = globalThis.G;
      if(G?.enemy?.aiType === 'boss_duke'){
        if(!G.enemyNextAction || !Array.isArray(G.enemyNextAction.actions) || !G.enemyNextAction.actions.length){
          let label = '🦉 Talons';
          const d = G.enemy.duke || {};
          const enraged = !!(globalThis.isBossEnrageAllowed?.() && G.enemy.stats?.hp <= Math.floor((G.enemy.stats?.maxHp||1)*0.35));
          if((d.phase||1) === 1 && G.enemy.stats?.hp <= Math.floor((G.enemy.stats?.maxHp||1)*0.75)) label = '🌑 Nightfall';
          else if((d.verdictCd||0)===0 && ((G.player?.stats?.hp||0) <= Math.floor((G.player?.stats?.maxHp||1)*0.40) || enraged)) label = "🦉 Owl's Verdict";
          else if((d.summonCd||0)===0 && !(G.enemyStatus?.wardens>0) && (((d.phase||1) >= 3) || ((G.enemy.stats?.hp||1) <= Math.floor((G.enemy.stats?.maxHp||1)*0.55)))) label = '🛡️ Summon Court';
          else if((d.riverCd||0)===0 && !(G.playerStatus?.rooted>0) && !(G.playerStatus?.slow>0) && (d.phase||1)>=2) label = '🌊 River Grip';
          G.enemyNextAction = {
            label,
            type:'plan',
            actions:[{type:'plan', label:label.replace(/^.[ ]?/,''), icon:label.split(' ')[0] || '🦉', energyCost:1}]
          };
        }
      }
      const out = _origRenderEnemyPlan.apply(this, arguments);
      animateBlakistonFromIntent();
      return out;
    };
  }

  const _origRefreshBattleUI = globalThis.refreshBattleUI;
  if(typeof _origRefreshBattleUI === 'function'){
    globalThis.refreshBattleUI = function(){
      const out = _origRefreshBattleUI.apply(this, arguments);
      animateBlakistonFromIntent();
      return out;
    };
  }

  const _origStartBlakistonDebugBattle = globalThis.startBlakistonDebugBattle;
  if(typeof _origStartBlakistonDebugBattle === 'function'){
    globalThis.startBlakistonDebugBattle = function(){
      const out = _origStartBlakistonDebugBattle.apply(this, arguments);
      try{
        if(globalThis.G?.enemy){
          globalThis.G.enemy.portraitKey = 'duke_blakiston';
        }
        animateBlakistonFromIntent();
      }catch(_){}
      return out;
    };
  }
})();


// ===== 10_script_10.js =====

/* ===== Ability balance + ailment wiring patch ===== */
(function(){
  const PATCHES = {"evade":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[3,3,3,3],"desc":"+25% dodge for 3 turns. Universal utility.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"crowDefend":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Block the next incoming hit. Universal utility.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"roost":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[3,3,3,3],"allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"preen":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Cleanse your debuffs.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"hum":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Hum a warding tone. Gain +20% dodge for 3 turns.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"counter":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[3,3,3,3],"desc":"Brace and reflect the next physical or ranged hit.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"chargeUp":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Charge power now; your next attack deals double damage.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"fruitSweetener":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[3,3,3,3],"desc":"Restore 15% HP instantly.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"molt":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Cleanse 1 negative status and reduce enemy DEF.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"reveille":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[3,3,3,3],"desc":"Regenerate HP over 3 turns.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"battleHymn":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[4,4,4,4],"desc":"Raise DEF for 3 turns; higher levels also add Dodge.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"skyHymn":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[4,4,4,4],"desc":"Heal slightly and grant momentum for the next turn.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"victoryChant":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[4,4,4,4],"desc":"Restore HP and reduce all cooldowns by 1.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"taunt":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Force the enemy to target you next turn at reduced accuracy.","allowedClasses":["assassin","ranger","knight","tank","mage","trickster","bard","summoner"]},"bulwarkRoar":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[3,3,3,3],"desc":"Gain DEF for 3 turns and reduce enemy ATK. Bruiser utility.","allowedClasses":["knight","tank"]},"shieldWing":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Raise a shield-wing and gain block based on DEF.","allowedClasses":["knight","tank"]},"guardianCry":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Gain DEF and cleanse one debuff.","allowedClasses":["knight","tank"]},"ironHonk":{"energyCost":1,"energyByLevel":[1,1,1,1],"desc":"Tank strike with reliable Weaken pressure.","allowedClasses":["knight","tank"]},"cannonball":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[3,3,3,3],"desc":"Massive body slam. High damage with slight recoil.","allowedClasses":["knight","tank"]},"retribution":{"energyCost":1,"energyByLevel":[1,1,1,1],"desc":"130% damage. Guaranteed crit if the enemy has any negative status.","allowedClasses":["knight","tank"]},"curvedTalons":{"energyCost":2,"energyByLevel":[2,2,2,2],"desc":"Heavy slashing strike that inflicts bleed.","allowedClasses":["knight","tank"]},"eyeGouge":{"energyCost":1,"energyByLevel":[1,1,1,1],"desc":"Peck at the eyes. Small damage and enemy ACC down.","allowedClasses":["knight","tank"]},"dirge":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[3,3,3,3],"desc":"Song \u2014 confuse enemy for 2 turns. Caster control.","allowedClasses":["mage","trickster","bard","summoner"]},"lullaby":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[3,3,3,3],"desc":"Song \u2014 slow enemy and reduce ATK. Caster control.","allowedClasses":["mage","trickster","bard","summoner"]},"sonicDirge":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[3,3,3,3],"desc":"Piercing sonic spell that can disrupt the enemy turn.","allowedClasses":["mage","trickster","bard","summoner"]},"shriekwave":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[3,3,3,3],"desc":"Explosive song blast that applies Burn.","allowedClasses":["mage","trickster","bard","summoner"]},"astralRefrain":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[3,3,3,3],"desc":"Astral refrain \u2014 130% mAtt and Weaken pressure.","allowedClasses":["mage","trickster","bard","summoner"]},"marshHex":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[3,3,3,3],"desc":"A hex from the marsh. Poison, Slow, and curse pressure.","allowedClasses":["mage","trickster","bard","summoner"]},"nightChill":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"90% mAtt and Chilled pressure.","allowedClasses":["mage","trickster","bard","summoner"]},"stormCall":{"energyCost":3,"energyByLevel":[3,3,3,3],"cooldownByLevel":[4,4,4,4],"desc":"Heavy lightning spell with burst damage.","allowedClasses":["mage","trickster","bard","summoner"]},"plagueBlast":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[3,3,3,3],"desc":"Blast the enemy with multiple poison stacks.","allowedClasses":["mage","trickster","bard","summoner"]},"toxicSpit":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[2,2,2,2],"desc":"Venomous spit. Strong poison application and bonus damage on poisoned targets.","allowedClasses":["mage","trickster","bard","summoner"]},"shadowFeint":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"A feinting strike that can inflict Confuse.","allowedClasses":["mage","trickster","bard","summoner"]},"shadowJab":{"energyCost":1,"energyByLevel":[1,1,1,1],"desc":"A focused dark jab with light Fear pressure.","allowedClasses":["mage","trickster","bard","summoner"]},"shadowPounce":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[2,2,2,2],"desc":"Burst strike that excels against debuffed targets.","allowedClasses":["mage","trickster","bard","summoner"]},"spellLance":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[1,1,1,1],"desc":"Focused magical thrust.","allowedClasses":["mage","trickster","bard","summoner"]},"dirgeOfDread":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[3,3,3,3],"desc":"Control song that applies Fear and Weaken.","allowedClasses":["mage","trickster","bard","summoner"]},"murderMurmuration":{"energyCost":3,"energyByLevel":[3,3,3,3],"cooldownByLevel":[4,4,4,4],"desc":"Summon a murderous flock for heavy multi-hit control damage.","allowedClasses":["mage","trickster","bard","summoner"]},"swoop":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Rush strike that never misses.","allowedClasses":["ranger","assassin"]},"diveBomb":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[3,3,3,3],"desc":"Heavy diving strike with stun chance.","allowedClasses":["ranger","assassin"]},"flyby":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Your next attack this battle deals 2\u00d7 damage.","allowedClasses":["ranger","assassin"]},"pinionVolley":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[1,1,1,1],"desc":"Two reliable piercing hits.","allowedClasses":["ranger","assassin"]},"bowedWing":{"energyCost":1,"energyByLevel":[1,1,1,1],"desc":"Reliable ranged poke with Slow pressure.","allowedClasses":["ranger","assassin"]},"wingClip":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Clip wings to reduce SPD; later also reduces Dodge.","allowedClasses":["ranger","assassin"]},"dustDevil":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[3,3,3,3],"desc":"Blinding storm that reduces enemy ACC.","allowedClasses":["ranger","assassin"]},"thornBarrage":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[2,2,2,2],"desc":"Rapid thorn volleys that pierce and stack Slow pressure.","allowedClasses":["ranger","assassin"]},"tailPull":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[2,2,2,2],"desc":"Remove 1 positive buff from the enemy.","allowedClasses":["ranger","assassin"]},"flurry":{"energyCost":2,"energyByLevel":[2,2,2,2],"cooldownByLevel":[2,2,2,2],"desc":"4\u20136 rapid strikes at 40% each.","allowedClasses":["assassin"]},"deathDive":{"energyCost":3,"energyByLevel":[3,3,3,3],"cooldownByLevel":[3,3,3,3],"desc":"200% damage plunge with high risk and stun chance.","allowedClasses":["assassin"]},"aerialPoop":{"energyCost":1,"energyByLevel":[1,1,1,1],"desc":"Bombing run \u2014 80% pAtt and enemy ACC -20% for 2 turns."},"birdBrain":{"energyCost":2,"energyByLevel":[2,2,2,2],"desc":"Psychic overload \u2014 120% mAtt and 25% Confuse."},"cactiSpine":{"energyCost":1,"energyByLevel":[1,1,1,1],"desc":"Spine volley \u2014 110% pAtt and Poison."},"mudshot":{"energyCost":2,"energyByLevel":[2,2,2,2],"desc":"Fling mud \u2014 90% pAtt and apply Mud / Weaken pressure."},"owlPsyche":{"energyCost":2,"energyByLevel":[2,2,2,2],"desc":"Owl Psyche \u2014 110% mAtt and 25% Fear."},"supersonic":{"energyCost":1,"energyByLevel":[1,1,1,1],"desc":"A sonic strike that scales from SPD and ignores dodge."},"tookieTookie":{"energyCost":2,"energyByLevel":[2,2,2,2],"desc":"+40% ATK for 2 turns, but +20% miss chance while active."},"wormRiot":{"energyCost":1,"energyByLevel":[1,1,1,1],"desc":"Cause a worm frenzy \u2014 enemy gains minor regeneration but becomes Vulnerable."},"sitAndWait":{"energyCost":1,"energyByLevel":[1,1,1,1],"cooldownByLevel":[1,1,1,1],"desc":"Sit and wait. Gain +30% attack next turn; if struck first, the buff is lost."},"stickLance":{"energyCost":1,"energyByLevel":[1,1,1,1],"desc":"Use twice in a row: first gather a stick, then strike for heavy damage."}};

  function mergeAbilityPatch(tmpl, patch){
    if(!tmpl || !patch) return;
    Object.assign(tmpl, patch);
  }

  function applyAbilityPatches(store){
    if(!store) return;
    for(const [id, patch] of Object.entries(PATCHES)){
      if(store[id]) mergeAbilityPatch(store[id], patch);
    }
  }

  applyAbilityPatches(globalThis.ABILITY_TEMPLATES);
  applyAbilityPatches(globalThis.ABILITY_TEMPLATES_EXTRA);

  const _origGetAbilityEnergyCost = globalThis.getAbilityEnergyCost;
  if(typeof _origGetAbilityEnergyCost === 'function'){
    globalThis.getAbilityEnergyCost = function(ab, player){
      let cost = _origGetAbilityEnergyCost(ab, player);
      if(!ab) return 1;
      // Every ability costs at least 1 EN.
      cost = Math.max(1, cost||0);
      return cost;
    };
  }

  // Utility helpers for ailment objects
  function statusTurns(v){
    if(v == null) return 0;
    if(typeof v === 'number') return v;
    if(typeof v === 'object') return Math.max(0, v.turns||0);
    return 0;
  }

  if(typeof globalThis.applyAilment !== 'function') globalThis.applyAilment = function(target, ailId, stacks=1){
    const status = target==='player' ? G.playerStatus : G.enemyStatus;
    codexMark('statuses', ailId, 'seen');
    if(target==='player' && G.player){
      const bd=BIRDS[G.player.birdKey];
      const p=bd&&bd.passive;
      if(ailId==='poison'&&p&&p.immunePoison){ spawnFloat('player','🛡 Poison Immune!','fn-status'); return false; }
      if(ailId==='weaken'&&p&&p.immuneWeaken){ spawnFloat('player','🛡 Weaken Immune!','fn-status'); return false; }
      if(ailId==='feared'&&((p&&p.immuneFear)||G.player.stats.immuneFear)){ spawnFloat('player','🛡 Fear Immune!','fn-status'); return false; }
      if(ailId==='confused'&&p&&p.immuneConfused){ spawnFloat('player','🛡 Confuse Immune!','fn-status'); return false; }
      if(ailId==='paralyzed'&&((p&&p.immuneStun)||G.player.immuneParalyze)){ spawnFloat('player','🛡 Stun Immune!','fn-status'); return false; }
    }
    if(ailId==='poison' || ailId==='bleed'){
      const key = ailId==='bleed' ? 'bleed' : 'poison';
      if(!status[key]) status[key]={stacks:0,turns:3};
      const cap = target==='player' ? (G.player?.poisonCap||5) : 5;
      const biomeBonus=(target==='player' && (G.biomeMod?.enemyPoisonPlus||0)>0)?G.biomeMod.enemyPoisonPlus:0;
      status[key].stacks=Math.min((status[key].stacks||0)+stacks+biomeBonus, cap);
      status[key].turns=Math.max(status[key].turns||0,3);
      return true;
    }
    if(ailId==='weaken'){ status.weaken=Math.max(status.weaken||0,3); return true; }
    if(ailId==='paralyzed'){ status.paralyzed=Math.max(status.paralyzed||0,3); return true; }
    if(ailId==='burning'){ status.burning=Math.max(status.burning||0,3); return true; }
    if(ailId==='feared'){ status.feared=Math.max(status.feared||0,0)+Math.max(1,stacks); return true; }
    if(ailId==='confused'){
      const cur=status.confused||{turns:0,skipChance:0};
      status.confused={turns:Math.max(cur.turns||0,2),skipChance:Math.max(cur.skipChance||0,25)};
      return true;
    }
    if(ailId==='slow'){
      const cur=status.slow||{turns:0,spdPenalty:0,dodgePenalty:0};
      status.slow={turns:Math.max(cur.turns||0,3),spdPenalty:Math.max(cur.spdPenalty||0,2),dodgePenalty:Math.max(cur.dodgePenalty||0,10)};
      return true;
    }
    if(ailId==='mud'){
      const cur=status.mud||{turns:0};
      status.mud={turns:Math.max(cur.turns||0,2)};
      return true;
    }
    if(ailId==='chilled'){
      const cur=status.slow||{turns:0,spdPenalty:0,dodgePenalty:0};
      status.slow={turns:Math.max(cur.turns||0,2),spdPenalty:Math.max(cur.spdPenalty||0,3),dodgePenalty:Math.max(cur.dodgePenalty||0,5)};
      return true;
    }
    if(ailId==='delayed') return true;
    return true;
  };

  if(typeof globalThis.tickDoTs !== 'function') globalThis.tickDoTs = async function(who){
    const status=who==='player'?G.playerStatus:G.enemyStatus;
    const stats=who==='player'?G.player.stats:G.enemy.stats;
    const nm = who==='player' ? G.player.name : G.enemy.name;

    if(status.poison&&status.poison.stacks>0&&status.poison.turns>0){
      const tickMult = who==='player' ? (G.player?.poisonTickMult||1) : 1;
      const dmg=Math.max(1, Math.floor(status.poison.stacks * tickMult));
      stats.hp-=dmg;
      spawnFloat(who,`☣ -${dmg}`,'fn-poison');
      setHpBar(who,stats.hp,stats.maxHp);
      logMsg(`☣ Avian Poison deals ${dmg} poison damage to ${nm}!`,'poison-tick');
      if(who==='enemy' && globalThis.BS) BS.dmgDealt+=dmg;
      if(globalThis.SFX?.poison) SFX.poison();
      status.poison.turns--;
      if(status.poison.turns<=0) delete status.poison;
      await delay(350);
    }
    if(status.bleed&&status.bleed.stacks>0&&status.bleed.turns>0){
      const dmg=Math.max(1,Math.floor(status.bleed.stacks*1.5));
      stats.hp-=dmg;
      spawnFloat(who,`🩸 -${dmg}`,'fn-dmg');
      setHpBar(who,stats.hp,stats.maxHp);
      logMsg(`🩸 Bleed deals ${dmg} damage to ${nm}!`,'poison-tick');
      if(who==='enemy' && globalThis.BS) BS.dmgDealt+=dmg;
      status.bleed.turns--;
      if(status.bleed.turns<=0) delete status.bleed;
      await delay(350);
    }
    if(statusTurns(status.burning)>0){
      const dmg=Math.max(1,Math.floor((stats.maxHp||1)*0.04));
      stats.hp-=dmg;
      spawnFloat(who,`🔥 -${dmg}`,'fn-burn');
      setHpBar(who,stats.hp,stats.maxHp);
      logMsg(`🔥 Burn deals ${dmg} damage to ${nm}!`,'burn-tick');
      if(who==='enemy' && globalThis.BS) BS.dmgDealt+=dmg;
      if(typeof status.burning==='number') status.burning--;
      else status.burning.turns--;
      if(statusTurns(status.burning)<=0) delete status.burning;
      await delay(350);
    }
    if(status.delayed&&status.delayed.dmg>0){
      const dmg=status.delayed.dmg;
      stats.hp-=dmg;
      spawnFloat(who,`🎵 -${dmg}`,'fn-status');
      setHpBar(who,stats.hp,stats.maxHp);
      logMsg(`🎵 Resonance detonates! ${dmg} damage!`,'system');
      delete status.delayed;
      await delay(350);
    }
  };

  // Stork Shop learn pools for unused abilities
  globalThis.ABILITY_LEARN_POOLS = {
    support:["evade", "crowDefend", "roost", "preen", "hum", "counter", "chargeUp", "fruitSweetener", "molt", "reveille", "battleHymn", "skyHymn", "victoryChant", "taunt"],
    bruiser:["bulwarkRoar", "shieldWing", "guardianCry", "ironHonk", "cannonball", "retribution", "curvedTalons", "eyeGouge"],
    caster:["dirge", "lullaby", "sonicDirge", "shriekwave", "astralRefrain", "marshHex", "nightChill", "stormCall", "plagueBlast", "toxicSpit", "shadowFeint", "shadowJab", "shadowPounce", "spellLance", "dirgeOfDread", "murderMurmuration"],
    ranger:["swoop", "diveBomb", "flyby", "pinionVolley", "bowedWing", "wingClip", "dustDevil", "thornBarrage", "tailPull"]
  };
})();


// ===== 11_script_11.js =====

/* ===== Piercing cleanup patch =====
   Use only effective-DEF reduction for pierce.
   Disable legacy flat bonus damage pierce path.
*/
(function(){
  const oldDealDamage = globalThis.dealDamage;
  if(typeof oldDealDamage === 'function'){
    globalThis.dealDamage = function(target, amount, isCrit=false, isMagic=false, srcAbility=null){
      const oldPierce = globalThis.G ? globalThis.G._currentPiercePct : 0;
      if(globalThis.G) globalThis.G._currentPiercePct = 0;
      try{
        return oldDealDamage.call(this, target, amount, isCrit, isMagic, srcAbility);
      } finally {
        if(globalThis.G) globalThis.G._currentPiercePct = 0;
      }
    };
  }
})();


// ===== 12_script_12.js =====

/* ===== Enemy balance pass ===== */
(function(){
  function turnsOf(v){
    if(v == null) return 0;
    if(typeof v === 'number') return v;
    if(typeof v === 'object') return Math.max(0, v.turns || 0);
    return 0;
  }

  // Rebalance enemy ability implementations.
  if(globalThis.ENEMY_ABILITY_POOL){
    if(ENEMY_ABILITY_POOL.eVenom){
      ENEMY_ABILITY_POOL.eVenom.name = 'Venom Peck';
      ENEMY_ABILITY_POOL.eVenom.desc = 'Deal light physical damage and apply 2 Poison stacks.';
      ENEMY_ABILITY_POOL.eVenom.fn = function(e,p,G){
        const r = dealDamage('player', edmg(0.8));
        spawnFloat('player', `-${r.dmgDealt}`, 'fn-dmg');
        applyAilment('player','poison',2);
        logMsg(`☣ ${e.name} pecks with venom!`, 'enemy-action');
      };
    }
    if(ENEMY_ABILITY_POOL.eWeaken){
      ENEMY_ABILITY_POOL.eWeaken.desc = 'Apply Weaken for 3 turns.';
      ENEMY_ABILITY_POOL.eWeaken.fn = function(e,p,G){
        const _bd=BIRDS[G.player.birdKey]; const ps=_bd&&_bd.passive;
        if(ps&&ps.immuneWeaken){ spawnFloat('player','🛡 Immune!','fn-status'); return; }
        G.playerStatus.weaken = Math.max(G.playerStatus.weaken||0, 3);
        logMsg(`🐔 ${e.name} weakens you!`,'enemy-action');
      };
    }
    if(ENEMY_ABILITY_POOL.eStun){
      ENEMY_ABILITY_POOL.eStun.desc = 'Deal 80% ATK and 25% chance to stun.';
      ENEMY_ABILITY_POOL.eStun.fn = function(e,p,G){
        const r = dealDamage('player', edmg(0.8));
        spawnFloat('player', `-${r.dmgDealt}`, 'fn-dmg');
        if(chance(25)) applyAilment('player','paralyzed',1);
        logMsg(`💥 ${e.name} slams into you!`, 'enemy-action');
      };
    }
    if(ENEMY_ABILITY_POOL.eFear){
      ENEMY_ABILITY_POOL.eFear.desc = 'Apply Fear. 1 turn normally, 2 for bosses.';
      ENEMY_ABILITY_POOL.eFear.fn = function(e,p,G){
        const turns = e.isBoss ? 2 : 1;
        const _bd=BIRDS[G.player.birdKey]; const ps=_bd&&_bd.passive;
        if((ps&&ps.immuneFear) || G.player.stats?.immuneFear){ spawnFloat('player','🛡 Fear Immune!','fn-status'); return; }
        G.playerStatus.feared = Math.min(2, Math.max(G.playerStatus.feared||0, turns));
        logMsg(`😨 ${e.name} terrifies you!`, 'enemy-action');
      };
    }
    if(ENEMY_ABILITY_POOL.eBurn){
      ENEMY_ABILITY_POOL.eBurn.desc = 'Apply Burn for 3 turns.';
      ENEMY_ABILITY_POOL.eBurn.fn = function(e,p,G){
        applyAilment('player','burning',1);
        G.playerStatus.burning = Math.max(turnsOf(G.playerStatus.burning), 3);
        logMsg(`🔥 ${e.name} scorches you!`, 'enemy-action');
      };
    }
    if(ENEMY_ABILITY_POOL.eHeal){
      ENEMY_ABILITY_POOL.eHeal.desc = 'Heal 15% max HP.';
      ENEMY_ABILITY_POOL.eHeal.fn = function(e,p,G){
        const heal = Math.max(1, Math.floor((e.stats.maxHp||1) * 0.15));
        e.stats.hp = Math.min(e.stats.maxHp, e.stats.hp + heal);
        spawnFloat('enemy', `+${heal}`, 'fn-heal');
        setHpBar('enemy', e.stats.hp, e.stats.maxHp);
        logMsg(`💚 ${e.name} recovers ${heal} HP!`, 'enemy-action');
      };
    }
    if(ENEMY_ABILITY_POOL.eRage){
      ENEMY_ABILITY_POOL.eRage.desc = 'Gain +25% ATK for 3 turns.';
      ENEMY_ABILITY_POOL.eRage.fn = function(e,p,G){
        if((G.enemyStatus.rageBuff||0) > 0){
          const r = dealDamage('player', edmg(1.0));
          spawnFloat('player', `-${r.dmgDealt}`, 'fn-dmg');
          logMsg(`💢 ${e.name} lashes out instead of raging again!`, 'enemy-action');
          return;
        }
        G.enemyStatus.rageBuff = 3;
        logMsg(`💢 ${e.name} enters a fury for 3 turns!`, 'enemy-action');
      };
    }
    if(ENEMY_ABILITY_POOL.eBlind){
      ENEMY_ABILITY_POOL.eBlind.desc = 'Apply Blind for 2 turns.';
      ENEMY_ABILITY_POOL.eBlind.fn = function(e,p,G){
        const cur = G.playerStatus.dustDevil || {turns:0, accDrop:0};
        G.playerStatus.dustDevil = {turns: Math.max(cur.turns||0, 2), accDrop: Math.max(cur.accDrop||0, 15)};
        logMsg(`🌪 ${e.name} blinds you!`, 'enemy-action');
      };
    }
    if(ENEMY_ABILITY_POOL.ePoison){
      ENEMY_ABILITY_POOL.ePoison.desc = 'Apply 3 Poison stacks.';
      ENEMY_ABILITY_POOL.ePoison.fn = function(e,p,G){
        applyAilment('player','poison',3);
        logMsg(`☣ ${e.name} infects you with plague!`, 'enemy-action');
      };
    }
    if(ENEMY_ABILITY_POOL.eShield){
      ENEMY_ABILITY_POOL.eShield.desc = 'Gain Block for 2 turns.';
      ENEMY_ABILITY_POOL.eShield.fn = function(e,p,G){
        if((G.enemyStatus.defending||0) > 0){
          const r = dealDamage('player', edmg(0.9));
          spawnFloat('player', `-${r.dmgDealt}`, 'fn-dmg');
          logMsg(`🛡 ${e.name} is already guarded and strikes instead!`, 'enemy-action');
          return;
        }
        G.enemyStatus.defending = 2;
        doShield('enemy');
        logMsg(`🛡 ${e.name} hardens its feathers for 2 turns!`, 'enemy-action');
      };
    }
  }

  // Enemy damage: apply rage buff multiplier if active.
  const _oldEdmg = globalThis.edmg;
  if(typeof _oldEdmg === 'function'){
    globalThis.edmg = function(mult=1){
      let out = _oldEdmg.apply(this, arguments);
      try{
        if((G.enemyStatus?.rageBuff||0) > 0){
          out = Math.max(1, Math.floor(out * 1.25));
        }
      }catch(_){}
      return out;
    };
  }

  // Tick enemy timed statuses cleanly after enemy turn.
  const _oldAfterEnemyTurn = globalThis.afterEnemyTurn;
  if(typeof _oldAfterEnemyTurn === 'function'){
    globalThis.afterEnemyTurn = async function(){
      const out = await _oldAfterEnemyTurn.apply(this, arguments);
      try{
        if((G.enemyStatus.rageBuff||0) > 0) G.enemyStatus.rageBuff--;
        if((G.enemyStatus.defending||0) > 0) G.enemyStatus.defending = Math.max(0, G.enemyStatus.defending - 1);
        if((G.enemyStatus.feared||0) > 2) G.enemyStatus.feared = 2;
        if((G.playerStatus.feared||0) > 2) G.playerStatus.feared = 2;
        if((G.playerStatus.weaken||0) > 3) G.playerStatus.weaken = 3;
        if(G.playerStatus.dustDevil?.turns > 2) G.playerStatus.dustDevil.turns = 2;
      }catch(_){}
      return out;
    };
  }

  // Smarter enemy action choice: less control spam, no pointless heal/shield loops.
  const _oldEnemyActionFromPool = globalThis.enemyActionFromPool;
  if(typeof _oldEnemyActionFromPool === 'function'){
    globalThis.enemyActionFromPool = function(e,key){
      const mode = getEnemyMode(e,G.player);
      const pool = buildEnemyActionPool(e,mode) || [];
      const strike = pool.find(a=>a.type==='strike') || {type:'strike',icon:'⚔',label:'Attack'};
      const heavy = pool.find(a=>a.type==='heavy') || pool.find(a=>a.type==='ability'&&['eStun','eRage'].includes(a.abilityId)) || strike;
      let defend = pool.find(a=>a.type==='defend') || pool.find(a=>a.type==='ability'&&['eShield','eHeal'].includes(a.abilityId)) || strike;
      let debuff = pool.find(a=>a.type==='ability'&&['eWeaken','eFear','eBlind'].includes(a.abilityId)) || strike;

      if(defend.abilityId==='eShield' && (G.enemyStatus.defending||0)>0) defend = strike;
      if(defend.abilityId==='eHeal' && ((e.stats.hp||1)/Math.max(1,e.stats.maxHp||1))>0.65) defend = strike;

      if(debuff.abilityId==='eFear' && (G.playerStatus.feared||0)>=1) debuff = strike;
      if(debuff.abilityId==='eWeaken' && (G.playerStatus.weaken||0)>=3) debuff = strike;
      if(debuff.abilityId==='eBlind' && (G.playerStatus.dustDevil?.turns||0)>=2) debuff = strike;

      let a = strike;
      if(key==='heavy'){
        a = heavy;
        if(a.abilityId==='eRage' && (G.enemyStatus.rageBuff||0)>0) a = strike;
      }else if(key==='defend'){
        a = defend;
      }else if(key==='debuff'){
        a = debuff;
      }else{
        a = strike;
      }
      return {...a, energyCost:getEnemyActionEnergyCost(a)};
    };
  }

  // Rebalance action pool construction by mode.
  const _oldBuildEnemyActionPool = globalThis.buildEnemyActionPool;
  if(typeof _oldBuildEnemyActionPool === 'function'){
    globalThis.buildEnemyActionPool = function(e, mode){
      const pool = _oldBuildEnemyActionPool.apply(this, arguments) || [];
      // Reweight by duplicating or filtering.
      const out = [];
      const hpPct = (e?.stats?.hp||1)/Math.max(1,e?.stats?.maxHp||1);
      for(const a of pool){
        const id = a.abilityId || '';
        const t = a.type || '';
        let weight = 1;
        if(mode==='setup'){
          if(t==='strike') weight = 4;
          else if(t==='defend') weight = 1;
          else if(t==='ability' && ['eWeaken','eFear','eBlind'].includes(id)) weight = 2;
          else weight = 1;
        }else if(mode==='execute'){
          if(t==='strike') weight = 4;
          else if(t==='heavy') weight = 3;
          else if(t==='ability' && ['eStun','eBurn','ePoison'].includes(id)) weight = 2;
          else weight = 1;
        }else if(mode==='recover'){
          if(id==='eHeal' && hpPct > 0.65) weight = 0;
          else if(id==='eShield' && (G.enemyStatus.defending||0)>0) weight = 0;
          else if(t==='strike') weight = 3;
          else if(t==='defend') weight = 1;
          else weight = 1;
        }
        for(let i=0;i<weight;i++) out.push(a);
      }
      return out.length ? out : pool;
    };
  }
})();


// ===== 13_script_13.js =====

/* ===== Damage scaling + tank ATK tune + Stork Shop ability details ===== */
(function(){
  // Interpreting "Tank Base art" as "Tank base ATK".
  const TANK_ATK_PATCH = {
    goose: 8,
    shoebill: 9,
    harpy: 12,
    penguin: 8,
    ostrich: 11,
    cassowary: 12,
    emu: 13
  };

  function patchTankAttackStats(){
    if(!globalThis.BIRDS) return;
    for(const [key, atk] of Object.entries(TANK_ATK_PATCH)){
      const b = BIRDS[key];
      if(!b || b.__tankAtkPatched) continue;
      if(b.class === 'tank' && b.stats){
        b.stats.atk = atk;
        if(b.statBars && typeof b.statBars.ATK === 'number') b.statBars.ATK = atk/15;
        b.__tankAtkPatched = true;
      }
    }
  }
  patchTankAttackStats();

  // Modest high-stat compression for player outgoing damage vs enemies.
  const _oldDealDamage = globalThis.dealDamage;
  if(typeof _oldDealDamage === 'function'){
    globalThis.dealDamage = function(target, amount, isCrit=false, isMagic=false, srcAbility=null){
      let adjAmount = amount;
      try{
        if(target === 'enemy' && globalThis.G?.player?.stats){
          const stat = isMagic ? (G.player.stats.matk || 0) : (G.player.stats.atk || 0);
          const threshold = isMagic ? 12 : 10;
          const factor = 1 - Math.max(0, Math.min(0.18, (stat - threshold) * 0.015));
          adjAmount = Math.max(1, Math.floor((amount||1) * factor));
        }
      }catch(_){}
      return _oldDealDamage.call(this, target, adjAmount, isCrit, isMagic, srcAbility);
    };
  }

  function resolveAbilityTemplateFromShopItem(item){
    if(!item || !item.id) return null;
    let id = null;
    if(item.id.startsWith('shop_ab_learn_')) id = item.id.replace('shop_ab_learn_','');
    else if(item.id.startsWith('shop_ab_upgrade_')) id = item.id.replace('shop_ab_upgrade_','');
    if(!id) return null;
    return (globalThis.ABILITY_TEMPLATES && ABILITY_TEMPLATES[id]) ||
           (globalThis.ABILITY_TEMPLATES_EXTRA && ABILITY_TEMPLATES_EXTRA[id]) ||
           null;
  }

  function abilityTooltipHTML(tmpl, level){
    if(!tmpl) return '';
    const lv = Math.max(1, Math.min(level || 1, Array.isArray(tmpl.levels) ? tmpl.levels.length : 1));
    const row = Array.isArray(tmpl.levels) ? tmpl.levels[lv-1] : null;
    const cost = (typeof tmpl.energyCost === 'number')
      ? tmpl.energyCost
      : (Array.isArray(tmpl.energyByLevel) ? (tmpl.energyByLevel[lv-1] ?? tmpl.energyByLevel[0] ?? 1) : 1);
    const cd = Array.isArray(tmpl.cooldownByLevel) ? (tmpl.cooldownByLevel[lv-1] ?? tmpl.cooldownByLevel[0] ?? 0) : 0;
    const tags = [];
    if(tmpl.type) tags.push(String(tmpl.type));
    if(tmpl.btnType && tmpl.btnType !== tmpl.type) tags.push(String(tmpl.btnType));
    const typeLine = tags.length ? tags.join(' · ') : 'ability';
    const baseDesc = tmpl.desc || 'No description.';
    const lvDesc = row && row.desc ? row.desc : '';
    return `
      <div class="tt-name">${tmpl.name}</div>
      <div class="tt-type">${typeLine} · Lv${lv}</div>
      <div class="tt-row"><span class="tt-lbl">Energy</span><span class="tt-val">${cost}</span></div>
      <div class="tt-row"><span class="tt-lbl">Cooldown</span><span class="tt-val">${cd>0 ? cd+' turn'+(cd>1?'s':'') : 'None'}</span></div>
      <div class="tt-desc" style="margin-top:6px">${baseDesc}</div>
      ${lvDesc ? `<div class="tt-desc" style="margin-top:6px;color:var(--text)">${lvDesc}</div>` : ''}
    `;
  }

  function showRichTooltip(ev, html){
    const tt=document.getElementById('action-tooltip');
    if(!tt) return;
    tt.innerHTML = html;
    tt.style.display='block';
    if(window._isTouchDevice){
      tt.style.left='50%'; tt.style.top='50%';
      tt.style.transform='translate(-50%,-50%)';
      tt.style.position='fixed';
    } else {
      tt.style.transform='';
      moveTooltip(ev);
    }
  }

  const _oldRenderShopItems = globalThis.renderShopItems;
  if(typeof _oldRenderShopItems === 'function'){
    globalThis.renderShopItems = function(){
      const out = _oldRenderShopItems.apply(this, arguments);
      try{
        const grid=document.getElementById('shop-items-grid');
        if(!grid) return out;
        const cards=[...grid.querySelectorAll('.shop-item')];
        cards.forEach((card, idx)=>{
          const item = (globalThis._shopItems||[])[idx];
          const tmpl = resolveAbilityTemplateFromShopItem(item);
          if(!tmpl) return;
          const html = abilityTooltipHTML(tmpl, 1);
          card.addEventListener('mouseenter', e=>{ if(!window._isTouchDevice) showRichTooltip(e, html); });
          card.addEventListener('mousemove', e=>{ if(!window._isTouchDevice) moveTooltip(e); });
          card.addEventListener('mouseleave', ()=>{ if(!window._isTouchDevice) hideTooltip(); });
          card.addEventListener('click', e=>{
            if(window._isTouchDevice) showRichTooltip(e, html);
          });
        });
      }catch(err){ console.error(err); }
      return out;
    };
  }

  const _oldOpenShopSwapModal = globalThis.openShopSwapModal;
  if(typeof _oldOpenShopSwapModal === 'function'){
    globalThis.openShopSwapModal = function(newTmpl, onPick, onCancel){
      const out = _oldOpenShopSwapModal.apply(this, arguments);
      try{
        const list=document.getElementById('shop-swap-list');
        if(!list) return out;
        const btns=[...list.querySelectorAll('button')];
        const pool=(G?.player?.abilities||[]).filter(a=>!isMainAttackAbility(a));
        btns.forEach((btn, idx)=>{
          const ab=pool[idx];
          if(!ab) return;
          const tmpl=(globalThis.ABILITY_TEMPLATES && ABILITY_TEMPLATES[ab.id]) ||
                     (globalThis.ABILITY_TEMPLATES_EXTRA && ABILITY_TEMPLATES_EXTRA[ab.id]) ||
                     ab;
          const html = abilityTooltipHTML(tmpl, ab.level||1);
          btn.addEventListener('mouseenter', e=>{ if(!window._isTouchDevice) showRichTooltip(e, html); });
          btn.addEventListener('mousemove', e=>{ if(!window._isTouchDevice) moveTooltip(e); });
          btn.addEventListener('mouseleave', ()=>{ if(!window._isTouchDevice) hideTooltip(); });
          btn.addEventListener('click', e=>{
            if(window._isTouchDevice) showRichTooltip(e, html);
          });
        });
      }catch(err){ console.error(err); }
      return out;
    };
  }
})();


// ===== 14_script_14.js =====

/* ===== Shop upgrade reliability + new balanced upgrades ===== */
(function(){
  function syncPlayerEnergyState(p){
    if(!p) return;
    try{
      if(typeof computePlayerMaxEnergy === 'function'){
        p.energyMax = computePlayerMaxEnergy();
      } else {
        p.energyMax = Math.max(1, (p.energyMax||0) + (p.energyBonus||0));
      }
      if(typeof p.energy !== 'number') p.energy = p.energyMax;
      p.energy = Math.min(p.energy, p.energyMax);
      if(typeof renderEnergyOrbs === 'function') renderEnergyOrbs();
      if(typeof renderAllCombatUI === 'function' && G?.player===p) renderAllCombatUI();
    }catch(err){ console.error(err); }
  }

  const _origGetUpgradePool = globalThis.getUpgradePool;
  if(typeof _origGetUpgradePool === 'function'){
    globalThis.getUpgradePool = function(){
      const pool = _origGetUpgradePool.call(this).slice();

      function wrapApply(item){
        const oldApply = item.apply;
        item.apply = function(p){
          oldApply(p);
          syncPlayerEnergyState(p);
          if(typeof enforceAbilityCosts === 'function') enforceAbilityCosts(p);
        };
        return item;
      }

      // Patch existing energy upgrades so they always recalculate cap immediately.
      for(const item of pool){
        if(['r_energyMax1','e_energyMax2','l_energyMax3'].includes(item.id)){
          item.apply = (function(oldId){
            return function(p){
              if(oldId==='r_energyMax1') p.energyBonus = (p.energyBonus||0) + 1;
              if(oldId==='e_energyMax2') p.energyBonus = (p.energyBonus||0) + 2;
              if(oldId==='l_energyMax3') p.energyBonus = (p.energyBonus||0) + 3;
              syncPlayerEnergyState(p);
            };
          })(item.id);
        }
      }

      const extra = [
        wrapApply({
          id:'g_guardedCore', tier:'grey', icon:'🪵', name:'Guarded Core',
          desc:'DEF +1 and MDEF +1',
          tags:['defense','hybrid'],
          apply:p=>{ p.stats.def += 1; p.stats.mdef = (p.stats.mdef||0) + 1; }
        }),
        wrapApply({
          desc:'Restore 1 Energy now',
          tags:['utility','energy'],
          apply:p=>{ p.energy = Math.min((p.energyMax||0), (p.energy||0) + 1); }
        }),
        wrapApply({
          id:'u_battleReadiness', tier:'green', icon:'🧭', name:'Battle Readiness',
          desc:'+1 Energy on your first turn each battle and ACC +2',
          tags:['utility','energy','accuracy'],
          apply:p=>{ p.firstTurnEnergy=(p.firstTurnEnergy||0)+1; p.stats.acc=(p.stats.acc||80)+2; }
        }),
        wrapApply({
          id:'u_steadyPulse', tier:'green', icon:'💠', name:'Steady Pulse',
          desc:'MATK +1 and MDEF +1',
          tags:['offense','defense','magic'],
          apply:p=>{ p.stats.matk=(p.stats.matk||0)+1; p.stats.mdef=(p.stats.mdef||0)+1; }
        }),
        wrapApply({
          id:'r_secondWind', tier:'blue', icon:'🌀', name:'Second Wind',
          desc:'Heal 20% HP and gain +1 Max Energy',
          tags:['sustain','energy'],
          apply:p=>{ p.stats.hp=Math.min(p.stats.maxHp, p.stats.hp + Math.max(1, Math.floor(p.stats.maxHp*0.20))); p.energyBonus=(p.energyBonus||0)+1; }
        }),
        wrapApply({
          id:'r_spellguard', tier:'blue', icon:'🔹', name:'Spellguard Plumage',
          desc:'MDEF +2 and MDodge +6%',
          tags:['defense','magic'],
          apply:p=>{ p.stats.mdef=(p.stats.mdef||0)+2; p.stats.mdodge=Math.min((p.stats.mdodge||0)+6,100); }
        }),
        wrapApply({
          id:'e_apexFocus', tier:'purple', icon:'🜂', name:'Apex Focus',
          desc:'ATK +3, MATK +3, ACC +4',
          tags:['offense','hybrid'],
          apply:p=>{ p.stats.atk+=3; p.stats.matk=(p.stats.matk||0)+3; p.stats.acc=(p.stats.acc||80)+4; }
        }),
        wrapApply({
          id:'e_veteranPlumage', tier:'purple', icon:'🪶', name:'Veteran Plumage',
          desc:'DEF +2, MDEF +2, Dodge +6%',
          tags:['defense','hybrid'],
          apply:p=>{ p.stats.def+=2; p.stats.mdef=(p.stats.mdef||0)+2; p.stats.dodge=Math.min((p.stats.dodge||0)+6,100); }
        }),
        wrapApply({
          id:'l_skyBattery', tier:'gold', icon:'🌟', name:'Sky Battery',
          desc:'Max Energy +2 and gain 1 Energy at the start of every battle',
          tags:['utility','energy'],
          apply:p=>{ p.energyBonus=(p.energyBonus||0)+2; p.firstTurnEnergy=(p.firstTurnEnergy||0)+1; }
        }),
        wrapApply({
          id:'l_dualNature', tier:'gold', icon:'☯️', name:'Dual Nature',
          desc:'ATK +4, MATK +4, DEF +2, MDEF +2',
          tags:['offense','defense','hybrid'],
          apply:p=>{ p.stats.atk+=4; p.stats.matk=(p.stats.matk||0)+4; p.stats.def+=2; p.stats.mdef=(p.stats.mdef||0)+2; }
        })
      ];

      const seen = new Set(pool.map(x=>x.id));
      for(const item of extra){
        if(!seen.has(item.id)) pool.push(item);
      }
      return pool;
    };
  }

  // Re-render purchase descriptions more clearly after buy.
  const _origShopBuySelected = globalThis.shopBuySelected;
  if(typeof _origShopBuySelected === 'function'){
    globalThis.shopBuySelected = function(){
      const beforeEnergy = G?.player?.energyMax;
      const out = _origShopBuySelected.apply(this, arguments);
      try{
        syncPlayerEnergyState(G.player);
        const afterEnergy = G?.player?.energyMax;
        if(typeof renderShopItems === 'function') renderShopItems();
        if(afterEnergy && beforeEnergy && afterEnergy > beforeEnergy){
          logMsg(`⚡ Max Energy increased to ${afterEnergy}!`, 'exp-gain');
        }
      }catch(err){ console.error(err); }
      return out;
    };
  }
})();


// ===== 15_script_15.js =====

/* ===== Adjust Energy +1 upgrade tier ===== */
(function(){
  const bump = { grey:'green', green:'blue', blue:'purple', purple:'gold' };
  const oldGetUpgradePool = globalThis.getUpgradePool;
  if(typeof oldGetUpgradePool === 'function'){
    globalThis.getUpgradePool = function(){
      const pool = oldGetUpgradePool.apply(this, arguments);
      for(const item of pool){
        if(!item) continue;
        const name = (item.name||'').toLowerCase();
        const desc = (item.desc||'').toLowerCase();
        if(name.includes('energy') && desc.includes('+1') && desc.includes('energy')){
          if(item.tier && bump[item.tier]) item.tier = bump[item.tier];
        }
        if(item.id === 'r_energyMax1'){
          item.tier = 'green';
        }
      }
      return pool;
    };
  }
})();


// ===== 16_script_16.js =====

/* ===== Energy tooltip + bonus pulse ===== */
(function(){
  function flashBonusEnergy(beforeMax, afterMax){
    try{
      if(!G?.player) return;
      const diff = Math.max(0, (afterMax||0) - (beforeMax||0));
      if(diff > 0){
        G.player._newBonusEnergyFlash = diff;
        if(typeof renderEnergyOrbs === 'function') renderEnergyOrbs();
      }
    }catch(err){ console.error(err); }
  }

  const _origShopBuySelectedEnergy = globalThis.shopBuySelected;
  if(typeof _origShopBuySelectedEnergy === 'function'){
    globalThis.shopBuySelected = function(){
      const beforeMax = G?.player?.energyMax || 0;
      const out = _origShopBuySelectedEnergy.apply(this, arguments);
      const afterMax = G?.player?.energyMax || 0;
      flashBonusEnergy(beforeMax, afterMax);
      return out;
    };
  }

  const _origRenderAllCombatUIEnergy = globalThis.renderAllCombatUI;
  if(typeof _origRenderAllCombatUIEnergy === 'function'){
    globalThis.renderAllCombatUI = function(){
      const out = _origRenderAllCombatUIEnergy.apply(this, arguments);
      try{ if(typeof renderEnergyOrbs === 'function') renderEnergyOrbs(); }catch(err){ console.error(err); }
      return out;
    };
  }
})();

