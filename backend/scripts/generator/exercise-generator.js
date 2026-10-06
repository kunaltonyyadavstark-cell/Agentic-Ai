#!/usr/bin/env node
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('exercises-data.json', 'utf8'));

const languages = [
  { key: 'python', name: 'python' },
  { key: 'javascript', name: 'javascript' },
  { key: 'java', name: 'java' },
  { key: 'cpp', name: 'cpp' }
];

let output = `// backend/scripts/exercises/python-workbook-chapter1.ts\n`;
output += `// Python Workbook - Chapter ${data.chapter}: ${data.exercises.length} exercises × 4 languages = ${data.exercises.length * 4} records\n\n`;
output += `export const pythonWorkbookChapter1 = [\n`;

data.exercises.forEach((exercise) => {
  languages.forEach((lang) => {
    const starterCode = exercise.starterCode[lang.key] || exercise.starterCode.python;
    
    output += `  {\n`;
    output += `    title: 'Python Workbook Ch1-Ex${exercise.number}: ${exercise.title}',\n`;
    output += `    description: '${exercise.description}',\n`;
    output += `    difficulty: '${exercise.difficulty}',\n`;
    output += `    language: '${lang.name}',\n`;
    output += `    category: '${exercise.category}',\n`;
    output += `    keywords: ['python-workbook', 'chapter-1'],\n`;
    output += `    tags: ['python-workbook', 'chapter-1', 'exercise-${exercise.number}'],\n`;
    output += `    testCases: ${JSON.stringify(exercise.testCases)},\n`;
    output += `    solution: "${exercise.solutions[lang.key]}",\n`;
    output += `    starterCode: "${starterCode}",\n`;
    output += `    hints: ${JSON.stringify(exercise.hints)}\n`;
    output += `  },\n`;
  });
});

output += `];\n`;

fs.writeFileSync('python-workbook-chapter1.ts', output);

console.log('✅ File generated: python-workbook-chapter1.ts');
console.log(`📊 Total exercises: ${data.exercises.length}`);
console.log(`📦 Total records: ${data.exercises.length * 4}`);
console.log(`📄 Lines generated: ${output.split('\n').length}`);
