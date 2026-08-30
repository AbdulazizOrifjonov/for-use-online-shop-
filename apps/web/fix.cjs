const fs = require('fs');

// 1. cartStore.js
let cart = fs.readFileSync('src/store/cartStore.js', 'utf8');
cart = cart.replace('set, get', 'set');
fs.writeFileSync('src/store/cartStore.js', cart);

// 2. PhoneVerify.jsx
let phone = fs.readFileSync('src/pages/auth/PhoneVerify.jsx', 'utf8');
phone = phone.replace(/const { t, i18n } = useTranslation\(\);\n?/, '');
phone = phone.replace(/import { useTranslation } from 'react-i18next';\n?/, '');
fs.writeFileSync('src/pages/auth/PhoneVerify.jsx', phone);

// 3. AccountReviews.jsx
let acct = fs.readFileSync('src/pages/account/AccountReviews.jsx', 'utf8');
let fetchPendingFunc = acct.match(/function fetchPending\(\) \{[\s\S]*?\}\n/);
if (fetchPendingFunc) {
  acct = acct.replace(fetchPendingFunc[0], '');
  acct = acct.replace('useEffect(() => {', fetchPendingFunc[0] + '\n  useEffect(() => {');
}
acct = acct.replace(/MessageSquare, /g, '');
fs.writeFileSync('src/pages/account/AccountReviews.jsx', acct);

// 4. Brands.jsx
let brands = fs.readFileSync('src/pages/admin/Brands.jsx', 'utf8');
brands = brands.replace(/const initialValues = useRef\(\{.*?\}\);/g, "const [initialValues, setInitialValues] = useState({ name: '', logoUrl: '' });");
brands = brands.replace(/initialValues\.current = \{ name: b\.name, logoUrl: b\.logoUrl \|\| '' \};/g, "setInitialValues({ name: b.name, logoUrl: b.logoUrl || '' });");
brands = brands.replace(/initialValues\.current = \{ name: '', logoUrl: '' \};/g, "setInitialValues({ name: '', logoUrl: '' });");
brands = brands.replace(/initialValues\.current\.name/g, 'initialValues.name');
brands = brands.replace(/initialValues\.current\.logoUrl/g, 'initialValues.logoUrl');
fs.writeFileSync('src/pages/admin/Brands.jsx', brands);
console.log('Fixed simple lint errors');
