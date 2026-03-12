# Data Pack Contracts

## Ability metadata parity contract

`scripts/ci-check.js` enforces a parity contract between:

- runtime ability templates: `Object.keys(ABILITY_TEMPLATES + ABILITY_TEMPLATES_EXTRA)` (sourced from `js/core/game.js`), and
- metadata entries: `Object.keys(ABILITY_PASSIVE_UPGRADE_PACK.ABILITY_DEFS)` (from `js/data/ability_passive_upgrade_pack.js`).

The report is categorized into:

- **missing metadata entries**: ability templates that do not have metadata,
- **orphan metadata entries**: metadata ids that do not map to any template,
- **required field gaps**: metadata entries missing any of `tags`, `role`, or `notes`.

## CI/dev behavior

- **Dev mode warning**: when `NODE_ENV` is not `production`, parity mismatches are printed as warnings.
- **Strict mode failure**: CI only fails when strict mode is explicitly enabled with either:
  - `CI_STRICT_PARITY=1`, or
  - `ABILITY_PARITY_STRICT=1`.

This allows incremental metadata backfilling while still supporting hard-gate validation in stricter pipelines.
