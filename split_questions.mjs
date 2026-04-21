import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Dynamic import the questions module
const { DISCOVERY_QUESTION_BANK, ICP_FIT_MATRIX, FIT_DIALOGUE } = 
  await import('./js/questions.js');

const industries = Object.keys(DISCOVERY_QUESTION_BANK);

// Fix ICP matrix — construction/tech_company should be 0 (no fit), not 2
// Also fix other unrealistic combos
const fixedMatrix = JSON.parse(JSON.stringify(ICP_FIT_MATRIX));

// Construction selling to tech companies, financial services = poor fit
fixedMatrix.construction.tech_company = 0;
fixedMatrix.construction.financial_services = 1;

// Auto services selling to tech, financial, healthcare = poor fit  
fixedMatrix.auto.tech_company = 0;
fixedMatrix.auto.financial_services = 0;
fixedMatrix.auto.healthcare = 1;

// Marketing agency selling to healthcare, trades = weak
fixedMatrix.marketing.healthcare = 1;
fixedMatrix.marketing.trades_contractor = 1;

// Law selling to retail_food = poor
fixedMatrix.law.retail_food = 1;

// Health services selling to financial, tech = poor
fixedMatrix.health.tech_company = 0;
fixedMatrix.health.financial_services = 0;

// Write one file per industry
for (const ind of industries) {
  const content = `export const QUESTIONS = ${JSON.stringify(DISCOVERY_QUESTION_BANK[ind])};\n`;
  const path = join(__dirname, 'js', `q_${ind}.js`);
  writeFileSync(path, content);
  const kb = Math.round(Buffer.byteLength(content) / 1024);
  console.log(`q_${ind}.js: ${kb}KB`);
}

// Write shared file with fixed matrix + fit dialogue
const shared = `export const ICP_FIT_MATRIX = ${JSON.stringify(fixedMatrix)};\nexport const FIT_DIALOGUE = ${JSON.stringify(FIT_DIALOGUE)};\n`;
writeFileSync(join(__dirname, 'js', 'q_shared.js'), shared);
console.log(`q_shared.js: ${Math.round(Buffer.byteLength(shared)/1024)}KB`);

console.log('Done. 10 files written.');
