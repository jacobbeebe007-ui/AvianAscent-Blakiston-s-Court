// ===== 01_script_01.js =====

/* ===== Dove enemy + Stage 20 Blakiston boss ===== */
(function(){
  // Extend sprite renderer with Dove support.
  const _oldRenderBirdIconHTML = globalThis.renderBirdIconHTML;
  if (typeof _oldRenderBirdIconHTML === 'function') {
    globalThis.renderBirdIconHTML = function(birdKey, sizeClass, locked) {
      const k = String(birdKey || '').toLowerCase().replace(/[^a-z]/g, '');
      if (k === 'dove') {
        return `<div class="sprite4 ${sizeClass||''} sprite-dove frame-0 ${locked?'locked':''}"></div>`;
      }
      return _oldRenderBirdIconHTML.apply(this, arguments);
    };
  }

  // Make the normal Dove enemy use the Dove sprite instead of Swan.
  function patchDoveEnemy() {
    try {
      if (Array.isArray(globalThis.ENEMIES)) {
        const dove = globalThis.ENEMIES.find(e => String(e?.name||'').toLowerCase() === 'dove');
        if (dove) {
          dove.portraitKey = 'dove';
          dove.emoji = '🕊️';
          if (dove.stats) dove.stats.dodge = dove.stats.dodge || 10;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  patchDoveEnemy();

  // Reinforce Stage 20 boss routing to Duke Blakiston / Blakiston.
  const _oldLoadStage = globalThis.loadStage;
  if (typeof _oldLoadStage === 'function') {
    globalThis.loadStage = function() {
      const out = _oldLoadStage.apply(this, arguments);
      try {
        if (globalThis.G?.stage === 20 && globalThis.G?.enemy) {
          globalThis.G.enemy = (typeof globalThis.makeDukeBlakiston === 'function')
            ? globalThis.makeDukeBlakiston()
            : globalThis.G.enemy;
          globalThis.G.enemy.portraitKey = 'duke_blakiston';
          globalThis.G.enemy.name = globalThis.G.enemy.name || 'Duke Blakiston';
          globalThis.G.enemy.bossTitle = globalThis.G.enemy.bossTitle || '👑 Final Boss';
          if (typeof globalThis.refreshBattleUI === 'function') globalThis.refreshBattleUI();
        }
      } catch (err) {
        console.error(err);
      }
      return out;
    };
  }
})();


// ===== 04_script_04.js =====

// ============================================================
//  SVG PORTRAITS
// ============================================================
const PORTRAITS = {
  robin:'',

  sparrow:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="50" rx="20" ry="14" fill="#8B6F47"/><ellipse cx="53" cy="52" rx="11" ry="6" fill="#6B5030" transform="rotate(20,53,52)"/><ellipse cx="27" cy="52" rx="11" ry="6" fill="#6B5030" transform="rotate(-20,27,52)"/><ellipse cx="40" cy="53" rx="12" ry="9" fill="#C9A87A"/><circle cx="40" cy="31" r="12" fill="#9E7D58"/><ellipse cx="40" cy="28" rx="7" ry="5" fill="#5A3E1B"/><circle cx="44" cy="28" r="3.2" fill="#1a1a1a"/><circle cx="45.2" cy="27" r="1.1" fill="#fff" opacity="0.85"/><polygon points="52,28 60,30 52,33" fill="#C8A040"/><path d="M21,57 Q14,65 10,72 Q15,65 19,60 Q11,68 9,76 Q16,67 23,62" fill="#6B5030"/><line x1="36" y1="63" x2="33" y2="71" stroke="#C8A040" stroke-width="1.5"/><line x1="44" y1="63" x2="47" y2="71" stroke="#C8A040" stroke-width="1.5"/><line x1="33" y1="71" x2="29" y2="73" stroke="#C8A040" stroke-width="1.5"/><line x1="33" y1="71" x2="35" y2="75" stroke="#C8A040" stroke-width="1.5"/><line x1="47" y1="71" x2="51" y2="73" stroke="#C8A040" stroke-width="1.5"/><line x1="47" y1="71" x2="49" y2="75" stroke="#C8A040" stroke-width="1.5"/></svg>`,
  phainopepla:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="51" rx="19" ry="15" fill="#121220"/><ellipse cx="53" cy="53" rx="11" ry="7" fill="#1e1e38" transform="rotate(16,53,53)"/><ellipse cx="27" cy="53" rx="11" ry="7" fill="#1e1e38" transform="rotate(-16,27,53)"/><ellipse cx="51" cy="50" rx="6" ry="3" fill="#2e2e58" transform="rotate(16,51,50)" opacity="0.9"/><ellipse cx="40" cy="55" rx="11" ry="8" fill="#1a1a32" opacity="0.7"/><circle cx="40" cy="30" r="12" fill="#121220"/><path d="M39,20 Q37,12 38,5 Q39,1 40.5,5 Q42,12 41,20 Z" fill="#0a0a18" stroke="#22225a" stroke-width="0.6"/><path d="M37,20 Q34,13 35,7 Q36.5,3.5 38,7 Q39,14 38.5,20 Z" fill="#0d0d22" opacity="0.85"/><path d="M43,20 Q46,13 45,7 Q43.5,3.5 42,7 Q41,14 41.5,20 Z" fill="#0d0d22" opacity="0.85"/><circle cx="40" cy="4" r="2.2" fill="#8844dd"/><circle cx="40" cy="4" r="4.5" fill="#9966ff" opacity="0.28"/><circle cx="34" cy="9" r="1.1" fill="#aa66ff" opacity="0.7"/><circle cx="47" cy="7" r="1.3" fill="#8844dd" opacity="0.65"/><circle cx="45" cy="28" r="4.5" fill="#cc1111"/><circle cx="45" cy="28" r="3" fill="#990000"/><circle cx="46.2" cy="27" r="1.3" fill="#ff7777" opacity="0.95"/><path d="M51,28.5 L62,30.5 L51,32" fill="#222232"/><path d="M22,60 Q15,67 10,76 Q15,66 20,62 Q12,70 10,78 Q17,68 24,64" fill="#121220"/><line x1="36" y1="65" x2="33" y2="73" stroke="#333" stroke-width="1.5"/><line x1="44" y1="65" x2="47" y2="73" stroke="#333" stroke-width="1.5"/><line x1="33" y1="73" x2="29" y2="75" stroke="#333" stroke-width="1.5"/><line x1="33" y1="73" x2="35" y2="77" stroke="#333" stroke-width="1.5"/><line x1="47" y1="73" x2="51" y2="75" stroke="#333" stroke-width="1.5"/><line x1="47" y1="73" x2="49" y2="77" stroke="#333" stroke-width="1.5"/></svg>`,
  crow:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="50" rx="21" ry="16" fill="#2a2a2a"/><ellipse cx="55" cy="52" rx="13" ry="8" fill="#1a1a1a" transform="rotate(18,55,52)"/><ellipse cx="25" cy="52" rx="13" ry="8" fill="#1a1a1a" transform="rotate(-18,25,52)"/><ellipse cx="53" cy="49" rx="7" ry="3.5" fill="#3e3e3e" transform="rotate(18,53,49)" opacity="0.7"/><ellipse cx="40" cy="54" rx="14" ry="10" fill="#333"/><circle cx="40" cy="29" r="12.5" fill="#252525"/><circle cx="44" cy="27" r="4" fill="#1a1a1a"/><circle cx="45" cy="26.5" r="2.2" fill="#4488cc"/><circle cx="46" cy="26" r="0.9" fill="#ffffff" opacity="0.9"/><path d="M51,26.5 L64,29 L64,33.5 L51,31.5 Z" fill="#303030"/><path d="M20,61 L12,73 L18,64 L14,75 L22,66 L18,76 L26,67" fill="#1a1a1a"/><line x1="36" y1="65" x2="32" y2="73" stroke="#555" stroke-width="2"/><line x1="44" y1="65" x2="48" y2="73" stroke="#555" stroke-width="2"/><line x1="32" y1="73" x2="27" y2="75" stroke="#555" stroke-width="2"/><line x1="32" y1="73" x2="34" y2="77" stroke="#555" stroke-width="2"/><line x1="48" y1="73" x2="53" y2="75" stroke="#555" stroke-width="2"/><line x1="48" y1="73" x2="50" y2="77" stroke="#555" stroke-width="2"/></svg>`,
  goose:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="54" rx="27" ry="20" fill="#e8e8e0"/><ellipse cx="58" cy="55" rx="17" ry="9" fill="#d0d0c8" transform="rotate(12,58,55)"/><ellipse cx="22" cy="55" rx="17" ry="9" fill="#d0d0c8" transform="rotate(-12,22,55)"/><ellipse cx="55" cy="52" rx="9" ry="4.5" fill="#c0c0b8" transform="rotate(12,55,52)" opacity="0.7"/><path d="M36,40 Q33,29 35,18 Q37,11 40.5,9 Q44,11 45,18 Q47,29 44,40" fill="#1a1a1a"/><ellipse cx="40" cy="10" rx="9.5" ry="8.5" fill="#1a1a1a"/><ellipse cx="41" cy="12" rx="5.5" ry="4.5" fill="#e8e8e0"/><circle cx="45" cy="9" r="3.8" fill="#cc6600"/><circle cx="45" cy="9" r="2.2" fill="#1a1a1a"/><circle cx="46" cy="8.2" r="0.9" fill="#fff" opacity="0.9"/><path d="M49,8.5 L60,10 L60,13.5 L49,12 Z" fill="#E87020"/><path d="M13,63 L7,74 L13,67 L9,76 L17,69" fill="#d0d0c8"/><line x1="36" y1="72" x2="32" y2="78" stroke="#E87020" stroke-width="2.5"/><line x1="44" y1="72" x2="48" y2="78" stroke="#E87020" stroke-width="2.5"/><line x1="32" y1="78" x2="27" y2="80" stroke="#E87020" stroke-width="2.5"/><line x1="48" y1="78" x2="53" y2="80" stroke="#E87020" stroke-width="2.5"/></svg>`,
  kookaburra:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="51" rx="21" ry="16" fill="#a07840"/><ellipse cx="54" cy="52" rx="13" ry="7" fill="#7a5828" transform="rotate(14,54,52)"/><ellipse cx="26" cy="52" rx="13" ry="7" fill="#7a5828" transform="rotate(-14,26,52)"/><ellipse cx="40" cy="54" rx="13" ry="9" fill="#e8d0a0" opacity="0.8"/><circle cx="40" cy="30" r="13" fill="#c8a060"/><ellipse cx="40" cy="27" rx="9" ry="6" fill="#5a3810" opacity="0.7"/><circle cx="44" cy="27" r="4" fill="#c8a060"/><circle cx="45" cy="26" r="2.5" fill="#1a1200"/><circle cx="46" cy="25" r="1" fill="#fff" opacity="0.9"/><path d="M34,24 Q30,22 28,24 Q30,26 34,26 Z" fill="#5a3810"/><path d="M51,26 L66,28 L66,32 L51,30 Z" fill="#8a5e20" rx="2"/><path d="M15,62 Q9,70 7,78 Q14,69 19,64 Q11,72 9,79 Q17,69 24,65" fill="#7a5828"/><line x1="36" y1="65" x2="32" y2="73" stroke="#c8a060" stroke-width="1.5"/><line x1="44" y1="65" x2="48" y2="73" stroke="#c8a060" stroke-width="1.5"/></svg>`,
  toucan:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="51" rx="20" ry="15" fill="#1a1a1a"/><ellipse cx="54" cy="52" rx="12" ry="7" fill="#111" transform="rotate(15,54,52)"/><ellipse cx="26" cy="52" rx="12" ry="7" fill="#111" transform="rotate(-15,26,52)"/><ellipse cx="40" cy="55" rx="12" ry="9" fill="#f0e060" opacity="0.9"/><circle cx="40" cy="29" r="12" fill="#1a1a1a"/><path d="M47,24 Q64,20 68,27 Q70,33 64,36 Q57,38 47,34 Z" fill="#60c840"/><path d="M49,25 Q63,22 66,27 Q68,32 62,34 Q56,36 49,33 Z" fill="#e8c820"/><path d="M51,26 Q62,24 64,28 Q65,31 60,32 Q55,33 51,31 Z" fill="#e86020"/><circle cx="44" cy="27" r="4" fill="#1a1a1a"/><circle cx="45" cy="26" r="2.5" fill="#ffffff"/><circle cx="46" cy="25" r="1" fill="#1a1a1a" opacity="0.9"/><path d="M15,62 Q8,70 7,78 Q14,69 20,64 Q12,72 10,79 Q18,68 25,64" fill="#111"/><line x1="36" y1="64" x2="32" y2="72" stroke="#e8c820" stroke-width="2"/><line x1="44" y1="64" x2="48" y2="72" stroke="#e8c820" stroke-width="2"/><line x1="32" y1="72" x2="28" y2="74" stroke="#e8c820" stroke-width="2"/><line x1="48" y1="72" x2="52" y2="74" stroke="#e8c820" stroke-width="2"/></svg>`,
  // === UNLOCKABLE BIRD PORTRAITS ===
  peregrine:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="50" rx="18" ry="13" fill="#3a4a6a"/><ellipse cx="53" cy="52" rx="10" ry="6" fill="#2a3a5a" transform="rotate(18,53,52)"/><ellipse cx="27" cy="52" rx="10" ry="6" fill="#2a3a5a" transform="rotate(-18,27,52)"/><ellipse cx="40" cy="53" rx="11" ry="8" fill="#e8dfc8"/><circle cx="40" cy="29" r="11" fill="#2a3040"/><ellipse cx="36" cy="26" rx="6" ry="4" fill="#1a1a2a"/><circle cx="44" cy="27" r="3.5" fill="#2a3040"/><circle cx="45" cy="26" r="2.2" fill="#f0f0ff"/><circle cx="46" cy="25" r="0.9" fill="#000" opacity="0.9"/><path d="M28,30 Q22,34 20,38 Q24,35 30,33" fill="#1a1a2a"/><path d="M50,27 L62,28 L62,31 L50,30 Z" fill="#c8b870" rx="2"/><path d="M20,58 Q13,67 10,75 Q16,66 20,61 Q13,69 11,77 Q18,67 23,63" fill="#2a3a5a"/><line x1="36" y1="62" x2="32" y2="70" stroke="#c8b870" stroke-width="1.5"/><line x1="44" y1="62" x2="48" y2="70" stroke="#c8b870" stroke-width="1.5"/><line x1="32" y1="70" x2="28" y2="72" stroke="#c8b870" stroke-width="1.5"/><line x1="48" y1="70" x2="52" y2="72" stroke="#c8b870" stroke-width="1.5"/></svg>`,
  secretary:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="52" rx="19" ry="14" fill="#c8c8c0"/><ellipse cx="53" cy="53" rx="11" ry="7" fill="#a8a8a0" transform="rotate(14,53,53)"/><ellipse cx="27" cy="53" rx="11" ry="7" fill="#a8a8a0" transform="rotate(-14,27,53)"/><ellipse cx="40" cy="55" rx="11" ry="8" fill="#e8e8e0"/><circle cx="40" cy="30" r="11" fill="#d8d8d0"/><path d="M46,20 Q52,12 58,10 Q54,16 50,22 Q56,13 60,12 Q56,18 52,23" fill="#ff8030" stroke="#cc5500" stroke-width="0.5"/><path d="M34,20 Q28,12 22,10 Q26,16 30,22 Q24,13 20,12 Q24,18 28,23" fill="#ff8030" stroke="#cc5500" stroke-width="0.5"/><circle cx="36" cy="28" r="3.5" fill="#cc2020"/><circle cx="36" cy="28" r="2" fill="#880000"/><circle cx="37" cy="27" r="0.8" fill="#ff9999" opacity="0.9"/><path d="M46,27 L58,29 L58,32 L46,30.5 Z" fill="#d0c890"/><path d="M18,61 Q11,70 9,78 Q15,68 19,64 Q12,72 10,79 Q17,68 23,64" fill="#a8a8a0"/><line x1="36" y1="65" x2="32" y2="73" stroke="#e0a060" stroke-width="2"/><line x1="44" y1="65" x2="48" y2="73" stroke="#e0a060" stroke-width="2"/></svg>`,
  lyrebird:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="51" rx="18" ry="13" fill="#7a4a28"/><ellipse cx="53" cy="52" rx="10" ry="6" fill="#5a3018" transform="rotate(16,53,52)"/><ellipse cx="27" cy="52" rx="10" ry="6" fill="#5a3018" transform="rotate(-16,27,52)"/><ellipse cx="40" cy="54" rx="10" ry="7" fill="#c8a060" opacity="0.8"/><circle cx="40" cy="30" r="11" fill="#8a5a30"/><circle cx="44" cy="28" r="3.5" fill="#1a1208"/><circle cx="45" cy="27" r="2.2" fill="#c8a010"/><circle cx="46" cy="26" r="0.9" fill="#fff" opacity="0.9"/><path d="M50,27 L62,29 L62,32 L50,31 Z" fill="#c89040"/><path d="M24,32 Q14,20 10,5 Q10,3 12,5 Q18,18 28,30 Q16,18 15,3 Q16,1 18,4 Q24,20 32,31" fill="#a87040" stroke="#7a4a20" stroke-width="0.5"/><path d="M56,32 Q66,20 70,5 Q70,3 68,5 Q62,18 52,30 Q64,18 65,3 Q64,1 62,4 Q56,20 48,31" fill="#a87040" stroke="#7a4a20" stroke-width="0.5"/><ellipse cx="40" cy="3" rx="5" ry="12" fill="#c8a040" opacity="0.6"/><path d="M20,60 Q13,69 10,77 Q16,67 21,62" fill="#5a3018"/><line x1="36" y1="63" x2="32" y2="71" stroke="#c89040" stroke-width="1.5"/><line x1="44" y1="63" x2="48" y2="71" stroke="#c89040" stroke-width="1.5"/></svg>`,
  shoebill:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="50" rx="22" ry="16" fill="#4a5a70"/><ellipse cx="55" cy="51" rx="14" ry="8" fill="#3a4a60" transform="rotate(14,55,51)"/><ellipse cx="25" cy="51" rx="14" ry="8" fill="#3a4a60" transform="rotate(-14,25,51)"/><ellipse cx="40" cy="54" rx="13" ry="9" fill="#5a6a80" opacity="0.7"/><circle cx="40" cy="28" r="13" fill="#4a5a70"/><ellipse cx="40" cy="26" rx="9" ry="6" fill="#3a4a60" opacity="0.6"/><path d="M30,33 Q25,38 23,43 Q35,37 50,37 Q55,38 57,43 Q55,38 50,33 Z" fill="#c8a840" stroke="#a08020" stroke-width="0.8"/><circle cx="34" cy="27" r="4" fill="#3a4a60"/><circle cx="34" cy="27" r="2.5" fill="#ffe8a0"/><circle cx="35" cy="26" r="1" fill="#1a2030" opacity="0.95"/><circle cx="46" cy="27" r="4" fill="#3a4a60"/><circle cx="46" cy="27" r="2.5" fill="#ffe8a0"/><circle cx="47" cy="26" r="1" fill="#1a2030" opacity="0.95"/><path d="M18,62 Q11,72 9,79 Q16,69 20,64" fill="#3a4a60"/><line x1="36" y1="65" x2="32" y2="73" stroke="#7a8a9a" stroke-width="2.5"/><line x1="44" y1="65" x2="48" y2="73" stroke="#7a8a9a" stroke-width="2.5"/><line x1="32" y1="73" x2="27" y2="75" stroke="#7a8a9a" stroke-width="2.5"/><line x1="48" y1="73" x2="53" y2="75" stroke="#7a8a9a" stroke-width="2.5"/></svg>`,
  harpy:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="50" rx="24" ry="17" fill="#2a2a2a"/><ellipse cx="56" cy="51" rx="15" ry="9" fill="#1a1a1a" transform="rotate(16,56,51)"/><ellipse cx="24" cy="51" rx="15" ry="9" fill="#1a1a1a" transform="rotate(-16,24,51)"/><ellipse cx="40" cy="54" rx="14" ry="10" fill="#e8e0d0"/><circle cx="40" cy="27" r="13" fill="#e8e0d0"/><path d="M28,18 Q24,10 26,4 Q28,1 30,5 Q32,10 33,18 Z" fill="#2a2a2a"/><path d="M52,18 Q56,10 54,4 Q52,1 50,5 Q48,10 47,18 Z" fill="#2a2a2a"/><path d="M35,16 Q32,8 34,3 Q36,0 38,4 Q39,9 39,16 Z" fill="#1a1a1a"/><path d="M45,16 Q48,8 46,3 Q44,0 42,4 Q41,9 41,16 Z" fill="#1a1a1a"/><circle cx="35" cy="26" r="4" fill="#e8e0d0"/><circle cx="35" cy="26" r="2.5" fill="#2a1a0a"/><circle cx="36" cy="25" r="1" fill="#ff4400" opacity="0.9"/><circle cx="45" cy="26" r="4" fill="#e8e0d0"/><circle cx="45" cy="26" r="2.5" fill="#2a1a0a"/><circle cx="46" cy="25" r="1" fill="#ff4400" opacity="0.9"/><path d="M33,33 Q32,38 40,40 Q48,38 47,33 Q44,36 40,36 Q36,36 33,33 Z" fill="#c0a080"/><path d="M16,60 Q9,71 7,79 Q14,68 18,62 Q11,72 9,79 Q17,68 22,63" fill="#1a1a1a"/><line x1="36" y1="66" x2="31" y2="75" stroke="#888" stroke-width="2.5"/><line x1="44" y1="66" x2="49" y2="75" stroke="#888" stroke-width="2.5"/><line x1="31" y1="75" x2="26" y2="77" stroke="#888" stroke-width="2.5"/><line x1="49" y1="75" x2="54" y2="77" stroke="#888" stroke-width="2.5"/></svg>`,
  flamingo:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="42" cy="44" rx="14" ry="18" fill="#e8609a" transform="rotate(-8,42,44)"/><ellipse cx="44" cy="42" rx="9" ry="12" fill="#f090ba" opacity="0.7" transform="rotate(-8,44,42)"/><circle cx="36" cy="22" r="10" fill="#e8609a"/><circle cx="36" cy="19" r="7" fill="#f8a0c8" opacity="0.5"/><circle cx="39" cy="21" r="3" fill="#1a0a10"/><circle cx="40" cy="20" r="1.1" fill="#fff" opacity="0.9"/><path d="M27,20 Q21,17 20,21 Q22,25 28,24" fill="#e03080" opacity="0.8"/><path d="M43,25 Q46,32 46,45 Q50,50 52,58 Q56,64 54,70 Q58,64 56,56 Q53,48 50,42 Q50,30 45,22" fill="#e8609a"/><line x1="52" y1="68" x2="48" y2="76" stroke="#e8609a" stroke-width="2.5"/><line x1="56" y1="70" x2="60" y2="76" stroke="#e8609a" stroke-width="2.5"/><line x1="48" y1="76" x2="44" y2="78" stroke="#e8609a" stroke-width="2"/><line x1="60" y1="76" x2="64" y2="78" stroke="#e8609a" stroke-width="2"/></svg>`,
  baldEagle:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="52" rx="21" ry="14" fill="#3a2a18"/><ellipse cx="54" cy="54" rx="13" ry="6" fill="#2a1e10" transform="rotate(15,54,54)"/><ellipse cx="26" cy="54" rx="13" ry="6" fill="#2a1e10" transform="rotate(-15,26,54)"/><ellipse cx="40" cy="55" rx="13" ry="9" fill="#c8b090" opacity="0.7"/><circle cx="40" cy="28" r="13" fill="#e8e4d8"/><circle cx="40" cy="25" r="9" fill="#f8f4e8" opacity="0.6"/><circle cx="43.5" cy="27" r="3.8" fill="#e8e4d8"/><circle cx="45" cy="25.8" r="2.5" fill="#1a0a00"/><circle cx="46.2" cy="24.8" r="1" fill="#fff" opacity="0.9"/><polygon points="51,27 64,25 63,31 51,31" fill="#e8a020"/><path d="M15,60 Q7,68 5,76 Q13,66 18,61 Q9,70 8,78 Q16,67 23,62" fill="#2a1e10"/><line x1="36" y1="66" x2="32" y2="74" stroke="#c8a060" stroke-width="1.5"/><line x1="44" y1="66" x2="48" y2="74" stroke="#c8a060" stroke-width="1.5"/></svg>`,
  macaw:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="50" rx="18" ry="15" fill="#1a6aba"/><ellipse cx="53" cy="52" rx="11" ry="6" fill="#228020" transform="rotate(18,53,52)"/><ellipse cx="27" cy="52" rx="11" ry="6" fill="#228020" transform="rotate(-18,27,52)"/><ellipse cx="40" cy="53" rx="11" ry="8" fill="#f0e840" opacity="0.75"/><circle cx="40" cy="28" r="12" fill="#e83030"/><circle cx="40" cy="26" r="8" fill="#f06050" opacity="0.5"/><circle cx="44" cy="27" r="3.2" fill="#c02020"/><circle cx="45.5" cy="26" r="2.2" fill="#0a0a0a"/><circle cx="46.5" cy="25.2" r="0.9" fill="#fff" opacity="0.9"/><ellipse cx="38" cy="28" rx="6" ry="4" fill="#f0f0e0" opacity="0.7"/><path d="M30,26 Q24,23 23,27 Q26,31 31,30" fill="#808080"/><path d="M16,62 Q9,70 7,78 Q14,68 19,63 Q11,72 9,79 Q17,68 24,64" fill="#228020"/><line x1="36" y1="65" x2="32" y2="73" stroke="#e8c040" stroke-width="1.5"/><line x1="44" y1="65" x2="48" y2="73" stroke="#e8c040" stroke-width="1.5"/></svg>`,
  snowyOwl:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="52" rx="22" ry="18" fill="#e8f0f8"/><ellipse cx="55" cy="55" rx="14" ry="8" fill="#d0d8e4" transform="rotate(10,55,55)"/><ellipse cx="25" cy="55" rx="14" ry="8" fill="#d0d8e4" transform="rotate(-10,25,55)"/><ellipse cx="40" cy="56" rx="14" ry="10" fill="#f4f8fc"/><circle cx="40" cy="28" r="16" fill="#f0f4f8"/><ellipse cx="35" cy="28" rx="6" ry="7" fill="#e0e8f0"/><ellipse cx="45" cy="28" rx="6" ry="7" fill="#e0e8f0"/><circle cx="35" cy="28" r="4" fill="#f5c518"/><circle cx="45" cy="28" r="4" fill="#f5c518"/><circle cx="35" cy="28" r="2.5" fill="#0a0a18"/><circle cx="45" cy="28" r="2.5" fill="#0a0a18"/><circle cx="36" cy="27" r="0.9" fill="#fff"/><circle cx="46" cy="27" r="0.9" fill="#fff"/><polygon points="38,32 40,36 42,32" fill="#d0a040" opacity="0.9"/><path d="M18,62 Q12,70 10,78 Q17,68 22,63 Q13,72 12,79 Q20,68 27,64" fill="#c8d0d8"/><line x1="36" y1="70" x2="32" y2="76" stroke="#c8d0e0" stroke-width="1.5"/><line x1="44" y1="70" x2="48" y2="76" stroke="#c8d0e0" stroke-width="1.5"/></svg>`,
  raven:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="51" rx="20" ry="14" fill="#1a1a2a"/><ellipse cx="54" cy="53" rx="12" ry="6" fill="#0e0e1a" transform="rotate(14,54,53)"/><ellipse cx="26" cy="53" rx="12" ry="6" fill="#0e0e1a" transform="rotate(-14,26,53)"/><ellipse cx="40" cy="54" rx="12" ry="8" fill="#3a3050" opacity="0.65"/><circle cx="40" cy="28" r="13" fill="#1e1e30"/><circle cx="40" cy="26" r="9" fill="#2e2848" opacity="0.5"/><circle cx="44" cy="28" r="3.8" fill="#1a1a28"/><circle cx="45.5" cy="26.5" r="2.8" fill="#6030d0" opacity="0.9"/><circle cx="46.8" cy="25.5" r="1.1" fill="#a060ff" opacity="0.9"/><polygon points="31,26 21,24 22,31 31,30" fill="#2a2038"/><path d="M15,60 Q8,68 6,76 Q13,67 18,62 Q10,70 9,78 Q17,67 24,62" fill="#0e0e1a"/><line x1="36" y1="65" x2="32" y2="73" stroke="#3a2868" stroke-width="1.5"/><line x1="44" y1="65" x2="48" y2="73" stroke="#3a2868" stroke-width="1.5"/></svg>`,
  swan:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="44" cy="52" rx="20" ry="14" fill="#f0f2f8" transform="rotate(-5,44,52)"/><ellipse cx="57" cy="54" rx="12" ry="6" fill="#e0e4f0" transform="rotate(12,57,54)"/><ellipse cx="28" cy="55" rx="12" ry="6" fill="#e0e4f0" transform="rotate(-12,28,55)"/><ellipse cx="43" cy="56" rx="13" ry="9" fill="#f8fafc"/><circle cx="32" cy="22" r="11" fill="#f4f6fa"/><circle cx="32" cy="19" r="7" fill="#fff" opacity="0.6"/><circle cx="35" cy="21" r="2.8" fill="#181830"/><circle cx="36.2" cy="20.1" r="1" fill="#fff" opacity="0.95"/><path d="M24,19 Q18,16 17,21 Q20,25 26,23" fill="#e08020" opacity="0.9"/><path d="M38,25 Q44,32 50,42 Q54,50 56,58" fill="none" stroke="#e8ecf4" stroke-width="3" stroke-linecap="round"/><line x1="38" y1="67" x2="34" y2="75" stroke="#d8dce8" stroke-width="2"/><line x1="50" y1="68" x2="54" y2="75" stroke="#d8dce8" stroke-width="2"/><line x1="34" y1="75" x2="30" y2="77" stroke="#d8dce8" stroke-width="1.5"/><line x1="54" y1="75" x2="58" y2="77" stroke="#d8dce8" stroke-width="1.5"/></svg>`,
  // === NEW BIRD PORTRAITS ===
  hummingbird:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="50" rx="12" ry="9" fill="#20c8a0"/><ellipse cx="52" cy="51" rx="14" ry="5" fill="#18a080" transform="rotate(8,52,51)" opacity="0.9"/><ellipse cx="28" cy="51" rx="14" ry="5" fill="#18a080" transform="rotate(-8,28,51)" opacity="0.9"/><circle cx="40" cy="34" r="10" fill="#20c8a0"/><circle cx="40" cy="32" r="6" fill="#40e8c0" opacity="0.6"/><circle cx="43" cy="32" r="2.5" fill="#0a1a14"/><circle cx="44" cy="31" r="0.9" fill="#fff" opacity="0.9"/><path d="M50,32 L72,30 L72,32.5 L50,34" fill="#30a888" opacity="0.9"/><path d="M24,43 Q14,35 10,26" stroke="#18a080" stroke-width="4" fill="none" opacity="0.7"/><path d="M24,43 Q14,50 10,56" stroke="#20c8a0" stroke-width="4" fill="none" opacity="0.7"/><line x1="36" y1="58" x2="33" y2="65" stroke="#28b890" stroke-width="1.5"/><line x1="44" y1="58" x2="47" y2="65" stroke="#28b890" stroke-width="1.5"/></svg>`,
  kiwi:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="54" rx="22" ry="18" fill="#7a5830"/><ellipse cx="40" cy="52" rx="16" ry="13" fill="#9a7848" opacity="0.8"/><circle cx="40" cy="30" r="12" fill="#8a6838"/><circle cx="43" cy="28" r="3" fill="#3a2010"/><circle cx="44" cy="27" r="1.8" fill="#2a4a10"/><circle cx="45" cy="26" r="0.8" fill="#fff" opacity="0.9"/><path d="M50,28 L74,24 L73,30 L50,32" fill="#7a5830" stroke="#5a3810" stroke-width="0.5"/><ellipse cx="40" cy="60" rx="14" ry="6" fill="#5a3810" opacity="0.6"/><line x1="34" y1="72" x2="30" y2="78" stroke="#9a7040" stroke-width="2"/><line x1="46" y1="72" x2="50" y2="78" stroke="#9a7040" stroke-width="2"/></svg>`,
  penguin:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="54" rx="18" ry="20" fill="#1a1a2a"/><ellipse cx="40" cy="56" rx="12" ry="14" fill="#e8f0f8"/><ellipse cx="55" cy="52" rx="8" ry="14" fill="#1a1a2a" transform="rotate(18,55,52)"/><ellipse cx="25" cy="52" rx="8" ry="14" fill="#1a1a2a" transform="rotate(-18,25,52)"/><circle cx="40" cy="26" r="13" fill="#1a1a2a"/><circle cx="43" cy="26" r="4" fill="#1a1a2a"/><circle cx="44.5" cy="25" r="2.8" fill="#fffae0"/><circle cx="45.8" cy="24" r="1.1" fill="#1a1a2a" opacity="0.95"/><path d="M34,26 Q28,23 27,27 Q30,31 36,30" fill="#e87020" opacity="0.9"/><ellipse cx="40" cy="28" rx="6" ry="5" fill="#f4e8c0" opacity="0.7"/><line x1="34" y1="74" x2="30" y2="78" stroke="#e87020" stroke-width="2.5"/><line x1="46" y1="74" x2="50" y2="78" stroke="#e87020" stroke-width="2.5"/></svg>`,
  ostrich:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="55" rx="24" ry="18" fill="#2a1a0a"/><ellipse cx="40" cy="53" rx="16" ry="12" fill="#c0a070" opacity="0.7"/><path d="M40,38 Q36,28 37,16 Q38,10 40.5,8 Q43,10 43,16 Q44,28 40,38" fill="#e8c888"/><circle cx="40" cy="9" r="10" fill="#f0d8a0"/><circle cx="43.5" cy="8" r="3.5" fill="#e0c890"/><circle cx="45" cy="7" r="2.2" fill="#1a1200"/><circle cx="46" cy="6" r="0.9" fill="#fff" opacity="0.9"/><path d="M31,9 Q24,7 23,11 Q25,15 32,14" fill="#e87020" opacity="0.8"/><ellipse cx="40" cy="61" rx="18" ry="8" fill="#1a1200" opacity="0.5"/><line x1="33" y1="72" x2="29" y2="79" stroke="#c09050" stroke-width="2.5"/><line x1="47" y1="72" x2="51" y2="79" stroke="#c09050" stroke-width="2.5"/></svg>`,
  seagull:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="50" rx="19" ry="13" fill="#e8ecf4"/><ellipse cx="54" cy="51" rx="14" ry="6" fill="#c8d0e0" transform="rotate(15,54,51)"/><ellipse cx="26" cy="51" rx="14" ry="6" fill="#c8d0e0" transform="rotate(-15,26,51)"/><ellipse cx="40" cy="54" rx="12" ry="8" fill="#f4f8fc"/><circle cx="40" cy="29" r="12" fill="#f0f4f8"/><circle cx="44" cy="28" r="3.5" fill="#e8ecf4"/><circle cx="45.5" cy="27" r="2.2" fill="#1a1830"/><circle cx="46.5" cy="26" r="0.9" fill="#fff" opacity="0.9"/><path d="M51,28 Q57,26 60,29 Q58,32 52,31" fill="#e87020" opacity="0.9"/><path d="M28,27 Q22,24 20,27 Q22,30 28,29" fill="#808090" opacity="0.6"/><path d="M18,58 Q10,66 7,75 Q14,65 19,60" fill="#a0a8b8"/><line x1="36" y1="62" x2="32" y2="70" stroke="#c8d0e0" stroke-width="1.5"/><line x1="44" y1="62" x2="48" y2="70" stroke="#c8d0e0" stroke-width="1.5"/></svg>`,
  magpie:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="51" rx="19" ry="14" fill="#1a1a1a"/><ellipse cx="54" cy="52" rx="12" ry="7" fill="#0e0e0e" transform="rotate(14,54,52)"/><ellipse cx="26" cy="52" rx="12" ry="7" fill="#0e0e0e" transform="rotate(-14,26,52)"/><ellipse cx="40" cy="55" rx="12" ry="9" fill="#e8f0f8" opacity="0.9"/><ellipse cx="40" cy="52" rx="7" ry="5" fill="#e8e8f4"/><circle cx="40" cy="29" r="12" fill="#1a1a1a"/><path d="M25,22 Q19,14 21,7 Q23,3 26,7 Q29,13 30,21" fill="#1a1a1a" stroke="#303030" stroke-width="0.5"/><path d="M55,22 Q61,14 59,7 Q57,3 54,7 Q51,13 50,21" fill="#1a1a1a" stroke="#303030" stroke-width="0.5"/><circle cx="44" cy="28" r="3.5" fill="#1a1a1a"/><circle cx="45.5" cy="27" r="2.2" fill="#ffffff"/><circle cx="46.5" cy="26" r="0.9" fill="#1a1a1a" opacity="0.95"/><path d="M50,27 L62,28 L62,31 L50,30" fill="#222222"/><line x1="36" y1="64" x2="32" y2="72" stroke="#606070" stroke-width="1.5"/><line x1="44" y1="64" x2="48" y2="72" stroke="#606070" stroke-width="1.5"/></svg>`,
  blackCockatoo:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="51" rx="19" ry="14" fill="#0a0a14"/><ellipse cx="54" cy="52" rx="11" ry="6" fill="#050510" transform="rotate(16,54,52)"/><ellipse cx="26" cy="52" rx="11" ry="6" fill="#050510" transform="rotate(-16,26,52)"/><ellipse cx="40" cy="54" rx="11" ry="8" fill="#1a1030" opacity="0.8"/><circle cx="40" cy="28" r="12" fill="#0a0a18"/><path d="M30,17 Q28,9 30,3 Q31.5,0 33,3 Q35,9 34,18 Z" fill="#050510"/><path d="M40,16 Q38,8 40,2 Q41.5,-1 43,2 Q45,8 44,17 Z" fill="#050510"/><path d="M50,17 Q52,9 50,3 Q48.5,0 47,3 Q45,9 46,18 Z" fill="#050510"/><circle cx="30" cy="3" r="2.5" fill="#7020a0"/><circle cx="40" cy="2" r="2.5" fill="#7020a0"/><circle cx="50" cy="3" r="2.5" fill="#7020a0"/><circle cx="44" cy="27" r="3.8" fill="#0a0a18"/><circle cx="45.5" cy="26" r="2.5" fill="#6010c0"/><circle cx="46.5" cy="25" r="1" fill="#c060ff" opacity="0.9"/><path d="M50,27 L63,28 L63,31 L50,30" fill="#141420"/><line x1="36" y1="64" x2="32" y2="72" stroke="#1a1428" stroke-width="1.5"/><line x1="44" y1="64" x2="48" y2="72" stroke="#1a1428" stroke-width="1.5"/></svg>`,
  emu:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="56" rx="26" ry="19" fill="#2a2010"/><ellipse cx="40" cy="54" rx="17" ry="13" fill="#5a4820" opacity="0.8"/><path d="M40,38 Q36,26 37,14 Q38.5,8 40.5,7 Q42.5,8 43,14 Q44,26 40,38" fill="#1a1408"/><circle cx="40" cy="8" r="11" fill="#3a2810"/><circle cx="40" cy="7" r="7" fill="#5a4020" opacity="0.6"/><circle cx="44" cy="7" r="3.5" fill="#2a1808"/><circle cx="45.5" cy="6" r="2.2" fill="#e07030"/><circle cx="46.5" cy="5" r="0.9" fill="#fff" opacity="0.9"/><path d="M32,8 Q25,6 24,10 Q27,14 33,13" fill="#e87020" opacity="0.8"/><ellipse cx="40" cy="63" rx="20" ry="7" fill="#1a1000" opacity="0.6"/><line x1="33" y1="74" x2="28" y2="79" stroke="#8a6830" stroke-width="3"/><line x1="47" y1="74" x2="52" y2="79" stroke="#8a6830" stroke-width="3"/></svg>`,
};

// ============================================================
//  AILMENT DEFINITIONS
// ============================================================
const AILMENTS = {
  chilled:{
    id:'chilled', name:'Chilled', icon:'❄', color:'#7fd6ff',
    desc:'Speed reduced by cold. Stacks. 2 turns.',
    spdMult:0.9,
  },

  poison:{
    id:'poison', name:'Poison', icon:'☣', color:'#4cb44c',
    desc:'Damage over time. Stacks. 3 turns.',
    tick(who, stacks){ return stacks; }, // dmg per turn = stacks
  },
  weaken:{
    id:'weaken', name:'Chicken Pox', icon:'🐔', color:'#c9a840',
    desc:'Lowers dodge% and damage%. 3 turns.',
    dodgeMult: 0.6, dmgMult: 0.75,
  },
  paralyzed:{
    id:'paralyzed', name:'Paralysis', icon:'⚡', color:'#c8c840',
    desc:'Chance to skip turn each round. 3 turns.',
    skipChance: 20,
  },
  burning:{
    id:'burning', name:'Feather Disease', icon:'🔥', color:'#dc641e',
    desc:'+hit chance & crit chance on attacker. 3 turns.',
    hitBonus: 20, critBonus: 20,
  },
  delayed:{
    id:'delayed', name:'Resonance', icon:'🎵', color:'#c850c8',
    desc:'Blackbird delayed damage detonates next turn.',
  }
};

// ============================================================
//  BASE ABILITY TEMPLATES
// ============================================================
// Each ability has a levels array describing what each level adds.
// fn = function name called on use.
// ailments = list of ailment ids the ability can apply (for display)
const ABILITY_TEMPLATES = {
  // ---- SPARROW ----
  rapidPeck:{
    id:'rapidPeck', name:'Rapid Peck', isBasic:true, type:'physical', btnType:'physical',
    desc:'Multi-hit assassin basic. Expensive, high roll potential, chain stops on miss.',
    baseMissChance:8, baseDmgMult:0.5, pierceDef:20,
    energyByLevel:[2,2,2,3],
    energyCost:2,
    levels:[
      {lv:1, desc:'2-3 hits, 8% miss each. 50% dmg, Pierce 20% DEF'},
      {lv:2, desc:'2-4 hits, 8% miss each. 58% dmg, Pierce 25% DEF — Avian Poison 15%', newAilment:'poison', ailChance:15},
      {lv:3, desc:'3-4 hits, 8% miss each. 66% dmg, Pierce 30% DEF — Avian Poison 20%', ailChance:20},
      {lv:4, desc:'3-5 hits, 8% miss each. 74% dmg, Pierce 35% DEF — Avian Poison 25%', ailChance:25},
    ]
  },

  dart:{
    id:'dart', name:'Dart', type:'physical', btnType:'physical',
    desc:'Fast reliable strike. Assassin basic with light Weaken pressure.', ailments:[],
    baseMissChance:12, baseDmgMult:1.0,
    energyByLevel:[1,1,1,1],
    energyCost:1,
    levels:[
      {lv:1, desc:'100% dmg, 12% miss'},
      {lv:2, desc:'115% dmg, 10% miss — Weaken 15%', newAilment:'weaken', ailChance:15},
      {lv:3, desc:'130% dmg, 8% miss — Weaken 20%', ailChance:20},
      {lv:4, desc:'145% dmg, 6% miss — Weaken 25%', ailChance:25},
    ]
  },

  evade:{
    id:'evade', name:'Evade', type:'utility', btnType:'utility',
    desc:'+25% dodge for 3 turns.', ailments:[],
    levels:[
      {lv:1, desc:'+25% dodge 3t'},
      {lv:2, desc:'+30% dodge 3t'},
      {lv:3, desc:'+35% dodge 3t, reduce paralysis chance 50%'},
      {lv:4, desc:'+40% dodge 4t, immune to paralysis'},
    ]
  },
  // ---- BLACKBIRD ----
  blackPeck:{
    id:'blackPeck', name:'Shadow Peck', type:'physical', btnType:'physical',
    desc:'Weak hit, 2nd use always crits.', ailments:[],
    levels:[
      {lv:1, desc:'2nd hit always crits, 15% miss'},
      {lv:2, desc:'Crit now every 2nd, Feather Disease 20%', newAilment:'burning', ailChance:20},
      {lv:3, desc:'Feather Disease 35%, crit dmg ×2.2'},
      {lv:4, desc:'Feather Disease 50%, crit dmg ×2.5, no miss'},
    ]
  },
  dirge:{
    cooldownByLevel:[3,4,5,6],
    id:'dirge', name:'Dirge', type:'spell', btnType:'spell',
    desc:'Song — confuse enemy for 3 turns.', ailments:[],
    levels:[
      {lv:1, desc:'Confuse 3t, 30% skip chance'},
      {lv:2, desc:'Confuse 4t, 40% skip — Paralysis 25%', newAilment:'paralyzed', ailChance:25},
      {lv:3, desc:'Confuse 5t, 45%, Paralysis 40%, 5 poison dmg delayed'},
      {lv:4, desc:'Confuse 6t, 50%, Paralysis 50%, 10 poison delayed, can re-confuse'},
    ]
  },
  lullaby:{
    id:'lullaby', name:'Lullaby', type:'spell', btnType:'spell',
    desc:'Song — slow enemy, reduce ATK 3t.', ailments:[],
    levels:[
      {lv:1, desc:'ATK ×0.6 for 3t'},
      {lv:2, desc:'ATK ×0.5 for 4t, Resonance 15 dmg next turn', newAilment:'delayed', delayDmg:15},
      {lv:3, desc:'ATK ×0.45 for 5t, Resonance 25 dmg'},
      {lv:4, desc:'ATK ×0.35 for 6t, Resonance 40 dmg, also weakens dodge'},
    ]
  },
  // ---- CROW ----
  crowStrike:{
    id:'crowStrike', name:'Strike', type:'physical', btnType:'physical',
    desc:'Standard attack.', ailments:[],
    levels:[
      {lv:1, desc:'10% miss, 100% dmg'},
      {lv:2, desc:'8% miss, 110% dmg — Avian Poison 15%', newAilment:'poison', ailChance:15},
      {lv:3, desc:'6% miss, 125% — Poison 25%', ailChance:25},
      {lv:4, desc:'3% miss, 140% — Poison 35% (endless-safe), Weaken 20%', newAilment:'poison', ailChance:35, newAilment2:'weaken', ailChance2:20},
    ]
  },
  beakSlam:{
    id:'beakSlam', name:'Beak Slam', type:'physical', btnType:'physical',
    desc:'2-handed — stun chance.', ailments:[],
    levels:[
      {lv:1, desc:'18% miss, 140% dmg, 30% stun'},
      {lv:2, desc:'14% miss, 160% dmg, 40% stun — Paralysis 20%', newAilment:'paralyzed', ailChance:20},
      {lv:3, desc:'10% miss, 180% dmg, 50% stun, Paralysis 30%', ailChance:30},
      {lv:4, desc:'8% miss, 200% dmg, 50% stun, Paralysis 40%', ailChance:40},
    ]
  },
  talonRake:{
    id:'talonRake', name:'Talon Rake', type:'physical', btnType:'physical',
    desc:'Two 1-handed strikes — miss risk.', ailments:[],
    levels:[
      {lv:1, desc:'2 hits, 28% miss each, 85% dmg'},
      {lv:2, desc:'2 hits, 22% miss, 100% — Burn 20%', newAilment:'burning', ailChance:20},
      {lv:3, desc:'3 hits, 18% miss, 105% — Burn 30%', ailChance:30},
      {lv:4, desc:'3 hits, 12% miss, 115% — Burn 40%, Poison 20% (endless-safe)', newAilment:'burning', ailChance:40, newAilment2:'poison', ailChance2:20},
    ]
  },
  crowDefend:{
    id:'crowDefend', name:'Defend', type:'utility', btnType:'utility',
    desc:'Brace and raise defense this turn. 2-turn cooldown.', ailments:[],
    levels:[
      {lv:1, desc:'Gain +2 DEF for 1 turn, block stance active. CD 2t'},
      {lv:2, desc:'Gain +3 DEF for 1 turn, block stance active. CD 2t'},
      {lv:3, desc:'Gain +4 DEF for 1 turn, block stance active + thorns. CD 2t'},
      {lv:4, desc:'Gain +5 DEF for 1 turn, block stance active + stronger thorns. CD 2t'},
    ]
  },
  // ---- SHOEBILL ----
  shoebillClamp:{
    id:'shoebillClamp', name:'Shoebill Clamp', type:'physical', btnType:'physical',
    desc:'Massive beak snaps shut. 130% dmg, 25% stun. High accuracy.',
    baseMissChance:8,
    levels:[
      {lv:1, desc:'130% dmg, 8% miss, ignores 10% enemy Dodge. 25% Stun.'},
      {lv:2, desc:'145% dmg, 7% miss. 30% Stun + 1 Poison stack.', newAilment:'poison', ailChance:100},
      {lv:3, desc:'160% dmg, 6% miss. 35% Stun + 2 Poison stacks.'},
      {lv:4, desc:'180% dmg, 5% miss. 40% Stun + 3 Poison stacks + Weaken 20%', newAilment2:'weaken', ailChance2:20},
    ]
  },
  // ---- SECRETARY ----
  serpentCrusher:{
    id:'serpentCrusher', name:'Serpent Crusher', type:'physical', btnType:'physical',
    desc:'Precise beak strike. +30% dmg vs Poisoned enemies. 15% Paralyze.',
    baseMissChance:12,
    levels:[
      {lv:1, desc:'115% dmg (×1.3 vs Poisoned), 12% miss. 15% Paralyze.', newAilment:'paralyzed', ailChance:15},
      {lv:2, desc:'130% dmg, 10% miss. 20% Paralyze.', ailChance:20},
      {lv:3, desc:'145% dmg, 8% miss. 25% Paralyze + Weaken 20% on hit.', newAilment2:'weaken', ailChance2:20},
      {lv:4, desc:'160% dmg, 5% miss. 30% Paralyze + Weaken 30%.', ailChance:30, ailChance2:30},
    ]
  },
  // ---- FLAMINGO ----
  mudLash:{
    id:'mudLash', name:'Mud Lash', type:'physical', btnType:'physical',
    desc:'Whip head in a filtering frenzy — 95% dmg. Consecutive uses scale. Applies Poison.',
    baseMissChance:15, baseDmgMult:0.95,
    levels:[
      {lv:1, desc:'95% dmg (×1.2 if used consecutively), 15% miss. 1-2 Poison stacks. 10% Confuse.', newAilment:'poison', ailChance:100},
      {lv:2, desc:'105% dmg, 12% miss. +1 Poison + heals 10% of dmg dealt.', ailChance:100},
      {lv:3, desc:'115% dmg, 10% miss. +2 Poison, heals 12% of dmg.', ailChance:100},
      {lv:4, desc:'125% dmg, 8% miss. +2 Poison, heals 15%, Confuse 20%.', ailChance:100, newAilment2:'confused', ailChance2:20},
    ]
  },
  // ---- HARPY EAGLE ----
  fleshRipper:{
    id:'fleshRipper', name:'Flesh Ripper', type:'physical', btnType:'physical',
    desc:'Hook and tear with razor beak. 125% dmg. Applies Burn. Bonus vs low-HP.',
    baseMissChance:10,
    levels:[
      {lv:1, desc:'125% dmg, 10% miss. Applies Burn 3t. +15% Crit chance.', newAilment:'burning', ailChance:100},
      {lv:2, desc:'140% dmg, 8% miss. Burn 3t. +20% Crit.', ailChance:100},
      {lv:3, desc:'155% dmg, 6% miss. Burn 4t. +20% Crit. +25% dmg if enemy <50% HP.', ailChance:100},
      {lv:4, desc:'175% dmg, 4% miss. Burn 4t. +25% Crit. +35% dmg if enemy <50% HP.', ailChance:100},
    ]
  },
  // ---- PEREGRINE FALCON ----
  diveGouge:{
    id:'diveGouge', name:'Dive Gouge', type:'physical', btnType:'physical',
    desc:'High-speed stoop ends in beak stab. 150% dmg, 30% miss. Gain +SPD on crit. Pierces DEF.',
    baseMissChance:30, baseDmgMult:1.5, pierceDef:20,
    levels:[
      {lv:1, desc:'150% dmg, 30% miss. Pierce 20% DEF. Crit = +2 SPD next turn.'},
      {lv:2, desc:'165% dmg, 25% miss. Pierce 25% DEF. Gain +3 SPD on crit.'},
      {lv:3, desc:'180% dmg, 20% miss. Pierce 30% DEF. Gain +4 SPD on crit + Weaken 20%', newAilment:'weaken', ailChance:20},
      {lv:4, desc:'200% dmg, 15% miss. Pierce 35% DEF. Gain +5 SPD on crit + Weaken 30%', ailChance:30},
    ]
  },
  // ---- SWAN ----
  serratedSlash:{
    id:'serratedSlash', name:'Serrated Slash', type:'physical', btnType:'physical',
    desc:'Rake with comb-edged beak. Causes Bleed (like Poison, physical). Heals on hit.',
    baseMissChance:12, baseDmgMult:1.05,
    levels:[
      {lv:1, desc:'105% dmg, 12% miss. Bleed DoT (1 stack). Heals 15% HP over 2t.', newAilment:'poison', ailChance:100},
      {lv:2, desc:'118% dmg, 10% miss. 2 Bleed stacks. Cleanse 1 debuff on self.', ailChance:100},
      {lv:3, desc:'130% dmg, 8% miss. 2 Bleed. Cleanse 2 debuffs. +15% crit.', ailChance:100},
      {lv:4, desc:'145% dmg, 6% miss. 3 Bleed. Cleanse all debuffs. +20% crit.', ailChance:100},
    ]
  },
  // ---- BALD EAGLE ----
  fishSnatcher:{
    id:'fishSnatcher', name:'Fish Snatcher', type:'physical', btnType:'physical',
    desc:'Spear-like stab — 120% dmg. 20% chance to Steal enemy buff. Heals vs low-HP.',
    baseMissChance:14,
    levels:[
      {lv:1, desc:'120% dmg, 14% miss. 20% Steal (copy 1 enemy buff). +10% dmg vs <50% HP.'},
      {lv:2, desc:'135% dmg, 11% miss. 25% Steal. +12% vs low HP.'},
      {lv:3, desc:'150% dmg, 8% miss. 30% Steal. Heal 25% of dmg dealt.'},
      {lv:4, desc:'165% dmg, 5% miss. 35% Steal. Heal 30% of dmg dealt + Weaken 15%.', newAilment:'weaken', ailChance:15},
    ]
  },
  // ---- GOOSE ----
  honkAttack:{
    id:'honkAttack', name:'Honk', isBasic:true, isMainAttack:true, type:'physical', btnType:'physical',
    desc:'Booming strike. Tank basic: solid hit with light control chance.', ailments:[],
    baseMissChance:25,
    energyByLevel:[1,1,1,1],
    energyCost:1,
    levels:[
      {lv:1, desc:'110% dmg, 25% miss'},
      {lv:2, desc:'125% dmg, 20% miss — 15% Paralysis', newAilment:'paralyzed', ailChance:15},
      {lv:3, desc:'140% dmg, 18% miss — 20% Paralysis', ailChance:20},
      {lv:4, desc:'155% dmg, 12% miss — 25% Paralysis + 10% Stun', ailChance:25},
    ]
  },

  gooseHonk:{
    id:'gooseHonk', name:'Goose HONK', isBasic:true, type:'physical', btnType:'physical',
    desc:'Territorial blast. Tank basic with fear pressure, not burst abuse.', ailments:[],
    baseMissChance:24,
    energyByLevel:[1,1,1,1],
    energyCost:1,
    levels:[
      {lv:1, desc:'110% dmg, 24% miss'},
      {lv:2, desc:'125% dmg, 20% miss — 20% Fear', newAilment:'feared', ailChance:20},
      {lv:3, desc:'140% dmg, 16% miss — 25% Fear', ailChance:25},
      {lv:4, desc:'155% dmg, 12% miss — 30% Fear + 10% Paralysis', ailChance:30, newAilment2:'paralyzed', ailChance2:10},
    ]
  },

  penguinHonk:{
    id:'penguinHonk', name:'Icebreaker Honk', isBasic:true, type:'physical', btnType:'physical',
    desc:'Frost-laced body check. Ice tank basic with Chilled pressure.', ailments:[],
    baseMissChance:22,
    energyByLevel:[1,1,1,1],
    energyCost:1,
    levels:[
      {lv:1, desc:'105% dmg, 22% miss — 20% Chilled', newAilment:'chilled', ailChance:20},
      {lv:2, desc:'120% dmg, 18% miss — 25% Chilled', ailChance:25},
      {lv:3, desc:'135% dmg, 15% miss — 30% Chilled', ailChance:30},
      {lv:4, desc:'150% dmg, 10% miss — 35% Chilled + 10% Paralysis', ailChance:35, newAilment2:'paralyzed', ailChance2:10},
    ]
  },

  headWhip:{
    id:'headWhip', name:'Head Whip', isBasic:true, type:'physical', btnType:'physical',
    desc:'Whiplash neck strike. Bruiser basic with modest Weaken pressure.', ailments:[],
    baseMissChance:18,
    energyByLevel:[1,1,1,1],
    energyCost:1,
    levels:[
      {lv:1, desc:'115% dmg, 18% miss'},
      {lv:2, desc:'130% dmg, 15% miss — 15% Weaken', newAilment:'weaken', ailChance:15},
      {lv:3, desc:'145% dmg, 12% miss — 20% Weaken', ailChance:20},
      {lv:4, desc:'160% dmg, 10% miss — 25% Weaken + 10% Stun', ailChance:25},
    ]
  },

  intimidate:{
    id:'intimidate', name:'Intimidate', type:'utility', btnType:'utility',
    desc:'Fear enemy 2 turns. 2-turn cooldown.', ailments:[],
    levels:[
      {lv:1, desc:'Fear 2t, CD 2t'},
      {lv:2, desc:'Fear 3t, Weaken 30%, CD 2t', newAilment:'weaken', ailChance:30},
      {lv:3, desc:'Fear 4t, Weaken 45%, 15 fear dmg, CD 1t'},
      {lv:4, desc:'Fear 5t, Weaken 60%, 25 fear dmg, no CD'},
    ]
  },
  roost:{
    id:'roost', name:'Roost', type:'utility', btnType:'utility',
    desc:'Heal next turn and cleanse debuffs (tank-only learnable).', ailments:[],
    cooldownByLevel:[2,2,3,3],
    levels:[
      {lv:1, desc:'Heal 25% next turn'},
      {lv:2, desc:'Heal 30% next turn, cleanse 1 status'},
      {lv:3, desc:'Heal 38% next turn, cleanse all debuffs + 1 control ailment'},
      {lv:4, desc:'Heal 45% next turn, full cleanse (all debuffs + control ailments), uninterruptable'},
    ]
  },

  // ---- NEW BIRD ABILITIES ----
  bleakBeak:{
    id:'bleakBeak', name:'Bleak Beak', type:'physical', btnType:'physical',
    isNeutral:false, allowedClasses:['mage','bard','summoner'],
    energyByLevel:[1,1,1,1], energyCost:1, cooldownByLevel:[0,0,0,0],
    desc:'Caster basic peck. Lower damage, dependable setup tool.', ailments:[],
    levels:[
      {lv:1, desc:'85% damage'},
      {lv:2, desc:'95% damage'},
      {lv:3, desc:'105% damage'},
      {lv:4, desc:'115% damage'},
    ]
  },

  shadowJab:{
    id:'shadowJab', name:'Shadow Jab', type:'physical', btnType:'physical',
    isNeutral:false, allowedClasses:['mage'],
    energyByLevel:[1,1,1,1], energyCost:1, cooldownByLevel:[0,0,0,0],
    desc:'Mage basic strike. Slightly low damage with light Fear pressure.', ailments:[],
    levels:[
      {lv:1, desc:'80% damage + 15% Fear', newAilment:'feared', ailChance:15},
      {lv:2, desc:'90% damage + 20% Fear', ailChance:20},
      {lv:3, desc:'100% damage + 25% Fear', ailChance:25},
      {lv:4, desc:'110% damage + 30% Fear', ailChance:30},
    ]
  },

  pinionVolley:{
    id:'pinionVolley', name:'Pinion Volley', type:'ranged', btnType:'ranged',
    isNeutral:false, allowedClasses:['ranger'],
    energyByLevel:[1,1,1,1], cooldownByLevel:[1,1,1,1],
    piercePctByLevel:[0.25,0.30,0.35,0.40],
    desc:'Ranger payoff basic-skill hybrid. Two reliable piercing hits.',
    levels:[
      {lv:1, desc:'2×52% hits, pierce 25% DEF'},
      {lv:2, desc:'2×60% hits, pierce 30% DEF'},
      {lv:3, desc:'2×68% hits, pierce 35% DEF'},
      {lv:4, desc:'2×76% hits, pierce 40% DEF'},
    ]
  },

  shieldWing:{
    id:'shieldWing', name:'Shield-Wing', type:'utility', btnType:'utility',
    isNeutral:false, allowedClasses:['tank','knight'],
    energyByLevel:[1,1,1,1], cooldownByLevel:[2,2,2,2],
    desc:'Core tank/knight setup skill. Gain Block and stabilize.',
    levels:[
      {lv:1, desc:'Gain block based on DEF'},
      {lv:2, desc:'Gain more block + cleanse 1 debuff'},
      {lv:3, desc:'Gain high block + cleanse 1 debuff'},
      {lv:4, desc:'Gain very high block + cleanse 2 debuffs'},
    ]
  },

  ironHonk:{
    id:'ironHonk', name:'Iron Honk', type:'physical', btnType:'physical',
    isNeutral:false, allowedClasses:['tank'],
    energyByLevel:[1,1,1,1], cooldownByLevel:[2,2,2,2],
    desc:'Tank setup strike. Low damage, guaranteed Weaken pressure.',
    levels:[
      {lv:1, desc:'60% damage + Weaken'},
      {lv:2, desc:'70% damage + stronger Weaken', newAilment:'weaken', ailChance:100},
      {lv:3, desc:'80% damage + stronger Weaken'},
      {lv:4, desc:'90% damage + strongest Weaken'},
    ]
  },

  dirgeOfDread:{
    id:'dirgeOfDread', name:'Dirge of Dread', type:'spell', btnType:'spell',
    isNeutral:false, allowedClasses:['bard'],
    energyByLevel:[1,1,2,2], cooldownByLevel:[2,2,3,3],
    desc:'Control song that applies Fear + Weaken. Utility first, damage second.', ailments:[],
    levels:[
      {lv:1, desc:'50% MATK, Fear 2t, Weaken 2t'},
      {lv:2, desc:'60% MATK, stronger control'},
      {lv:3, desc:'70% MATK, stronger control'},
      {lv:4, desc:'82% MATK, strongest control'},
    ]
  },

  skyHymn:{
    id:'skyHymn', name:'Sky Hymn', type:'spell', btnType:'spell',
    isNeutral:false, allowedClasses:['bard'],
    energyByLevel:[1,1,2,2], cooldownByLevel:[2,2,2,3],
    desc:'Support song with small healing and momentum. Reliable, not explosive.', ailments:[],
    levels:[
      {lv:1, desc:'Small heal + momentum'},
      {lv:2, desc:'Moderate heal + momentum'},
      {lv:3, desc:'Better heal + momentum'},
      {lv:4, desc:'Strong heal + momentum'},
    ]
  },

  marshHex:{
    id:'marshHex', name:'Marsh Hex', type:'spell', btnType:'spell',
    isNeutral:false, allowedClasses:['mage'],
    energyByLevel:[2,2,3,3], cooldownByLevel:[2,2,3,3],
    desc:'Mage payoff spell. Strong debuffing burst, not instant-delete damage.', ailments:[],
    levels:[
      {lv:1, desc:'118% MATK + Weaken/Fear'},
      {lv:2, desc:'132% MATK + stronger debuffs'},
      {lv:3, desc:'148% MATK + stronger debuffs'},
      {lv:4, desc:'165% MATK + strongest debuffs'},
    ]
  },

  stormCall:{
    id:'stormCall', name:'Storm Call', type:'spell', btnType:'spell',
    isNeutral:false, allowedClasses:['mage'],
    energyByLevel:[2,2,3,3], cooldownByLevel:[3,3,4,4],
    desc:'Heavy lightning spell with clear cooldown and burst role.', ailments:[],
    levels:[
      {lv:1, desc:'135% MATK + Paralysis chance'},
      {lv:2, desc:'150% MATK + stronger paralysis'},
      {lv:3, desc:'170% MATK + stronger paralysis'},
      {lv:4, desc:'190% MATK + strongest paralysis'},
    ]
  },

  nightChill:{
    id:'nightChill', name:'Night Chill', type:'spell', btnType:'spell',
    isNeutral:false, allowedClasses:['mage'],
    energyByLevel:[1,1,2,2], cooldownByLevel:[2,2,2,2],
    desc:'Mage setup spell. Moderate damage with reliable Slow/Chilled pressure.', ailments:[],
    levels:[
      {lv:1, desc:'90% MATK + Slow'},
      {lv:2, desc:'102% MATK + stronger Slow'},
      {lv:3, desc:'116% MATK + stronger Slow'},
      {lv:4, desc:'130% MATK + strongest Slow'},
    ]
  },

  // ---- KOOKABURRA ----
  bashUp:{
    id:'bashUp', name:'Bash-Up', type:'physical', btnType:'physical',
    desc:'100% atk, 20% miss. If Sit & Wait was active, hits TWICE at 15% miss.',
    baseMissChance:20,
    levels:[
      {lv:1, desc:'100% dmg, 20% miss. Double-hit if after Sit & Wait (15% miss)'},
      {lv:2, desc:'115% dmg, 16% miss. Double-hit: Weaken 20%', newAilment:'weaken', ailChance:20},
      {lv:3, desc:'130% dmg, 12% miss. Double-hit: Weaken 35%', ailChance:35},
      {lv:4, desc:'150% dmg, 8% miss. Double-hit: Weaken 50%, 15% stun'},
    ]
  },
  sitAndWait:{
    id:'sitAndWait', name:'Sit & Wait', type:'utility', btnType:'utility',
    desc:'Ambush stance — buff ATK+15%, ACC+15%. 30% spotted chance (fails if spotted). 2 buffs: max 3t.',
    levels:[
      {lv:1, desc:'ATK+15%, ACC+15% next turn. 30% spotted = fail'},
      {lv:2, desc:'ATK+20%, ACC+20%. 25% spotted'},
      {lv:3, desc:'ATK+25%, ACC+25%. 20% spotted'},
      {lv:4, desc:'ATK+30%, ACC+30%. 15% spotted, reduces all CDs by 1'},
    ]
  },
  theJoker:{
    cooldownByLevel:[3,4,5,6],
    id:'theJoker', name:'The Joker', type:'spell', btnType:'spell',
    desc:'Confuse 2t (20% skip) + Weaken (0.8× ATK). Scales with upgrades.',
    levels:[
      {lv:1, desc:'Confuse 2t 20% skip + Weaken 0.8× for 2t'},
      {lv:2, desc:'Confuse 3t 30% skip + Weaken 0.7× for 3t — Paralysis 15%', newAilment:'paralyzed', ailChance:15},
      {lv:3, desc:'Confuse 3t 40% skip + Weaken 0.6× for 4t + Poison 20%', newAilment2:'poison', ailChance2:20},
      {lv:4, desc:'Confuse 4t 50% skip + Weaken 0.5× for 4t + Poison 30%, also Burn 20%', ailChance2:30, newAilment3:'burning', ailChance3:20},
    ]
  },
  // ---- MACAW ----
  breakClamp:{
    id:'breakClamp', name:'Beak Clamp', type:'physical', btnType:'physical', autoChain:true,
    desc:'Heavy beak clamp — auto-repeats until it misses. Each consecutive hit +15% DMG (max 3 stacks).',
    baseMissChance:20, baseDmgMult:1.1,
    levels:[
      {lv:1, desc:'110% dmg, 20% miss. Auto-repeats, +15% per hit. Max +45% at 3rd hit.'},
      {lv:2, desc:'120% dmg, 17% miss. +18% per hit.'},
      {lv:3, desc:'130% dmg, 14% miss. +21% per hit + Weaken 15% on 3rd hit.', newAilment:'weaken', ailChance:15},
      {lv:4, desc:'145% dmg, 11% miss. +25% per hit + Weaken 25%.', ailChance:25},
    ]
  },
  // ---- SNOWY OWL ----
  silentPierce:{
    id:'silentPierce', name:'Silent Pierce', type:'physical', btnType:'physical',
    desc:'Stealthy beak thrust — high accuracy, chance to Fear. Ignores enemy DEF.',
    baseMissChance:5, pierceDef:15,
    levels:[
      {lv:1, desc:'110% dmg, 5% miss. Pierce 15% DEF. 15% Fear.', newAilment:'feared', ailChance:15},
      {lv:2, desc:'125% dmg, 4% miss. Pierce 22% DEF. 20% Fear.', ailChance:20},
      {lv:3, desc:'140% dmg, 3% miss. Pierce 28% DEF. 25% Fear + if already feared: +20% crit.', ailChance:25},
      {lv:4, desc:'160% dmg, 2% miss. Pierce 35% DEF. 30% Fear + reapplies status ailments.', ailChance:30},
    ]
  },
  // ---- TOUCAN ----
  serratedBill:{
    id:'serratedBill', name:'Serrated Bill', isBasic:true, type:'physical', btnType:'physical',
    desc:'Rogue/trickster basic. Rewards repeated use with stacking damage.',
    baseMissChance:18, baseDmgMult:0.82,
    energyByLevel:[1,1,1,1], energyCost:1,
    levels:[
      {lv:1, desc:'82% dmg, 18% miss. +20% per consecutive use (max 5 stacks)'},
      {lv:2, desc:'92% base dmg, 15% miss — Burn 12% at max stacks', newAilment:'burning', ailChance:12},
      {lv:3, desc:'102% base dmg, 12% miss — Burn 20%, Weaken 15%', ailChance:20, newAilment2:'weaken', ailChance2:15},
      {lv:4, desc:'115% base dmg, 10% miss — Burn 30%, Weaken 25%, cap raised', ailChance:30, ailChance2:25},
    ]
  },

  tookieTookie:{
    id:'tookieTookie', name:'Tookie Tookie', type:'spell', btnType:'spell',
    desc:'Song: +50% ATK, +20% miss chance for 2 turns. "Ahh Ahh, Eee Eee!"',
    levels:[
      {lv:1, desc:'ATK ×1.5, miss +20% for 2t'},
      {lv:2, desc:'ATK ×1.65, miss +15%, DEF +3 for 2t'},
      {lv:3, desc:'ATK ×1.8, miss +12%, DEF +4, Crit +15% for 3t'},
      {lv:4, desc:'ATK ×2.0, miss +8%, DEF +5, Crit +25%, 3t — fear immune'},
    ]
  },
  fruitSweetener:{
    id:'fruitSweetener', name:'Fruit Sweetener', type:'utility', btnType:'utility',
    desc:'Heal 15% HP instantly. 2-turn cooldown.',
    levels:[
      {lv:1, desc:'Heal 15% HP. CD 2t'},
      {lv:2, desc:'Heal 22% HP. CD 2t. Also restores 1 cleanse'},
      {lv:3, desc:'Heal 28% HP. CD 1t'},
      {lv:4, desc:'Heal 35% HP. No CD. Also grants +10% dodge for 2t'},
    ]
  },
  // ---- HUMMINGBIRD ----
  nectarJab:{
    id:'nectarJab', name:'Nectar Jab', isBasic:true, type:'physical', btnType:'physical',
    desc:'Small-bird flurry basic. Multi-hit, precision-focused, not free spam.',
    baseMissChance:8, baseDmgMult:0.42,
    energyByLevel:[1,1,1,1], energyCost:1,
    levels:[
      {lv:1, desc:'3 hits ×42% ATK. 8% miss each. 20% Pierce DEF.', pierceChance:20},
      {lv:2, desc:'3 hits ×50% ATK, 6% miss. 25% Pierce + Weaken 12%.', pierceChance:25, newAilment:'weaken', ailChance:12},
      {lv:3, desc:'4 hits ×50% ATK, 5% miss. 30% Pierce.', pierceChance:30},
      {lv:4, desc:'4 hits ×55% ATK, 4% miss. 35% Pierce. Crits apply Bleed; 8% Burn chance.', pierceChance:35, newAilment:'poison', ailChance:35, newAilment2:'burning', ailChance2:8},
    ]
  },

  // ---- KIWI ----
  probeStrike:{
    id:'probeStrike', name:'Probe Strike', isBasic:true, type:'physical', btnType:'physical',
    desc:'Precision pierce basic. Reliable anti-armor option for beak strikers.',
    baseMissChance:8, baseDmgMult:0.96, pierceDef:30,
    energyByLevel:[1,1,1,1], energyCost:1,
    levels:[
      {lv:1, desc:'96% ATK, 8% miss. Ignores 30% DEF. +15% dmg vs high-HP.'},
      {lv:2, desc:'110% ATK, 6% miss. Ignores 38% DEF.'},
      {lv:3, desc:'124% ATK, 5% miss. Ignores 45% DEF + Fear 15%.', newAilment:'feared', ailChance:15},
      {lv:4, desc:'138% ATK, 4% miss. Ignores 55% DEF + Fear 25%. Armor Shred: −2 DEF permanent.', ailChance:25},
    ]
  },

};

// ============================================================
//  BIRD DEFINITIONS
// ============================================================
const BIRDS = {
  // ── TINY ────────────────────────────────────────────────────
  sparrow:{
    name:'Sparrow', portraitKey:'sparrow', tagline:'Swift as wind, strikes like needles.',
    size:'tiny', class:'assassin',
    stats:{hp:28,maxHp:28,atk:5,def:2,spd:9,dodge:35,acc:85,mdef:6,matk:6,critChance:10},
    statBars:{HP:28/50,ATK:5/15,SPD:9/10,Dodge:.7,ACC:.85}, color:'#6a8ae8',
    startAbilities:['rapidPeck','dart','evade'],
    passive:{id:'windDancer',name:'Wind Dancer',desc:'Every dodge grants +1% permanent dodge (max +15%).',
      onDodge(p){if(!p._windDancerBonus)p._windDancerBonus=0;if(p._windDancerBonus<15){p._windDancerBonus++;p.stats.dodge=Math.min(p.stats.dodge+1,100);}}},
  },
  hummingbird:{
    name:'Hummingbird', portraitKey:'hummingbird', tagline:'Blurred wings, needle beak. Zap & zip.',
    size:'tiny', class:'assassin',
    unlockRequires:'unlock_hummingbird',
    unlockHint:'Defeat Stage 10 with Sparrow.',
    stats:{hp:25,maxHp:25,atk:7,def:1,spd:12,dodge:55,acc:92,mdef:4,matk:10,critChance:18},
    color:'#40e8c0',
    startAbilities:['nectarJab','evade','swoop'],
    passive:{id:'hoverBlitz',name:'Hover Blitz',desc:'+2 SPD per dodge (max +10, resets on hit). Crits heal 10% HP.',
      onBattleStart(p){p._hoverStacks=0;},
      onDodge(p){if(!p._hoverStacks)p._hoverStacks=0;if(p._hoverStacks<10){p._hoverStacks+=2;p.stats.spd=Math.min(p.stats.spd+2,20);}},
      onDamage(p){if(p._hoverStacks>0){p.stats.spd=Math.max(p.stats.spd-p._hoverStacks,1);p._hoverStacks=0;}},
      onCrit(p){p.stats.hp=Math.min(p.stats.hp+Math.floor(p.stats.maxHp*.1),p.stats.maxHp);}},
  },

  // ── SMALL ───────────────────────────────────────────────────
  blackbird:{
    name:'Blackbird', portraitKey:'phainopepla', tagline:'Songs that shatter minds. Eyes like embers.',
    size:'small', class:'mage',
    stats:{hp:38,maxHp:38,atk:6,def:3,spd:7,dodge:25,acc:80,mdef:8,matk:14},
    statBars:{HP:38/50,ATK:6/15,SPD:7/10,Dodge:.5,ACC:.8}, color:'#9a6ae8',
    startAbilities:['blackPeck','dirge','sonicDirge'],
    passive:{id:'songResilient',name:'Song Resilient',desc:'Every successful spell cast, restore 2 HP.',
      onSpell(p){p.stats.hp=Math.min(p.stats.hp+2,p.stats.maxHp);}},
  },
  macaw:{
    name:'Macaw', portraitKey:'macaw', tagline:'Every word is a weapon.',
    size:'small', class:'bard',
    stats:{hp:34,maxHp:34,atk:7,def:3,spd:8,dodge:28,acc:85,mdef:8,matk:16},
    color:'#1a6aba',
    startAbilities:['dirge','lullaby','breakClamp'],
    passive:{id:'parrot',name:'Parrot',
      desc:'After an enemy uses an ability, gain +5% Dodge for 1 turn (max 20%).',
      onBattleStart(p){p._macawEchoDodge=0;},
      onEnemyAbility(p,abilityId){p._macawEchoDodge=Math.min(20,(p._macawEchoDodge||0)+5);G.playerStatus.humDodge={bonus:p._macawEchoDodge,turns:1};}},
  },
  peregrine:{
    name:'Peregrine Falcon', portraitKey:'peregrine', tagline:'200mph. No remorse.',
    size:'small', class:'assassin',
    unlockRequires:'unlock_peregrine',
    unlockHint:'Defeat Stage 20 with Hummingbird.',
    stats:{hp:32,maxHp:32,atk:8,def:3,spd:10,dodge:28,acc:88,critChance:10,mdef:8,matk:8},
    statBars:{HP:32/50,ATK:8/15,SPD:10/10,Dodge:.56,ACC:.88}, color:'#6a8ac8',
    startAbilities:['diveGouge','swoop','evade'],
    passive:{id:'terminalVelocity',name:'Terminal Velocity',desc:'Each turn without taking damage stacks +2% Crit Chance (max +20%). Taking damage resets it.',
      onBattleStart(p){p._velocityStacks=0;},
      onTurnEnd(p){if(!p._tookDmgThisTurn){p._velocityStacks=Math.min(p._velocityStacks+2,20);}p._tookDmgThisTurn=false;},
      onDamage(p){p._tookDmgThisTurn=true;p._velocityStacks=0;}},
  },
  snowyOwl:{
    name:'Snowy Owl', portraitKey:'snowyOwl', tagline:'Silent. Strike once. Gone.',
    size:'small', class:'assassin',
    unlockRequires:'juvenileWin',
    unlockHint:'Defeat Stage 20 on Normal mode to unlock.',
    stats:{hp:28,maxHp:28,atk:12,def:2,spd:9,dodge:38,acc:92,critChance:15,mdef:3,matk:3},
    statBars:{HP:28/50,ATK:12/15,SPD:9/10,Dodge:.76,ACC:.92}, color:'#e8f0f8',
    startAbilities:['silentPierce','evade','featherRuffle'],
    passive:{id:'shadowCloak',name:'Shadow Cloak',
      desc:'First attack each battle is unblockable + +35% crit chance (not guaranteed). Taking no damage a turn stacks +2% crit (max +12%, resets on hit).',
      onBattleStart(p){p._shadowCloakReady=true;p._owlCritStacks=0;},
      onTurnEnd(p){if(!p._owlHitThisTurn&&(p._owlCritStacks||0)<12){p._owlCritStacks=(p._owlCritStacks||0)+2;p.stats.critChance=(BIRDS.snowyOwl.stats.critChance||15)+p._owlCritStacks;}p._owlHitThisTurn=false;},
      onDamage(p){p._owlHitThisTurn=true;p._owlCritStacks=0;p.stats.critChance=BIRDS.snowyOwl.stats.critChance||15;},
    },
  },
  kiwi:{
    name:'Kiwi', portraitKey:'kiwi', tagline:'Nocturnal probe. Beak pierces armor like butter.',
    size:'small', class:'assassin',
    unlockRequires:'unlock_kiwi',
    unlockHint:'Defeat Stage 20 with Magpie.',
    stats:{hp:34,maxHp:34,atk:8,def:3,spd:8,dodge:48,acc:88,critChance:12,mdef:5,matk:7},
    color:'#a0784a',
    startAbilities:['probeStrike','diveBomb','evade'],
    passive:{id:'probeMaster',name:'Probe Master',desc:'Pierce attacks ignore 20-35% DEF (scaling per hit). +10% dmg vs high-HP foes (above 75% HP).',
      get _pierceBase(){return 30;}},
  },
  blackCockatoo:{
    name:'Black Cockatoo', portraitKey:'blackCockatoo', tagline:'Ebon omen. Pure psychic wails.',
    size:'small', class:'mage',
    unlockRequires:'juvenileWin',
    unlockHint:'Defeat Stage 20 on Normal mode to unlock.',
    stats:{hp:30,maxHp:30,atk:5,def:2,spd:6,dodge:18,acc:78,mdef:12,matk:16},
    color:'#2a1a3a',
    startAbilities:['blackPeck','sonicDirge','owlPsyche'],
    passive:{id:'crestScream',name:'Crest Scream',desc:'Spells ignore 20% enemy M.DEF. Critical spells apply Brain Fog (−15% SPD/ACC for 3t).',
      get _mdefPierce(){return 20;}},
  },

  // ── MEDIUM ──────────────────────────────────────────────────
  crow:{
    name:'Crow', portraitKey:'crow', tagline:'Tactical. Precise. Unforgiving.',
    size:'medium', class:'knight',
    stats:{hp:35,maxHp:35,atk:6,def:4,spd:5,dodge:15,acc:90,mdef:10,matk:6},
    statBars:{HP:35/50,ATK:6/15,SPD:5/10,Dodge:.3,ACC:.9}, color:'#c0c8d8',
    startAbilities:['crowStrike','beakSlam','talonRake','crowDefend'],
    passive:{id:'ironWill',name:'Iron Will',desc:'Each successful block = +1 DEF permanently (max +8). Immune to Weaken.',
      immuneWeaken:true,
      onBlock(p){if(!p._ironWillBonus)p._ironWillBonus=0;if(p._ironWillBonus<8){p._ironWillBonus++;p.stats.def++;}}},
  },
  kookaburra:{
    name:'Kookaburra', portraitKey:'kookaburra', tagline:'Patient hunter. Strikes when they least expect.',
    size:'medium', class:'bard',
    unlockRequires:'unlock_kookaburra',
    unlockHint:'Defeat Stage 10 with Macaw.',
    stats:{hp:46,maxHp:46,atk:9,def:5,spd:7,dodge:22,acc:82,mdef:10,matk:8},
    statBars:{HP:46/50,ATK:9/15,SPD:7/10,Dodge:.44,ACC:.82}, color:'#c8a060',
    startAbilities:['bashUp','sitAndWait','theJoker'],
    passive:{id:'ambushMaster',name:'Ambush Master',desc:'First attack each battle always crits. Immune to Fear and Confused. Boss kill resets Ambush for next fight.',
      immuneFear:true, immuneConfused:true,
      onBattleStart(p){p._ambushReady=true;},
      onBossKill(p){p._ambushReady=true;spawnFloat('player','🪶 Ambush Ready!','fn-status');}},
  },
  lyrebird:{
    name:'Lyrebird', portraitKey:'lyrebird', tagline:'The great deceiver. Master of all songs.',
    size:'medium', class:'bard',
    unlockRequires:'unlock_lyrebird',
    unlockHint:'Defeat Stage 20 with Kookaburra.',
    stats:{hp:38,maxHp:38,atk:6,def:4,spd:6,dodge:20,acc:82,critChance:6,mdef:10,matk:14},
    statBars:{HP:38/50,ATK:6/15,SPD:6/10,Dodge:.4,ACC:.82}, color:'#c8902a',
    startAbilities:['dart','lullaby','shriekwave'],
    passive:{id:'lyreLyre',name:'Lyre Lyre',desc:'Reduces a randomly selected enemy stat at battle start and grants that amount to Lyrebird as a buff.',
      onBattleStart(p){
        const enemy=G?.enemy?.stats;
        if(!enemy) return;
        const picks=[
          {key:'atk',label:'ATK',min:1,delta:2},
          {key:'def',label:'DEF',min:0,delta:2},
          {key:'spd',label:'SPD',min:1,delta:2},
          {key:'acc',label:'ACC',min:40,delta:6},
          {key:'dodge',label:'Dodge',min:0,delta:6},
          {key:'matk',label:'MATK',min:0,delta:2},
          {key:'mdef',label:'MDEF',min:0,delta:2},
        ].filter(x=>Number.isFinite(enemy[x.key]));
        if(!picks.length) return;
        const pick=picks[Math.floor(Math.random()*picks.length)];
        const cur=Number(enemy[pick.key]||0);
        const reduction=Math.max(0,Math.min(pick.delta, cur-pick.min));
        if(reduction<=0) return;
        enemy[pick.key]=cur-reduction;
        p.stats[pick.key]=Number(p.stats[pick.key]||0)+reduction;
        spawnFloat('enemy',`🎼 ${pick.label}-${reduction}`,'fn-status');
        spawnFloat('player',`🎵 ${pick.label}+${reduction}`,'fn-status');
        logMsg(`🎵 Lyre Lyre steals ${pick.label} ${reduction} at battle start!`,'system');
      }},
  },
  raven:{
    name:'Raven', portraitKey:'raven', tagline:'Chaos given feathers. Roll the bones.',
    size:'medium', class:'mage',
    unlockRequires:'juvenileWin',
    unlockHint:'Defeat Stage 20 on Normal mode to unlock.',
    stats:{hp:38,maxHp:38,atk:8,def:3,spd:7,dodge:22,acc:82,mdef:8,matk:14},
    color:'#6030d0',
    startAbilities:['theJoker','birdBrain','blackPeck'],
    passive:{id:'omen',name:'Omen',
      desc:'At battle start, a random blessing and a random curse are applied to both sides.',
      onBattleStart(p){
        const blessings=[
          ()=>{p.stats.atk+=4;logMsg('☠ Omen Blessing: +4 ATK!','crit');},
          ()=>{p.stats.dodge=Math.min(p.stats.dodge+15,70);logMsg('☠ Omen Blessing: +15% Dodge!','crit');},
          ()=>{G.player.goldCritMult=Math.min(2.5,Math.max(G.player.goldCritMult||1.5,2.5));logMsg('☠ Omen Blessing: Crit →2.5×!','crit');},
          ()=>{p.stats.hp=Math.min(p.stats.hp+Math.floor(p.stats.maxHp*.25),p.stats.maxHp);logMsg('☠ Omen Blessing: +25% HP!','exp-gain');},
        ];
        const curses=[
          ()=>{G.enemyStatus.weaken=4;logMsg('☠ Omen Curse on enemy: Chicken Pox!','system');},
          ()=>{G.enemyStatus.poison={stacks:3,turns:4};logMsg('☠ Omen Curse on enemy: Flu!','system');},
          ()=>{G.enemyStatus.confused={turns:2,skipChance:40};logMsg('☠ Omen Curse on enemy: Confused!','system');},
          ()=>{G.enemy.stats.atk=Math.max(1,Math.floor(G.enemy.stats.atk*.7));logMsg('☠ Omen Curse on enemy: ATK −30%!','system');},
        ];
        blessings[Math.floor(Math.random()*blessings.length)]();
        curses[Math.floor(Math.random()*curses.length)]();
      }},
  },
  magpie:{
    name:'Magpie', portraitKey:'magpie', tagline:'Swooping thief. Calls the murder to mob.',
    size:'medium', class:'ranger',
    unlockRequires:'unlock_magpie',
    unlockHint:'Defeat Stage 10 with Robin.',
    stats:{hp:42,maxHp:42,atk:7,def:4,spd:8,dodge:32,acc:84,mdef:9,matk:12,critChance:8},
    color:'#2a2a2a',
    startAbilities:['mobSwarm','dart','shriekwave'],
    passive:{id:'murderCall',name:'Murder Call',desc:'Mob attacks gain +10% hit vs low-HP foes. Each kill raises summon cap (max +3).',
      onBattleStart(p){p._murderBonusCap=0;}},
  },


  robin:{
    name:'Robin', portraitKey:'robin', tagline:'Sharp-eyed skirmisher. Pebbles and thorns from afar.',
    size:'small', class:'ranger',
    stats:{hp:34,maxHp:34,atk:7,def:3,spd:8,dodge:24,acc:88,mdef:8,matk:8,critChance:8},
    color:'#d86a4c',
    startAbilities:['dart','mudshot','cactiSpine'],
    passive:{id:'hedgeHunter',name:'Hedge Hunter',desc:'Ranged hits grant +2% ACC for this battle (max +12%).',
      onBattleStart(p){p._robinAccStacks=0;},
      onPhysicalHit(p){if((p._robinAccStacks||0)<12){p._robinAccStacks=(p._robinAccStacks||0)+2;p.stats.acc=Math.min(100,(p.stats.acc||80)+2);}}},
  },
  bowerbird:{
    name:'Bowerbird', portraitKey:'bowerbird', tagline:'Collector of oddities. Makes every throw count.',
    size:'medium', class:'ranger',
    unlockRequires:'juvenileWin',
    unlockHint:'Defeat Stage 20 on Normal mode to unlock.',
    stats:{hp:40,maxHp:40,atk:8,def:4,spd:7,dodge:22,acc:86,mdef:9,matk:9},
    color:'#4a6a9a',
    startAbilities:['rockDrop','stickLance','aerialPoop'],
    passive:{id:'collectorInstinct',name:'Collector Instinct',desc:'First ranged hit each battle gains +20% damage and +20% pierce.',
      onBattleStart(p){p._bowerEmpowered=true;}},
  },

  // ── LARGE ───────────────────────────────────────────────────
  toucan:{
    name:'Toucan', portraitKey:'toucan', tagline:'Serrated bill, tropical fury.',
    size:'large', class:'bard',
    unlockRequires:'unlock_toucan',
    unlockHint:'Enter: "Ahh Ahh Eee Eee Tookie Tookie"',
    stats:{hp:45,maxHp:45,atk:7,def:5,spd:4,dodge:12,acc:75,mdef:8,matk:10},
    statBars:{HP:45/50,ATK:7/15,SPD:4/10,Dodge:.24,ACC:.75}, color:'#60c840',
    startAbilities:['serratedBill','tookieTookie','owlPsyche'],
    passive:{id:'fruitful',name:'Fruitful',desc:'Whenever you heal, gain +1% ACC (max +12%).',
      onHeal(p,amt){if(!p._fruitfulBonus)p._fruitfulBonus=0;if(p._fruitfulBonus<12){const gain=Math.max(1,Math.floor(amt/8));const actual=Math.min(gain,12-p._fruitfulBonus);p._fruitfulBonus+=actual;p.stats.acc=Math.min(p.stats.acc+actual,100);}}},
  },
  swan:{
    name:'Swan', portraitKey:'swan', tagline:'Elegance in life. Devastation in death.',
    size:'large', class:'bard',
    unlockRequires:'unlock_swan',
    unlockHint:'Reach Endless Stage 30 with any Bard.',
    stats:{hp:44,maxHp:44,atk:8,def:5,spd:6,dodge:20,acc:84,mdef:10,matk:12},
    color:'#f0f4fc',
    startAbilities:['serratedSlash','hum','preen'],
    passive:{id:'swanSong',name:'Swan Song',
      desc:'Upon reaching 0 HP, deal one final strike at 200% ATK. If it kills the enemy, Swan survives at 1 HP.',
      onBattleStart(p){p._swanSongFired=false;},
    },
  },
  flamingo:{
    name:'Flamingo', portraitKey:'flamingo', tagline:'Balance is power. Grace is terror.',
    size:'large', class:'ranger',
    unlockRequires:'unlock_flamingo',
    unlockHint:'Reach Endless Stage 30 with any Ranger.',
    stats:{hp:48,maxHp:48,atk:8,def:4,spd:6,dodge:18,acc:80,mdef:12,matk:8},
    color:'#e8609a',
    startAbilities:['mudLash','hum','sitAndWait'],
    passive:{id:'stanceBalance',name:'Balance Master',
      desc:'Alternate attack and utility abilities each turn to gain +20% ATK (2t) or +20% dodge (2t).',
      onBattleStart(p){p._lastAbType=null;},
      onAbilityUse(p,ab){
        const isAtk=ab.btnType==='physical';
        const prev=p._lastAbType; p._lastAbType=ab.btnType;
        if(!prev) return;
        if(isAtk&&prev!=='physical'){
          G.playerStatus.humDodge={bonus:20,turns:2};
          spawnFloat('player','🦩 +20% Dodge!','fn-status');
          logMsg('🦩 Balance Master: +20% Dodge for 2t!','system');
        } else if(!isAtk&&prev==='physical'){
          G.playerStatus.flamingoATK={bonus:20,turns:2};
          spawnFloat('player','🦩 +20% ATK!','fn-status');
          logMsg('🦩 Balance Master: +20% ATK for 2t!','system');
        }
      }},
  },
  secretary:{
    name:'Secretary Bird', portraitKey:'secretary', tagline:'Serpent stomper. Justice on stilts.',
    size:'large', class:'knight',
    unlockRequires:'unlock_secretary',
    unlockHint:'Defeat Stage 10 with Crow.',
    stats:{hp:48,maxHp:48,atk:9,def:6,spd:5,dodge:10,acc:80,critChance:8,mdef:10,matk:6},
    statBars:{HP:48/50,ATK:9/15,SPD:5/10,Dodge:.2,ACC:.8}, color:'#e0a060',
    startAbilities:['serpentCrusher','crowDefend','parry'],
    passive:{id:'serpentStomp',name:'Serpent Stomp',desc:'Every physical attack has a 20% chance to Paralyze the enemy. Immune to Poison.',
      immunePoison:true,
      onPhysicalHit(p,G){if(chance(20)&&!G.enemyStatus.paralyzed){G.enemyStatus.paralyzed=1;spawnFloat('enemy','⚡ Para!','fn-status');}}},
  },
  albatross:{
    name:'Albatross', tagline:'Ocean courier. Wind-carved arcs and storm songs.',
    size:'large', class:'summoner',
    unlockRequires:'unlock_albatross',
    unlockHint:'Reach Endless Stage 50 with any bird.',
    stats:{hp:54,maxHp:54,atk:8,def:6,spd:7,dodge:14,acc:82,mdef:11,matk:15,critChance:8},
    color:'#9fb7c9',
    startAbilities:['wingStorm','wormRiot','supersonic'],
    passive:{id:'tradeWinds',name:'Trade Winds',desc:'Casting a spell grants +1 SPD (max +4) this battle.',
      onSpell(p){p._tradeWind=(p._tradeWind||0);if(p._tradeWind<4){p._tradeWind++;p.stats.spd=Math.min(20,(p.stats.spd||1)+1);}}},
  },

  seagull:{
    name:'Seagull', portraitKey:'seagull', tagline:'Screeching scavenger. Flock dive-bombs trash & foes.',
    size:'medium', class:'summoner',
    unlockRequires:'unlock_seagull',
    unlockHint:'Reach level 21 in Endless mode with any Mage.',
    stats:{hp:36,maxHp:36,atk:6,def:3,spd:8,dodge:24,acc:84,mdef:9,matk:14,critChance:8},
    color:'#b0c8d8',
    startAbilities:['mobSwarm','shriekwave','preen'],
    passive:{id:'scavengeFlock',name:'Scavenge Flock',desc:'Summoned mobs steal 5% enemy ATK as SPD bonus (stacks). Immune to Fear.',
      immuneFear:true,
      onBattleStart(p){p._scavengeStacks=0;}},
  },

  // ── XL ──────────────────────────────────────────────────────
  goose:{
    name:'Goose', portraitKey:'goose', tagline:'Terror incarnate. Honk.',
    size:'xl', class:'tank',
    stats:{hp:55,maxHp:55,atk:9,def:7,spd:2,dodge:5,acc:70,mdef:12,matk:4},
    statBars:{HP:55/50,ATK:9/15,SPD:2/10,Dodge:.1,ACC:.7}, color:'#e8c96a',
    startAbilities:['gooseHonk','intimidate','roost'],
    passive:{id:'bruisedHide',name:'Bruised Hide',desc:'Every 20 HP taken = +1 ATK until battle ends. Takes 20% reduced physical damage.',
      physicalResist:0.20,
      onDamage(p,dmg){if(!p._bruiseAcc)p._bruiseAcc=0;p._bruiseAcc+=dmg;while(p._bruiseAcc>=20){p._bruiseAcc-=20;G.player.stats.atk++;spawnFloat('player','💢+ATK','fn-status');}}},
  },
  shoebill:{
    name:'Shoebill Stork', portraitKey:'shoebill', tagline:'Ancient. Patient. Inevitable.',
    size:'xl', class:'tank',
    unlockRequires:'unlock_shoebill',
    unlockHint:'Defeat Stage 10 with Goose.',
    stats:{hp:70,maxHp:70,atk:10,def:10,spd:2,dodge:5,acc:72,critChance:5,mdef:16,matk:6},
    statBars:{HP:70/50,ATK:10/15,SPD:2/10,Dodge:.1,ACC:.72}, color:'#5a7090',
    startAbilities:['shoebillClamp','roost','intimidate'],
    passive:{id:'prehistoricStare',name:'Prehistoric Stare',desc:'Enemies have 15% chance to skip attack from dread (30% when feared). Immune to Fear & Stun.',
      immuneFear:true, immuneStun:true,
      onEnemyAttackCheck(p,G){const fearBonus=G.enemyStatus.feared>0?15:0;return chance(15+fearBonus);}},
  },
  harpy:{
    name:'Harpy Eagle', portraitKey:'harpy', tagline:'Warlord of the canopy. No mercy.',
    size:'xl', class:'tank',
    unlockRequires:'unlock_harpy',
    unlockHint:'Defeat Stage 20 with Hummingbird.',
    stats:{hp:58,maxHp:58,atk:13,def:6,spd:4,dodge:8,acc:78,critChance:15,mdef:8,matk:6},
    statBars:{HP:58/50,ATK:13/15,SPD:4/10,Dodge:.16,ACC:.78}, color:'#c84030',
    startAbilities:['fleshRipper','talonRake','beakSlam'],
    abilityPool:['physical'],
    passive:{id:'warlordsPath',name:"Warlord's Path",desc:'Every boss kill permanently raises ATK by 3. Takes 15% reduced magic damage.',
      magicResist:0.15,
      onBossKill(p){p.stats.atk+=3;spawnFloat('player','⚔+3 ATK','fn-crit');}},
  },
  baldEagle:{
    name:'Bald Eagle', portraitKey:'baldEagle', tagline:'Unbreakable. Undying. Undefeated.',
    size:'xl', class:'knight',
    unlockRequires:'juvenileWin',
    unlockHint:'Defeat Stage 20 on Normal mode to unlock.',
    stats:{hp:60,maxHp:60,atk:11,def:7,spd:4,dodge:10,acc:78,mdef:10,matk:6},
    color:'#e8e4d8',
    startAbilities:['fishSnatcher','beakSlam','crowDefend'],
    passive:{id:'lastStand',name:'Last Stand',
      desc:'First time per battle you would die, survive at 1 HP and gain +5 ATK for 3 turns. Immune to Paralysis.',
      immuneParalyze:true,
      onBattleStart(p){p._lastStandUsed=false;},
    },
  },
  penguin:{
    name:'Emperor Penguin', portraitKey:'penguin', tagline:'Ice-clad waddler. Magic slides off its blubber.',
    size:'xl', class:'tank',
    unlockRequires:'unlock_penguin',
    unlockHint:'Reach Endless Stage 30 with any Tank.',
    stats:{hp:65,maxHp:65,atk:9,def:9,spd:3,dodge:12,acc:75,mdef:14,matk:5},
    color:'#3a5878',
    startAbilities:['penguinHonk','roost','intimidate'],
    passive:{id:'blubberCoat',name:'Blubber Coat',desc:'Reduces all magic damage by 25–40% (scales with missing HP). Waddle applies Lullaby (15% skip/turn) on attack.',
      get _baseMagicReduce(){return 0.25;},
      onMagicHit(p,dmg){const hpPct=p.stats.hp/p.stats.maxHp;return Math.floor(dmg*(1-(0.25+(1-hpPct)*0.15)));},
    },
  },
  ostrich:{
    name:'Ostrich', portraitKey:'ostrich', tagline:'Flightless thunder. Charges build to earth-shaking fury.',
    size:'xl', class:'tank',
    unlockRequires:'unlock_ostrich',
    unlockHint:'Defeat Stage 20 with Shoebill.',
    stats:{hp:72,maxHp:72,atk:12,def:8,spd:1,dodge:5,acc:70,mdef:10,matk:4},
    color:'#b89060',
    startAbilities:['headWhip','intimidate','roost'],
    passive:{id:'rageCharge',name:'Rage Charge',desc:'Heavy attacks charge over 2–3 turns (+50% dmg/turn). Misses reset charge. Immune to Slow.',
      immuneSlow:true,
      onBattleStart(p){p._rageCharge=0;}},
  },

  cassowary:{
    name:'Cassowary', tagline:'Jungle juggernaut. Bone-crushing kicks and armored hide.',
    size:'xl', class:'tank',
    unlockRequires:'juvenileWin',
    unlockHint:'Defeat Stage 20 on Normal mode to unlock.',
    stats:{hp:74,maxHp:74,atk:13,def:9,spd:3,dodge:8,acc:74,mdef:11,matk:4},
    color:'#3b4a56',
    startAbilities:['headWhip','beakSlam','intimidate'],
    passive:{id:'jungleBulwark',name:'Jungle Bulwark',desc:'Takes 10% reduced physical damage. First heavy hit each battle applies Fear 2t.',
      physicalResist:0.10,
      onBattleStart(p){p._cassFearUsed=false;},
      onPhysicalHit(p,G){if(!p._cassFearUsed){p._cassFearUsed=true;G.enemyStatus.feared=Math.max(G.enemyStatus.feared||0,2);spawnFloat('enemy','💀 Fear!','fn-status');}}},
  },
  emu:{
    name:'Emu', portraitKey:'emu', tagline:'Flightless brute. Kicks and stomps with terrifying force.',
    size:'xl', class:'tank',
    unlockRequires:'unlock_emu',
    unlockHint:'Reach Endless Stage 40 with any Tank.',
    stats:{hp:80,maxHp:80,atk:14,def:10,spd:2,dodge:20,acc:72,mdef:10,matk:4},
    color:'#7a6040',
    startAbilities:['headWhip','intimidate','roost'],
    passive:{id:'rumbleStrike',name:'Rumble Strike',desc:'+20% max HP. Counter-attacks on block for 30% ATK. Immune to Stun.',
      immuneStun:true,
      onBattleStart(p){if(!p._emuHPBoosted){p._emuHPBoosted=true;p.stats.maxHp=Math.floor(p.stats.maxHp*1.20);p.stats.hp=p.stats.maxHp;}},
      onBlock(p){const ctr=Math.floor(p.stats.atk*.3);G.enemy.stats.hp-=ctr;spawnFloat('enemy',`⚡-${ctr}`,'fn-dmg');}}
  },
  dukeBlakiston:{
    name:'Duke Blakiston', portraitKey:'duke_blakiston', tagline:'Lord of the court. Commanding, relentless, imperial.',
    size:'xl', class:'knight',
    unlockRequires:'unlock_duke_blakiston',
    unlockHint:"Enter code 'Blakiston' on the selection screen.",
    stats:{hp:68,maxHp:68,atk:11,def:9,spd:6,dodge:12,acc:84,mdef:14,matk:14,critChance:8},
    color:'#6f88c2',
    startAbilities:['dukeRiverGrip','dukeDecree','dukeWardens'],
    passive:{id:'imperialEdict',name:'Imperial Edict',desc:'Casting a spell grants +1 MATK (max +4). Defending restores 2 HP.',
      onBattleStart(p){p._dukeMatk=0;},
      onSpell(p){if((p._dukeMatk||0)<4){p._dukeMatk=(p._dukeMatk||0)+1;p.stats.matk=(p.stats.matk||0)+1;}},
      onBlock(p){p.stats.hp=Math.min(p.stats.maxHp,p.stats.hp+2);} }
  },
};

BIRDS.blackbird.extraAbilities = (BIRDS.blackbird.extraAbilities||[]).filter(x=>x!=='mimic');


function runPassiveIntegrityAudit(){
  const IMM_MAP=[
    {needle:/immune\s+to\s+poison|poison\s+immune/i, key:'immunePoison'},
    {needle:/immune\s+to\s+fear|fear\s+immune/i, key:'immuneFear'},
    {needle:/immune\s+to\s+stun|stun\s+immune/i, key:'immuneStun'},
    {needle:/immune\s+to\s+paraly/i, key:'immuneParalyze'},
    {needle:/immune\s+to\s+weaken|weaken\s+immune/i, key:'immuneWeaken'},
    {needle:/immune\s+to\s+confus/i, key:'immuneConfused'},
    {needle:/immune\s+to\s+slow|slow\s+immune/i, key:'immuneSlow'},
  ];
  Object.entries(BIRDS||{}).forEach(([id,b])=>{
    const p=b?.passive;
    if(!p||!p.desc) return;
    IMM_MAP.forEach(m=>{
      if(m.needle.test(p.desc) && !p[m.key]){
        p[m.key]=true;
        try{ console.warn(`[passive-audit] ${id}.${p.id||'passive'} missing ${m.key}; auto-enabled to match description.`); }catch(_){ }
      }
    });
  });
}

runPassiveIntegrityAudit();
if(!BIRDS.blackbird.extraAbilities.includes('bleakBeak')) BIRDS.blackbird.extraAbilities.push('bleakBeak');

// ============================================================
//  ENEMIES — 20 stages (boss every 10)
// ============================================================
function makeEnemy(name, emoji, hp, atk, def, spd, style, isBoss=false, bossTitle='', opts={}) {
  const acc = opts.acc||72;
  const dodge = opts.dodge||5;
  const size = opts.size||'medium';
  const abilities = opts.abilities||[];
  const mdef = opts.mdef||8;
  const matk = opts.matk||6;
  const portraitKey = opts.portraitKey||null;
  return {name, emoji, portraitKey, hp, maxHp:hp, atk, def, spd, acc, dodge, size, aiStyle:style, isBoss, bossTitle, abilities,
    stats:{hp,maxHp:hp,atk,def,spd,acc,dodge,mdef,matk}};
}

function makeDukeBlakiston(){
  return {
    id:'duke_blakiston', name:'Duke Blakiston', portraitKey:'duke_blakiston', isBoss:true, size:'xl', aiType:'boss_duke',
    stats:{maxHp:360,hp:360,atk:16,matk:16,def:9,mdef:9,spd:7,acc:85,dodge:8},
    duke:{phase:1,nightfallTurns:0,decreeKey:null,decreeStacks:0,riverCd:0,summonCd:0,verdictCd:0}
  };
}
const ENEMY_ABILITY_POOL = {
  // Enemy abilities are simplified versions
  eVenom:   {name:'Venom Peck', desc:'Applies 2 Poison stacks (DoT).', dmg:'0 direct', dodgeable:true, fn(e,p,G){applyAilment('player','poison',2);logMsg(`☣ ${e.name} spreads Flu!`,'enemy-action');}},
  eWeaken:  {name:'Screech', desc:'Applies Chicken Pox (reduced damage/dodge).', dmg:'0 direct', dodgeable:true, fn(e,p,G){
    const _bd=BIRDS[G.player.birdKey];if(_bd&&_bd.passive&&_bd.passive.immuneWeaken){spawnFloat('player','🛡 Immune!','fn-status');return;}
    G.playerStatus.weaken=Math.max(G.playerStatus.weaken||0,2+((G.biomeMod?.dread||0)>0?1:0));logMsg(`🐔 ${e.name} weakens you!`,'enemy-action');}},
  eStun:    {name:'Body Slam', desc:'Chance to stun for 1 turn.', dmg:'~90-130% ATK', fn(e,p,G){
    const _bd=BIRDS[G.player.birdKey];if(_bd&&_bd.passive&&(_bd.passive.immuneStun||G.player.immuneParalyze)){spawnFloat('player','🛡 Immune!','fn-status');logMsg(`${e.name}'s stun bounced off!`,'miss');return;}
    if(chance(25)){G.playerStatus.stunned=(G.playerStatus.stunned||0)+1;logMsg(`😵 ${e.name} stuns you!`,'enemy-action');}else{logMsg(`${e.name}'s stun missed.`,'miss');}}},
  eFear:    {name:'Shriek', desc:'Applies Fear; lowers hit reliability.', dmg:'0 direct', dodgeable:true, fn(e,p,G){
    const _bd=BIRDS[G.player.birdKey];if(_bd&&_bd.passive&&_bd.passive.immuneFear){spawnFloat('player','🛡 Fear Immune!','fn-status');return;}
    G.playerStatus.feared=(G.playerStatus.feared||0)+2+((G.biomeMod?.dread||0)>0?1:0);logMsg(`😨 ${e.name} terrifies you!`,'enemy-action');}},
  eBurn:    {name:'Fire Feathers', desc:'Applies Feather Disease for 3 turns.', dmg:'0 direct', dodgeable:true, fn(e,p,G){G.playerStatus.burning=3;logMsg(`🔥 ${e.name} ignites you!`,'burn-tick');}},
  eHeal:    {name:'Preen', desc:'Heals about 15% of enemy max HP.', dmg:'healing', fn(e,p,G){const h=Math.floor(e.stats.maxHp*.15);e.stats.hp=Math.min(e.stats.hp+h,e.stats.maxHp);setHpBar('enemy',e.stats.hp,e.stats.maxHp);spawnFloat('enemy',`+${h}`,'fn-heal');logMsg(`🌿 ${e.name} preens for ${h} HP!`,'system');}},
  eRage:    {name:'Fury', desc:'Raises enemy ATK by about 25%.', dmg:'buff', fn(e,p,G){G.enemyStatus.atkBuff=(G.enemyStatus.atkBuff||0)+Math.floor(e.stats.atk*.25);logMsg(`💢 ${e.name} rages! ATK boost!`,'enemy-action');}},
  eBlind:   {name:'Wing Dust', desc:'Reduces your ACC by 15%.', dmg:'0 direct', dodgeable:true, fn(e,p,G){G.playerStatus.accDebuff=(G.playerStatus.accDebuff||0)+15;logMsg(`👁 ${e.name} blinds you! −15% ACC.`,'system');}},
  ePoison:  {name:'Plague Bite', desc:'Applies strong Poison stacks.', dmg:'0 direct', dodgeable:true, fn(e,p,G){applyAilment('player','poison',3);logMsg(`☣ ${e.name} triple flu!`,'poison-tick');}},
  eShield:  {name:'Iron Feathers', desc:'Defends for 2 turns.', dmg:'0 direct', fn(e,p,G){G.enemyStatus.defending=2;doShield('enemy');logMsg(`🛡 ${e.name} shields for 2t!`,'enemy-action');}},
};

const ENEMIES = [
  // Tier 1 — Stages 1-4 (weak)
  makeEnemy('Sparrow Fledgling','',18,3,1,7,'aggressive',false,'',{acc:65,dodge:20,size:'tiny',abilities:['eVenom'],portraitKey:'sparrow'}),
  makeEnemy('Dove','🕊️',24,5,2,5,'cautious',false,'',{acc:68,dodge:10,size:'small',abilities:['eWeaken'],portraitKey:'swan'}),
  makeEnemy('Magpie','‍⬛',32,7,3,6,'aggressive',false,'',{acc:72,dodge:15,size:'small',abilities:['eVenom','eWeaken'],portraitKey:'magpie'}),
  makeEnemy('Starling Swarm','',28,6,1,8,'berserker',false,'',{acc:70,dodge:25,size:'tiny',abilities:['eBlind'],portraitKey:'blackbird'}),
  makeEnemy('Finch','',20,4,1,8,'aggressive',false,'',{acc:66,dodge:30,size:'tiny',abilities:['eBlind'],portraitKey:'sparrow'}),
  // Tier 1 Boss
  makeEnemy('Storm Falcon','🦅',55,12,6,7,'berserker',true,'⚡ Stage Boss',{acc:80,dodge:18,size:'large',abilities:['eStun','eWeaken','eRage'],portraitKey:'peregrine'}),
  // Tier 2 — Stages 5-9
  makeEnemy('Barn Owl','🦉',38,9,4,5,'cautious',false,'',{acc:75,dodge:12,size:'medium',abilities:['eFear','eHeal'],portraitKey:'snowyOwl'}),
  makeEnemy('Kite','🦅',44,11,4,6,'aggressive',false,'',{acc:77,dodge:20,size:'medium',abilities:['eBurn','eVenom'],portraitKey:'peregrine'}),
  makeEnemy('Raven','‍⬛',50,10,6,4,'cautious',false,'',{acc:74,dodge:10,size:'medium',abilities:['eWeaken','eBlind'],portraitKey:'raven'}),
  makeEnemy('Osprey','🦅',58,13,5,6,'berserker',false,'',{acc:78,dodge:15,size:'large',abilities:['eBurn','eStun'],portraitKey:'peregrine'}),
  makeEnemy('Jackdaw','‍⬛',36,8,3,7,'aggressive',false,'',{acc:72,dodge:18,size:'small',abilities:['eFear','eVenom'],portraitKey:'crow'}),
  // Tier 2 Boss
  makeEnemy('Thunderhawk','🦅',90,18,9,6,'berserker',true,'🌩 Stage Boss',{acc:82,dodge:12,size:'large',abilities:['eRage','eStun','eFear','eShield'],portraitKey:'harpy'}),
  // Tier 3 — Stages 10-14
  makeEnemy('Red-tailed Hawk','🦅',65,15,7,5,'aggressive',false,'',{acc:79,dodge:10,size:'large',abilities:['eBurn','eWeaken'],portraitKey:'peregrine'}),
  makeEnemy('Peregrine','🦅',70,17,6,8,'aggressive',false,'',{acc:83,dodge:20,size:'medium',abilities:['eStun','eBlind'],portraitKey:'peregrine'}),
  makeEnemy('Great Horned Owl','🦉',80,16,10,4,'cautious',false,'',{acc:75,dodge:8,size:'large',abilities:['eFear','eHeal','eShield'],portraitKey:'snowyOwl'}),
  makeEnemy('Harpy Eagle','🦅',88,19,8,5,'berserker',false,'',{acc:82,dodge:10,size:'large',abilities:['eRage','eBurn','ePoison'],portraitKey:'harpy'}),
  makeEnemy('Crowned Crane','🦩',60,13,7,5,'cautious',false,'',{acc:78,dodge:12,size:'large',abilities:['eFear','eHeal'],portraitKey:'flamingo'}),
  // Tier 3 Boss
  makeEnemy('Hurricane Crane','🦩',130,26,14,5,'berserker',true,'🌀 Stage Boss',{acc:84,dodge:8,size:'xl',abilities:['eRage','eStun','ePoison','eFear','eShield'],portraitKey:'flamingo'}),
  // Tier 4 — Stages 15-19
  makeEnemy('Condor','🦅',95,21,10,4,'cautious',false,'',{acc:78,dodge:6,size:'xl',abilities:['eFear','eHeal','eBlind'],portraitKey:'harpy'}),
  makeEnemy('Martial Eagle','🦅',110,24,12,5,'aggressive',false,'',{acc:83,dodge:8,size:'xl',abilities:['eBurn','eRage','eStun'],portraitKey:'baldEagle'}),
  makeEnemy('Thunderbird','⚡',120,26,11,6,'berserker',false,'',{acc:85,dodge:10,size:'xl',abilities:['ePoison','eBurn','eRage','eStun'],portraitKey:'baldEagle'}),
  makeEnemy('Seraph Vulture','🦅',135,28,14,4,'cautious',false,'',{acc:80,dodge:5,size:'xl',abilities:['eFear','eHeal','eShield','eBlind'],portraitKey:'shoebill'}),
  makeEnemy('Phantom Owl','🦉',90,20,12,5,'cautious',false,'',{acc:80,dodge:15,size:'large',abilities:['eFear','eBlind','eWeaken'],portraitKey:'snowyOwl'}),
  // Final Boss
  makeEnemy('Sky Sovereign','👑',200,35,18,6,'berserker',true,'👑 Final Boss',{acc:90,dodge:12,size:'xl',abilities:['eRage','eStun','ePoison','eFear','eShield','eBurn'],portraitKey:'baldEagle'}),
];

// Birds that can appear as enemy combatants (adds variety)
const BIRD_ENEMIES = [
  {name:'Wild Sparrow',emoji:'',birdKey:'sparrow',tier:[1,2],hp:30,atk:6,def:2,spd:9,acc:82,dodge:32,size:'tiny',aiStyle:'berserker',abilities:['eBlind']},
  {name:'Rogue Crow',emoji:'‍⬛',birdKey:'crow',tier:[2,3],hp:38,atk:8,def:5,spd:5,acc:88,dodge:14,size:'medium',aiStyle:'aggressive',abilities:['eWeaken','eStun']},
  {name:'Savage Kookaburra',emoji:'',birdKey:'kookaburra',tier:[2,3],hp:48,atk:10,def:5,spd:7,acc:80,dodge:20,size:'medium',aiStyle:'aggressive',abilities:['eFear','eRage']},
  {name:'Feral Toucan',emoji:'',birdKey:'toucan',tier:[3,4],hp:48,atk:9,def:6,spd:4,acc:74,dodge:10,size:'large',aiStyle:'cautious',abilities:['eBurn','ePoison']},
  {name:'Outcast Goose',emoji:'',birdKey:'goose',tier:[3,4],hp:62,atk:11,def:8,spd:2,acc:70,dodge:5,size:'xl',aiStyle:'berserker',abilities:['eFear','eWeaken']},
  {name:'Shadow Raven',emoji:'',birdKey:'raven',tier:[3,4],hp:40,atk:9,def:4,spd:7,acc:80,dodge:20,size:'medium',aiStyle:'aggressive',abilities:['eFear','eBlind','eWeaken']},
  {name:'Apex Peregrine',emoji:'',birdKey:'peregrine',tier:[4],hp:36,atk:12,def:4,spd:11,acc:90,dodge:26,size:'small',aiStyle:'berserker',abilities:['eStun','eBlind']},
  {name:'Storm Swan',emoji:'',birdKey:'swan',tier:[4],hp:50,atk:10,def:6,spd:6,acc:82,dodge:18,size:'large',aiStyle:'cautious',abilities:['eHeal','eWeaken']},
  {name:'War Harpy',emoji:'',birdKey:'harpy',tier:[4],hp:65,atk:14,def:7,spd:5,acc:78,dodge:8,size:'xl',aiStyle:'berserker',abilities:['eRage','eBurn','eStun']},
];

// ===================== BIOMES =====================
const BIOMES = [
  { id:'wetlands', name:'Black Marsh Wetlands', stageMin:1, stageMax:10, mod:{ enemyPoisonPlus:1 } },
  { id:'cliffs', name:'Razor Cliffline', stageMin:11, stageMax:20, mod:{ enemyCritPlus:0.05 } },
  { id:'stormcoast', name:'Storm Coast', stageMin:21, stageMax:30, mod:{ lightningBonus:0.15 } },
  { id:'court', name:"Blakiston's Court", stageMin:31, stageMax:9999, mod:{ dread:1 } },
];

function getBiomeForStage(stage){
  for(const b of BIOMES){
    if(stage>=b.stageMin && stage<=b.stageMax) return b;
  }
  return BIOMES[BIOMES.length-1];
}

function applyBiomeModifiers(){
  const b=getBiomeForStage(G.stage);
  if(!b) return;
  G.biome=b.id;
  G.biomeMod=b.mod||{};
  if(typeof logMsg==='function') logMsg(`🗺️ ${b.name}`,'system');
}


// ============================================================
//  REWARD POOLS — tiered
// ============================================================
const REWARD_WEIGHTS = { grey:50, green:30, blue:15, purple:4, gold:1 };
function rollRarity(){
  const total=Object.values(REWARD_WEIGHTS).reduce((a,b)=>a+b,0);
  let r=Math.random()*total;
  for(const [tier,w] of Object.entries(REWARD_WEIGHTS)){ r-=w; if(r<=0) return tier; }
  return 'grey';
}

const UPGRADE_CARDS_REWORK = [
  {id:'g_quill1',tier:'grey',icon:'🪶',name:'Quill Stitch',desc:'+6 Max HP. First hit each battle -10%.',tags:['sustain'],apply:p=>{p.stats.maxHp+=6;p.firstHitReduce=Math.max(p.firstHitReduce||0,0.10);}},
  {id:'g_talon1',tier:'grey',icon:'🗡️',name:'Talon Hone',desc:'+1 ATK. +3 damage vs Bleeding.',tags:['offense'],apply:p=>{p.stats.atk+=1;p.vsBleedBonus=(p.vsBleedBonus||0)+3;}},
  {id:'g_shell1',tier:'grey',icon:'🛡️',name:'Down Padding',desc:'+1 DEF.',tags:['defense'],apply:p=>{p.stats.def+=1;}},
  {id:'g_focus1',tier:'grey',icon:'🎯',name:'Steady Eye',desc:'+4% hit chance on your next attack each turn.',tags:['utility'],apply:p=>{p.nextAttackAccBonus=4;}},
  {id:'gr_hp',tier:'green',icon:'❤️',name:'Stronger Heart',desc:'+12 Max HP. Heal +6 after battle.',tags:['sustain'],apply:p=>{p.stats.maxHp+=12;p.postBattleFlatHeal=(p.postBattleFlatHeal||0)+6;}},
  {id:'gr_pierce',tier:'green',icon:'🪓',name:'Split-Feather',desc:'+2 ATK. Attacks pierce +10% DEF.',tags:['offense'],apply:p=>{p.stats.atk+=2;p.pierceBonus=(p.pierceBonus||0)+0.10;}},
  {id:'gr_spell',tier:'green',icon:'🔮',name:'Runic Throat',desc:'+2 MATK. Every 3 spells: apply Poison(1).',tags:['offense'],apply:p=>{p.stats.matk=(p.stats.matk||0)+2;p.spellProcPoison=3;}},
  {id:'gr_speed',tier:'green',icon:'💨',name:'Wind-Set',desc:'+1 SPD. First attack each battle +30%.',tags:['utility'],apply:p=>{p.stats.spd=(p.stats.spd||0)+1;p.firstAttackBonusPct=Math.max(p.firstAttackBonusPct||0,0.30);}},
  {id:'b_guard',tier:'blue',icon:'🧱',name:'Quill Armor',desc:'+3 DEF.',tags:['defense'],apply:p=>{p.stats.def+=3;}},
  {id:'b_bleed',tier:'blue',icon:'🩸',name:'Ripper Beak',desc:'+3 ATK. Crits apply Bleed(1).',stackable:false,tags:['offense'],apply:p=>{p.stats.atk+=3;p.critBleed=(p.critBleed||0)+1;}},
  {id:'b_energy',tier:'blue',icon:'🔋',name:'Hot Blood',desc:'Start battle with +1 energy (non-stacking).',stackable:false,tags:['utility'],apply:p=>{p.startEnergyBonus=Math.max(p.startEnergyBonus||0,1);}},
  {id:'b_hex',tier:'blue',icon:'🕯️',name:'Dread Choir',desc:'+2 MATK. First spell each battle inflicts Fear(1).',tags:['offense'],apply:p=>{p.stats.matk=(p.stats.matk||0)+2;p.openingFearOnSpell=1;}},
  {id:'p_echo',tier:'purple',icon:'🎶',name:'Echo Feather',desc:'First skill each battle repeats at 50%.',stackable:false,tags:['utility'],apply:p=>{p.echoFirstSkill=0.5;}},
  {id:'p_blood',tier:'purple',icon:'🩸',name:'Blood Quill',desc:'Below 50% HP: your first attack each turn +25%.',tags:['offense'],apply:p=>{p.lowHpFirstAtkBonus=0.25;}},
  {id:'p_pierce',tier:'purple',icon:'🦅',name:'Raptor Doctrine',desc:'Attacks pierce +25% DEF.',tags:['offense'],apply:p=>{p.pierceBonus=(p.pierceBonus||0)+0.25;}},
  {id:'z_crown',tier:'gold',icon:'👑',name:'Court-Sunder',desc:'Once per battle: your next attack ignores all DEF.',stackable:false,tags:['offense'],apply:p=>{p.onceIgnoreDef=true;}},
];

function getUpgradePool(){ return UPGRADE_CARDS_REWORK.slice(); }
function rollUpgradeCard(){
  const tier=rollRarity();
  const pool=getUpgradePool().filter(c=>c.tier===tier);
  return pool.length?pool[Math.floor(Math.random()*pool.length)]:null;
}

const REWARD_TIERS = {
  grey:{label:'Common', color:'grey'},
  green:{label:'Uncommon', color:'green'},
  blue:{label:'Rare', color:'blue'},
  purple:{label:'Epic', color:'purple'},
  gold:{label:'Legendary', color:'gold'},
};

// Drop rate weights (non-boss) — [grey,green,blue,purple,gold]
const NORMAL_WEIGHTS = [42,34,16,7,1];

// Boss drop weights (fallback; boss rewards are mostly handled by generateBossRewards)
const BOSS_WEIGHTS   = [1,3,35,50,11];

const ALL_REWARDS = [
  {id:'g_hp10', tier:'grey', icon:'💊', name:'Stitched Wing', desc:'Max HP +6 (heal +6)', tags:['sustain','hp'], apply:p=>{ p.stats.maxHp+=6; p.stats.hp=Math.min(p.stats.hp+6,p.stats.maxHp); }},
  {id:'g_heal35', tier:'grey', icon:'🌿', name:'Forest Rest', desc:'Heal 35% of Max HP', tags:['sustain','heal'], apply:p=>{ p.stats.hp=Math.min(p.stats.hp+Math.floor(p.stats.maxHp*0.35),p.stats.maxHp); }},
  {id:'g_def2', tier:'grey', icon:'🌰', name:'Bark Plating', desc:'DEF +1', tags:['defense','def'], apply:p=>{ p.stats.def+=1; }},
  {id:'g_mdef2', tier:'grey', icon:'🪨', name:'Stone Down', desc:'MDEF +1', tags:['defense','mdef'], apply:p=>{ p.stats.mdef=(p.stats.mdef||0)+1; }},
  {id:'g_atk2', tier:'grey', icon:'🪶', name:'Sharpened Feather', desc:'ATK +1', tags:['offense','atk'], apply:p=>{ p.stats.atk+=1; }},
  {id:'g_matk2', tier:'grey', icon:'✨', name:'Spark Dust', desc:'MATK +1', tags:['offense','matk'], apply:p=>{ p.stats.matk=(p.stats.matk||0)+1; }},
  {id:'g_spd1', tier:'grey', icon:'💨', name:'Light Feathers', desc:'SPD +1', tags:['utility','spd'], apply:p=>{ p.stats.spd=(p.stats.spd||0)+1; }},
  {id:'g_dodge6', tier:'grey', icon:'🪽', name:'Side-Glide', desc:'Dodge +6%', tags:['defense','dodge'], apply:p=>{ p.stats.dodge=Math.min((p.stats.dodge||0)+6,100); }},
  {id:'g_mdodge6', tier:'grey', icon:'🫧', name:'Aether Drift', desc:'MDodge +6%', tags:['defense','mdodge'], apply:p=>{ p.stats.mdodge=Math.min((p.stats.mdodge||0)+6,100); }},
  {id:'g_firstTurnEnergy', tier:'grey', icon:'🪺', name:'Warm Nest', desc:'+1 Energy on your first turn each battle', tags:['utility','energy'], apply:p=>{ p.firstTurnEnergy=(p.firstTurnEnergy||0)+1; }},

  {id:'u_hp25', tier:'green', icon:'❤️', name:'Stronger Heart', desc:'Max HP +12 (heal +12)', tags:['sustain','hp'], apply:p=>{ p.stats.maxHp+=12; p.stats.hp=Math.min(p.stats.hp+12,p.stats.maxHp); }},
  {id:'u_def4', tier:'green', icon:'🛡️', name:'Iron Feathers', desc:'DEF +2', tags:['defense','def'], apply:p=>{ p.stats.def+=2; }},
  {id:'u_mdef4', tier:'green', icon:'🔷', name:'Runic Plumage', desc:'MDEF +2', tags:['defense','mdef'], apply:p=>{ p.stats.mdef=(p.stats.mdef||0)+2; }},
  {id:'u_atk5', tier:'green', icon:'⚔️', name:'Talons Honed', desc:'ATK +2', tags:['offense','atk'], apply:p=>{ p.stats.atk+=2; }},
  {id:'u_matk5', tier:'green', icon:'🌙', name:'Moonlit Call', desc:'MATK +2', tags:['offense','matk'], apply:p=>{ p.stats.matk=(p.stats.matk||0)+2; }},
  {id:'u_spd2', tier:'green', icon:'🏁', name:'Tailwind Steps', desc:'SPD +2', tags:['utility','spd'], apply:p=>{ p.stats.spd=(p.stats.spd||0)+2; }},
  {id:'u_dodge10', tier:'green', icon:'🌪️', name:'Wind Step', desc:'Dodge +10%', tags:['defense','dodge'], apply:p=>{ p.stats.dodge=Math.min((p.stats.dodge||0)+10,100); }},
  {id:'u_mdodge10', tier:'green', icon:'🌫️', name:'Mist Step', desc:'MDodge +10%', tags:['defense','mdodge'], apply:p=>{ p.stats.mdodge=Math.min((p.stats.mdodge||0)+10,100); }},
  {id:'u_postHealPlus3', tier:'green', icon:'🍎', name:'Field Snack', desc:'+3% Max HP extra heal after every battle', tags:['sustain','scaling'], apply:p=>{ p.postBattleHealBonusPct=(p.postBattleHealBonusPct||0)+0.03; }},
  {id:'u_precision3', tier:'green', icon:'🎯', name:'Keen Sight', desc:'All skills: -3% miss chance (min 0%)', tags:['utility','accuracy'], apply:p=>{ p.missReduce=(p.missReduce||0)+0.03; }},

  {id:'r_energyMax1', tier:'blue', icon:'🔵', name:'Second Lung', desc:'Max Energy +1', tags:['utility','energy'], apply:p=>{ p.energyBonus=(p.energyBonus||0)+1; p.energyMax=(p.energyMax||0)+1; }},
  {id:'r_hp45', tier:'blue', icon:'🫀', name:'War-Heart', desc:'Max HP +20 (heal +20)', tags:['sustain','hp'], apply:p=>{ p.stats.maxHp+=20; p.stats.hp=Math.min(p.stats.hp+20,p.stats.maxHp); }},
  {id:'r_def7', tier:'blue', icon:'🧱', name:'Quill Armor', desc:'DEF +3', tags:['defense','def'], apply:p=>{ p.stats.def+=3; }},
  {id:'r_mdef7', tier:'blue', icon:'🧿', name:'Glyph Down', desc:'MDEF +3', tags:['defense','mdef'], apply:p=>{ p.stats.mdef=(p.stats.mdef||0)+3; }},
  {id:'r_atk9', tier:'blue', icon:'🦅', name:'Predator Poise', desc:'ATK +3', tags:['offense','atk'], apply:p=>{ p.stats.atk+=3; }},
  {id:'r_matk9', tier:'blue', icon:'🔮', name:'Storm Hymn', desc:'MATK +3', tags:['offense','matk'], apply:p=>{ p.stats.matk=(p.stats.matk||0)+3; }},
  {id:'r_speed4', tier:'blue', icon:'🌬️', name:'Jetstream', desc:'SPD +4', tags:['utility','spd'], apply:p=>{ p.stats.spd=(p.stats.spd||0)+4; }},
  {id:'r_precision6', tier:'blue', icon:'🏹', name:'Falcon Focus', desc:'All skills: -6% miss chance (min 0%)', tags:['utility','accuracy'], apply:p=>{ p.missReduce=(p.missReduce||0)+0.06; }},

  {id:'e_energyMax2', tier:'purple', icon:'🟣', name:'Third Lung', desc:'Max Energy +2', tags:['utility','energy'], apply:p=>{ p.energyBonus=(p.energyBonus||0)+2; p.energyMax=(p.energyMax||0)+2; }},
  {id:'e_fullHeal', tier:'purple', icon:'💉', name:'Sky Tonic', desc:'Full heal + Max HP +30', tags:['sustain','hp'], apply:p=>{ p.stats.maxHp+=30; p.stats.hp=p.stats.maxHp; }},
  {id:'e_def12', tier:'purple', icon:'🏰', name:'Bastion Plumage', desc:'DEF +4', tags:['defense','def'], apply:p=>{ p.stats.def+=4; }},
  {id:'e_mdef12', tier:'purple', icon:'🪬', name:'Aegis Down', desc:'MDEF +4', tags:['defense','mdef'], apply:p=>{ p.stats.mdef=(p.stats.mdef||0)+4; }},
  {id:'e_atk16', tier:'purple', icon:'🗡️', name:'Raptor Creed', desc:'ATK +5', tags:['offense','atk'], apply:p=>{ p.stats.atk+=5; }},
  {id:'e_matk16', tier:'purple', icon:'⚡', name:'Thunder Chorus', desc:'MATK +5', tags:['offense','matk'], apply:p=>{ p.stats.matk=(p.stats.matk||0)+5; }},
  {id:'e_postHealPlus7', tier:'purple', icon:'🥣', name:'Roost Meal', desc:'+7% Max HP extra heal after every battle', tags:['sustain','scaling'], apply:p=>{ p.postBattleHealBonusPct=(p.postBattleHealBonusPct||0)+0.07; }},

  {id:'l_energyMax3', tier:'gold', icon:'👑', name:'Sun-Blessed Lungs', desc:'Max Energy +3', tags:['utility','energy'], apply:p=>{ p.energyBonus=(p.energyBonus||0)+3; p.energyMax=(p.energyMax||0)+3; }},
  {id:'l_titanHide', tier:'gold', icon:'🏔️', name:'Titan Hide', desc:'Max HP +45, DEF +6, MDEF +6', tags:['sustain','defense'], apply:p=>{ p.stats.maxHp+=45; p.stats.hp=p.stats.maxHp; p.stats.def+=6; p.stats.mdef=(p.stats.mdef||0)+6; }},
  {id:'l_apexOffense', tier:'gold', icon:'🦅', name:'Apex Instinct', desc:'ATK +7, MATK +7', tags:['offense'], apply:p=>{ p.stats.atk+=7; p.stats.matk=(p.stats.matk||0)+7; }},
  {id:'l_trueSight', tier:'gold', icon:'👁️', name:'True Sight', desc:'All skills: -12% miss chance (min 0%)', tags:['utility','accuracy'], apply:p=>{ p.missReduce=(p.missReduce||0)+0.12; }},
  {id:'l_roostFeast', tier:'gold', icon:'🔥', name:'Eternal Roost', desc:'Full heal + +12% Max HP extra heal after every battle', tags:['sustain','scaling'], apply:p=>{ p.stats.hp=p.stats.maxHp; p.postBattleHealBonusPct=(p.postBattleHealBonusPct||0)+0.12; }},
];

// ============================================================
//  LEARNABLE ABILITIES — universal abilities gained at level-up
// ============================================================
const ABILITY_TEMPLATES_LEARNABLE = {

  spellLance:{
    id:'spellLance', name:'Spell Lance', type:'spell', btnType:'spell',
    desc:'Focused magical thrust. Mage/Bard specialty.',
    cooldownByLevel:[2,2,2,1],
    levels:[
      {lv:1, desc:'125% M.ATK, 10% miss, Weaken 20%.' , newAilment:'weaken', ailChance:20},
      {lv:2, desc:'140% M.ATK, 10% miss, Weaken 25%.' , ailChance:25},
      {lv:3, desc:'160% M.ATK, 10% miss, Weaken 30% + Fear 20%.', newAilment2:'feared', ailChance2:20},
      {lv:4, desc:'180% M.ATK, 10% miss, Weaken 35% + Fear 25%.', ailChance:35, ailChance2:25},
    ]
  },
  guardianCry:{
    id:'guardianCry', name:'Guardian Cry', type:'utility', btnType:'utility',
    desc:'Knight/Tank ward: DEF up and cleanse one debuff.',
    cooldownByLevel:[3,3,2,2],
    levels:[
      {lv:1, desc:'DEF +4 for 2t, cleanse 1 debuff'},
      {lv:2, desc:'DEF +6 for 2t, cleanse 1 debuff, +10% dodge'},
      {lv:3, desc:'DEF +8 for 3t, cleanse 2 debuffs'},
      {lv:4, desc:'DEF +10 for 3t, full cleanse, fear immune 2t'},
    ]
  },
  shadowFeint:{
    id:'shadowFeint', name:'Shadow Feint', type:'physical', btnType:'physical',
    desc:'Assassin/Ranger feint strike with confuse pressure.',
    baseMissChance:12, baseDmgMult:1.05,
    levels:[
      {lv:1, desc:'105% dmg, 12% miss, Confuse 20%', newAilment:'confused', ailChance:20},
      {lv:2, desc:'120% dmg, 12% miss, Confuse 25%', ailChance:25},
      {lv:3, desc:'135% dmg, 12% miss, Confuse 30% + Weaken 20%', newAilment2:'weaken', ailChance2:20},
      {lv:4, desc:'150% dmg, 12% miss, Confuse 35% + Weaken 25%', ailChance:35, ailChance2:25},
    ]
  },

  swoop:{
    id:'swoop', name:'Swoop', type:'physical', btnType:'physical',
    desc:'Rush strike — never misses. 2-turn cooldown.',
    baseMissChance:0, baseDmgMult:1.0,
    levels:[
      {lv:1, desc:'100% dmg, never misses, bypasses dodge — CD 2t'},
      {lv:2, desc:'115% dmg, 20% stun — CD 2t'},
      {lv:3, desc:'130% dmg, 30% stun — CD 1t'},
      {lv:4, desc:'150% dmg, 35% stun + Weaken — no CD', newAilment:'weaken', ailChance:35},
    ]
  },
  diveBomb:{
    id:'diveBomb', name:'Dive Bomb', type:'physical', btnType:'physical',
    desc:'Speed-fueled dive — damage scales with YOUR speed. Miss scales with enemy size.',
    levels:[
      {lv:1, desc:'SPD-scaled dmg. Boss: 20% miss, Large: 30%, Med: 40%, Small: 50%'},
      {lv:2, desc:'+15% base dmg, miss −5%, Burn 20%', newAilment:'burning', ailChance:20},
      {lv:3, desc:'+30% base dmg, miss −10%, Burn 30%', ailChance:30},
      {lv:4, desc:'+50% base dmg, miss −15%, Burn 40%', ailChance:40},
    ]
  },
  flyby:{
    id:'flyby', name:'Flyby', type:'utility', btnType:'utility',
    desc:'Build momentum — your NEXT attack this battle deals 2× damage. One use.',
    levels:[
      {lv:1, desc:'Next attack ×2 damage. Cannot be upgraded further.'},
      {lv:2, desc:'Next attack ×2 damage. Cannot be upgraded further.'},
      {lv:3, desc:'Next attack ×2 damage. Cannot be upgraded further.'},
      {lv:4, desc:'Next attack ×2 damage. Cannot be upgraded further.'},
    ]
  },
  dustDevil:{
    id:'dustDevil', name:'Dust Devil', type:'utility', btnType:'utility',
    desc:'Kick up a blinding dust storm — reduces enemy accuracy for several turns.',
    levels:[
      {lv:1, desc:'Blind enemy: −15% ACC for 3t'},
      {lv:2, desc:'Blind enemy: −20% ACC for 4t'},
      {lv:3, desc:'Blind enemy: −25% ACC for 5t'},
      {lv:4, desc:'Blind enemy: −30% ACC for 5t + Confuse 20% fumble for 2t'},
    ]
  },
  rockDrop:{
    id:'rockDrop', name:'Rock Drop', type:'ranged', btnType:'ranged',
    desc:'Drop a rock on YOUR next turn — size-based damage, ignores shields.',
    levels:[
      {lv:1, desc:'XL: 3.0× ATK · Large: 2.3× · Medium: 1.8× · Small: 1.4× · Tiny: 1.1×. Ignores block. 1-turn delay.'},
      {lv:2, desc:'+20% dmg, 10% Flu', newAilment:'poison', ailChance:10},
      {lv:3, desc:'+40% dmg, 20% stun, 20% Flu', ailChance:20},
      {lv:4, desc:'+60% dmg, 30% stun, 30% Flu', ailChance:30},
    ]
  },
  hum:{
    id:'hum', name:'Hum', type:'utility', btnType:'utility',
    desc:'Channel hummingbird energy — evasion boost. Single buff: max 5t at lv4.',
    levels:[
      {lv:1, desc:'+15% dodge, −5% miss for 3 turns'},
      {lv:2, desc:'+20% dodge, −8% miss for 4 turns'},
      {lv:3, desc:'+25% dodge, −10% miss for 5 turns, cleanses 1 status'},
      {lv:4, desc:'+30% dodge, −12% miss for 5 turns, immune to fear'},
    ]
  },
  mudshot:{
    id:'mudshot', name:'Mud Shot', type:'ranged', btnType:'ranged',
    baseMissChance:20,
    levels:[
      {desc:'Fling mud at the enemy. 20% miss. Applies Mud: SPD −2 for 2t. Chance to cause Chicken Pox.',newAilment:'weaken'},
      {desc:'Stickier mud. 15% miss. SPD −3 for 3t. 30% Chicken Pox chance.',newAilment:'weaken'},
      {desc:'Heavy clay. 10% miss. SPD −4 for 3t. 40% Chicken Pox. Small Avian Poison chance.',newAilment:'weaken',newAilment2:'poison'},
      {desc:'Volcanic mud. 5% miss. SPD −5 for 4t. Guaranteed Chicken Pox. 30% Flu. 25% Paralysis.',newAilment:'weaken',newAilment2:'poison'},
    ],
  },
  bowedWing:{
    id:'bowedWing', name:'Bowed Wing', type:'ranged', btnType:'ranged',
    desc:'Shoot a stick with a bowed wing. Reliable ranger poke with slow pressure.',
    baseMissChance:14, baseDmgMult:0.95,
    levels:[
      {lv:1, desc:'95% dmg, 14% miss. Slow 15% for 2t.', newAilment:'slow', ailChance:100},
      {lv:2, desc:'110% dmg, 11% miss. Slow 20% for 3t.'},
      {lv:3, desc:'125% dmg, 9% miss. Slow 20% + Weaken 15%.', newAilment2:'weaken', ailChance2:15},
      {lv:4, desc:'140% dmg, 7% miss. Slow 25% + Weaken 20%.'},
    ]
  },
  curvedTalons:{
    id:'curvedTalons', name:'Curved Talons', type:'physical', btnType:'physical',
    desc:'High piercing slash for anti-tank duels.',
    baseMissChance:16, baseDmgMult:1.2, pierceDef:45,
    levels:[
      {lv:1, desc:'120% dmg, 16% miss. Pierce 45% DEF.'},
      {lv:2, desc:'132% dmg, 13% miss. Pierce 50% DEF.'},
      {lv:3, desc:'145% dmg, 11% miss. Pierce 55% DEF + Weaken 15%.', newAilment:'weaken', ailChance:15},
      {lv:4, desc:'160% dmg, 9% miss. Pierce 60% DEF + Bleed 20%.', newAilment2:'poison', ailChance2:20},
    ]
  },
  curvedBeak:{
    id:'curvedBeak', name:'Curved Beak', type:'physical', btnType:'physical',
    desc:'Hooked beak carve that inflicts bleed-like damage over time.',
    baseMissChance:12, baseDmgMult:1.05,
    levels:[
      {lv:1, desc:'105% dmg, 12% miss. Bleed 15%.', newAilment:'poison', ailChance:15},
      {lv:2, desc:'118% dmg, 10% miss. Bleed 20%.'},
      {lv:3, desc:'132% dmg, 8% miss. Bleed 25% + Fear 10%.', newAilment2:'feared', ailChance2:10},
      {lv:4, desc:'145% dmg, 6% miss. Bleed 30% + Fear 15%.'},
    ]
  },
  wingStorm:{
    id:'wingStorm', name:'Wing Storm', type:'spell', btnType:'spell',
    isNeutral:false, allowedClasses:['summoner'],
    energyByLevel:[2,2,2,3], cooldownByLevel:[3,3,4,4],
    desc:'Summoner gale magic. Control-oriented spell with modest damage and SPD gain.',
    levels:[
      {lv:1, desc:'85% M.ATK. 15% Stun. Gain +2 SPD for 2t.'},
      {lv:2, desc:'95% M.ATK. 20% Stun. Gain +3 SPD for 2t.'},
      {lv:3, desc:'110% M.ATK. 20% Stun. Gain +4 SPD for 2t + Slow 10%.', newAilment:'slow', ailChance:100},
      {lv:4, desc:'125% M.ATK. 25% Stun. Gain +5 SPD for 2t + Slow 15%.'},
    ]
  },

  wormRiot:{
    id:'wormRiot', name:'Worm Riot', type:'utility', btnType:'utility',
    desc:'Bait frenzy: enemy recovers HP but becomes exposed (Dodge/MDodge to 0).',
    cooldownByLevel:[4,4,3,3],
    levels:[
      {lv:1, desc:'Enemy heals 30%, but enemy Dodge/MDodge = 0% for 2t.'},
      {lv:2, desc:'Enemy heals 27%, Dodge/MDodge = 0% for 2t.'},
      {lv:3, desc:'Enemy heals 24%, Dodge/MDodge = 0% for 2t.'},
      {lv:4, desc:'Enemy heals 21%, Dodge/MDodge = 0% for 2t + Weaken 20%.', newAilment:'weaken', ailChance:20},
    ]
  },
  supersonic:{
    id:'supersonic', name:'Supersonic', type:'physical', btnType:'physical',
    desc:'Damage scales with SPD instead of ATK/MATK.',
    baseMissChance:12,
    levels:[
      {lv:1, desc:'SPD-scaled strike: ~90% speed ratio, 12% miss. 10% Confuse.', newAilment:'confused', ailChance:10},
      {lv:2, desc:'SPD-scaled strike: ~105% ratio, 10% miss. Confuse 15%.'},
      {lv:3, desc:'SPD-scaled strike: ~120% ratio, 8% miss. Confuse 20% + Burn 10%.', newAilment2:'burning', ailChance2:10},
      {lv:4, desc:'SPD-scaled strike: ~140% ratio, 6% miss. Confuse 25% + Burn 15%.'},
    ]
  },
  stickLance:{
    id:'stickLance', name:'Stick Lance', type:'ranged', btnType:'ranged',
    desc:'Two-turn combo: forage then strike. Must use TWICE in a row!',
    levels:[
      {lv:1, desc:'Turn 1: 70% find stick. Turn 2: 250% dmg, 50% crit, bypasses block — 50% miss'},
      {lv:2, desc:'Turn 1: 80% find. Turn 2: 270% dmg — 40% miss'},
      {lv:3, desc:'Turn 1: 90% find. Turn 2: 290% dmg — 30% miss + Paralysis 20%', newAilment:'paralyzed', ailChance:20},
      {lv:4, desc:'Turn 1: 95% find. Turn 2: 320% dmg — 20% miss + Paralysis 35%', ailChance:35},
    ]
  },
};

// UNIVERSAL: Sitting Duck
const ABILITY_SKIP_TURN = {
  id:'skipTurn', name:'Skip Turn', type:'utility', btnType:'utility', energyCost:0,
  desc:'Do absolutely nothing and preserve your dodge.',
  levels:[
    {lv:1, desc:'Skip your turn and preserve Dodge/MDodge.'},
    {lv:2, desc:'Skip your turn and preserve Dodge/MDodge.'},
    {lv:3, desc:'Skip your turn and preserve Dodge/MDodge.'},
    {lv:4, desc:'Skip your turn and preserve Dodge/MDodge.'},
  ]
};
const ABILITY_SITTING_DUCK = {
  id:'sittingDuck', name:'Sitting Duck', type:'utility', btnType:'utility',
  desc:'Do absolutely nothing. Drops ADodge and MDodge to 0% until your next turn.',
  levels:[
    {lv:1, desc:'Waste your turn. ADodge/MDodge drop to 0% this round.'},
    {lv:2, desc:'Waste your turn. ADodge/MDodge drop to 0% this round.'},
    {lv:3, desc:'Waste your turn. ADodge/MDodge drop to 0% this round.'},
    {lv:4, desc:'Waste your turn. ADodge/MDodge drop to 0% this round.'},
  ]
};
ABILITY_TEMPLATES['skipTurn'] = ABILITY_SKIP_TURN;
ABILITY_TEMPLATES['sittingDuck'] = ABILITY_SITTING_DUCK;

// 20 NEW LEARNABLE ABILITIES
const ABILITY_TEMPLATES_EXTRA = {
  // ---- STAT DEBUFFS ----
  featherRuffle:{
    id:'featherRuffle', name:'Feather Ruffle', type:'spell', btnType:'spell',
    desc:'Reduce enemy ATK. Lv1: 1 debuff (5t). Lv2+: adds ACC debuff (2 debuffs, max 3t).',
    levels:[
      {lv:1, desc:'Enemy ATK −15% for 5t'},
      {lv:2, desc:'Enemy ATK −20%, ACC −10% for 3t'},
      {lv:3, desc:'Enemy ATK −25%, ACC −15% for 3t'},
      {lv:4, desc:'Enemy ATK −30%, ACC −20% for 3t'},
    ]
  },
  wingClip:{
    id:'wingClip', name:'Wing Clip', type:'spell', btnType:'spell',
    desc:'Clip wings — SPD debuff for 5t (1 debuff). Lv2+ adds Dodge debuff (2 debuffs, max 3t).',
    levels:[
      {lv:1, desc:'Enemy SPD −2 for 5t'},
      {lv:2, desc:'Enemy SPD −3, Dodge −10% for 3t'},
      {lv:3, desc:'Enemy SPD −4, Dodge −15% for 3t'},
      {lv:4, desc:'Enemy SPD −5, Dodge −20% for 3t, Weaken 15%', newAilment:'weaken', ailChance:15},
    ]
  },
  eyeGouge:{
    id:'eyeGouge', name:'Eye Gouge', type:'physical', btnType:'physical',
    desc:'Peck at the eyes — reduce enemy ACC for 3 turns.',
    baseMissChance:15,
    levels:[
      {lv:1, desc:'50% dmg, 15% miss — enemy ACC −20% for 3t'},
      {lv:2, desc:'70% dmg, 12% miss — enemy ACC −28% for 3t'},
      {lv:3, desc:'90% dmg, 8% miss — enemy ACC −36% for 4t, Blind 2t'},
      {lv:4, desc:'110% dmg, 5% miss — enemy ACC −45% for 4t, Blind 3t'},
    ]
  },
  tailPull:{
    id:'tailPull', name:'Tail Pull', type:'utility', btnType:'utility',
    desc:'Remove 1 positive buff from enemy. Upgrades dispel more.',
    levels:[
      {lv:1, desc:'Remove 1 positive status/buff from enemy'},
      {lv:2, desc:'Remove 2 buffs, Weaken 30%', newAilment:'weaken', ailChance:30},
      {lv:3, desc:'Remove all ATK buffs + 2 other buffs, Weaken 40%', ailChance:40},
      {lv:4, desc:'Strip all enemy buffs, apply Weaken + Flu', ailChance:50},
    ]
  },
  molt:{
    id:'molt', name:'Molt', type:'utility', btnType:'utility',
    desc:'Shed feathers — cleanse 1 negative status, reduce enemy DEF.',
    levels:[
      {lv:1, desc:'Cleanse 1 negative status. Enemy DEF −2 for 3t'},
      {lv:2, desc:'Cleanse 2 statuses. Enemy DEF −3, also −10% ACC'},
      {lv:3, desc:'Cleanse all negative. Enemy DEF −4, ATK −15%'},
      {lv:4, desc:'Full cleanse + +10% dodge 3t. Enemy DEF −5, ATK −20%, ACC −15%'},
    ]
  },
  // ---- AILMENT FOCUSED ----
  plagueBlast:{
    id:'plagueBlast', name:'Plague Blast', type:'spell', btnType:'spell',
    desc:'Instantly infect with multiple Avian Poison stacks.',
    levels:[
      {lv:1, desc:'Apply 3 Poison stacks immediately'},
      {lv:2, desc:'Apply 4 Poison stacks + 1 extra per existing stack (max +3 bonus)'},
      {lv:3, desc:'Apply 5 Poison stacks, raises cap by 1'},
      {lv:4, desc:'Apply 6 Poison stacks, raises cap by 2, stack ticks deal +50% this turn'},
    ]
  },
  incendiaryFeathers:{
    id:'incendiaryFeathers', name:'Incendiary Feathers', type:'spell', btnType:'spell',
    desc:'Fling burning feathers — apply Burn + immediate fire damage.',
    levels:[
      {lv:1, desc:'Apply Burn 3t + 8 fire dmg now'},
      {lv:2, desc:'Apply Burn 3t + 12 fire dmg + Poison 1 stack', newAilment:'poison', ailChance:100},
      {lv:3, desc:'Apply Burn 4t + 18 fire dmg + Poison 2 stacks'},
      {lv:4, desc:'Apply Burn 4t + 25 fire dmg + Poison 3 stacks + Weaken 2t', newAilment2:'weaken', ailChance2:100},
    ]
  },
  toxicSpit:{
    id:'toxicSpit', name:'Toxic Spit', type:'physical', btnType:'physical',
    desc:'Venomous lunge — heavy poison application + bonus dmg per stack.',
    baseMissChance:20,
    levels:[
      {lv:1, desc:'60% dmg, 20% miss + apply 2 Poison stacks + 1 dmg per existing stack'},
      {lv:2, desc:'75% dmg, 15% miss + apply 3 Poison stacks + 1.5× per existing stack'},
      {lv:3, desc:'90% dmg, 10% miss + apply 4 Poison stacks + 2× per existing stack'},
      {lv:4, desc:'110% dmg, 6% miss + apply 5 Poison stacks + 3× per existing stack'},
    ]
  },
  // ---- PHYSICAL ATTACKS ----
  cannonball:{
    id:'cannonball', name:'Cannonball', type:'physical', btnType:'physical',
    desc:'Massive slam — 180% dmg, 35% miss. Player takes 8% recoil dmg.',
    baseMissChance:35, baseDmgMult:1.8,
    levels:[
      {lv:1, desc:'180% dmg, 35% miss — take 8% recoil'},
      {lv:2, desc:'200% dmg, 28% miss — take 5% recoil, Weaken 25%', newAilment:'weaken', ailChance:25},
      {lv:3, desc:'220% dmg, 22% miss — take 3% recoil, Weaken 35%', ailChance:35},
      {lv:4, desc:'250% dmg, 15% miss — no recoil, Weaken 45%, 20% stun'},
    ]
  },
  flurry:{
    id:'flurry', name:'Flurry', type:'physical', btnType:'physical',
    desc:'4-6 rapid strikes at 40% damage each, 25% miss per hit.',
    baseMissChance:25, baseDmgMult:0.4,
    levels:[
      {lv:1, desc:'4-6 hits, 40% dmg ea, 25% miss ea'},
      {lv:2, desc:'4-6 hits, 50% dmg ea, 20% miss — Poison 15%', newAilment:'poison', ailChance:15},
      {lv:3, desc:'5-7 hits, 55% dmg ea, 16% miss — Poison 25%', ailChance:25},
      {lv:4, desc:'5-7 hits, 65% dmg ea, 10% miss — Poison 35%, Burn 20%', ailChance:35, newAilment2:'burning', ailChance2:20},
    ]
  },
  retribution:{
    id:'retribution', name:'Retribution', type:'physical', btnType:'physical',
    desc:'130% dmg — GUARANTEED crit if enemy has any negative status.',
    baseMissChance:12,
    levels:[
      {lv:1, desc:'130% dmg, 12% miss — guaranteed crit if enemy has a negative status'},
      {lv:2, desc:'145% dmg, 9% miss — crit dmg ×2.2'},
      {lv:3, desc:'160% dmg, 6% miss — crit dmg ×2.4, Burn 20%', newAilment:'burning', ailChance:20},
      {lv:4, desc:'180% dmg, 3% miss — crit dmg ×2.8, Burn 35%', ailChance:35},
    ]
  },
  deathDive:{
    id:'deathDive', name:'Death Dive', type:'physical', btnType:'physical',
    desc:'200% dmg all-in plunge — 40% miss, 30% stun.',
    baseMissChance:40, baseDmgMult:2.0,
    levels:[
      {lv:1, desc:'200% dmg, 40% miss, 30% stun'},
      {lv:2, desc:'220% dmg, 33% miss, 35% stun — Paralysis 15%', newAilment:'paralyzed', ailChance:15},
      {lv:3, desc:'245% dmg, 26% miss, 40% stun, Paralysis 25%', ailChance:25},
      {lv:4, desc:'280% dmg, 18% miss, 50% stun, Paralysis 35%, Burn 20%', ailChance:35, newAilment2:'burning', ailChance2:20},
    ]
  },
  chargeUp:{
    cooldownByLevel:[3,3,2,2],
    id:'chargeUp', name:'Charge Up', type:'utility', btnType:'utility',
    desc:'Skip this turn to charge — next attack hits TWICE.',
    levels:[
      {lv:1, desc:'Next physical attack hits twice at full damage'},
      {lv:2, desc:'Next attack hits twice + 15% crit bonus'},
      {lv:3, desc:'Next attack hits twice + 25% crit + +10% ACC bonus'},
      {lv:4, desc:'Next attack hits twice + 35% crit + +20% ACC, second hit also ignores block'},
    ]
  },
  counter:{
    id:'counter', name:'Counter', type:'utility', btnType:'utility',
    desc:'Brace for 2 turns, then return double accumulated damage on turn 3.',
    cooldownByLevel:[6,6,5,5],
    levels:[
      {lv:1, desc:'No action for 2 turns, then deal 200% of stored damage on turn 3. CD 6t'},
      {lv:2, desc:'Return 220% stored damage. CD 6t'},
      {lv:3, desc:'Return 240% stored damage. CD 5t'},
      {lv:4, desc:'Return 260% stored damage and gain +10% dodge for 1t. CD 5t'},
    ]
  },
  parry:{
    id:'parry', name:'Parry', type:'utility', btnType:'utility',
    desc:'Brace for the next attack window; reflects only physical/ranged damage. 3-turn cooldown.',
    cooldownByLevel:[3,3,3,3],
    levels:[
      {lv:1, desc:'For 2 turns, vs physical/ranged only: take 50% damage, reflect 2x pre-parry damage. CD 3t'},
      {lv:2, desc:'For 2 turns: take 25% damage, reflect 2x pre-parry damage. CD 3t'},
      {lv:3, desc:'For 2 turns: take 0 damage, reflect 2x pre-parry damage. CD 3t'},
      {lv:4, desc:'For 2 turns: take 0 damage, reflect 3x pre-parry damage. CD 3t'},
    ]
  },
  dukeRiverGrip:{
    id:'dukeRiverGrip', name:'River Grip', type:'spell', btnType:'spell',
    desc:'Summon freezing current to damage and slow the enemy.',
    levels:[
      {lv:1, desc:'90% MATK damage. Slow 2 turns.'},
      {lv:2, desc:'110% MATK damage. Slow 2 turns, stronger penalties.'},
      {lv:3, desc:'125% MATK damage. Slow 3 turns.'},
      {lv:4, desc:'145% MATK damage. Slow 3 turns + Weaken 1 turn.'},
    ]
  },
  dukeDecree:{
    id:'dukeDecree', name:'Royal Decree', type:'spell', btnType:'spell',
    desc:'Apply pressure with royal decree and resonance.',
    levels:[
      {lv:1, desc:'Inflict Weaken 1 turn + Resonance 8 damage.'},
      {lv:2, desc:'Inflict Weaken 2 turns + Resonance 11 damage.'},
      {lv:3, desc:'Inflict Weaken 2 turns + Resonance 14 damage + Fear 1 turn.'},
      {lv:4, desc:'Inflict Weaken 3 turns + Resonance 18 damage + Fear 1 turn.'},
    ]
  },
  dukeWardens:{
    id:'dukeWardens', name:'Court Wardens', type:'utility', btnType:'utility',
    desc:'Raise owl wardens to harden your defenses and composure.',
    levels:[
      {lv:1, desc:'Gain Defending(1) and +2 DEF this turn.'},
      {lv:2, desc:'Gain Defending(1) and +3 DEF this turn.'},
      {lv:3, desc:'Gain Defending(1) and +4 DEF this turn. Cleanse 1 debuff.'},
      {lv:4, desc:'Gain Defending(2) and +5 DEF this turn. Cleanse 1 debuff.'},
    ]
  },
  // ---- SONGS ----
  warcry:{
    id:'warcry', name:'Warcry', type:'spell', btnType:'spell',
    desc:'Song: Raise ATK +15%, SPD +2 for 3 turns. Two buffs — max 3t at lv4.',
    levels:[
      {lv:1, desc:'ATK +15%, SPD +2 for 3t'},
      {lv:2, desc:'ATK +20%, SPD +3 for 3t'},
      {lv:3, desc:'ATK +25%, SPD +4 for 3t'},
      {lv:4, desc:'ATK +30%, SPD +5 for 3t, fear immune'},
    ]
  },
  battleHymn:{
    id:'battleHymn', name:'Battle Hymn', type:'spell', btnType:'spell',
    desc:'Song: DEF +2 for 5t (single buff). Lv2+ adds Dodge (2 buffs, max 3t).',
    levels:[
      {lv:1, desc:'DEF +2 for 5t'},
      {lv:2, desc:'DEF +4, Dodge +10% for 3t'},
      {lv:3, desc:'DEF +5, Dodge +15% for 3t'},
      {lv:4, desc:'DEF +7, Dodge +20% for 3t'},
    ]
  },
  reveille:{
    id:'reveille', name:'Reveille', type:'spell', btnType:'spell',
    desc:'Song: Regenerate 15% HP over 3 turns.',
    levels:[
      {lv:1, desc:'Regen 15% HP over 3 turns (5% per turn)'},
      {lv:2, desc:'Regen 21% HP over 3 turns + cleanse 1 status'},
      {lv:3, desc:'Regen 30% HP over 4 turns + cleanse 2 statuses'},
      {lv:4, desc:'Regen 40% HP over 4 turns + full cleanse + ATK +10%'},
    ]
  },
  victoryChant:{
    id:'victoryChant', name:'Victory Chant', type:'spell', btnType:'spell',
    desc:'Song: Restore 20% HP and reduce all cooldowns by 1.',
    levels:[
      {lv:1, desc:'Heal 20% HP + reduce all CDs by 1'},
      {lv:2, desc:'Heal 28% HP + reduce CDs by 1 + ATK +15% for 2t'},
      {lv:3, desc:'Heal 35% HP + reduce CDs by 2 + ATK +20% for 3t'},
      {lv:4, desc:'Heal 45% HP + clear all CDs + ATK +30% for 3t + cleanse 1 status'},
    ]
  },
  // ---- UTILITY ----
  preen:{
    id:'preen', name:'Preen', type:'utility', btnType:'utility',
    desc:'Remove negative statuses from self.',
    levels:[
      {lv:1, desc:'Remove 2 negative statuses. +5% dodge 2t'},
      {lv:2, desc:'Remove 3 negative statuses. +10% dodge 2t'},
      {lv:3, desc:'Remove all negative statuses. +15% dodge 3t'},
      {lv:4, desc:'Full cleanse. +20% dodge 3t. +10% ACC 3t. Cannot be interrupted'},
    ]
  },

  cactiSpine:{
    id:'cactiSpine', name:'Cacti Spine', type:'ranged', btnType:'ranged',
    desc:'Spine volley — ranged pierce that injects poison.',
    baseMissChance:12, baseDmgMult:0.8,
    levels:[
      {lv:1, desc:'80% dmg, 12% miss. 30% poison chance.', newAilment:'poison', ailChance:30},
      {lv:2, desc:'90% dmg, 10% miss. 40% poison, +10% ACC shred.', ailChance:40},
      {lv:3, desc:'100% dmg, 8% miss. 50% poison, +15% ACC shred.', ailChance:50},
      {lv:4, desc:'115% dmg, 6% miss. 60% poison, +20% ACC shred + Slow.', ailChance:60},
    ]
  },
  aerialPoop:{
    id:'aerialPoop', name:'Aerial Poop', type:'ranged', btnType:'ranged',
    desc:'Bombing run — 2 hits that debuff enemy accuracy.',
    baseMissChance:14, baseDmgMult:0.7,
    levels:[
      {lv:1, desc:'2 hits ×70% dmg. 14% miss each. ACC -10% for 2t.'},
      {lv:2, desc:'2 hits ×75% dmg. 12% miss. ACC -12% for 2t + Weaken 15%.', newAilment:'weaken', ailChance:15},
      {lv:3, desc:'2 hits ×80% dmg. 10% miss. ACC -15% for 3t + Weaken 20%.', ailChance:20},
      {lv:4, desc:'2 hits ×85% dmg. 8% miss. ACC -20% for 3t + Slow.', ailChance:25},
    ]
  },

  thornBarrage:{
    id:'thornBarrage', name:'Thorn Barrage', type:'ranged', btnType:'ranged',
    desc:'Rapid thorn volleys that pierce and stack Slow pressure.',
    baseMissChance:14, baseDmgMult:0.75,
    levels:[
      {lv:1, desc:'2 hits ×75% dmg, 14% miss each. Applies Slow (−2 SPD, −10% Dodge, 2t).'},
      {lv:2, desc:'2 hits ×82% dmg, 12% miss. Slow (−2 SPD, −12% Dodge, 2t).'},
      {lv:3, desc:'3 hits ×80% dmg, 10% miss. Slow (−3 SPD, −15% Dodge, 3t).'},
      {lv:4, desc:'3 hits ×88% dmg, 8% miss. Slow (−3 SPD, −20% Dodge, 3t) + poison 20%.', newAilment:'poison', ailChance:20},
    ]
  },
  shadowPounce:{
    id:'shadowPounce', name:'Shadow Pounce', type:'physical', btnType:'physical',
    desc:'Assassin leap strike with crit scaling and finisher bonus.',
    baseMissChance:10, baseDmgMult:1.15,
    levels:[
      {lv:1, desc:'115% dmg, 10% miss. +20% crit chance this hit.'},
      {lv:2, desc:'130% dmg, 9% miss. +25% crit chance and +10% vs <50% HP.'},
      {lv:3, desc:'145% dmg, 8% miss. +30% crit chance and +20% vs <50% HP.'},
      {lv:4, desc:'165% dmg, 7% miss. +35% crit chance and +30% vs <40% HP + fear 20%.', newAilment:'feared', ailChance:20},
    ]
  },
  bulwarkRoar:{
    id:'bulwarkRoar', name:'Bulwark Roar', type:'utility', btnType:'utility',
    desc:'Tank roar that hardens defenses while rattling enemy offense.',
    levels:[
      {lv:1, desc:'+6 DEF for 2t; enemy ATK −10% for 2t.'},
      {lv:2, desc:'+8 DEF for 2t; enemy ATK −15% for 2t; gain 10% dodge.'},
      {lv:3, desc:'+10 DEF for 3t; enemy ATK −20% for 3t.'},
      {lv:4, desc:'+12 DEF for 3t; enemy ATK −25% for 3t; fear immunity 2t.'},
    ]
  },
  astralRefrain:{
    id:'astralRefrain', name:'Astral Refrain', type:'spell', btnType:'spell',
    desc:'Mage/Bard pulse that damages and destabilizes enemy focus.',
    cooldownByLevel:[3,3,2,2],
    levels:[
      {lv:1, desc:'95% M.ATK dmg + ACC −10% for 2t.'},
      {lv:2, desc:'110% M.ATK dmg + ACC −12% for 2t + Weaken 15%.', newAilment:'weaken', ailChance:15},
      {lv:3, desc:'130% M.ATK dmg + ACC −15% for 3t + Confuse 20%.', newAilment2:'confused', ailChance2:20},
      {lv:4, desc:'150% M.ATK dmg + ACC −20% for 3t + Confuse 25% + Fear 20%.', ailChance2:25, newAilment3:'feared', ailChance3:20},
    ]
  },
  murderMurmuration:{
    id:'murderMurmuration', name:'Murder Murmuration', type:'spell', btnType:'spell',
    isNeutral:false, allowedClasses:['summoner'],
    energyByLevel:[2,2,3,3], cooldownByLevel:[5,5,4,4],
    desc:'Summoner flock surge. Multi-hit control spell, lower damage than direct nukes.',
    levels:[
      {lv:1, desc:'3 hits ×35% M.ATK. 10% Confuse chance.'},
      {lv:2, desc:'4 hits ×38% M.ATK. 15% Confuse chance + Fear 1t.'},
      {lv:3, desc:'4 hits ×42% M.ATK. 20% Confuse chance + Fear 1t.'},
      {lv:4, desc:'5 hits ×44% M.ATK. 25% Confuse chance + Fear 2t + ATK −10% 2t.'},
    ]
  },

  taunt:{
    id:'taunt', name:'Taunt', type:'utility', btnType:'utility',
    desc:'Force enemy to attack you next turn at −25% ACC.',
    levels:[
      {lv:1, desc:'Enemy must attack next turn at −25% ACC'},
      {lv:2, desc:'Enemy attacks at −35% ACC, player gets +15% dodge that turn'},
      {lv:3, desc:'Enemy attacks at −45% ACC, player +20% dodge, enemy attack misses → player gains ATK +20% for 1t'},
      {lv:4, desc:'Enemy −55% ACC, player +25% dodge, perfect dodge chains for 50% stun on enemy'},
    ]
  },
};
Object.assign(ABILITY_TEMPLATES, ABILITY_TEMPLATES_EXTRA);

// ============================================================
//  MAGIC ABILITIES (from CSV) — for songbird/corvid builds
// ============================================================
const ABILITY_TEMPLATES_MAGIC = {
  birdBrain:{
    cooldownByLevel:[3,4,3,4],
    id:'birdBrain', name:'Bird Brain', type:'spell', btnType:'spell',
    desc:'Psychic overload — 80% M.ATK psychic damage + Confuse.',
    levels:[
      {lv:1, desc:'80% M.ATK dmg + Confuse 3t (15% fumble)'},
      {lv:2, desc:'100% M.ATK dmg + Confuse 4t (20% fumble)'},
      {lv:3, desc:'120% M.ATK dmg + Confuse (20%), Brain Fog: SPD/ACC −10% for 2t'},
      {lv:4, desc:'145% M.ATK dmg + Confuse (25%), Brain Fog: SPD/ACC −15% for 3t'},
    ]
  },
  sonicDirge:{
    cooldownByLevel:[3,4,5,6],
    id:'sonicDirge', name:'Sonic Dirge', type:'spell', btnType:'spell',
    desc:'Piercing wail — 90% M.ATK sonic damage. Chance to skip enemy turn.',
    levels:[
      {lv:1, desc:'90% M.ATK dmg + 15% chance to skip enemy next turn (3t)'},
      {lv:2, desc:'110% M.ATK + DoT 10% over 2t. 20% skip (4t)'},
      {lv:3, desc:'130% M.ATK, ignores 30% M.DEF. 20% skip (4t)'},
      {lv:4, desc:'155% M.ATK, ignores 30% M.DEF, chain heals you for 20% max HP. 25% skip (5t)'},
    ]
  },
  owlPsyche:{
    cooldownByLevel:[4,5,6,7],
    id:'owlPsyche', name:"Owl's Psyche", type:'spell', btnType:'spell',
    desc:'Hypnotic hoot — 70% M.ATK + Paralyze. Lv3+ adds Fear.',
    levels:[
      {lv:1, desc:'70% M.ATK dmg + Paralyze 15% skip 3t'},
      {lv:2, desc:'90% M.ATK + Paralyze 20% skip 4t'},
      {lv:3, desc:'110% M.ATK + Paralyze (20%) + Fear (10% miss) both 2t'},
      {lv:4, desc:'130% M.ATK + Paralyze (25%) + Fear (15% miss) both 3t. Permanent M.DEF pierce.'},
    ]
  },
  shriekwave:{
    id:'shriekwave', name:'Shriekwave', type:'spell', btnType:'spell',
    desc:'Explosive song blast — 100% M.ATK + Burn DoT.',
    levels:[
      {lv:1, desc:'100% M.ATK + Burn 3t (15% DoT)'},
      {lv:2, desc:'120% M.ATK + Burn 4t (20%)'},
      {lv:3, desc:'140% M.ATK + Burn 4t (20%). Guaranteed crit vs Burned foes.'},
      {lv:4, desc:'165% M.ATK + Burn 5t (25%). Crit vs Burned. +Poison 15%.'},
    ]
  },
  mobSwarm:{
    id:'mobSwarm', name:'Mob Swarm', type:'spell', btnType:'spell',
    isNeutral:false, allowedClasses:['summoner'],
    energyByLevel:[2,3,3,3], cooldownByLevel:[5,5,4,4],
    desc:'Call a chaotic flock to harass the enemy. Persistent pressure, not burst abuse.',
    levels:[
      {lv:1, desc:'Flock: 3 hits at 32% M.ATK each. 10% Confuse 2t.'},
      {lv:2, desc:'4 hits at 36% M.ATK. Confuse 15% 3t.'},
      {lv:3, desc:'4 hits at 40% M.ATK + Fear 10% miss 2t.'},
      {lv:4, desc:'5 hits at 42% M.ATK. Fear 15% 2t + Confuse 20% 2t.'},
    ]
  },

};
Object.assign(ABILITY_TEMPLATES, ABILITY_TEMPLATES_MAGIC);

// Merge learnable templates into main lookup
Object.assign(ABILITY_TEMPLATES, ABILITY_TEMPLATES_LEARNABLE);

function enforceAbilityBalanceSpec(){
  const HARD_CC=new Set(['paralyzed','stunned','confused']);
  const MAJOR_AIL=new Set(['paralyzed','confused','burning','poison','weaken','delayed','feared','slow','mud']);
  for(const tmpl of Object.values(ABILITY_TEMPLATES)){
    if(!tmpl||!Array.isArray(tmpl.levels)) continue;
    if(!tmpl.balanceSpec){
      tmpl.balanceSpec={primary:tmpl.type||'utility',secondary:[],ailment:null,subaction:null};
    }
    const baseAilCount=Math.max(0,[tmpl.levels[0]?.newAilment,tmpl.levels[0]?.newAilment2,tmpl.levels[0]?.newAilment3].filter(Boolean).length);
    tmpl.levels.forEach((lv,idx)=>{
      if(!lv||typeof lv!=='object') return;
      delete lv.raisePoisonCap; // remove infinite cap growth loops
      const ails=[lv.newAilment,lv.newAilment2,lv.newAilment3].filter(Boolean);
      const maxAllowed=baseAilCount + (idx>=3?1:0);
      let kept=[];
      let hardUsed=false;
      for(const a of ails){
        if(kept.length>=maxAllowed) break;
        if(HARD_CC.has(a)){
          if(hardUsed) continue;
          hardUsed=true;
        }
        if(MAJOR_AIL.has(a)||kept.length===0) kept.push(a);
      }
      lv.newAilment=kept[0];
      lv.newAilment2=kept[1];
      delete lv.newAilment3;
      if(lv.newAilment==='paralyzed') lv.ailChance=Math.min(35, Math.max(0, lv.ailChance||0));
      if(lv.newAilment2==='paralyzed') lv.ailChance2=Math.min(35, Math.max(0, lv.ailChance2||0));
    });
  }
}
enforceAbilityBalanceSpec();

const DEFAULT_ABILITY_FIELDS = {
  energyCost: 1,
  skillType: 'attack',
  role: [],
};

function normalizeAbilityEnergy(ability){
  if(!ability||typeof ability!=='object') return ability;
  if(ability.energyCost==null){
    ability.energyCost = Number.isFinite(ability.cost) ? ability.cost : DEFAULT_ABILITY_FIELDS.energyCost;
  }
  if(!ability.skillType){
    ability.skillType = DEFAULT_ABILITY_FIELDS.skillType;
  }
  if(!Array.isArray(ability.role)){
    ability.role = Array.isArray(DEFAULT_ABILITY_FIELDS.role) ? [...DEFAULT_ABILITY_FIELDS.role] : [];
  }
  if('cost' in ability) delete ability.cost;
  return ability;
}

function normalizeAllAbilityEnergy(){
  for(const tmpl of Object.values(ABILITY_TEMPLATES)) normalizeAbilityEnergy(tmpl);
}


const ABILITY_ENERGY_PATCH = {
  mainAttack:{energyCost:1,skillType:'attack',role:['basic']},
  swoop:{energyCost:2,skillType:'attack',role:['burst']},
  diveBomb:{energyCost:2,skillType:'attack',role:['burst']},
  cannonball:{energyCost:2,skillType:'attack',role:['burst']},
  flurry:{energyCost:2,skillType:'attack',role:['multiHit']},
  retribution:{energyCost:2,skillType:'attack',role:['counter']},
  deathDive:{energyCost:3,skillType:'attack',role:['finisher']},
  eyeGouge:{energyCost:1,skillType:'attack',role:['debuff']},
  supersonic:{energyCost:2,skillType:'attack',role:['speed']},
  curvedTalons:{energyCost:2,skillType:'attack',role:['pierce']},
  curvedBeak:{energyCost:2,skillType:'attack',role:['pierce']},
  toxicSpit:{energyCost:1,skillType:'attack',role:['poison']},
  plagueBlast:{energyCost:2,skillType:'attack',role:['dot']},
  incendiaryFeathers:{energyCost:2,skillType:'attack',role:['burn']},
  counter:{energyCost:1,skillType:'utility',role:['reactive']},
  parry:{energyCost:1,skillType:'utility',role:['defense']},
  chargeUp:{energyCost:1,skillType:'utility',role:['setup']},
  rockDrop:{energyCost:2,skillType:'attack',role:['setupBurst']},
  stickLance:{energyCost:1,skillType:'attack',role:['poke']},
  mudshot:{energyCost:1,skillType:'attack',role:['slow']},
  cactiSpine:{energyCost:1,skillType:'attack',role:['chip']},
  aerialPoop:{energyCost:1,skillType:'attack',role:['debuff']},
  thornBarrage:{energyCost:2,skillType:'attack',role:['multiHit']},
  bowedWing:{energyCost:1,skillType:'attack',role:['poke']},
  hum:{energyCost:1,skillType:'buff',role:[]},
  flyby:{energyCost:2,skillType:'buff',role:['setup']},
  guardianCry:{energyCost:2,skillType:'utility',role:['defense']},
  bulwarkRoar:{energyCost:2,skillType:'utility',role:['tank']},
  warcry:{energyCost:1,skillType:'buff',role:[]},
  battleHymn:{energyCost:2,skillType:'buff',role:[]},
  reveille:{energyCost:2,skillType:'utility',role:['cleanse']},
  victoryChant:{energyCost:2,skillType:'buff',role:[]},
  preen:{energyCost:2,skillType:'utility',role:['heal']},
  molt:{energyCost:2,skillType:'utility',role:['cleanse']},
  featherRuffle:{energyCost:1,skillType:'debuff',role:[]},
  wingClip:{energyCost:1,skillType:'debuff',role:[]},
  tailPull:{energyCost:1,skillType:'debuff',role:[]},
  taunt:{energyCost:1,skillType:'utility',role:['control']},
  dustDevil:{energyCost:2,skillType:'debuff',role:[]},
  spellLance:{energyCost:2,skillType:'spell',role:[]},
  shriekwave:{energyCost:2,skillType:'spell',role:[]},
  birdBrain:{energyCost:2,skillType:'spell',role:['control']},
  sonicDirge:{energyCost:3,skillType:'spell',role:['hardControl']},
  owlPsyche:{energyCost:3,skillType:'spell',role:['hardControl']},
  mobSwarm:{energyCost:3,skillType:'spell',role:['multiHit']},
  wingStorm:{energyCost:3,skillType:'spell',role:[]},
  murderMurmuration:{energyCost:3,skillType:'spell',role:[]},
  astralRefrain:{energyCost:2,skillType:'spell',role:['utility']},
};
Object.entries(ABILITY_ENERGY_PATCH).forEach(([id, patch])=>{
  if(ABILITY_TEMPLATES[id]) Object.assign(ABILITY_TEMPLATES[id], patch);
});

const ENERGY_BY_LEVEL_PATCH={
  rapidPeck:[2,2,2,3], dart:[2,2,3,3], evade:[1,1,2,2], blackPeck:[1,1,1,1],
  dirge:[3,3,3,3], lullaby:[2,2,2,3], crowStrike:[1,1,1,1], talonRake:[1,1,1,2],
  beakSlam:[3,3,3,3], crowDefend:[1,1,2,2], mudLash:[1,1,1,2], serpentCrusher:[3,3,3,3],
  shoebillClamp:[2,2,3,3], fleshRipper:[1,1,1,1], serratedSlash:[1,1,1,1], diveGouge:[3,3,3,3],
  fishSnatcher:[1,1,1,2], honkAttack:[3,3,3,3], gooseHonk:[3,3,3,3], penguinHonk:[3,3,3,3],
  headWhip:[2,2,2,3], intimidate:[1,1,2,2], probeStrike:[2,2,2,2], bashUp:[2,2,2,3],
  sitAndWait:[1,1,1,1], breakClamp:[2,2,3,3], serratedBill:[1,1,1,2], silentPierce:[2,2,2,3],
theJoker:[2,2,3,3], tookieTookie:[2,2,2,3], fruitSweetener:[1,1,2,2],
  nectarJab:[2,3,3,3], swoop:[1,1,1,1], diveBomb:[2,2,3,3], shadowFeint:[1,1,1,2],
  flyby:[1,1,2,2], dustDevil:[1,1,2,2], rockDrop:[2,2,3,3], mudshot:[2,2,3,3], hum:[1,1,2,2],
  bowedWing:[1,1,2,2], spellLance:[2,2,2,3], guardianCry:[2,2,2,2], wormRiot:[1,1,2,2],
  curvedTalons:[3,3,3,3], curvedBeak:[2,2,3,3], wingStorm:[2,2,2,3], supersonic:[2,2,3,3],
  stickLance:[1,1,2,2]
};
Object.entries(ENERGY_BY_LEVEL_PATCH).forEach(([id,arr])=>{
  if(ABILITY_TEMPLATES[id]) ABILITY_TEMPLATES[id].energyByLevel=[...arr];
  if(typeof ABILITY_TEMPLATES_EXTRA!=='undefined'&&ABILITY_TEMPLATES_EXTRA[id]) ABILITY_TEMPLATES_EXTRA[id].energyByLevel=[...arr];
});

normalizeAllAbilityEnergy();

const ABILITY_TYPES = new Set(['attack','spell','song','utility']);
const ABILITY_RARITIES = new Set(['common','rare','epic','legendary']);

function normalizeAbilityTemplates(){
  for(const [id,t] of Object.entries(ABILITY_TEMPLATES||{})){
    if(!t) continue;
    const rawType=String(t.type||t.btnType||'').toLowerCase();
    const mapped=(rawType==='physical'||rawType==='ranged')?'attack':rawType;
    const fallback=(String(t.btnType||'').toLowerCase()==='spell')?'spell':(String(t.btnType||'').toLowerCase()==='utility'?'utility':'attack');
    t.codexType = ABILITY_TYPES.has(mapped) ? mapped : fallback;

    if(!t.rarity) t.rarity='common';
    t.rarity=String(t.rarity).toLowerCase();
    if(!ABILITY_RARITIES.has(t.rarity)) t.rarity='common';

    if(!Array.isArray(t.tags)) t.tags=[];
    if(t.codexType==='spell' && !t.tags.includes('magic')) t.tags.push('magic');
    if(t.codexType==='song' && !t.tags.includes('support')) t.tags.push('support');
    if(!t.shortDesc) t.shortDesc=t.desc||'No description yet.';
  }
}
normalizeAbilityTemplates();

Object.values(ABILITY_TEMPLATES).forEach(t=>{
  if(!t) return;
  if(!t.description) t.description=t.desc||`${t.name} ability.`;
  if(!t.effect) t.effect=(t.levels&&t.levels[0]&&t.levels[0].desc)?t.levels[0].desc:'Use this ability to gain an advantage.';
});

// Ensure every ability has a baseline miss rate for accuracy rebuild tuning.
Object.values(ABILITY_TEMPLATES).forEach(t=>{ if(t.baseMissChance===undefined) t.baseMissChance=15; });

// Ability pools by category for class filtering
const ABILITY_POOL_PHYSICAL = [
  'swoop','diveBomb',
  'eyeGouge','cannonball','flurry','retribution','deathDive','chargeUp','counter','parry','shadowFeint','shadowPounce',
  'plagueBlast','incendiaryFeathers','toxicSpit','curvedTalons','curvedBeak','supersonic',
];
const ABILITY_POOL_RANGED = [
  'rockDrop','stickLance','mudshot','cactiSpine','aerialPoop','thornBarrage','bowedWing',
];

const ABILITY_POOL_BUFF = [
  'hum','flyby','guardianCry','bulwarkRoar',
  'warcry','battleHymn','reveille','victoryChant',
  'preen','molt',
];
const ABILITY_POOL_DEBUFF = [
  'featherRuffle','wingClip','tailPull','taunt',
];
const ABILITY_POOL_MAGIC = [
  'birdBrain','sonicDirge','owlPsyche','shriekwave','mobSwarm','spellLance','astralRefrain','murderMurmuration','wingStorm',
];
const ABILITY_POOL_UTILITY = Object.values(ABILITY_TEMPLATES)
  .filter(t=>t&&(t.btnType||t.type)==='utility')
  .map(t=>t.id);
// Default: all pools
const LEARNABLE_ABILITIES = [
  ...ABILITY_POOL_PHYSICAL, ...ABILITY_POOL_RANGED, ...ABILITY_POOL_BUFF, ...ABILITY_POOL_DEBUFF, ...ABILITY_POOL_MAGIC
];
LEARNABLE_ABILITIES.push(
  'bleakBeak','shadowJab',
  'pinionVolley','talonRake',
  'shieldWing','ironHonk',
  'dirgeOfDread','skyHymn',
  'marshHex','stormCall','nightChill'
);


function removeMimicEverywhere(){
  const GG = globalThis.G;
  if(typeof ABILITY_TEMPLATES!=='undefined') delete ABILITY_TEMPLATES.mimic;
  if('ACTIONS' in globalThis && globalThis.ACTIONS) delete globalThis.ACTIONS.mimic;
  if(typeof LEARNABLE_ABILITIES!=='undefined'&&Array.isArray(LEARNABLE_ABILITIES)){
    for(let i=LEARNABLE_ABILITIES.length-1;i>=0;i--){ if(LEARNABLE_ABILITIES[i]==='mimic') LEARNABLE_ABILITIES.splice(i,1); }
  }
  if(GG?.player?.abilities) GG.player.abilities=GG.player.abilities.filter(a=>a.id!=='mimic');
  if(typeof BIRDS!=='undefined') Object.values(BIRDS).forEach(b=>{ if(Array.isArray(b.extraAbilities)) b.extraAbilities=b.extraAbilities.filter(id=>id!=='mimic'); });
}


function removeMimicEverywhere(){
  const GG = globalThis.G;
  if(typeof ABILITY_TEMPLATES!=='undefined') delete ABILITY_TEMPLATES.mimic;
  if('ACTIONS' in globalThis && globalThis.ACTIONS) delete globalThis.ACTIONS.mimic;
  if(typeof LEARNABLE_ABILITIES!=='undefined'&&Array.isArray(LEARNABLE_ABILITIES)){
    for(let i=LEARNABLE_ABILITIES.length-1;i>=0;i--){ if(LEARNABLE_ABILITIES[i]==='mimic') LEARNABLE_ABILITIES.splice(i,1); }
  }
  if(GG?.player?.abilities) GG.player.abilities=GG.player.abilities.filter(a=>a.id!=='mimic');
  if(typeof BIRDS!=='undefined') Object.values(BIRDS).forEach(b=>{ if(Array.isArray(b.extraAbilities)) b.extraAbilities=b.extraAbilities.filter(id=>id!=='mimic'); });
}

const MAGIC_CLASSES = new Set(['mage','bard','summoner']);
// removeMimicEverywhere(); // moved to after G init
const ABILITY_MAIN_ATTACK = {
  id:'mainAttack',
  name:'Main Attack',
  type:'physical',
  btnType:'physical',
  desc:'Reliable strike. For magic birds this is Peck (always 20% miss).',
  levels:[{lv:1,desc:'100% ATK damage. Magic birds use Peck (20% fixed miss chance).'}],
};
ABILITY_TEMPLATES.mainAttack = ABILITY_MAIN_ATTACK;

// Unlock system
const UNLOCK_KEY = 'avianAscent_unlocks_v1';

// ============================================================
//  DIFFICULTY SYSTEM
// ============================================================
const DIFFICULTIES = {
  fletchling:{ id:'fletchling', label:'Fletchling', emoji:'🥚', mult:0.80, color:'#6ab89a', desc:'Early training difficulty. Enemies are forgiving.' },
  juvenile:  { id:'juvenile',   label:'Juvenile',   emoji:'🕊️', mult:1.00, color:'#e8c96a', desc:'Intended baseline experience. Balanced combat.' },
  predator:  { id:'predator',   label:'Predator',   emoji:'🦅', mult:1.20, color:'#e87070', desc:'Enemies hit harder and smarter.' },
  murder:    { id:'murder',     label:'Murder',     emoji:'‍⬛', mult:1.40, color:'#c040e0', desc:'Extreme scaling with enraged boss pressure.', unlockRequires:'predatorWin' },
};
function getUnlocks() {
  try { return JSON.parse(localStorage.getItem(UNLOCK_KEY)||'{}'); } catch(e){ return {}; }
}
function grantUnlock(id) {
  const u=getUnlocks(); u[id]=true; localStorage.setItem(UNLOCK_KEY,JSON.stringify(u));
}
function isUnlocked(id) { return !!getUnlocks()[id]; }


// ============================================================
//  UNLOCK PROGRESSION (Stage 10/20 + special endless)
// ============================================================
const STAGE_CLEAR_UNLOCKS = {
  10: {
    sparrow: 'hummingbird',
    goose: 'shoebill',
    crow: 'secretary',
    robin: 'magpie',
    macaw: 'kookaburra',
  },
  20: {
    hummingbird: 'harpy',
    shoebill: 'ostrich',
    secretary: 'peregrine',
    magpie: '',
    kookaburra: 'lyrebird',
  }
};

const SPECIAL_UNLOCKS = [
  { id:'unlock_penguin', test:()=> G.endlessMode && (G.endlessBattle||0) >= 30 && (BIRDS[G.player?.birdKey]?.class==='tank'), bird:'penguin', label:'Emperor Penguin' },
  { id:'unlock_emu', test:()=> G.endlessMode && (G.endlessBattle||0) >= 40 && (BIRDS[G.player?.birdKey]?.class==='tank'), bird:'emu', label:'Emu' },
  { id:'unlock_swan', test:()=> G.endlessMode && (G.endlessBattle||0) >= 30 && (BIRDS[G.player?.birdKey]?.class==='bard'), bird:'swan', label:'Swan' },
  { id:'unlock_flamingo', test:()=> G.endlessMode && (G.endlessBattle||0) >= 30 && (BIRDS[G.player?.birdKey]?.class==='ranger'), bird:'flamingo', label:'Flamingo' },
  { id:'unlock_seagull', test:()=> G.endlessMode && (G.player?.birdLevel||1) >= 21 && (BIRDS[G.player?.birdKey]?.class==='mage'), bird:'seagull', label:'Seagull' },
  { id:'unlock_albatross', test:()=> G.endlessMode && (G.endlessBattle||0) >= 50, bird:'albatross', label:'Albatross' },
];

function queueUnlockBanner(birdKey, titleText){
  if(!G._unlockPopups) G._unlockPopups=[];
  G._unlockPopups.push({birdKey,titleText});
}

function handleBossClearUnlocks(){
  if(!G.enemy||!G.enemy.isBoss||!G.player) return;
  const stage=G.stage;
  const birdKey=G.player.birdKey;
  const map=STAGE_CLEAR_UNLOCKS[stage];
  if(map&&map[birdKey]){
    const unlockBirdKey=map[birdKey];
    const unlockId=`unlock_${unlockBirdKey}`;
    if(!isUnlocked(unlockId)){
      grantUnlock(unlockId);
      queueUnlockBanner(unlockBirdKey,`Congratulations on defeating Stage ${stage}!`);
    }
  }
  SPECIAL_UNLOCKS.forEach(u=>{
    if(u.test&&u.test()&&!isUnlocked(u.id)){
      grantUnlock(u.id);
      const birdUnlockId=`unlock_${u.bird}`;
      if(!isUnlocked(birdUnlockId)) grantUnlock(birdUnlockId);
      queueUnlockBanner(u.bird,'Endless milestone reached!');
    }
  });
}

function renderUnlockPopupsOnGameover(){
  const wrap=document.getElementById('run-unlocks');
  if(!wrap) return;
  wrap.innerHTML='';
  const pops=G._unlockPopups||[];
  if(!pops.length) return;
  pops.forEach(p=>{
    const b=BIRDS[p.birdKey];
    if(!b) return;
    const portrait=(b.portraitKey&&PORTRAITS[b.portraitKey])?PORTRAITS[b.portraitKey]:'';
    const div=document.createElement('div');
    div.className='unlock-popup';
    div.innerHTML=`<div class="unlock-title">${p.titleText} You have unlocked "<strong>${b.name}</strong>".</div><div class="unlock-card"><div class="bird-portrait" style="width:56px;height:56px;">${portrait}</div><div class="unlock-statline">HP ${b.stats.maxHp} · ATK ${b.stats.atk} · DEF ${b.stats.def} · SPD ${b.stats.spd}</div></div>`;
    wrap.appendChild(div);
  });
  G._unlockPopups=[];
}

// ============================================================
// SECRET CODE UNLOCK — Toucan
// ============================================================
const TOUCAN_CODE = 'ahh ahh eee eee tookie tookie';
let _secretBuffer = '';
function checkSecretUnlockChar(ch){
  _secretBuffer += String(ch).toLowerCase();
  if(_secretBuffer.length>80) _secretBuffer=_secretBuffer.slice(-80);
  if(_secretBuffer.includes(TOUCAN_CODE)){
    const unlockId='unlock_toucan';
    if(!isUnlocked(unlockId)){
      grantUnlock(unlockId);
      queueUnlockBanner('toucan','Secret Code Entered!');
      logMsg('🦜 Secret unlocked: Toucan!','system');
    }
    _secretBuffer='';
  }
}

// ============================================================
//  EXP SYSTEM
// ============================================================
function expForLevel(lv) {
  if(lv<=15) return Math.floor(80 * Math.pow(1.38, lv - 1));
  if(lv<=25) return Math.floor(80 * Math.pow(1.38, 14) * Math.pow(1.18, lv - 15));
  return Math.floor(80 * Math.pow(1.38, 14) * Math.pow(1.18, 10) * Math.pow(1.08, lv - 25));
}

// ============================================================
//  TURN STATE / SAFETY LIMITS
// ============================================================
const TURN={PLAYER:'PLAYER',ENEMY:'ENEMY',RESOLVING:'RESOLVING'};

// ===== Growth Stage Constants =====
const GROWTH = {
  FLETCHLING:'fletchling',
  JUVENILE:'juvenile',
  ADULT:'adult',
  APEX:'apex',
};

function getGrowthStageForLevel(lv){
  if(lv>=21) return GROWTH.APEX;
  if(lv>=15) return GROWTH.ADULT;
  if(lv>=7) return GROWTH.JUVENILE;
  return GROWTH.FLETCHLING;
}
const MAX_PLAYER_ACTIONS_PER_TURN=6;
const MAX_ENEMY_ACTIONS_PER_TURN=6;
const MAX_ENERGY_GAIN_PER_TURN=2;

// ============================================================
//  ENERGY (RECOMMENDED) — StS full refill (size + class)
// ============================================================
const ENERGY_BY_SIZE = { tiny:4, small:4, medium:4, large:3, xl:3 };
const ENERGY_DELTA_BY_CLASS = {
  assassin:1, bard:1, tank:-1,
  ranger:1, knight:0, mage:0, summoner:0, rogue:1, bruiser:0,
};
const MIN_MAX_ENERGY = 2;
const MAX_MAX_ENERGY_NORMAL = 5;
const MAX_MAX_ENERGY_HARD = 6;

function getClassEnergyGrowthBonus(player){
  const bd=BIRDS[player?.birdKey]||{};
  const cls=String(player?.class||bd.class||'knight').toLowerCase();
  const lv=player?.birdLevel||1;

  // Harder rhythm differences by class as runs go longer
  if((cls==='assassin' || cls==='ranger' || cls==='rogue') && lv>=10) return 1;
  if((cls==='bard' || cls==='mage') && lv>=12) return 1;
  if(cls==='summoner' && lv>=14) return 1;
  if((cls==='tank' || cls==='knight' || cls==='bruiser') && lv>=16) return 1;
  return 0;
}

function computePlayerMaxEnergy(){
  const bd=BIRDS[G.player?.birdKey]||{};
  const size=(G.player?.size||bd.size||'medium').toLowerCase();
  const cls=(bd.class||'knight').toLowerCase();
  const base=ENERGY_BY_SIZE[size] ?? 4;
  const delta=ENERGY_DELTA_BY_CLASS[cls] ?? 0;
  const growth=getClassEnergyGrowthBonus(G.player);
  const bonus=G.player?.energyBonus || 0;
  const cap=(bonus>0)?MAX_MAX_ENERGY_HARD:MAX_MAX_ENERGY_NORMAL;
  return Math.max(MIN_MAX_ENERGY, Math.min(cap, base+delta+growth+bonus));
}

// ============================================================
//  GAME STATE
// ============================================================
const AVIAN_EVENT_BUS = (()=>{
  const listeners = new Map();
  return {
    on(evt, fn){
      if(!evt || typeof fn!=='function') return ()=>{};
      if(!listeners.has(evt)) listeners.set(evt, new Set());
      listeners.get(evt).add(fn);
      return ()=>listeners.get(evt)?.delete(fn);
    },
    emit(evt, payload={}){
      const set = listeners.get(evt);
      if(!set || !set.size) return;
      for(const fn of [...set]){ try{ fn(payload); }catch(err){ console.error(err); } }
    }
  };
})();
globalThis.AvianEvents = AVIAN_EVENT_BUS;

const GAME_MODULES = [];
function registerGameModule(mod){
  if(!mod || !mod.id || GAME_MODULES.some(m=>m.id===mod.id)) return;
  GAME_MODULES.push(mod);
}
function runModuleHook(hook, payload){
  for(const mod of GAME_MODULES){
    const fn = mod && mod[hook];
    if(typeof fn==='function'){
      try{ fn(payload); }catch(err){ console.error(err); }
    }
  }
}
globalThis.registerGameModule = registerGameModule;

let G = {
  player: null, enemy: null, stage: 1, turn: 'player', turnPhase:TURN.PLAYER,
  playerStatus:{}, enemyStatus:{},
  crowDefendCooldown:0, blackbirdAttackCount:0,
  enemyNextAction:null, animLock:false, battleOver:false,
  pendingLevelUp:false,
  bossDoublingRoundsLeft:0,
  endlessMode:false, endlessBattle:0,
  bossKills:0,
  // per-battle ability state
  swoopCooldown:0, intimidateCooldown:0, fruitCooldown:0,
  stickLanceStage:0, flybyCharged:false, flybyUsed:false,
  rockDropPending:false, humTurns:0, humMissBonus:0,
  chargeUpActive:false,
  warcryActive:false, warcryATK:0,
  battleHymnActive:false, battleHymnDEF:0, battleHymnACC:0,
  serratedStacks:0,
  sitAndWaitActive:false,
  sitAndWaitUsedThisTurn:false,
  tookieActive:false, tookieMiss:0,
  tauntActive:false,
  regenTurns:0, regenPct:0,
  activeDodgeBuffs:{}, activeAccBuffs:{},
  _roostData:null,
  _pendingReward:null, _pendingLevelUp:false,
  // Combo system
  comboCount:0,  // consecutive hits without missing
  comboReady:false, // 5 hits = free crit stored
  // Enemy rage tracking
  enemyRageActive:false,
  enemyTurnCount:0,
  playerActionsThisTurn:0, enemyActionsThisTurn:0,
  playerTurnFlags:{energyGainedThisTurn:0,onHitTriggered:false},
  enemyUsedHardCCLastTurn:false,
  // Collected rewards list (for Nest display)
  collectedRewards:[],
  _goldReplaceMode:false,
  // Run unlock tracking
  runCrits:0, runBuffs:0, runDebuffs:0,
  runUpgradesPurchased:new Set(),
  codex:{abilities:{},enemies:{},birds:{},artifacts:{},statuses:{}},
  // Economy
  shinyObjects:0,
  _pendingStorkShop:false,
  _pendingShopMode:null,
  autoQueuedAbilityId:null,
  abilityCooldowns:{},
  _actionTapLockUntil:0,
  _unlockPopups:[],
  phase:'PLAYER',
  actionQueue:[],
  actionBusy:false,
  speed:1,
};

const TELEMETRY_KEY='avianAscent_telemetry_v1';
function loadTelemetry(){
  try{return JSON.parse(localStorage.getItem(TELEMETRY_KEY)||'{"runs":[],"meta":{}}');}catch(_){return {runs:[],meta:{}};}
}
function saveTelemetry(data){
  try{localStorage.setItem(TELEMETRY_KEY, JSON.stringify(data));}catch(_){ }
}
function telemetryPushRun(run){
  const data = loadTelemetry();
  data.runs = Array.isArray(data.runs) ? data.runs : [];
  data.runs.unshift(run);
  data.runs = data.runs.slice(0, 120);
  saveTelemetry(data);
}
function getTelemetrySummary(){
  const runs = loadTelemetry().runs||[];
  if(!runs.length) return {runs:0, avgStage:0, topDeaths:[], winRateByBird:[]};
  const deaths = new Map();
  const birds = new Map();
  let stageTotal = 0;
  for(const r of runs){
    stageTotal += Number(r.stageReached||1);
    const death = String(r.deathCause||'unknown');
    deaths.set(death, (deaths.get(death)||0)+1);
    const b = String(r.bird||'unknown');
    if(!birds.has(b)) birds.set(b, {bird:b, runs:0, wins:0});
    const row = birds.get(b); row.runs++; if(r.won) row.wins++;
  }
  return {
    runs:runs.length,
    avgStage: +(stageTotal/runs.length).toFixed(2),
    topDeaths:[...deaths.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5),
    winRateByBird:[...birds.values()].map(x=>({...x, winRate:+((x.wins/Math.max(1,x.runs))*100).toFixed(1)})).sort((a,b)=>b.winRate-a.winRate)
  };
}
globalThis.getTelemetrySummary = getTelemetrySummary;

const HIGHSCORE_KEY='avian_highscores_v1';
function getRunSnapshot(){
  const p=G.player||{};
  return {
    birdKey:p.birdKey||'unknown',
    birdName:p.name||'Unknown',
    stage:G.endlessMode && G.stage>20 ? `Endless ${G.endlessBattle||Math.max(1,G.stage-20)}` : `Stage ${G.stage||1}`,
    stageNumber:Number(G.stage||1),
    endless:!!G.endlessMode,
    stats:{...(p.stats||{})},
    abilities:(p.abilities||[]).map(a=>{
      const t=ABILITY_TEMPLATES[a.id];
      return `${t?.name||a.id} Lv${a.level||1}`;
    }),
    upgrades:(G.collectedRewards||[]).map(r=>r.name),
    ts:Date.now()
  };
}
function saveHighscoreEntry(won=false){
  const snap=getRunSnapshot();
  const entry={...snap, won:!!won};
  try{
    const rows=JSON.parse(localStorage.getItem(HIGHSCORE_KEY)||'[]');
    rows.push(entry);
    rows.sort((a,b)=> (b.stageNumber||0)-(a.stageNumber||0) || Number(!!b.won)-Number(!!a.won));
    localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(rows.slice(0,20)));
  }catch(_){ }
}
function renderHighscoreBoard(){
  const grid=document.getElementById('highscore-grid');
  if(!grid) return;
  let rows=[];
  try{ rows=JSON.parse(localStorage.getItem(HIGHSCORE_KEY)||'[]'); }catch(_){ rows=[]; }
  if(!rows.length){
    grid.innerHTML='<div class="run-card"><div class="run-stage">No highscores yet</div><div class="run-meta">Finish a run to log your best attempts.</div></div>';
    return;
  }
  grid.innerHTML=rows.slice(0,8).map((r,i)=>`
    <div class="run-card">
      <div class="run-stage">#${i+1} · ${r.stage}${r.won?' · 👑 Win':''}</div>
      <div class="run-bird">${r.birdName||r.birdKey}</div>
      <div class="run-meta">HP ${r.stats?.hp||0}/${r.stats?.maxHp||0} · ATK ${r.stats?.atk||0} · DEF ${r.stats?.def||0} · SPD ${r.stats?.spd||0}</div>
      <div class="run-meta">${(r.abilities||[]).slice(0,3).join(' · ')}</div>
      <div class="run-meta">Upgrades: ${((r.upgrades||[]).slice(0,2).join(' · '))||'—'}</div>
    </div>`).join('');
}

registerGameModule({
  id:'telemetry-persistence',
  onRunEnd(ctx){
    telemetryPushRun({
      bird: ctx?.bird || G.player?.birdKey || 'unknown',
      won: !!ctx?.won,
      stageReached: ctx?.stageReached || G.stage || 1,
      deathCause: ctx?.deathCause || 'unknown',
      at: Date.now(),
      endless: !!(ctx?.endless ?? G.endlessMode),
    });
  }
});

removeMimicEverywhere();

// ============================================================
//  SELECTION SCREEN
// ============================================================
// Dismiss tooltip on outside tap (mobile)
document.addEventListener('touchstart',e=>{
  const tt=document.getElementById('action-tooltip');
  if(tt&&tt.style.display==='block'&&!e.target.closest('.action-btn')&&!e.target.closest('#action-tooltip')){
    hideTooltip();
  }
},{passive:true});

// ============================================================
//  COMBO SYSTEM
// ============================================================
function registerHit() {
  if(G.comboReady) return; // already stored
  G.comboCount++;
  const threshold=G.player&&G.player._comboThreshold||5;
  if(G.comboCount>=threshold){G.comboReady=true;G.comboCount=0;logMsg('🔥 COMBO READY! Next attack crits!','crit');}
  updateComboMeter();
}
function registerMiss() {
  G.comboCount=0; updateComboMeter();
}
function consumeCombo() {
  if(!G.comboReady) return false;
  G.comboReady=false; G.comboCount=0; updateComboMeter();
  return true;
}
function updateComboMeter() {
  const meter=document.getElementById('combo-meter');
  if(!meter) return;
  const pips=document.getElementById('combo-pips');
  const txt=document.getElementById('combo-txt');
  if(!pips||!txt) return;
  meter.style.display='flex';
  pips.innerHTML='';
  for(let i=0;i<5;i++){
    const pip=document.createElement('div');
    pip.className='combo-pip'+(G.comboReady?' ready':i<G.comboCount?' filled':'');
    pips.appendChild(pip);
  }
  const thresh=G.player&&G.player._comboThreshold||5;
  txt.textContent=G.comboReady?'FREE CRIT!':G.comboCount>0?`${G.comboCount}/${thresh}`:'';
}

// ============================================================
//  PASSIVE TRAIT HELPERS
// ============================================================
function triggerPassive(trigger, ...args) {
  const bd=BIRDS[G.player.birdKey];
  if(!bd||!bd.passive) return;
  if(bd.passive[trigger]) bd.passive[trigger](G.player,...args);
}
function renderPassiveBadge() {
  const badge=document.getElementById('passive-badge');
  if(!badge) return;
  const bd=BIRDS[G.player.birdKey];
  if(bd&&bd.passive){badge.textContent=`★ ${bd.passive.name}`;badge.title=bd.passive.desc;badge.style.display='inline-block';}
  else badge.style.display='none';
}

// ============================================================
//  NEST / INVENTORY
// ============================================================
function openNest() {
  const modal=document.getElementById('nest-modal');
  const content=document.getElementById('nest-content');
  const sub=document.getElementById('nest-subtitle');
  const p=G.player;
  if(!p){content.innerHTML='<p style="color:var(--text-dim);text-align:center">No active run.</p>';modal.classList.add('open');return;}
  sub.textContent=`${p.name} · Stage ${G.stage} · Lv.${p.birdLevel}`;
  let html='';
  // Passive trait
  const bd=BIRDS[p.birdKey];
  if(bd&&bd.passive){
    html+=`<div class="nest-passive"><div class="nest-passive-title">★ PASSIVE: ${bd.passive.name}</div>${bd.passive.desc}</div>`;
  }
  // Stats
  const s=p.stats;
  // Compute effective in-battle stats
  const _nestWarcry=G.warcryActive?Math.floor(s.atk*(1+G.warcryATK/100)):s.atk;
  const _nestDef=s.def+(G.battleHymnActive?G.battleHymnDEF:0);
  const _nestAcc=Math.min(100,s.acc+(G.battleHymnActive?G.battleHymnACC:0)-(G.playerStatus.accDebuff||0));
  const _nestDodge=getEffectiveDodge(p);
  const _nestMDodge=getEffectiveMdodge(p);
  const _nestCrit=Math.min(100,(s.critChance||5)+(G.playerStatus.burning>0?20:0)+(p._velocityStacks||0));
  const _nestCritMult=p.goldCritMult||1.8;
  function _nestStat(val,base,suffix=''){const d=val-base;const col=d>0?'#6ab89a':d<0?'#e87070':'var(--gold)';const arr=d>0?' ↑':d<0?' ↓':'';return `<span style="color:${col}">${val}${suffix}${arr}</span>`;}
  html+=`<div class="nest-section"><div class="nest-section-title">📊 Stats ${G.turn?'(In Battle)':''}</div>
  <div class="nest-stats-grid">
    <div class="nest-stat-card"><div class="nest-stat-val">${s.hp}/${s.maxHp}</div><div class="nest-stat-lbl">HP</div></div>
    <div class="nest-stat-card"><div class="nest-stat-val">${_nestStat(_nestWarcry,s.atk)}</div><div class="nest-stat-lbl">ATK</div></div>
    <div class="nest-stat-card"><div class="nest-stat-val">${_nestStat(_nestDef,s.def)}</div><div class="nest-stat-lbl">DEF</div></div>
    <div class="nest-stat-card"><div class="nest-stat-val">${s.spd}</div><div class="nest-stat-lbl">SPD</div></div>
    <div class="nest-stat-card"><div class="nest-stat-val">${_nestStat(_nestDodge,s.dodge,'%')}</div><div class="nest-stat-lbl">DODGE</div></div>
    <div class="nest-stat-card" title="Magic Dodge — chance to deflect enemy spells/status"><div class="nest-stat-val" style="color:#6ae8e8">${_nestMDodge}%${p.cardMdodge>0?` <span style='font-size:.7em;color:#4ab8c0'>(+${p.cardMdodge||0}card)</span>`:''}</div><div class="nest-stat-lbl" style="color:#4ab8c0">✦ MDODGE</div></div>
    <div class="nest-stat-card"><div class="nest-stat-val">${_nestStat(_nestAcc,s.acc,'%')}</div><div class="nest-stat-lbl">ACC</div></div>
    <div class="nest-stat-card"><div class="nest-stat-val" style="color:${_nestCrit>5?'#e8c96a':'var(--gold)'}">${_nestCrit}%</div><div class="nest-stat-lbl">🎯 Crit %</div></div>
    <div class="nest-stat-card"><div class="nest-stat-val" style="color:${_nestCritMult>1.5?'#e8c96a':'var(--gold)'}">${_nestCritMult.toFixed(1)}×</div><div class="nest-stat-lbl">💥 Crit Dmg</div></div>
    <div class="nest-stat-card" title="Magic Attack — improves spell and ailment potency"><div class="nest-stat-val" style="color:#6ae8e8">${s.matk||8}</div><div class="nest-stat-lbl" style="color:#4ab8c0">✦ M.ATK</div></div>
    <div class="nest-stat-card" title="Magic Defence — resists enemy spells and ailments"><div class="nest-stat-val" style="color:#6ae8e8">${s.mdef||8}</div><div class="nest-stat-lbl" style="color:#4ab8c0">✦ M.DEF</div></div>
  </div></div>`;
  // Abilities
  html+=`<div class="nest-section"><div class="nest-section-title">⚔ Abilities (${p.abilities.length}/4)</div><div class="nest-abilities-grid">`;
  p.abilities.forEach(ab=>{
    const tmpl=ABILITY_TEMPLATES[ab.id];
    const lv=Math.min(ab.level,4);
    const desc=tmpl?tmpl.levels[lv-1].desc:'';
    html+=`<div class="nest-ab-card">
      <div class="nest-ab-name ${ab.type}">${ab.name}</div>
      <div class="nest-ab-lv">Level ${ab.level} · ${ab.type}</div>
      <div class="nest-ab-desc">${desc}</div>
    </div>`;
  });
  html+=`</div></div>`;
  // Collected rewards
  if(G.collectedRewards&&G.collectedRewards.length>0){
    // Group duplicates
    const rewardMap=new Map();
    G.collectedRewards.forEach(r=>{
      const key=r.name;
      if(rewardMap.has(key)){rewardMap.get(key).count++;}
      else{rewardMap.set(key,{...r,count:1});}
    });
    const tierOrder={gold:0,purple:1,blue:2,green:3,grey:4};
    const grouped=[...rewardMap.values()].sort((a,b)=>(tierOrder[a.tier]||4)-(tierOrder[b.tier]||4));
    html+=`<div class="nest-section"><div class="nest-section-title">🎁 Collected Rewards (${G.collectedRewards.length})</div><div class="nest-rewards-list">`;
    grouped.forEach(r=>{
      const tierColor={gold:'var(--gold)',purple:'var(--purple-light)',blue:'var(--blue-light)',green:'var(--green-light)',grey:'var(--text-dim)'}[r.tier]||'var(--text-dim)';
      const countBadge=r.count>1?`<span style="background:rgba(201,168,76,.2);border:1px solid var(--gold);border-radius:10px;padding:1px 7px;font-size:.72rem;color:var(--gold);font-family:Cinzel,serif;margin-left:6px">${r.count}×</span>`:'';
      html+=`<div class="nest-reward-row"><span class="nest-reward-icon">${r.icon}</span><span class="nest-reward-name" style="color:${tierColor}">${r.name}${countBadge}</span><span class="nest-reward-desc">${r.desc}</span></div>`;
    });
    html+=`</div></div>`;
  }
  content.innerHTML=html;
  modal.classList.add('open');
}
function closeNest() {
  document.getElementById('nest-modal').classList.remove('open');
}

function codexMark(type, id, field='seen'){
  if(!id) return;
  if(!G.codex) G.codex={abilities:{},enemies:{},birds:{},artifacts:{},statuses:{}};
  if(!G.codex[type]) G.codex[type]={};
  if(!G.codex[type][id]) G.codex[type][id]={seen:false,used:false};
  G.codex[type][id][field]=true;
  if(document.getElementById('ref-guide-body')?.classList.contains('open')){
    try{ buildRefGuide(); }catch(_){ }
  }
}

// ============================================================
//  SAVE / LOAD SYSTEM (localStorage)
// ============================================================
const SAVE_KEY='avianAscent_save_v1';
function saveRun() {
  if(!G.player) return;
  try {
    const onBattleScreen=!!document.getElementById('screen-battle')?.classList.contains('active');
    const save={
      player: JSON.parse(JSON.stringify(G.player)),
      stage: G.stage, bossKills: G.bossKills,
      endlessMode: G.endlessMode, endlessBattle: G.endlessBattle,
      collectedRewards: G.collectedRewards||[],
      runUpgradesPurchased: [...(G.runUpgradesPurchased||new Set())],
      codex: JSON.parse(JSON.stringify(G.codex||{abilities:{},enemies:{},birds:{},artifacts:{},statuses:{}})),
      inBattle: onBattleScreen && !!G.enemy && !G.battleOver,
      battle: (onBattleScreen && G.enemy && !G.battleOver) ? {
        enemy: JSON.parse(JSON.stringify(G.enemy)),
        enemyNextAction: G.enemyNextAction?JSON.parse(JSON.stringify(G.enemyNextAction)):null,
        playerStatus: JSON.parse(JSON.stringify(G.playerStatus||{})),
        enemyStatus: JSON.parse(JSON.stringify(G.enemyStatus||{})),
        turn: G.turn,
        turnPhase: G.turnPhase,
        phase: G.phase,
      } : null,
      savedAt: Date.now(),
    };
    // Strip un-serializable passive fns from player
    delete save.player.passive;
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch(e){ console.warn('Save failed',e); }
}
function loadSaveData() {
  try {
    const raw=localStorage.getItem(SAVE_KEY);
    return raw?JSON.parse(raw):null;
  } catch(e){ return null; }
}
function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}
function continueRun() {
  const save=loadSaveData();
  if(!save) return;
  G.endlessMode=save.endlessMode||false;
  G.endlessBattle=save.endlessBattle||0;
  G.bossKills=save.bossKills||0;
  G.stage=save.stage||1;
  G.collectedRewards=save.collectedRewards||[];
  G.player=save.player;
  G.runUpgradesPurchased=new Set(save.runUpgradesPurchased||[]);
  G.codex=save.codex||{abilities:{},enemies:{},birds:{},artifacts:{},statuses:{}};
  // Re-attach passive reference (fns can't be serialized)
  const bd=BIRDS[G.player.birdKey];
  if(bd) G.player.passive=bd.passive||null;
  ensureMainAttackAndLoadoutRules();
  removeMimicEverywhere();
  normalizeAbilityCooldownsForPlayer(G.player);
  enforceAbilityCosts(G.player);
  // Migration: ensure mdodge and card stats exist
  if(G.player.stats.mdodge===undefined) G.player.stats.mdodge = G.player.stats.dodge||20;
  if(G.player.cardDodge===undefined) G.player.cardDodge=0;
  if(G.player.cardMdodge===undefined) G.player.cardMdodge=G.player.cardDodge||0; // retroactively mirror

  const bsave=save.battle;
  if(save.inBattle&&bsave&&bsave.enemy){
    G.enemy=bsave.enemy;
    G.enemyNextAction=bsave.enemyNextAction||planEnemyAction();
    G.playerStatus=bsave.playerStatus||{};
    G.enemyStatus=bsave.enemyStatus||{};
    G.turn=bsave.turn||'player';
    G.turnPhase=bsave.turnPhase||TURN.PLAYER;
    G.phase=bsave.phase||(G.turn==='player'?'PLAYER':'ENEMY');
    G.battleOver=false;
    G.actionQueue=[];
    G.actionBusy=false;
    showScreen('screen-battle');
    updateStageProgress();
    refreshBattleUI();
    if(G.turn==='enemy') setTimeout(enemyTurn,350);
    return;
  }

  G.phase='PLAYER';
  loadStage();
}
function goMainMenu() {
  if(G.player) saveRun();
  showScreen('screen-select');initSelectionSafe();
}

// ============================================================
//  NEXT STAGE PREVIEW
// ============================================================
function showNextStagePreview() {
  const el=document.getElementById('next-stage-preview');
  if(!el) return;
  const nextStage=G.stage+1;
  if(nextStage>ENEMIES.length&&!G.endlessMode){el.style.display='none';return;}
  let enemy;
  if(G.endlessMode&&nextStage>ENEMIES.length){
    el.innerHTML=`<div class="nsp-title">Next Up</div><div class="nsp-enemy">⚔</div><div class="nsp-name" style="color:var(--gold)">Endless Battle ${G.endlessBattle+1}</div><div class="nsp-stats">Scaled enemies await...</div>`;
  } else {
    enemy=ENEMIES[Math.min(nextStage-1,ENEMIES.length-1)];
    const sizeLabel={tiny:'Tiny',small:'Small',medium:'Medium',large:'Large',xl:'Extra Large'}[enemy.size]||'?';
    el.innerHTML=`<div class="nsp-title">⟩ Next Stage ${nextStage}</div><div class="nsp-enemy">${enemy.portraitKey&&PORTRAITS[enemy.portraitKey]?PORTRAITS[enemy.portraitKey]:enemy.emoji}</div><div class="nsp-name">${enemy.isBoss?`👑 ${enemy.bossTitle}: `:''} ${enemy.name}</div><div class="nsp-stats">HP ${enemy.hp} · ATK ${enemy.atk} · ${sizeLabel}${enemy.isBoss?' · <span class="rage-badge">BOSS</span>':''}</div>`;
  }
  el.style.display='block';
}

// ============================================================
//  SELECTION SCREEN
// ============================================================
const SIZE_ORDER = ['tiny','small','medium','large','xl'];
const SIZE_LABELS = {tiny:'Tiny',small:'Small',medium:'Medium',large:'Large',xl:'X-Large'};
const CLASS_ORDER = ['assassin','knight','mage','bard','tank','ranger','summoner'];
const CLASS_LABELS = {assassin:'⚔️ Assassin',knight:'🛡️ Knight',mage:'✨ Mage',bard:'🎵 Bard',tank:'🪨 Tank',ranger:'🏹 Ranger',summoner:'🌊 Summoner'};
const CLASS_FLAVOR = {assassin:'Burst dmg, crit fishing, evasive.',knight:'Balanced physical, DEF/ACC.',mage:'Pure songs/spells, debuff control.',bard:'Song mix + physical hybrid.',tank:'Sustain bricks, high HP.',ranger:'Projectile pressure, pierce and slows.',summoner:'Mob caller, flock tactics.'};
let G_selView = 'size';
let G_classFilter = 'all';
let shopPurchaseMade = false;

function initSelection() {
  // Check for saved run
  const save=loadSaveData();
  if(save&&save.player){
    const row=document.getElementById('continue-row');
    const info=document.getElementById('continue-info');
    if(row){ row.style.display='block';
      const mins=Math.floor((Date.now()-save.savedAt)/60000);
      const timeStr=mins<1?'just now':mins<60?`${mins}m ago`:`${Math.floor(mins/60)}h ago`;
      if(info) info.textContent=`${save.player.name} · Stage ${save.stage} · Lv.${save.player.birdLevel} · saved ${timeStr}`;
    }
  }

  // Build difficulty picker
  buildDifficultyPicker();

  // Build bird grid
  buildClassFilterMenu();
  buildBirdGrid(G_selView);
  renderHighscoreBoard();
}

function buildClassFilterMenu(){
  const tabs=document.getElementById('class-filter-tabs');
  if(!tabs) return;
  const opts=[['all','All'], ...CLASS_ORDER.map(c=>[c, idToClassLabel(c)])];
  tabs.innerHTML = opts.map(([id,label])=>`<button class="class-filter-tab ${G_classFilter===id?'active':''}" onclick="selectClassFilter('${id}')">${label}</button>`).join('');
}
function idToClassLabel(id){
  if(id==='all') return 'All';
  return (CLASS_LABELS[id]||id).replace(/^.*\s/,'');
}
function selectClassFilter(id){
  G_classFilter=id||'all';
  buildClassFilterMenu();
  buildBirdGrid(G_selView);
  renderHighscoreBoard();
}


function wireRefGuideClicks(){
  const header = document.querySelector('.ref-guide-header');
  if(!header || header.dataset.wired==='1') return;
  // Prevent inline onclick + listener double toggles.
  header.onclick = null;
  header.dataset.wired='1';
  header.addEventListener('click', ()=>{
    try{
      if(typeof toggleRefGuide === 'function') toggleRefGuide();
      else {
        const body=document.getElementById('ref-guide-body');
        const chev=document.getElementById('ref-chevron');
        if(body){
          const open=body.classList.toggle('open');
          if(chev) chev.classList.toggle('open', open);
        }
      }
    }catch(e){
      console.error('Ref guide toggle failed:', e);
      failsafeAdvance('ref-guide click');
    }
  }, {passive:true});
}

function renderStarterFallbackGrid(reason=''){
  const grid = document.getElementById('bird-grid');
  if(!grid) return;
  grid.innerHTML = '';
  const starters = ['sparrow','goose','blackbird','crow','macaw','robin'];
  const row = document.createElement('div');
  row.className = 'size-birds-row';
  const statMax={HP:1,ATK:1,DEF:1,SPD:1,Dodge:1,MDodge:1,ACC:1,Crit:1,MATK:1,MDEF:1};

  starters.forEach(key=>{
    const bird = BIRDS?.[key];
    if(!bird) return;
    row.appendChild(buildBirdCard(key, bird, false, statMax));
  });

  grid.appendChild(row);
  const label=document.getElementById('bird-count-label');
  if(label) label.textContent='6/6 available (recovery)';

  if(BIRDS?.sparrow){
    G.selected='sparrow';
    updateAscentPanel('sparrow');
  }
  console.warn('Selection recovery fallback used.', reason);
}

function initSelectionSafe(){
  try{
    initSelection();
    wireRefGuideClicks();

    // If init did not throw but produced no cards (mobile/content:// edge), recover anyway.
    const cards=document.querySelectorAll('.bird-card').length;
    if(cards===0){
      renderStarterFallbackGrid('initSelectionSafe empty grid');
      failsafeAdvance('initSelectionSafe empty grid');
    }
  }catch(err){
    console.error('initSelection crashed:', err);

    renderStarterFallbackGrid('initSelectionSafe catch');
    failsafeAdvance('initSelectionSafe fallback');
  }
}

function buildDifficultyPicker() {
  const container = document.getElementById('diff-picker');
  if(!container) return;
  container.innerHTML = '';
  Object.values(DIFFICULTIES).forEach(d => {
    const locked = d.unlockRequires && !isUnlocked(d.unlockRequires);
    const btn = document.createElement('button');
    btn.className = 'diff-btn' + (locked?' locked-diff':'') + (G._selectedDifficulty===d.id?' active':'');
    btn.style.borderColor = locked ? 'rgba(60,50,35,.4)' : d.color+'88';
    if(G._selectedDifficulty===d.id) { btn.style.background=d.color; btn.style.color='#0a0c0f'; }
    btn.innerHTML = `<span>${d.emoji}</span><span>${d.label}</span>` + (locked?` <span style="font-size:.65rem;opacity:.7">🔒</span>`:'');
    if(locked) { btn.title = 'Complete Hard mode to unlock'; }
    else {
      btn.onclick = () => selectDifficulty(d.id);
    }
    container.appendChild(btn);
  });
  // Set default
  if(!G._selectedDifficulty) { G._selectedDifficulty='juvenile'; buildDifficultyPicker(); }
  const desc = document.getElementById('diff-desc');
  const cur = DIFFICULTIES[G._selectedDifficulty||'juvenile'];
  if(desc) desc.textContent = `${cur.emoji} ${cur.label}: ${cur.desc}`;
}

function selectDifficulty(id) {
  G._selectedDifficulty = id;
  buildDifficultyPicker();
}

function setSelView(view, btn) {
  G_selView = view;
  document.querySelectorAll('.view-toggle-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  buildBirdGrid(view);
}

function buildBirdGrid(view='size') {
  const grid = document.getElementById('bird-grid');
  if(!grid) return;
  grid.innerHTML = '';

  let safeBirdEntries = Object.entries(BIRDS).filter(([,b])=>{
    return !!(b && b.stats && Number.isFinite(b.stats.hp) && Number.isFinite(b.stats.atk) && Number.isFinite(b.stats.def));
  });
  if(G_classFilter!=='all') safeBirdEntries = safeBirdEntries.filter(([,b])=>String(b.class||'').toLowerCase()===G_classFilter);
  const fallbackStarters = ['sparrow','goose','blackbird','crow','macaw','robin'];

  // Compute global max stats for bars
  const globalMax={HP:1,ATK:1,DEF:1,SPD:1,Dodge:1,MDodge:1,ACC:1,Crit:1,MATK:1,MDEF:1};
  safeBirdEntries.forEach(([,b])=>{
    if(b.stats.hp>globalMax.HP)globalMax.HP=b.stats.hp;
    if(b.stats.atk>globalMax.ATK)globalMax.ATK=b.stats.atk;
    if(b.stats.def>globalMax.DEF)globalMax.DEF=b.stats.def;
    if(b.stats.spd>globalMax.SPD)globalMax.SPD=b.stats.spd;
    if(b.stats.dodge>globalMax.Dodge)globalMax.Dodge=b.stats.dodge;
    if((b.stats.dodge||0)>globalMax.MDodge)globalMax.MDodge=b.stats.dodge;
    if(b.stats.acc>globalMax.ACC)globalMax.ACC=b.stats.acc;
    if(b.stats.critChance&&b.stats.critChance>globalMax.Crit)globalMax.Crit=b.stats.critChance;
    if(b.stats.matk&&b.stats.matk>globalMax.MATK)globalMax.MATK=b.stats.matk;
    if(b.stats.mdef&&b.stats.mdef>globalMax.MDEF)globalMax.MDEF=b.stats.mdef;
  });

  const groups = {};
  const orderedKeys = view==='size' ? SIZE_ORDER : CLASS_ORDER;
  const groupLabels = view==='size' ? SIZE_LABELS : CLASS_LABELS;

  orderedKeys.forEach(k => groups[k]=[]);

  safeBirdEntries.forEach(([key, bird]) => {
    const groupKey = view==='size' ? (bird.size||'medium') : (bird.class||'knight');
    if(!groups[groupKey]) groups[groupKey]=[];
    groups[groupKey].push([key, bird]);
  });

  let totalUnlocked=0, totalBirds=0;
  if(view==='all'){
    const section = document.createElement('div');
    section.className = 'size-section';
    const header = document.createElement('div');
    header.className = 'size-header';
    header.innerHTML = `<div class="size-header-line"></div><div class="size-header-title">All Birds</div><div class="size-header-line"></div>`;
    section.appendChild(header);
    const row = document.createElement('div');
    row.className='size-birds-row';
    safeBirdEntries.forEach(([key,bird])=>{
      totalBirds++;
      const locked = bird.unlockRequires && !isUnlocked(bird.unlockRequires);
      if(!locked) totalUnlocked++;
      row.appendChild(buildBirdCard(key,bird,locked,globalMax));
    });
    section.appendChild(row);
    grid.appendChild(section);
  } else orderedKeys.forEach(groupKey => {
    const entries = groups[groupKey];
    if(!entries||!entries.length) return;

    const section = document.createElement('div');
    section.className = 'size-section';

    // Section header
    const header = document.createElement('div');
    header.className = 'size-header';
    header.innerHTML = `<div class="size-header-line"></div><div class="size-header-title">${groupLabels[groupKey]||groupKey}</div>`;
    if(view==='class' && CLASS_FLAVOR[groupKey]) {
      header.innerHTML += `<div style="font-size:.62rem;color:var(--text-dim);font-style:italic;flex-shrink:0;">${CLASS_FLAVOR[groupKey]}</div>`;
    }
    header.innerHTML += `<div class="size-header-line"></div>`;
    section.appendChild(header);

    const row = document.createElement('div');
    row.className = 'size-birds-row';

    entries.forEach(([key, bird]) => {
      totalBirds++;
      const locked = bird.unlockRequires && !isUnlocked(bird.unlockRequires);
      if(!locked) totalUnlocked++;
      const card = buildBirdCard(key, bird, locked, globalMax);
      row.appendChild(card);
    });

    section.appendChild(row);
    grid.appendChild(section);
  });

  const label = document.getElementById('bird-count-label');
  if(label) label.textContent = `${totalUnlocked}/${totalBirds} available${G_classFilter!=='all' ? ` · ${idToClassLabel(G_classFilter)}`:''}`;

  // Hard fallback: never allow an empty/brick select screen.
  if(totalBirds===0){
    console.error('Character select fallback: no valid bird entries detected.');
    const section=document.createElement('div');
    section.className='size-section';
    const row=document.createElement('div');
    row.className='size-birds-row';
    fallbackStarters.forEach(key=>{
      const bird=BIRDS[key];
      if(!bird||!bird.stats) return;
      row.appendChild(buildBirdCard(key,bird,false,globalMax));
    });
    section.appendChild(row);
    grid.appendChild(section);
    if(label) label.textContent='6/6 available (fallback)';
  }
}

document.addEventListener('click', (e)=>{
  const menu=document.getElementById('class-filter-menu');
  const btn=document.getElementById('class-filter-btn');
  if(!menu||!btn) return;
  if(menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) menu.classList.remove('open');
});


function buildBirdExpandedContent(key, bird){
  const cls = bird.class||'knight';
  const sizeClass = getUISizeClass(bird, 'panel');
  const tags = (bird.startAbilities||[]).map(id=>`<span class="ascent-ab-tag">${ABILITY_TEMPLATES[id]?ABILITY_TEMPLATES[id].name:id}</span>`).join('');
  return `
    <div class="bird-card-expanded">
      <div class="ascent-panel-tagline">${bird.tagline||''}</div>
      <div class="ascent-panel-class"><span class="class-badge class-${cls}">${cls.toUpperCase()}</span> · ${SIZE_LABELS[bird.size||'medium']||bird.size}</div>
      ${bird.passive?`<div class="ascent-panel-passive"><strong>★ ${bird.passive.name}:</strong> ${bird.passive.desc}</div>`:''}
      <div class="ascent-abilities">${tags}</div>
      <div style="text-align:left;font-size:.72rem;color:var(--text);background:rgba(0,0,0,.25);border:1px solid rgba(201,168,76,.2);border-radius:8px;padding:8px;margin:8px 0;"><strong>Full Stats:</strong> HP ${bird.stats.hp} · ATK ${bird.stats.atk} · DEF ${bird.stats.def} · SPD ${bird.stats.spd} · ACC ${bird.stats.acc}% · Dodge ${bird.stats.dodge}% · MATK ${bird.stats.matk||0} · MDEF ${bird.stats.mdef||0} · Crit ${bird.stats.critChance||0}%</div>
      <button class="cta" onclick="event.stopPropagation();startGame()">🪽 Take Flight as ${bird.name}</button>
    </div>`;
}

function buildBirdCard(key, bird, locked, globalMax) {
  const card = document.createElement('div');
  card.className = 'bird-card' + (locked ? ' bird-locked' : '') + (G.selected===key?' selected':'');
  if (!locked) card.onclick = () => selectBird(key, card);

  const cls = bird.class||'knight';
  const sizeClass = getUISizeClass(bird, 'select');

  const keyStats = [
    {k:'HP', v:bird.stats.hp, max:globalMax.HP, suffix:''},
    {k:'ATK', v:bird.stats.atk, max:globalMax.ATK, suffix:''},
    {k:'DEF', v:bird.stats.def, max:globalMax.DEF, suffix:''},
    {k:'SPD', v:bird.stats.spd, max:globalMax.SPD, suffix:''},
    {k:'Dodge', v:bird.stats.dodge, max:globalMax.Dodge, suffix:'%'},
    {k:'MDodge', v:(bird.stats.mdodge??bird.stats.dodge??0), max:globalMax.MDodge, suffix:'%'},
    {k:'ACC', v:bird.stats.acc, max:globalMax.ACC, suffix:'%'},
    {k:'MATK', v:(bird.stats.matk||0), max:globalMax.MATK, suffix:''},
    {k:'MDEF', v:(bird.stats.mdef||0), max:globalMax.MDEF, suffix:''},
    {k:'Crit', v:(bird.stats.critChance||0), max:Math.max(globalMax.Crit||1,1), suffix:'%'},
  ];
  const bars = keyStats.map(({k,v,max,suffix})=>{
    const pct=Math.min(100,(v/Math.max(max||1,1))*100);
    const fill=locked?'#333':(k==='Dodge'||k==='MDodge'||k==='ACC'||k==='Crit'?'#c9a84c':(bird.color||'#6a8ae8'));
    return `<div class="stat-row compact"><div class="stat-lbl">${k}</div><div class="stat-bg"><div class="stat-fill" style="width:${pct}%;background:${fill}"></div></div><div class="stat-val" style="${locked?'color:#444':''}">${v}${suffix}</div></div>`;
  }).join('');

  const unlockLabel = bird.unlockHint || '🔒 Locked';

  if(locked) {
    card.innerHTML = `
      <div class="bird-card-head">
        <span class="class-badge class-${cls}">${(cls).toUpperCase()}</span>
        <span class="bird-size-chip">${SIZE_LABELS[bird.size||'medium']||bird.size}</span>
      </div>
      <div style="display:flex;justify-content:center;margin:2px auto 6px;">${renderBirdIconHTML(key,sizeClass,true)}</div>
      <div class="bird-nm" style="color:#555;font-size:.8rem;">${bird.name}</div>
      <div class="lock-overlay"><span class="lock-icon" style="font-size:1rem;">🔒</span><div class="lock-label" style="font-size:.6rem;color:#555;line-height:1.3;">${unlockLabel}</div></div>`;
  } else {
    const expanded = (G.selected===key) ? buildBirdExpandedContent(key,bird) : '';
    card.innerHTML = `
      <div class="bird-card-head">
        <span class="class-badge class-${cls}">${(cls).toUpperCase()}</span>
        <span class="bird-size-chip">${SIZE_LABELS[bird.size||'medium']||bird.size}</span>
      </div>
      <div style="display:flex;justify-content:center;margin:2px auto 6px;">${renderBirdIconHTML(key,sizeClass,false)}</div>
      <div class="bird-nm">${bird.name}</div>
      <div class="stat-bars">${bars}</div>
      ${expanded}`;
  }
  return card;
}

function selectBird(key, el) {
  G.selected = key;
  document.querySelectorAll('.bird-card').forEach(c=>c.classList.remove('selected'));
  if(el) el.classList.add('selected');
  // Re-render cards so the selected card expands inline (no side panel/auto-scroll).
  initSelectionSafe();
}


/* ===== Sprite/Portrait helper: always prefer sprite when available ===== */
function __normSpriteKey(k){ return String(k||'').toLowerCase().replace(/[^a-z]/g,''); }
function __hasSpriteKey(k){
  k=__normSpriteKey(k);
  // sprite keys are represented by CSS class .sprite-<key>
  return !!(document.querySelector && document.querySelector('.sprite-'+k)) || (globalThis.SPRITE_KEYS_ALL && SPRITE_KEYS_ALL.has && SPRITE_KEYS_ALL.has(k));
}
function getUISizeClass(entity, context='general'){
  const sz = String(entity?.size || entity?.birdSize || '').toLowerCase();
  const isBoss = !!entity?.isBoss;
  if(isBoss && context==='battle') return 'boss';
  if(sz.includes('tiny') || sz.includes('small')) return 'small';
  if(sz.includes('medium')) return 'medium';
  if(sz.includes('xlarge') || sz.includes('xl') || sz.includes('large')) return 'medium';
  return 'medium';
}
function normalizeSpriteBirdKey(raw){
  const k = String(raw||'').toLowerCase().replace(/[^a-z]/g,'');
  if(k === 'peregrinefalcon') return 'peregrine';
  if(k === 'snowyowl' || k === 'snowy') return 'snowyowl';
  if(k === 'secretary') return 'secretarybird';
  if(k === 'harpyeagle') return 'harpy';
  return k;
}
function neutralBirdFallbackHTML(sizeClass){
  return `<svg class="bird-fallback-svg ${sizeClass||''}" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18 50c10-20 24-31 44-30-6 7-10 13-12 19 8 1 14 5 18 11-12-1-21 1-28 7-6 5-11 8-18 7 3-4 4-8 4-14-4 0-6 0-8 0z" fill="#c9a84c" opacity=".9"/><path d="M37 27c7 6 9 12 7 18" stroke="#0a0c0f" stroke-width="2" fill="none" opacity=".5"/></svg>`;
}
function renderBirdIconHTML(birdKey, sizeClass, locked){
  const k = normalizeSpriteBirdKey(birdKey);
  const spriteBirds = /^(sparrow|goose|blackbird|crow|macaw|robin|hummingbird|shoebill|secretarybird|secretary|magpie|kookaburra|kiwi|penguin|flamingo|seagull|swan|emu|bowerbird|raven|lyrebird|peregrine|snowyowl|toucan|dukeblakiston|albatross|harpy|harpyeagle|baldeagle|blackcockatoo|ostrich|cassowary)$/;
  if(spriteBirds.test(k)){
    return `<div class="sprite4 ${sizeClass||''} sprite-${k} frame-0 ${locked?'locked':''}"></div>`;
  }
  const portrait = (globalThis.PORTRAITS && (PORTRAITS[birdKey] || PORTRAITS[k])) || '';
  if(portrait) return `<div class="bird-emo">${portrait}</div>`;
  return neutralBirdFallbackHTML(sizeClass);
}
function renderEntityAvatarHTML(entity, context='battle', locked=false){
  const key = normalizeSpriteBirdKey(entity?.portraitKey || entity?.birdKey || entity?.id || '');
  const sizeClass = getUISizeClass(entity, context);
  const html = renderBirdIconHTML(key, sizeClass, locked);
  if(/sprite4|bird-fallback-svg/.test(html)) return html;
  if(globalThis.PORTRAITS && (PORTRAITS[key] || PORTRAITS[String(key).toLowerCase()])){
    return (PORTRAITS[key] || PORTRAITS[String(key).toLowerCase()]);
  }
  return neutralBirdFallbackHTML(sizeClass);
}
function updateAscentPanel(key) {
  const panel = document.getElementById('ascent-panel');
  if(!panel) return;
  const bird = BIRDS[key];
  if(!bird){
    panel.classList.add('is-empty');
    panel.classList.remove('is-filled');
    panel.innerHTML='<div class="ascent-empty">← Select a bird to begin your ascent</div>';
    return;
  }

  const cls = bird.class||'knight';
  const sizeClass = getUISizeClass(bird, 'panel');
  const tags = (bird.startAbilities||[]).map(id=>`<span class="ascent-ab-tag">${ABILITY_TEMPLATES[id]?ABILITY_TEMPLATES[id].name:id}</span>`).join('');

  panel.innerHTML = `
    <div class="ascent-panel-portrait">${renderBirdIconHTML(key, sizeClass, false)}</div>
    <div class="ascent-panel-name">${bird.name}</div>
    <div class="ascent-panel-tagline">${bird.tagline}</div>
    <div class="ascent-panel-class"><span class="class-badge class-${cls}">${cls.toUpperCase()}</span> · ${SIZE_LABELS[bird.size||'medium']||bird.size}</div>
    ${bird.passive?`<div class="ascent-panel-passive"><strong>★ ${bird.passive.name}:</strong> ${bird.passive.desc}</div>`:''}
    <div class="ascent-abilities">${tags}</div>
    <div style="text-align:left;font-size:.72rem;color:var(--text);background:rgba(0,0,0,.25);border:1px solid rgba(201,168,76,.2);border-radius:8px;padding:8px;margin:8px 0;"><strong>Full Stats:</strong> HP ${bird.stats.hp} · ATK ${bird.stats.atk} · DEF ${bird.stats.def} · SPD ${bird.stats.spd} · ACC ${bird.stats.acc}% · Dodge ${bird.stats.dodge}% · MATK ${bird.stats.matk||0} · MDEF ${bird.stats.mdef||0} · Crit ${bird.stats.critChance||0}%</div>
    <div style="text-align:left;font-size:.7rem;color:var(--text-dim);margin:6px 0 10px;"><strong style="color:var(--gold-light)">Starting Attacks:</strong><br>${(bird.startAbilities||[]).map(id=>{const t=ABILITY_TEMPLATES[id];const lv=(t&&t.levels&&t.levels[0])?t.levels[0].desc:'';return `• <span style='color:var(--text)'>${t?t.name:id}</span> — ${lv}`;}).join('<br>')}</div>
    <button class="cta" onclick="startGame()">🪽 Take Flight as ${bird.name}</button>
    <div style="margin-top:8px;">
      <label style="font-size:.72rem;color:var(--text-dim);cursor:pointer;"><input type="checkbox" id="endless-check-alt" onchange="syncEndlessCheck(this)"> ♾ Endless Mode</label>
    </div>`;
  panel.classList.remove('is-empty');
  panel.classList.add('is-filled');
  const mainCheck = document.getElementById('endless-check');
  const altCheck = document.getElementById('endless-check-alt');
  if(mainCheck && altCheck) altCheck.checked = mainCheck.checked;
}

function syncEndlessCheck(cb) {
  const main = document.getElementById('endless-check');
  if(main) main.checked = cb.checked;
}


function beginRun(){ return startGame(); }
// ============================================================
//  GAME FLOW
// ============================================================
function startGame() {
  if(!G.selected) return;
  G.endlessMode = document.getElementById('endless-check').checked;
  G.difficulty = G._selectedDifficulty || 'juvenile';
  const bd = BIRDS[G.selected];
  G.collectedRewards=[];
  G.player = {
    name: bd.name, portraitKey: bd.portraitKey, birdKey: G.selected,
    size: bd.size||'medium',
    stats: {...bd.stats},
    abilities: [...bd.startAbilities,...(bd.extraAbilities||[])].map(id=>({
      ...ABILITY_TEMPLATES[id],
      level: 1,
      ailmentIds: [],
      energyCost: Number.isFinite(ABILITY_TEMPLATES[id]?.energyCost)?ABILITY_TEMPLATES[id].energyCost:0,
    })),
    exp: 0, birdLevel: 1,
    goldCritMult: 1.5,
    immuneParalyze: bd.passive?.immuneParalyze||false,
    poisonCap: 5,
    critChance: bd.stats.critChance||5,
    passive: bd.passive||null,
    cardDodge: 0,
    cardMdodge: 0,
    energyMax: 3,
    energy: 3,
    energyRegen: 0,
  };
  // MDodge base mirrors the bird's physical dodge stat
  G.player.stats.mdodge = G.player.stats.dodge;
  codexMark('birds', G.player.birdKey, 'seen');
  (G.player.abilities||[]).forEach(a=>codexMark('abilities',a.id,'seen'));
  ensureMainAttackAndLoadoutRules();
  removeMimicEverywhere();
  normalizeAbilityCooldownsForPlayer(G.player);
  enforceAbilityCosts(G.player);
  G.stage = 1;
  G.endlessBattle = 0;
  G.autoQueuedAbilityId=null;
  G._breakClampStreak=0;
  G.bossKills = 0;
  G.abilityCooldowns={};
  G.runCrits = 0; G.runBuffs = 0; G.runDebuffs = 0;
  G.runUpgradesPurchased = new Set();
  G.codex = {abilities:{},enemies:{},birds:{},artifacts:{},statuses:{}};
  G.shinyObjects = 0;
  saveRun();
  G.phase='PLAYER';
  const runStartEvt = {birdKey:G.player.birdKey, difficulty:G.difficulty, endless:!!G.endlessMode};
  AvianEvents.emit('run:start', runStartEvt);
  runModuleHook('onRunStart', runStartEvt);
  loadStage();
}

// Build endless-mode enemy from base pool (scaling happens in loadStage via stage-depth curve)
function makeEndlessEnemy(stage) {
  const isBoss = (stage % 10 === 0);
  const pool = ENEMIES.filter(e=>!!e.isBoss===isBoss);
  const src = (pool.length?pool:ENEMIES)[Math.floor(Math.random()*(pool.length?pool.length:ENEMIES.length))];
  const clone = JSON.parse(JSON.stringify(src));
  clone.isBoss = isBoss;
  if (isBoss) {
    clone.bossTitle = stage > 20 ? '💀 Endless Titan' : (clone.bossTitle||'⚡ Stage Boss');
    if(stage>20) clone.name = 'Corrupted ' + clone.name;
  }
  return clone;
}


function resetForNewBattle(){
  G.playerStatus={};
  G.enemyStatus={};
  G.crowDefendCooldown=0; G.blackbirdAttackCount=0;
  G.swoopCooldown=0; G.intimidateCooldown=0; G.fruitCooldown=0;
  G.stickLanceStage=0; G.flybyCharged=false; G.flybyUsed=false;
  G.rockDropPending=false; G.humTurns=0; G.humMissBonus=0;
  G.chargeUpActive=false; G.warcryActive=false; G.warcryATK=0;
  G.battleHymnActive=false; G.battleHymnDEF=0; G.battleHymnACC=0;
  G.enemyRageActive=false; G.enemyTurnCount=0;
  G.serratedStacks=0; G.sitAndWaitActive=false;
  G.tookieActive=false; G.tookieMiss=0;
  G.tauntActive=false; G.regenTurns=0; G.regenPct=0;
  G.activeDodgeBuffs={}; G.activeAccBuffs={};
  G._roostData=null;
  G.animLock=false; G.battleOver=false;
  G.actionQueue=[]; G.actionBusy=false;
  G.comboCount=0; G.comboReady=false;
  G._goldReplaceMode=false;
  G.turnCount=0;
  G._incomingAttackKind=null;
  if(G.player){
    G.player._mimicStored=null;
    G.player._mimicUsed=false;
    G.player._mimicAbility=null;
  }
}

function loadStage() {
  G.autoQueuedAbilityId=null;
  G._breakClampStreak=0;
  G.abilityCooldowns=G.abilityCooldowns||{};
  let ed;
  const diffMult = DIFFICULTIES[G.difficulty||'juvenile'].mult;

  if (G.endlessMode && G.stage > 20) {
    G.endlessBattle = Math.max(1,G.stage-20);
    ed = makeEndlessEnemy(G.stage);
  } else {
    // Determine tier from stage
    const stage = G.stage;
    let tier;
    if(stage<=4) tier=1;
    else if(stage<=9) tier=2;
    else if(stage<=14) tier=3;
    else if(stage<=19) tier=4;
    else tier=5; // final boss
    
    // Boss stages: 10, 20
    const isBossStage = (stage%10===0);
    
    if(tier===5 || stage===20){
      // Stage 20 special boss
      if(stage===20){
        ed = makeDukeBlakiston();
      } else {
        ed = JSON.parse(JSON.stringify(ENEMIES[ENEMIES.length-1]));
      }
    } else if(isBossStage){
      // Pick the boss from this tier
      const bosses = ENEMIES.filter(e=>e.isBoss);
      const bossIdx = Math.floor(stage/10)-1;
      ed = JSON.parse(JSON.stringify(bosses[Math.min(bossIdx, bosses.length-2)]));
    } else {
      // 30% chance to use a bird-character enemy (if stage >= 5)
      if(stage>=5 && Math.random()<0.30){
        const pool=BIRD_ENEMIES.filter(e=>e.tier.includes(tier));
        if(pool.length>0){
          const src=pool[Math.floor(Math.random()*pool.length)];
          ed={name:src.name,emoji:src.emoji,birdKey:src.birdKey,portraitKey:src.birdKey,hp:src.hp,maxHp:src.hp,atk:src.atk,def:src.def,spd:src.spd,
            acc:src.acc,dodge:src.dodge,size:src.size,aiStyle:src.aiStyle,isBoss:false,bossTitle:'',
            abilities:src.abilities,stats:{hp:src.hp,maxHp:src.hp,atk:src.atk,def:src.def,spd:src.spd,
            acc:src.acc,dodge:src.dodge,mdef:8,matk:6}};
        }
      }
      // Fallback / normal enemy
      if(!ed){
        const pool=ENEMIES.filter(e=>!e.isBoss);
        const tierBands=[[0,4],[4,9],[9,14],[14,19]];
        const [tlo,thi]=tierBands[Math.min(tier-1,3)];
        const sliced=pool.slice(tlo,Math.min(thi,pool.length));
        const src=sliced.length?sliced[Math.floor(Math.random()*sliced.length)]:pool[0];
        ed=JSON.parse(JSON.stringify(src));
      }
    }

  }
  const scaled=enemyScaleFactor(ed, G.stage, diffMult, G.bossKills||0);
  ed.hp=scaled.hp; ed.maxHp=scaled.maxHp;
  ed.atk=scaled.atk; ed.def=scaled.def; ed.spd=scaled.spd;
  ed.acc=scaled.acc; ed.dodge=scaled.dodge; ed.mdodge=scaled.mdodge;
  ed.mdef=scaled.mdef; ed.matk=scaled.matk;
  ed.stats = {hp:ed.hp, maxHp:ed.hp, atk:ed.atk, def:ed.def, spd:ed.spd, acc:ed.acc, dodge:ed.dodge, mdodge:ed.mdodge, mdef:ed.mdef, matk:ed.matk};
  const baseEnemyEnergy = ed.isBoss ? 6 : (ed.size==='xl'?5:ed.size==='large'?4:ed.size==='medium'?4:3);
  ed.energyMax=baseEnemyEnergy;
  ed.energy=baseEnemyEnergy;
  ed.energyRegen=0;
  G.enemy = ed;
  const stageEvt = {stage:G.stage, enemyId:G.enemy.id||G.enemy.name, isBoss:!!G.enemy.isBoss};
  AvianEvents.emit('stage:loaded', stageEvt);
  runModuleHook('onStageLoaded', stageEvt);
  if(!G.enemy.aiType) G.enemy.aiType=mapAiStyleToType(G.enemy.aiStyle);
  codexMark('enemies', G.enemy.id||G.enemy.name, 'seen');
  enforceAbilityCosts(G.player);
  applyBiomeModifiers();
  // Remove stat bonuses before resetting flags (avoid accumulating across battles)
  resetForNewBattle();
  // Reset Goose bruise accumulator per battle
  if(G.player._bruiseAcc!==undefined) G.player._bruiseAcc=0;
  // Reset battle stats
  resetBattleStats();
  // Clear any visual carry-overs from last battle
  document.getElementById('player-panel')?.classList.remove('player-danger');
  document.getElementById('enemy-panel')?.classList.remove('boss-phase-two');
  const pb=document.getElementById('boss-phase-banner');if(pb){pb.textContent='';pb.classList.remove('visible');}
  // Kookaburra ambush
  const bd2=BIRDS[G.player.birdKey||'sparrow'];
  if(bd2&&bd2.passive&&bd2.passive.onBattleStart) bd2.passive.onBattleStart(G.player);
  updateComboMeter();
  // Speed determines first turn
  const pSpd=G.player.stats.spd, eSpd=G.enemy.stats.spd;
  G.turn = pSpd >= eSpd ? 'player' : 'enemy';
  G.turnPhase = G.turn==='player'?TURN.PLAYER:TURN.ENEMY;
  G.phase = G.turn==='player' ? 'PLAYER' : 'ENEMY';
  if(G.turn==='player') startPlayerTurn(G.player);
  G.enemyNextAction = planEnemyAction();
  showScreen('screen-battle');
  document.getElementById('battle-log').innerHTML='';
  updateStageProgress();
  refreshBattleUI();
  if (G.enemy.isBoss) {
    const stageLabel = G.endlessMode && G.stage > ENEMIES.length
      ? `Endless Battle ${G.endlessBattle}` : `Stage ${G.stage}`;
    logMsg(`👑 ${G.enemy.bossTitle}: ${G.enemy.name} descends! [${stageLabel}]`,'boss');
    logMsg(`Defeat them for a guaranteed Epic reward!`,'system');
    SFX.boss(); doScreenShake(true);
  } else {
    logMsg(`⚔ Stage ${G.stage}: ${G.enemy.name} appears!`,'system');
  }
  if (G.turn==='enemy') {
    logMsg(`⚡ ${G.enemy.name} (SPD ${G.enemy.stats.spd}) is faster — they strike first!`,'miss');
    setTimeout(enemyTurn, 800);
  }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='screen-stork-shop' || id==='screen-grove'){
    const el=document.getElementById(id);
    if(el){
      el.scrollTop=0;
      el.scrollIntoView({behavior:'auto', block:'start'});
    }
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
    try{ window.scrollTo({top:0, behavior:'auto'}); }catch(_){ window.scrollTo(0,0); }
  }
  const evt={id};
  AvianEvents.emit('screen:change', evt);
  runModuleHook('onScreenChange', evt);
}

// ============================================================
//  UI
// ============================================================
function getAvatar(who)     { return document.getElementById(`${who}-avatar`); }
function getAvatarWrap(who) { return document.getElementById(`${who}-avatar-wrap`); }
function getPanel(who)      { return document.getElementById(`${who}-panel`); }

function refreshBattleUI() {
  const p = G.player.stats;
  document.getElementById('player-name').textContent = G.player.name;
  document.getElementById('player-avatar').innerHTML = renderEntityAvatarHTML(G.player, 'battle');
  setHpBar('player', p.hp, p.maxHp);

  document.getElementById('enemy-name').innerHTML = G.enemy.name + (G.enemy.isBoss?`<span class="boss-crown">👑</span>`:'');
  const ep = getPanel('enemy');
  ep.className = 'combatant-panel enemy' + (G.enemy.isBoss?' boss-panel':'');
  const en = document.getElementById('enemy-name');
  en.className = 'combatant-name' + (G.enemy.isBoss?' boss-name':'');
  if(G.enemy.birdKey&&BIRDS[G.enemy.birdKey]){
    const enemyBird = Object.assign({}, BIRDS[G.enemy.birdKey], G.enemy, { portraitKey: BIRDS[G.enemy.birdKey].portraitKey || G.enemy.portraitKey });
    document.getElementById('enemy-avatar').innerHTML = renderEntityAvatarHTML(enemyBird, 'battle');
    document.getElementById('enemy-avatar').style.fontSize='';
  }else if(G.enemy.portraitKey){
    document.getElementById('enemy-avatar').innerHTML = renderEntityAvatarHTML(G.enemy, 'battle');
    document.getElementById('enemy-avatar').style.fontSize='';
  }else{
    document.getElementById('enemy-avatar').textContent = G.enemy.emoji;
    document.getElementById('enemy-avatar').style.fontSize='3.8rem';
  }
  setHpBar('enemy', G.enemy.stats.hp, G.enemy.stats.maxHp);

  document.getElementById('level-label').textContent = `STAGE ${G.stage}`;
  document.getElementById('turn-label').textContent = G.turn==='player'?`🟢 Your Turn · EN ${G.player.energy}/${G.player.energyMax}`:'🔴 Enemy Turn';
  document.getElementById('bird-lv-label').textContent = `Lv.${G.player.birdLevel}`;

  // EXP bar
  const needed = expForLevel(G.player.birdLevel+1);
  const pct = Math.min(G.player.exp/needed*100,100);
  document.getElementById('exp-bar').style.width = pct+'%';
  document.getElementById('exp-txt').textContent = `${G.player.exp} / ${needed}`;

  // Stats
  // Compute effective stats with buffs for display
  const _baseBird=BIRDS[G.player.birdKey];
  const _baseSt=_baseBird?_baseBird.stats:{};
  function _statSpan(label,val,baseVal,suffix=''){
    const diff=val-(baseVal||val);
    let color='var(--silver)',arrow='';
    if(diff>0){color='#6ab89a';arrow=' ↑';}
    else if(diff<0){color='var(--red-light)';arrow=' ↓';}
    return `<div class="stat-mini">${label} <span style="color:${color}">${val}${suffix}${arrow}</span></div>`;
  }
  const _effDef=p.def+(G.battleHymnActive?G.battleHymnDEF:0);
  const _effAcc=Math.min(100,p.acc+(G.battleHymnActive?G.battleHymnACC:0));
  const _effDodge=getEffectiveDodge(G.player);
  const _effMDodge=getEffectiveMdodge(G.player);
  const _trendTag = (diff) => diff>0 ? '<small class="stat-trend up">↑</small>' : (diff<0 ? '<small class="stat-trend down">↓</small>' : '');
  const _atkDiff = G.warcryActive ? 1 : (G.playerStatus.weaken ? -1 : 0);
  const _atkColor=G.warcryActive?'#6ab89a':G.playerStatus.weaken?'var(--red-light)':'var(--silver)';
  const _effAtk=G.warcryActive?Math.floor(p.atk*(1+G.warcryATK/100)):p.atk;
  const _critChance = Math.min(100,(p.critChance||5)+(G.playerStatus.burning>0?20:0));
  const _critMult = p.goldCritMult||1.8;
  document.getElementById('player-stats-mini').innerHTML =
    `<div class="stat-mini stat-atk">ATK <span style="color:${_atkColor}">${_effAtk}${_trendTag(_atkDiff)}</span></div>
     <div class="stat-mini stat-def">DEF <span style="color:${_effDef>p.def?'#6ab89a':'var(--silver)'}">${_effDef}${_trendTag(_effDef-p.def)}</span></div>
     <div class="stat-mini stat-spd">SPD <span>${p.spd}</span></div>
     <div class="stat-mini stat-dodge" title="Physical Dodge">Dodge <span style="color:${_effDodge>p.dodge?'#6ab89a':_effDodge<p.dodge?'var(--red-light)':'var(--silver)'}">${_effDodge}%${_trendTag(_effDodge-p.dodge)}</span></div>
     <div class="stat-mini stat-magic" title="Magic Dodge — deflects enemy spells">✦Dodge <span style="color:${_effMDodge>getBaseMdodge(G.player)?'#6ab89a':'#6ae8e8'}">${_effMDodge}%${_trendTag(_effMDodge-getBaseMdodge(G.player))}</span></div>
     <div class="stat-mini stat-acc">ACC <span style="color:${_effAcc>p.acc?'#6ab89a':_effAcc<p.acc?'var(--red-light)':'var(--silver)'}">${_effAcc}%${_trendTag(_effAcc-p.acc)}</span></div>
     <div class="stat-mini stat-crit" title="Crit Chance">🎯CC <span style="color:${_critChance>5?'#6ab89a':'var(--silver)'}">${_critChance}%${_trendTag(_critChance-5)}</span></div>
     <div class="stat-mini stat-crit" title="Crit Damage">💥CD <span style="color:${_critMult>1.5?'#e8c96a':'var(--silver)'}">${_critMult.toFixed(1)}×</span></div>
     <div class="stat-mini" title="Magic Attack — improves spell/ailment potency" style="color:#6ae8e8">✦ATK <span>${p.matk||8}</span></div>
     <div class="stat-mini" title="Magic Defence — resists enemy spells and ailments" style="color:#6ae8e8">✦DEF <span>${p.mdef||8}</span></div>`;

  // Enemy stats display
  const ep2=G.enemy.stats;
  const sizeLabel={tiny:'Tiny',small:'Small',medium:'Medium',large:'Large',xl:'XL'}[G.enemy.size]||'?';
  document.getElementById('enemy-stats-mini').innerHTML =
    `<div class="est stat-atk">ATK <span>${ep2.atk}</span></div>
     <div class="est stat-def">DEF <span>${ep2.def}</span></div>
     <div class="est stat-spd">SPD <span>${ep2.spd}</span></div>
     <div class="est stat-dodge">Dodge <span>${ep2.dodge||0}%</span></div>
     <div class="est stat-acc">ACC <span>${ep2.acc||70}%</span></div>
     <div class="est">Size <span>${sizeLabel}</span></div>
     <div class="est stat-magic" title="Magic Attack">✦ATK <span>${ep2.matk||6}</span></div>
     <div class="est stat-magic" title="Magic Defence">✦DEF <span>${ep2.mdef||8}</span></div>`;
  // Enemy abilities
  const eal=document.getElementById('enemy-abilities-list'); eal.innerHTML='';
  (G.enemy.abilities||[]).forEach(abKey=>{
    const eab=ENEMY_ABILITY_POOL[abKey];
    if(eab){const t=document.createElement('span');t.className='enemy-ab-tag';t.textContent=eab.name;
      const low=Math.max(1,Math.floor((G.enemy.stats.atk||8)*0.8));
      const high=Math.max(low,Math.floor((G.enemy.stats.atk||8)*1.2));
      t.title=`${eab.name} — ${eab.desc||'Enemy ability'}
Estimated damage: ${eab.dmg||(`${low}-${high}`)}`;
      t.addEventListener('mouseenter',e=>showTooltip(e,t.title,e.clientX+12,e.clientY+12));
      t.addEventListener('mousemove',e=>moveTooltip(e.clientX+12,e.clientY+12));
      t.addEventListener('mouseleave',hideTooltip);
      eal.appendChild(t);}
  });

  renderStatuses('player-status', G.playerStatus);
  renderStatuses('enemy-status', G.enemyStatus);
  renderPassiveBadge();
  // Boss rage indicator
  const enp=document.getElementById('enemy-panel');
  if(G.enemy.isBoss&&G.enemyRageActive){
    if(!document.getElementById('boss-rage-bar')){
      const rb=document.createElement('div');rb.id='boss-rage-bar';rb.className='boss-rage-bar';
      enp.insertBefore(rb,enp.firstChild);
    }
    if(!document.getElementById('boss-rage-badge')){
      const badgeEl=document.getElementById('enemy-name');
      const rb2=document.createElement('span');rb2.id='boss-rage-badge';rb2.className='rage-badge';rb2.style.marginLeft='8px';rb2.textContent='RAGE';
      badgeEl.appendChild(rb2);
    }
  }

  document.getElementById('player-shield-overlay').className='shield-overlay'+(G.playerStatus.defending>0?' active':'');
  document.getElementById('enemy-shield-overlay').className='shield-overlay'+(G.enemyStatus.defending>0?' active':'');

  renderEnemyPlan();
  renderActions();
}

function setHpBar(who,hp,max) {
  const pct=Math.max(0,hp/max*100);
  const bar=document.getElementById(`${who}-hp-bar`);
  bar.style.width=pct+'%';
  bar.className='hp-bar-fill'+(pct<25?' low':pct<50?' mid':'');
  document.getElementById(`${who}-hp-text`).textContent=`${Math.max(0,hp)}/${max}`;

  // Danger pulse on player panel when low HP
  if(who==='player') {
    const panel=document.getElementById('player-panel');
    if(pct<25) panel.classList.add('player-danger');
    else panel.classList.remove('player-danger');
  }

  // Boss phase-two glow + warning banner when boss drops below 50%
  if(who==='enemy'&&G.enemy&&G.enemy.isBoss) {
    const ep=document.getElementById('enemy-panel');
    const banner=document.getElementById('boss-phase-banner');
    if(pct<50&&pct>0) {
      ep.classList.add('boss-phase-two');
      if(banner){banner.textContent='⚡ ENRAGED — PHASE TWO ⚡';banner.classList.add('visible');}
    } else {
      ep.classList.remove('boss-phase-two');
      if(banner){banner.textContent='';banner.classList.remove('visible');}
    }
  }
}

function renderStatuses(id, statuses) {
  const el=document.getElementById(id); el.innerHTML='';
  const owner = id === 'player-status' ? 'player' : 'enemy';
  const ownerStats = owner === 'player' ? G?.player?.stats : G?.enemy?.stats;
  const poisonCap = G?.player ? (G.player.poisonCap||5) : 5;
  const nextTickInfo = (key, value) => {
    if(key==='poison' && value?.stacks>0) {
      const mult = owner === 'player' ? (G?.player?.poisonTickMult || 1) : 1;
      return `Next tick: ${Math.max(1, Math.floor(value.stacks * mult))} damage.`;
    }
    if(key==='bleed' && value?.stacks>0){
      return `Next tick: ${Math.max(1, Math.floor(value.stacks * 1.5))} damage.`;
    }
    if(key==='burning' && ownerStats?.maxHp){
      return `Next tick: ${Math.max(1, Math.floor(ownerStats.maxHp * 0.04))} damage.`;
    }
    if(key==='delayed' && value?.dmg){
      return `Next tick: ${Math.max(1, Math.floor(value.dmg))} damage.`;
    }
    return '';
  };
  const detailText = (key, value, summary='') => {
    const turns = typeof value==='number' ? value : (value?.turns ?? null);
    const stacks = typeof value==='object' && typeof value?.stacks==='number' ? value.stacks : null;
    const bits = [];
    if(turns!==null) bits.push(`Duration: ${turns} turn${turns===1?'':'s'}.`);
    if(stacks!==null) bits.push(`Stacks: ${stacks}.`);
    const next = nextTickInfo(key, value);
    if(next) bits.push(next);
    if(summary) bits.push(summary);
    return bits.join(' ');
  };
  Object.entries(statuses).forEach(([k,v])=>{
    if (!v && v!==0) return;
    if (v===0 || (typeof v==='object' && !v.turns && !v.stacks && !v.dmg)) return;
    const b=document.createElement('span');
    b.className=`status-badge ${k}`;
    let tooltipSummary='';
    if (k==='poison') { b.textContent=`☣ Flu×${v.stacks}/${poisonCap}(${v.turns}t)`; tooltipSummary='Inflicts poison damage over time.'; }
    else if (k==='bleed') { b.className='status-badge bleed'; b.textContent=`🩸 Bleed×${v.stacks}(${v.turns}t)`; tooltipSummary='Physical damage over time that scales with stacks.'; }
    else if (k==='weaken') { b.textContent=`🐔 Weaken(${v}t)`; }
    else if (k==='paralyzed') { b.textContent=`⚡ Para(${v}t)`; }
    else if (k==='burning') { b.textContent=`🔥 Burn(${v}t)`; }
    else if (k==='delayed') { b.textContent=`🎵 Resonance(${v.dmg}dmg)`; }
    else if (k==='confused') { b.className='status-badge confused'; b.textContent=`🌀 Confused(${v.turns}t,${v.skipChance}%)`; }
    else if (k==='tookie') { b.className='status-badge stunned'; b.textContent=`🦜 Tookie(+${v.atkBonus}%atk,${v.turns}t)`; }
    else if (k==='humDodge') { b.className='status-badge evading'; b.textContent=`🎵 Hum+${v.bonus}%(${v.turns}t)`; }
    else if (k==='flamingoATK') { b.className='status-badge buffed'; b.textContent=`🦩 +20%ATK(${v.turns}t)`; }
    else if (k==='lastStandBuff') { b.className='status-badge crit'; b.textContent=`🦅 LstStnd+${v.atkBonus}ATK(${v.turns}t)`; }
    // MDodge card bonus badge (only shown when non-zero)
    else if (k==='mdodgeCard' && v>0) { b.className='status-badge evading'; b.textContent=`✦${v}%MDdg`; }
    else if (k==='warcry') { b.className='status-badge stunned'; b.textContent=`🎺 Warcry+${v.atkBonus}%(${v.turns}t)`; }
    else if (k==='battleHymn') { b.className='status-badge evading'; b.textContent=`🎼 Hymn(${v.turns}t)`; }
    else if (k==='stunned') { b.className='status-badge stunned'; b.textContent=`😵 Stunned(${v}t)`; }
    else if (k==='mud') { b.className='status-badge delayed'; b.textContent=`🟤 Slowed(${v.turns}t)`; }
    else if (k==='slow') { b.className='status-badge slow'; b.textContent=`🐌 Slow(${v.turns}t,-${v.spdPenalty} SPD,-${v.dodgePenalty}% DODGE)`; }
    else if (k==='feared') { b.className='status-badge feared'; b.textContent=`😨 Feared(${v}t)`; }
    else if (k==='lullabied') { b.className='status-badge lullabied'; b.textContent=`💤 Lulled(${v}t)`; }
    else if (k==='evading') { b.className='status-badge evading'; b.textContent=`💨 Evade(${v}t)`; }
    else if (k==='defending') { b.className='status-badge defending'; b.textContent=`🛡 Block(${v}t)`; }
    else if (k==='dustDevil') { b.className='status-badge feared'; b.textContent=`🌪 Blinded(${v.turns}t,-${v.accDrop||15}%ACC)`; }
    else if (k==='featherRuffle') { b.className='status-badge weaken'; b.textContent=`🪶 Ruffled(${v.turns}t,-${v.atkReduction}%ATK${v.accDrop>0?',-'+v.accDrop+'%ACC':''})`; }
    else if (k==='hum') { b.className='status-badge evading'; b.textContent=`🎵 Hum(${v}t)`; }
    else if (k==='rockDrop') { b.className='status-badge delayed'; b.textContent=`🪨 Rock Ready`; }
    else if (k==='flyby') { b.className='status-badge evading'; b.textContent=`💨 Momentum!`; }
    else if (k==='countering') { b.className='status-badge defending'; b.textContent=`⚔ Counter(${v.turns||0}t)`; }
    else if (k==='defBoost') { b.className='status-badge defending'; b.textContent=`🧱 DEF+${v.amt}(${v.turns}t)`; }
    else if (k==='parry') { b.className='status-badge evading'; b.textContent=`🗡 Parry(${v}t)`; }
    else if (k==='enemyBlind') { b.className='status-badge feared'; b.textContent=`👁 Blind(${v}t)`; }
    else if (k==='sittingDuck') { b.className='status-badge feared'; b.textContent=`🦆 Duck!(Dodge=0%)`; }
    else if (k==='wingClip') { b.className='status-badge feared'; b.textContent=`✂ Clipped(${v.turns}t,-${v.spdRedux}SPD)`; }
    else if (k==='sonicSkip') { b.className='status-badge paralyzed'; b.textContent=`🔊 Dirge(${v.turns}t,${v.chance}%skip)`; }
    else { return; }
    b.title=b.textContent.replace(/\s+/g,' ').trim();
    b.dataset.statusId = k;
    b.dataset.statusDetail = detailText(k, v, tooltipSummary);
    el.appendChild(b);
  });
}




function renderEnergyOrbs(){
  const el=document.getElementById('energy-orbs');
  if(!el||!G?.player) return;
  el.innerHTML='';

  const total = Math.max(0, G.player.energyMax||0);
  const cur = Math.max(0, Math.min(total, G.player.energy||0));
  const bonus = Math.max(0, G.player.energyBonus||0);
  const base = Math.max(0, total - bonus);
  const gainedNow = Math.max(0, G.player._newBonusEnergyFlash||0);

  el.classList.add('energy-summary');
  el.title = `Energy: ${cur}/${total}\nBase: ${base}\nBonus: +${bonus}`;

  for(let i=0;i<total;i++){
    const orb=document.createElement('span');
    const isBonus = i>=base;
    const bonusIdx = isBonus ? (i-base) : -1;
    const isSpent = i>=cur;
    orb.className='energy-orb'
      +(isBonus?' bonus':'')
      +((isBonus && bonusIdx >= Math.max(0, bonus-gainedNow))?' new-bonus':'')
      +(isSpent?' spent':'');
    el.appendChild(orb);
  }

  if(gainedNow>0){
    clearTimeout(G.player._bonusEnergyFlashTimer);
    G.player._bonusEnergyFlashTimer = setTimeout(()=>{
      if(G?.player){
        G.player._newBonusEnergyFlash = 0;
        renderEnergyOrbs();
      }
    }, 2600);
  }

  const txt=document.getElementById('energy-text');
  if(txt) txt.textContent=`Energy ${cur}/${total}`;
}

function lockActionUI(locked){
  const grid=document.getElementById('actions-grid');
  if(!grid) return;
  grid.querySelectorAll('button').forEach(b=>b.disabled=!!locked);
}

function canPlayerAct(){
  return G.phase==='PLAYER'&&G.turnPhase===TURN.PLAYER&&!G.actionBusy&&!G.animLock;
}

function renderEnemyPlan(){
  const host=document.getElementById('enemy-intent-panel');
  if(!host || !G.enemy) return;
  const planned=(G.enemyNextAction&&Array.isArray(G.enemyNextAction.actions)) ? G.enemyNextAction.actions.slice(0,MAX_ENEMY_ACTIONS_PER_TURN) : [];
  const live=(G.enemyLastPlan||[]).slice(0,MAX_ENEMY_ACTIONS_PER_TURN);
  const plan=(G.turnPhase===TURN.ENEMY && live.length) ? live : planned;
  const maxE=Math.max(0,G.enemy.energyMax||3);
  const curE=(G.turnPhase===TURN.ENEMY) ? Math.max(0,G.enemy.energy||0) : maxE;
  const used=(G.turnPhase===TURN.ENEMY) ? Math.max(0,(G.enemyActionsThisTurn||0)) : 0;
  let label='🤔 Thinking...';
  let title='';
  if(G.enemyNextAction){
    label=G.enemyNextAction.label||'Enemy Plan';
    if(G.enemyNextAction.type==='plan'){
      const arr=(G.enemyNextAction.actions||[]).slice(0,2).map(a=>a.type==='ability'?(ENEMY_ABILITY_POOL[a.abilityId]?.name||a.abilityId):(a.label||a.type)).join(' → ');
      title=`Planned: ${arr}${(G.enemyNextAction.actions||[]).length>2?' +':''}`;
    } else if(G.enemyNextAction.type==='ability'){
      const eab=ENEMY_ABILITY_POOL[G.enemyNextAction.abilityId];
      title=eab?`${eab.name} — ${eab.desc||'Enemy ability'}
Estimated effect: ${eab.dmg||'special'}`:'';
    } else if(G.enemyNextAction.type==='strike'){
      const low=Math.max(1,Math.floor((G.enemy.stats.atk||8)*0.8));
      const high=Math.max(low,Math.floor((G.enemy.stats.atk||8)*1.2));
      title=`Basic Attack — physical hit
Estimated damage: ${low}-${high}`;
    }
  }
  const chips=plan.length ? plan.map((a,i)=>{
    const nm=a.type==='ability'?(ENEMY_ABILITY_POOL[a.abilityId]?.name||a.abilityId):(a.label||a.type);
    const icon=a.icon || (a.type==='strike'?'⚔':a.type==='heavy'?'💢':a.type==='defend'?'🛡':'✦');
    const cost=Number.isFinite(a.energyCost)?a.energyCost:getEnemyActionEnergyCost(a);
    return `<span class="intent-chip${i<used?' spent':''}">${icon} ${nm}<span class="intent-cost-sm">${cost}AP</span></span>`;
  }).join('') : '<span class="intent-chip wait">🤔 Planning</span>';
  const headCost=(plan[0] && Number.isFinite(plan[0].energyCost)) ? plan[0].energyCost : (plan[0] ? getEnemyActionEnergyCost(plan[0]) : 0);
  host.innerHTML=`<div class="intent-row"><span class="intent-name">${label}</span><span class="intent-meta">${headCost?`<span class="intent-cost">${headCost} AP</span>`:''}<span class="intent-ap">EN ${curE}/${maxE}</span></span></div><div class="intent-list">${chips}</div>`;
  host.title=title;
  if(title){
    host.onmouseenter=(e)=>showTooltip(e,title,e.clientX+10,e.clientY+10);
    host.onmousemove=(e)=>moveTooltip(e.clientX+10,e.clientY+10);
    host.onmouseleave=()=>hideTooltip();
  } else { host.onmouseenter=null; host.onmousemove=null; host.onmouseleave=null; }
}

function renderAllCombatUI(){
  renderEnergyOrbs();
  renderEnemyPlan();
  renderEnergyOrbs();
  renderEnemyPlan();
  renderActions();
  renderStatuses('player-status', G.playerStatus);
  renderStatuses('enemy-status', G.enemyStatus);
  setHpBar('player', G.player.stats.hp, G.player.stats.maxHp);
  setHpBar('enemy', G.enemy.stats.hp, G.enemy.stats.maxHp);
}

function enqueueAction(fn){
  G.actionQueue=G.actionQueue||[];
  G.actionQueue.push(fn);
  runActionQueue();
}

async function runActionQueue(){
  if(G.actionBusy) return;
  G.actionBusy=true;
  lockActionUI(true);

  try{
    while((G.actionQueue||[]).length){
      const fn=G.actionQueue.shift();
      try{
        await fn();
      }catch(err){
        console.error('Action failed:', err);

        G.animLock=false;
        G.actionQueue.length=0;

        if(G.player?.stats?.hp>0 && G.enemy?.stats?.hp>0 && !G.battleOver){
          G.phase='PLAYER';
          G.turnPhase=TURN.PLAYER;
          G.turn='player';
        }

        logMsg('⚠ Action failed (recovered). Check console.', 'miss');
      }

      if(!G.player||!G.enemy||G.battleOver) break;
      renderAllCombatUI();
    }
  } finally {
    G.actionBusy=false;
    if(G.phase==='PLAYER' && G.turnPhase===TURN.PLAYER){
      G.animLock=false;
      lockActionUI(false);
    }
    renderActions();
  }
}


// ============================================================
// FAILSAFE — prevents "stuck UI / no one's turn / dead clicks"
// ============================================================
function failsafeAdvance(reason='') {
  try {
    G.animLock = false;

    if (G.actionBusy) {
      G.actionBusy = false;
      G.actionQueue = [];
    }

    if (typeof lockActionUI === 'function') lockActionUI(false);

    if (G.player && G.enemy && !G.battleOver) {
      if (typeof TURN !== 'undefined') G.turnPhase = TURN.PLAYER;
      G.turn = 'player';
      G.phase = 'PLAYER';
    }

    if (typeof renderAllCombatUI === 'function') renderAllCombatUI();
    if (typeof refreshBattleUI === 'function') refreshBattleUI();
    if (typeof renderActions === 'function') renderActions();
    if (typeof renderEnergyOrbs === 'function') renderEnergyOrbs();

    // console.warn('[failsafeAdvance]', reason);
  } catch (e) {
    console.error('failsafeAdvance failed:', e);
  }
}

window.addEventListener('error', () => {
  try { failsafeAdvance('window.onerror'); } catch(_) {}
});
window.addEventListener('unhandledrejection', () => {
  try { failsafeAdvance('unhandledrejection'); } catch(_) {}
});


// ============================================================
// ON-SCREEN ERROR HUD (mobile-friendly)
// ============================================================
function installErrorHUD(){
  if (document.getElementById('error-hud')) return;

  const hud = document.createElement('div');
  hud.id = 'error-hud';
  hud.style.cssText = `
    position:fixed; left:8px; right:8px; bottom:8px;
    z-index:999999; font:12px/1.25 monospace;
    color:#fff; background:rgba(40,0,0,.92);
    border:1px solid rgba(255,120,120,.65);
    border-radius:12px; padding:10px;
    box-shadow:0 8px 24px rgba(0,0,0,.45);
    max-height:40vh; overflow:auto; display:none;
  `;

  hud.innerHTML = `
    <div style="display:flex; gap:8px; align-items:center; justify-content:space-between;">
      <div style="font-weight:700; letter-spacing:.08em; color:#ffb3b3;">
        ⚠ ERROR
      </div>
      <div style="display:flex; gap:6px;">
        <button id="eh-copy" style="padding:4px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;">Copy</button>
        <button id="eh-clear" style="padding:4px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;">Clear</button>
        <button id="eh-hide" style="padding:4px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;">Hide</button>
      </div>
    </div>

    <div id="eh-meta" style="margin-top:6px; opacity:.85;">
      (Errors will appear here)
    </div>

    <div id="eh-list" style="margin-top:8px; display:flex; flex-direction:column; gap:6px;"></div>

    <label style="display:flex; gap:8px; align-items:center; margin-top:10px; opacity:.9;">
      <input id="eh-autofix" type="checkbox" checked />
      Auto-recover (calls failsafeAdvance)
    </label>
  `;

  document.body.appendChild(hud);

  const list = hud.querySelector('#eh-list');
  const meta = hud.querySelector('#eh-meta');
  const btnHide = hud.querySelector('#eh-hide');
  const btnClear = hud.querySelector('#eh-clear');
  const btnCopy = hud.querySelector('#eh-copy');
  const chkAuto = hud.querySelector('#eh-autofix');

  const store = {
    max: 8,
    items: [],
  };

  function showHUD(){
    hud.style.display = 'block';
  }

  function escapeHtml(v){
    return String(v).replace(/[&<>"']/g, c=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
    }[c]));
  }

  function pushItem(kind, msg, src, line, col, stack){
    const time = new Date().toLocaleTimeString();
    const entry = {
      time, kind,
      msg: String(msg || ''),
      src: String(src || ''),
      line: line ?? '',
      col: col ?? '',
      stack: String(stack || ''),
    };
    store.items.unshift(entry);
    if(store.items.length > store.max) store.items.pop();

    meta.textContent = `${store.items.length} error(s) captured. Latest at ${time}.`;
    list.innerHTML = '';

    store.items.forEach(e=>{
      const box = document.createElement('div');
      box.style.cssText = `
        padding:8px; border-radius:10px;
        border:1px solid rgba(255,255,255,.18);
        background:rgba(255,255,255,.06);
      `;
      const loc = e.src ? `@ ${e.src}${e.line!==''?`:${e.line}`:''}${e.col!==''?`:${e.col}`:''}` : '';
      box.innerHTML = `
        <div style="opacity:.9"><strong>${e.kind}</strong> • ${e.time}</div>
        <div style="margin-top:4px">${escapeHtml(e.msg)}</div>
        ${loc ? `<div style="margin-top:4px; opacity:.75">${escapeHtml(loc)}</div>` : ''}
        ${e.stack ? `<details style="margin-top:6px; opacity:.9"><summary>stack</summary><pre style="white-space:pre-wrap;margin:6px 0 0 0">${escapeHtml(e.stack)}</pre></details>`:''}
      `;
      list.appendChild(box);
    });

    showHUD();

    if(chkAuto && chkAuto.checked){
      try{
        if(typeof failsafeAdvance === 'function') failsafeAdvance('ErrorHUD auto-recover');
      }catch(_){ }
    }
  }

  btnHide.onclick = ()=>{ hud.style.display='none'; };
  btnClear.onclick = ()=>{
    store.items = [];
    list.innerHTML = '';
    meta.textContent = '(Errors cleared)';
  };
  btnCopy.onclick = async ()=>{
    const text = store.items.map(e=>{
      return `[${e.time}] ${e.kind}: ${e.msg}\n${e.src}${e.line!==''?`:${e.line}`:''}${e.col!==''?`:${e.col}`:''}\n${e.stack}\n`;
    }).join('\n');
    try{
      await navigator.clipboard.writeText(text);
      meta.textContent = 'Copied to clipboard ✅';
    }catch(err){
      meta.textContent = 'Copy failed (clipboard not available on this device).';
      console.warn('Clipboard copy failed:', err);
    }
  };

  window.addEventListener('error', (ev)=>{
    const err = ev.error;
    pushItem(
      'Error',
      ev.message,
      ev.filename,
      ev.lineno,
      ev.colno,
      err && err.stack ? err.stack : ''
    );
  });

  window.addEventListener('unhandledrejection', (ev)=>{
    const r = ev.reason;
    pushItem(
      'PromiseRejection',
      r && r.message ? r.message : String(r),
      '',
      '',
      '',
      r && r.stack ? r.stack : ''
    );
  });

  window.showErrorHUD = ()=> showHUD();
}


function renderActions() {
  const grid=document.getElementById('actions-grid'); grid.innerHTML='';
  renderEnergyOrbs();
  const locked=!canPlayerAct();
  let allAbilities=[...G.player.abilities];
  const order={physical:0,ranged:1,spell:2,utility:3};
  allAbilities=allAbilities.sort((a,b)=>{
    return (order[a.btnType]??9)-(order[b.btnType]??9);
  });
  let autoQueued=G.autoQueuedAbilityId||null;
  if(autoQueued){
    const aq=G.player.abilities.find(x=>x.id===autoQueued);
    if(!aq||!canUseAbility(G.player,aq)){G.autoQueuedAbilityId=null;autoQueued=null;}
  }
  let _prevType=null;
  allAbilities.forEach((ab,idx)=>{
    if(_prevType!==ab.btnType){
      const h=document.createElement('div');h.style.cssText='grid-column:1/-1;font-size:.68rem;letter-spacing:.08em;color:var(--text-dim);margin:2px 0 0;padding-top:6px;border-top:1px dashed rgba(120,140,170,.25)';
      h.textContent=(ab.btnType==='physical'?'— PHYSICAL —':ab.btnType==='ranged'?'— RANGED —':ab.btnType==='spell'?'— MAGIC —':'— UTILITY —');
      grid.appendChild(h);
    }
    const btn=document.createElement('button');
    btn.className=`action-btn ${ab.btnType}`;
    if(_prevType!==null&&_prevType!==ab.btnType) btn.classList.add('type-sep');
    _prevType=ab.btnType;
    btn.setAttribute('data-ab-idx',idx);
    btn.setAttribute('data-ab-id',ab.id||'');
    const energyCost=syncAbilityEnergyCost(ab);
    let btnCostText=`${energyCost} EN`;
    let cdisabled=false;
    if (ab.id==='crowDefend') {
      btnCostText=G.crowDefendCooldown>0?`Cooldown:${G.crowDefendCooldown}t`:'Ready';
      cdisabled=G.crowDefendCooldown>0;
    }
    if (ab.id==='swoop') {
      btnCostText=G.swoopCooldown>0?`Cooldown:${G.swoopCooldown}t`:'Ready';
      cdisabled=G.swoopCooldown>0;
    }
    if (ab.id==='intimidate') {
      btnCostText=G.intimidateCooldown>0?`Cooldown:${G.intimidateCooldown}t`:'Ready';
      cdisabled=G.intimidateCooldown>0;
    }
    if (ab.id==='flyby') {
      btnCostText=G.flybyCharged?'Momentum ready!':'Build momentum';
    }
    if (ab.id==='rockDrop') {
      btnCostText=G.rockDropPending?'Drop armed!':btnCostText;
    }
    const genericCd=getAbilityCooldown(ab.id);
    if(genericCd>0){btnCostText=`Cooldown:${genericCd}t`;cdisabled=true;}
    if (ab.id==='sitAndWait' && G.sitAndWaitUsedThisTurn) { btnCostText='Used this turn'; cdisabled=true; }
    if (ab.id==='stickLance') {
      if (G.stickLanceStage===1) btnCostText='⚔ Strike now!';
      else if (G.stickLanceStage===-1) btnCostText='No stick found';
    }
    if(autoQueued&&ab.id!==autoQueued){cdisabled=true;btnCostText='Auto queued';}
    if(autoQueued&&ab.id===autoQueued){btnCostText='Auto queued';}
    if(!cdisabled && G.turnPhase===TURN.PLAYER && !canUseAbility(G.player,ab)){cdisabled=true;btnCostText=`${energyCost} EN (insufficient)`;}
    btn.disabled=locked||cdisabled;
    btn.title=`${ab.name}\nEnergy: ${energyCost}`;
    const ailDots=(ab.ailmentIds||[]).map(a=>`<div class="ail-dot ${a}"></div>`).join('');
    btn.innerHTML=`
      <span class="btn-name">${ab.name}</span>
      <span class="btn-type">${ab.type}</span>
      <span class="btn-cost">${btnCostText}</span>
      ${ab.level>1?`<span class="ab-lv-badge">Lv${ab.level}</span>`:''}
      ${ailDots?`<div class="ailment-icons">${ailDots}</div>`:''}
      <span class="kb-hint">[${idx+1}]</span>`;
    const currentAb = ()=> (G?.player?.abilities||[]).find(x=>x.id===ab.id) || ab;
    btn.onclick=()=>enqueueAction(()=>playerAction(currentAb(),true));
    // Tooltip - desktop hover + mobile tap toggle
    // Desktop: hover tooltips
    btn.addEventListener('mouseenter',e=>{if(!window._isTouchDevice)showActionTooltip(e,currentAb());});
    btn.addEventListener('mousemove',e=>{if(!window._isTouchDevice)moveTooltip(e);});
    btn.addEventListener('mouseleave',()=>{if(!window._isTouchDevice)hideTooltip();});
    // Mobile: long-press (500ms) shows tooltip; normal tap fires the action
    let _longPressTimer=null;
    btn.addEventListener('touchstart',e=>{
      window._isTouchDevice=true;
      // Start long-press timer - does NOT preventDefault so tap still fires click
      _longPressTimer=setTimeout(()=>{
        _longPressTimer=null;
        const touch=e.touches[0];
        const cur=currentAb();
        showActionTooltip({clientX:touch.clientX,clientY:touch.clientY},cur);
        document.getElementById('action-tooltip')._currentAbId=cur.id;
      },500);
    },{passive:true});
    btn.addEventListener('touchend',()=>{
      if(_longPressTimer){clearTimeout(_longPressTimer);_longPressTimer=null;}
    },{passive:true});
    btn.addEventListener('touchmove',()=>{
      if(_longPressTimer){clearTimeout(_longPressTimer);_longPressTimer=null;}
    },{passive:true});
    grid.appendChild(btn);
  });

  const endWrap=document.createElement('div');
  endWrap.style.cssText='grid-column:1/-1;margin-top:8px;padding-top:8px;border-top:1px dashed rgba(120,140,170,.25);display:flex;align-items:center;justify-content:space-between;gap:8px';
  const lbl=document.createElement('span');
  lbl.textContent='End Turn';
  lbl.style.cssText='font-size:.66rem;letter-spacing:.08em;color:var(--text-dim);text-transform:uppercase';
  const right=document.createElement('div');
  right.style.cssText='display:flex;gap:6px';
  const endBtn=document.createElement('button');
  endBtn.className='action-btn endturn-mini';
  endBtn.textContent='End Turn';
  endBtn.disabled=locked;
  endBtn.onclick=()=>endPlayerTurn();
  right.appendChild(endBtn);
  const mini=(ab)=>{
    const b=document.createElement('button');
    b.className='action-btn endturn-mini';
    b.textContent=ab.name;
    b.disabled=locked;
    b.onclick=()=>enqueueAction(()=>playerAction(ab,true));
    return b;
  };
  right.appendChild(mini({...ABILITY_SITTING_DUCK,level:1,energyCost:getEnergyCost({id:'sittingDuck',level:1})}));
  endWrap.appendChild(lbl);
  endWrap.appendChild(right);
  grid.appendChild(endWrap);
}

// ===== TOOLTIPS =====
function showActionTooltip(e,ab) {
  const tt=document.getElementById('action-tooltip');
  const tmpl=ABILITY_TEMPLATES[ab.id];
  if (!tmpl) return;
  const levels = Array.isArray(tmpl.levels) ? tmpl.levels : [];
  const lv=Math.max(1, Math.min(ab.level||1, levels.length||1));
  const lvData=levels[lv-1] || {desc: (ab.desc||tmpl.desc||'')};
  const miss=tmpl.baseMissChance!==undefined?Math.max(0,tmpl.baseMissChance-5*(lv-1)):null;
  const hit=miss!==null?100-miss:null;
  const hitClass=hit===null?'':(hit>=80?'tt-hit-great':hit>=55?'tt-hit-good':'tt-hit-bad');
  const energy=getEnergyCost(ab);
  const cooldown=getTemplateCooldown(ab);
  // Show actual dmg range based on current ATK/MATK when possible
  const pAtk=G.player?(G.player.stats.atk||0):0;
  const pMatk=G.player?(G.player.stats.matk||0):0;
  const scaleStat=(tmpl.btnType==='spell'||tmpl.type==='spell')?pMatk:pAtk;
  const dmgMult=tmpl.baseDmgMult!==undefined?tmpl.baseDmgMult+0.1*(lv-1):null;
  const dmgLow=dmgMult?Math.floor(scaleStat*0.8*dmgMult):null;
  const dmgHigh=dmgMult?Math.floor(scaleStat*1.2*dmgMult):null;
  const effectList=(ab.ailmentIds||[]).length?ab.ailmentIds.map(a=>a.replace(/_/g,' ')).join(', '):'—';
  let html=`<div class="tt-name">${tmpl.name}</div><div class="tt-type">${tmpl.type} · Lv${ab.level}</div>`;
  html+=`<div class="tt-row"><span class="tt-lbl">Energy</span><span class="tt-val">${energy}</span></div>`;
  html+=`<div class="tt-row"><span class="tt-lbl">Cooldown</span><span class="tt-val">${cooldown>0?cooldown+' turn'+(cooldown>1?'s':''):'None'}</span></div>`;
  if (hit!==null) html+=`<div class="tt-row"><span class="tt-lbl">Hit</span><span class="tt-val ${hitClass}">${hit}%</span></div>`;
  if (dmgLow!==null) html+=`<div class="tt-row"><span class="tt-lbl">Damage</span><span class="tt-val">${dmgLow}–${dmgHigh}</span></div>`;
  html+=`<div class="tt-row"><span class="tt-lbl">Effects</span><span class="tt-val">${effectList}</span></div>`;
  html+=`<div class="tt-desc">${lvData.desc}</div>`;
  if(window._isTouchDevice) html+=`<div style="text-align:right;margin-top:8px"><button onclick="hideTooltip()" style="background:rgba(201,168,76,.2);border:1px solid var(--gold);border-radius:4px;color:var(--gold);padding:2px 10px;cursor:pointer;font-size:.75rem;">✕ Close</button></div>`;
  tt.innerHTML=html;
  tt.style.display='block';
  positionTooltip(e);
}
function positionTooltip(e) {
  const tt=document.getElementById('action-tooltip');
  if(window._isTouchDevice){
    // Center on screen for mobile
    tt.style.left='50%'; tt.style.top='50%';
    tt.style.transform='translate(-50%,-50%)';
    tt.style.position='fixed';
  } else {
    tt.style.transform='';
    moveTooltip(e);
  }
}
// Accepts either (event) OR (x,y)
function moveTooltip(a,b) {
  const tt=document.getElementById('action-tooltip');
  let x,y;

  if(typeof a==='number'){
    x=a;
    y=(typeof b==='number')?b:0;
  } else if(a&&typeof a==='object'){
    x=a.clientX+14;
    y=a.clientY-10;
  } else {
    return;
  }

  if (x+260>window.innerWidth) x=x-260;
  if (y+160>window.innerHeight) y=y-160;

  tt.style.left=x+'px';
  tt.style.top=y+'px';
}

// Generic tooltip used by enemy intent panel, reward icons, etc.
function showTooltip(e,text,x,y){
  const tt=document.getElementById('action-tooltip');
  if(!tt) return;

  tt.innerHTML=`<div class="tt-desc">${text}</div>`;
  tt.style.display='block';

  if(typeof x==='number'&&typeof y==='number') moveTooltip(x,y);
  else moveTooltip(e);
}

function hideTooltip() {
  const tt=document.getElementById('action-tooltip');
  tt.style.display='none';
  tt._currentAbId=null;
  tt.style.transform='';
}

function getAbDesc(ab) {
  const tmpl=ABILITY_TEMPLATES[ab.id];
  if (!tmpl||!tmpl.levels) return ab.desc||'';
  const lv=Math.min(ab.level,tmpl.levels.length);
  return tmpl.levels[lv-1].desc;
}


function getAbilityCooldown(abId){
  return (G.abilityCooldowns&&G.abilityCooldowns[abId])?G.abilityCooldowns[abId]:0;
}

function getClassCooldownAdjustment(ab, player){
  const bd=BIRDS[player?.birdKey]||{};
  const cls=String(player?.class||bd.class||'knight').toLowerCase();
  const lv=player?.birdLevel||1;
  const t=ABILITY_TEMPLATES[ab.id]||ab||{};
  const kind=String(t.type||t.btnType||ab.type||ab.btnType||'').toLowerCase();

  // Class rhythm:
  // Mage/Bard: smoother spell cycles later
  // Summoner: summon/flood spells stay longer cooldown
  // Tank/Knight: defensive/utility tools smooth out later
  // Assassin/Ranger: attack buttons mostly keep their pace
  if(kind==='spell'){
    if((cls==='mage' || cls==='bard') && lv>=8) return -1;
    if(cls==='summoner' && /murmuration|swarm|summon|flock|wing\s*storm|wingStorm|mobSwarm/i.test(t.id||t.name||'')) return 1;
  }
  if(kind==='utility'){
    if((cls==='tank' || cls==='knight' || cls==='bard') && lv>=10) return -1;
  }
  return 0;
}

function getTemplateCooldown(ab){
  const t=ABILITY_TEMPLATES[ab.id];
  if(!t||!t.cooldownByLevel) return 0;
  const idx=Math.min((ab.level||1)-1,t.cooldownByLevel.length-1);
  let cd=Math.max(0,t.cooldownByLevel[idx]||0);

  const isSpell = (t.type==='spell' || t.btnType==='spell' || ab.type==='spell' || ab.btnType==='spell');
  const isUlt = !!(ab.isUltimate) || /ultimate|verdict|cataclysm|apex/i.test(t.name||ab.name||'');

  if(isSpell){
    // Normal spells: 1–3 turns. Ult spells: 3–5 turns.
    cd = isUlt ? clamp(cd,3,5) : clamp(cd,1,3);
  }

  // Class-specific pacing
  cd += getClassCooldownAdjustment(ab, G.player);

  // Never below 1 turn if the ability uses cooldowns
  if(t.cooldownByLevel && (t.cooldownByLevel[idx]||0) > 0){
    cd = Math.max(1, cd);
  }

  return cd;
}
function setAbilityCooldown(ab){
  const cd=getTemplateCooldown(ab);
  if(cd>0){ if(!G.abilityCooldowns) G.abilityCooldowns={}; G.abilityCooldowns[ab.id]=cd; }
}

function reduceOtherSpellCooldownsOnCast(usedAbId){
  const cls=(G.player?.class || BIRDS[G.player?.birdKey]?.class || '').toLowerCase();
  const isCaster = (cls==='mage' || cls==='bard' || cls==='summoner');
  if(!isCaster) return;

  // once per action
  G.playerTurnFlags = G.playerTurnFlags || {};
  if(G.playerTurnFlags._spellTempoUsedThisAction) return;
  G.playerTurnFlags._spellTempoUsedThisAction = true;

  if(!G.abilityCooldowns) return;
  for(const [id,cd] of Object.entries(G.abilityCooldowns)){
    if(id===usedAbId) continue;
    const t=ABILITY_TEMPLATES[id];
    const isSpell=(t?.type==='spell' || t?.btnType==='spell');
    if(!isSpell) continue;
    G.abilityCooldowns[id]=Math.max(0, cd-1);
  }
}

// ------------------ COOLDOWN NORMALIZER ------------------
function normalizeAbilityCooldownsForPlayer(p){
  if(!p?.abilities) return;
  p.abilities.forEach(ab=>{
    if(!ab||!ab.id) return;
    if(ab.id==='skipTurn'||ab.id==='sittingDuck'||ab.id==='endTurn') return;
    const isMagic=(ab.type==='magic'||ab.btnType==='magic'||/spell|hex|curse|arcane|shadow|storm/i.test(ab.name||''));
    const isUlt=/ultimate|verdict|cataclysm|apex/i.test(ab.name||'')||ab.isUltimate;
    const cd=(ab.cooldownMax??ab.cooldown??ab.baseCooldown??0);
    if(isMagic){
      const target=isUlt?clamp(cd||4,3,5):clamp(cd||2,1,3);
      ab.cooldownMax=target;
      if(ab.cooldown==null) ab.cooldown=0;
    } else {
      const target=isUlt?clamp(cd||3,2,5):clamp(cd||1,0,3);
      ab.cooldownMax=target;
      if(ab.cooldown==null) ab.cooldown=0;
    }
  });
}

function getPlayerPiercePctForAbility(ab){
  const cls=(G.player?.class || BIRDS[G.player?.birdKey]?.class || '').toLowerCase();
  const isAttack=(ab?.btnType==='attack'||ab?.type==='attack'||/strike|shot|peck|slash|talon|arrow|pierce/i.test(ab?.name||''));
  if(cls==='ranger'&&isAttack){
    return Math.max(ab?.piercePct||0,0.25);
  }
  return ab?.piercePct||0;
}

function applyRangerPassiveOnTurnStart(){
  if((G.player?.class||BIRDS[G.player?.birdKey]?.class||'').toLowerCase()!=='ranger') return;
  G.playerStatus.rangerFirstAttack=1;
}

function getCrowDefendCooldown(ab) {
  if (ab.level>=4) return 0;
  if (ab.level>=2) return 1;
  return 2;
}

function logMsg(msg,cls='') {
  const log=document.getElementById('battle-log');
  const d=document.createElement('div');
  d.className=`log-entry ${cls}`; d.textContent=msg;
  log.appendChild(d); log.scrollTop=log.scrollHeight;
}

// ============================================================
//  ANIMATION ENGINE
// ============================================================
function playAvatarAnim(who,cls,dur=600) {
  return new Promise(res=>{
    const el=getAvatar(who);
    el.classList.remove('do-smash-r','do-smash-l','do-hit','do-dodge-r','do-dodge-l','do-miss-r','do-miss-l','do-shield');
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(()=>{el.classList.remove(cls);res();},dur);
  });
}

function spawnFloat(who,text,cls) {
  const wrap=getAvatarWrap(who);
  const el=document.createElement('div');
  el.className=`float-number ${cls}`; el.textContent=text;
  wrap.appendChild(el); setTimeout(()=>el.remove(),1200);
}

function flashPanel(who,color) {
  const p=getPanel(who);
  p.classList.remove('flash-red','flash-blue');
  void p.offsetWidth;
  p.classList.add(`flash-${color}`);
  setTimeout(()=>p.classList.remove(`flash-${color}`),600);
}

async function doAttack(attacker,target,result) {
  const smash=attacker==='player'?'do-smash-r':'do-smash-l';
  const dodge_=target==='player'?'do-dodge-l':'do-dodge-r';
  const attackP=playAvatarAnim(attacker,smash,520);
  await delay(250);
  if (result.wasDodged) {
    playAvatarAnim(target,dodge_,560);
    spawnFloat(target,'Dodge!','fn-dodge');
    SFX.dodge();
    if(target==='player') BS.dodges++;
  } else {
    playAvatarAnim(target,'do-hit',420);
    flashPanel(target,target==='player'?'blue':'red');
    // Screen shake threshold: % of target's max HP
    const targetMaxHp = target==='enemy' ? G.enemy.stats.maxHp : G.player.stats.maxHp;
    const dmgPct = result.dmgDealt / targetMaxHp;
    // Urgency: pitch scales up as enemy HP drops (1.0 → 1.5 as enemy goes 100% → 0%)
    const enemyHpPct = target==='enemy' ? Math.max(0, G.enemy.stats.hp / G.enemy.stats.maxHp) : 1;
    const urgency = target==='enemy' ? 1 + (1 - enemyHpPct) * 0.5 : 1;
    if (result.isCrit) {
      spawnFloat(target,`💥 -${result.dmgDealt}!`,'fn-crit');
      SFX.crit(urgency);
      if(dmgPct>=0.25) doScreenShake(dmgPct>=0.50);
      if(target==='enemy'){ BS.crits++; G.runCrits++; }
    } else {
      spawnFloat(target,`-${result.dmgDealt}`,'fn-dmg');
      SFX.hit(urgency);
      if(dmgPct>=0.25) doScreenShake(dmgPct>=0.50);
    }
    if(target==='enemy'){ BS.dmgDealt+=result.dmgDealt; if(result.dmgDealt>BS.highestHit) BS.highestHit=result.dmgDealt; }
    if(target==='player'){ BS.dmgTaken+=result.dmgDealt; }
    if (result.wasBlocked) { setTimeout(()=>spawnFloat(target,'🛡','fn-dodge'),120); SFX.shield(); }
  }
  await attackP;
}

async function doMiss(attacker) {
  if(attacker==='player') registerMiss();
  const cls=attacker==='player'?'do-miss-r':'do-miss-l';
  spawnFloat(attacker,'Miss!','fn-miss');
  SFX.miss();
  await playAvatarAnim(attacker,cls,580);
}

async function doShield(who) {
  playAvatarAnim(who,'do-shield',660);
  spawnFloat(who,'🛡 Block','fn-dodge');
  SFX.shield();
  await delay(400);
}

async function doSpell(target,text) { spawnFloat(target,text,'fn-status'); SFX.spell(); await delay(450); }
async function doHeal(who,amt) {
  spawnFloat(who,`+${amt}`,'fn-heal');
  SFX.heal();
  if(who==='player'&&G.player){
    const _phbd=BIRDS[G.player.birdKey];
    if(_phbd&&_phbd.passive&&_phbd.passive.onHeal) _phbd.passive.onHeal(G.player,amt);
    setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);
  }
  await delay(400);
}
function delay(ms) {
  const speed=(G&&G.speed)?G.speed:1;
  return new Promise(r=>setTimeout(r,Math.max(0,Math.floor(ms/Math.max(0.25,speed)))));
}

// ============================================================
//  COMBAT MATH
// ============================================================
function roll(a,b){return Math.floor(Math.random()*(b-a+1))+a;}

// ============================================================
//  MDODGE SYSTEM — player magic evasion
// ============================================================
const SIZE_MDODGE = {tiny:70, small:60, medium:50, large:45, xl:40};

// Accuracy is fixed by bird traits (class + size), not level growth.
const BASE_ACC_BY_CLASS = {
  tank:74, knight:80, assassin:82, ranger:86, mage:78, bard:80, summoner:79,
};
const BASE_ACC_BY_SIZE = {tiny:2, small:1, medium:0, large:-1, xl:-2};

function getPlayerBaseAcc(){
  const bd=BIRDS[G.player?.birdKey]||{};
  const cls=bd.class||'knight';
  const size=G.player?.size||bd.size||'medium';
  const base=(BASE_ACC_BY_CLASS[cls]??80)+(BASE_ACC_BY_SIZE[size]??0);
  return Math.max(65,Math.min(90,base));
}
function getPlayerAccMod(){
  let mod=0;
  if(G.sitAndWaitActive) mod+=8;
  if(G.battleHymnActive) mod+=Math.floor((G.battleHymnACC||0)*0.5);
  if(G.humMissBonus>0) mod+=Math.floor((G.humMissBonus||0)*0.5);
  if((G.playerStatus?.burning||0)>0) mod+=(AILMENTS?.burning?.hitBonus||0);
  mod-=(G.playerStatus?.accDebuff||0);
  return mod;
}
function getPlayerEffectiveAcc(){
  return Math.max(0,getPlayerBaseAcc()+getPlayerAccMod());
}

const STAT_KEYS = ['maxHp','atk','def','matk','mdef','spd','dodge','mdodge'];
const SOFTCAP_K = {acc:120,dodge:120,mdodge:140};
const HIT_CLAMP = {min:0.15,max:0.95};
const CLASS_GROWTH_PROFILES = {
  tank:{maxHp:0.055,atk:0.010,def:0.050,matk:0.000,mdef:0.028,acc:0.010,spd:0.006,dodge:0.004,mdodge:0.004},
  knight:{maxHp:0.030,atk:0.028,def:0.045,matk:0.005,mdef:0.025,acc:0.022,spd:0.015,dodge:0.008,mdodge:0.008},
  assassin:{maxHp:0.010,atk:0.045,def:0.008,matk:0.000,mdef:0.008,acc:0.026,spd:0.045,dodge:0.012,mdodge:0.008},
  ranger:{maxHp:0.018,atk:0.028,def:0.010,matk:0.008,mdef:0.015,acc:0.045,spd:0.032,dodge:0.012,mdodge:0.010},
  mage:{maxHp:0.010,atk:0.000,def:0.008,matk:0.048,mdef:0.026,acc:0.022,spd:0.020,dodge:0.006,mdodge:0.012},
  bard:{maxHp:0.022,atk:0.015,def:0.022,matk:0.018,mdef:0.022,acc:0.022,spd:0.024,dodge:0.010,mdodge:0.010},
  summoner:{maxHp:0.022,atk:0.010,def:0.010,matk:0.038,mdef:0.024,acc:0.022,spd:0.015,dodge:0.009,mdodge:0.010},
};
function softCapChance(stat,k){return stat<=0?0:stat/(stat+k);}
function clamp01(v){return Math.max(0,Math.min(1,v));}
function getAccChance(acc){return softCapChance(Math.max(0,acc||0),SOFTCAP_K.acc);}
function getDodgeChance(dodge){return softCapChance(Math.max(0,dodge||0),SOFTCAP_K.dodge);}
function getMdodgeChance(mdodge){return softCapChance(Math.max(0,mdodge||0),SOFTCAP_K.mdodge);}
function calcHitChance(attAcc,defDodge,baseHit=0.72){
  const raw = baseHit + (getAccChance(attAcc)-getDodgeChance(defDodge));
  return Math.max(HIT_CLAMP.min,Math.min(HIT_CLAMP.max,raw));
}
function calcDefenseMultiplier(def){return 100/(100+Math.max(0,def||0));}

function applyClassGrowthOnLevelUp(){
  if(!G.player) return;

  const bd = BIRDS[G.player.birdKey] || {};
  const cls = (bd.class || 'knight').toLowerCase();
  const lvl = (G.player.birdLevel || 1);

  let hpFlat  = (lvl <= 10) ? 8 : 0;
  let hpPct   = (lvl <= 10) ? 0 : 0.04;
  let defFlat = (lvl <= 10) ? 1 : 0;
  let defPct  = (lvl <= 10) ? 0 : 0.02;
  let mdefFlat = (lvl <= 10) ? 1 : 0;
  let mdefPct  = (lvl <= 10) ? 0 : 0.02;

  if(cls === 'tank'){
    hpFlat += 2; hpPct += 0.01; defPct += 0.01; mdefPct += 0.01;
  } else if(cls === 'knight'){
    defPct += 0.01;
  } else if(cls === 'assassin'){
    hpFlat = Math.max(0, hpFlat - 2);
    hpPct  = Math.max(0, hpPct - 0.01);
    defFlat = Math.max(0, defFlat - 1);
    mdefFlat = Math.max(0, mdefFlat - 1);
  } else if(cls === 'mage' || cls === 'summoner'){
    mdefPct += 0.01;
  } else if(cls === 'bard'){
    hpFlat += 1;
  }

  if(G.player.stats.maxHp < 1) G.player.stats.maxHp = 1;
  if(G.player.stats.def == null) G.player.stats.def = 0;
  if(G.player.stats.mdef == null) G.player.stats.mdef = 0;
  if(G.player.stats.spd == null) G.player.stats.spd = 0;

  const oldMax = G.player.stats.maxHp;
  const hpGain = Math.max(1, Math.floor(oldMax * hpPct)) + hpFlat;
  G.player.stats.maxHp += hpGain;

  const defGain = Math.max(0, Math.floor(G.player.stats.def * defPct)) + defFlat;
  G.player.stats.def += defGain;

  const oldMdef = G.player.stats.mdef;
  const mdefGain = Math.max(0, Math.floor(oldMdef * mdefPct)) + mdefFlat;
  G.player.stats.mdef = oldMdef + mdefGain;

  if(cls === 'ranger' && lvl % 4 === 0){
    G.player.stats.spd += 1;
  }

  G.player.stats.hp = Math.min(G.player.stats.hp + hpGain, G.player.stats.maxHp);
}

// Apply one-time bonuses when stage changes
function applyGrowthStageTransition(p, fromStage, toStage){
  if(!p?.stats) return;

  if(toStage===GROWTH.JUVENILE){
    p.stats.maxHp += 5;
    p.stats.hp = Math.min(p.stats.hp + 5, p.stats.maxHp);
    p.stats.atk += 1;
    p.stats.def += 1;
    p.stats.spd = (p.stats.spd||0) + 1;
  }
  if(toStage===GROWTH.ADULT){
    p.stats.maxHp += 10;
    p.stats.hp = Math.min(p.stats.hp + 10, p.stats.maxHp);
    p.stats.atk += 2;
    p.stats.def += 1;
    p.stats.spd = (p.stats.spd||0) + 1;
  }

  const cls=(p.class || (BIRDS[p.birdKey]?.class) || '').toLowerCase();
  p.growthStage = toStage;

  if(cls==='assassin'){
    p.passiveCritBonus = (toStage===GROWTH.FLETCHLING)?0.15:(toStage===GROWTH.JUVENILE)?0.25:0.35;
    p.passiveBleedOnCrit = (toStage===GROWTH.JUVENILE)?1:((toStage===GROWTH.ADULT||toStage===GROWTH.APEX)?2:0);
  }
  if(cls==='tank'){
    p.guardBlockPct = (toStage===GROWTH.ADULT||toStage===GROWTH.APEX)?0.75:0.50;
  }
  if(cls==='mage'){
    p.spellAilmentEvery = (toStage===GROWTH.FLETCHLING)?4:3;
    p.spellAilmentDouble = (toStage===GROWTH.ADULT||toStage===GROWTH.APEX);
  }
  if(cls==='knight'){
    p.afterDefendPierce = (toStage===GROWTH.FLETCHLING)?0.0:0.25;
    if(toStage===GROWTH.ADULT||toStage===GROWTH.APEX) p.afterDefendAtkBuff = 2;
  }
  if(cls==='bard'){
    p.buffDurationPlus = 1;
    p.buffEchoPct = (toStage===GROWTH.JUVENILE||toStage===GROWTH.ADULT||toStage===GROWTH.APEX)?0.5:0;
  }
  if(cls==='ranger'){
    p.firstAttackBonusPct = (toStage===GROWTH.FLETCHLING)?0.30:(toStage===GROWTH.JUVENILE)?0.50:0.20;
    p.firstAttackEachTurn = (toStage===GROWTH.ADULT||toStage===GROWTH.APEX);
  }

  if(typeof logMsg==='function'){
    const nice = toStage.charAt(0).toUpperCase() + toStage.slice(1);
    logMsg(`🪶 Growth: ${BIRDS[p.birdKey]?.name || 'Bird'} became ${nice}!`, 'exp-gain');
  }
}

function checkGrowthStage(p){
  const prev = p.growthStage || getGrowthStageForLevel((p.birdLevel||1)-1);
  const next = getGrowthStageForLevel(p.birdLevel||1);
  if(prev!==next) applyGrowthStageTransition(p, prev, next);
  else p.growthStage = next;
}
function enemyScaleFactor(base, stage, diffMult, bossKills){
  const s=Math.max(1,stage);
  const isBoss=(s%10===0);
  const bossIndex=Math.floor((s-1)/10);

  // Smoother early curve, better late readability
  const growth=Math.pow(1.038,s-1);
  const hpStageMult=Math.pow(growth,1.12);
  const atkStageMult=Math.pow(growth,0.88);
  const defStageMult=Math.pow(growth,0.82);

  let hp=(base.hp||base.stats?.hp||1)*hpStageMult;
  let atk=(base.atk||base.stats?.atk||1)*atkStageMult;
  let def=(base.def||base.stats?.def||0)*defStageMult;
  let matk=(base.matk||base.stats?.matk||6)*atkStageMult;
  let mdef=(base.mdef||base.stats?.mdef||8)*defStageMult;
  let spd=(base.spd||base.stats?.spd||1)+Math.floor((s-1)/8);

  if(isBoss){
    const bossHPmult=1.55+0.10*bossIndex;
    const bossDMGmult=1.18+0.05*bossIndex;
    const bossDEFmult=1.12+0.03*bossIndex;
    hp*=bossHPmult;
    atk*=bossDMGmult; matk*=bossDMGmult;
    def*=bossDEFmult; mdef*=bossDEFmult;
  }

  hp*=1+bossKills*0.08;
  atk*=1+bossKills*0.03;
  def*=1+bossKills*0.03;
  matk*=1+bossKills*0.03;
  mdef*=1+bossKills*0.03;

  const diff=G.difficulty||'juvenile';
  if(diff==='predator'){
    hp*=1.16; atk*=1.10; matk*=1.10; def*=1.06; mdef*=1.06;
  } else if(diff==='murder'){
    hp*=1.34; atk*=1.18; matk*=1.18; def*=1.10; mdef*=1.10;
  } else {
    hp*=diffMult; atk*=diffMult; matk*=diffMult; def*=diffMult; mdef*=diffMult;
  }

  const accTarget=Math.min(90,70+Math.floor((s-1)/5));
  const dodgeTarget=Math.min(40,5+Math.floor((s-1)/7));
  const mdodgeTarget=Math.min(30,3+Math.floor((s-1)/9));
  const accRaw=Math.max((base.acc??base.stats?.acc??70),accTarget)+(isBoss?2:0);
  const dodgeRaw=Math.max((base.dodge??base.stats?.dodge??5),dodgeTarget)+(isBoss?2:0);
  const mdodgeBase=(base.mdodge??base.stats?.mdodge??base.dodge??base.stats?.dodge??3);
  const mdodgeRaw=Math.max(mdodgeBase,mdodgeTarget)+(isBoss?1:0);

  const acc=Math.max(60,Math.min(94,Math.floor(accRaw)));
  const dodge=Math.max(0,Math.min(42,Math.floor(dodgeRaw)));
  const mdodge=Math.max(0,Math.min(32,Math.floor(mdodgeRaw)));

  hp=Math.max(1,Math.floor(hp));
  atk=Math.max(1,Math.floor(atk));
  matk=Math.max(1,Math.floor(matk));
  def=Math.max(0,Math.floor(def));
  mdef=Math.max(0,Math.floor(mdef));
  spd=Math.max(1,Math.floor(spd));

  return {hp,maxHp:hp,atk,def,matk,mdef,spd,acc,dodge,mdodge};
}

function getBaseMdodge(p) {
  // MDodge base mirrors the bird's physical dodge stat
  return p.stats.mdodge || p.stats.dodge || 20;
}

// Physical dodge: base stat + active buff bonuses + card bonus (capped +5)
function getEffectiveDodge(p) {
  const cardBonus = Math.min(5, p.cardDodge || 0);
  const buffBonus = (G.playerStatus.humDodge&&G.playerStatus.humDodge.turns>0 ? G.playerStatus.humDodge.bonus : 0)
    + (G.playerStatus.battleHymnDodge&&G.playerStatus.battleHymnDodge.turns>0 ? G.playerStatus.battleHymnDodge.bonus : 0)
    + (G.playerStatus.evading>0&&G.playerStatus.evadeBonus ? G.playerStatus.evadeBonus : 0);
  if(G.playerStatus.sittingDuck) return 0;
  return Math.max(0, p.stats.dodge + buffBonus + cardBonus);
}

// Magic dodge: dedicated mdodge base stat + card bonus (capped +5)
// Hum partially applies (50% of dodge bonus), Sitting Duck disables
function getEffectiveMdodge(p) {
  const cardBonus = Math.min(5, p.cardMdodge || 0);
  const humBonus = G.playerStatus.humDodge&&G.playerStatus.humDodge.turns>0
    ? Math.floor((G.playerStatus.humDodge.bonus||0) * 0.5) : 0;
  if(G.playerStatus.sittingDuck) return 0;
  return Math.max(0, getBaseMdodge(p) + humBonus + cardBonus);
}
function chance(p){return Math.random()*100<p;}

// ------------------ STATUS HELPERS ------------------
function addStatus(obj,key,val,cap=99){ obj[key]=Math.min(cap,(obj[key]||0)+val); }
function setStatusMax(obj,key,val){ obj[key]=Math.max(obj[key]||0,val); }
function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }
function clampSkipChance(v){return Math.max(20,Math.min(35,Math.round(v||20)));}
function rollStunChance(v){return chance(Math.min(50,Math.max(0,v||0)));}
function applyEnemySlow(spdPenalty,dodgePenalty,turns){
  if(!G.enemyStatus.slow){
    const spdDrop=Math.min(spdPenalty,Math.max(0,(G.enemy.stats.spd||1)-1));
    G.enemy.stats.spd=Math.max(1,(G.enemy.stats.spd||1)-spdDrop);
    G.enemy.stats.dodge=Math.max(0,(G.enemy.stats.dodge||0)-dodgePenalty);
    G.enemyStatus.slow={turns,spdPenalty:spdDrop,dodgePenalty};
  }else{
    G.enemyStatus.slow.turns=Math.max(G.enemyStatus.slow.turns,turns);
    G.enemyStatus.slow.spdPenalty=Math.max(G.enemyStatus.slow.spdPenalty,spdPenalty);
    G.enemyStatus.slow.dodgePenalty=Math.max(G.enemyStatus.slow.dodgePenalty,dodgePenalty);
  }
}

function dealDamage(target,amount,isCrit=false,isMagic=false,srcAbility=null) {
  let dmg=Math.max(1,amount);
  const critMult=G.player.goldCritMult||1.5;
  if (isCrit) dmg=Math.floor(dmg*critMult);
  let wasBlocked=false;
  const def=target==='enemy'?G.enemyStatus.defending:G.playerStatus.defending;
  const defAb=G.player.abilities.find(a=>a.id==='crowDefend');
  let blockPct=0.4;
  if (defAb) {
    if (defAb.level>=4) blockPct=0.25;
    else if (defAb.level>=3) blockPct=0.35;
    else if (defAb.level>=2) blockPct=0.45;
  }
  if (def>0){dmg=Math.floor(dmg*blockPct);wasBlocked=true;}
  // Pierce DEF: reduce dmg-reduction effect by pierce % (applied to enemy hit)
  if(target==='enemy' && G._currentPiercePct>0 && !wasBlocked){
    const pierceBonus=Math.floor(G.player.stats.atk*(G._currentPiercePct/100));
    dmg=Math.max(1, dmg+pierceBonus);
    G._currentPiercePct=0;
  } else { G._currentPiercePct=0; }
  if (target==='player') {
    if(!isMagic) dmg=Math.max(1,Math.floor(dmg*calcDefenseMultiplier(G.player.stats.def||0)));
    else dmg=Math.max(1,Math.floor(dmg*calcDefenseMultiplier(G.player.stats.mdef||0)));
    const _bd=BIRDS[G.player.birdKey];
    const _p=_bd&&_bd.passive;
    if(isMagic){
      // Harpy: magicResist flat %
      if(_p&&_p.magicResist) dmg=Math.floor(dmg*(1-_p.magicResist));
      // Emperor Penguin: Blubber Coat scales with missing HP
      if(_p&&_p.onMagicHit){ const reduced=_p.onMagicHit(G.player,dmg); dmg=Math.max(1,reduced); }
    } else {
      // Physical resist (Goose Bruised Hide)
      if(_p&&_p.physicalResist) dmg=Math.floor(dmg*(1-_p.physicalResist));
    }
    const playerDodge = getEffectiveDodge(G.player);
    const enemyBaseAcc=Math.min(G.enemy.stats.acc||70, 95);
    const enemyAccDebuff=(G.enemyStatus.accDebuff||0)+(G.enemyStatus.enemyBlind>0?15:0);
    const effectiveAcc=Math.max(0, enemyBaseAcc - enemyAccDebuff);
    const hitChance=calcHitChance(effectiveAcc,playerDodge,0.72);
    if (Math.random()>=hitChance){
      const _pbd=BIRDS[G.player.birdKey]; if(_pbd&&_pbd.passive&&_pbd.passive.onDodge)_pbd.passive.onDodge(G.player);
      return {dmgDealt:0,wasDodged:true,wasBlocked:false,isCrit};
    }
    const bypassDeflect=!!G._incomingBypassesDeflect;
    if(G.playerStatus.parry&&G.playerStatus.parry>0){
      const isParryValid=(G._incomingAttackKind==='physical'||G._incomingAttackKind==='ranged')&&!bypassDeflect;
      const preParryDamage=dmg;
      if(isParryValid){
        const refl=Math.max(1,Math.floor(preParryDamage*(G.playerStatus.parryMult||2)));
        G.enemy.stats.hp-=refl; setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
        spawnFloat('enemy',`🗡-${refl}`,'fn-dmg');
        logMsg(`🗡 Parry reflected ${refl} damage!`,'system');
        dmg=Math.max(0,Math.floor(preParryDamage*(G.playerStatus.parryTakenMult??0.5)));
      } else {
        logMsg('🗡 Parry failed — enemy used magic/song.','miss');
      }
      G.playerStatus.parry=Math.max(0,(G.playerStatus.parry||1)-1);
      if(G.playerStatus.parry<=0){delete G.playerStatus.parry;delete G.playerStatus.parryLevel;delete G.playerStatus.parryMult;delete G.playerStatus.parryTakenMult;}
      renderStatuses('player-status',G.playerStatus);
    }
    G.player.stats.hp-=dmg;
    if(G.playerStatus.countering&&dmg>0){
      const c=G.playerStatus.countering;
      const back=Math.max(1,Math.floor(dmg*(c.mult||1.2)));
      G.enemy.stats.hp=Math.max(0,G.enemy.stats.hp-back);
      setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
      spawnFloat('enemy',`⚔-${back}`,'fn-crit');
      logMsg(`⚔ Counter retaliates for ${back}!`,'crit');
      c.turns=Math.max(0,(c.turns||1)-1);
      if(c.turns<=0) delete G.playerStatus.countering;
    }
    if(wasBlocked){
      const _blkbd=BIRDS[G.player.birdKey];
      if(_blkbd&&_blkbd.passive&&_blkbd.passive.onBlock)_blkbd.passive.onBlock(G.player);
      // Emu Rumble Strike: counter-attack on block (30% ATK)
      if(_blkbd&&_blkbd.passive&&_blkbd.passive.id==='rumbleStrike'){
        const ctrDmg=Math.max(1,Math.floor(G.player.stats.atk*0.30));
        G.enemy.stats.hp-=ctrDmg;
        spawnFloat('enemy',`⚡-${ctrDmg} Counter!`,'fn-dmg');
        setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
        logMsg(`🦆 Emu counter on block: ${ctrDmg} dmg!`,'system');
      }
      if(G.playerStatus.counterThorns){
        const thorn=Math.max(1,Math.floor(dmg*G.playerStatus.counterThorns));
        G.enemy.stats.hp=Math.max(0,G.enemy.stats.hp-thorn);
        setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
        spawnFloat('enemy',`🛡-${thorn}`,'fn-dmg');
        logMsg(`🛡 Defend thorns deal ${thorn}!`,'system');
      }
    }
    const _pbd2=BIRDS[G.player.birdKey]; if(_pbd2&&_pbd2.passive&&_pbd2.passive.onDamage)_pbd2.passive.onDamage(G.player,dmg);
    if(G.player._berserkerMode){if(!G.player._berserkDmgAcc)G.player._berserkDmgAcc=0;G.player._berserkDmgAcc+=dmg;while(G.player._berserkDmgAcc>=15){G.player._berserkDmgAcc-=15;G.player.stats.atk++;spawnFloat('player','⚔+1','fn-status');}}
  } else {
    if(!isMagic){
      const a=srcAbility||G._activePlayerAbility||null;
      let pierce=getPlayerPiercePctForAbility(a);
      if(G.playerStatus.rangerFirstAttack){
        pierce=Math.max(pierce,0.45);
        delete G.playerStatus.rangerFirstAttack;
      }
      const enemyDef=(G.enemy.stats.def||0);
      const effDef=Math.floor(enemyDef*(1-pierce));
      dmg=Math.max(1,Math.floor(dmg*calcDefenseMultiplier(effDef)));
    } else {
      dmg=Math.max(1,Math.floor(dmg*calcDefenseMultiplier(G.enemy.stats.mdef||0)));
    }
    if(G.comboReady&&!isCrit){isCrit=true;dmg=Math.max(1,Math.floor(dmg*(G.player.goldCritMult||1.5)));consumeCombo();logMsg('🔥 Combo Crit!','crit');}
    G.enemy.stats.hp-=dmg;
    if(G.enemy?.id==='duke_blakiston' && (G.enemyStatus.wardens||0)>0){
      G.enemyStatus.wardens-=1;
      const rr=Math.max(1,Math.floor((G.enemy.stats.atk||8)*0.15));
      G.player.stats.hp-=rr;
      spawnFloat('player',`-${rr}`,'fn-dmg');
      logMsg('🛡️ Warden retaliates!','boss');
      setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);
    }
    if(G.enemy.stats.hp<=0){
      G.enemy.stats.hp=0;
      setHpBar('enemy',0,G.enemy.stats.maxHp);

      // Prevent any further action; death flow handles transitions
      G.animLock=false;
      G.turnPhase=null;
      return {dmgDealt:dmg,wasDodged:false,wasBlocked,isCrit};
    }
    const _secbd=BIRDS[G.player.birdKey];
    if(_secbd&&_secbd.passive&&_secbd.passive.onPhysicalHit&&!isMagic) _secbd.passive.onPhysicalHit(G.player,G);
    const abType=(srcAbility?.btnType||srcAbility?.type||G._activePlayerAbility?.btnType||G._activePlayerAbility?.type||'');
    const canBleedHit = (abType==='physical' || abType==='ranged');
    const bleedFromCrit = isCrit ? ((G.player?.critBleed||0) + (G.player?.passiveBleedOnCrit||0)) : 0;
    if(canBleedHit && bleedFromCrit>0) applyAilment('enemy','bleed',bleedFromCrit);
    registerHit();
  }
  return {dmgDealt:dmg,wasDodged:false,wasBlocked,isCrit};
}

function pdmg(mult=1,ab=null) {
  let b=G.player.stats.atk;
  if (G.warcryActive) b=Math.floor(b*(1+G.warcryATK/100));
  if (G.sitAndWaitActive) b=Math.floor(b*1.25);
  if (G.tookieActive && G.playerStatus.tookie) b=Math.floor(b*(1+G.playerStatus.tookie.atkBonus/100));
  // Flamingo Balance Master ATK bonus
  if (G.playerStatus.flamingoATK&&G.playerStatus.flamingoATK.turns>0) b=Math.floor(b*1.20);
  const __adm=(G.actionDamageHitsRemaining&&G.actionDamageHitsRemaining>0)?(G.actionDamageMult||1):1;
  let base=Math.floor(roll(Math.floor(b*.8),Math.floor(b*1.2))*mult*__adm);
  if((G.actionDamageHitsRemaining||0)>0){ G.actionDamageHitsRemaining=Math.max(0,G.actionDamageHitsRemaining-1); if(G.actionDamageHitsRemaining===0) G.actionDamageMult=1; }
  if (G.playerStatus.weaken&&G.playerStatus.weaken>0) base=Math.floor(base*.75);
  // Pierce DEF: reduce enemy effective DEF before damage calc (store on G for dealDamage to read)
  if(ab){
    const tmpl=ABILITY_TEMPLATES[ab.id];
    const lv=Math.min(ab.level,4);
    const piercePct=(tmpl?.pierceDef||0) + (lv>=2?5:0) + (lv>=3?5:0); // scales per level
    G._currentPiercePct = piercePct;
    // Kiwi Probe Master: high HP bonus
    if(G.player.birdKey==='kiwi'&&G.enemy.stats.hp/G.enemy.stats.maxHp>0.75) base=Math.floor(base*1.10);
  } else {
    G._currentPiercePct=0;
  }
  return base;
}
// Check and consume combo crit — call before dealDamage for physical attacks
function checkComboCrit() {
  return consumeCombo(); // returns true if combo was ready (free crit)
}

function edmg(mult=1) {
  const b=G.enemy.stats.atk;
  const lull=G.enemyStatus.lullabied>0?.5:1;
  const weak=G.enemyStatus.weaken&&G.enemyStatus.weaken>0?.75:1;
  const ruffleReduct=G.enemyStatus.featherRuffle&&G.enemyStatus.featherRuffle.turns>0
    ?(1-(G.enemyStatus.featherRuffle.atkReduction||0)/100):1;
  let out=Math.floor(roll(Math.floor(b*.8),Math.floor(b*1.2))*mult*lull*weak*ruffleReduct);
  if((G.biomeMod?.lightningBonus||0)>0 && (G.enemy?.abilities||[]).includes('eStun')){
    out=Math.floor(out*(1+G.biomeMod.lightningBonus));
  }
  if((G.biomeMod?.enemyCritPlus||0)>0 && chance(Math.floor(G.biomeMod.enemyCritPlus*100))){
    out=Math.floor(out*1.4);
  }
  return out;
}

function getPlayerMissChance(ab) {
  const tmpl=ABILITY_TEMPLATES[ab.id];
  if (!tmpl) return 15;
  const lv=Math.min(ab.level,4);
  const baseMiss=tmpl.baseMissChance!==undefined?tmpl.baseMissChance:15;
  const perLvReduction=(tmpl.type==='physical')?0:4;
  const reduced=Math.max(0,baseMiss-perLvReduction*(lv-1));
  // Floor: risky high-miss moves can never fully negate their risk
  const floor=baseMiss>=35?12:baseMiss>=25?7:baseMiss>=15?3:0;
  // Accuracy bonuses
  let accBonus=0;
  if (G.sitAndWaitActive) accBonus+=25;
  if (G.battleHymnActive) accBonus+=G.battleHymnACC;
  if (G.humMissBonus>0) accBonus+=G.humMissBonus;
  const tookiePenalty = G.tookieActive && G.playerStatus.tookie ? G.playerStatus.tookie.missPen : 0;
  const bClass=(BIRDS[G.player.birdKey]&&BIRDS[G.player.birdKey].class)||'';
  const bSize=(G.player&&G.player.size)||'medium';
  const classAdj=(tmpl.type==='physical'&&bClass==='assassin')?-2:(tmpl.type==='ranged'&&bClass==='ranger')?-2:(tmpl.type==='spell'&&MAGIC_CLASSES.has(bClass))?-1:0;
  const sizeAdj=(tmpl.type==='physical'&&bSize==='xl')?2:(tmpl.type==='physical'&&bSize==='tiny')?-1:0;
  const missReduce=((G.player&&G.player.missReduce)||0)*100;
  return Math.max(floor, reduced - accBonus + tookiePenalty - (G.playerStatus.accDebuff||0) + classAdj + sizeAdj - missReduce);
}

function getPlayerAccuracy() {
  let acc = G.player.stats.acc||80;
  if (G.sitAndWaitActive) acc+=25;
  if (G.battleHymnActive) acc+=G.battleHymnACC;
  // accDebuff
  acc -= (G.playerStatus.accDebuff||0);
  return Math.min(acc,100);
}

// Check if player attack misses given ability miss chance + accuracy system
// Returns true if miss
function playerAttackMisses(ab) {
  const moveMiss = getPlayerMissChance(ab);
  return chance(moveMiss);
}

function getPlayerDmgMult(ab) {
  const tmpl=ABILITY_TEMPLATES[ab.id];
  if (!tmpl||!tmpl.baseDmgMult) return 1;
  return tmpl.baseDmgMult+0.1*(ab.level-1);
}

function getAilChance(ab,ailId) {
  const tmpl=ABILITY_TEMPLATES[ab.id];
  if (!tmpl||!tmpl.levels) return 0;
  const lvData=tmpl.levels[Math.min(ab.level-1,tmpl.levels.length-1)];
  if (lvData.newAilment===ailId) return lvData.ailChance||0;
  if (lvData.newAilment2===ailId) return lvData.ailChance2||0;
  if (lvData.newAilment3===ailId) return lvData.ailChance3||0;
  // Previous levels carry forward
  for (let i=0;i<Math.min(ab.level-1,tmpl.levels.length);i++) {
    const d=tmpl.levels[i];
    if (d.newAilment===ailId||d.newAilment2===ailId||d.newAilment3===ailId) {
      const introducedAt=i;
      const lvNow=Math.min(ab.level-1,tmpl.levels.length-1);
      const baseC=(d.newAilment===ailId?(d.ailChance||0):d.newAilment2===ailId?(d.ailChance2||0):(d.ailChance3||0));
      return baseC+5*(lvNow-introducedAt);
    }
  }
  return 0;
}

function tryApplyAilment(target,ailId,ab) {
  const c=getAilChance(ab,ailId);
  if (!c) return false;
  // Magic stat competition: attacker matk vs target mdef shifts probability
  const attackerMatk = target==='enemy' ? (G.player.stats.matk||8) : (G.enemy.stats.matk||8);
  const targetMdef   = target==='enemy' ? (G.enemy.stats.mdef||8)  : (G.player.stats.mdef||8);
  const magicShift   = (attackerMatk - targetMdef) * 1.5; // ±1.5% per point difference
  const adjusted     = Math.max(5, Math.min(95, c + magicShift));
  // Boss status resistance: 50% reduction
  const rollPct = (target==='enemy'&&G.enemy.isBoss) ? Math.max(5,Math.floor(adjusted*0.5)) : adjusted;
  if(!chance(rollPct)) return false;
  const stacks = (ailId==='poison' && G.player && G.player.poisonStacksPerHit)
    ? G.player.poisonStacksPerHit : 1;
  applyAilment(target,ailId,stacks);
  return true;
}

function applyAilment(target,ailId,stacks=1) {
  const status=target==='player'?G.playerStatus:G.enemyStatus;
  codexMark('statuses',ailId,'seen');
  // Check passive immunities when applying to player
  if(target==='player'&&G.player){
    const _bd=BIRDS[G.player.birdKey];
    const p=_bd&&_bd.passive;
    if(ailId==='poison'  && p&&p.immunePoison)  { spawnFloat('player','🛡 Poison Immune!','fn-status'); return false; }
    if(ailId==='weaken'  && p&&p.immuneWeaken)  { spawnFloat('player','🛡 Weaken Immune!','fn-status'); return false; }
    if(ailId==='feared'  && (p&&p.immuneFear||G.player.stats.immuneFear))  { spawnFloat('player','🛡 Fear Immune!','fn-status'); return false; }
    if(ailId==='confused'&& p&&p.immuneConfused){ spawnFloat('player','🛡 Confuse Immune!','fn-status'); return false; }
    if(ailId==='paralyzed'&&(p&&p.immuneStun||G.player.immuneParalyze))   { spawnFloat('player','🛡 Stun Immune!','fn-status'); return false; }
  }
  if (ailId==='poison' || ailId==='bleed') {
    const key = ailId==='bleed' ? 'bleed' : 'poison';
    if (!status[key]) status[key]={stacks:0,turns:3};
    const cap = G.player ? (G.player.poisonCap||5) : 5;
    const biomeBonus=(target==='player' && (G.biomeMod?.enemyPoisonPlus||0)>0)?G.biomeMod.enemyPoisonPlus:0;
    status[key].stacks=Math.min((status[key].stacks||0)+stacks+biomeBonus, cap);
    status[key].turns=3;
  } else if (ailId==='weaken') {
    status.weaken=3;
  } else if (ailId==='paralyzed') {
    status.paralyzed=3;
  } else if (ailId==='burning') {
    status.burning=3;
  } else if (ailId==='feared') {
    status.feared=(status.feared||0)+stacks;
  } else if (ailId==='delayed') {
    // set by caller with specific dmg
  }
  return true;
}

function getPlayerCritChance(ab) {
  let base = G.player.stats.critChance || 5;
  if (G.playerStatus.burning&&G.playerStatus.burning>0) base+=20;
  return base;
}

function getPlayerHitBonus(ab) {
  if (G.playerStatus.burning&&G.playerStatus.burning>0) return 20; // reduces miss chance
  return 0;
}

// Tick DoT at start of a target's turn
async function tickDoTs(who) {
  const status=who==='player'?G.playerStatus:G.enemyStatus;
  const stats=who==='player'?G.player.stats:G.enemy.stats;
  // Poison
  if (status.poison&&status.poison.stacks>0&&status.poison.turns>0) {
    const tickMult = who==='player' ? (G.player?.poisonTickMult||1) : 1;
    const dmg=Math.max(1, Math.floor(status.poison.stacks * tickMult));
    stats.hp-=dmg;
    spawnFloat(who,`☣ -${dmg}`,'fn-poison');
    setHpBar(who,stats.hp,stats.maxHp);
    logMsg(`☣ Avian Poison deals ${dmg} poison damage to ${who==='player'?G.player.name:G.enemy.name}!`,'poison-tick');
    if(who==='enemy') { BS.dmgDealt+=dmg; }
    SFX.poison();
    status.poison.turns--;
    if (status.poison.turns<=0) { delete status.poison; }
    await delay(500);
  }
  if (status.bleed&&status.bleed.stacks>0&&status.bleed.turns>0) {
    const dmg=Math.max(1,Math.floor(status.bleed.stacks*1.5));
    stats.hp-=dmg;
    spawnFloat(who,`🩸 -${dmg}`,'fn-dmg');
    setHpBar(who,stats.hp,stats.maxHp);
    logMsg(`🩸 Bleed deals ${dmg} damage to ${who==='player'?G.player.name:G.enemy.name}!`,'poison-tick');
    if(who==='enemy') { BS.dmgDealt+=dmg; }
    status.bleed.turns--;
    if (status.bleed.turns<=0) { delete status.bleed; }
    await delay(500);
  }
  if (status.burning && ((typeof status.burning==='number'&&status.burning>0) || (typeof status.burning==='object'&&status.burning.turns>0))) {
    const turns = typeof status.burning==='number' ? status.burning : status.burning.turns;
    const dmg=Math.max(1,Math.floor((stats.maxHp||1)*0.04));
    stats.hp-=dmg;
    spawnFloat(who,`🔥 -${dmg}`,'fn-burn');
    setHpBar(who,stats.hp,stats.maxHp);
    logMsg(`🔥 Burn deals ${dmg} damage to ${who==='player'?G.player.name:G.enemy.name}!`,'burn-tick');
    if(who==='enemy') { BS.dmgDealt+=dmg; }
    if(typeof status.burning==='number') status.burning=turns-1;
    else status.burning.turns=turns-1;
    if((typeof status.burning==='number'&&status.burning<=0) || (typeof status.burning==='object'&&status.burning.turns<=0)) delete status.burning;
    await delay(500);
  }
  // Delayed (Resonance)
  if (status.delayed&&status.delayed.dmg>0) {
    const dmg=status.delayed.dmg;
    stats.hp-=dmg;
    spawnFloat(who,`🎵 -${dmg}`,'fn-status');
    setHpBar(who,stats.hp,stats.maxHp);
    logMsg(`🎵 Resonance detonates! ${dmg} damage!`,'system');
    delete status.delayed;
    await delay(500);
  }
}

function tickStatuses(who) {
  const s=who==='player'?G.playerStatus:G.enemyStatus;
  const keys=Object.keys(s);
  const owner=who==='player'?G.player:G.enemy;
  keys.forEach(k=>{
    if (k==='poison' || k==='bleed') { /* handled by tickDoTs */ }
    else if (k==='delayed') { /* handled by tickDoTs */ }
    else if (k==='defBoost' && typeof s[k]==='object') {
      s[k].turns--;
      if(s[k].turns<=0){
        owner.stats.def=Math.max(0,(owner.stats.def||0)-(s[k].amt||0));
        delete s[k];
      }
    }
    else if (k==='counterThorns') { /* temporary per defending window */ }
    else if (typeof s[k]==='number'&&s[k]>0) s[k]--;
    else if (typeof s[k]==='object'&&s[k].turns!==undefined) { /* skip */ }
  });
  if(who==='player' && !s.defending && s.counterThorns) delete s.counterThorns;
}

// ============================================================
//  PLAYER ACTIONS
// ============================================================
const ACTIONS = {
  async mainAttack(ab) {
    const birdClass=(BIRDS[G.player.birdKey]&&BIRDS[G.player.birdKey].class)||'';
    const isMagicUser=MAGIC_CLASSES.has(birdClass);
    const missC=isMagicUser?20:Math.max(3,10-(G.player.birdLevel-1));
    if(chance(missC)){
      await doMiss('player');
      logMsg(`${isMagicUser?'Peck':'Main Attack'} missed!`,'miss');
      return;
    }
    const scaleByLevel=1+((G.player.birdLevel||1)-1)*0.08;
    const r=dealDamage('enemy',pdmg(1.0*scaleByLevel,ab),chance(getPlayerCritChance(ab)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    logMsg(`${isMagicUser?' Peck':'🗡 Main Attack'}: ${r.dmgDealt} damage${isMagicUser?' (20% fixed miss)':''}.`,'player-action');
  },
  async rapidPeck(ab) {
    const lv=ab.level;
    const minH=lv>=4?3:lv>=2?2:2, maxH=lv>=4?5:lv>=3?4:lv>=2?4:3;
    const dmgM=[.55,.65,.75,.85][lv-1];
    const critC=[8,12,16,22][lv-1];
    const hits=roll(minH,maxH);
    let landed=0,total=0;
    for(let i=0;i<hits;i++){
      if(playerAttackMisses(ab)){
        await doMiss('player');
        logMsg(`Rapid Peck chain broke on strike ${i+1}.`,'miss');
        break;
      }
      const isCrit=chance(critC)||chance(getPlayerCritChance(ab));
      const r=dealDamage('enemy',pdmg(dmgM,ab),isCrit);
      await doAttack('player','enemy',r);
      setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
      landed++; total+=r.dmgDealt;
      if(tryApplyAilment('enemy','poison',ab)){spawnFloat('enemy','☣ Flu!','fn-poison');}
      if(lv>=4&&tryApplyAilment('enemy','burning',ab)){spawnFloat('enemy','🔥 Burn!','fn-burn');}
      if(r.isCrit)spawnFloat('enemy','💥 Crit!','fn-crit');
      if(G.battleOver)break;
    }
    logMsg(`⚡ Rapid Peck: ${landed}/${hits} hits, ${total} dmg.`,'player-action');
  },
  async nectarJab(ab) {
    const lv=ab.level;
    const hits=lv>=3?4:3;
    const missC=[8,6,5,4][lv-1];
    const dmgM=[.45,.55,.55,.60][lv-1];
    let total=0;
    for(let i=0;i<hits;i++){
      if(playerAttackMisses(ab)){await doMiss('player');logMsg(`Nectar Jab ${i+1} missed!`,'miss');}
      else{
        const isCrit=chance(getPlayerCritChance(ab));
        const r=dealDamage('enemy',pdmg(dmgM,ab),isCrit);
        await doAttack('player','enemy',r);
        setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
        total+=r.dmgDealt;
        if(isCrit){spawnFloat('enemy','⚡ Crit!','fn-crit');const _hbbd=BIRDS[G.player.birdKey];if(_hbbd?.passive?.onCrit) _hbbd.passive.onCrit(G.player);}
        if(lv>=2&&i===hits-1&&tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔 Weaken!','fn-status');}
        if(lv>=4&&isCrit&&tryApplyAilment('enemy','poison',ab)){spawnFloat('enemy','☣ Bleed!','fn-poison');}
        if(lv>=4&&tryApplyAilment('enemy','burning',ab)){spawnFloat('enemy','🔥 Burn!','fn-burn');}
        if(G.battleOver)break;
      }
    }
    logMsg(`🌸 Nectar Jab — ${hits} stabs, ${total} dmg!`,'player-action');
  },
  async probeStrike(ab) {
    const lv=ab.level;
    const missC=[8,6,5,4][lv-1];
    const dmgM=[1.0,1.15,1.30,1.48][lv-1];
    if(playerAttackMisses(ab)){await doMiss('player');logMsg(`Probe Strike missed!`,'miss');return;}
    const isCrit=chance(getPlayerCritChance(ab));
    const r=dealDamage('enemy',pdmg(dmgM,ab),isCrit);
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(isCrit)spawnFloat('enemy','💥 Crit!','fn-crit');
    if(lv>=3&&tryApplyAilment('enemy','feared',ab)){spawnFloat('enemy','😨 Fear!','fn-status');}
    if(lv>=4){const shred=2;G.enemy.stats.def=Math.max(0,G.enemy.stats.def-shred);spawnFloat('enemy',`🩸-${shred} DEF`,'fn-status');logMsg(`Armor Shred! Enemy DEF -${shred}.`,'system');}
    logMsg(`🥝 Probe Strike: ${r.dmgDealt} dmg${r.isCrit?' (CRIT)':''}!`,'player-action');
  },
  async dart(ab) {
    const lv=ab.level;
    const mC=Math.max(3,15-5*(lv-1));
    const hitBonus=getPlayerHitBonus(ab);
    if(chance(mC-hitBonus)){await doMiss('player');logMsg(`Dart missed!`,'miss');return;}
    const r=dealDamage('enemy',pdmg(1.1+.2*(lv-1)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔 Weaken!','fn-status');logMsg(`Chicken Pox! Enemy weakened.`,'system');}
    logMsg(`💨 Dart: ${r.dmgDealt} damage!`,'player-action');
  },
  async evade(ab) {
    const lv=ab.level;
    const turns=lv>=2?lv+1:3;
    const bonus=lv>=4?40:lv>=3?35:lv>=2?30:25;
    G.playerStatus.evading=turns; G.playerStatus.evadeBonus=bonus;
    spawnFloat('player','Evade!','fn-dodge');
    playAvatarAnim('player','do-dodge-r',560);
    await delay(560);
    renderStatuses('player-status',G.playerStatus);
    logMsg(`💨 Evasive stance! +${bonus}% dodge for ${turns} turns.`,'player-action');
  },
  async blackPeck(ab) {
    G.blackbirdAttackCount++;
    const lv=ab.level;
    const critMod=G.blackbirdAttackCount%2===0;
    const extraCrit=chance(getPlayerCritChance(ab));
    const isCrit=critMod||extraCrit;
    const mC=lv>=4?0:15-3*(lv-1);
    if(mC>0&&chance(mC)&&!isCrit){await doMiss('player');logMsg(`Peck missed!`,'miss');return;}
    const r=dealDamage('enemy',pdmg(.9+.05*(lv-1)),isCrit);
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(tryApplyAilment('enemy','burning',ab)){spawnFloat('enemy','🔥 Burn!','fn-burn');logMsg(`Feather Disease ignites!`,'burn-tick');}
    if(isCrit)logMsg(`💥 CRIT Peck! ${r.dmgDealt}!`,'crit');
    else logMsg(`Peck: ${r.dmgDealt}.`,'player-action');
  },
  async dirge(ab) {
    const lv=ab.level;
    const turns=1+lv; const skipC=Math.min(35,20+5*lv); // capped 20-35%
    G.enemyStatus.confused={turns,skipChance:skipC};
    if(tryApplyAilment('enemy','paralyzed',ab)){spawnFloat('enemy','⚡ Para!','fn-status');logMsg(`Avian Paralysis strikes!`,'system');}
    if(lv>=3){
      const dDmg=lv>=4?10:5;
      G.enemyStatus.delayed={dmg:dDmg};
      logMsg(`🎵 Resonance ${dDmg} set!`,'system');
    }
    await doSpell('enemy','🌀 Confused!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🎵 Dirge! ${G.enemy.name} confused ${turns}t (${skipC}% skip).`,'player-action');
    const _bbD=BIRDS[G.player.birdKey];if(_bbD&&_bbD.passive&&_bbD.passive.onSpell){_bbD.passive.onSpell(G.player);setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);spawnFloat('player','+2 Song','fn-heal');}
  },
  async lullaby(ab) {
    const lv=ab.level;
    const turns=2+lv;
    const dDmg=lv>=4?40:lv>=3?25:lv>=2?15:0;
    G.enemyStatus.lullabied=turns;
    if(lv>=2&&dDmg>0) G.enemyStatus.delayed={dmg:dDmg};
    if(lv>=4) G.enemyStatus.weaken=(G.enemyStatus.weaken||0)+turns;
    await doSpell('enemy','💤 Lullabied!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🎶 Lullaby! ATK reduced ${turns}t${dDmg>0?`, Resonance ${dDmg}`:''}.`,'player-action');
    const _bbL=BIRDS[G.player.birdKey];if(_bbL&&_bbL.passive&&_bbL.passive.onSpell){_bbL.passive.onSpell(G.player);setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);spawnFloat('player','+2 Song','fn-heal');}
  },
  async crowStrike(ab) {
    const lv=ab.level;
    const mC=Math.max(3,10-2*(lv-1));
    if(chance(mC)){await doMiss('player');logMsg(`Strike missed!`,'miss');if(G.crowDefendCooldown>0)G.crowDefendCooldown--;return;}
    const r=dealDamage('enemy',pdmg(1+.1*(lv-1)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(tryApplyAilment('enemy','poison',ab)){spawnFloat('enemy','☣ Flu!','fn-poison');logMsg(`Poison!`,'poison-tick');}
    if(tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔 Weaken!','fn-status');}
    logMsg(`⚔ Strike: ${r.dmgDealt}.`,'player-action');
    if(G.crowDefendCooldown>0)G.crowDefendCooldown--;
  },
  async beakSlam(ab) {
    const lv=ab.level;
    const mC=22; // heavy attacks keep fixed high miss
    if(chance(mC)){await doMiss('player');logMsg(`Beak Slam missed!`,'miss');if(G.crowDefendCooldown>0)G.crowDefendCooldown--;return;}
    const r=dealDamage('enemy',pdmg(1.4+.2*(lv-1)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    logMsg(`💢 Beak Slam: ${r.dmgDealt}!`,'player-action');
    const stunC=Math.min(50,25+10*(lv-1));
    if(rollStunChance(stunC)){G.enemyStatus.stunned=(G.enemyStatus.stunned||0)+1;await doSpell('enemy','😵 Stunned!');renderStatuses('enemy-status',G.enemyStatus);logMsg(`Stunned!`,'system');}
    if(tryApplyAilment('enemy','paralyzed',ab)){spawnFloat('enemy','⚡ Para!','fn-status');logMsg(`Avian Paralysis!`,'system');}
    if(G.crowDefendCooldown>0)G.crowDefendCooldown--;
  },
  async talonRake(ab) {
    const lv=ab.level; const hits=lv>=3?3:2; let total=0;
    for(let i=0;i<hits;i++){
      const mC=Math.max(5,28-5*(lv-1));
      if(chance(mC)){await doMiss('player');logMsg(`Talon ${i+1} missed!`,'miss');}
      else{
        const r=dealDamage('enemy',pdmg(.85+.1*(lv-1)));
        await doAttack('player','enemy',r);
        setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
        total+=r.dmgDealt;
        if(tryApplyAilment('enemy','burning',ab)){spawnFloat('enemy','🔥 Burn!','fn-burn');}
        if(tryApplyAilment('enemy','poison',ab)){spawnFloat('enemy','☣ Flu!','fn-poison');}
      }
    }
    logMsg(`🦅 Talon Rake: ${total} dmg.`,'player-action');
    if(G.crowDefendCooldown>0)G.crowDefendCooldown--;
  },
  async crowDefend(ab) {
    const lv=ab.level;
    const cd=2;
    const defGain=[2,3,4,5][lv-1];
    G.playerStatus.defending=1; G.crowDefendCooldown=cd;
    G.playerStatus.defBoost={amt:defGain,turns:1};
    G.player.stats.def=(G.player.stats.def||0)+defGain;
    await doShield('player');
    if(lv>=3) { G.playerStatus.counterThorns=(lv>=4?0.30:0.20); }
    renderStatuses('player-status',G.playerStatus);
    logMsg(`🛡 Defend! DEF +${defGain} (1 turn), CD 2t.${lv>=3?' Thorns active.':''}`,'player-action');
  },
  async honkAttack(ab) {
    const lv=ab.level;
    const missC=25; // heavy attacks keep fixed miss
    // Ostrich Rage Charge: build charge stacks on consecutive hits
    const isOstrich=G.player.birdKey==='ostrich';
    if(chance(missC)){
      await doMiss('player');
      logMsg(`HONK missed!`,'miss');
      if(isOstrich&&G.player._rageCharge>0){G.player._rageCharge=0;spawnFloat('player','💨 Charge Reset!','fn-miss');logMsg(`Ostrich Rage Charge reset on miss!`,'miss');}
      return;
    }
    let rageMult=1.0;
    if(isOstrich){
      G.player._rageCharge=(G.player._rageCharge||0)+1;
      const stacks=Math.min(G.player._rageCharge,3);
      rageMult=1.0+(stacks-1)*0.5; // +50% per stack after first
      if(stacks>1) spawnFloat('player',`⚡ Rage×${stacks}!`,'fn-crit');
    }
    const r=dealDamage('enemy',pdmg((1.5+.25*(lv-1))*rageMult));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    logMsg(`🔊 HONK! ${r.dmgDealt}${isOstrich&&G.player._rageCharge>1?` (Rage×${Math.min(G.player._rageCharge,3)})`:''}!`,'player-action');
    if(tryApplyAilment('enemy','paralyzed',ab)){spawnFloat('enemy','⚡ Para!','fn-status');}
    // Emperor Penguin Blubber Coat: Waddle applies Lullaby on attack
    if(G.player.birdKey==='penguin'&&!G.enemyStatus.waddleLullaby){
      G.enemyStatus.waddleLullaby={chance:15,turns:2};
      spawnFloat('enemy','💤 Lullaby!','fn-status');
      logMsg(`🐧 Waddle lulls the enemy! (15% skip/turn)`, 'system');
    }
    if(G.battleOver)return;
  },
  async gooseHonk(ab) {
    await ACTIONS.honkAttack(ab);
    if(tryApplyAilment('enemy','feared',ab)){spawnFloat('enemy','😨 Fear!','fn-status');}
  },
  async penguinHonk(ab) {
    await ACTIONS.honkAttack(ab);
    if(tryApplyAilment('enemy','slow',ab)){spawnFloat('enemy','🐌 Slow!','fn-status');}
  },
  async headWhip(ab) {
    const lv=ab.level;
    const missC=Math.max(8,20-(lv-1)*3);
    const isMomentumBird=G.player.birdKey==='ostrich'||G.player.birdKey==='emu';
    if(chance(missC)){
      await doMiss('player');
      logMsg('Head Whip missed!','miss');
      if(isMomentumBird&&G.player._rageCharge>0){G.player._rageCharge=0;spawnFloat('player','💨 Momentum Reset!','fn-miss');}
      return;
    }
    let rageMult=1.0;
    if(isMomentumBird){
      G.player._rageCharge=(G.player._rageCharge||0)+1;
      const stacks=Math.min(G.player._rageCharge,3);
      rageMult=1.0+(stacks-1)*0.45;
      if(stacks>1) spawnFloat('player',`⚡ Momentum×${stacks}`,'fn-crit');
    }
    const r=dealDamage('enemy',pdmg((1.45+.2*(lv-1))*rageMult,ab));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔 Weaken!','fn-status');}
    logMsg(`🦵 Head Whip: ${r.dmgDealt}${isMomentumBird&&G.player._rageCharge>1?` (Momentum×${Math.min(G.player._rageCharge,3)})`:''}.`,'player-action');
  },

  async breakClamp(ab) {
    const lv=ab.level;
    const baseMiss=[20,17,14,11][lv-1];
    const perHit=[1.10,1.20,1.30,1.45][lv-1];
    const streak=(G._breakClampStreak||0);
    const bonus=[0.15,0.18,0.21,0.25][lv-1]*Math.min(streak,3);
    const miss=Math.max(2,baseMiss-getPlayerHitBonus(ab));
    if(chance(miss)){
      await doMiss('player');
      G._breakClampStreak=0;
      G.autoQueuedAbilityId=null;
      logMsg('🦜 Beak Clamp missed — auto chain ends.','miss');
      return;
    }
    const isCrit=chance(getPlayerCritChance(ab));
    const r=dealDamage('enemy',pdmg(perHit+bonus,ab),isCrit);
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    G._breakClampStreak=Math.min((G._breakClampStreak||0)+1,3);
    if(lv>=3&&G._breakClampStreak>=3&&tryApplyAilment('enemy','weaken',ab))spawnFloat('enemy','🐔 Weaken!','fn-status');
    if(!G.battleOver){G.autoQueuedAbilityId='breakClamp';}
    logMsg(`🦜 Beak Clamp hits for ${r.dmgDealt}${G.autoQueuedAbilityId?' — auto queued for next turn!':''}.`,'player-action');
  },
  async counter(ab) {
    if(G.playerStatus.countering){logMsg('Counter already active!','miss');return;}
    G.playerStatus.countering={turns:2,mult:[1.2,1.35,1.5,1.7][ab.level-1],lv:ab.level};
    renderStatuses('player-status',G.playerStatus);
    logMsg('⚔ Counter stance: retaliate when enemy attacks you (2 turns).','player-action');
  },
  async parry(ab) {
    G.playerStatus.parry=2;
    G.playerStatus.parryLevel=ab.level;
    G.playerStatus.parryMult=(ab.level>=4)?3:2;
    G.playerStatus.parryTakenMult=[0.5,0.25,0,0][ab.level-1];
    renderStatuses('player-status',G.playerStatus);
    logMsg('🗡 Parry stance active (2 turns): physical/ranged only.','player-action');
  },
  async dukeRiverGrip(ab){
    if(spellMisses()){await doMiss('player');logMsg('River Grip missed!','miss');return;}
    const lv=Math.max(1,Math.min(ab.level||1,4));
    await doSpell('player','🌊 River Grip!');
    const dmg=(typeof matk==='function')?matk(0.9+(lv-1)*0.2):pdmg(0.85+(lv-1)*0.15,ab);
    dealDamage('enemy',dmg,chance(getPlayerCritChance(ab)),true,ab);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    applyEnemySlow(2+(lv>=3?1:0),8+(lv-1)*2,2+(lv>=3?1:0));
    if(lv>=4) applyAilment('enemy','weaken',1);
    renderStatuses('enemy-status',G.enemyStatus);
  },
  async dukeDecree(ab){
    if(spellMisses()){await doMiss('player');logMsg('Royal Decree missed!','miss');return;}
    const lv=Math.max(1,Math.min(ab.level||1,4));
    await doSpell('player','📜 Royal Decree!');
    applyAilment('enemy','weaken',Math.min(3,lv));
    G.enemyStatus.delayed={dmg:[8,11,14,18][lv-1],turns:1};
    if(lv>=3) applyAilment('enemy','feared',1);
    renderStatuses('enemy-status',G.enemyStatus);
  },
  async dukeWardens(ab){
    const lv=Math.max(1,Math.min(ab.level||1,4));
    await doSpell('player','🛡 Court Wardens!');
    const defGain=[2,3,4,5][lv-1];
    G.playerStatus.defending=Math.max(G.playerStatus.defending||0,(lv>=4?2:1));
    G.playerStatus.defBoost={amt:defGain,turns:1};
    G.player.stats.def=(G.player.stats.def||0)+defGain;
    if(lv>=3){
      const bad=['weaken','paralyzed','slow','burning','poison','bleed','feared','lullabied'];
      const hit=bad.find(k=>G.playerStatus[k]);
      if(hit) delete G.playerStatus[hit];
    }
    renderStatuses('player-status',G.playerStatus);
  },
  async spellLance(ab){
    if(spellMisses()){await doMiss('player');logMsg('Spell Lance missed!','miss');return;}
    const lv=ab.level;
    const dmg=Math.max(1,Math.floor((G.player.stats.matk||8)*([1.25,1.4,1.6,1.8][lv-1])));
    G.enemy.stats.hp-=dmg; setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(tryApplyAilment('enemy','weaken',ab))spawnFloat('enemy','🐔 Weaken!','fn-status');
    await doSpell('enemy','✦ Spell Lance!');
    logMsg(`✦ Spell Lance hits for ${dmg}.`,'player-action');
  },
  async guardianCry(ab){
    const lv=ab.level;
    const defBonus=[4,6,8,10][lv-1];
    G.player.stats.def+=defBonus;
    G.playerStatus.guardianCry={turns:lv>=3?3:2,defBonus};
    delete G.playerStatus.weaken;
    if(lv>=3) delete G.playerStatus.paralyzed;
    if(lv>=4) G.playerStatus.humImmuneToFear=2;
    renderStatuses('player-status',G.playerStatus);
    logMsg(`🛡 Guardian Cry! DEF +${defBonus}.`,'player-action');
  },
  async shadowFeint(ab){
    const lv=ab.level;
    if(playerAttackMisses(ab)){await doMiss('player');logMsg('Shadow Feint missed!','miss');return;}
    const r=dealDamage('enemy',pdmg([1.05,1.2,1.35,1.5][lv-1],ab),chance(getPlayerCritChance(ab)));
    await doAttack('player','enemy',r); setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(tryApplyAilment('enemy','confused',ab))spawnFloat('enemy','🌀 Confuse!','fn-status');
    if(lv>=3&&tryApplyAilment('enemy','weaken',ab))spawnFloat('enemy','🐔 Weaken!','fn-status');
    logMsg(`🗡 Shadow Feint deals ${r.dmgDealt}.`,'player-action');
  },
  async shoebillClamp(ab) {
    const lv=ab.level;
    const mC=[8,7,6,5][lv-1];
    if(chance(Math.max(2,mC-getPlayerHitBonus(ab)))){await doMiss('player');logMsg(`Shoebill Clamp snapped air!`,'miss');return;}
    G.enemyStatus.defending=0; // ignores some dodge
    const r=dealDamage('enemy',pdmg(1.3+.15*(lv-1)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    const stunC=[25,30,35,40][lv-1];
    if(rollStunChance(stunC)){G.enemyStatus.stunned=(G.enemyStatus.stunned||0)+1;spawnFloat('enemy','😵 Stunned!','fn-status');}
    const stacks=lv>=4?3:lv>=3?2:lv>=2?1:0;
    if(stacks>0)applyAilment('enemy','poison',stacks);
    if(lv>=4&&tryApplyAilment('enemy','weaken',ab))spawnFloat('enemy','🐔 Weaken!','fn-status');
    logMsg(`👄 Shoebill Clamp! ${r.dmgDealt} dmg${stacks>0?' +'+stacks+' Flu':''}!`,'player-action');
  },
  async serpentCrusher(ab) {
    const lv=ab.level;
    const mC=[12,10,8,5][lv-1];
    if(chance(Math.max(2,mC-getPlayerHitBonus(ab)))){await doMiss('player');logMsg(`Serpent Crusher missed!`,'miss');return;}
    const vsPoison=G.enemyStatus.poison&&G.enemyStatus.poison.stacks>0;
    const dmgMult=(1.15+.15*(lv-1))*(vsPoison?1.3:1);
    const r=dealDamage('enemy',pdmg(dmgMult));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    if(tryApplyAilment('enemy','paralyzed',ab))spawnFloat('enemy','⚡ Para!','fn-status');
    if(lv>=3&&tryApplyAilment('enemy','weaken',ab))spawnFloat('enemy','🐔 Weaken!','fn-status');
    logMsg(`🦅 Serpent Crusher! ${r.dmgDealt} dmg${vsPoison?' (×1.3 vs Poisoned!)':''}!`,'player-action');
  },
  async mudLash(ab) {
    const lv=ab.level;
    const mC=[15,12,10,8][lv-1];
    if(chance(Math.max(2,mC-getPlayerHitBonus(ab)))){await doMiss('player');logMsg(`Mud Lash missed!`,'miss');G._mudLashStreak=0;return;}
    G._mudLashStreak=(G._mudLashStreak||0)+1;
    const consecMult=G._mudLashStreak>1?1.2:1;
    const baseDmg=([.95,1.05,1.15,1.25][lv-1])*consecMult;
    const r=dealDamage('enemy',pdmg(baseDmg));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    const stacks=lv>=3?2:1;
    applyAilment('enemy','poison',stacks);
    if(lv>=2){const heal=Math.floor(r.dmgDealt*([.1,.1,.12,.15][lv-1]));G.player.stats.hp=Math.min(G.player.stats.hp+heal,G.player.stats.maxHp);setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);spawnFloat('player',`+${heal}`,'fn-heal');}
    if(lv>=4&&chance(20))applyAilment('enemy','confused',1);
    if(G.battleOver)return;
    logMsg(`🦩 Mud Lash! ${r.dmgDealt} dmg (+${stacks} Flu)!`,'player-action');
  },
  async fleshRipper(ab) {
    const lv=ab.level;
    const mC=[10,8,6,4][lv-1];
    if(chance(Math.max(1,mC-getPlayerHitBonus(ab)))){await doMiss('player');logMsg(`Flesh Ripper missed!`,'miss');return;}
    const lowHpBonus=G.enemy.stats.hp<G.enemy.stats.maxHp*.5&&lv>=3?([0,0,.25,.35][lv-1]):0;
    const r=dealDamage('enemy',pdmg((1.25+.15*(lv-1))*(1+lowHpBonus)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    G.enemyStatus.burning=[3,3,4,4][lv-1];
    const critBonus=[15,20,20,25][lv-1];
    G.player.stats.critChance=Math.min((G.player.stats.critChance||5)+critBonus,100);
    spawnFloat('player',`+${critBonus}% Crit`,'fn-crit');
    logMsg(`🦅 Flesh Ripper! ${r.dmgDealt} dmg + Burn! +${critBonus}% Crit${lowHpBonus>0?' (Low HP bonus!)':''}!`,'player-action');
  },
  async diveGouge(ab) {
    const lv=ab.level;
    const mC=[30,25,20,15][lv-1];
    if(chance(Math.max(5,mC-getPlayerHitBonus(ab)))){await doMiss('player');logMsg(`Dive Gouge overshot!`,'miss');return;}
    const r=dealDamage('enemy',pdmg(1.5+.15*(lv-1)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    if(r.isCrit){
      const spdGain=[2,3,4,5][lv-1];
      G.player.stats.spd+=spdGain;
      spawnFloat('player',`+${spdGain} SPD`,'fn-crit');
      logMsg(`💨 Crit! +${spdGain} SPD gained!`,'player-action');
    }
    if(tryApplyAilment('enemy','weaken',ab))spawnFloat('enemy','🐔 Weaken!','fn-status');
    logMsg(`⚡ Dive Gouge! ${r.dmgDealt} dmg${r.isCrit?' (CRIT!)':''}!`,'player-action');
  },
  async serratedSlash(ab) {
    const lv=ab.level;
    const mC=[12,10,8,6][lv-1];
    if(chance(Math.max(1,mC-getPlayerHitBonus(ab)))){await doMiss('player');logMsg(`Serrated Slash glanced!`,'miss');return;}
    const r=dealDamage('enemy',pdmg(1.05+.13*(lv-1)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    applyAilment('enemy','poison',lv>=4?3:2);
    // Heal over time
    G.playerStatus.regen=(G.playerStatus.regen||0)+2; G.regenPct=0.075;
    // Cleanse debuffs
    const toCleanse=['weaken','paralyzed','burning','confused','feared'];
    let cleansed=0;
    for(const k of toCleanse){if(G.playerStatus[k]&&cleansed<(lv>=3?2:lv>=2?1:0)){delete G.playerStatus[k];cleansed++;}}
    logMsg(`🦢 Serrated Slash! ${r.dmgDealt} dmg + Bleed! Healed 7.5%/t for 2t!`,'player-action');
  },
  async fishSnatcher(ab) {
    const lv=ab.level;
    const mC=[14,11,8,5][lv-1];
    if(chance(Math.max(1,mC-getPlayerHitBonus(ab)))){await doMiss('player');logMsg(`Fish Snatcher splashed!`,'miss');return;}
    const lowHp=G.enemy.stats.hp<G.enemy.stats.maxHp*.5;
    const r=dealDamage('enemy',pdmg((1.2+.15*(lv-1))*(lowHp?1.12:1)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    const stealC=[20,25,30,35][lv-1];
    if(chance(stealC)){
      // Steal a buff: copy one enemy buff as player buff
      const stealable=['atkBuff','defending'];
      const found=stealable.find(k=>G.enemyStatus[k]);
      if(found){delete G.enemyStatus[found];spawnFloat('player','💎 Buff Stolen!','fn-crit');logMsg(`Fish Snatcher stole enemy buff!`,'player-action');}
    }
    if(lv>=3){const heal=Math.floor(r.dmgDealt*([0,0,.25,.30][lv-1]));if(heal>0){G.player.stats.hp=Math.min(G.player.stats.hp+heal,G.player.stats.maxHp);setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);spawnFloat('player',`+${heal}`,'fn-heal');}}
    if(lv>=4&&tryApplyAilment('enemy','weaken',ab))spawnFloat('enemy','🐔 Weaken!','fn-status');
    logMsg(`🦅 Fish Snatcher! ${r.dmgDealt} dmg!`,'player-action');
  },
  async silentPierce(ab) {
    const lv=ab.level;
    const missC=[5,4,3,2][lv-1];
    const hitBonus=getPlayerHitBonus(ab);
    if(chance(Math.max(0,missC-hitBonus))){await doMiss('player');logMsg(`Silent Pierce slipped!`,'miss');return;}
    const isShadowCloak=G.player._shadowCloakReady;
    if(isShadowCloak){G.player._shadowCloakReady=false;G.enemyStatus.defending=0;}
    const forceCrit=isShadowCloak||chance(getPlayerCritChance(ab));
    const r=dealDamage('enemy',pdmg(1.1+.15*(lv-1)),forceCrit);
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    if(tryApplyAilment('enemy','feared',ab)){spawnFloat('enemy','😨 Fear!','fn-status');}
    if(lv>=3&&G.enemyStatus.feared>0)spawnFloat('player','🦉 +Crit!','fn-crit');
    logMsg(`🦉 Silent Pierce! ${r.dmgDealt}${isShadowCloak?' (SHADOW CLOAK - CRIT + UNBLOCKABLE!)':r.isCrit?' (Crit!)':''}!`,'player-action');
  },
  async intimidate(ab) {
    const lv=ab.level; const turns=1+lv;
    G.enemyStatus.feared=(G.enemyStatus.feared||0)+turns;
    if(lv>=2)tryApplyAilment('enemy','weaken',ab);
    if(lv>=3){const fd=15+10*(lv-3);G.enemy.stats.hp-=fd;setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);spawnFloat('enemy',`-${fd}`,'fn-dmg');logMsg(`Fear damages for ${fd}!`,'system');}
    await doSpell('enemy','😨 FEARED!');
    G.intimidateCooldown=2;
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`😤 ${G.enemy.name} FEARED ${turns}t!`,'player-action');
  },
  async roost(ab) {
    const lv=ab.level;
    if(lv<4&&(G.playerStatus.feared>0||G.playerStatus.stunned>0)){logMsg(`Cannot roost while feared/stunned!`,'miss');return;}
    const pct=[.26,.32,.40,.48][lv-1];
    G.playerStatus.roosting='pending';
    G._roostData={pct, lv}; // stored OUTSIDE ticked status to prevent negative drift
    await doSpell('player','🌿 Roosting...');
    renderStatuses('player-status',G.playerStatus);
    logMsg(`🌿 Roosting... heals ${Math.floor(pct*100)}% at start of next turn.`,'player-action');
  },

  // ============================================================
  //  LEARNABLE ABILITIES
  // ============================================================
  async swoop(ab) {
    const lv=ab.level;
    if(G.swoopCooldown>0){logMsg(`Swoop on cooldown!`,'miss');return;}
    const mult=1+0.15*(lv-1);
    const baseDmg=pdmg(mult);
    // Swoop always hits, bypasses dodge (dealDamage but force hit)
    let dmg=Math.max(1,baseDmg);
    const critMult=G.player.goldCritMult||1.5;
    G.enemy.stats.hp-=dmg;
    await doAttack('player','enemy',{dmgDealt:dmg,wasDodged:false,wasBlocked:false,isCrit:false});
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    const stunC=lv>=2?20+10*(lv-2):0;
    if(stunC&&rollStunChance(stunC)){G.enemyStatus.stunned=(G.enemyStatus.stunned||0)+1;await doSpell('enemy','😵 Stunned!');renderStatuses('enemy-status',G.enemyStatus);}
    if(tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔 Weaken!','fn-status');}
    const cd=lv>=3?1:2; G.swoopCooldown=cd;
    if(lv>=4)G.swoopCooldown=0;
    logMsg(`🦅 Swoop! ${dmg} dmg, can't be dodged!${G.swoopCooldown>0?' (CD '+G.swoopCooldown+'t)':''}`, 'player-action');
  },

  async diveBomb(ab) {
    const lv=ab.level;
    const spd=G.player.stats.spd;
    // Miss chance based on PLAYER bird size: bigger = better diver = lower miss
    const pSize=G.player.size||'medium';
    const sizeMiss={tiny:50,small:40,medium:30,large:20,xl:15}[pSize]||30;
    const missAdj=Math.max(2,sizeMiss-5*(lv-1));
    if(chance(missAdj)){await doMiss('player');logMsg(`Dive Bomb missed! (${pSize} bird, ${missAdj}% miss)`, 'miss');return;}
    const spdMult=(spd/5)*0.7+0.3;
    const lvBonus=1+0.15*(lv-1)+0.1*(lv>=3?1:0)+0.1*(lv>=4?1:0);
    const r=dealDamage('enemy',pdmg(spdMult*lvBonus));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    if(tryApplyAilment('enemy','burning',ab)){spawnFloat('enemy','🔥 Burn!','fn-burn');logMsg('Feather Disease ignites!','burn-tick');}
    logMsg(`💨 Dive Bomb (${pSize}): ${r.dmgDealt} dmg! SPD×${spdMult.toFixed(1)}`,'player-action');
  },

  async flyby(ab) {
    if(G.flybyCharged){logMsg('Flyby is already primed!','miss');return;}
    G.flybyCharged=true;
    G.playerStatus.flyby=1;
    await doSpell('player','💨 Momentum!');
    renderStatuses('player-status',G.playerStatus);
    logMsg(`💨 Flyby! The first hit of your next damaging action gains bonus damage.`,'player-action');
  },

  async dustDevil(ab) {
    const lv=ab.level;
    const accDrop=[15,20,25,30][lv-1];
    const turns=[3,4,5,5][lv-1];
    G.enemyStatus.dustDevil={turns,accDrop};
    G.enemyStatus.accDebuff=(G.enemyStatus.accDebuff||0)+accDrop;
    if(lv>=4){G.enemyStatus.confused={turns:2,skipChance:20};await doSpell('enemy','😵 Confused!');renderStatuses('enemy-status',G.enemyStatus);}
    await doSpell('enemy',`🌪 Blinded!`);
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🌪 Dust Devil! ${G.enemy.name} blinded −${accDrop}% ACC for ${turns}t!`,'player-action');
  },

  async rockDrop(ab) {
    if(G.rockDropPending){
      // Turn 2: drop the rock
      const lv=ab.level;
      const sizeMap={tiny:1.1,small:1.4,medium:1.8,large:2.3,xl:3.0};
      const sizeMult=sizeMap[G.player.size||'medium']||1.8;
      const lvBonus=1+0.2*(lv-1);
      const rawDmg=Math.floor(G.player.stats.atk*sizeMult*lvBonus);
      // Ignore block
      const saved=G.playerStatus.defending;
      G.playerStatus.defending=0;
      G._currentPiercePct=50;
      const r=dealDamage('enemy',rawDmg);
      G.playerStatus.defending=saved;
      await doAttack('player','enemy',r);
      setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
      if(G.battleOver)return;
      const stunC=lv>=3?20+10*(lv-3):0;
      if(stunC&&rollStunChance(stunC)){G.enemyStatus.stunned=(G.enemyStatus.stunned||0)+1;await doSpell('enemy','😵 Stunned!');renderStatuses('enemy-status',G.enemyStatus);}
      if(tryApplyAilment('enemy','poison',ab)){spawnFloat('enemy','☣ Flu!','fn-poison');}
      G.rockDropPending=false;
      delete G.playerStatus.rockDrop;
      logMsg(`🪨 Rock Drop! ${r.dmgDealt} dmg (ignores shield)!`,'player-action');
    } else {
      // Turn 1: pick up rock
      G.rockDropPending=true;
      G.playerStatus.rockDrop=true;
      await doSpell('player','🪨 Foraging...');
      renderStatuses('player-status',G.playerStatus);
      logMsg(`🪨 Foraging for a rock... use Rock Drop again next turn to drop it!`,'player-action');
    }
  },

  async hum(ab) {
    const lv=ab.level;
    const dodgeBonus=[15,20,25,30][lv-1];
    const missBon=[5,8,10,12][lv-1];
    const turns=[5,5,5,6][lv-1];
    // Reset to max turns (don't stack same buff)
    G.humTurns=turns; G.humMissBonus=missBon;
    G.playerStatus.hum=turns; // resets to max, no stacking
    G.playerStatus.humDodge={bonus:dodgeBonus, turns}; // separate from dustDevil
    if(lv>=3){['weaken'].forEach(s=>delete G.playerStatus[s]);logMsg('Hum cleanses Weaken!','system');}
    if(lv>=4){G.player.humImmuneToFear=true;logMsg('Hum: immune to fear while active!','system');}
    await doSpell('player',`🎵 +${dodgeBonus}% dodge!`);
    renderStatuses('player-status',G.playerStatus);
    logMsg(`🎵 Hum! +${dodgeBonus}% dodge, −${missBon}% miss for ${turns} turns.`,'player-action');
  },

  async mudshot(ab) {
    const lv=ab.level;
    const missC=[20,15,10,5][lv-1];
    const spdPen=[2,3,4,5][lv-1];
    const mudTurns=[2,3,3,4][lv-1];
    if(playerAttackMisses(ab)){await doMiss('player');logMsg('Mud shot missed!','miss');return;}
    const r=dealDamage('enemy',pdmg(0.7+0.1*(lv-1)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    // Apply Slow debuff (Mudshot is the ranged non-pierce debuff exception)
    const dodgePen=[12,15,18,22][lv-1];
    applyEnemySlow(spdPen,dodgePen,mudTurns);
    spawnFloat('enemy',`🐌 Slowed!`,'fn-status');
    logMsg(`🐌 Mud Shot! ${G.enemy.name} SPD −${spdPen}, Dodge −${dodgePen}% for ${mudTurns}t!`,'player-action');
    if(tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔','fn-status');logMsg('Chicken Pox!','system');}
    if(lv>=3&&tryApplyAilment('enemy','poison',ab)){spawnFloat('enemy','☣','fn-poison');}
    if(lv>=4&&chance(25)&&!G.enemyStatus.paralyzed){G.enemyStatus.paralyzed=1;spawnFloat('enemy','⚡ Para!','fn-status');}
    renderStatuses('enemy-status',G.enemyStatus);
  },
  async cactiSpine(ab) {
    const lv=ab.level;
    if(playerAttackMisses(ab)){await doMiss('player');logMsg('Cacti Spine missed!','miss');return;}
    G._currentPiercePct=50;
    const r=dealDamage('enemy',pdmg([0.8,0.9,1.0,1.15][lv-1],ab));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    if(tryApplyAilment('enemy','poison',ab)){spawnFloat('enemy','☣ Flu!','fn-poison');}
    const accDrop=[10,12,15,20][lv-1];
    G.enemyStatus.accDebuff=(G.enemyStatus.accDebuff||0)+accDrop;
    if(lv>=4) applyEnemySlow(2,10,2);
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🌵 Cacti Spine! ${r.dmgDealt} pierce dmg, ACC −${accDrop}%!`,'player-action');
  },
  async aerialPoop(ab) {
    const lv=ab.level;
    const hits=2;
    const accDrop=[10,12,15,20][lv-1];
    let total=0;
    for(let i=0;i<hits;i++){
      if(playerAttackMisses(ab)){await doMiss('player');continue;}
      G._currentPiercePct=50;
      const r=dealDamage('enemy',pdmg([0.7,0.75,0.8,0.85][lv-1],ab));
      total+=r.dmgDealt;
      await doAttack('player','enemy',r);
      setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
      if(G.battleOver)return;
    }
    G.enemyStatus.accDebuff=(G.enemyStatus.accDebuff||0)+accDrop;
    if(tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔 Weaken','fn-status');}
    if(lv>=4) applyEnemySlow(2,8,2);
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`💩 Aerial Poop! ${total} total ranged dmg, ACC −${accDrop}%!`,'player-action');
  },

  async stickLance(ab) {
    const lv=ab.level;
    if(G.stickLanceStage===0||G.stickLanceStage===-1) {
      // Turn 1: forage for stick
      G.stickLanceStage=0;
      const findChance=[70,80,90,95][lv-1];
      if(chance(findChance)){
        G.stickLanceStage=1;
        await doSpell('player','🪵 Found it!');
        logMsg(`🪵 Found a stick! Use Stick Lance again this turn or next to strike!`,'player-action');
      } else {
        G.stickLanceStage=-1;
        await doSpell('player','❌ No stick...');
        logMsg(`❌ No stick found! Stick Lance fails.`,'miss');
        G.stickLanceStage=0;
      }
    } else if(G.stickLanceStage===1) {
      // Turn 2: strike!
      G.stickLanceStage=0;
      const misC=[50,40,30,20][lv-1];
      if(chance(misC)){await doMiss('player');logMsg(`Stick Lance missed!`,'miss');return;}
      const mult=[2.5,2.7,2.9,3.2][lv-1];
      G._currentPiercePct=50;
      const baseDmg=pdmg(mult);
      const isCrit=chance(50+5*(lv-1));
      const critMult=G.player.goldCritMult||1.5;
      const finalDmg=isCrit?Math.floor(baseDmg*critMult):baseDmg;
      // Bypasses enemy block
      const wasBlocking=G.enemyStatus.defending;
      G.enemyStatus.defending=0;
      G.enemy.stats.hp-=finalDmg;
      G.enemyStatus.defending=wasBlocking;
      const result={dmgDealt:finalDmg,wasDodged:false,wasBlocked:false,isCrit};
      await doAttack('player','enemy',result);
      setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
      if(G.battleOver)return;
      if(tryApplyAilment('enemy','paralyzed',ab)){spawnFloat('enemy','⚡ Para!','fn-status');logMsg(`Avian Paralysis!`,'system');}
      logMsg(`🪵 STICK LANCE! ${finalDmg} dmg${isCrit?' (CRIT!)':''}! Bypassed shield!`,'player-action');
    }
  },

  // ---- NEW BIRDS ----
  async bashUp(ab) {
    const lv=ab.level;
    // Kookaburra ambush passive
    const _ambush=G.player._ambushReady; G.player._ambushReady=false;
    const wasActive=G.sitAndWaitActive;
    G.sitAndWaitActive=false; // consume the buff after use
    const missBase=[20,16,12,8][lv-1];
    const hits=wasActive?2:1;
    let total=0;
    for(let i=0;i<hits;i++){
      const mc=wasActive?Math.max(2,15-4*(lv-1)):Math.max(2,missBase);
      if(chance(mc)){await doMiss('player');logMsg(`Bash-Up ${i+1} missed!`,'miss');continue;}
      // Ambush: force crit with 1.5× bonus crit multiplier on first hit
      const isAmbushHit=_ambush&&i===0;
      const isCrit=isAmbushHit||chance(getPlayerCritChance(ab));
      const r=dealDamage('enemy',pdmg(1+.15*(lv-1)),isCrit);
      await doAttack('player','enemy',r);
      setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
      total+=r.dmgDealt;
      if(tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔 Weaken!','fn-status');}
      if(isAmbushHit){spawnFloat('player','🪶 AMBUSH!','fn-crit');SFX.ambush();logMsg(`🪶 AMBUSH CRIT!`,'crit');}
      if(G.battleOver)break;
    }
    logMsg(`💢 Bash-Up${wasActive?' (double!)':''}: ${total} dmg!`,'player-action');
  },
  async sitAndWait(ab) {
    if(G.sitAndWaitUsedThisTurn){ logMsg('Sit and Wait can only be used once per turn.','miss'); return; }
    G.sitAndWaitUsedThisTurn=true;
    const lv=ab.level;
    const spottedC=[30,25,20,15][lv-1];
    if(chance(spottedC)){
      await doSpell('player','👁 Spotted!');
      logMsg(`👁 Spotted! Sit & Wait failed!`,'miss');
      G.sitAndWaitActive=false;
      return;
    
  }
    G.sitAndWaitActive=true;
    const atkPct=[25,30,35,40][lv-1];
    const accPct=[25,30,35,40][lv-1];
    const dod=[5,8,12,15][lv-1];
    G.playerStatus.sitWait={turns:3,atk:atkPct,acc:accPct,dodge:dod};
    await doSpell('player','🪵 Waiting...');
    renderStatuses('player-status',G.playerStatus);
    logMsg(`🪵 Sit & Wait! ATK+${atkPct}%, ACC+${accPct}%, Dodge+${dod}% for 3t.`,'player-action');
    if(lv>=4){[...G.player.abilities].forEach(a=>{if(a.id==='bashUp'){}});G.swoopCooldown=Math.max(0,G.swoopCooldown-1);G.crowDefendCooldown=Math.max(0,G.crowDefendCooldown-1);}
  },
  async theJoker(ab) {
    const lv=ab.level;
    const turns=[2,2,3,3][lv-1];
    const skipC=[20,30,40,50][lv-1];
    const weakMult=[0.8,0.7,0.6,0.5][lv-1];
    G.enemyStatus.confused={turns,skipChance:skipC};
    G.enemyStatus.lullabied=(G.enemyStatus.lullabied||0)+turns; // lullabied doubles as weaken mult
    if(tryApplyAilment('enemy','paralyzed',ab)){spawnFloat('enemy','⚡ Para!','fn-status');}
    if(tryApplyAilment('enemy','poison',ab)){spawnFloat('enemy','☣ Flu!','fn-poison');}
    if(tryApplyAilment('enemy','burning',ab)){spawnFloat('enemy','🔥 Burn!','fn-burn');}
    await doSpell('enemy','🃏 JOKER!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🃏 The Joker! Confused ${turns}t (${skipC}% skip), ATK ×${weakMult} for ${turns}t!`,'player-action');
  },
  async serratedBill(ab) {
    const lv=ab.level;
    G.serratedStacks=Math.min(G.serratedStacks+1,5);
    const mc=[20,16,13,10][lv-1];
    if(chance(mc)){await doMiss('player');logMsg(`Serrated Bill missed!`,'miss');G.serratedStacks=0;return;}
    const baseMult=[.75,.85,.95,1.1][lv-1];
    const stackBonus=0.25*(G.serratedStacks-1); // +25% per prior stack
    const r=dealDamage('enemy',pdmg(baseMult+stackBonus));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    if(G.serratedStacks>=5){
      if(tryApplyAilment('enemy','burning',ab)){spawnFloat('enemy','🔥 Burn!','fn-burn');}
      if(tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔 Weaken!','fn-status');}
    }
    logMsg(`🦜 Serrated Bill (×${G.serratedStacks} stacks): ${r.dmgDealt}!`,'player-action');
  },
  async tookieTookie(ab) {
    // If already active, cancel early so it can be re-cast after expiry
    if(G.tookieActive){ logMsg(`🦜 Tookie Tookie already singing!`,'miss'); return; }
    const lv=ab.level;
    const atkBonus=[50,65,80,100][lv-1];
    const missPen=[20,15,12,8][lv-1];
    const turns=[2,2,3,3][lv-1];
    const defBonus=[0,3,4,5][lv-1];
    const critBonus=[0,0,15,25][lv-1];
    G.tookieActive=true; G.tookieMiss=missPen;
    G.playerStatus.tookie={turns,atkBonus,missPen,defBonus,critBonus};
    // Apply DEF and crit bonuses
    if(defBonus>0){ G.player.stats.def+=defBonus; }
    if(critBonus>0){ G.player.stats.critChance=(G.player.stats.critChance||10)+critBonus; }
    await doSpell('player','🦜 TOOKIE TOOKIE!');
    renderStatuses('player-status',G.playerStatus);
    const extras=[];
    if(defBonus>0) extras.push(`DEF +${defBonus}`);
    if(critBonus>0) extras.push(`Crit +${critBonus}%`);
    if(lv>=4) extras.push(`Fear immune`);
    logMsg(`🦜 Tookie Tookie! ATK +${atkBonus}% / miss +${missPen}% for ${turns}t${extras.length?` (${extras.join(', ')})`:''}.`,'player-action');
  },
  async fruitSweetener(ab) {
    const lv=ab.level;
    if(G.fruitCooldown>0){logMsg(`Fruit Sweetener on cooldown! (${G.fruitCooldown}t)`,'miss');return;}
    const pct=[.15,.22,.28,.35][lv-1];
    const cd=[2,2,1,0][lv-1];
    const heal=Math.floor(G.player.stats.maxHp*pct);
    G.player.stats.hp=Math.min(G.player.stats.hp+heal,G.player.stats.maxHp);
    await doHeal('player',heal);
    setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);
    G.fruitCooldown=cd;
    if(lv>=4){G.playerStatus.humDodge={bonus:10,turns:2};logMsg(`🍊 +10% dodge bonus for 2t!`,'system');}
    logMsg(`🍊 Fruit Sweetener: +${heal} HP!${cd>0?` (CD ${cd}t)`:''}`,'player-action');
  },

  // ---- NEW LEARNABLE ABILITIES ----
  async featherRuffle(ab) {
    const lv=ab.level;
    const atkReduction=[15,20,25,30][lv-1];
    const accDrop=lv>=2?[0,10,15,20][lv-1]:0;
    const turns=lv>=2?3:5; // 1 debuff=5t, 2 debuffs=3t
    G.enemyStatus.featherRuffle={turns,atkReduction,accDrop};
    if(accDrop>0) G.enemyStatus.accDebuff=(G.enemyStatus.accDebuff||0)+accDrop;
    await doSpell('enemy','🪶 Ruffled!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🪶 Feather Ruffle! ${G.enemy.name} ATK −${atkReduction}%${accDrop>0?' ACC −'+accDrop+'%':''} for ${turns}t!`,'player-action');
  },
  async wingClip(ab) {
    const lv=ab.level;
    const spdRedux=[2,3,4,5][lv-1];
    const dodgeDrop=lv>=2?[0,10,15,20][lv-1]:0;
    const turns=lv>=2?3:5; // 1 debuff=5t, 2 debuffs=3t
    G.enemy.stats.spd=Math.max(1,G.enemy.stats.spd-spdRedux);
    if(dodgeDrop>0){G.enemyStatus.wingClipDodge=(G.enemyStatus.wingClipDodge||0)+dodgeDrop;}
    if(lv>=4&&tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔 Weaken!','fn-status');}
    await doSpell('enemy','✂ Wing Clipped!');
    G.enemyStatus.wingClip={turns,spdRedux};
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`✂ Wing Clip! ${G.enemy.name} SPD −${spdRedux}${dodgeDrop>0?' Dodge −'+dodgeDrop+'%':''} for ${turns}t!`,'player-action');
  },
  async eyeGouge(ab) {
    const lv=ab.level;
    if(playerAttackMisses(ab)){await doMiss('player');logMsg(`Eye Gouge missed!`,'miss');return;}
    const r=dealDamage('enemy',pdmg(.5+.2*(lv-1)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    const accDrop=[20,28,36,45][lv-1];
    const blindT=[3,3,4,4][lv-1];
    G.enemyStatus.accDebuff=(G.enemyStatus.accDebuff||0)+accDrop;
    G.enemyStatus.enemyBlind=Math.max(G.enemyStatus.enemyBlind||0,blindT);
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`👁 Eye Gouge! ${r.dmgDealt} dmg + enemy ACC −${accDrop}%!`,'player-action');
  },
  async tailPull(ab) {
    const lv=ab.level;
    // Strip enemy buffs
    const strippable=['defending','featherRuffle','atkBuff'];
    let stripped=0;
    for(const k of strippable){
      if(G.enemyStatus[k]&&stripped<lv){delete G.enemyStatus[k];stripped++;}
    }
    if(lv>=3&&G.enemyStatus.atkBuff){delete G.enemyStatus.atkBuff; stripped++;}
    if(lv>=4){for(const k of Object.keys(G.enemyStatus)){if(['poison','weaken','confused','feared','burning','paralyzed','delayed'].indexOf(k)<0&&G.enemyStatus[k]){delete G.enemyStatus[k];}}}
    if(tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔 Weaken!','fn-status');}
    await doSpell('enemy','🪶 STRIPPED!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🪶 Tail Pull! Stripped ${stripped} buff(s)!`,'player-action');
  },
  async molt(ab) {
    const lv=ab.level;
    const toCleanse=['weaken','paralyzed','burning','confused','feared','stunned'];
    let removed=0;
    for(const k of toCleanse){if(G.playerStatus[k]){delete G.playerStatus[k];removed++;if(removed>=lv&&lv<3)break;}}
    const defDrop=[2,3,4,5][lv-1];
    G.enemyStatus.defDebuff=(G.enemyStatus.defDebuff||0)+defDrop;
    if(lv>=3){G.enemyStatus.featherRuffle={...(G.enemyStatus.featherRuffle||{}),atkReduction:15,turns:3};}
    if(lv>=4){G.playerStatus.humDodge={bonus:10,turns:3};}
    renderStatuses('player-status',G.playerStatus);
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🪶 Molt! Cleansed ${removed} status(es). Enemy DEF −${defDrop}.`,'player-action');
  },
  async plagueBlast(ab) {
    const lv=ab.level;
    const stacks=[3,4,5,6][lv-1];
    applyAilment('enemy','poison',stacks);
    if(lv>=2){
      const extra=Math.min(3,Math.floor((G.enemyStatus.poison?.stacks||0)/2));
      if(extra>0)applyAilment('enemy','poison',extra);
    }
    if(lv>=4){G.enemy.stats.hp-=stacks*3;setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);spawnFloat('enemy',`-${stacks*3}`,'fn-poison');}
    await doSpell('enemy','☣ PLAGUE!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`☣ Plague Blast! Applied ${stacks} Poison stacks!`,'poison-tick');
  },
  async incendiaryFeathers(ab) {
    const lv=ab.level;
    const fireDmg=[8,12,18,25][lv-1];
    G.enemy.stats.hp-=fireDmg;
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    spawnFloat('enemy',`🔥 -${fireDmg}`,'fn-burn');
    G.enemyStatus.burning=lv>=3?4:3;
    if(lv>=2){applyAilment('enemy','poison',lv>=3?2:1);}
    if(lv>=4){G.enemyStatus.weaken=2;}
    await doSpell('enemy','🔥 IGNITE!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🔥 Incendiary Feathers! ${fireDmg} fire dmg + Burn applied!`,'player-action');
  },
  async toxicSpit(ab) {
    const lv=ab.level;
    if(playerAttackMisses(ab)){await doMiss('player');logMsg(`Toxic Spit missed!`,'miss');return;}
    const fluStacks=[2,3,4,5][lv-1];
    const existingStacks=(G.enemyStatus.poison?.stacks||0);
    const bonusDmg=Math.floor(existingStacks*[1,1.5,2,3][lv-1]);
    const r=dealDamage('enemy',pdmg([.6,.75,.9,1.1][lv-1])+bonusDmg);
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    applyAilment('enemy','poison',fluStacks);
    await doSpell('enemy',`☣ +${fluStacks} Flu!`);
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`☣ Toxic Spit! ${r.dmgDealt} dmg (+${bonusDmg} per stack) + ${fluStacks} Flu!`,'poison-tick');
  },
  async cannonball(ab) {
    const lv=ab.level;
    if(playerAttackMisses(ab)){await doMiss('player');logMsg(`Cannonball missed!`,'miss');return;}
    const r=dealDamage('enemy',pdmg(1.8+.2*(lv-1)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    const recoilPct=[.08,.05,.03,0][lv-1];
    if(recoilPct>0){
      const recoil=Math.floor(r.dmgDealt*recoilPct);
      G.player.stats.hp=Math.max(1,G.player.stats.hp-recoil);
      setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);
      spawnFloat('player',`-${recoil}`,'fn-dmg');
      logMsg(`💥 Cannonball! ${r.dmgDealt} dmg (recoil −${recoil})!`,'player-action');
    } else {
      logMsg(`💥 Cannonball! ${r.dmgDealt} dmg!`,'player-action');
    }
    if(tryApplyAilment('enemy','weaken',ab)){spawnFloat('enemy','🐔 Weaken!','fn-status');}
    if(lv>=4&&chance(20)){G.enemyStatus.stunned=(G.enemyStatus.stunned||0)+1;logMsg(`Stunned!`,'system');}
  },
  async flurry(ab) {
    const lv=ab.level;
    const minH=lv>=3?5:4, maxH=lv>=3?7:6;
    const hits=roll(minH,maxH); let total=0;
    const dmgM=[.4,.5,.55,.65][lv-1];
    for(let i=0;i<hits;i++){
      if(playerAttackMisses(ab)){await doMiss('player');logMsg(`Flurry ${i+1} missed!`,'miss');}
      else{
        const r=dealDamage('enemy',pdmg(dmgM));
        await doAttack('player','enemy',r);
        setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
        total+=r.dmgDealt;
        if(tryApplyAilment('enemy','poison',ab)){spawnFloat('enemy','☣','fn-poison');}
        if(tryApplyAilment('enemy','burning',ab)){spawnFloat('enemy','🔥','fn-burn');}
        if(G.battleOver)break;
      }
    }
    logMsg(`💫 Flurry! ${hits} strikes, ${total} total!`,'player-action');
  },
  async retribution(ab) {
    const lv=ab.level;
    if(playerAttackMisses(ab)){await doMiss('player');logMsg(`Retribution missed!`,'miss');return;}
    const hasNegStatus=Object.keys(G.enemyStatus).some(k=>['poison','weaken','paralyzed','burning','confused','feared','stunned','lullabied','delayed'].includes(k)&&G.enemyStatus[k]);
    const isCrit=hasNegStatus||chance(getPlayerCritChance(ab));
    const critMult=lv>=4?2.5:lv>=3?2.2:lv>=2?2.0:G.player.goldCritMult||1.5;
    const baseDmg=pdmg(1.3+.15*(lv-1));
    const finalDmg=isCrit?Math.floor(baseDmg*critMult):baseDmg;
    const r=dealDamage('enemy',finalDmg,false);
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    if(tryApplyAilment('enemy','burning',ab)){spawnFloat('enemy','🔥 Burn!','fn-burn');}
    logMsg(`⚖ Retribution! ${r.dmgDealt}${isCrit?' (CRIT! ×'+critMult.toFixed(1)+')':''}!`,'player-action');
  },
  async deathDive(ab) {
    const lv=ab.level;
    if(playerAttackMisses(ab)){await doMiss('player');logMsg(`Death Dive missed!`,'miss');return;}
    const r=dealDamage('enemy',pdmg(2.0+.2*(lv-1)));
    await doAttack('player','enemy',r);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(G.battleOver)return;
    const stunC=[30,35,40,50][lv-1];
    if(rollStunChance(stunC)){G.enemyStatus.stunned=(G.enemyStatus.stunned||0)+1;await doSpell('enemy','😵 STUNNED!');renderStatuses('enemy-status',G.enemyStatus);logMsg(`Stunned!`,'system');}
    if(tryApplyAilment('enemy','paralyzed',ab)){spawnFloat('enemy','⚡ Para!','fn-status');}
    if(tryApplyAilment('enemy','burning',ab)){spawnFloat('enemy','🔥 Burn!','fn-burn');}
    logMsg(`💀 Death Dive! ${r.dmgDealt}!`,'player-action');
  },
  async chargeUp(ab) {
    G.chargeUpActive=true;
    G.playerStatus.chargeUp=1;
    await doSpell('player','⚡ Charging...');
    renderStatuses('player-status',G.playerStatus);
    logMsg(`⚡ Charge Up! Next attack hits twice!`,'player-action');
  },
  async skipTurn(ab) {
    spawnFloat('player','⏭ Skip','fn-status');
    await delay(350);
    logMsg(`⏭ Skip Turn — you passed and kept Dodge/MDodge.`,'player-action');
  },
  async sittingDuck(ab) {
    G.playerStatus.sittingDuck=1; // dodge/mdodge=0 this round
    G.playerStatus.mdodgeSittingDuck=1;
    spawnFloat('player','🦆 Nothing...','fn-status');
    await delay(600);
    logMsg(`🦆 Sitting Duck... you just stood there (Dodge/MDodge now 0).`,'player-action');
  },
  async warcry(ab) {
    const lv=ab.level;
    const atkBonus=[15,20,25,30][lv-1];
    const spdBonus=[2,3,4,5][lv-1];
    const turns=3; // 2 buffs = max 3t at all levels
    if(lv>=4) G.player.warcryfearImmune=true;
    if(G.playerStatus.warcry){G.player.stats.spd-=G.playerStatus.warcry.spdBonus;}
    G.warcryActive=true; G.warcryATK=atkBonus;
    G.player.stats.spd+=spdBonus;
    G.playerStatus.warcry={turns,atkBonus,spdBonus};
    await doSpell('player',`🎺 WARCRY!`);
    renderStatuses('player-status',G.playerStatus);
    logMsg(`🎺 Warcry! ATK +${atkBonus}%, SPD +${spdBonus} for ${turns}t!`,'player-action');
  },
  async battleHymn(ab) {
    const lv=ab.level;
    const defBonus=[2,4,5,7][lv-1];
    const dodBonus=[0,10,15,20][lv-1]; // no ACC buff - removed
    const turns=lv>=2?3:5; // 1 buff=5t, 2 buffs=3t
    if(G.playerStatus.battleHymn){G.player.stats.def-=G.playerStatus.battleHymn.defBonus;}
    G.battleHymnActive=true; G.battleHymnDEF=defBonus; G.battleHymnACC=0; // no ACC
    G.player.stats.def+=defBonus;
    G.playerStatus.battleHymn={turns,defBonus,accBonus:0,dodBonus};
    if(dodBonus>0) G.playerStatus.battleHymnDodge={bonus:dodBonus,turns};
    await doSpell('player','🎼 Battle Hymn!');
    renderStatuses('player-status',G.playerStatus);
    logMsg(`🎼 Battle Hymn! DEF +${defBonus}${dodBonus>0?', Dodge +'+dodBonus+'%':''} for ${turns}t!`,'player-action');
  },
  async reveille(ab) {
    const lv=ab.level;
    const turns=[3,3,4,4][lv-1];
    const totalPct=[.15,.21,.30,.40][lv-1];
    const pctPerTurn=totalPct/turns;
    G.regenTurns=turns; G.regenPct=pctPerTurn;
    G.playerStatus.regen=turns;
    if(lv>=2){['weaken','burning'].forEach(s=>delete G.playerStatus[s]);}
    if(lv>=3){['weaken','paralyzed','burning','confused'].forEach(s=>delete G.playerStatus[s]);}
    if(lv>=4){G.warcryATK=Math.max(G.warcryATK||0,10);G.warcryActive=true;}
    await doSpell('player','🎵 Reveille!');
    renderStatuses('player-status',G.playerStatus);
    logMsg(`🎵 Reveille! Regen ${Math.floor(totalPct*100)}% HP over ${turns}t!`,'player-action');
  },
  async victoryChant(ab) {
    const lv=ab.level;
    const healPct=[.20,.28,.35,.45][lv-1];
    const heal=Math.floor(G.player.stats.maxHp*healPct);
    G.player.stats.hp=Math.min(G.player.stats.hp+heal,G.player.stats.maxHp);
    await doHeal('player',heal);
    setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);
    // Reduce all cooldowns
    const cdRedux=lv>=3?2:1;
    G.swoopCooldown=Math.max(0,G.swoopCooldown-cdRedux);
    G.crowDefendCooldown=Math.max(0,G.crowDefendCooldown-cdRedux);
    G.intimidateCooldown=Math.max(0,G.intimidateCooldown-cdRedux);
    G.fruitCooldown=Math.max(0,G.fruitCooldown-cdRedux);
    if(G.abilityCooldowns){Object.keys(G.abilityCooldowns).forEach(k=>{G.abilityCooldowns[k]=Math.max(0,G.abilityCooldowns[k]-cdRedux);if(G.abilityCooldowns[k]===0)delete G.abilityCooldowns[k];});}
    if(lv>=4){G.swoopCooldown=0;G.crowDefendCooldown=0;G.intimidateCooldown=0;G.fruitCooldown=0;}
    if(lv>=2){G.warcryActive=true;G.warcryATK=Math.max(G.warcryATK,15);}
    if(lv>=3){delete G.playerStatus.weaken;}
    renderStatuses('player-status',G.playerStatus);
    logMsg(`🎶 Victory Chant! +${heal} HP, all CDs −${cdRedux}!`,'player-action');
  },
  async preen(ab) {
    const lv=ab.level;
    const toClear=['weaken','paralyzed','burning','confused','feared','stunned','lullabied'];
    let removed=0;
    for(const k of toClear){if(G.playerStatus[k]){delete G.playerStatus[k];removed++;if(removed>=lv&&lv<3)break;}}
    const dodBonus=[5,10,15,20][lv-1];
    const turns=[2,2,3,3][lv-1];
    G.playerStatus.humDodge={bonus:dodBonus,turns};
    if(lv>=4){G.playerStatus.accDebuff=0;}
    renderStatuses('player-status',G.playerStatus);
    await doSpell('player','🪶 Preening...');
    logMsg(`🪶 Preen! Cleared ${removed} status(es) + +${dodBonus}% dodge for ${turns}t!`,'player-action');
  },
  async bowedWing(ab) {
    const lv=ab.level;
    if(playerAttackMisses(ab)){await doMiss('player');logMsg('Bowed Wing missed!','miss');return;}
    const dmg=dealDamage('enemy',pdmg([0.95,1.1,1.25,1.4][lv-1],ab),chance(getPlayerCritChance(ab)));
    await doAttack('player','enemy',dmg); setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    applySlowToEnemy([15,20,20,25][lv-1],[2,3,3,5][lv-1],lv>=3?10:0);
    logMsg(`🏹 Bowed Wing hits for ${dmg.dmgDealt}.`,'player-action');
  },
  async curvedTalons(ab) {
    const lv=ab.level;
    if(playerAttackMisses(ab)){await doMiss('player');logMsg('Curved Talons missed!','miss');return;}
    const r=dealDamage('enemy',pdmg([1.2,1.32,1.45,1.6][lv-1],ab),chance(getPlayerCritChance(ab)));
    await doAttack('player','enemy',r); setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(lv>=3&&tryApplyAilment('enemy','weaken',ab))spawnFloat('enemy','🐔 Weaken!','fn-status');
    if(lv>=4&&tryApplyAilment('enemy','poison',ab))spawnFloat('enemy','🩸 Bleed!','fn-poison');
    logMsg(`🦅 Curved Talons: ${r.dmgDealt} (anti-tank pierce).`,'player-action');
  },
  async curvedBeak(ab) {
    if(playerAttackMisses(ab)){await doMiss('player');logMsg('Curved Beak missed!','miss');return;}
    const lv=ab.level;
    const r=dealDamage('enemy',pdmg([1.05,1.18,1.32,1.45][lv-1],ab),chance(getPlayerCritChance(ab)));
    await doAttack('player','enemy',r); setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(tryApplyAilment('enemy','poison',ab))spawnFloat('enemy','🩸 Bleed!','fn-poison');
    if(lv>=3&&tryApplyAilment('enemy','feared',ab))spawnFloat('enemy','💀 Fear!','fn-status');
    logMsg(`🪶 Curved Beak: ${r.dmgDealt}.`,'player-action');
  },
  async wingStorm(ab) {
    const lv=ab.level;
    if(spellMisses()){await doMiss('player');logMsg('Wing Storm fizzled!','miss');return;}
    const dmg=matk([0.95,1.10,1.25,1.40][lv-1]);
    G.enemy.stats.hp-=dmg; setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    await doSpell('enemy',`🌪 -${dmg}`);
    if(rollStunChance([20,25,30,35][lv-1])){G.enemyStatus.stunned=(G.enemyStatus.stunned||0)+1;spawnFloat('enemy','⚡ Stun!','fn-status');}
    const spd=[2,3,4,5][lv-1];
    G.player.stats.spd=Math.min(20,(G.player.stats.spd||1)+spd);
    G.playerStatus.wingStormSPD={turns:2,spd};
    if(lv>=3) applySlowToEnemy(lv>=4?15:10,3,0);
    renderStatuses('player-status',G.playerStatus); renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🌪 Wing Storm hits for ${dmg}. +${spd} SPD for 2t.`,'player-action');
  },
  async wormRiot(ab) {
    const lv=ab.level;
    const healPct=0.30-0.03*(lv-1);
    const heal=Math.max(1,Math.floor(G.enemy.stats.maxHp*healPct));
    G.enemy.stats.hp=Math.min(G.enemy.stats.maxHp,G.enemy.stats.hp+heal);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    G.enemyStatus.wormRiotExpose={turns:2,oldDodge:G.enemy.stats.dodge||0};
    G.enemy.stats.dodge=0;
    await doSpell('enemy',`🪱 Riot! +${heal}`);
    if(lv>=4&&tryApplyAilment('enemy','weaken',ab))spawnFloat('enemy','🐔 Weaken!','fn-status');
    logMsg(`🪱 Worm Riot: enemy healed ${heal}, but Dodge/MDodge exposed for 2t.`,'player-action');
  },
  async supersonic(ab) {
    const lv=ab.level;
    if(playerAttackMisses(ab)){await doMiss('player');logMsg('Supersonic missed!','miss');return;}
    const spd=G.player.stats.spd||1;
    const mult=[0.9,1.05,1.2,1.4][lv-1];
    const raw=Math.max(1,Math.floor(roll(Math.floor(spd*1.8),Math.floor(spd*2.6))*mult));
    const r=dealDamage('enemy',raw,chance(getPlayerCritChance(ab)));
    await doAttack('player','enemy',r); setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    if(tryApplyAilment('enemy','confused',ab))spawnFloat('enemy','❓ Confuse!','fn-status');
    if(lv>=3&&tryApplyAilment('enemy','burning',ab))spawnFloat('enemy','🔥 Burn!','fn-burn');
    logMsg(`🔊 Supersonic: ${r.dmgDealt} (SPD-scaled).`,'player-action');
  },
  async taunt(ab) {
    const lv=ab.level;
    const accPenalty=[25,35,45,55][lv-1];
    const dodBonus=[0,15,20,25][lv-1];
    G.tauntActive=true;
    G.enemyStatus.taunted=1;
    G.enemyStatus.accDebuff=(G.enemyStatus.accDebuff||0)+accPenalty;
    if(dodBonus>0)G.playerStatus.humDodge={bonus:dodBonus,turns:2};
    await doSpell('enemy','😤 TAUNTED!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`😤 Taunt! Enemy ACC −${accPenalty}%, must attack next turn!`,'player-action');
  },
};

async function playerAction(ab,fromQueue=false) {
  const now=(typeof performance!=='undefined'&&performance.now)?performance.now():Date.now();
  if(now<(G._actionTapLockUntil||0)) return;
  G._actionTapLockUntil=now+220;
  if((!fromQueue&&!canPlayerAct())||G.turn!=='player')return;
  if((G.playerActionsThisTurn||0)>=MAX_PLAYER_ACTIONS_PER_TURN){logMsg('Action limit reached — end your turn.','system');return;}

  G.playerTurnFlags = G.playerTurnFlags || {};
  G.playerTurnFlags._spellTempoUsedThisAction = false;
  if(G.autoQueuedAbilityId){
    const autoAb=G.player.abilities.find(x=>x.id===G.autoQueuedAbilityId);
    if(autoAb){
      if(!canUseAbility(G.player,autoAb)){G.autoQueuedAbilityId=null;}
      else {ab=autoAb;logMsg(`🔁 Auto action: ${ab.name}!`,'system');}
    } else G.autoQueuedAbilityId=null;
  }
  // Roost delivery at start of turn
  if(G.playerStatus.roosting==='pending'){
    const rd=G._roostData||{pct:.25,lv:1};
    const {pct,lv}=rd;
    const heal=Math.max(1,Math.floor(G.player.stats.maxHp*pct));
    G.player.stats.hp=Math.min(G.player.stats.hp+heal,G.player.stats.maxHp);
    await doHeal('player',heal);
    setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);
    logMsg(`🌿 Roost HEALS +${heal} HP restored! (${Math.floor(pct*100)}% of max)`,'system');
    if(lv>=2){delete G.playerStatus.weaken;}
    if(lv>=3){['weaken','paralyzed','burning','confused','feared','slow','stunned'].forEach(s=>delete G.playerStatus[s]);}
    if(lv>=4){Object.keys(G.playerStatus).forEach(k=>{if(typeof G.playerStatus[k]==='number'&&G.playerStatus[k]>0) delete G.playerStatus[k];});}
    delete G.playerStatus.roosting;
    G._roostData=null;
  }
  if(G.playerStatus.stunned>0){logMsg(`😵 Stunned — can't act!`,'miss');renderActions();refreshBattleUI();return;}
  const confObj=G.playerStatus.confused;
  if(confObj&&confObj.turns>0&&chance(clampSkipChance(confObj.skipChance||20))&&ab.btnType!=='utility'){
    playAvatarAnim('player','do-miss-r',560);spawnFloat('player','Confused!','fn-miss');await delay(560);
    logMsg(`🌀 Confused — fumbled!`,'miss');renderActions();refreshBattleUI();return;
  }
  if(G.playerStatus.paralyzed>0&&!G.player.immuneParalyze&&chance(AILMENTS.paralyzed.skipChance||20)){
    spawnFloat('player','⚡ Para!','fn-status');await delay(400);
    logMsg(`⚡ Paralyzed — cannot act!`,'miss');renderActions();refreshBattleUI();return;
  }
  // Fear: Goose/Intimidate fear blocks non-utility but does not skip (20% miss applied inside attack fns)
  if(G.playerStatus.feared>0&&!G.player.humImmuneToFear&&!G.player.bulwarkFearImmune){
    if(ab.btnType==='utility'&&ab.id!=='crowDefend'){/* utility ok */}
    else if(ab.id==='crowDefend'){logMsg(`😨 Feared — cannot defend!`,'miss');renderActions();refreshBattleUI();return;}
  }
  // Stick Lance: if stage was armed but player picks something else — reset
  if(G.stickLanceStage===1 && ab.id!=='stickLance'){
    G.stickLanceStage=0;
    logMsg(`🪵 Stick dropped — Stick Lance reset.`,'miss');
  }
  if(getAbilityCooldown(ab.id)>0){logMsg(`${ab.name} on cooldown! (${getAbilityCooldown(ab.id)}t)`,'miss');return;}
  if(!canUseAbility(G.player,ab)){logMsg(`Not enough energy for ${ab.name}!`,'miss');return;}
  spendEnergy(G.player,ab);
  codexMark('abilities',ab.id,'used');
  if(G.enemy?.id==='duke_blakiston') dukeTrackDecree(ab.id);
  G._activePlayerAbility=ab;
  G.playerActionsThisTurn=(G.playerActionsThisTurn||0)+1;
  renderEnergyOrbs();
  G.turnPhase=TURN.RESOLVING;
  G.animLock=true; G.battleOver=false; renderActions();
  // Track buffs/debuffs for run unlock
  if(BUFF_AB_IDS.has(ab.id)) G.runBuffs++;
  if(DEBUFF_AB_IDS.has(ab.id)) G.runDebuffs++;
  // Apply flyby momentum multiplier if charged and this is an attack
  const flybyWasCharged=G.flybyCharged && ['physical','ranged','spell'].includes(ab.btnType);
  if(flybyWasCharged){G.flybyCharged=false;delete G.playerStatus.flyby; G.actionDamageMult=1.75; G.actionDamageHitsRemaining=1;}
  const chargedDouble=G.chargeUpActive && ab.id!=='chargeUp' && ['physical','ranged','spell'].includes(ab.btnType);
  if(chargedDouble){G.chargeUpActive=false;delete G.playerStatus.chargeUp;logMsg('⚡ Charge Up triggers: action repeats!','system');}
  // Temporarily double ATK for flyby
  if(flybyWasCharged) G.player.stats.atk*=2;
  await ACTIONS[ab.id](ab);
  if(chargedDouble && !G.battleOver && G.enemy.stats.hp>0){await ACTIONS[ab.id](ab);}
  G._lastPlayerAbility = ab.id;
  setAbilityCooldown(ab);
  if(ab.btnType==='spell' || ab.type==='spell'){
    reduceOtherSpellCooldownsOnCast(ab.id);
  }
  // Passive: onAbilityUse (Flamingo Balance Master — stance tracking)
  const _flBd=BIRDS[G.player.birdKey];
  if(_flBd&&_flBd.passive&&_flBd.passive.onAbilityUse) _flBd.passive.onAbilityUse(G.player,ab);
  if(flybyWasCharged) G.actionDamageMult=1;
  G._activePlayerAbility=null;
  G.animLock=false;
  if(G.enemy.stats.hp<=0||G.player.stats.hp<=0){if(checkDeath())return;}
  G.turnPhase=TURN.PLAYER;
  G.phase='PLAYER';
  refreshBattleUI();
  if((G.player.energy||0)<=0||G.playerStatus.stunned>0) endPlayerTurn(true);
}


function startPlayerTurn(player){
  player.energyMax = computePlayerMaxEnergy();
  player.energy = player.energyMax;
  G.sitAndWaitUsedThisTurn=false;
  if(typeof BS!=='undefined' && BS.turns===0 && (player.firstTurnEnergy||0)>0){
    player.energy += player.firstTurnEnergy;
  }
  G.playerActionsThisTurn=0;
  G.playerTurnFlags={energyGainedThisTurn:0,onHitTriggered:false};
  G.turn='player';
  G.turnPhase=TURN.PLAYER;
  G.phase='PLAYER';
  G.animLock=false;
  applyRangerPassiveOnTurnStart();
  renderEnergyOrbs();
  renderActions();
  lockActionUI(false);
}
function startEnemyTurn(enemy){
  enemy.energy = enemy.energyMax||3;
  G.phase='ENEMY';
}
function isSpellAbilityId(id){
  const t = ABILITY_TEMPLATES?.[id];
  return !!(t && (t.type==='spell' || t.btnType==='spell'));
}

function isMultiHitAbility(ab){
  if(!ab) return false;
  const t = ABILITY_TEMPLATES?.[ab.id] || ABILITY_TEMPLATES_EXTRA?.[ab.id] || ab;
  const role = Array.isArray(t?.role) ? t.role : [];
  if(role.includes('multiHit')) return true;
  const type = t?.type || ab.type || '';
  const btnType = t?.btnType || ab.btnType || '';
  if(type==='utility' || btnType==='utility' || type==='buff' || btnType==='buff' || type==='debuff' || btnType==='debuff') return false;
  const texts = [t?.desc, ab?.desc, ...(Array.isArray(t?.levels)?t.levels.map(l=>l?.desc):[])].filter(Boolean).join(' | ').toLowerCase();
  return /(\b\d+\s*[-–]\s*\d+\s*hits?\b|\b\d+\s*hits?\b|\b\d+×\b|multi-hit|strikes? at)/.test(texts);
}

function getAbilityEnergyCost(ab, player){
  const p = player || G.player;
  const t = ABILITY_TEMPLATES?.[ab.id] || ABILITY_TEMPLATES_EXTRA?.[ab.id];

  let cost = 0;
  if(typeof ab.energyCost === 'number') cost = ab.energyCost;
  else if(typeof t?.energyCost === 'number') cost = t.energyCost;
  else if(Array.isArray(t?.energyByLevel)){
    const idx = Math.min((ab.level||1)-1, t.energyByLevel.length-1);
    cost = t.energyByLevel[idx] ?? 0;
  }

  if(isMainAttackAbility(ab) && !isSpellAbilityId(ab.id)) cost = 1;

  if(cost===1 && isMultiHitAbility(ab)) cost += 1;

  const maxE = p?.energyMax ?? 99;
  cost = Math.min(cost, maxE);

  return Math.max(0, cost);
}

function getEnergyCost(ability){
  if(!ability) return 0;
  return getAbilityEnergyCost(ability, G.player);
}
function syncAbilityEnergyCost(ability){
  ability.energyCost=getAbilityEnergyCost(ability, G.player);
  return ability.energyCost;
}
function canUseAbility(player, ability){
  const cost=getAbilityEnergyCost(ability, player);
  return (player.energy||0) >= cost;
}
function spendEnergy(player, ability){
  const cost=getAbilityEnergyCost(ability, player);
  player.energy = Math.max(0,(player.energy||0) - cost);
  return cost;
}

function enforceAbilityCosts(player){
  const p = player || G.player;
  if(!p?.abilities) return;
  for(const ab of p.abilities){
    const desired = getAbilityEnergyCost(ab, p);
    ab.energyCost = desired;
  }
}
function gainEnergy(player, amount){
  const gained=G.playerTurnFlags?.energyGainedThisTurn||0;
  const canGain=Math.max(0,MAX_ENERGY_GAIN_PER_TURN-gained);
  const applied=Math.max(0,Math.min(amount||0,canGain));
  if(!applied) return 0;
  if(G.playerTurnFlags) G.playerTurnFlags.energyGainedThisTurn=gained+applied;
  player.energy=Math.min(player.energyMax||0,(player.energy||0)+applied);
  return applied;
}

// ============================================================
//  MAGIC ABILITY ACTION HANDLERS
// ============================================================
// Spell accuracy: MATK vs enemy MDEF determines miss chance
// diff = playerMATK - enemyMDEF
// base miss 18%, ±3% per point difference, clamped 3%–40%
function spellMissChance() {
  const matk = G.player.stats.matk || 8;
  const mdef = G.enemy.stats.mdef || 8;
  const diff = matk - mdef;
  return Math.max(3, Math.min(40, 18 - diff * 3));
}

function spellMisses() {
  return chance(spellMissChance());
}

function summonHitLands(){
  const baseHit=1-(spellMissChance()/100);
  const enemyMDodge=(G.enemy.stats.mdodge!==undefined?G.enemy.stats.mdodge:(G.enemy.stats.dodge||0));
  const attAcc=getPlayerEffectiveAcc();
  const hitChance=calcHitChance(attAcc,enemyMDodge,clamp01(baseHit));
  return Math.random()<hitChance;
}

function spellAilmentRoll(baseChance,isMultiHit=false){
  const matk=(G.player.stats.matk||8), mdef=(G.enemy.stats.mdef||8);
  const statShift=(matk-mdef)*2;
  const multiAdj=isMultiHit?-0.45:0.2;
  const final=Math.max(3,Math.min(92,Math.floor((baseChance+statShift)*(1+multiAdj))));
  return chance(final);
}

function matk(mult=1) {
  const base=G.player.stats.matk||8;
  const matkVsEnemy=base-(G.enemy.stats.mdef||8);
  const adjust=matkVsEnemy*0.015; // ±1.5% per point difference
  // MDodge compensation: spells are slightly stronger to offset player magic evasion
  return Math.max(1,Math.floor(pdmg(1)*(mult+adjust)*base/7.2));
}


Object.assign(ACTIONS, {
  async bleakBeak(ab){
    const r = dealDamage('enemy', pdmg(0.65, ab), chance(getPlayerCritChance(ab)), false, ab);
    await doAttack('player','enemy', r);
    setHpBar('enemy', G.enemy.stats.hp, G.enemy.stats.maxHp);
  },
  async shadowJab(ab){
    const r = dealDamage('enemy', pdmg(0.60, ab), chance(getPlayerCritChance(ab)), false, ab);
    await doAttack('player','enemy', r);
    setHpBar('enemy', G.enemy.stats.hp, G.enemy.stats.maxHp);
    if(chance(25)) applyAilment('enemy','feared',1);
  },
  async pinionVolley(ab){
    const lv=Math.max(1,Math.min(ab.level||1,4));
    const pierceVals=[0.25,0.30,0.35,0.40];
    const oldPierce=ab.piercePct;
    ab.piercePct=Math.max(oldPierce||0,pierceVals[lv-1]);
    for(let i=0;i<2;i++){
      const r = dealDamage('enemy', pdmg(0.55 + (lv-1)*0.07, ab), chance(getPlayerCritChance(ab)), false, ab);
      await doAttack('player','enemy', r);
      if(G.enemy.stats.hp<=0) break;
    }
    ab.piercePct=oldPierce;
    setHpBar('enemy', G.enemy.stats.hp, G.enemy.stats.maxHp);
  },
  async shieldWing(ab){
    const lv=Math.max(1,Math.min(ab.level||1,4));
    const amt = Math.max(8, Math.floor((G.player.stats.def||5)*(2+0.3*(lv-1))));
    G.playerStatus.defending = (G.playerStatus.defending||0) + amt;
    spawnFloat('player', `+${amt}🛡️`, 'fn-status');
    renderStatuses('player-status', G.playerStatus);
  },
  async ironHonk(ab){
    const lv=Math.max(1,Math.min(ab.level||1,4));
    const r = dealDamage('enemy', pdmg(0.55 + (lv-1)*0.1, ab), chance(getPlayerCritChance(ab)), false, ab);
    await doAttack('player','enemy', r);
    setHpBar('enemy', G.enemy.stats.hp, G.enemy.stats.maxHp);
    G.enemyStatus.weaken=Math.max(G.enemyStatus.weaken||0,2+(lv>=3?1:0));
    spawnFloat('enemy','🐔 Weaken!','fn-status');
  },
  async dirgeOfDread(ab){
    if(spellMisses()){ await doMiss('player'); logMsg('Dirge of Dread missed!','miss'); return; }
    const lv=Math.max(1,Math.min(ab.level||1,4));
    await doSpell('player', '🎶');
    const dmg = (typeof matk==='function') ? matk(0.60 + (lv-1)*0.12) : pdmg(0.8 + (lv-1)*0.1, ab);
    const r = dealDamage('enemy', dmg, chance(getPlayerCritChance(ab)), true, ab);
    setHpBar('enemy', G.enemy.stats.hp, G.enemy.stats.maxHp);
    G.enemyStatus.feared=(G.enemyStatus.feared||0)+(2+(lv>=3?1:0));
    G.enemyStatus.weaken=Math.max(G.enemyStatus.weaken||0,2);
    renderStatuses('enemy-status', G.enemyStatus);
  },
  async skyHymn(ab){
    const lv=Math.max(1,Math.min(ab.level||1,4));
    await doSpell('player', '🎵');
    G.playerStatus.humDodge={bonus:10+(lv-1)*5, turns:2};
    const heal = Math.max(3, Math.floor(G.player.stats.maxHp*(0.04 + (lv-1)*0.008)));
    G.player.stats.hp = Math.min(G.player.stats.hp + heal, G.player.stats.maxHp);
    spawnFloat('player', `+${heal}❤️`, 'fn-heal');
    renderStatuses('player-status', G.playerStatus);
    setHpBar('player', G.player.stats.hp, G.player.stats.maxHp);
  },
  async marshHex(ab){
    if(spellMisses()){ await doMiss('player'); logMsg('Marsh Hex missed!','miss'); return; }
    const lv=Math.max(1,Math.min(ab.level||1,4));
    await doSpell('player','🜁');
    const dmg = (typeof matk==='function') ? matk(1.25 + (lv-1)*0.18) : pdmg(1.1 + (lv-1)*0.12, ab);
    const r = dealDamage('enemy', dmg, chance(getPlayerCritChance(ab)), true, ab);
    setHpBar('enemy', G.enemy.stats.hp, G.enemy.stats.maxHp);
    G.enemyStatus.weaken=Math.max(G.enemyStatus.weaken||0,2+(lv>=3?1:0));
    G.enemyStatus.feared=(G.enemyStatus.feared||0)+1;
    renderStatuses('enemy-status', G.enemyStatus);
  },
  async stormCall(ab){
    if(spellMisses()){ await doMiss('player'); logMsg('Storm Call missed!','miss'); return; }
    const lv=Math.max(1,Math.min(ab.level||1,4));
    await doSpell('player','⚡');
    const dmg = (typeof matk==='function') ? matk(1.45 + (lv-1)*0.20) : pdmg(1.2 + (lv-1)*0.14, ab);
    const r = dealDamage('enemy', dmg, chance(getPlayerCritChance(ab)), true, ab);
    setHpBar('enemy', G.enemy.stats.hp, G.enemy.stats.maxHp);
    if(chance(20 + (lv-1)*5)) applyAilment('enemy','paralyzed',1);
  },
  async nightChill(ab){
    if(spellMisses()){ await doMiss('player'); logMsg('Night Chill missed!','miss'); return; }
    const lv=Math.max(1,Math.min(ab.level||1,4));
    await doSpell('player','🌘');
    const dmg = (typeof matk==='function') ? matk(0.95 + (lv-1)*0.13) : pdmg(0.9 + (lv-1)*0.1, ab);
    const r = dealDamage('enemy', dmg, chance(getPlayerCritChance(ab)), true, ab);
    setHpBar('enemy', G.enemy.stats.hp, G.enemy.stats.maxHp);
    applyEnemySlow(2+(lv>=3?1:0), 8+(lv-1)*2, 2);
    spawnFloat('enemy','🐌 Slow!','fn-status');
    renderStatuses('enemy-status', G.enemyStatus);
  },
});

Object.assign(ACTIONS, {
  async birdBrain(ab) {
    if(spellMisses()){await doMiss('player');logMsg(`Bird Brain missed! (MATK ${G.player.stats.matk||8} vs MDEF ${G.enemy.stats.mdef||8})`,'miss');return;}
    const lv=ab.level;
    // Black Cockatoo Crest Scream: spells ignore 20% M.DEF
    const _ccBd=BIRDS[G.player.birdKey];
    const mdefIgnore=(_ccBd&&_ccBd.passive&&_ccBd.passive.id==='crestScream')?0.20:0;
    const effectiveMDEF=(G.enemy.stats.mdef||8)*(1-mdefIgnore);
    const matkBase=G.player.stats.matk||8;
    const baseDmg=Math.max(1,Math.floor([.62,.78,.95,1.12][lv-1]*matkBase/(effectiveMDEF||1)*7.2));
    const isCrit=chance(getPlayerCritChance(ab));
    const dmg=isCrit?Math.floor(baseDmg*(G.player.goldCritMult||1.5)):baseDmg;
    G.enemy.stats.hp-=dmg; setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    spawnFloat('enemy',`🧠 -${dmg}${isCrit?' CRIT':''}!`,'fn-dmg');
    // Crest Scream: crit spells apply Brain Fog
    if(isCrit&&_ccBd&&_ccBd.passive&&_ccBd.passive.id==='crestScream'){
      G.enemyStatus.accDebuff=(G.enemyStatus.accDebuff||0)+15;
      G.enemy.stats.spd=Math.max(1,G.enemy.stats.spd-3);
      spawnFloat('enemy','🧠 Brain Fog!','fn-status');
      logMsg(`🖤 Brain Fog! Enemy −15% ACC, −3 SPD for 3t!`,'system');
    }
    const skipC=[20,22,25,30][lv-1];
    const confT=[3,4,4,5][lv-1];
    if(spellAilmentRoll([45,50,55,60][lv-1],false)) G.enemyStatus.confused={turns:confT,skipChance:skipC};
    if(lv>=3){G.enemyStatus.accDebuff=(G.enemyStatus.accDebuff||0)+([0,0,10,15][lv-1]);G.enemy.stats.spd=Math.max(1,G.enemy.stats.spd-([0,0,2,3][lv-1]));}
    await doSpell('enemy','🧠 BIRD BRAIN!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🧠 Bird Brain! ${dmg} psychic dmg + Confused${isCrit?' (CRIT)':''}!`,'player-action');
    const _bb=BIRDS[G.player.birdKey];if(_bb&&_bb.passive&&_bb.passive.onSpell){_bb.passive.onSpell(G.player);setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);spawnFloat('player','+2 Song','fn-heal');}
  },
  async sonicDirge(ab) {
    if(spellMisses()){await doMiss('player');logMsg(`Sonic Dirge missed! (MATK ${G.player.stats.matk||8} vs MDEF ${G.enemy.stats.mdef||8})`,'miss');return;}
    const lv=ab.level;
    const ignoreMDEF=lv>=3?0.3:0;
    const effectiveMDEF=(G.enemy.stats.mdef||8)*(1-ignoreMDEF);
    const matkBase=G.player.stats.matk||8;
    const dmg=Math.max(1,Math.floor(pdmg(1)*([.9,1.1,1.3,1.55][lv-1])*(matkBase/(effectiveMDEF||1))*0.88));
    G.enemy.stats.hp-=dmg; setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    spawnFloat('enemy',`🔊 -${dmg}`,'fn-dmg');
    if(lv>=2){const dot=Math.floor(G.enemy.stats.maxHp*.1);G.enemy.stats.hp-=dot;setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);spawnFloat('enemy',`-${dot}`,'fn-poison');}
    const skipC=[20,22,25,30][lv-1];
    const skipT=[3,3,4,5][lv-1];
    if(spellAilmentRoll([40,45,50,55][lv-1],false)) G.enemyStatus.sonicSkip={chance:skipC,turns:skipT};
    if(lv>=4){const selfHeal=Math.floor(G.player.stats.maxHp*.2);G.player.stats.hp=Math.min(G.player.stats.hp+selfHeal,G.player.stats.maxHp);setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);spawnFloat('player',`+${selfHeal}`,'fn-heal');}
    await doSpell('enemy','🔊 SONIC DIRGE!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🔊 Sonic Dirge! ${dmg} sonic dmg + ${skipC}% turn skip for ${skipT}t!`,'player-action');
    const _bb2=BIRDS[G.player.birdKey];if(_bb2&&_bb2.passive&&_bb2.passive.onSpell){_bb2.passive.onSpell(G.player);setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);spawnFloat('player','+2 Song','fn-heal');}
  },
  async owlPsyche(ab) {
    if(spellMisses()){await doMiss('player');logMsg(`Owl's Psyche missed! (MATK ${G.player.stats.matk||8} vs MDEF ${G.enemy.stats.mdef||8})`,'miss');return;}
    const lv=ab.level;
    const dmg=matk([.7,.9,1.1,1.3][lv-1]);
    G.enemy.stats.hp-=dmg; setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    spawnFloat('enemy',`🦉 -${dmg}`,'fn-dmg');
    const paraC=[15,20,20,25][lv-1];
    const turns=lv>=3?2:lv>=2?4:3;
    if(spellAilmentRoll(paraC,false))G.enemyStatus.paralyzed=(G.enemyStatus.paralyzed||0)+turns;
    if(lv>=4) G.player._mdefPierce=true;
    await doSpell('enemy','🦉 PSYCHE HOOT!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🦉 Owl's Psyche! ${dmg} psychic dmg + Paralysis chance.`,'player-action');
    const _bb3=BIRDS[G.player.birdKey];if(_bb3&&_bb3.passive&&_bb3.passive.onSpell){_bb3.passive.onSpell(G.player);setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);spawnFloat('player','+2 Song','fn-heal');}
  },
  async shriekwave(ab) {
    if(spellMisses()){await doMiss('player');logMsg(`Shriekwave missed! (MATK ${G.player.stats.matk||8} vs MDEF ${G.enemy.stats.mdef||8})`,'miss');return;}
    const lv=ab.level;
    const isBurned=G.enemyStatus.burning>0;
    const dmg=matk([1.0,1.2,1.4,1.65][lv-1]);
    const burnCritBonus=(isBurned&&lv>=3)?15:0;
    const isCrit=chance(Math.min(95,getPlayerCritChance(ab)+burnCritBonus));
    G.enemy.stats.hp-=(isCrit?Math.floor(dmg*(G.player.goldCritMult||1.5)):dmg);
    setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
    spawnFloat('enemy',`🔥 -${dmg}${isCrit?' CRIT':''}!`,'fn-burn');
    if(spellAilmentRoll([55,60,65,70][lv-1],false)) G.enemyStatus.burning=[3,4,4,5][lv-1];
    if(lv>=4&&chance(15))applyAilment('enemy','poison',1);
    await doSpell('enemy','🔊 SHRIEKWAVE!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🔊 Shriekwave! ${dmg} dmg + Burn${isCrit?' (CRIT!)':''}!`,'player-action');
    const _bb4=BIRDS[G.player.birdKey];if(_bb4&&_bb4.passive&&_bb4.passive.onSpell){_bb4.passive.onSpell(G.player);setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);spawnFloat('player','+2 Song','fn-heal');}
  },
  async mobSwarm(ab) {
    const lv=ab.level;
    const hits=[3,4,4,5][lv-1];
    const dmgM=[.4,.45,.5,.55][lv-1];
    let total=0;
    for(let i=0;i<hits;i++){
      if(!summonHitLands()){await doMiss('player');continue;}
      const d=matk(dmgM);
      G.enemy.stats.hp-=d; total+=d;
      spawnFloat('enemy',` -${d}`,'fn-dmg');
      setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
      await delay(180);
      if(G.battleOver)return;
    }
    const skipC=[15,20,0,0][lv-1];
    const canConfuse=skipC&&spellAilmentRoll([18,22,0,0][lv-1],true);
    const canFear=lv>=3&&spellAilmentRoll([12,14,16,18][lv-1],true);
    if(canConfuse){
      G.enemyStatus.confused={turns:lv>=2?2:1,skipChance:skipC};
    }else if(canFear){
      G.enemyStatus.feared=(G.enemyStatus.feared||0)+(lv>=4?2:1);
    }
    await doSpell('enemy',' MOB SWARM!');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(` Mob Swarm! ${hits} hits, ${total} total!`,'player-action');
    const _bb5=BIRDS[G.player.birdKey];if(_bb5&&_bb5.passive&&_bb5.passive.onSpell){_bb5.passive.onSpell(G.player);setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);spawnFloat('player','+2 Song','fn-heal');}
  },
  async thornBarrage(ab) {
    const lv=ab.level; const hits=lv>=3?3:2; let total=0;
    const spdPen=[2,2,3,3][lv-1], dodgePen=[10,12,15,20][lv-1], turns=[2,2,3,3][lv-1];
    for(let i=0;i<hits;i++){
      if(playerAttackMisses(ab)){await doMiss('player');continue;}
      G._currentPiercePct=50;
      const r=dealDamage('enemy',pdmg([.75,.82,.8,.88][lv-1],ab));
      total+=r.dmgDealt; await doAttack('player','enemy',r); setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp); if(G.battleOver)return;
    }
    applyEnemySlow(spdPen,dodgePen,turns);
    if(tryApplyAilment('enemy','poison',ab)) spawnFloat('enemy','☣','fn-poison');
    renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🌵 Thorn Barrage! ${total} total ranged dmg + Slow.`,'player-action');
  },
  async shadowPounce(ab) {
    const lv=ab.level;
    if(playerAttackMisses(ab)){await doMiss('player');logMsg('Shadow Pounce missed!','miss');return;}
    const hpPct=(G.enemy.stats.hp/Math.max(1,G.enemy.stats.maxHp));
    const finisher=(hpPct<0.4?[0,0,0,0.3][lv-1]:hpPct<0.5?[0,0.1,0.2,0.3][lv-1]:0);
    const isCrit=chance(Math.min(100,(G.player.stats.critChance||5)+[20,25,30,35][lv-1]));
    const r=dealDamage('enemy',pdmg(([1.15,1.3,1.45,1.65][lv-1])*(1+finisher),ab),isCrit,false);
    await doAttack('player','enemy',r); setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp); if(G.battleOver)return;
    if(tryApplyAilment('enemy','feared',ab)) spawnFloat('enemy','😨','fn-status');
    logMsg(`🗡 Shadow Pounce! ${r.dmgDealt}${isCrit?' CRIT':''}${finisher>0?' (finisher bonus)':''}.`,'player-action');
  },
  async bulwarkRoar(ab) {
    const lv=ab.level; const defB=[6,8,10,12][lv-1]; const atkRed=[10,15,20,25][lv-1]; const turns=[2,2,3,3][lv-1];
    G.player.stats.def+=defB; G.playerStatus.bulwarkRoar={turns,defBonus:defB};
    G.enemyStatus.featherRuffle={...(G.enemyStatus.featherRuffle||{}),atkReduction:atkRed,turns:Math.max((G.enemyStatus.featherRuffle||{}).turns||0,turns),accDrop:(G.enemyStatus.featherRuffle||{}).accDrop||0};
    if(lv>=2) G.playerStatus.humDodge={bonus:10,turns:2};
    if(lv>=4) G.player.bulwarkFearImmune=2;
    await doSpell('player','🛡 BULWARK!');
    renderStatuses('player-status',G.playerStatus); renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🛡 Bulwark Roar! DEF +${defB}, enemy ATK −${atkRed}% for ${turns}t.`,'player-action');
  },
  async astralRefrain(ab) {
    if(spellMisses()){await doMiss('player');logMsg('Astral Refrain missed!','miss');return;}
    const lv=ab.level; const dmg=matk([.95,1.1,1.3,1.5][lv-1]);
    G.enemy.stats.hp-=dmg; setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp); spawnFloat('enemy',`✨ -${dmg}`,'fn-dmg');
    const accDrop=[10,12,15,20][lv-1]; G.enemyStatus.accDebuff=(G.enemyStatus.accDebuff||0)+accDrop;
    if(spellAilmentRoll([35,40,45,50][lv-1],false)){applyAilment('enemy','weaken',1);spawnFloat('enemy','🐔','fn-status');}
    if(spellAilmentRoll([30,35,40,45][lv-1],false)) G.enemyStatus.confused={turns:3+Math.floor(lv/2),skipChance:20+5*lv};
    if(spellAilmentRoll([25,30,35,40][lv-1],false)) G.enemyStatus.feared=(G.enemyStatus.feared||0)+1;
    await doSpell('enemy','🎼 ASTRAL!'); renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`🎼 Astral Refrain! ${dmg} spell dmg, ACC −${accDrop}%.`,'player-action');
  },
  async murderMurmuration(ab) {
    const lv=ab.level; const hits=[3,4,4,5][lv-1]; const mult=[.4,.42,.48,.5][lv-1]; let total=0;
    for(let i=0;i<hits;i++){if(!summonHitLands()){await doMiss('player');continue;}const d=matk(mult); G.enemy.stats.hp-=d; total+=d; spawnFloat('enemy',`‍⬛ -${d}`,'fn-dmg'); setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp); await delay(150); if(G.battleOver)return;}
    const conf=[15,20,25,30][lv-1]; if(spellAilmentRoll(conf,true)) G.enemyStatus.confused={turns:1,skipChance:16+lv*2};
    const fearT=[0,1,2,2][lv-1]; if(fearT>0&&spellAilmentRoll([10,12,14,16][lv-1],true)) G.enemyStatus.feared=(G.enemyStatus.feared||0)+fearT;
    if(lv>=4) G.enemyStatus.featherRuffle={...(G.enemyStatus.featherRuffle||{}),atkReduction:15,turns:2,accDrop:(G.enemyStatus.featherRuffle||{}).accDrop||0};
    await doSpell('enemy','‍⬛ MURMURATION!'); renderStatuses('enemy-status',G.enemyStatus);
    logMsg(`‍⬛ Murder Murmuration! ${hits} hits, ${total} total.`,'player-action');
  },
});

function endPlayerTurn(force=false) {
  if(!force && (G.actionBusy||(G.actionQueue&&G.actionQueue.length))){
    logMsg('Actions pending…','miss');
    return;
  }
  if(G.turnPhase!==TURN.PLAYER||G.phase!=='PLAYER') return;
  G.animLock=false;
  G.turnPhase=TURN.ENEMY;
  G.phase='ENEMY';
  lockActionUI(true);
  BS.turns++;
  // Tick Tookie Tookie
  if(G.playerStatus.tookie){
    G.playerStatus.tookie.turns--;
    if(G.playerStatus.tookie.turns<=0){
      const t=G.playerStatus.tookie;
      if(t.defBonus>0) G.player.stats.def=Math.max(0,G.player.stats.def-t.defBonus);
      if(t.critBonus>0) G.player.stats.critChance=Math.max(0,(G.player.stats.critChance||10)-t.critBonus);
      delete G.playerStatus.tookie;
      G.tookieActive=false; G.tookieMiss=0;
      logMsg(`🦜 Tookie Tookie fades.`,'system');
    }
  }
  // Tick dustDevil/hum turns
  // dustDevil is now an enemy debuff (blind)
  if(G.enemyStatus.dustDevil){
    G.enemyStatus.dustDevil.turns--;
    if(G.enemyStatus.dustDevil.turns<=0){
      G.enemyStatus.accDebuff=Math.max(0,(G.enemyStatus.accDebuff||0)-(G.enemyStatus.dustDevil.accDrop||0));
      delete G.enemyStatus.dustDevil;
    }
  }
  if(G.playerStatus.hum){
    G.playerStatus.hum--;
    if(G.playerStatus.hum<=0){delete G.playerStatus.hum;G.player.humImmuneToFear=false;G.humMissBonus=0;delete G.playerStatus.humDodge;}
  } else if(G.playerStatus.humDodge) {
    G.playerStatus.humDodge.turns--;
    if(G.playerStatus.humDodge.turns<=0) delete G.playerStatus.humDodge;
  }
  // Tick warcry
  if(G.playerStatus.warcry){
    G.playerStatus.warcry.turns--;
    if(G.playerStatus.warcry.turns<=0){G.player.stats.spd-=G.playerStatus.warcry.spdBonus;delete G.playerStatus.warcry;G.warcryActive=false;G.warcryATK=0;}
  }
  // Tick battleHymnDodge
  if(G.playerStatus.battleHymnDodge){G.playerStatus.battleHymnDodge.turns--;if(G.playerStatus.battleHymnDodge.turns<=0)delete G.playerStatus.battleHymnDodge;}
  // Tick Flamingo ATK bonus
  if(G.playerStatus.flamingoATK){G.playerStatus.flamingoATK.turns--;if(G.playerStatus.flamingoATK.turns<=0)delete G.playerStatus.flamingoATK;}
  // Tick Last Stand ATK bonus
  if(G.playerStatus.lastStandBuff){
    G.playerStatus.lastStandBuff.turns--;
    if(G.playerStatus.lastStandBuff.turns<=0){
      G.player.stats.atk=Math.max(1,G.player.stats.atk-G.playerStatus.lastStandBuff.atkBonus);
      delete G.playerStatus.lastStandBuff;
      logMsg('🦅 Last Stand ATK fades.','system');
    }
  }
  // Tick battleHymn
  if(G.playerStatus.battleHymn){
    G.playerStatus.battleHymn.turns--;
    if(G.playerStatus.battleHymn.turns<=0){G.player.stats.def-=G.playerStatus.battleHymn.defBonus;delete G.playerStatus.battleHymn;delete G.playerStatus.battleHymnDodge;G.battleHymnActive=false;G.battleHymnDEF=0;G.battleHymnACC=0;}
  }
  // Tick regen
  if(G.playerStatus.regen){
    G.playerStatus.regen--;
    if(G.regenPct>0){
      const healAmt=Math.max(1,Math.floor(G.player.stats.maxHp*G.regenPct));
      G.player.stats.hp=Math.min(G.player.stats.hp+healAmt,G.player.stats.maxHp);
      spawnFloat('player',`+${healAmt}`,'fn-heal');
      setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);
    }
    if(G.playerStatus.regen<=0){delete G.playerStatus.regen;G.regenTurns=0;G.regenPct=0;}
  }
  // Fire passive onTurnEnd
  const _ptbd=BIRDS[G.player.birdKey];
  if(_ptbd&&_ptbd.passive&&_ptbd.passive.onTurnEnd) _ptbd.passive.onTurnEnd(G.player);
  // Ostrich Rage Charge: reset if last action wasn't honkAttack
  if((G.player.birdKey==='ostrich'||G.player.birdKey==='emu')&&G.player._rageCharge>0&&!['honkAttack','headWhip'].includes(G._lastPlayerAbility)){
    G.player._rageCharge=0;
  }
  G._lastPlayerAbility=null;
  // Update peregrine crit from velocity stacks
  if(G.player.birdKey==='peregrine'&&G.player._velocityStacks!==undefined){
    G.player.stats.critChance=(BIRDS.peregrine.stats.critChance||12)+G.player._velocityStacks;
  }
  if(G.playerStatus.sittingDuck)delete G.playerStatus.sittingDuck;
  if(G.playerStatus.mdodgeSittingDuck)delete G.playerStatus.mdodgeSittingDuck;
  if(G.playerStatus.guardianCry){G.playerStatus.guardianCry.turns--; if(G.playerStatus.guardianCry.turns<=0){G.player.stats.def=Math.max(0,G.player.stats.def-(G.playerStatus.guardianCry.defBonus||0));delete G.playerStatus.guardianCry;}}
  if(G.playerStatus.humImmuneToFear){G.playerStatus.humImmuneToFear--; if(G.playerStatus.humImmuneToFear<=0)delete G.playerStatus.humImmuneToFear;}
  if(G.playerStatus.wingStormSPD){
    G.playerStatus.wingStormSPD.turns--;
    if(G.playerStatus.wingStormSPD.turns<=0){G.player.stats.spd=Math.max(1,(G.player.stats.spd||1)-(G.playerStatus.wingStormSPD.spd||0));delete G.playerStatus.wingStormSPD;}
  }
  if(G.enemyStatus.wormRiotExpose){
    G.enemyStatus.wormRiotExpose.turns--;
    if(G.enemyStatus.wormRiotExpose.turns<=0){G.enemy.stats.dodge=G.enemyStatus.wormRiotExpose.oldDodge||0;delete G.enemyStatus.wormRiotExpose;}
  }
  tickStatuses('player');
  G.turn='enemy';
  lockActionUI(true);
  refreshBattleUI();
  setTimeout(enemyTurn,500);
}

// ============================================================
//  ENEMY AI
// ============================================================
function getEnemyActionEnergyCost(action){
  if(!action) return 1;
  if(action.type==='strike') return 1;
  if(action.type==='heavy') return 2;
  if(action.type==='defend') return 2;
  if(action.type==='ability'){
    const id=action.abilityId;
    const map={eHeal:3,eShield:2,eStun:3,eRage:2,eWeaken:2,eFear:2,eBurn:2,eBlind:1,ePoison:2,eVenom:2};
    return map[id]||2;
  }
  return 1;
}
function getEnemyMode(e,p){
  const hpPct=(e.stats.hp||1)/Math.max(1,e.stats.maxHp||1);
  const pHpPct=(p.stats.hp||1)/Math.max(1,p.stats.maxHp||1);
  const canDebuff=(e.abilities||[]).some(id=>['eWeaken','eFear','eBlind','ePoison','eVenom'].includes(id));
  if(hpPct<0.30) return 'RECOVER';
  if(pHpPct<0.35) return 'EXECUTE';
  if(canDebuff) return 'SETUP';
  return 'PRESSURE';
}
function buildEnemyActionPool(e,mode){
  const abs=e.abilities||[];
  const pool=[];
  const add=(a,w)=>{for(let i=0;i<w;i++) pool.push(a);};
  if(mode==='RECOVER'){
    if(abs.includes('eHeal')) add({type:'ability',abilityId:'eHeal',icon:'🌿',label:'Heal'},5);
    if(abs.includes('eShield')) add({type:'ability',abilityId:'eShield',icon:'🛡',label:'Shield'},4);
    add({type:'defend',icon:'🛡',label:'Defend'},3);
    add({type:'strike',icon:'⚔',label:'Attack'},2);
  }else if(mode==='EXECUTE'){
    add({type:'heavy',icon:'💢',label:'Heavy Strike'},5);
    add({type:'strike',icon:'⚔',label:'Attack'},3);
    for(const id of abs){ if(['eRage','eStun','ePoison','eBurn'].includes(id)) add({type:'ability',abilityId:id,icon:'✦',label:ENEMY_ABILITY_POOL[id]?.name||id},2); }
  }else if(mode==='SETUP'){
    for(const id of abs){ if(['eWeaken','eFear','eBlind','ePoison','eVenom'].includes(id)) add({type:'ability',abilityId:id,icon:'🌀',label:ENEMY_ABILITY_POOL[id]?.name||id},4); }
    add({type:'strike',icon:'⚔',label:'Attack'},3);
    add({type:'defend',icon:'🛡',label:'Defend'},1);
  }else{
    add({type:'strike',icon:'⚔',label:'Attack'},5);
    add({type:'heavy',icon:'💢',label:'Heavy Strike'},2);
    for(const id of abs){ if(['eWeaken','eFear','eBlind','eRage'].includes(id)) add({type:'ability',abilityId:id,icon:'✦',label:ENEMY_ABILITY_POOL[id]?.name||id},2); }
  }
  return pool;
}
function projectedEnemyActionDamage(a,e){
  if(!a) return 0;
  if(a.type==='strike') return Math.floor((e.stats.atk||8)*1.0);
  if(a.type==='heavy') return Math.floor((e.stats.atk||8)*1.6);
  if(a.type==='ability'){
    if(a.abilityId==='eStun') return Math.floor((e.stats.atk||8)*1.1);
    return 0;
  }
  return 0;
}
function planEnemyTurn(e,p){
  const mode=getEnemyMode(e,p);
  const pool=buildEnemyActionPool(e,mode);
  const actions=[];
  let energy=e.energyMax||3;
  let projected=0;
  let hardCCUsedLast=(G.enemyLastPlan||[]).some(a=>a.type==='ability'&&a.abilityId==='eStun');
  let nonDmgEvery2=0;
  const diff=G.difficulty||'juvenile';
  const murderMode=diff==='murder';
  const hardMode=diff==='predator';

  // Turn-1 debuff opener guaranteed on Murder, preferred on Hard
  const hardCCBlocked=!!G.enemyUsedHardCCLastTurn;
  if((G.enemyTurnCount||0)<=1){
    const openers=(e.abilities||[]).filter(id=>['eWeaken','eBlind','eFear'].includes(id));
    if(openers.length){
      const opener={type:'ability',abilityId:openers[0],icon:'🌀',label:ENEMY_ABILITY_POOL[openers[0]]?.name||openers[0]};
      const oc=getEnemyActionEnergyCost(opener);
      if(oc<=energy && (murderMode || (hardMode&&chance(70)))){
        actions.push({...opener,energyCost:oc});
        energy-=oc;
      }
    }
  }

  // Smarter heal gate: only if meaningful missing HP
  const hpMissingPct=1-((e.stats.hp||1)/Math.max(1,e.stats.maxHp||1));
  if(hpMissingPct<=0.12){
    for(let i=pool.length-1;i>=0;i--){ if(pool[i].type==='ability'&&pool[i].abilityId==='eHeal') pool.splice(i,1); }
  }
  while(energy>0&&pool.length){
    let pick=pool[Math.floor(Math.random()*pool.length)];
    if((hardMode||murderMode) && chance(murderMode?65:45)){
      const weighted=pool.slice().sort((a,b)=>projectedEnemyActionDamage(b,e)-projectedEnemyActionDamage(a,e));
      pick=weighted[0]||pick;
    }
    const c=getEnemyActionEnergyCost(pick);
    if(c>energy){
      const affordable=pool.filter(a=>getEnemyActionEnergyCost(a)<=energy);
      if(!affordable.length) break;
      pick=affordable[Math.floor(Math.random()*affordable.length)];
    }
    if((hardCCUsedLast||hardCCBlocked)&&pick.type==='ability'&&pick.abilityId==='eStun'){
      const noCC=pool.filter(a=>!(a.type==='ability'&&a.abilityId==='eStun')&&getEnemyActionEnergyCost(a)<=energy);
      if(noCC.length) pick=noCC[Math.floor(Math.random()*noCC.length)];
    }
    const dmg=projectedEnemyActionDamage(pick,e);
    const capPct=e.isBoss?0.60:0.45;
    if(projected+dmg > (p.stats.maxHp||1)*capPct){
      const lighter=pool.filter(a=>projectedEnemyActionDamage(a,e)<=Math.max(1,(p.stats.maxHp||1)*capPct-projected)&&getEnemyActionEnergyCost(a)<=energy);
      if(lighter.length) pick=lighter[Math.floor(Math.random()*lighter.length)];
    }
    actions.push({...pick,energyCost:getEnemyActionEnergyCost(pick)});
    energy-=getEnemyActionEnergyCost(pick);
    projected+=projectedEnemyActionDamage(pick,e);
    if(pick.type==='ability'&&pick.abilityId==='eStun') hardCCUsedLast=true;
    if(['defend'].includes(pick.type) || (pick.type==='ability'&&['eWeaken','eFear','eBlind','eRage','eHeal','eShield'].includes(pick.abilityId))) nonDmgEvery2=0;
    else nonDmgEvery2++;
    if(nonDmgEvery2>=2){
      const support=pool.filter(a=>(a.type==='defend'||(a.type==='ability'&&['eWeaken','eFear','eBlind','eShield','eHeal'].includes(a.abilityId)))&&getEnemyActionEnergyCost(a)<=energy);
      if(support.length&&energy>0){
        const sup=support[Math.floor(Math.random()*support.length)];
        actions.push({...sup,energyCost:getEnemyActionEnergyCost(sup)});
        energy-=getEnemyActionEnergyCost(sup);
      }
      break;
    }
    if(actions.length>=4) break;
  }
  return {mode,actions};
}

const ENEMY_AI = {
  aggressive(enemy){
    if(enemyCanUse(enemy,'heavy')) return enemyUse(enemy,'heavy');
    return enemyUse(enemy,'strike');
  },
  defensive(enemy){
    if(enemyHpPct(enemy)<=0.55 && enemyCanUse(enemy,'defend')) return enemyUse(enemy,'defend');
    if(enemyCanUse(enemy,'debuff') && Math.random()<0.25) return enemyUse(enemy,'debuff');
    return enemyUse(enemy,'strike');
  },
  trickster(enemy){
    if(enemyCanUse(enemy,'debuff')) return enemyUse(enemy,'debuff');
    if(enemyCanUse(enemy,'strike') && Math.random()<0.65) return enemyUse(enemy,'strike');
    return enemyUse(enemy,'defend');
  },
  predator(enemy){
    if(playerHpPct()<=0.45 && enemyCanUse(enemy,'heavy')) return enemyUse(enemy,'heavy');
    if(enemyCanUse(enemy,'heavy') && Math.random()<0.35) return enemyUse(enemy,'heavy');
    return enemyUse(enemy,'strike');
  },
  boss(enemy){
    return enemyUse(enemy,'heavy')||enemyUse(enemy,'strike');
  }
};

function enemyHpPct(e){ return (e?.stats?.hp||1)/Math.max(1,(e?.stats?.maxHp||1)); }
function playerHpPct(){ return (G.player?.stats?.hp||1)/Math.max(1,(G.player?.stats?.maxHp||1)); }
function mapAiStyleToType(style){
  const s=String(style||'').toLowerCase();
  if(['aggressive','berserker'].includes(s)) return 'aggressive';
  if(['cautious','defensive'].includes(s)) return 'defensive';
  if(['trickster'].includes(s)) return 'trickster';
  if(['predator'].includes(s)) return 'predator';
  return 'aggressive';
}
function enemyActionFromPool(e,key){
  const mode=getEnemyMode(e,G.player);
  const pool=buildEnemyActionPool(e,mode);
  const pickers={
    strike:()=>pool.find(a=>a.type==='strike'),
    heavy:()=>pool.find(a=>a.type==='heavy')||pool.find(a=>a.type==='ability'&&['eStun','eRage'].includes(a.abilityId)),
    defend:()=>pool.find(a=>a.type==='defend')||pool.find(a=>a.type==='ability'&&['eShield','eHeal'].includes(a.abilityId)),
    debuff:()=>pool.find(a=>a.type==='ability'&&['eWeaken','eFear','eBlind'].includes(a.abilityId)),
  };
  const a=(pickers[key]&&pickers[key]())||pool[0];
  return a?{...a,energyCost:getEnemyActionEnergyCost(a)}:null;
}
function enemyCanUse(enemy,key){ return !!enemyActionFromPool(enemy,key); }
function enemyUse(enemy,key){ return enemyActionFromPool(enemy,key); }
function bossScriptPick(enemy){ return enemyUse(enemy,'heavy')||enemyUse(enemy,'strike'); }

function planEnemyAction() {
  const e=G.enemy;
  const aiType=(e.aiType||mapAiStyleToType(e.aiStyle)||'aggressive').toLowerCase();
  const fn=ENEMY_AI[aiType]||ENEMY_AI.aggressive;
  let actions=[];
  const first=fn(e);
  if(first) actions.push(first);
  const second=(Math.random()<0.55)?fn(e):null;
  if(second) actions.push(second);
  if(!actions.length){
    const plan=planEnemyTurn(e,G.player);
    actions=plan.actions;
  }
  G.enemyPlannedActions=actions;
  const preview=actions.slice(0,2).map(a=>`${a.icon||'•'} ${a.type==='ability'?(ENEMY_ABILITY_POOL[a.abilityId]?.name||a.abilityId):a.label}`).join(' → ');
  const more=actions.length>2?' +':'';
  return {label:`${preview}${more}`,type:'plan',actions,mode:aiType};
}


function isBossEnrageAllowed(){ return !!(G.endlessMode && (G.stage||0) > 20); }
function dukeNightfall(){
  const d=G.enemy.duke; d.phase=2; d.nightfallTurns=2;
  setStatusMax(G.enemyStatus,'nightfall',2);
  setStatusMax(G.playerStatus,'blind',Math.max(G.playerStatus.blind||0,1));
  addStatus(G.enemyStatus,'defending',10,999);
  logMsg('🦉 Nightfall descends. The marsh swallows light.','boss');
}
function dukeRiverGrip(){
  setStatusMax(G.playerStatus,'rooted',2);
  setStatusMax(G.playerStatus,'slow',2);
  spawnFloat('player','🌊 River Grip!','fn-status');
  logMsg('🌊 River Grip binds your wings.','boss');
}
function dukeTrackDecree(abilityId){
  const d=G.enemy?.duke; if(!d) return;
  if(d.decreeKey===abilityId) d.decreeStacks=clamp((d.decreeStacks||0)+1,0,6);
  else { d.decreeKey=abilityId; d.decreeStacks=0; }
}
function dukeApplyDecreePunish(){
  const d=G.enemy.duke; const st=d.decreeStacks||0; if(st<=0) return;
  addStatus(G.playerStatus,'weaken',1+Math.floor(st/2),6);
  addStatus(G.playerStatus,'vulnerable',1,6);
  spawnFloat('player',`📜 Decree(${st})`,'fn-status');
  logMsg(`📜 Court Decree punishes repetition (${st}).`,'boss');
}
function dukeOwlsVerdict(){
  const p=G.player.stats; const missing=1-(p.hp/p.maxHp); const mult=1.15+missing*0.95;
  const r=dealDamage('player',edmg(1.35*mult));
  spawnFloat('player',`🦉-${r.dmgDealt}`,'fn-dmg');
  logMsg('🦉 Owl’s Verdict!','boss');
}
function dukeSummonCourt(){
  addStatus(G.enemyStatus,'defending',18,999);
  addStatus(G.enemyStatus,'wardens',2,4);
  spawnFloat('enemy','🛡️ Court Guards!','fn-status');
  logMsg('🛡️ The Court gathers—wardens at his wings.','boss');
}
function dukeTurnAI(){
  const e=G.enemy; const d=e.duke;
  const enraged=isBossEnrageAllowed() && e.stats.hp<=Math.floor(e.stats.maxHp*0.35);
  if(enraged) setStatusMax(G.enemyStatus,'enraged',2);
  d.riverCd=Math.max(0,(d.riverCd||0)-1);
  d.summonCd=Math.max(0,(d.summonCd||0)-1);
  d.verdictCd=Math.max(0,(d.verdictCd||0)-1);
  if(d.phase>=3) dukeApplyDecreePunish();
  if(d.phase===1 && e.stats.hp<=Math.floor(e.stats.maxHp*0.75)){ dukeNightfall(); return; }
  if(d.phase===2){ d.nightfallTurns--; if(d.nightfallTurns<=0){ d.phase=3; logMsg('📜 The Court speaks in decree.','boss'); } }
  if(d.summonCd===0){ d.summonCd=4; dukeSummonCourt(); return; }
  if(d.riverCd===0){ d.riverCd=3; dukeRiverGrip(); return; }
  const p=G.player.stats;
  if(d.verdictCd===0 && (p.hp<=Math.floor(p.maxHp*0.35) || (G.enemyStatus.enraged||0)>0)){ d.verdictCd=3; dukeOwlsVerdict(); return; }
  const r=dealDamage('player',edmg(1.0));
  spawnFloat('player',`-${r.dmgDealt}`,'fn-dmg');
  logMsg('🦉 Talons in the dark.','boss');
}


function isBossEnrageAllowed(){ return !!(G.endlessMode && (G.stage||0) > 20); }
function dukeNightfall(){
  const d=G.enemy.duke; d.phase=2; d.nightfallTurns=2;
  setStatusMax(G.enemyStatus,'nightfall',2);
  setStatusMax(G.playerStatus,'blind',Math.max(G.playerStatus.blind||0,1));
  addStatus(G.enemyStatus,'defending',10,999);
  logMsg('🦉 Nightfall descends. The marsh swallows light.','boss');
}
function dukeRiverGrip(){
  setStatusMax(G.playerStatus,'rooted',2);
  setStatusMax(G.playerStatus,'slow',2);
  spawnFloat('player','🌊 River Grip!','fn-status');
  logMsg('🌊 River Grip binds your wings.','boss');
}
function dukeTrackDecree(abilityId){
  const d=G.enemy?.duke; if(!d) return;
  if(d.decreeKey===abilityId) d.decreeStacks=clamp((d.decreeStacks||0)+1,0,6);
  else { d.decreeKey=abilityId; d.decreeStacks=0; }
}
function dukeApplyDecreePunish(){
  const d=G.enemy.duke; const st=d.decreeStacks||0; if(st<=0) return;
  addStatus(G.playerStatus,'weaken',1+Math.floor(st/2),6);
  addStatus(G.playerStatus,'vulnerable',1,6);
  spawnFloat('player',`📜 Decree(${st})`,'fn-status');
  logMsg(`📜 Court Decree punishes repetition (${st}).`,'boss');
}
function dukeOwlsVerdict(){
  const p=G.player.stats; const missing=1-(p.hp/p.maxHp); const mult=1.15+missing*0.95;
  const r=dealDamage('player',edmg(1.35*mult));
  spawnFloat('player',`🦉-${r.dmgDealt}`,'fn-dmg');
  logMsg('🦉 Owl’s Verdict!','boss');
}
function dukeSummonCourt(){
  addStatus(G.enemyStatus,'defending',18,999);
  addStatus(G.enemyStatus,'wardens',2,4);
  spawnFloat('enemy','🛡️ Court Guards!','fn-status');
  logMsg('🛡️ The Court gathers—wardens at his wings.','boss');
}
function dukeTurnAI(){
  const e=G.enemy; const d=e.duke;
  const enraged=isBossEnrageAllowed() && e.stats.hp<=Math.floor(e.stats.maxHp*0.35);
  if(enraged) setStatusMax(G.enemyStatus,'enraged',2);
  d.riverCd=Math.max(0,(d.riverCd||0)-1);
  d.summonCd=Math.max(0,(d.summonCd||0)-1);
  d.verdictCd=Math.max(0,(d.verdictCd||0)-1);
  if(d.phase>=3) dukeApplyDecreePunish();
  if(d.phase===1 && e.stats.hp<=Math.floor(e.stats.maxHp*0.75)){ dukeNightfall(); return; }
  if(d.phase===2){ d.nightfallTurns--; if(d.nightfallTurns<=0){ d.phase=3; logMsg('📜 The Court speaks in decree.','boss'); } }
  if(d.summonCd===0){ d.summonCd=4; dukeSummonCourt(); return; }
  if(d.riverCd===0){ d.riverCd=3; dukeRiverGrip(); return; }
  const p=G.player.stats;
  if(d.verdictCd===0 && (p.hp<=Math.floor(p.maxHp*0.35) || (G.enemyStatus.enraged||0)>0)){ d.verdictCd=3; dukeOwlsVerdict(); return; }
  const r=dealDamage('player',edmg(1.0));
  spawnFloat('player',`-${r.dmgDealt}`,'fn-dmg');
  logMsg('🦉 Talons in the dark.','boss');
}

async function enemyTurn() {
  const e=G.enemy; G.animLock=true; G.turn='enemy'; G.turnPhase=TURN.ENEMY; G.phase='ENEMY';
  lockActionUI(true);
  G.enemyTurnCount=(G.enemyTurnCount||0)+1;
  startEnemyTurn(e);
  if(G.enemy?.aiType==='boss_duke'){
    dukeTurnAI();
    G.animLock=false;
    if(G.player.stats.hp<=0||G.enemy.stats.hp<=0){if(checkDeath())return;}
    afterEnemyTurn();
    return;
  }
  // Tick mud slow
  if(G.enemyStatus.mud){
    G.enemyStatus.mud.turns--;
    if(G.enemyStatus.mud.turns<=0){G.enemy.stats.spd+=G.enemyStatus.mud.origReduced;delete G.enemyStatus.mud;logMsg(`${G.enemy.name} shook off the mud!`,'system');}
  }
  if(G.enemyStatus.slow){
    G.enemyStatus.slow.turns--;
    if(G.enemyStatus.slow.turns<=0){
      G.enemy.stats.spd=Math.max(1,(G.enemy.stats.spd||1)+(G.enemyStatus.slow.spdPenalty||0));
      G.enemy.stats.dodge=Math.min(95,(G.enemy.stats.dodge||0)+(G.enemyStatus.slow.dodgePenalty||0));
      delete G.enemyStatus.slow;
      logMsg(`${G.enemy.name} shook off Slow.`,'system');
    }
  }
  await tickDoTs('player');
  if(G.player.stats.hp<=0){const ended=checkDeath();G.animLock=false;if(ended)return;afterEnemyTurn();return;}

  if(G.enemyStatus.sonicSkip&&G.enemyStatus.sonicSkip.turns>0&&chance(G.enemyStatus.sonicSkip.chance)){
    spawnFloat('enemy','🔊 Stunned by Dirge!','fn-status');await delay(400);
    logMsg(`${e.name} stunned by Sonic Dirge!`,'enemy-action');
    G.animLock=false;afterEnemyTurn();return;
  }
  if(G.enemyStatus.waddleLullaby&&G.enemyStatus.waddleLullaby.turns>0&&chance(G.enemyStatus.waddleLullaby.chance)){
    spawnFloat('enemy','💤 Lulled!','fn-status');await delay(400);
    logMsg(`${e.name} is lulled to sleep by the Emperor Penguin's waddle!`,'enemy-action');
    G.animLock=false;afterEnemyTurn();return;
  }
  if(G.enemyStatus.stunned>0){spawnFloat('enemy','😵 Stunned!','fn-status');await delay(400);logMsg(`${e.name} is stunned!`,'enemy-action');G.animLock=false;afterEnemyTurn();return;}
  if(G.enemyStatus.feared>0){spawnFloat('enemy','😨 Feared!','fn-status');await delay(200);logMsg(`${e.name} is frightened — attacks at −20% hit!`,'enemy-action');}
  const confObj=G.enemyStatus.confused;
  if(confObj&&confObj.turns>0&&chance(clampSkipChance(confObj.skipChance||20))){playAvatarAnim('enemy','do-miss-l',580);spawnFloat('enemy','Confused!','fn-miss');await delay(580);logMsg(`${e.name} confused — fumbles!`,'enemy-action');G.animLock=false;afterEnemyTurn();return;}
  if(G.enemyStatus.paralyzed>0&&chance(AILMENTS.paralyzed.skipChance||20)){spawnFloat('enemy','⚡ Para!','fn-status');await delay(400);logMsg(`${e.name} paralyzed — cannot act!`,'enemy-action');G.animLock=false;afterEnemyTurn();return;}

  const rawPlan=(G.enemyNextAction&&G.enemyNextAction.actions&&G.enemyNextAction.actions.length)?G.enemyNextAction.actions:planEnemyTurn(e,G.player).actions;
  const plan=rawPlan.slice(0,MAX_ENEMY_ACTIONS_PER_TURN);
  G.enemyLastPlan=plan;
  const blindPenalty=(G.enemyStatus.enemyBlind>0)?15:0;
  const fearMissPenalty=(G.enemyStatus.feared>0)?20:0;
  const totalEnemyMiss=blindPenalty+fearMissPenalty;

  G.enemyActionsThisTurn=0;
  let usedHardCCThisTurn=false;
  for(const action of plan){
    if(G.enemyActionsThisTurn>=MAX_ENEMY_ACTIONS_PER_TURN) break;
    const cost=getEnemyActionEnergyCost(action);
    if((e.energy||0)<cost) break;
    e.energy-=cost;
    G.enemyActionsThisTurn++;
    renderEnemyPlan();
    G.enemyLastAction=action||null;
    G._incomingBypassesDeflect=false;

    if(action.type==='strike'||action.type==='heavy'||action.type==='ability'){
      if(action.type==='ability') G._incomingBypassesDeflect=true;
      const _stBd=BIRDS[G.player.birdKey];
      if(_stBd&&_stBd.passive&&_stBd.passive.onEnemyAttackCheck&&_stBd.passive.onEnemyAttackCheck(G.player,G)){
        spawnFloat('enemy','👁 Frozen by Dread!','fn-status');
        logMsg(`${e.name} freezes under ${G.player.name}'s prehistoric stare!`,'system');
        continue;
      }
    }

    if(action.type==='strike'){
      G._incomingAttackKind='physical';
      if(totalEnemyMiss>0&&chance(totalEnemyMiss)){await doMiss('enemy');logMsg(`${e.name} attack missed!`,'miss');}
      else{
        const r=dealDamage('player',edmg());
        await doAttack('enemy','player',r);
        setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);
        if(r.wasDodged)logMsg(`${e.name} attacks — dodged!`,'enemy-action');
        else logMsg(`${e.name} attacks for ${r.dmgDealt}!`,'enemy-action');
      }
    } else if(action.type==='heavy'){
      G._incomingAttackKind='physical';
      const missTot=20+totalEnemyMiss;
      if(chance(missTot)){await doMiss('enemy');logMsg(`${e.name} heavy missed!`,'miss');}
      else{
        const r=dealDamage('player',edmg(1.6));
        await doAttack('enemy','player',r);
        setHpBar('player',G.player.stats.hp,G.player.stats.maxHp);
        if(r.wasDodged)logMsg(`Heavy — dodged!`,'enemy-action');
        else logMsg(`💢 ${e.name} heavy hits for ${r.dmgDealt}!`,'enemy-action');
      }
    } else if(action.type==='defend'){
      if(G.enemyStatus.feared>0){logMsg(`${e.name} too afraid to defend!`,'enemy-action');}
      else{G.enemyStatus.defending=1; await doShield('enemy'); renderStatuses('enemy-status',G.enemyStatus); logMsg(`🛡 ${e.name} defends!`,'enemy-action');}
    } else if(action.type==='ability'){
      G._incomingAttackKind='magic';
      const eab=ENEMY_ABILITY_POOL[action.abilityId];
      if(action.abilityId==='eStun') usedHardCCThisTurn=true;
      if(eab){
        if(eab.dodgeable){
          const effMDodge = getEffectiveMdodge(G.player);
          const mAccEff = Math.max(0, Math.min(95, (G.enemy.stats.acc||70) - (G.enemyStatus.accDebuff||0)));
          const mHitPct = Math.max(5, Math.min(95, Math.floor((mAccEff - effMDodge + 100) / 2)));
          if(!chance(mHitPct)){
            spawnFloat('player','✦ MDodge!','fn-dodge'); playAvatarAnim('player','do-dodge-r',400); SFX.dodge(); await delay(420);
            logMsg(`✨ ${G.player.name} deflects the magic! (MDodge ${effMDodge}%)`, 'system');
            continue;
          }
        }
        await doSpell('enemy',`✦ ${eab.name}!`);
        eab.fn(G.enemy,G.player,G);
        const _macBd=BIRDS[G.player.birdKey];
        if(_macBd&&_macBd.passive&&_macBd.passive.onEnemyAbility) _macBd.passive.onEnemyAbility(G.player,action.abilityId);
        renderStatuses('player-status',G.playerStatus); renderStatuses('enemy-status',G.enemyStatus);
      }
    }

    if(G.player.stats.hp<=0||G.enemy.stats.hp<=0){break;}
  }

  G.enemyUsedHardCCLastTurn=usedHardCCThisTurn;
  G.animLock=false;
  if(G.player.stats.hp<=0||G.enemy.stats.hp<=0){if(checkDeath())return;}
  afterEnemyTurn();
}

function afterEnemyTurn() {
  G._incomingAttackKind=null;
  tickStatuses('enemy');
  if(G.playerStatus.confused&&typeof G.playerStatus.confused==='object'){G.playerStatus.confused.turns--;if(G.playerStatus.confused.turns<=0)delete G.playerStatus.confused;}
  if(G.enemyStatus.confused&&typeof G.enemyStatus.confused==='object'){G.enemyStatus.confused.turns--;if(G.enemyStatus.confused.turns<=0)delete G.enemyStatus.confused;}
  if(G.enemyStatus.enemyBlind>0){G.enemyStatus.enemyBlind--;if(G.enemyStatus.enemyBlind<=0)delete G.enemyStatus.enemyBlind;}
  if(G.enemyStatus.feared>0){G.enemyStatus.feared--;}
  if(G.enemyStatus.featherRuffle&&G.enemyStatus.featherRuffle.turns>0){
    G.enemyStatus.featherRuffle.turns--;
    if(G.enemyStatus.featherRuffle.turns<=0){
      if(G.enemyStatus.featherRuffle.accDrop>0)G.enemyStatus.accDebuff=Math.max(0,(G.enemyStatus.accDebuff||0)-G.enemyStatus.featherRuffle.accDrop);
      delete G.enemyStatus.featherRuffle;
    }
  }
  if(G.enemyStatus.wingClip&&G.enemyStatus.wingClip.turns>0){
    G.enemyStatus.wingClip.turns--;
    if(G.enemyStatus.wingClip.turns<=0){G.enemy.stats.spd+=G.enemyStatus.wingClip.spdRedux;delete G.enemyStatus.wingClip;}
  }
  if(G.enemyStatus.sonicSkip&&G.enemyStatus.sonicSkip.turns>0){
    G.enemyStatus.sonicSkip.turns--;
    if(G.enemyStatus.sonicSkip.turns<=0)delete G.enemyStatus.sonicSkip;
  }
  // Emperor Penguin Waddle Lullaby tick
  if(G.enemyStatus.waddleLullaby){
    G.enemyStatus.waddleLullaby.turns--;
    if(G.enemyStatus.waddleLullaby.turns<=0)delete G.enemyStatus.waddleLullaby;
  }
  // Cooldowns
  if(G.swoopCooldown>0)G.swoopCooldown--;
  if(G.intimidateCooldown>0)G.intimidateCooldown--;
  if(G.crowDefendCooldown>0)G.crowDefendCooldown--;
  if(G.abilityCooldowns){Object.keys(G.abilityCooldowns).forEach(k=>{G.abilityCooldowns[k]=Math.max(0,(G.abilityCooldowns[k]||0)-1); if(G.abilityCooldowns[k]===0) delete G.abilityCooldowns[k];});}
  G.turn='player';
  G.turnPhase=TURN.PLAYER;
  G.phase='PLAYER';
  G.animLock=false;
  lockActionUI(false);
  startPlayerTurn(G.player);
  G.enemyNextAction=planEnemyAction();
  refreshBattleUI();
}


function showBattleCaption(text='Bird Slain', duration=520){
  const el=document.getElementById('battle-caption');
  if(!el) return;
  el.textContent=text;
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),duration);
}

// ============================================================
//  DEATH & POST-COMBAT
// ============================================================
function checkDeath() {
  if(G.battleOver&&(G.enemy.stats.hp<=0||G.player.stats.hp<=0))return true;
  if(G.enemy.stats.hp<=0){
    G._lastDeathCause = 'enemy_defeated';
    G.battleOver=true;
    if(G.enemy.isBoss){
      G.bossKills++;
      logMsg(`💀 Boss kill #${G.bossKills}! Future enemies grow stronger.`,'boss');
      const _harpyBd=BIRDS[G.player.birdKey];
      if(_harpyBd&&_harpyBd.passive&&_harpyBd.passive.onBossKill) _harpyBd.passive.onBossKill(G.player);
      // Kookaburra Ambush Master: reset on boss kill
      const _kookBd=BIRDS[G.player.birdKey];
      if(_kookBd&&_kookBd.passive&&_kookBd.passive.id==='ambushMaster') _kookBd.passive.onBossKill(G.player);
    }
    logMsg(`✨ ${G.enemy.name} defeated!`,'crit');
    showBattleCaption('Bird Slain');
    setTimeout(postCombat,700);return true;
  }
  if(G.player.stats.hp<=0){
    G._lastDeathCause = 'player_hp_zero';
    // Bald Eagle Last Stand — survive at 1 HP once per battle
    if(!G.player._lastStandUsed){
      const _lsBd=BIRDS[G.player.birdKey];
      if(_lsBd&&_lsBd.passive&&_lsBd.passive.id==='lastStand'){
        G.player._lastStandUsed=true;
        G.player.stats.hp=1;
        G.playerStatus.lastStandBuff={atkBonus:5,turns:3};
        G.player.stats.atk+=5;
        spawnFloat('player','🦅 LAST STAND!','fn-crit');
        SFX.crit(1.5);
        logMsg(`🦅 LAST STAND! ${G.player.name} survives at 1 HP! +5 ATK for 3 turns!`,'boss');
        renderStatuses('player-status',G.playerStatus);
        setHpBar('player',1,G.player.stats.maxHp);
        return false; // survived — battle continues
      }
    }
    // Swan Song — final strike at 200% ATK
    if(!G.player._swanSongFired){
      const _ssBd=BIRDS[G.player.birdKey];
      if(_ssBd&&_ssBd.passive&&_ssBd.passive.id==='swanSong'){
        G.player._swanSongFired=true;
        G.player.stats.hp=1;
        const songDmg=Math.floor(G.player.stats.atk*2.0);
        G.enemy.stats.hp-=songDmg;
        spawnFloat('player','🦢 SWAN SONG!','fn-crit');
        spawnFloat('enemy',`-${songDmg} 🦢`,'fn-dmg');
        SFX.crit(1.5);
        setHpBar('enemy',G.enemy.stats.hp,G.enemy.stats.maxHp);
        logMsg(`🦢 SWAN SONG! Final strike deals ${songDmg} damage!`,'boss');
        if(G.enemy.stats.hp<=0){
          G.player.stats.hp=1;
          logMsg(`🦢 Swan Song killed the enemy — ${G.player.name} survives at 1 HP!`,'boss');
          setTimeout(()=>{G.battleOver=true;setTimeout(postCombat,700);},600);
          return true;
        } else {
          G.player.stats.hp=0;
          logMsg(`🦢 Swan Song was not enough... ${G.player.name} falls.`,'enemy-action');
          G.battleOver=true;
          setTimeout(showDefeat,900);
          return true;
        }
      }
    }
    G.battleOver=true;
    logMsg(`💀 ${G.player.name} has fallen...`,'enemy-action');
    setTimeout(showDefeat,700);
    return true;
  }
  return false;
}


function isGreyShopStage(stage){
  const isBoss = (stage % 10 === 0);
  return (stage % 4 === 0) && !isBoss;
}


function getBattleStatsSafe(){
  // BS is used for reward bonuses; if it's missing, default safely
  const b = (typeof BS !== 'undefined' && BS) ? BS : null;
  return {
    turns: (b && Number.isFinite(b.turns)) ? b.turns : 999,
    dmgTaken: (b && Number.isFinite(b.dmgTaken)) ? b.dmgTaken : 999,
  };
}

function postCombat() {
  try {
    // Hard reset any combat locks so UI can't get stuck
    G.animLock = false;
    G.turn = 'post';
    if (typeof lockActionUI === 'function') lockActionUI(true);

    const bs = getBattleStatsSafe();

    // EXP
    let expGain;
    G.phase='REWARD';
    if (G.enemy.isBoss) {
      expGain = Math.floor(expForLevel(G.player.birdLevel + 1) * 0.65);
    } else {
      const stageScale = (G.stage <= 15)
        ? Math.pow(1.18, G.stage - 1)
        : Math.pow(1.18, 14) * Math.pow(1.06, G.stage - 15);
      expGain = Math.floor(40 * stageScale);
    }

    G.player.exp += expGain;
    spawnFloat('player', `+${expGain} EXP`, 'fn-exp');
    logMsg(`+${expGain} EXP!`, 'exp-gain');
    SFX.exp();

    // Post-battle heal
    const postHeal = Math.max(1, Math.floor(G.player.stats.maxHp * 0.10));
    G.player.stats.hp = Math.min(G.player.stats.hp + postHeal, G.player.stats.maxHp);
    spawnFloat('player', `+${postHeal} 🩹`, 'fn-heal');

    // Bonus heal (if present)
    const bonusPct = (G.player.postBattleHealBonusPct || 0);
    if (bonusPct > 0) {
      const extra = Math.max(1, Math.floor(G.player.stats.maxHp * bonusPct));
      G.player.stats.hp = Math.min(G.player.stats.hp + extra, G.player.stats.maxHp);
      spawnFloat('player', `+${extra} 🩹`, 'fn-heal');
    }

    // Shiny reward
    const enemySize = (G.enemy.size || 'medium').toLowerCase();
    const sizeShiny =
      enemySize === 'tiny' ? 1 :
      enemySize === 'small' ? 2 :
      enemySize === 'medium' ? 3 :
      enemySize === 'large' ? 4 :
      enemySize === 'xl' ? 5 : 3;

    const bossShiny = G.enemy.isBoss ? 10 : 0;
    const stageBonusShiny = Math.floor(Math.max(1, G.stage) / 10);

    // SAFE: bs defaults prevent crashes
    const perfectBonus = (bs.dmgTaken <= 0) ? 2 : 0;
    const fastWinBonus = (bs.turns <= 3) ? 1 : 0;

    const shinyGain = sizeShiny + bossShiny + stageBonusShiny + perfectBonus + fastWinBonus;
    G.shinyObjects += shinyGain;

    const bonusParts = [];
    if (stageBonusShiny > 0) bonusParts.push(`stage +${stageBonusShiny}`);
    if (perfectBonus > 0) bonusParts.push('perfect +2');
    if (fastWinBonus > 0) bonusParts.push('fast +1');
    const bonusTxt = bonusParts.length ? ` (${bonusParts.join(', ')})` : '';
    logMsg(`✨ +${shinyGain} Shiny Object${shinyGain > 1 ? 's' : ''}${bonusTxt}! (Total: ${G.shinyObjects})`, 'exp-gain');

    // Level up check
    let leveled = false;
    while (G.player.exp >= expForLevel(G.player.birdLevel + 1)) {
      G.player.exp -= expForLevel(G.player.birdLevel + 1);
      G.player.birdLevel++;
      checkGrowthStage(G.player);
      applyClassGrowthOnLevelUp();

      // Level-up heal depends on bird size
      const sizeHeal = { tiny: 0.60, small: 0.50, medium: 0.35, large: 0.25, xl: 0.15 };
      const healPct = sizeHeal[G.player.size] || 0.35;
      const lvHeal = Math.max(1, Math.floor(G.player.stats.maxHp * healPct));
      G.player.stats.hp = Math.min(G.player.stats.hp + lvHeal, G.player.stats.maxHp);

      leveled = true;
      logMsg(`🌟 LEVEL UP! Now Lv.${G.player.birdLevel}! Healed ${lvHeal} HP.`, 'exp-gain');
      SFX.levelUp();
    }

    handleBossClearUnlocks();
    checkRunUnlocks();
    saveRun();

    // Transition (always happens)
    G.phase='REWARD';
    if (G.enemy.isBoss) {
      setTimeout(() => {
        if (leveled) {
          G._pendingStorkShop = true;
          G._pendingShopMode = 'boss';
          G.phase='LEVELUP';
    showLevelUpScreen();
        } else {
          showStorkShop('boss');
        }
      }, 250);
    } else {
      setTimeout(() => {
        showRewardScreen(leveled);
      }, 250);
    }

  } catch (err) {
    console.error('postCombat crash prevented:', err);

    // Emergency fallback: never freeze
    G.animLock = false;
    if (typeof lockActionUI === 'function') lockActionUI(false);

    // Try to at least show reward screen
    try { showRewardScreen(false); }
    catch (e) { console.error('fallback reward screen failed:', e); }
  }
}

// ============================================================
//  REWARD SCREEN — select then confirm
// ============================================================
function rollTier(isBoss) {
  const weights=isBoss?BOSS_WEIGHTS:NORMAL_WEIGHTS;
  const tiers=['grey','green','blue','purple','gold'];
  const total=weights.reduce((a,b)=>a+b,0);
  let r=Math.random()*total;
  for(let i=0;i<tiers.length;i++){r-=weights[i];if(r<=0)return tiers[i];}
  return 'grey';
}

function showRewardScreen(hasLevelUp) {
  showScreen('screen-reward');
  G._pendingLevelUp=hasLevelUp;
  G._pendingReward=null;
  const isBoss=G.enemy.isBoss;
  document.getElementById('reward-title').textContent=isBoss?'👑 Boss Defeated!':'✦ Victory! ✦';
  document.getElementById('reward-sub').textContent=
    isBoss?`${G.enemy.bossTitle||'Boss'} falls! Choose your epic reward:`:'The enemy falls. Choose your reward:';
  const pool=isBoss?generateBossRewards():generateNormalRewards();
  const grid=document.getElementById('reward-grid'); grid.innerHTML='';
  renderBattleSummary();
  const confirmBtn=document.getElementById('reward-confirm-btn');
  confirmBtn.className='confirm-btn';
  pool.forEach(rw=>{
    const c=document.createElement('div');
    c.className=`reward-card tier-${rw.tier}`;
    c.innerHTML=`
      <div class="reward-tier-label">${REWARD_TIERS[rw.tier].label}</div>
      <span class="reward-icon">${rw.icon}</span>
      <div class="reward-name">${rw.name}</div>
      <div class="reward-desc">${rw.desc}</div>`;
    c.onclick=()=>{
      document.querySelectorAll('.reward-card').forEach(x=>x.classList.remove('selected'));
      c.classList.add('selected');
      G._pendingReward=rw;
      confirmBtn.className='confirm-btn visible';
    };
    grid.appendChild(c);
  });
}

function confirmReward() {
  if(!G._pendingReward) return;
  if(document.getElementById('gold-replace-ui')) return;
  if(G._pendingReward.tier==='gold'&&getGoldCardCount()>=3){
    showGoldReplaceUI(G._pendingReward);
    return;
  }

  G._pendingReward.apply(G.player);
  const rewardEvt={tier:G._pendingReward.tier, id:G._pendingReward.id||G._pendingReward.name};
  AvianEvents.emit('reward:confirmed', rewardEvt);
  runModuleHook('onRewardConfirmed', rewardEvt);
  codexMark('artifacts', G._pendingReward.id||G._pendingReward.name, 'seen');
  logMsg(`✦ Gained: ${G._pendingReward.name}!`,'system');

  if(!G.collectedRewards) G.collectedRewards=[];
  G.collectedRewards.push({
    icon:G._pendingReward.icon,
    tier:G._pendingReward.tier,
    name:G._pendingReward.name,
    desc:G._pendingReward.desc
  });

  G._pendingReward=null;
  G._goldReplaceMode=false;
  document.getElementById('reward-confirm-btn').className='confirm-btn';
  const gru=document.getElementById('gold-replace-ui');
  if(gru) gru.remove();

  saveRun();

  const failsafeAdvance=()=>{
    setTimeout(()=>{
      if(!G.turnPhase&&!document.querySelector('.screen.active')){
        advanceStage();
      }
    },50);
  };

  const lastEnemyWasBoss = !!(G.enemy && G.enemy.isBoss);
  G.phase='REWARD';
  const shopDue = lastEnemyWasBoss || isGreyShopStage(G.stage);
  const shopMode = lastEnemyWasBoss ? 'boss' : 'grey';

  if(G._pendingLevelUp){
    if(shopDue){
      G._pendingStorkShop = true;
      G._pendingShopMode = shopMode;
    }
    G.phase='LEVELUP';
    showLevelUpScreen();
    failsafeAdvance('confirmReward after showLevelUpScreen');
    return;
  }

  if(shopDue) showStorkShop(shopMode);
  else advanceStage();

  failsafeAdvance('confirmReward after shop/advance');
}

function showGoldReplaceUI(newReward){
  const existing=document.getElementById('gold-replace-ui');if(existing)existing.remove();
  const goldCards=(G.collectedRewards||[]).filter(r=>r.tier==='gold');
  const ui=document.createElement('div');
  ui.id='gold-replace-ui';
  ui.style.cssText='background:rgba(20,15,5,.97);border:1px solid var(--gold);border-radius:12px;padding:16px;margin-top:12px;text-align:center;';
  ui.innerHTML=`<div style="font-family:Cinzel,serif;color:var(--gold);margin-bottom:8px;font-size:.85rem;letter-spacing:.08em">⚠ LEGENDARY LIMIT — Replace a Gold Card</div>
    <div style="color:var(--text-dim);font-size:.78rem;margin-bottom:12px">You hold 3 Legendary cards. Choose one to replace with <strong style="color:var(--gold)">${newReward.name}</strong>:</div>
    <div id="gold-replace-list" style="display:flex;flex-direction:column;gap:6px;"></div>
    <button onclick="document.getElementById('gold-replace-ui').remove();G._goldReplaceMode=false;" style="margin-top:10px;background:rgba(40,35,25,.8);border:1px solid var(--border);color:var(--text-dim);padding:5px 14px;border-radius:6px;cursor:pointer;font-size:.8rem;">✕ Cancel</button>`;
  const list=ui.querySelector('#gold-replace-list');
  goldCards.forEach(gc=>{
    const btn=document.createElement('button');
    btn.style.cssText='background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.4);border-radius:8px;padding:8px 12px;cursor:pointer;color:var(--gold);width:100%;text-align:left;font-size:.82rem;display:flex;align-items:center;gap:8px;';
    btn.innerHTML=`<span style="font-size:1.1rem">${gc.icon}</span><span><strong>${gc.name}</strong><br><span style="color:var(--text-dim);font-size:.75rem">${gc.desc}</span></span>`;
    btn.onclick=()=>{
      const idx=(G.collectedRewards||[]).findIndex(r=>r.name===gc.name&&r.tier==='gold');
      if(idx>=0) G.collectedRewards.splice(idx,1);
      G._goldReplaceMode=true;
      document.getElementById('gold-replace-ui').remove();
      confirmReward();
    };
    list.appendChild(btn);
  });
  const rewardInner=document.querySelector('.reward-screen-inner');
  if(rewardInner) rewardInner.appendChild(ui);
}

function generateNormalRewards() {
  const out=[];
  const used=new Set();
  let guard=0;
  while(out.length<3 && guard<30){
    guard++;
    const rw=rollUpgradeCard();
    if(!rw || used.has(rw.id)) continue;
    used.add(rw.id);
    out.push(rw);
  }
  return out;
}

function generateBossRewards() {


  const out=[]; const used=new Set();
  const stage=G.stage;
  const endlessBattle=G.endlessBattle||0;
  
  function pickTier(tier){
    const pool=getUpgradePool().filter(r=>r.tier===tier&&!used.has(r.id)&&!(r.stackable===false && G.runUpgradesPurchased?.has(r.id)));
    if(!pool.length) return null;
    const rw=pool[Math.floor(Math.random()*pool.length)];
    used.add(rw.id); return rw;
  }
  function pick(forced,optional){
    const r=pickTier(forced)||pickTier('purple')||pickTier('blue');
    if(r) out.push(r);
    if(optional&&out.length<3&&chance(optional*100)){const r2=pickTier('gold');if(r2)out.push(r2);}
  }
  
  // Stage 40 endless boss: 3 gold
  if(endlessBattle>0&&endlessBattle%20===0){
    for(let i=0;i<3;i++){const r=pickTier('gold');if(r)out.push(r);}
  }
  // Stage 10/20 main bosses: 1 purple guaranteed + 25% gold
  else if(stage%10===0){
    pick('purple', 0.20);
  }
  // Default boss: purple + possible gold
  else {
    pick('purple', 0.12);
  }
  
  // Fill remaining 3 slots
  while(out.length<3){
    let tier;
    if(stage>=35||endlessBattle>30){tier=rollWeighted(['blue','purple','gold'],[47,48,5]);}
    else if(stage>=20||endlessBattle>10){tier=rollWeighted(['blue','purple','gold'],[47,48,5]);}
    else{tier=rollTier(true);}
    const r=pickTier(tier);
    if(r) out.push(r);
    else {const fallback=pickTier('blue')||pickTier('purple');if(fallback)out.push(fallback);else break;}
  }
  return out.slice(0,3);
}

function rollWeighted(tiers,weights){
  const total=weights.reduce((a,b)=>a+b,0);
  let r=Math.random()*total;
  for(let i=0;i<tiers.length;i++){r-=weights[i];if(r<=0)return tiers[i];}
  return tiers[tiers.length-1];
}

// Gold card limit: max 3, prompt replacement if at limit
function getGoldCardCount(){return(G.collectedRewards||[]).filter(r=>r.tier==='gold').length;}

// ============================================================
//  LEVEL-UP SCREEN — select then confirm
// ============================================================
let _luSelectedSkillId=null;

function isMainAttackAbility(ab){
  if(!ab) return false;
  if(ab.isMainAttack) return true;
  const t = ABILITY_TEMPLATES?.[ab.id];
  if(t?.isMainAttack) return true;
  if(ab.slot==='main') return true;
  if(ab.id===G?.player?.mainAttackId) return true;
  return false;
}

function getMainAttackAutoLevel(birdLevel){
  if(birdLevel>=10) return 4;
  if(birdLevel>=7) return 3;
  if(birdLevel>=4) return 2;
  return 1;
}

function applyMainAttackAutoLevel(){
  if(!G.player||!Array.isArray(G.player.abilities)) return;

  const main=
    G.player.abilities.find(a=>isMainAttackAbility(a))||
    G.player.abilities.find(a=>a.id==='mainAttack');

  if(!main) return;

  const newLv=getMainAttackAutoLevel(G.player.birdLevel||1);

  if((main.level||1)!==newLv){
    main.level=newLv;

    if(typeof deriveAilments==='function'){
      main.ailmentIds=deriveAilments(main.id,newLv);
    }

    if(typeof logMsg==='function'){
      logMsg(`⚔ ${main.name} auto-upgraded to Lv.${newLv}!`,'exp-gain');
    }
  }
}

function getBirdExclusiveLearnPool(birdKey){
  const bd=BIRDS[birdKey];
  if(!bd) return LEARNABLE_ABILITIES;
  const birdClass=bd.class||'';
  const uniqueFromStarts=(bd.startAbilities||[]).filter(id=>id!=='mainAttack'&&id!=='skipTurn'&&id!=='sittingDuck');
  let classSpecific=[];
  if(birdClass==='ranger') classSpecific=[...ABILITY_POOL_RANGED];
  else if(MAGIC_CLASSES.has(birdClass)) classSpecific=[...ABILITY_POOL_MAGIC];
  else classSpecific=[...ABILITY_POOL_PHYSICAL];
  return [...new Set([...uniqueFromStarts,...classSpecific,...ABILITY_POOL_UTILITY])];
}

function ensureMainAttackAndLoadoutRules(){
  if(!G.player) return;
  const bd=BIRDS[G.player.birdKey]||{};
  const birdClass=bd.class||'';
  const isMagic=MAGIC_CLASSES.has(birdClass);
  if(!Array.isArray(G.player.abilities)) G.player.abilities=[];
  G.player.abilities=G.player.abilities.filter(ab=>ab&&ab.id&&ab.id!=='skipTurn'&&ab.id!=='sittingDuck');
  if(!isMagic){
    // Migration cleanup: non-magic birds should not keep legacy generic Peck/mainAttack card.
    G.player.abilities=G.player.abilities.filter(ab=>ab.id!=='mainAttack');
  }
  G.player.abilities.forEach(ab=>delete ab.isMainAttack);

  let mainAb=null;
  if(isMagic){
    const isBlackbird = (G.player?.birdKey==='blackbird');
    if(isBlackbird){
      mainAb=G.player.abilities.find(a=>a.id==='blackPeck') || null;
      G.player.abilities=G.player.abilities.filter(a=>a.id!=='mainAttack');
      if(!mainAb){
        mainAb={...(ABILITY_TEMPLATES.blackPeck||{}), id:'blackPeck', level:1};
        G.player.abilities.unshift(mainAb);
      }
    }else{
      mainAb=G.player.abilities.find(a=>a.id==='mainAttack');
      if(!mainAb){
        mainAb={id:'mainAttack',name:'Peck',level:1,type:'physical',btnType:'physical'};
        G.player.abilities.unshift(mainAb);
      }
      mainAb.name='Peck';
    }
  } else {
    const preferred=bd.mainAttackId||(bd.startAbilities&&bd.startAbilities[0]);
    mainAb=G.player.abilities.find(a=>a.id===preferred)||G.player.abilities[0]||null;
  }
  if(mainAb) mainAb.isMainAttack=true;

  const cap=4;
  const nonMain=G.player.abilities.filter(a=>!isMainAttackAbility(a));
  if(nonMain.length>cap){
    const kept=nonMain.slice(0,cap);
    G.player.abilities=[...(mainAb?[mainAb]:[]),...kept];
  }

  bd.exclusiveLearnPool=getBirdExclusiveLearnPool(G.player.birdKey);
  removeMimicEverywhere();
  normalizeAbilityCooldownsForPlayer(G.player);
  enforceAbilityCosts(G.player);
}

function showLevelUpScreen() {
  showScreen('screen-levelup');
  _luSelectedSkillId=null;
  document.getElementById('lu-sub').textContent=`Lv.${G.player.birdLevel} reached! Choose a skill to improve:`;

  document.getElementById('lu-skills-panel').classList.add('active');

  document.getElementById('lu-skill-confirm').className='confirm-btn';
  document.getElementById('lu-skip-btn').className='confirm-btn visible';

  buildSkillGrid();
}

function showLUPanel(which) {
  document.getElementById('lu-skills-panel').classList.add('active');
  _luSelectedSkillId=null;
  document.getElementById('lu-skill-confirm').className='confirm-btn';
  document.getElementById('lu-skip-btn').className='confirm-btn visible';
}

function buildSkillGrid() {
  const grid=document.getElementById('lu-skill-grid'); grid.innerHTML='';
  G.player.abilities.filter(a=>a&&a.id&&a.id!=='skipTurn'&&a.id!=='sittingDuck').forEach(ab=>{
    const tmpl=ABILITY_TEMPLATES[ab.id];
    if(!tmpl||ab.level>=4)return;
    const nextLv=ab.level+1;
    const nextDesc=tmpl.levels[Math.min(nextLv-1,tmpl.levels.length-1)].desc;
    const c=document.createElement('div');
    c.className='skill-upgrade-card';
    c.innerHTML=`
      <div class="su-name">${ab.name}</div>
      <div class="su-lv">Lv.${ab.level} → Lv.${nextLv}</div>
      <div class="su-effect">${nextDesc}</div>`;
    c.onclick=()=>{
      document.querySelectorAll('#lu-skill-grid .skill-upgrade-card').forEach(x=>x.classList.remove('selected'));
      c.classList.add('selected');
      _luSelectedSkillId=ab.id;
      document.getElementById('lu-skill-confirm').className='confirm-btn visible';
    };
    grid.appendChild(c);
  });
  if(!grid.children.length){
    grid.innerHTML='<div style="color:var(--text-dim);text-align:center;padding:20px;">All abilities at max level!<br><span style="font-size:.8rem;opacity:.7;">Press Continue.</span></div>';
  }
}

function countLevelAilments(lv){
  return [lv?.newAilment, lv?.newAilment2, lv?.newAilment3].filter(Boolean).length;
}
function ailmentSlotsForLevel(tmpl, level){
  const base=Math.max(0,countLevelAilments((tmpl?.levels||[])[0]||{}));
  return base + (level>=4 ? 1 : 0);
}
function deriveAbilityAilments(ab, tmpl){
  if(!tmpl) return [];
  const contactAilments=['poison','paralyzed','burning','weaken'];
  const isContactOnly=tmpl.type==='spell'||tmpl.type==='utility';
  const ailIds=[];
  for(let i=0;i<(ab.level||1);i++){
    const d=tmpl.levels[i]||{};
    [d.newAilment,d.newAilment2,d.newAilment3].forEach(a=>{
      if(!a) return;
      if(isContactOnly&&contactAilments.includes(a)) return;
      if(!ailIds.includes(a)) ailIds.push(a);
    });
  }
  const cap=ailmentSlotsForLevel(tmpl, ab.level||1);
  let out=ailIds.slice(0,cap);
  if((ab.level||1)>=4 && ab.modAilmentChoice && !out.includes(ab.modAilmentChoice) && out.length<cap){
    out.push(ab.modAilmentChoice);
  }
  return out.slice(0,cap);
}
function openAbilityModificationChoice(ab, tmpl){
  const pool=['poison','burning','weaken','paralyzed','feared','confused','slow','bleed'];
  const existing=new Set(deriveAbilityAilments({...ab,modAilmentChoice:null}, tmpl));
  const options=pool.filter(a=>!existing.has(a));
  options.sort(()=>Math.random()-0.5);
  const picks=options.slice(0,3);
  if(!picks.length) return Promise.resolve(null);
  const modal=document.getElementById('ability-mod-modal');
  const sub=document.getElementById('ability-mod-sub');
  const list=document.getElementById('ability-mod-options');
  if(!modal||!list) return Promise.resolve(picks[0]);
  if(sub) sub.textContent=`${ab.name} reached Lv.4 — choose 1 ailment to add.`;
  return new Promise(resolve=>{
    list.innerHTML='';
    picks.forEach(id=>{
      const btn=document.createElement('button');
      btn.className='abandon-confirm-btn';
      btn.style.width='100%';
      btn.textContent=id.charAt(0).toUpperCase()+id.slice(1);
      btn.onclick=()=>{ modal.classList.remove('open'); resolve(id); };
      list.appendChild(btn);
    });
    globalThis._abilityModCancelResolver=()=>resolve(null);
    modal.classList.add('open');
  });
}
function closeAbilityModModal(){
  const modal=document.getElementById('ability-mod-modal');
  if(modal) modal.classList.remove('open');
  if(typeof globalThis._abilityModCancelResolver==='function'){
    globalThis._abilityModCancelResolver();
    globalThis._abilityModCancelResolver=null;
  }
}
function refreshPlayerAbilityAilments(){
  (G.player?.abilities||[]).forEach(ab=>{
    const tmpl=ABILITY_TEMPLATES[ab.id];
    if(tmpl) ab.ailmentIds=deriveAbilityAilments(ab, tmpl);
  });
}

async function confirmSkillUpgrade() {
  if(!_luSelectedSkillId){logMsg('Select a skill to upgrade first!','miss');return;}
  const ab=G.player.abilities.find(a=>a.id===_luSelectedSkillId);
  if(!ab){return;}
  const prevLevel=ab.level||1;
  ab.level=Math.min(ab.level+1,4);
  const tmpl=ABILITY_TEMPLATES[_luSelectedSkillId];
  if(tmpl){
    if(prevLevel<4 && ab.level===4 && (tmpl.type==='physical'||tmpl.type==='ranged') && ailmentSlotsForLevel(tmpl,4)>ailmentSlotsForLevel(tmpl,3)){
      const choice=await openAbilityModificationChoice(ab, tmpl);
      if(choice) ab.modAilmentChoice=choice;
    }
    ab.ailmentIds=deriveAbilityAilments(ab, tmpl);
  }
  logMsg(`🌟 ${ab.name} upgraded to Lv.${ab.level}!`,'exp-gain');
  refreshPlayerAbilityAilments();
  normalizeAbilityCooldownsForPlayer(G.player);
  enforceAbilityCosts(G.player);
  _luSelectedSkillId=null;
  afterLevelUp();
}

function afterLevelUp() {
  // After level-up: go to Stork shop if it was a boss, otherwise advance
  if(G._pendingStorkShop){ const m=G._pendingShopMode||'boss'; G._pendingStorkShop=false; G._pendingShopMode=null; showStorkShop(m); }
  else advanceStage();
}

function advanceStage() {
  G.stage++;
  if(G.stage>ENEMIES.length&&!G.endlessMode){deleteSave();showVictory();return;}
  // Stage 40 = endless battle 20 — grant unlock
  if(G.endlessMode&&G.endlessBattle>=20&&!isUnlocked('stage40')){
    grantUnlock('stage40');
    logMsg('🔓 Legendary birds unlocked: Shoebill Stork & Harpy Eagle!','boss');
  }
  saveRun();

  // ── Whispering Grove: ~10% after non-boss victories, player must be >20% HP
  const lastEnemyWasBoss = G.enemy && G.enemy.isBoss;
  const safeHP = G.player.stats.hp > G.player.stats.maxHp * 0.2;
  const signatureDue = !lastEnemyWasBoss && safeHP && (G.stage % 5 === 0);
  if(signatureDue){
    const sigEvt={stage:G.stage, type:'grove-guaranteed'};
    AvianEvents.emit('signature:event', sigEvt);
    runModuleHook('onSignatureEvent', sigEvt);
    logMsg('🌳 Signature Event — Whispering Grove appears.', 'system');
    setTimeout(()=>showGroveEvent(), 350);
    return;
  }
  if(!lastEnemyWasBoss && safeHP && Math.random() < 0.1){
    setTimeout(()=>showGroveEvent(), 350);
    return; // halt progression until grove resolves
  }

  G.phase='PLAYER';
  loadStage();
}

// ============================================================
//  WHISPERING GROVE EVENT
// ============================================================
function isBossStage(stage){
  // Bosses every 10 stages
  return stage % 10 === 0;
}

function showGroveEvent(){
  G._groveOutcomes = null;
  G._groveResolved = false;
  // Reset UI
  const trees = document.getElementById('grove-trees');
  trees.style.display = 'none';
  document.getElementById('grove-result-msg').textContent = '';
  document.getElementById('grove-reward-section').style.display = 'none';
  document.getElementById('grove-continue-btn').style.display = 'none';
  document.getElementById('grove-opt-row').style.display = 'flex';
  document.getElementById('grove-intro-text').style.display = '';

  // Flavor based on size
  const isSmall = ['tiny','small'].includes(G.player.size||'medium');
  const sizeHint = isSmall
    ? `<em>Your small form lets you slip into tight spaces — but beware larger threats.</em>`
    : `<em>Your size grants power, but agility may be needed here.</em>`;
  document.getElementById('grove-intro-text').innerHTML =
    `Ancient trees hide secrets. The wind carries the scent of reward — and danger.<br><br>${sizeHint}<br><br><strong>Risk the grove?</strong>`;

  document.getElementById('grove-optout-btn').onclick = ()=>{
    logMsg('🌳 You leave the grove undisturbed. Onward.','system');
    G.phase='PLAYER';
  loadStage();
  };
  document.getElementById('grove-enter-btn').onclick = ()=> enterGrove();

  // Reset tree cards
  document.querySelectorAll('.grove-tree').forEach(t=>{
    t.className='grove-tree';
    t.innerHTML='🌳<span class="grove-rustle">Rustle…</span>';
    t.style.opacity='1'; t.style.transform='';
    t.onclick=null;
  });

  showScreen('screen-grove');
}

function enterGrove(){
  // Build outcomes: always 1 nest + 2 unique risky picked at random
  const riskyPool = ['cat','snake','egg'];
  const pair = pickRandom(riskyPool, 2);
  const raw = ['nest', ...pair];
  // Shuffle
  G._groveOutcomes = raw.sort(()=>Math.random()-.5);

  document.getElementById('grove-opt-row').style.display = 'none';
  document.getElementById('grove-intro-text').style.display = 'none';
  const trees = document.getElementById('grove-trees');
  trees.style.display = 'grid';

  document.querySelectorAll('.grove-tree').forEach((t,i)=>{
    t.onclick = ()=> resolveGrove(i);
  });
}

async function resolveGrove(idx){
  if(G._groveResolved) return;
  G._groveResolved = true;

  const type = G._groveOutcomes[idx];
  const isSmall = ['tiny','small'].includes(G.player.size||'medium');
  const trees = document.querySelectorAll('.grove-tree');
  // Lock all trees immediately
  trees.forEach(t=>{ t.onclick=null; });

  const chosen = trees[idx];
  chosen.classList.add('revealed');

  // Brief dramatic pause before reveal
  await new Promise(r=>setTimeout(r,350));

  const hp = G.player.stats.hp;
  const maxHp = G.player.stats.maxHp;
  const missing = maxHp - hp;
  const resultEl = document.getElementById('grove-result-msg');
  let msg='', flavor='', floatClass='fn-heal';

  switch(type){
    // ── NEST: safe, pick a reward ──────────────────────────────
    case 'nest':{
      chosen.className='grove-tree revealed outcome-nest';
      chosen.innerHTML=`<span>🪹</span><span class="grove-outcome-label">Safe Nest!</span>`;
      msg = '✨ A shiny nest! Choose your reward.';
      SFX.spell(); SFX.exp();
      resultEl.textContent = msg;
      resultEl.style.color = 'var(--gold)';
      // Dim unselected
      trees.forEach((t,i)=>{ if(i!==idx) t.classList.add('grove-other-trees'); });
      await new Promise(r=>setTimeout(r,700));
      showGroveNestRewards();
      return; // don't show continue yet — reward pick does it
    }
    // ── CAT: always bad ─────────────────────────────────────────
    case 'cat':{
      chosen.className='grove-tree revealed outcome-cat';
      chosen.innerHTML=`<span>🐱</span><span class="grove-outcome-label">Cat Ambush!</span>`;
      const dmg = Math.max(1, Math.floor(hp * 0.30));
      G.player.stats.hp = Math.max(1, hp - dmg);
      setHpBar('player', G.player.stats.hp, G.player.stats.maxHp);
      msg = `😾 A wild cat pounces! −${dmg} HP (−30% current)`;
      flavor = isSmall ? 'You were too small to dodge it!' : 'Even your size couldn\'t stop those claws!';
      floatClass='fn-dmg';
      doScreenShake(true); SFX.hit(1.5);
      spawnFloat('player',`-${dmg}`,'fn-dmg');
      break;
    }
    // ── SNAKE: size-dependent ────────────────────────────────────
    case 'snake':{
      chosen.className='grove-tree revealed outcome-snake';
      if(isSmall){
        // Bad for tiny/small: venom bite −25% current HP
        const dmg = Math.max(1, Math.floor(hp * 0.25));
        G.player.stats.hp = Math.max(1, hp - dmg);
        setHpBar('player', G.player.stats.hp, G.player.stats.maxHp);
        chosen.innerHTML=`<span>🐍</span><span class="grove-outcome-label">Venom Bite!</span>`;
        msg = `🐍 Snake venom seeps in. −${dmg} HP (−25% current)`;
        flavor = 'Too small to resist the fangs…';
        floatClass='fn-dmg';
        doScreenShake(); SFX.poison();
        spawnFloat('player',`-${dmg}`,'fn-dmg');
      } else {
        // Good for medium/XL: crush the snake, +50% missing HP
        const heal = Math.max(1, Math.floor(missing * 0.50));
        G.player.stats.hp = Math.min(maxHp, hp + heal);
        setHpBar('player', G.player.stats.hp, G.player.stats.maxHp);
        chosen.innerHTML=`<span>🐍💪</span><span class="grove-outcome-label">Snake Crushed!</span>`;
        msg = `💪 You crush the snake underfoot! +${heal} HP restored`;
        flavor = 'Your strength turned the tables.';
        floatClass='fn-heal';
        SFX.heal();
        spawnFloat('player',`+${heal}`,'fn-heal');
      }
      break;
    }
    // ── EGG: size-dependent ──────────────────────────────────────
    case 'egg':{
      chosen.className='grove-tree revealed outcome-egg';
      if(isSmall){
        // Good for tiny/small: raid the nest +50% current HP
        const heal = Math.max(1, Math.floor(hp * 0.50));
        G.player.stats.hp = Math.min(maxHp, hp + heal);
        setHpBar('player', G.player.stats.hp, G.player.stats.maxHp);
        chosen.innerHTML=`<span>🥚🎉</span><span class="grove-outcome-label">Egg Raided!</span>`;
        msg = `🥚 You slip inside and feast on eggs! +${heal} HP`;
        flavor = 'Small enough to sneak past the thorns.';
        floatClass='fn-heal';
        SFX.heal();
        spawnFloat('player',`+${heal}`,'fn-heal');
      } else {
        // Bad for medium/XL: thorn trap −40% missing HP
        const dmg = Math.max(1, Math.floor(missing * 0.40));
        G.player.stats.hp = Math.max(1, hp - dmg);
        setHpBar('player', G.player.stats.hp, G.player.stats.maxHp);
        chosen.innerHTML=`<span>🥚🌿</span><span class="grove-outcome-label">Thorns Shred!</span>`;
        msg = `🌿 Hidden thorns tear through your feathers! −${dmg} HP`;
        flavor = 'Too large to fit without getting shredded.';
        floatClass='fn-dmg';
        doScreenShake(); SFX.hit(1.0);
        spawnFloat('player',`-${dmg}`,'fn-dmg');
      }
      break;
    }
  }

  resultEl.innerHTML = `<strong>${msg}</strong><br><span style="color:var(--text-dim);font-size:.82rem;">${flavor}</span>`;
  resultEl.style.color = floatClass==='fn-heal' ? 'var(--green-light)' : 'var(--red-light)';
  logMsg(`🌳 Grove: ${msg}`, floatClass==='fn-heal'?'exp-gain':'enemy-action');

  // Dim unchosen trees with fade
  trees.forEach((t,i)=>{ if(i!==idx) t.classList.add('grove-other-trees'); });

  // Show continue after a beat
  await new Promise(r=>setTimeout(r,900));
  document.getElementById('grove-continue-btn').style.display='inline-block';
}

function showGroveNestRewards(){
  document.getElementById('grove-reward-section').style.display='block';
  const grid = document.getElementById('grove-reward-grid');
  grid.innerHTML='';

  // Grove nest rewards: mostly blue/purple, with 5% chance each for a grey and a gold slot.
  const used = new Set();
  const picks=[];
  const pick=(tier)=>{
    const avail=getUpgradePool().filter(r=>r.tier===tier&&!used.has(r.id));
    if(!avail.length) return null;
    const r=avail[Math.floor(Math.random()*avail.length)];
    used.add(r.id); return r;
  };
  const rollNestTier=()=>{
    if(chance(5)) return 'gold';
    if(chance(5)) return 'grey';
    return chance(56)?'blue':'purple';
  };
  while(picks.length<3){
    const tier=rollNestTier();
    const rw=pick(tier)||pick('blue')||pick('purple')||pick('grey')||pick('gold');
    if(!rw) break;
    picks.push(rw);
  }

  picks.forEach(rw=>{
    const c=document.createElement('div');
    c.className=`reward-card tier-${rw.tier}`;
    c.innerHTML=`
      <div class="reward-tier-label">${REWARD_TIERS[rw.tier].label}</div>
      <span class="reward-icon">${rw.icon}</span>
      <div class="reward-name">${rw.name}</div>
      <div class="reward-desc">${rw.desc}</div>`;
    c.onclick=()=>{
      document.querySelectorAll('#grove-reward-grid .reward-card').forEach(x=>x.classList.remove('selected'));
      c.classList.add('selected');
      G._groveNestReward=rw;
      document.getElementById('grove-continue-btn').style.display='inline-block';
      document.getElementById('grove-continue-btn').textContent='Claim Reward →';
    };
    grid.appendChild(c);
  });
}

function groveFinish(){
  // If a nest reward was selected, apply it
  if(G._groveNestReward){
    const rw=G._groveNestReward;
    rw.apply(G.player);
    if(!G.collectedRewards)G.collectedRewards=[];
    G.collectedRewards.push({icon:rw.icon,tier:rw.tier,name:rw.name,desc:rw.desc});
    codexMark('artifacts', rw.id||rw.name, 'seen');
    logMsg(`🪹 Grove Nest: ${rw.name} claimed!`,'exp-gain');
    G._groveNestReward=null;
  }
  saveRun();
  G.phase='PLAYER';
  loadStage();
}

// ============================================================
//  UTILS
// ============================================================
function pickRandom(arr,n){return[...arr].sort(()=>Math.random()-.5).slice(0,n);}

function showVictory(){
  // HARD RESET COMBAT STATE
  G.animLock = false;
  G.turnPhase = null;
  G.turn = null;
  lockActionUI(true);
  G.playerStatus = {};
  G.enemyStatus = {};
  G.actionQueue=[];
  G.actionBusy=false;
  G.turnCount = 0;

  // Grant difficulty-based unlocks
  const diff=G.difficulty||'juvenile';
  if(diff==='fletchling'&&!isUnlocked('fletchlingWin')){ grantUnlock('fletchlingWin'); logMsg('🔓 Fletchling conquered!','boss'); }
  if(diff==='juvenile'&&!isUnlocked('juvenileWin')){ grantUnlock('juvenileWin'); grantUnlock('stage20'); logMsg('🔓 Juvenile conquered! New birds are now available.','boss'); }
  if(diff==='predator'&&!isUnlocked('predatorWin')){ grantUnlock('predatorWin'); grantUnlock('juvenileWin'); grantUnlock('stage20'); logMsg('🔓 Predator conquered! MURDER mode unlocked!','boss'); }
  // Legacy unlock ID for saves
  if(!isUnlocked('stage20')) grantUnlock('stage20');
  SFX.victory();
  checkRunUnlocks();
  saveRunHistory(true);
  saveHighscoreEntry(true);
  G.phase='REWARD';
  document.getElementById('gameover-inner').className='gameover-inner win';
  document.getElementById('gameover-title').textContent='⚔ Ascended! ⚔';
  const endMsg=G.endlessMode
    ?`${G.player.name} conquered Stage 20 and flies into endless glory! The battle continues...`
    :`${G.player.name} conquered all 20 stages and ascended to legend! 🔓 New birds unlocked!`;
  const abilityList=(G.player.abilities||[]).map(a=>`${ABILITY_TEMPLATES[a.id]?.name||a.id} Lv${a.level||1}`).join(' · ');
  document.getElementById('gameover-msg').textContent=endMsg;
  const unlockIds=['unlock_hummingbird','unlock_shoebill','unlock_secretary','unlock_magpie','unlock_kookaburra','unlock_peregrine','unlock_harpy','unlock_ostrich','unlock_kiwi','unlock_lyrebird','unlock_toucan','unlock_penguin','unlock_emu','unlock_swan','unlock_flamingo','unlock_seagull','unlock_albatross','unlock_duke_blakiston'];
  const unlockedNow=unlockIds.filter(id=>isUnlocked(id)).map(id=>id.replace('unlock_','').replace(/_/g,' '));
  const runUnlocks=document.getElementById('run-unlocks');
  if(runUnlocks){
    runUnlocks.innerHTML=`<div style="margin:10px 0 6px;font-size:.82rem;color:var(--gold-light)">🏆 Achievement: Court Cleared</div>
    <div style="font-size:.76rem;color:var(--text-dim);line-height:1.5">${G.player.name} · HP ${G.player.stats.hp}/${G.player.stats.maxHp} · ATK ${G.player.stats.atk} · DEF ${G.player.stats.def} · SPD ${G.player.stats.spd}<br/>Abilities: ${abilityList||'—'}<br/>Unlocked roster: ${unlockedNow.join(', ')||'None yet'}</div>`;
  }
  showRunStats();
  if(G.endlessMode){
    G.endlessBattle=0;
    logMsg('🌟 Stage 20 complete! Endless mode continues — bosses await!','boss');
    advanceStage();
    return;
  }
  renderUnlockPopupsOnGameover();
  const endEvt={won:true, bird:G.player?.birdKey||'unknown', stageReached:G.stage||20, deathCause:'victory', endless:!!G.endlessMode};
  AvianEvents.emit('run:end', endEvt);
  runModuleHook('onRunEnd', endEvt);
  showScreen('screen-gameover');
}
function showDefeat(){
  G.phase='REWARD';
  G.playerStatus = {};
  G.enemyStatus = {};
  G.actionQueue=[];
  G.actionBusy=false;
  G.turnCount = 0;
  deleteSave();
  SFX.defeat();
  checkRunUnlocks();
  saveRunHistory(false);
  saveHighscoreEntry(false);
  document.getElementById('gameover-inner').className='gameover-inner lose';
  document.getElementById('gameover-title').textContent='💀 Fallen';
  const stageLabel=G.endlessMode&&G.stage>ENEMIES.length?`Endless Battle ${G.endlessBattle}`:`Stage ${G.stage}`;
  document.getElementById('gameover-msg').textContent=`${G.player.name} fell at ${stageLabel}. Lv.${G.player.birdLevel}. Rise again.`;
  const endEvt={won:false, bird:G.player?.birdKey||'unknown', stageReached:G.stage||1, deathCause:G._lastDeathCause||'hp_zero', endless:!!G.endlessMode};
  AvianEvents.emit('run:end', endEvt);
  runModuleHook('onRunEnd', endEvt);
  showRunStats();
  renderUnlockPopupsOnGameover();
  showScreen('screen-gameover');
}
function showRunStats(){
  const el=document.getElementById('run-stats'); if(!el) return;
  const stages=G.endlessMode?`${G.stage}+`:`${Math.min(G.stage,20)}/20`;
  const enemiesDefeated=Math.max(0,(G.stage||1)-1);
  const birdName=G.player?.name||'Unknown';
  el.innerHTML=`
    <div class="vstat"><div class="vstat-val">${birdName}</div><div class="vstat-lbl">Bird</div></div>
    <div class="vstat"><div class="vstat-val">${stages}</div><div class="vstat-lbl">Stage Reached</div></div>
    <div class="vstat"><div class="vstat-val">${enemiesDefeated}</div><div class="vstat-lbl">Enemies Defeated</div></div>
    <div class="vstat"><div class="vstat-val">${G.player.birdLevel}</div><div class="vstat-lbl">Level</div></div>
    <div class="vstat"><div class="vstat-val">${G.bossKills}</div><div class="vstat-lbl">Boss Kills</div></div>
    <div class="vstat"><div class="vstat-val">${BS.dmgDealt}</div><div class="vstat-lbl">Damage Dealt</div></div>
    <div class="vstat"><div class="vstat-val">${BS.highestHit}</div><div class="vstat-lbl">Highest Hit</div></div>
    <div class="vstat"><div class="vstat-val">${G.runCrits||0}</div><div class="vstat-lbl">Critical Hits</div></div>
    <div class="vstat"><div class="vstat-val">${G.collectedRewards.length}</div><div class="vstat-lbl">Rewards</div></div>
    <div class="vstat"><div class="vstat-val">${G.shinyObjects||0}</div><div class="vstat-lbl">Shiny Objects</div></div>
    <div class="vstat"><div class="vstat-val">${G.player.stats.atk}</div><div class="vstat-lbl">Final ATK</div></div>
    <div class="vstat"><div class="vstat-val">${G.player.stats.hp}/${G.player.stats.maxHp}</div><div class="vstat-lbl">HP Left</div></div>`;
  el.style.display='grid';
}

// ============================================================
//  WEB AUDIO ENGINE — procedural sounds, no assets needed
// ============================================================
let _audioCtx = null;
let _soundEnabled = true;
function getAudioCtx() {
  if (!_audioCtx) { try { _audioCtx = new (window.AudioContext||window.webkitAudioContext)(); } catch(e){} }
  return _audioCtx;
}
function toggleSound() {
  _soundEnabled = !_soundEnabled;
  document.getElementById('sound-toggle-btn').textContent = _soundEnabled ? '🔊' : '🔇';
}
function playTone(freq, type='square', dur=0.12, vol=0.18, delay=0, freqEnd=null) {
  if (!_soundEnabled) return;
  const ctx = getAudioCtx(); if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  if (freqEnd !== null) osc.frequency.linearRampToValueAtTime(freqEnd, ctx.currentTime + delay + dur);
  gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + dur + 0.05);
}
const SFX = {
  hit(urgency=1)  { playTone(180*urgency,'sawtooth',.09,.22,0,120*urgency); },
  crit(urgency=1) { playTone(320*urgency,'square',.06,.28); playTone(480*urgency,'square',.1,.2,.06,600*urgency); },
  miss()    { playTone(140,'sine',.12,.12,0,90); },
  dodge()   { playTone(600,'sine',.06,.12); playTone(800,'sine',.08,.1,.05); },
  heal()    { playTone(440,'sine',.08,.14); playTone(660,'sine',.12,.12,.08,880); },
  spell()   { playTone(260,'triangle',.15,.16,0,340); },
  exp()     { [0,.06,.12,.18].forEach((d,i)=>playTone(440+i*110,'sine',.1,.12,d)); },
  levelUp() { [0,.08,.16,.24,.32].forEach((d,i)=>playTone(330+i*110,'triangle',.14,.18,d)); },
  boss()    { playTone(80,'sawtooth',.3,.28); playTone(120,'square',.25,.18,.1); },
  victory() { [0,.1,.2,.3,.45].forEach((d,i)=>playTone([330,440,550,660,880][i],'triangle',.2,.2,d)); },
  defeat()  { [0,.15,.3].forEach((d,i)=>playTone([220,180,110][i],'sawtooth',.25,.2,d)); },
  poison()  { playTone(200,'square',.08,.1,0,150); },
  shield()  { playTone(500,'triangle',.08,.14); playTone(400,'triangle',.06,.1,.07); },
  ambush()  { playTone(800,'square',.04,.3); playTone(1200,'square',.08,.3,.04); playTone(600,'sawtooth',.12,.2,.1,300); },
};

// ============================================================
//  SCREEN SHAKE
// ============================================================
function doScreenShake(heavy=false) {
  const app=document.getElementById('app');
  const cls=heavy?'do-screen-shake-heavy':'do-screen-shake';
  app.classList.remove('do-screen-shake','do-screen-shake-heavy');
  void app.offsetWidth;
  app.classList.add(cls);
  setTimeout(()=>app.classList.remove(cls),heavy?600:450);
}

// ============================================================
//  BATTLE STATS TRACKER
// ============================================================
let BS = { dmgDealt:0, dmgTaken:0, crits:0, dodges:0, turns:0, highestHit:0 };
function resetBattleStats() { BS={dmgDealt:0,dmgTaken:0,crits:0,dodges:0,turns:0,highestHit:0}; }
function renderBattleSummary() {
  const el=document.getElementById('battle-summary-bar'); if(!el) return;
  el.innerHTML=`<div class="battle-summary">
    <div><div class="bsum-val">${BS.dmgDealt}</div><div class="bsum-lbl">Dmg Dealt</div></div>
    <div><div class="bsum-val">${BS.crits}</div><div class="bsum-lbl">Crits</div></div>
    <div><div class="bsum-val">${BS.dodges}</div><div class="bsum-lbl">Dodges</div></div>
    <div><div class="bsum-val">${BS.turns}</div><div class="bsum-lbl">Turns</div></div>
  </div>`;
}

// ============================================================
//  STAGE PROGRESS BAR
// ============================================================
function updateStageProgress() {
  const wrap=document.getElementById('stage-progress-wrap'); if(!wrap) return;
  if(G.endlessMode&&G.stage>20){wrap.style.display='none';return;}
  wrap.style.display='flex';
  const total=20;
  const cur=Math.min(G.stage,total);
  document.getElementById('stage-progress-fill').style.width=(cur/total*100)+'%';
  document.getElementById('stage-progress-txt').textContent=`${cur}/20`;
  // Mark boss stages
  const bossEl=document.getElementById('stage-progress-bosses');
  if(bossEl&&!bossEl.children.length){
    [10,20].forEach(s=>{
      const pip=document.createElement('div');
      pip.className='boss-pip';
      pip.style.left=(s/total*100)+'%';
      pip.title=`Stage ${s} Boss`;
      bossEl.appendChild(pip);
    });
  }
}

// ============================================================
//  KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', e => {
  // 1-4: ability shortcuts during player turn
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
  const screen=document.querySelector('.screen.active'); if(!screen) return;
  if(screen.id==='screen-battle') {
    if(!G.animLock && G.turn==='player' && G.player) {
      const idx=parseInt(e.key)-1;
      if(idx>=0&&idx<=8){
        const btns=[...document.querySelectorAll('#actions-grid .action-btn[data-ab-idx]')].filter(b=>!b.classList.contains('endturn-mini'));
        const btn=btns[idx]||null;
        if(btn&&!btn.disabled) { btn.click(); return; }
      }
    }
    // Escape = menu
    if(e.key==='Escape') { if(!G.animLock) document.getElementById('nest-modal')?.classList.toggle('open'); }
    // M = mute
    if(e.key.toLowerCase()==='m') toggleSound();
  }
  if(screen.id==='screen-select') {
    if(e.key==='Enter') { if(G.selected) startGame(); }
    const cards=[...document.querySelectorAll('.bird-card:not(.bird-locked)')];
    if(cards.length && ['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)){
      e.preventDefault();
      const selected = cards.findIndex(c=>c.classList.contains('selected'));
      const cur = selected>=0 ? selected : 0;
      const delta = (e.key==='ArrowRight'||e.key==='ArrowDown') ? 1 : -1;
      const nxt = (cur + delta + cards.length) % cards.length;
      cards[nxt].click();
      cards[nxt].scrollIntoView({block:'nearest', inline:'nearest'});
    }
  }
  if(screen.id==='screen-reward') {
    if(e.key==='Enter') { const cb=document.getElementById('reward-confirm-btn'); if(cb&&cb.classList.contains('visible')) cb.click(); }
    const cards=[...document.querySelectorAll('#reward-grid .reward-card')];
    if(cards.length && ['ArrowRight','ArrowLeft'].includes(e.key)){
      e.preventDefault();
      const selected = cards.findIndex(c=>c.classList.contains('selected'));
      const cur = selected>=0 ? selected : 0;
      const delta = e.key==='ArrowRight' ? 1 : -1;
      const nxt = (cur + delta + cards.length) % cards.length;
      cards[nxt].click();
    }
  }

  if(e.key.length===1) checkSecretUnlockChar(e.key);
});

// ============================================================
//  RUN HISTORY
// ============================================================
const RUN_HISTORY_KEY='avianAscent_runHistory_v1';
function saveRunHistory(won) {
  if(!G.player) return;
  try {
    const hist=JSON.parse(localStorage.getItem(RUN_HISTORY_KEY)||'[]');
    hist.unshift({
      bird:G.player.name, won,
      stage:Math.min(G.stage,20), birdLevel:G.player.birdLevel,
      bossKills:G.bossKills, date:Date.now(),
      endless:G.endlessMode&&G.stage>20?G.stage-20:0,
    });
    localStorage.setItem(RUN_HISTORY_KEY,JSON.stringify(hist.slice(0,5)));
  } catch(e){}
}
function renderRunHistory() {
  try {
    const hist=JSON.parse(localStorage.getItem(RUN_HISTORY_KEY)||'[]');
    if(!hist.length) return;
    const wrap=document.getElementById('run-history');
    const grid=document.getElementById('run-history-grid');
    if(!wrap||!grid) return;
    grid.innerHTML='';
    hist.forEach(r=>{
      const d=document.createElement('div');
      d.className=`run-entry ${r.won?'run-win':'run-lose'}`;
      const ago=Math.floor((Date.now()-r.date)/60000);
      const timeStr=ago<1?'just now':ago<60?`${ago}m ago`:ago<1440?`${Math.floor(ago/60)}h ago`:`${Math.floor(ago/1440)}d ago`;
      const stageStr=r.endless>0?`Stage 20 + ${r.endless} endless`:r.won?'✦ Ascended':r.stage>=20?'Stage 20':'Stage '+r.stage;
      d.innerHTML=`<div class="run-bird">${r.won?'👑 ':'💀 '}${r.bird}</div>
        <div class="run-result">${stageStr} · Lv.${r.birdLevel}</div>
        <div class="run-result" style="color:var(--text-dim)">${r.bossKills} bosses · ${timeStr}</div>`;
      grid.appendChild(d);
    });
    wrap.style.display='block';
  } catch(e){}
}

// ============================================================
//  REFERENCE GUIDE — tabbed, dynamically built
// ============================================================
let _refActiveTab = 0;

const ABILITIES_REFERENCE = {
  peck:{desc:'A weak but noticeable beak jab.',effect:'Low physical damage.'},
  blackPeck:{desc:'A dark strike from the shadows.',effect:'Medium damage + chance to frighten.'},
  honkAttack:{desc:'A loud defensive call.',effect:'Minor damage and may weaken enemies.'},
  roost:{desc:'The bird rests on its perch.',effect:'Restore HP. Cooldown 2 turns.'},
  stormCall:{desc:'Calls lightning from storm clouds.',effect:'Heavy magic damage.'},
  dirgeOfDread:{desc:'A haunting melody.',effect:'Applies Fear and Weaken.'},
  pinionVolley:{desc:'Rapid feather strikes.',effect:'Two hits that pierce armor.'},
  bleakBeak:{desc:'A grim magical peck.',effect:'Light damage but always available.'},
};

const ENEMY_BIRD_DATA = [
  {name:'Crow', hp:45, atk:8, def:5, type:'Aggressive'},
  {name:'Hawk', hp:55, atk:10, def:6, type:'Predator'},
  {name:'Emu', hp:120, atk:12, def:10, type:'Elite'},
  {name:'Blakiston Owl', hp:300, atk:18, def:15, type:'Boss'},
];

function toggleRefGuide() {
  const body = document.getElementById('ref-guide-body');
  const chevron = document.getElementById('ref-chevron');
  if (!body) return;
  const open = body.classList.toggle('open');
  chevron.classList.toggle('open', open);
  if (open) buildRefGuide();
}

function selectRefTab(idx) {
  _refActiveTab = idx;
  document.querySelectorAll('.ref-tab').forEach((t,i) => t.classList.toggle('active', i===idx));
  document.querySelectorAll('.ref-panel').forEach((p,i) => p.classList.toggle('active', i===idx));
}

function skillCard(id) {
  const tmpl = ABILITY_TEMPLATES[id];
  if (!tmpl) return '';
  const typeLabel = {physical:'Physical',ranged:'Ranged',spell:'Song/Spell',utility:'Utility'}[tmpl.type]||tmpl.type;
  const levels = (tmpl.levels||[]).map((lv,i)=>`
    <div class="ref-skill-lv">
      <span class="ref-skill-lv-badge">Lv${i+1}</span>
      <span class="ref-skill-lv-text">${lv.desc||''}</span>
    </div>`).join('');
  return `<div class="ref-skill-card">
    <div class="ref-skill-header">
      <span class="ref-skill-name">${tmpl.name}</span>
      <span class="ref-skill-type ${tmpl.type||'physical'}">${typeLabel}</span>
    </div>
    <div class="ref-skill-base">${tmpl.desc||''}</div>
    <div class="ref-skill-levels">${levels}</div>
  </div>`;
}

function buildRefGuide() {
  const tabs = document.getElementById('ref-tabs');
  const panels = document.getElementById('ref-panels');
  if (!tabs || !panels) return;

  const defs=[
    {k:'birds',label:' Birds'},
    {k:'abilities',label:'🪶 Abilities'},
    {k:'enemies',label:'☠ Enemies'},
    {k:'statuses',label:'☣ Status Effects'},
    {k:'artifacts',label:'💎 Artefacts'},
    {k:'mechanics',label:'⚙ Mechanics'},
  ];
  const prevQ=(document.getElementById('ref-search-input')?.value||'').toLowerCase();
  const prevShowLocked=!!document.getElementById('ref-show-locked')?.checked;
  tabs.innerHTML = `<div style="display:flex;gap:8px;margin-bottom:10px"><input id="ref-search-input" placeholder="Search codex..." style="flex:1;background:rgba(0,0,0,.25);border:1px solid var(--border);color:var(--text);padding:7px 9px;border-radius:8px"/><label style="font-size:.72rem;color:var(--text-dim)"><input id="ref-show-locked" type="checkbox"> Show locked</label></div>` + defs.map((t,i)=>`<div class="ref-tab${i===_refActiveTab?' active':''}" onclick="selectRefTab(${i})">${t.label}</div>`).join('');

  const q=prevQ;
  const showLocked=prevShowLocked;
  const isMatch=(txt)=>!q||String(txt||'').toLowerCase().includes(q);
  const card=(name,desc,unlocked,meta='')=>`<div class="ref-skill-card" style="opacity:${unlocked?1:0.55}"><div class="ref-skill-header"><span class="ref-skill-name">${unlocked?name:'???'}</span>${meta?`<span class="ref-skill-type utility">${meta}</span>`:''}</div><div class="ref-skill-base">${unlocked?desc:'Unlock by encountering this entry in a run.'}</div></div>`;

  const birds=Object.entries(BIRDS||{}).filter(([id,b])=>isMatch(b.name)).map(([id,b])=>{
    const u=!!G.codex?.birds?.[id]?.seen;
    if(!u&&!showLocked) return '';
    return card(b.name, `${b.tagline||''} · Class: ${(b.class||'').toUpperCase()}`,u,b.class||'bird');
  }).join('');

  const abilities=Object.entries(ABILITY_TEMPLATES||{}).filter(([id,t])=>isMatch(t.name)||isMatch(t.shortDesc)).map(([id,t])=>{
    const c=G.codex?.abilities?.[id]||{seen:false,used:false};
    const u=!!c.seen;
    if(!u&&!showLocked) return '';
    const meta=`${t.rarity||'common'} · ${t.codexType||'attack'}`;
    return card(t.name, t.shortDesc||t.desc||'No description yet.',u,meta);
  }).join('');

  const enemies=(ENEMIES||[]).filter(e=>isMatch(e.name)).map(e=>{
    const id=e.id||e.name;
    const u=!!G.codex?.enemies?.[id]?.seen;
    if(!u&&!showLocked) return '';
    const ai=(e.aiType||mapAiStyleToType(e.aiStyle)||'aggressive');
    return card(e.name, `HP ${e.stats?.maxHp||e.hp||0} · ATK ${e.stats?.atk||e.atk||0} · AI: ${ai}`,u,ai);
  }).join('');

  const statusIds=[...new Set([...Object.keys(AILMENTS||{}), ...Object.keys(G.codex?.statuses||{})])];
  const statuses=statusIds.filter(id=>isMatch(id)).map(id=>{
    const u=!!G.codex?.statuses?.[id]?.seen;
    if(!u&&!showLocked) return '';
    const d=(AILMENTS[id]?.desc)||'Status effect.';
    return card(id[0].toUpperCase()+id.slice(1),d,u,'status');
  }).join('');

  const arts=[...(G.collectedRewards||[])].filter(r=>isMatch(r.name)).map(r=>card(r.name,r.desc,true,r.tier||'reward')).join('') || (showLocked?card('???','Find rewards in runs to fill this section.',false,'locked'):'');

  const mechanics=`<div class="ref-skills-grid">
    ${card('Energy & Cooldowns','Main attacks are free unless spells. Abilities spend energy and may go on cooldown.',true,'core')}
    ${card('Enemy AI Types','Aggressive, Defensive, Trickster, Predator, and Boss AI patterns influence action choice.',true,'ai')}
    ${card('Ability Rarity','Ability offers are weighted by rarity: common, rare, epic, legendary.',true,'rarity')}
    ${card('Codex Unlocks','Entries unlock when seen/used during runs. Toggle locked entries and use search.',true,'codex')}
  </div>`;

  panels.innerHTML=`
    <div class="ref-panel ${_refActiveTab===0?'active':''}" id="ref-panel-0"><div class="ref-skills-grid">${birds||'<div class="ref-entry-desc">No matching birds.</div>'}</div></div>
    <div class="ref-panel ${_refActiveTab===1?'active':''}" id="ref-panel-1"><div class="ref-skills-grid">${abilities||'<div class="ref-entry-desc">No matching abilities.</div>'}</div></div>
    <div class="ref-panel ${_refActiveTab===2?'active':''}" id="ref-panel-2"><div class="ref-skills-grid">${enemies||'<div class="ref-entry-desc">No matching enemies.</div>'}</div></div>
    <div class="ref-panel ${_refActiveTab===3?'active':''}" id="ref-panel-3"><div class="ref-skills-grid">${statuses||'<div class="ref-entry-desc">No matching statuses.</div>'}</div></div>
    <div class="ref-panel ${_refActiveTab===4?'active':''}" id="ref-panel-4"><div class="ref-skills-grid">${arts}</div></div>
    <div class="ref-panel ${_refActiveTab===5?'active':''}" id="ref-panel-5">${mechanics}</div>
  `;
  const qEl=document.getElementById('ref-search-input');
  const lEl=document.getElementById('ref-show-locked');
  if(qEl){ qEl.value=prevQ; qEl.oninput=()=>buildRefGuide(); }
  if(lEl){ lEl.checked=prevShowLocked; lEl.onchange=()=>buildRefGuide(); }
}


// ============================================================
//  RUN UNLOCK TRACKING
// ============================================================
const BUFF_AB_IDS=new Set(['hum','dustDevil','warcry','battleHymn','reveille','victoryChant','preen','molt','roost','fruitSweetener','tookieTookie','sitAndWait','bashUp','flyby','chargeUp','evade','crowDefend','bulwarkRoar']);
const DEBUFF_AB_IDS=new Set(['dirge','lullaby','theJoker','intimidate','featherRuffle','wingClip','tailPull','taunt','eyeGouge','mudshot','cactiSpine','aerialPoop','thornBarrage','astralRefrain','murderMurmuration','plagueBlast','toxicSpit','incendiaryFeathers','blackPeck']);

function checkRunUnlocks() {
  const newUnlocks=[];
  if(G.runCrits>=100&&!isUnlocked('crit100Run')){ grantUnlock('crit100Run'); newUnlocks.push('Flamingo & Bald Eagle unlocked! (100 crits)'); }
  if(G.runBuffs>=250&&!isUnlocked('buff250Run')){ grantUnlock('buff250Run'); newUnlocks.push('Swan & Macaw unlocked! (250 buffs)'); }
  if(G.runDebuffs>=250&&!isUnlocked('debuff250Run')){ grantUnlock('debuff250Run'); newUnlocks.push('Snowy Owl & Raven unlocked! (250 debuffs)'); }
  newUnlocks.forEach(msg=>showUnlockToast('🔓 '+msg));
}
function showUnlockToast(msg) {
  const t=document.getElementById('unlock-toast'); if(!t) return;
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3500);
}

// ============================================================
//  STORK SHOP
// ============================================================
let _shopItems=[];
let _shopSelectedIdx=null;

function showStorkShop(mode='boss') {
  G._shopMode=mode;
  generateShopItems();
  enterStorkShopScreen();
}

function enterStorkShopScreen(){
  shopResetVisitState();
  showScreen('screen-stork-shop');
  const buyBtn=document.getElementById('shop-buy-btn'); if(buyBtn) buyBtn.disabled=true;
  const log=document.getElementById('shop-purchase-log');
  if(log) log.textContent=(G._shopMode==='grey'?'Stork Market: 2 ability offers, 3 cards, 1 utility.':'Boss Market: 2 high-tier abilities, 4 elite cards, 2 utilities.');
  renderShopItems();
}

function rollShopTier(weights){
  const tiers=Object.keys(weights);
  const vals=tiers.map(t=>weights[t]);
  return rollWeighted(tiers,vals);
}
function pickUniqueRewardByTier(tier,used){
  const pool=getUpgradePool().filter(r=>r.tier===tier&&!used.has(r.id)&&!(r.stackable===false && G.runUpgradesPurchased?.has(r.id)));
  if(!pool.length) return null;
  const pick=pool[Math.floor(Math.random()*pool.length)];
  used.add(pick.id);
  return pick;
}
function makeUtilityOffer(kind='regular'){
  const utilsRegular=[
    {id:'shop_util_heal20',tier:'green',icon:'🍖',name:'Field Rations',desc:'Heal 20% HP',apply:p=>{const h=Math.max(1,Math.floor(p.stats.maxHp*0.20));p.stats.hp=Math.min(p.stats.hp+h,p.stats.maxHp);}},
    {id:'shop_util_cleanse',tier:'green',icon:'🧼',name:'Spring Cleanse',desc:'Cleanse active debuffs and restore 10% HP',apply:p=>{G.playerStatus={};const h=Math.max(1,Math.floor(p.stats.maxHp*0.10));p.stats.hp=Math.min(p.stats.hp+h,p.stats.maxHp);}},
    {id:'shop_util_refresh',tier:'blue',icon:'🪙',name:'Coupon Wing',desc:'Next shop refresh is free',apply:p=>{G._freeShopRefresh=(G._freeShopRefresh||0)+1;}},
    {id:'shop_util_energy',tier:'green',icon:'🔋',name:'Spark Draft',desc:'Gain +1 max energy this run (max +3)',apply:p=>{p.energyBonus=Math.min(3,(p.energyBonus||0)+1);p.energyMax=Math.max(1,(p.energyMax||3)+1);}},
    {id:'shop_util_focus',tier:'green',icon:'🎯',name:'Hunter Focus',desc:'ACC +5 and Crit +3%',apply:p=>{p.stats.acc=Math.min(100,(p.stats.acc||80)+5);p.stats.critChance=(p.stats.critChance||5)+3;}},
  ];
  const utilsBoss=[
    {id:'shop_util_heal40',tier:'blue',icon:'🩹',name:'Boss First Aid',desc:'Heal 40% HP and cleanse debuffs',apply:p=>{G.playerStatus={};const h=Math.max(1,Math.floor(p.stats.maxHp*0.40));p.stats.hp=Math.min(p.stats.hp+h,p.stats.maxHp);}},
    {id:'shop_util_discount',tier:'purple',icon:'🛍️',name:'Royal Voucher',desc:'Your next purchase costs 2 less shiny',apply:p=>{G._nextShopDiscount=Math.max(G._nextShopDiscount||0,2);}},
    {id:'shop_util_refresh2',tier:'blue',icon:'🎟️',name:'Double Refresh Pass',desc:'Gain 2 free shop refreshes',apply:p=>{G._freeShopRefresh=(G._freeShopRefresh||0)+2;}},
    {id:'shop_util_bossward',tier:'purple',icon:'🛡️',name:'Boss Ward',desc:'MDEF +3 and cleanse one debuff now',apply:p=>{p.stats.mdef=(p.stats.mdef||0)+3;const bad=['weaken','paralyzed','slow','burning','poison','bleed','feared','lullabied'];const hit=bad.find(k=>G.playerStatus[k]);if(hit) delete G.playerStatus[hit];}},
    {id:'shop_util_apex',tier:'purple',icon:'🦅',name:'Apex Talon Oil',desc:'ATK +3, MATK +3',apply:p=>{p.stats.atk+=3;p.stats.matk=(p.stats.matk||0)+3;}},
  ];
  const arr=kind==='boss'?utilsBoss:utilsRegular;
  const pick=arr[Math.floor(Math.random()*arr.length)];
  return {...pick};
}
const ABILITY_RARITY_WEIGHTS = { common:70, rare:22, epic:7, legendary:1 };
function rollByRarity(list){
  const weighted=[];
  for(const t of list){
    const w=ABILITY_RARITY_WEIGHTS[t.rarity]??1;
    for(let i=0;i<w;i++) weighted.push(t);
  }
  return weighted.length?weighted[Math.floor(Math.random()*weighted.length)]:null;
}

function makeAbilityOffer(highQuality=false){
  const bd=BIRDS[G.player.birdKey]||{};
  const birdClass=bd.class||'';
  const existing=new Set((G.player.abilities||[]).map(a=>a.id));
  const classPool=(bd.exclusiveLearnPool&&bd.exclusiveLearnPool.length?bd.exclusiveLearnPool:Object.keys(ABILITY_TEMPLATES_LEARNABLE));
  const candidates=classPool.filter(id=>{
    const t=ABILITY_TEMPLATES[id];
    return canOfferAbilityInShop(G.player,t);
  });
  const unknown=candidates.filter(id=>!existing.has(id));
  if(unknown.length){
    const picks=unknown.map(id=>ABILITY_TEMPLATES[id]).filter(Boolean);
    const tmpl=rollByRarity(picks)||ABILITY_TEMPLATES[unknown[Math.floor(Math.random()*unknown.length)]];
    const id=tmpl.id;
    const tier=highQuality?'blue':'green';
    return {
      id:`shop_ab_learn_${id}`,
      tier,
      icon:highQuality?'📘':'📗',
      name:`Learn: ${tmpl.name}`,
      desc:`Gain ${tmpl.name} at Lv.1${highQuality?' (premium offer)':''}.`,
      apply:p=>{
        // NOTE: shopBuySelected() will handle replacement UI if you're at the non-main cap.
        p.abilities.push({...tmpl,level:1,ailmentIds:[]});
      }
    };
  }
  const upgradable=(G.player.abilities||[]).filter(a=>!isMainAttackAbility(a)&&(a.level||1)<4);
  if(upgradable.length){
    const pick=upgradable[Math.floor(Math.random()*upgradable.length)];
    return {id:`shop_ab_upgrade_${pick.id}`,tier:highQuality?'purple':'blue',icon:'🪶',name:`Train: ${pick.name}`,desc:`Upgrade ${pick.name} by +1 level (max 4).`,apply:p=>{const a=p.abilities.find(x=>x.id===pick.id);if(a)a.level=Math.min(4,(a.level||1)+1);}};
  }
  return {id:'shop_ab_focus',tier:'green',icon:'🧠',name:'Combat Drill',desc:'ATK +2, MATK +2, ACC +3',apply:p=>{p.stats.atk+=2;p.stats.matk=(p.stats.matk||0)+2;p.stats.acc=(p.stats.acc||80)+3;}};
}
function generateShopItems() {
  _shopItems=[];
  const used=new Set();
  const mode=G._shopMode||'boss';
  if(mode==='grey'){
    // Regular shop: 2 ability items, 3 upgrade cards, 1 utility
    _shopItems.push(makeAbilityOffer(false));
    _shopItems.push(makeAbilityOffer(false));
    for(let i=0;i<3;i++){
      const tier=rollShopTier({grey:50,green:28,blue:16,purple:5,gold:1});
      const pick=pickUniqueRewardByTier(tier,used)||pickUniqueRewardByTier('green',used)||pickUniqueRewardByTier('grey',used);
      if(pick) _shopItems.push(pick);
    }
    _shopItems.push(makeUtilityOffer('regular'));
  } else {
    // Boss shop: 2 high-quality ability items, 4 high-tier cards, 2 utility
    _shopItems.push(makeAbilityOffer(true));
    _shopItems.push(makeAbilityOffer(true));
    for(let i=0;i<4;i++){
      const tier=rollShopTier({blue:50,purple:38,gold:12});
      const pick=pickUniqueRewardByTier(tier,used)||pickUniqueRewardByTier('purple',used)||pickUniqueRewardByTier('blue',used);
      if(pick) _shopItems.push(pick);
    }
    _shopItems.push(makeUtilityOffer('boss'));
    _shopItems.push(makeUtilityOffer('boss'));
  }
  renderShopItems();
}
const SHOP_COSTS={grey:2,green:2,blue:4,purple:6,gold:12};

const SHOP_BANNED_IDS = new Set(['skipTurn','sittingDuck','endTurn','mimic']);
function canOfferAbilityInShop(p, tmpl){
  if(!tmpl || !tmpl.id) return false;
  if(SHOP_BANNED_IDS.has(tmpl.id)) return false;
  const cls=((p.class||BIRDS[p.birdKey]?.class||'').toLowerCase());
  if(Array.isArray(tmpl.allowedClasses) && tmpl.allowedClasses.length) return tmpl.allowedClasses.includes(cls);
  if(tmpl.isNeutral) return true;
  const bt=tmpl.btnType||tmpl.type;
  if(bt==='ranged') return cls==='ranger';
  if(bt==='spell') return MAGIC_CLASSES.has(cls);
  if(bt==='physical') return !MAGIC_CLASSES.has(cls);
  return bt==='utility';
}

const SHOP_STATE = {
  purchaseMadeThisVisit:false,
  selectedIndex:null
};

function shopResetVisitState(){
  SHOP_STATE.purchaseMadeThisVisit = false;
  SHOP_STATE.selectedIndex = null;
  _shopSelectedIdx = null;
}
function shopLockVisitState(){
  SHOP_STATE.purchaseMadeThisVisit = true;
  SHOP_STATE.selectedIndex = null;
  _shopSelectedIdx = null;
}
function shopTooltipNode(){
  let tt=document.getElementById('shop-ability-tooltip');
  if(!tt){
    tt=document.createElement('div');
    tt.id='shop-ability-tooltip';
    document.body.appendChild(tt);
  }
  return tt;
}
function showShopTooltip(text, ev){
  if(!text) return;
  const tt=shopTooltipNode();
  tt.textContent=text;
  tt.style.display='block';
  tt.style.left=(((ev&&ev.clientX)||0)+14)+'px';
  tt.style.top=(((ev&&ev.clientY)||0)+14)+'px';
}
function hideShopTooltip(){
  const tt=document.getElementById('shop-ability-tooltip');
  if(tt) tt.style.display='none';
}
function resolveShopAbilityTemplate(item){
  if(!item||!item.id) return null;
  let learnId=null;
  if(item.id.startsWith('shop_ab_learn_')) learnId=item.id.replace('shop_ab_learn_','');
  else if(item.id.startsWith('shop_ab_upgrade_')) learnId=item.id.replace('shop_ab_upgrade_','');
  if(!learnId) return null;
  return (ABILITY_TEMPLATES && ABILITY_TEMPLATES[learnId]) || null;
}
function buildShopItemTooltip(item){
  const tmpl=resolveShopAbilityTemplate(item);
  if(!tmpl) return item?.desc || item?.description || '';
  const level=1;
  const parts=[];
  if(tmpl.desc) parts.push(tmpl.desc);
  const row=Array.isArray(tmpl.levels)?tmpl.levels[level-1]:null;
  if(row&&row.desc) parts.push(row.desc);
  let en=(typeof tmpl.energyCost==='number')?tmpl.energyCost:1;
  if(Array.isArray(tmpl.energyByLevel)) en=(tmpl.energyByLevel[level-1] ?? tmpl.energyByLevel[0] ?? en);
  let cd=0;
  if(Array.isArray(tmpl.cooldownByLevel)) cd=(tmpl.cooldownByLevel[level-1] ?? tmpl.cooldownByLevel[0] ?? 0);
  parts.push(`EN ${en}`);
  if(cd>0) parts.push(`CD ${cd}`);
  return parts.join(' • ');
}

function renderShopItems() {
  const grid=document.getElementById('shop-items-grid'); if(!grid) return;
  grid.innerHTML='';
  document.getElementById('shop-shiny-count').textContent=G.shinyObjects;
  SHOP_STATE.selectedIndex=null;
  _shopSelectedIdx=null;
  const buyBtn=document.getElementById('shop-buy-btn'); if(buyBtn) buyBtn.disabled=true;
  const refreshBtn=document.getElementById('shop-refresh-btn'); if(refreshBtn) refreshBtn.disabled=!!SHOP_STATE.purchaseMadeThisVisit;

  _shopItems.forEach((item,idx)=>{
    const baseCost=SHOP_COSTS[item.tier]||1;
    const cost=Math.max(0,baseCost-Math.max(0,G._nextShopDiscount||0));
    const canAfford=G.shinyObjects>=cost;
    const canSelect=canAfford && !SHOP_STATE.purchaseMadeThisVisit;
    const tooltip=buildShopItemTooltip(item);

    const div=document.createElement('div');
    div.className=`shop-item tier-${item.tier} ${canAfford?'':'cant-afford'} ${SHOP_STATE.purchaseMadeThisVisit?'shop-locked-visit':''}`;
    div.innerHTML=`
      <div class="shop-item-cost">${cost}🌟</div>
      <div class="reward-tier-label">${REWARD_TIERS[item.tier].label}</div>
      <span class="reward-icon">${item.icon}</span>
      <div class="reward-name">${item.name}</div>
      <div class="reward-desc">${tooltip || item.desc}</div>`;
    if(tooltip) div.title=tooltip;

    div.addEventListener('mouseenter', e=>showShopTooltip(tooltip, e));
    div.addEventListener('mousemove', e=>showShopTooltip(tooltip, e));
    div.addEventListener('mouseleave', hideShopTooltip);
    div.addEventListener('click', e=>{
      showShopTooltip(tooltip, e);
      if(!canSelect) return;
      document.querySelectorAll('.shop-item').forEach(x=>x.classList.remove('selected'));
      div.classList.add('selected');
      SHOP_STATE.selectedIndex=idx;
      _shopSelectedIdx=idx;
      const buyBtn=document.getElementById('shop-buy-btn'); if(buyBtn) buyBtn.disabled=false;
    });

    grid.appendChild(div);
  });
}

function nonMainAbilities(p){
  return (p.abilities||[]).filter(a=>!isMainAttackAbility(a));
}

function ensureShopSwapModal(){
  if(document.getElementById('shop-swap-modal')) return;

  const modal=document.createElement('div');
  modal.id='shop-swap-modal';
  modal.style.cssText=`
    display:none; position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,.65); align-items:center; justify-content:center;
  `;
  modal.innerHTML=`
    <div style="width:min(520px,92vw); background:rgba(20,15,5,.97); border:1px solid var(--gold);
                border-radius:12px; padding:16px; box-shadow:0 10px 40px rgba(0,0,0,.55);">
      <div style="font-family:Cinzel,serif; color:var(--gold); letter-spacing:.08em; margin-bottom:8px;">
        🪶 SKILL SLOTS FULL — Choose a skill to replace
      </div>
      <div id="shop-swap-sub" style="color:var(--text-dim); font-size:.82rem; margin-bottom:12px;"></div>
      <div id="shop-swap-list" style="display:flex; flex-direction:column; gap:8px;"></div>
      <button id="shop-swap-cancel"
        style="margin-top:12px; background:rgba(40,35,25,.25); border:1px solid var(--border);
               color:var(--text-dim); padding:7px 14px; border-radius:8px; cursor:pointer;">
        ✕ Cancel
      </button>
    </div>
  `;
  document.body.appendChild(modal);
}

function openShopSwapModal(newTmpl, onPick, onCancel){
  ensureShopSwapModal();
  const modal=document.getElementById('shop-swap-modal');
  const sub=document.getElementById('shop-swap-sub');
  const list=document.getElementById('shop-swap-list');
  const cancel=document.getElementById('shop-swap-cancel');

  sub.innerHTML = `Replace one non-main skill with <strong style="color:var(--gold)">${newTmpl.name}</strong>.`;
  list.innerHTML='';

  const p=G.player;
  const pool=nonMainAbilities(p);

  pool.forEach(ab=>{
    const btn=document.createElement('button');
    btn.style.cssText=`
      background:rgba(201,168,76,.08); border:1px solid rgba(201,168,76,.25);
      border-radius:10px; padding:10px 12px; cursor:pointer; color:var(--text);
      text-align:left; display:flex; gap:10px; align-items:flex-start;
    `;
    btn.innerHTML=`
      <div style="font-size:1.05rem; line-height:1;">${ab.icon||'🪶'}</div>
      <div>
        <div style="font-weight:800;">${ab.name} <span style="color:var(--text-dim); font-weight:600;">(Lv.${ab.level||1})</span></div>
        <div style="font-size:.78rem; color:var(--text-dim); line-height:1.25;">${ab.desc||''}</div>
      </div>
    `;
    btn.onclick=()=>{ modal.style.display='none'; onPick(ab.id); };
    list.appendChild(btn);
  });

  cancel.onclick=()=>{ modal.style.display='none'; if(onCancel) onCancel(); };

  modal.style.display='flex';
}

async function shopBuySelected() {
  if(SHOP_STATE.purchaseMadeThisVisit){
    const log=document.getElementById('shop-purchase-log');
    if(log) log.textContent='🪶 You may only buy one item per shop visit.';
    logMsg('🪶 You may only buy one item per shop visit.','system');
    return false;
  }
  const selected=(SHOP_STATE.selectedIndex!==null?SHOP_STATE.selectedIndex:_shopSelectedIdx);
  if(selected===null||selected>=_shopItems.length) return false;
  const item=_shopItems[selected];

  const baseCost=SHOP_COSTS[item.tier]||1;
  const discount=Math.max(0,G._nextShopDiscount||0);
  const cost=Math.max(0,baseCost-discount);
  if(G.shinyObjects<cost){ logMsg('Not enough shiny objects!','miss'); return false; }

  // Special handling: learning a new ability when non-main slots are full
  if(item.id && item.id.startsWith('shop_ab_learn_')){
    const learnId=item.id.replace('shop_ab_learn_','');
    const tmpl=ABILITY_TEMPLATES[learnId];
    if(!tmpl){ logMsg('Skill template missing.','miss'); return false; }

    const nm=nonMainAbilities(G.player);
    if(nm.length>=4){
      openShopSwapModal(
        tmpl,
        (replaceId)=>{
          if(SHOP_STATE.purchaseMadeThisVisit) return;
          G.shinyObjects-=cost;
          if(discount>0) G._nextShopDiscount=0;

          const idx=G.player.abilities.findIndex(a=>a.id===replaceId);
          if(idx>=0) G.player.abilities.splice(idx,1,{...tmpl,level:1,ailmentIds:[]});
          else G.player.abilities.push({...tmpl,level:1,ailmentIds:[]});

          if(!G.collectedRewards) G.collectedRewards=[];
          G.collectedRewards.push({icon:item.icon,tier:item.tier,name:item.name,desc:item.desc});

          logMsg(`🌟 Purchased: ${item.name}!`,'exp-gain');
          const log=document.getElementById('shop-purchase-log');
          if(log) log.textContent=`✓ Bought: ${item.icon} ${item.name} · One item per visit`;

          if(item.stackable===false){ if(!(G.runUpgradesPurchased instanceof Set)) G.runUpgradesPurchased=new Set(); G.runUpgradesPurchased.add(item.id); }
          _shopItems.splice(selected,1);
          refreshPlayerAbilityAilments();
          enforceAbilityCosts(G.player);
          shopLockVisitState();
          saveRun();
          renderShopItems();
        },
        ()=>{}
      );
      return true;
    }
  }

  G.shinyObjects-=cost;
  if(discount>0) G._nextShopDiscount=0;
  if(item.id && item.id.startsWith('shop_ab_upgrade_')){
    const abId=item.id.replace('shop_ab_upgrade_','');
    const a=G.player.abilities.find(x=>x.id===abId);
    if(a){
      const prevLevel=a.level||1;
      a.level=Math.min(4,(a.level||1)+1);
      const tmpl=ABILITY_TEMPLATES[a.id];
      if(tmpl && prevLevel<4 && a.level===4 && (tmpl.type==='physical'||tmpl.type==='ranged') && ailmentSlotsForLevel(tmpl,4)>ailmentSlotsForLevel(tmpl,3)){
        const choice=await openAbilityModificationChoice(a, tmpl);
        if(choice) a.modAilmentChoice=choice;
      }
    }
  } else {
    item.apply(G.player);
  }
  refreshPlayerAbilityAilments();
  enforceAbilityCosts(G.player);

  if(!G.collectedRewards) G.collectedRewards=[];
  G.collectedRewards.push({icon:item.icon,tier:item.tier,name:item.name,desc:item.desc});
  codexMark('artifacts', item.id||item.name, 'seen');
  logMsg(`🌟 Purchased: ${item.name}!`,'exp-gain');
  const log=document.getElementById('shop-purchase-log');
  if(log) log.textContent=`✓ Bought: ${item.icon} ${item.name} · One item per visit`;

  if(item.stackable===false){ if(!(G.runUpgradesPurchased instanceof Set)) G.runUpgradesPurchased=new Set(); G.runUpgradesPurchased.add(item.id); }
  _shopItems.splice(selected,1);
  shopLockVisitState();
  saveRun();
  renderShopItems();
  return true;
}
function shopRefresh() {
  if(SHOP_STATE.purchaseMadeThisVisit){
    const log=document.getElementById('shop-purchase-log');
    if(log) log.textContent='🪶 You may only buy one item per shop visit.';
    logMsg('🪶 You may only buy one item per shop visit.','system');
    return false;
  }
  if((G._freeShopRefresh||0)>0){G._freeShopRefresh--; }
  else if(G.shinyObjects>=5){G.shinyObjects-=5;}
  else { logMsg('Need 5 shiny objects to refresh!','miss'); return false; }
  const log=document.getElementById('shop-purchase-log');
  if(log) log.textContent='🔄 Shop refreshed!';
  generateShopItems();
  return true;
}
function exitStorkShop() {
  advanceStage();
}

// ============================================================
//  ABANDON RUN
// ============================================================
function openAbandonModal() {
  const m=document.getElementById('abandon-modal'); if(m) m.classList.add('open');
}
function closeAbandonModal() {
  const m=document.getElementById('abandon-modal'); if(m) m.classList.remove('open');
}
function confirmAbandon() {
  closeAbandonModal();
  checkRunUnlocks();
  deleteSave();
  showScreen('screen-select');initSelectionSafe();
  renderRunHistory();
}

// ============================================================
//  DEV CODE
// ============================================================
function checkDevCode(val) {
  const msg = document.getElementById('dev-code-msg');
  const code=(val||'').trim().toLowerCase();
  const allUnlockIds=['stage20','stage40','crit100Run','buff250Run','debuff250Run','fletchlingWin','juvenileWin','predatorWin','easyWin','normalWin','hardWin','unlock_hummingbird','unlock_shoebill','unlock_secretary','unlock_magpie','unlock_kookaburra','unlock_peregrine','unlock_harpy','unlock_ostrich','unlock_kiwi','unlock_lyrebird','unlock_toucan','unlock_penguin','unlock_emu','unlock_swan','unlock_flamingo','unlock_seagull','unlock_albatross','unlock_duke_blakiston'];
  if (code === 'birdwatching') {
    const u = getUnlocks();
    allUnlockIds.forEach(id => { u[id] = true; });
    localStorage.setItem(UNLOCK_KEY, JSON.stringify(u));
    const input = document.getElementById('dev-code-input');
    if (input) input.value = '';
    if (msg) { msg.textContent = '🔓 Birdwatching: all birds unlocked (including Emu)!'; msg.style.color = 'var(--gold-light)'; }
    setTimeout(() => { if (msg) msg.textContent = ''; }, 3200);
    initSelectionSafe();
    return;
  }
  if (code === 'headinghome') {
    localStorage.setItem(UNLOCK_KEY, JSON.stringify({}));
    const input = document.getElementById('dev-code-input');
    if (input) input.value = '';
    if (msg) { msg.textContent = '🔒 Headinghome: unlockable birds locked again.'; msg.style.color = 'var(--red-light)'; }
    setTimeout(() => { if (msg) msg.textContent = ''; }, 3200);
    initSelectionSafe();
    return;
  }
  if (code === 'blakiston') {
    const u=getUnlocks();
    u.unlock_duke_blakiston=true;
    localStorage.setItem(UNLOCK_KEY, JSON.stringify(u));
    try { localStorage.setItem('blakiston_debug_unlocked', '1'); } catch(_) {}
    window.__blakistonDebugUnlocked = true;
    const input = document.getElementById('dev-code-input');
    if (input) input.value = '';
    if (msg) { msg.textContent = '🦉 Duke Blakiston unlocked as a playable champion.'; msg.style.color = 'var(--gold-light)'; }
    setTimeout(() => { if (msg) msg.textContent = ''; }, 3200);
    initSelectionSafe();
    return;
  }
  if (val.length >= 10) {
    if (msg) { msg.textContent = 'Invalid code.'; msg.style.color = 'var(--red-light)'; }
    setTimeout(() => { if (msg) msg.textContent = ''; }, 1800);
  }
}

const ACCESS_KEY='avian_accessibility_v1';
function getAccessibilitySettings(){
  try{
    return JSON.parse(localStorage.getItem(ACCESS_KEY)||'{"fontSize":100,"colorBlind":"off","reduceMotion":false,"highContrast":false}');
  }catch(_){ return {fontSize:100,colorBlind:'off',reduceMotion:false,highContrast:false}; }
}
function applyAccessibilitySettings(s){
  const cfg=s||getAccessibilitySettings();
  document.documentElement.style.fontSize=`${Math.max(85,Math.min(140,Number(cfg.fontSize)||100))}%`;
  document.body.classList.toggle('reduce-motion', !!cfg.reduceMotion);
  document.body.classList.toggle('high-contrast', !!cfg.highContrast);
  ['cb-protanopia','cb-deuteranopia','cb-tritanopia'].forEach(c=>document.body.classList.remove(c));
  if(cfg.colorBlind==='protanopia') document.body.classList.add('cb-protanopia');
  if(cfg.colorBlind==='deuteranopia') document.body.classList.add('cb-deuteranopia');
  if(cfg.colorBlind==='tritanopia') document.body.classList.add('cb-tritanopia');
}
function openSettingsModal(){
  const cfg=getAccessibilitySettings();
  const font=document.getElementById('setting-font-size');
  const cb=document.getElementById('setting-color-blind');
  const rm=document.getElementById('setting-reduce-motion');
  const hc=document.getElementById('setting-high-contrast');
  if(font) font.value=String(cfg.fontSize||100);
  if(cb) cb.value=cfg.colorBlind||'off';
  if(rm) rm.checked=!!cfg.reduceMotion;
  if(hc) hc.checked=!!cfg.highContrast;
  const m=document.getElementById('settings-modal'); if(m) m.classList.add('open');
}
function closeSettingsModal(){
  const m=document.getElementById('settings-modal'); if(m) m.classList.remove('open');
}
function updateAccessibilitySettings(){
  const cfg={
    fontSize:Number(document.getElementById('setting-font-size')?.value||100),
    colorBlind:String(document.getElementById('setting-color-blind')?.value||'off'),
    reduceMotion:!!document.getElementById('setting-reduce-motion')?.checked,
    highContrast:!!document.getElementById('setting-high-contrast')?.checked,
  };
  localStorage.setItem(ACCESS_KEY, JSON.stringify(cfg));
  applyAccessibilitySettings(cfg);
}

installErrorHUD();
applyAccessibilitySettings();


/* ============================================================
   PATCH: Pixel sprites for player/enemy avatars + Character Select
   Birds supported: sparrow, goose, blackbird, crow, macaw,
                    hummingbird, shoebill, secretarybird
   Frames:
     0 idle
     1 taunt/cast (spell/song)
     2 attack
     3 power/buff
   ============================================================ */
(function(){
  const SPRITE_KEYS = new Set(['sparrow','goose','blackbird','crow','macaw','hummingbird','shoebill','secretarybird','secretary','magpie','kookaburra','kiwi','penguin','robin','flamingo','seagull','emu','dukeblakiston','albatross','harpy','harpyeagle','baldeagle','blackcockatoo','ostrich','cassowary']);
  const CASTERS = new Set(['mage','bard','summoner']);

  function normKey(k){ return String(k||'').toLowerCase().replace(/[^a-z]/g,''); } // secretaryBird -> secretarybird
  function whoEl(who){ return document.getElementById(`${who}-avatar`); }

  function ensureSpriteInEl(el, key, locked){
    if(!el || !SPRITE_KEYS.has(key)) return null;
    let spr = el.querySelector('.sprite4');
    if(spr) return spr;
    el.innerHTML = `<div class="sprite4 ${locked?'locked':''} sprite-${key} frame-0" id="${el.id}-sprite"></div>`;
    el.style.fontSize='';
    return el.querySelector('.sprite4');
  }

  function setFrameFor(who, frame, holdMs){
    const key = who==='player' ? normKey(G?.player?.birdKey) : normKey(G?.enemy?.birdKey);
    const el = whoEl(who);
    const spr = ensureSpriteInEl(el, key, false);
    if(!spr) return;
    spr.classList.remove('frame-0','frame-1','frame-2','frame-3');
    spr.classList.add('frame-'+frame);
    if(holdMs){
      clearTimeout(globalThis[`__${who}FrameTimer`]);
      globalThis[`__${who}FrameTimer`] = setTimeout(()=>setFrameFor(who,0), holdMs);
    }
  }

  function startIdleBlink(who){
    const flag = `__${who}IdleLoopStarted`;
    if(globalThis[flag]) return;
    globalThis[flag]=true;
    setInterval(()=>{
      try{
        const key = who==='player' ? normKey(G?.player?.birdKey) : normKey(G?.enemy?.birdKey);
        if(!SPRITE_KEYS.has(key)) return;
        // blink/cast frame briefly
        setFrameFor(who,1,220);
      }catch(_){}
    }, 2600);
  }

  // Hook refreshBattleUI to render sprites
  const oldRefresh = globalThis.refreshBattleUI;
  if(typeof oldRefresh==='function'){
    globalThis.refreshBattleUI = function(){
      oldRefresh.apply(this, arguments);
      try{
        const pk = normKey(G?.player?.birdKey);
        if(SPRITE_KEYS.has(pk)){
          ensureSpriteInEl(whoEl('player'), pk, false);
          startIdleBlink('player');
        }
        const ek = normKey(G?.enemy?.birdKey);
        if(SPRITE_KEYS.has(ek)){
          // don't override if enemy is Duke with its own sprite system (optional)
          if(!(G?.enemy?.id==='dukeBlakiston' || /blakiston/i.test(G?.enemy?.name||''))){
            ensureSpriteInEl(whoEl('enemy'), ek, false);
            startIdleBlink('enemy');
          }
        }
      }catch(_){}
    };
  }

  // Hook playerAction to flash correct frame based on ability type
  const oldPlayerAction = globalThis.playerAction;
  if(typeof oldPlayerAction==='function'){
    globalThis.playerAction = async function(ab, fromQueue){
      try{
        const t = ABILITY_TEMPLATES?.[ab?.id] || {};
        const at = (t.type || t.btnType || '').toLowerCase();
        const cls = (G?.player?.class || BIRDS?.[G?.player?.birdKey]?.class || '').toLowerCase();
        const isCaster = CASTERS.has(cls);

        if(at==='attack') setFrameFor('player',2,260);
        else if(at==='spell' || at==='song') setFrameFor('player',1,280);
        else setFrameFor('player',3,280);

      }catch(_){}
      return await oldPlayerAction.apply(this, arguments);
    };
  }

  // Hook enemy action execution if available
  const oldExec = globalThis.executeEnemyAction;
  if(typeof oldExec==='function'){
    globalThis.executeEnemyAction = async function(act){
      try{
        const ek = normKey(G?.enemy?.birdKey);
        if(SPRITE_KEYS.has(ek) && !(G?.enemy?.id==='dukeBlakiston' || /blakiston/i.test(G?.enemy?.name||''))){
          if(act?.type==='attack') setFrameFor('enemy',2,260);
          else if(act?.type==='ability') setFrameFor('enemy',3,260);
        }
      }catch(_){}
      return await oldExec.apply(this, arguments);
    };
  }

  // Character Select: wrap buildBirdCard to use sprites
  if(typeof globalThis.buildBirdCard==='function'){
    const _old = globalThis.buildBirdCard;
    globalThis.buildBirdCard = function(key, bird, locked, globalMax){
      const card = _old.apply(this, arguments);
      try{
        const k = normKey(key);
        if(!SPRITE_KEYS.has(k)) return card;
        const portrait = card.querySelector('.bird-portrait');
        if(!portrait) return card;
       portrait.outerHTML = renderBirdIconHTML(key, bird, locked);
       portrait.innerHTML = renderBirdIconHTML(key, bird, locked);
        if(!locked){
          card.addEventListener('mouseenter', ()=> {
            const s = portrait.querySelector('.sprite4'); if(!s) return;
            s.classList.remove('frame-0','frame-1','frame-2','frame-3'); s.classList.add('frame-1');
          }, {passive:true});
          card.addEventListener('mouseleave', ()=> {
            const s = portrait.querySelector('.sprite4'); if(!s) return;
            s.classList.remove('frame-0','frame-1','frame-2','frame-3'); s.classList.add('frame-0');
          }, {passive:true});
        }
      }catch(_){}
      return card;
    };
  }

})();



/* ============================================================
   PATCH: Sprites always visible (no Birdwatching required)
   - Replace PORTRAITS entries with sprite HTML for supported birds
   - Forces all UI locations using PORTRAITS[...] to show sprites
   ============================================================ */
(function(){
  const SPRITE_KEYS = ['sparrow','goose','blackbird','crow','macaw','hummingbird','shoebill','secretarybird','secretary','magpie','kookaburra','flamingo','seagull','dukeblakiston','albatross','harpy','harpyeagle','baldeagle','blackcockatoo','ostrich','cassowary'];
  function mk(k, small=true){
    const cls = small ? 'sprite4 small' : 'sprite4';
    return `<div class="${cls} sprite-${k} frame-0"></div>`;
  }
  // Replace portrait glyphs with sprite blocks
  if(globalThis.PORTRAITS){
    SPRITE_KEYS.forEach(k=>{
      PORTRAITS[k] = mk(k, true);
    });
    // common portraitKey variants
    if(PORTRAITS['secretaryBird']) PORTRAITS['secretaryBird'] = mk('secretarybird', true);
  }

  // Also make sure buildBirdCard locked branch is not stuck on emoji after render
  const oldBuild = globalThis.buildBirdCard;
  if(typeof oldBuild==='function' && !oldBuild.__spriteWrapped){
    const norm = (s)=>String(s||'').toLowerCase().replace(/[^a-z]/g,'');
    const set = new Set(SPRITE_KEYS);
    const wrapped = function(key, bird, locked, globalMax){
      const card = oldBuild.apply(this, arguments);
      try{
        const k = norm(key);
        if(!set.has(k)) return card;
        const portrait = card.querySelector('.bird-portrait');
        if(portrait){
          portrait.innerHTML = mk(k,true);
          const spr = portrait.querySelector('.sprite4');
          if(spr && locked) spr.classList.add('locked');
        }
      }catch(_){}
      return card;
    };
    wrapped.__spriteWrapped = true;
    globalThis.buildBirdCard = wrapped;
  }

  // Refresh selection if already on screen
  try{
    if(typeof initSelectionSafe==='function') initSelectionSafe();
  }catch(_){}
})();



/* ============================================================
   PATCH: Medium bird sprites on select/preview (no squish)
   - magpie, kookaburra use .sprite4.medium on select screen
   - player/enemy avatars can use battle-medium if size is medium
   ============================================================ */
(function(){
  function normKey(k){ return String(k||'').toLowerCase().replace(/[^a-z]/g,''); }
  function sizeClassForBird(b, context='select'){
    return (typeof globalThis.getUISizeClass==='function')
      ? globalThis.getUISizeClass(b, context)
      : 'medium';
  }

  // Wrap buildBirdCard again (safe) to choose size class
  if(typeof globalThis.buildBirdCard==='function'){
    const _old=globalThis.buildBirdCard;
    globalThis.buildBirdCard=function(key,bird,locked,globalMax){
      const card=_old.apply(this,arguments);
      try{
        const k=normKey(key);
        const portrait=card.querySelector('.bird-portrait');
        if(!portrait) return card;

        // If sprite supported, use it always
        const supported = (globalThis.SPRITE_KEYS && SPRITE_KEYS.has(k)) || (portrait.innerHTML||'').includes('sprite-') || false;
        if((globalThis.SPRITE_KEYS && SPRITE_KEYS.has(k)) || /sprite-/.test(portrait.innerHTML)){
          const sz=sizeClassForBird(bird,'select');
          portrait.innerHTML = `<div class="sprite4 ${sz} sprite-${k} frame-0 ${locked?'locked':''}"></div>`;
        }
      }catch(_){}
      return card;
    };
  }

  // Hook updateAscentPanel to render sprite portrait in inline preview
  const oldUpdate=globalThis.updateAscentPanel;
  if(typeof oldUpdate==='function'){
    globalThis.updateAscentPanel=function(key){
      oldUpdate.apply(this,arguments);
      try{
        const k=normKey(key);
        const bird = globalThis.BIRDS?.[key] || globalThis.BIRDS?.[k];
        const panel=document.getElementById('ascent-panel');
        if(!panel || !bird) return;
        const portrait=panel.querySelector('.ascent-portrait');
        if(!portrait) return;
        if(globalThis.SPRITE_KEYS && SPRITE_KEYS.has(k)){
          // Medium birds get medium portrait
          const sz = sizeClassForBird(bird,'panel');
          portrait.innerHTML = `<div class="sprite4 ${sz} sprite-${k} frame-0"></div>`;
        }
      }catch(_){}
    };
  }
})();



/* ============================================================
   PATCH: Goose Honk damage tuning (was too high)
   New dmgMult per level: 1.10 / 1.25 / 1.40 / 1.55
   (keeps Tank identity without deleting targets)
   ============================================================ */
(function(){
  const T=globalThis.ABILITY_TEMPLATES;
  if(!T) return;
  const h=T.honkAttack;
  if(!h) return;
  h.baseDmgMult = 1.10;
  h.levels = h.levels || [];
  const mult=[1.10,1.25,1.40,1.55];
  for(let i=0;i<4;i++){
    if(!h.levels[i]) h.levels[i]={lv:i+1,desc:''};
    h.levels[i].dmgMult = mult[i];
  }
  // update displayed desc to match (optional)
  if(h.levels[0]) h.levels[0].desc = '110% dmg, 25% miss';
  if(h.levels[1]) h.levels[1].desc = '125% dmg, 20% miss — 15% Paralysis';
  if(h.levels[2]) h.levels[2].desc = '140% dmg, 18% miss, 20% Paralysis';
  if(h.levels[3]) h.levels[3].desc = '155% dmg, 12% miss, 25% Paralysis, 10% Stun';
})();



/* ============================================================
   PATCH: Enable Kiwi + Penguin sprites everywhere sprites are used
   - Adds sprite keys
   - Ensures penguin displays as "Emperor Penguin" in UI labels
   ============================================================ */
(function(){
  try{
    // Ensure externally provided sprite sheets are recognised everywhere
    if(globalThis.SPRITE_KEYS_ALL && SPRITE_KEYS_ALL.add){
      SPRITE_KEYS_ALL.add('kiwi');
      SPRITE_KEYS_ALL.add('penguin');
SPRITE_KEYS_ALL.add('magpie');
      SPRITE_KEYS_ALL.add('flamingo');
      SPRITE_KEYS_ALL.add('seagull');
    }
  }catch(_){}
})();



// ===== 05_script_05.js =====

/* ============================================================
   PATCH: Tiny sprite animation controller refresh
   - Keeps magpie on 2x2 sheet
   - Adds small idle flutter + clearer attack/run/crouch cues
   ============================================================ */
(function(){
  const SPRITE_KEYS = new Set(['sparrow','goose','blackbird','crow','macaw','robin','hummingbird','shoebill','secretarybird','secretary','magpie','kookaburra','flamingo','seagull','emu','penguin','dukeblakiston','albatross','harpy','harpyeagle','baldeagle','blackcockatoo','ostrich','cassowary']);
  const CASTERS = new Set(['mage','bard']);

  function normKey(k){ return String(k||'').toLowerCase().replace(/[^a-z]/g,''); }
  function whoEl(who){ return document.getElementById(`${who}-avatar`); }
  function currentKey(who){ return normKey(who==='player' ? G?.player?.birdKey : G?.enemy?.birdKey); }

  function ensureSprite(who){
    const key=currentKey(who);
    const el=whoEl(who);
    if(!el || !SPRITE_KEYS.has(key)) return null;
    let spr=el.querySelector('.sprite4');
    if(!spr){
      el.innerHTML = `<div class="sprite4 sprite-${key} frame-0" id="${who}-avatar-sprite"></div>`;
      spr=el.querySelector('.sprite4');
    }
    return spr;
  }

  function clearFrames(spr){ spr.classList.remove('frame-0','frame-1','frame-2','frame-3'); }

  function setSpriteFrame(who, frame, holdMs=0){
    const spr=ensureSprite(who);
    if(!spr) return;
    clearFrames(spr);
    spr.classList.add(`frame-${frame}`);
    if(holdMs>0){
      clearTimeout(spr._frameTimer);
      spr._frameTimer=setTimeout(()=>{
        const s=ensureSprite(who);
        if(!s) return;
        clearFrames(s);
        s.classList.add('frame-0');
      }, holdMs);
    }
  }

  function pulseIdle(who){
    const flag=`__spriteIdle_${who}`;
    if(globalThis[flag]) return;
    globalThis[flag]=true;
    setInterval(()=>{
      const spr=ensureSprite(who);
      if(!spr || document.hidden) return;
      if(spr._busyUntil && spr._busyUntil > Date.now()) return;
      setSpriteFrame(who, 1, 170);
    }, who==='player' ? 3200 : 4100);
  }

  function playAction(who, kind){
    const spr=ensureSprite(who);
    if(!spr) return;
    spr._busyUntil=Date.now()+420;
    if(kind==='attack') setSpriteFrame(who,1,260);
    else if(kind==='run') setSpriteFrame(who,2,260);
    else if(kind==='crouch') setSpriteFrame(who,3,280);
    else setSpriteFrame(who,0);
  }

  const oldRefresh=globalThis.refreshBattleUI;
  if(typeof oldRefresh==='function'){
    globalThis.refreshBattleUI=function(){
      const out=oldRefresh.apply(this, arguments);
      try{ ensureSprite('player'); ensureSprite('enemy'); pulseIdle('player'); pulseIdle('enemy'); }catch(_){}
      return out;
    };
  }

  const oldPlayerAction=globalThis.playerAction;
  if(typeof oldPlayerAction==='function'){
    globalThis.playerAction=async function(ab, fromQueue){
      try{
        const t=ABILITY_TEMPLATES?.[ab?.id] || {};
        const at=String(t.type || t.btnType || '').toLowerCase();
        const cls=String(G?.player?.class || BIRDS?.[G?.player?.birdKey]?.class || '').toLowerCase();
        if(at==='physical' || at==='attack' || at==='melee') playAction('player','attack');
        else if(at==='movement' || at==='dash') playAction('player','run');
        else if(at==='spell' || at==='song' || CASTERS.has(cls)) playAction('player','crouch');
        else playAction('player','attack');
      }catch(_){}
      return await oldPlayerAction.apply(this, arguments);
    };
  }

  const oldEnemy=globalThis.executeEnemyAction;
  if(typeof oldEnemy==='function'){
    globalThis.executeEnemyAction=async function(act){
      try{
        const ek=currentKey('enemy');
        if(SPRITE_KEYS.has(ek) && !(G?.enemy?.id==='dukeBlakiston' || /blakiston/i.test(G?.enemy?.name||''))){
          if(act?.type==='attack') playAction('enemy','attack');
          else if(act?.type==='move') playAction('enemy','run');
          else playAction('enemy','crouch');
        }
      }catch(_){}
      return await oldEnemy.apply(this, arguments);
    };
  }

  const oldDoAttack=globalThis.doAttack;
  if(typeof oldDoAttack==='function'){
    globalThis.doAttack=async function(attacker,target,result){
      try{ playAction(attacker,'attack'); setTimeout(()=>playAction(target,'crouch'), 120); }catch(_){}
      return await oldDoAttack.apply(this, arguments);
    };
  }

  globalThis.__birdSpriteController={ setSpriteFrame, playAction, ensureSprite };
})();


// ===== 06_script_06.js =====

/* ============================================================
   PATCH: Bird animation polish + procedural enemy personalities
   - idle breathing
   - attack snap
   - hit recoil
   - enemy stagger
   - slight hover for flying birds
   - personality-driven enemy planning
   ============================================================ */
(function(){
  const FLYERS = new Set(['sparrow','goose','blackbird','crow','macaw','robin','hummingbird','magpie','kookaburra','flamingo','seagull','raven','hawk','owl']);
  const TRICKSTERS = new Set(['crow','raven','magpie','kookaburra','seagull']);
  const DEFENSIVE = new Set(['goose','swan','pelican','duck']);
  const PREDATORS = new Set(['hawk','falcon','eagle','owl','redtailedhawk','barnowl']);
  const AGGRESSORS = new Set(['emu','cassowary','shoebill','secretarybird','condor']);
  const BOSS_IDS = new Set(['dukeblakiston']);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes birdIdleBreath {
      0%,100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-2px) scale(1.015); }
    }
    @keyframes birdHoverFloat {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    @keyframes birdAttackSnap {
      0% { transform: translateX(0) scale(1); }
      35% { transform: translateX(8px) scale(1.06); }
      100% { transform: translateX(0) scale(1); }
    }
    @keyframes birdAttackSnapEnemy {
      0% { transform: translateX(0) scale(1); }
      35% { transform: translateX(-8px) scale(1.06); }
      100% { transform: translateX(0) scale(1); }
    }
    @keyframes birdHitRecoil {
      0% { transform: translateX(0); filter: none; }
      40% { transform: translateX(-6px); filter: brightness(1.15); }
      100% { transform: translateX(0); filter: none; }
    }
    @keyframes birdHitRecoilEnemy {
      0% { transform: translateX(0); filter: none; }
      40% { transform: translateX(6px); filter: brightness(1.15); }
      100% { transform: translateX(0); filter: none; }
    }
    @keyframes birdStagger {
      0% { transform: translateY(0); }
      30% { transform: translateY(2px) rotate(-2deg); }
      70% { transform: translateY(-1px) rotate(1deg); }
      100% { transform: translateY(0) rotate(0deg); }
    }
    .sprite4.anim-idle {
      animation: birdIdleBreath 2.25s ease-in-out infinite;
      transform-origin: 50% 100%;
      will-change: transform;
    }
    .sprite4.anim-hover {
      animation: birdHoverFloat 1.8s ease-in-out infinite;
      transform-origin: 50% 100%;
      will-change: transform;
    }
    .sprite4.anim-idle.anim-hover {
      animation: birdIdleBreath 2.4s ease-in-out infinite, birdHoverFloat 1.8s ease-in-out infinite;
    }
    .sprite4.anim-attack-player {
      animation: birdAttackSnap 240ms ease-out 1;
      z-index: 2;
    }
    .sprite4.anim-attack-enemy {
      animation: birdAttackSnapEnemy 240ms ease-out 1;
      z-index: 2;
    }
    .sprite4.anim-hit-player {
      animation: birdHitRecoil 220ms ease-out 1, birdStagger 260ms ease-out 1;
      z-index: 2;
    }
    .sprite4.anim-hit-enemy {
      animation: birdHitRecoilEnemy 220ms ease-out 1, birdStagger 260ms ease-out 1;
      z-index: 2;
    }
  `;
  document.head.appendChild(style);

  const ctl = globalThis.__birdSpriteController || {};
  const baseEnsure = ctl.ensureSprite || function(who){
    return document.querySelector(`#${who}-avatar .sprite4`);
  };

  function normKey(k){ return String(k||'').toLowerCase().replace(/[^a-z]/g,''); }
  function isBossEnemy(e){
    const key = normKey(e?.birdKey || e?.id || e?.name);
    return BOSS_IDS.has(key) || /blakiston|duke/i.test(String(e?.name||''));
  }

  function getBirdKeyFor(who){
    if(who === 'player') return normKey(globalThis.G?.player?.birdKey || globalThis.G?.player?.name);
    return normKey(globalThis.G?.enemy?.birdKey || globalThis.G?.enemy?.id || globalThis.G?.enemy?.name);
  }

  function refreshAmbient(who){
    const spr = baseEnsure(who);
    if(!spr) return null;
    const key = getBirdKeyFor(who);
    spr.dataset.birdKey = key;
    spr.classList.add('anim-idle');
    if(FLYERS.has(key) && !/emu|kiwi|penguin/.test(key)) spr.classList.add('anim-hover');
    else spr.classList.remove('anim-hover');
    return spr;
  }

  function oneShotClass(spr, cls, ms){
    if(!spr) return;
    spr.classList.remove(cls);
    void spr.offsetWidth;
    spr.classList.add(cls);
    clearTimeout(spr._animTimerMap?.[cls]);
    spr._animTimerMap = spr._animTimerMap || {};
    spr._animTimerMap[cls] = setTimeout(() => spr.classList.remove(cls), ms);
  }

  function playAttackMotion(who){
    const spr = refreshAmbient(who);
    if(!spr) return;
    oneShotClass(spr, who === 'player' ? 'anim-attack-player' : 'anim-attack-enemy', 260);
  }

  function playHitMotion(who){
    const spr = refreshAmbient(who);
    if(!spr) return;
    oneShotClass(spr, who === 'player' ? 'anim-hit-player' : 'anim-hit-enemy', 280);
  }

  const oldRefresh = globalThis.refreshBattleUI;
  if(typeof oldRefresh === 'function'){
    globalThis.refreshBattleUI = function(){
      const out = oldRefresh.apply(this, arguments);
      try{
        refreshAmbient('player');
        refreshAmbient('enemy');
      }catch(_){}
      return out;
    };
  }

  const oldDoAttack = globalThis.doAttack;
  if(typeof oldDoAttack === 'function'){
    globalThis.doAttack = async function(attacker, target, result){
      try{
        playAttackMotion(attacker);
        setTimeout(() => playHitMotion(target), 115);
      }catch(_){}
      return await oldDoAttack.apply(this, arguments);
    };
  }

  const oldExec = globalThis.executeEnemyAction;
  if(typeof oldExec === 'function'){
    globalThis.executeEnemyAction = async function(act){
      try{
        if(act?.type === 'attack' || act?.type === 'strike' || act?.type === 'heavy' || act?.abilityId === 'eStun'){
          playAttackMotion('enemy');
        }
      }catch(_){}
      return await oldExec.apply(this, arguments);
    };
  }

  function personalityForEnemy(e){
    if(!e || isBossEnemy(e)) return null;
    const key = normKey(e.birdKey || e.id || e.name);
    const hpPct = (e?.stats?.hp || 1) / Math.max(1, (e?.stats?.maxHp || 1));
    const playerHpPct = ((globalThis.G?.player?.stats?.hp || 1) / Math.max(1, (globalThis.G?.player?.stats?.maxHp || 1)));

    if(hpPct <= 0.32 && !PREDATORS.has(key)) return 'defensive';
    if(playerHpPct <= 0.35 && (PREDATORS.has(key) || AGGRESSORS.has(key))) return 'predator';
    if(TRICKSTERS.has(key)) return 'trickster';
    if(DEFENSIVE.has(key)) return 'defensive';
    if(PREDATORS.has(key)) return 'predator';
    if(AGGRESSORS.has(key)) return 'aggressive';
    if(/pigeon|dove/.test(key)) return 'defensive';
    if(/raven|crow|magpie/.test(key)) return 'trickster';
    if(/hawk|falcon|eagle|owl/.test(key)) return 'predator';
    return null;
  }

  const oldPlanEnemyAction = globalThis.planEnemyAction;
  if(typeof oldPlanEnemyAction === 'function'){
    globalThis.planEnemyAction = function(){
      const e = globalThis.G?.enemy;
      if(!e || isBossEnemy(e)) return oldPlanEnemyAction.apply(this, arguments);
      const originalAiType = e.aiType;
      const originalAiStyle = e.aiStyle;
      const p = personalityForEnemy(e);
      if(p){
        e.aiPersonality = p;
        e.aiType = p;
      }
      const result = oldPlanEnemyAction.apply(this, arguments);
      if(result && p){
        result.personality = p;
        if(typeof result.label === 'string' && !result.label.includes('[')){
          const tag = p.charAt(0).toUpperCase() + p.slice(1);
          result.label = `[${tag}] ` + result.label;
        }
      }
      e.aiType = originalAiType;
      e.aiStyle = originalAiStyle;
      return result;
    };
  }

  globalThis.__birdSpritePolish = { refreshAmbient, playAttackMotion, playHitMotion, personalityForEnemy };
})();


// ===== 07_script_07.js =====

/* ============================================================
   PATCH: Unified size-class resolver
   - keeps one sizing decision across selection, ascent, and battle
   - preserves actual large/xl birds instead of collapsing them to medium
   ============================================================ */
(function(){
  globalThis.getUISizeClass = function(entity, context='general'){
    const key = String(entity?.portraitKey || entity?.birdKey || entity?.id || '').toLowerCase().replace(/[^a-z]/g,'');
    const sz = String(entity?.size || entity?.birdSize || '').toLowerCase();
    const isBoss = !!entity?.isBoss;
    if(isBoss && context==='battle') return 'boss';
    if(key === 'penguin') return 'xl';
    if(key === 'robin') return 'small';
    if(key === 'seagull') return 'medium';
    if(sz.includes('tiny')) return 'tiny';
    if(sz.includes('small')) return 'small';
    if(sz.includes('xlarge') || sz.includes('xl')) return 'xl';
    if(sz.includes('large')) return 'large';
    if(sz.includes('medium')) return 'medium';
    return 'medium';
  };
})();


// ===== 08_script_08.js =====

/* ===== FINAL PENGUIN RENDER PATCH ===== */
(function(){
  const spriteBirds = new Set([
    'sparrow','goose','blackbird','crow','macaw','robin','hummingbird','shoebill',
    'secretarybird','secretary','magpie','kookaburra','kiwi','penguin','flamingo','seagull',
    'swan','emu','bowerbird','raven','lyrebird','peregrine','snowyowl','toucan','dukeblakiston',
    'albatross','harpy','harpyeagle','baldeagle','blackcockatoo','ostrich','cassowary'
  ]);
  const norm = s => {
    const k = String(s || '').toLowerCase().replace(/[^a-z]/g,'');
    if(k === 'secretary') return 'secretarybird';
    if(k === 'harpyeagle') return 'harpy';
    return k;
  };

  globalThis.getUISizeClass = function(entity, context='general'){
    const key = norm(entity?.portraitKey || entity?.birdKey || entity?.id || '');
    const sz = String(entity?.size || entity?.birdSize || '').toLowerCase();
    if(entity?.isBoss && context === 'battle') return 'boss';
    if(key === 'penguin') return 'xl';
    if(key === 'robin') return 'small';
    if(key === 'seagull') return 'medium';
    if(sz.includes('tiny')) return 'tiny';
    if(sz.includes('small')) return 'small';
    if(sz.includes('xlarge') || sz.includes('xl')) return 'xl';
    if(sz.includes('large')) return 'large';
    if(sz.includes('medium')) return 'medium';
    return 'medium';
  };

  globalThis.renderBirdIconHTML = function(birdKey, sizeOrEntity, locked){
    const key = norm(birdKey);
    const entity = (sizeOrEntity && typeof sizeOrEntity === 'object') ? sizeOrEntity : { size: String(sizeOrEntity || 'medium') };
    let sizeClass = (typeof sizeOrEntity === 'string') ? sizeOrEntity : globalThis.getUISizeClass(entity, 'general');
    if(key === 'penguin') sizeClass = 'small';
    if(key === 'robin') sizeClass = 'small';
    if(key === 'seagull') sizeClass = 'medium';
    if(spriteBirds.has(key)){
      return '<div class="sprite4 ' + sizeClass + ' sprite-' + key + ' frame-0 ' + (locked ? 'locked' : '') + '"></div>';
    }
    const emo = (globalThis.PORTRAITS && (PORTRAITS[birdKey] || PORTRAITS[key])) || '';
    return '<div class="bird-emo">' + emo + '</div>';
  };

  if(globalThis.PORTRAITS){
    PORTRAITS.penguin = '<div class="sprite4 small sprite-penguin frame-0"></div>';
    PORTRAITS.duke_blakiston = '<div class="sprite4 boss sprite-dukeblakiston frame-0"></div>';
  }

  if(typeof globalThis.buildBirdCard === 'function'){
    const oldBuildBirdCard = globalThis.buildBirdCard;
    globalThis.buildBirdCard = function(key, bird, locked, globalMax){
      const card = oldBuildBirdCard.apply(this, arguments);
      try{
        const portrait = card.querySelector('.bird-portrait');
        if(!portrait) return card;
        const k = norm(key);
        if(!spriteBirds.has(k)) return card;
        const sizeClass = globalThis.getUISizeClass(bird, 'select');
        portrait.innerHTML = globalThis.renderBirdIconHTML(k, sizeClass, locked);
      }catch(e){}
      return card;
    };
  }

  if(typeof globalThis.renderEntityAvatarHTML === 'function'){
    globalThis.renderEntityAvatarHTML = function(entity, context='battle', locked=false){
      const key = entity?.portraitKey || entity?.birdKey || entity?.id || '';
      const sizeClass = globalThis.getUISizeClass(entity, context);
      const k = norm(key);
      if(spriteBirds.has(k)){
        return '<div class="sprite4 ' + sizeClass + ' sprite-' + k + ' frame-0 ' + (locked ? 'locked' : '') + '"></div>';
      }
      if(globalThis.PORTRAITS && (PORTRAITS[key] || PORTRAITS[norm(key)])){
        return (PORTRAITS[key] || PORTRAITS[norm(key)]);
      }
      return '<div class="bird-emo">' + (entity?.emoji || '') + '</div>';
    };
  }

  const oldUpdateAscentPanel = globalThis.updateAscentPanel;
  if(typeof oldUpdateAscentPanel === 'function'){
    globalThis.updateAscentPanel = function(key){
      oldUpdateAscentPanel.apply(this, arguments);
      try{
        const bird = globalThis.BIRDS?.[key];
        const panelPortrait = document.querySelector('.ascent-panel-portrait');
        if(bird && panelPortrait && spriteBirds.has(norm(key))){
          panelPortrait.innerHTML = globalThis.renderBirdIconHTML(key, globalThis.getUISizeClass(bird, 'panel'), false);
        }
      }catch(e){}
    };
  }

  try{
    if(typeof globalThis.initSelectionSafe === 'function') globalThis.initSelectionSafe();
    else if(typeof globalThis.initSelection === 'function') globalThis.initSelection();
  }catch(e){}
})();
