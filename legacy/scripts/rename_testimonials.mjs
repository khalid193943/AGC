import fs from 'fs';

const path = 'src/constants.ts';
let code = fs.readFileSync(path, 'utf8');

const replacements = [
  { old: 'Mme. Alami', new: 'Mme. Berrada' },
  { old: 'M. Benjelloun', new: 'M. Benjelloun' },
  { old: 'Mme. Tazi', new: 'Mme. Tazi' },
  { old: 'M. Mansouri', new: 'M. Kabbaj' },
  { old: 'Mme. Idrissi', new: 'Mme. Idrissi' },
  { old: 'M. Chraibi', new: 'M. Chraibi' },
  { old: 'Mme. Bennani', new: 'Mme. Bennani' },
  { old: 'M. Filali', new: 'M. Lahlou' },
  { old: 'Mme. Amrani', new: 'Mme. Guessous' },
  { old: 'M. Naciri', new: 'M. Squalli' },

  { old: 'Mrs. Alami', new: 'Mrs. Berrada' },
  { old: 'Mr. Benjelloun', new: 'Mr. Benjelloun' },
  { old: 'Mrs. Tazi', new: 'Mrs. Tazi' },
  { old: 'Mr. Mansouri', new: 'Mr. Kabbaj' },
  { old: 'Mrs. Idrissi', new: 'Mrs. Idrissi' },
  { old: 'Mr. Chraibi', new: 'Mr. Chraibi' },
  { old: 'Mrs. Bennani', new: 'Mrs. Bennani' },
  { old: 'Mr. Filali', new: 'Mr. Lahlou' },
  { old: 'Mrs. Amrani', new: 'Mrs. Guessous' },
  { old: 'Mr. Naciri', new: 'Mr. Squalli' }
];

for (const rep of replacements) {
  // Replace all occurrences of old with new
  code = code.split(rep.old).join(rep.new);
}

fs.writeFileSync(path, code);
