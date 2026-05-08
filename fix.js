import fs from 'fs';

function fixContrast(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/text-slate-400/g, 'text-slate-500');
  code = code.replace(/text-slate-300/g, 'text-slate-400');
  fs.writeFileSync(file, code);
}

fixContrast('src/components/CVForm.tsx');
fixContrast('src/App.tsx');
console.log('Fixed contrast');
