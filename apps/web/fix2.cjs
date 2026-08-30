const fs = require('fs');
let brands = fs.readFileSync('src/pages/admin/Brands.jsx', 'utf8');
brands = brands.replace(/initialValues\.current = \{ name: brand\.name, logoUrl: brand\.logoUrl \|\| '' \};/g, "setInitialValues({ name: brand.name, logoUrl: brand.logoUrl || '' });");
fs.writeFileSync('src/pages/admin/Brands.jsx', brands);
console.log('Fixed initialValues in openEdit');
