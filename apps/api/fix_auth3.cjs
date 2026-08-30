const fs = require('fs');
let code = fs.readFileSync('src/controllers/auth.controller.js', 'utf8');

// I will just read every line, and if a line contains throw new AppError('...', we will replace single quotes.
let lines = code.split('\n');
for (let i=0; i<lines.length; i++) {
  if (lines[i].includes('throw new AppError(')) {
    // replace any single quote with double quote, except those escaped.
    // simpler: just remove backslashes and wrap in double quotes manually for known bad strings:
    lines[i] = lines[i].replace(/'Oldin tasdiqlash jarayonidan o\\+[']ting'/g, `"Oldin tasdiqlash jarayonidan o'ting"`);
    lines[i] = lines[i].replace(/'Parol xato yoki akkaunt topilmadi'/g, `"Parol xato yoki akkaunt topilmadi"`);
    lines[i] = lines[i].replace(/'Parol kamida 8 ta belgidan iborat bo\\+[']lishi kerak'/g, `"Parol kamida 8 ta belgidan iborat bo'lishi kerak"`);
    lines[i] = lines[i].replace(/'Kod eskirgan, qayta so\\+[']rov bering'/g, `"Kod eskirgan, qayta so'rov bering"`);
    lines[i] = lines[i].replace(/'Ushbu email ro\\+[']yxatdan o\\+[']tgan'/g, `"Ushbu email ro'yxatdan o'tgan"`);
    lines[i] = lines[i].replace(/'Sizda admin huquqi yo\\+[']q'/g, `"Sizda admin huquqi yo'q"`);
  }
}

code = lines.join('\n');
fs.writeFileSync('src/controllers/auth.controller.js', code);
