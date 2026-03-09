// ===== 28_system-fixes.js =====

(function(){

/* ---------- BOWED WING FIX ---------- */
const oldResolveAbility = globalThis.resolveAbility;
if(typeof oldResolveAbility === "function"){
  globalThis.resolveAbility = function(user, target, ability){
    if(ability && String(ability.id||ability).toLowerCase()==="bowedwing"){
        const atk = user.ATK || user.atk || 5;
        const dmg = Math.floor(atk * 0.9);
        if(globalThis.applyDamage) applyDamage(target,dmg,"physical");
        if(globalThis.applyStatus) applyStatus(target,"weaken",2);
        if(globalThis.logBattle) logBattle(`${user.name} used Bowed Wing!`);
        return;
    }
    return oldResolveAbility.apply(this, arguments);
  }
}

/* ---------- STORK SHOP TOOLTIP FIX ---------- */
function attachAbilityTooltip(card, ability){
   if(!card || !ability) return;
   card.dataset.description = ability.description || ability.desc || "Ability";
   card.addEventListener("mouseenter", e=>{
      if(globalThis.showTooltip) showTooltip(card.dataset.description);
   });
   card.addEventListener("mouseleave", ()=>{
      if(globalThis.hideTooltip) hideTooltip();
   });
}

const oldBuildShop = globalThis.buildStorkShop || globalThis.buildShop;
if(oldBuildShop){
   const fnName = globalThis.buildStorkShop ? "buildStorkShop":"buildShop";
   const oldFn = globalThis[fnName];
   globalThis[fnName] = function(){
      const out = oldFn.apply(this,arguments);
      try{
         document.querySelectorAll(".shop-card").forEach(card=>{
            const abilityId = card.dataset.ability;
            if(globalThis.ABILITIES && ABILITIES[abilityId]){
               attachAbilityTooltip(card, ABILITIES[abilityId]);
            }
         });
      }catch(e){}
      return out;
   }
}

/* ---------- BIRD UNLOCK FIX ---------- */
function loadUnlocks(){
   try{
      const saved = localStorage.getItem("avian_unlocks");
      if(saved){
         globalThis.G.unlocks = JSON.parse(saved);
      }else{
         globalThis.G.unlocks = {};
      }
   }catch(e){
      globalThis.G.unlocks = {};
   }
}

function saveUnlocks(){
   try{
      localStorage.setItem("avian_unlocks",JSON.stringify(globalThis.G.unlocks));
   }catch(e){}
}

globalThis.unlockBird = function(id){
   if(!globalThis.G.unlocks) globalThis.G.unlocks={};
   globalThis.G.unlocks[id]=true;
   saveUnlocks();
   if(globalThis.buildBirdGrid) buildBirdGrid();
}

document.addEventListener("DOMContentLoaded",()=>{
   if(!globalThis.G) globalThis.G={};
   loadUnlocks();
});

})();


