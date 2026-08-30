const fs = require('fs');
let code = fs.readFileSync('src/controllers/auth.controller.js', 'utf8');

// The original file probably had something like 'Kod noto\'g\'ri' inside a single quote, which is invalid.
code = code.replace(/'Kod noto\\'g\\'ri'/g, `"Kod noto'g'ri"`);
code = code.replace(/'Maxfiy so\\'z noto\\'g\\'ri'/g, `"Maxfiy so'z noto'g'ri"`);
code = code.replace(/'Noto\\'g\\'ri joriy parol'/g, `"Noto'g'ri joriy parol"`);

fs.writeFileSync('src/controllers/auth.controller.js', code);
