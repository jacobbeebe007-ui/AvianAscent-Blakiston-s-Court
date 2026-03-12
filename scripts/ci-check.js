#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const STRICT_PARITY = process.env.CI_STRICT_PARITY === '1' || process.env.ABILITY_PARITY_STRICT === '1';
const IS_DEV_MODE = process.env.NODE_ENV !== 'production';

function fail(msg){
  console.error(msg);
  process.exitCode = 1;
}

function parseJs(file){
  const src = fs.readFileSync(file, 'utf8');
  try { new Function(src); }
  catch (e) { fail(`JS parse failed: ${file}\n${e.message}`); }
}

function checkSpriteRefs(cssFile){
  const css = fs.readFileSync(cssFile, 'utf8');
  const re = /background-image\s*:\s*url\("\.\.\/assets\/sprites\/([^)"']+)"\)/g;
  let m;
  while((m = re.exec(css))){
    const sprite = m[1];
    const full = path.join('assets','sprites',sprite);
    if(!fs.existsSync(full)) fail(`Missing sprite referenced in ${cssFile}: ${full}`);
  }
}

function extractObjectLiteralAfterMarker(src, marker){
  const markerIdx = src.indexOf(marker);
  if(markerIdx === -1) return null;
  const openIdx = src.indexOf('{', markerIdx);
  if(openIdx === -1) return null;

  let depth = 0;
  let inString = false;
  let stringQuote = '';
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for(let i = openIdx; i < src.length; i++){
    const ch = src[i];
    const next = src[i + 1];

    if(inLineComment){
      if(ch === '\n') inLineComment = false;
      continue;
    }

    if(inBlockComment){
      if(ch === '*' && next === '/'){
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if(inString){
      if(escaped){
        escaped = false;
      }else if(ch === '\\'){
        escaped = true;
      }else if(ch === stringQuote){
        inString = false;
        stringQuote = '';
      }
      continue;
    }

    if(ch === '/' && next === '/'){
      inLineComment = true;
      i++;
      continue;
    }
    if(ch === '/' && next === '*'){
      inBlockComment = true;
      i++;
      continue;
    }
    if(ch === '"' || ch === '\'' || ch === '`'){
      inString = true;
      stringQuote = ch;
      continue;
    }

    if(ch === '{') depth++;
    if(ch === '}'){
      depth--;
      if(depth === 0) return src.slice(openIdx, i + 1);
    }
  }

  return null;
}

function extractTopLevelObjectKeys(objectLiteralSrc){
  if(!objectLiteralSrc) return [];
  const keys = [];
  let depth = 0;
  let inString = false;
  let stringQuote = '';
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for(let i = 0; i < objectLiteralSrc.length; i++){
    const ch = objectLiteralSrc[i];
    const next = objectLiteralSrc[i + 1];

    if(inLineComment){
      if(ch === '\n') inLineComment = false;
      continue;
    }
    if(inBlockComment){
      if(ch === '*' && next === '/'){
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if(inString){
      if(escaped){
        escaped = false;
      }else if(ch === '\\'){
        escaped = true;
      }else if(ch === stringQuote){
        inString = false;
        stringQuote = '';
      }
      continue;
    }

    if(ch === '/' && next === '/'){
      inLineComment = true;
      i++;
      continue;
    }
    if(ch === '/' && next === '*'){
      inBlockComment = true;
      i++;
      continue;
    }
    if(ch === '"' || ch === '\'' || ch === '`'){
      inString = true;
      stringQuote = ch;
      continue;
    }

    if(ch === '{'){
      depth++;
      continue;
    }
    if(ch === '}'){
      depth--;
      continue;
    }

    if(depth !== 1) continue;

    if(/[A-Za-z_$]/.test(ch)){
      let j = i + 1;
      while(j < objectLiteralSrc.length && /[A-Za-z0-9_$]/.test(objectLiteralSrc[j])) j++;
      const ident = objectLiteralSrc.slice(i, j);
      let k = j;
      while(k < objectLiteralSrc.length && /\s/.test(objectLiteralSrc[k])) k++;
      if(objectLiteralSrc[k] === ':') keys.push(ident);
      i = j - 1;
      continue;
    }

    if(ch === '"' || ch === '\''){
      let j = i + 1;
      let str = '';
      while(j < objectLiteralSrc.length){
        const c = objectLiteralSrc[j];
        if(c === '\\'){
          str += c + (objectLiteralSrc[j+1] || '');
          j += 2;
          continue;
        }
        if(c === ch) break;
        str += c;
        j++;
      }
      let k = j + 1;
      while(k < objectLiteralSrc.length && /\s/.test(objectLiteralSrc[k])) k++;
      if(objectLiteralSrc[k] === ':') keys.push(str);
      i = j;
    }
  }

  return Array.from(new Set(keys));
}

function getTemplateAbilityIds(){
  const gameSrc = fs.readFileSync(path.join('js','core','game.js'), 'utf8');
  const baseObj = extractObjectLiteralAfterMarker(gameSrc, 'const ABILITY_TEMPLATES =');
  const extraObj = extractObjectLiteralAfterMarker(gameSrc, 'const ABILITY_TEMPLATES_EXTRA =');
  if(!baseObj || !extraObj) return { ids: [], parseError: 'Could not parse ABILITY_TEMPLATES blocks from js/core/game.js' };

  const ids = new Set([
    ...extractTopLevelObjectKeys(baseObj),
    ...extractTopLevelObjectKeys(extraObj)
  ]);
  return { ids: Array.from(ids), parseError: null };
}

function runAbilityMetadataParityCheck(){
  const pack = require(path.join('..','js','data','ability_passive_upgrade_pack.js'));
  const abilityDefs = (pack && pack.ABILITY_DEFS) || {};
  const metadataIds = Object.keys(abilityDefs);
  const { ids: templateIds, parseError } = getTemplateAbilityIds();

  if(parseError){
    fail(`Ability parity parse error: ${parseError}`);
    return;
  }

  const templateSet = new Set(templateIds);
  const metadataSet = new Set(metadataIds);

  const missingMetadataEntries = templateIds.filter(id => !metadataSet.has(id)).sort();
  const orphanMetadataEntries = metadataIds.filter(id => !templateSet.has(id)).sort();

  const requiredFieldGaps = [];
  for(const id of metadataIds){
    const entry = abilityDefs[id] || {};
    const missing = [];
    if(!Array.isArray(entry.tags) || entry.tags.length === 0) missing.push('tags');
    if(typeof entry.role !== 'string' || !entry.role.trim()) missing.push('role');
    if(typeof entry.notes !== 'string' || !entry.notes.trim()) missing.push('notes');
    if(missing.length) requiredFieldGaps.push({ id, fields: missing });
  }

  const hasIssues = missingMetadataEntries.length || orphanMetadataEntries.length || requiredFieldGaps.length;
  if(!hasIssues) return;

  const lines = [
    'Ability metadata parity report:',
    `- missing metadata entries (${missingMetadataEntries.length}): ${missingMetadataEntries.join(', ') || 'none'}`,
    `- orphan metadata entries (${orphanMetadataEntries.length}): ${orphanMetadataEntries.join(', ') || 'none'}`,
    `- required field gaps (${requiredFieldGaps.length}): ${requiredFieldGaps.map(g => `${g.id}[${g.fields.join(',')}]`).join(', ') || 'none'}`
  ];

  if(IS_DEV_MODE && !STRICT_PARITY){
    console.warn(lines.join('\n'));
  }

  if(STRICT_PARITY){
    fail(lines.join('\n'));
  }
}

['js/core/game.js','js/data/content.js','js/systems/systems.js','js/systems/shop.js'].forEach(f=>{
  if(fs.existsSync(f)) parseJs(f);
});

['css/main.css','css/sprites.css'].forEach(f=>{
  if(fs.existsSync(f)) checkSpriteRefs(f);
});

runAbilityMetadataParityCheck();

if(process.exitCode){
  process.exit(process.exitCode);
}
console.log('ci-check: OK');
