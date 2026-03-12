# Ability Tags, Kit Plan, and Swap Recommendations

## Energy model used for this balance pass

| Bird Size | Starting EN | Max EN |
|---|---:|---:|
| Small | 5 | 8 |
| Medium | 4 | 7 |
| Large | 2 | 5 |
| X-Large | 2 | 5 |

Design implication:
- Small = tempo/spam-friendly
- Large/XL = efficient heavy-value casts

---

## 1) Final Displayable Ability Tag Set

- `BASIC` reliable low-cost attack
- `HEAVY` high damage strike
- `SPELL` MATK scaling ability
- `UTILITY` buff / tactical effect
- `CONTROL` fear, stun, debuff
- `GUARD` defensive skill
- `HEAL` restore HP
- `MULTI` multiple hits
- `FINISH` stronger vs low HP
- `SIGNATURE` species-defining ability

---

## 2) Ability → Tag Assignments (canonical mapping used)

- Peck / Rapid Peck: `[BASIC]`
- Talon Strike: `[HEAVY]`
- Wind Slash: `[SPELL]`
- Shriekwave: `[SPELL][CONTROL]`
- Murder Murmuration: `[MULTI][SIGNATURE]`
- Stick Lance: `[HEAVY][SIGNATURE]`
- Mud Lash: `[SPELL][CONTROL][SIGNATURE]`
- Sit and Wait: `[UTILITY][CONTROL][SIGNATURE]`
- Owl's Psyche: `[SPELL][CONTROL][SIGNATURE]`
- Shoebill Clamp: `[HEAVY][CONTROL][SIGNATURE]`
- Fish Snatcher: `[UTILITY][HEAL][SIGNATURE]`
- Roost: `[HEAL]`
- Preen: `[UTILITY][HEAL]`
- Defend / Guard: `[GUARD]`
- Evade / Grace Step / Feather Flick: `[UTILITY]`
- Intimidate / Threat Display: `[CONTROL]`
- Victory Chant / Battle Chirp / Battle Focus: `[UTILITY]`
- Dread Call: `[SPELL][CONTROL]`

---

## 3) Bird-by-bird starting kit rewrites (target)

- Sparrow: Peck, Talon Strike, Battle Chirp, Wind Slash
- Crow: Peck, Murder Murmuration, Dread Call, Battle Focus
- Magpie: Peck, Steal Shine, Feather Flick, Dart
- Seagull: Peck, Dive Snatch, Wind Slash, Mob Swarm
- Flamingo: Peck, Mud Lash, Preen, Grace Step
- Goose: Peck, Honk Terror, Guard, Heavy Talon
- Emperor Penguin: Peck, Ice Guard, Body Slam, Rally Call
- Ostrich: Kick, Trample, Guard, Threat Display
- Emu: Kick, Savage Kick, Threat Display, Dust Kick
- Cassowary: Raptor Kick, Raptor Kick Frenzy, Intimidating Stare, Guard
- Bald Eagle: Peck, Sky Strike, Focus Sight, Wind Slash
- Secretary Bird: Peck, Stick Lance, Battle Rhythm, Guard
- Toucan: Peck, Fruit Bomb, Taunt, Preen
- Shoebill: Peck, Shoebill Clamp, Sit and Wait, Fish Snatcher

---

## 4) Exact swap/replacement recommendations

- Remove **Roost** from Goose and Ostrich (replace with Guard)
- Remove **Intimidate** from Penguin/Cassowary/Emu (replace with Threat Display)
- Remove **Shriekwave** from Magpie and Seagull
- Remove **Owl's Psyche** from Toucan (replace with Fruit Bomb)
- Remove generic **Defend** from Bald Eagle and Secretary Bird (replace with aggressive utility)

---

## 5) New species-specific abilities to add next

- Fruit Bomb (Toucan) `[SPELL][SIGNATURE]`
- Honk Terror (Goose) `[CONTROL][SIGNATURE]`
- Dive Snatch (Seagull) `[UTILITY][SIGNATURE]`
- Savage Kick (Emu) `[HEAVY][SIGNATURE]`
- Sky Strike (Eagle) `[HEAVY][SIGNATURE]`
- Raptor Kick Frenzy (Cassowary) `[HEAVY][MULTI][SIGNATURE]`
