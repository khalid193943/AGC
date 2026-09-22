import fs from 'fs';

let content = fs.readFileSync('src/constants.ts', 'utf8');

const replacements = [
  ['Mme. Guessous', 'Mme. Kaderi'],
  ['Mrs. Guessous', 'Mrs. Kaderi'],
  ['Mme. Tazi', 'Mme. El Mrini'],
  ['Mrs. Tazi', 'Mrs. El Mrini'],
  ['M. Kabbaj', 'M. Majdi'],
  ['Mr. Kabbaj', 'Mr. Majdi'],
  ['M. Chraibi', 'M. El Alaoui'],
  ['Mr. Chraibi', 'Mr. El Alaoui'],
  ['Mme. Bennani', 'Mme. Rehhal'],
  ['Mrs. Bennani', 'Mrs. Rehhal'],
  ['Bennani', 'Rehhal'],
  ['Guessous', 'Kaderi'],
  ['Tazi', 'El Mrini'],
  ['Kabbaj', 'Majdi'],
  ['Chraibi', 'El Alaoui'],
  ['Sqali', 'Dehbi Alaoui']
];

for (const [search, replace] of replacements) {
    content = content.replaceAll(search, replace);
}

fs.writeFileSync('src/constants.ts', content);
console.log("Done");
