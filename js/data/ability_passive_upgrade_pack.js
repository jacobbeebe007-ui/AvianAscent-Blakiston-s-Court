/*
 * Ability / Passive / Upgrade Pack
 * --------------------------------
 * Data-only definitions designed to be consumed by runtime wiring.
 * This file intentionally does not mutate global combat state.
 */
(function(){
  const ABILITY_TAGS = Object.freeze({
    BASIC: 'basic',
    PHYSICAL: 'physical',
    SPELL: 'spell',
    UTILITY: 'utility',
    DOT: 'dot',
    CONTROL: 'control',
    DEFENSIVE: 'defensive',
    OFFENSIVE: 'offensive'
  });

  const STATUS_GLOSSARY = Object.freeze({
    poison: 'Damage over time. Stacks and ticks each turn.',
    bleed: 'Physical damage over time. Stacks and ticks each turn.',
    weaken: 'Reduces outgoing damage and dodge.',
    paralyzed: 'Chance to lose actions for a short duration.',
    burning: 'Increases hit/crit pressure on affected unit.',
    chilled: 'Speed-reducing cold debuff.',
    delayed: 'Stored damage that detonates next turn.',
    feared: 'Mental break effect that can force failed actions.',
    confused: 'Action disruption and skip chance.'
  });

  const ABILITY_DEFS = Object.freeze({
    rapidPeck: {
      id: 'rapidPeck',
      name: 'Rapid Peck',
      tags: [ABILITY_TAGS.BASIC, ABILITY_TAGS.PHYSICAL, ABILITY_TAGS.OFFENSIVE],
      role: 'striker opener',
      notes: 'Multi-hit basic with high upside and chain-stop risk.'
    },
    dart: {
      id: 'dart',
      name: 'Dart',
      tags: [ABILITY_TAGS.BASIC, ABILITY_TAGS.PHYSICAL],
      role: 'predator strike',
      notes: 'Stable attack profile with light weaken pressure.'
    },
    evade: {
      id: 'evade',
      name: 'Evade',
      tags: [ABILITY_TAGS.UTILITY, ABILITY_TAGS.DEFENSIVE],
      role: 'survivability',
      notes: 'Temporary dodge buff and anti-control scaling.'
    },
    dirge: {
      id: 'dirge',
      name: 'Dirge',
      tags: [ABILITY_TAGS.SPELL, ABILITY_TAGS.CONTROL],
      role: 'support control song',
      notes: 'Confusion and paralysis pressure over multiple turns.'
    },
    lullaby: {
      id: 'lullaby',
      name: 'Lullaby',
      tags: [ABILITY_TAGS.SPELL, ABILITY_TAGS.CONTROL],
      role: 'trickster debuff song',
      notes: 'ATK suppression with delayed resonance payload.'
    }
  });

  const PASSIVE_IMPL = Object.freeze({
    swiftLearner: {
      id: 'swiftLearner',
      name: 'Swift Learner',
      description: 'Gain bonus progression from encounters.',
      hook: 'post_battle_rewards'
    },
    ironFeathers: {
      id: 'ironFeathers',
      name: 'Iron Feathers',
      description: 'Reduce incoming physical damage.',
      hook: 'on_receive_hit'
    },
    venomProof: {
      id: 'venomProof',
      name: 'Venom Proof',
      description: 'Poison immunity / mitigation passive.',
      hook: 'on_apply_status'
    }
  });

  const UPGRADE_LINES = Object.freeze({
    striker: ['rapidPeck', 'dart', 'evade'],
    trickster: ['dirge', 'lullaby', 'evade'],
    vanguard: ['dart', 'evade']
  });

  const PACK_NOTES = Object.freeze({
    version: '1.0.0',
    mode: 'data-only',
    integration: 'pending-runtime-wiring',
    guarantees: [
      'No side effects during load',
      'No overrides of combat methods',
      'Safe to import before or after content.js'
    ]
  });

  const PACK = Object.freeze({
    ABILITY_TAGS,
    STATUS_GLOSSARY,
    ABILITY_DEFS,
    PASSIVE_IMPL,
    UPGRADE_LINES,
    PACK_NOTES
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PACK;
  }

  globalThis.ABILITY_PASSIVE_UPGRADE_PACK = PACK;
})();
