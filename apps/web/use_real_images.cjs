const fs = require('fs');

const file1 = 'src/pages/ProductDetail.jsx';
let content = fs.readFileSync(file1, 'utf8');

// Replace text-based logos with img tags
content = content.replace(/const UzcardLogo = \(\) => <span.*?>UZCARD<\/span>;/g, 'const UzcardLogo = () => <img src="https://uzcard.uz/images/logo.png" alt="Uzcard" className="h-6 object-contain" />;');
content = content.replace(/const HumoLogo = \(\) => <span.*?>HUMO<\/span>;/g, 'const HumoLogo = () => <img src="/logos/humo.png" alt="Humo" className="h-5 object-contain" />;');
content = content.replace(/const VisaLogo = \(\) => <span.*?>VISA<\/span>;/g, 'const VisaLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 object-contain" onError={(e) => { e.target.src="https://cdn.iconscout.com/icon/free/png-256/visa-3-225544.png" }} />;');
content = content.replace(/const ClickLogo = \(\) => <span.*?>CLICK<\/span>;/g, 'const ClickLogo = () => <img src="/logos/click.png" alt="Click" className="h-5 object-contain" />;');
content = content.replace(/const PaymeLogo = \(\) => <span.*?>Payme<\/span>;/g, 'const PaymeLogo = () => <img src="https://cdn.paycom.uz/logo/payme_color.svg" alt="Payme" className="h-5 object-contain" onError={(e) => { e.target.src="https://payme.uz/assets/images/logo.png" }} />;');
content = content.replace(/const MastercardLogo = \(\) => \(<div.*?>.*?<\/div>\);/g, 'const MastercardLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 object-contain" onError={(e) => { e.target.src="https://cdn.iconscout.com/icon/free/png-256/mastercard-3521564-2944982.png" }} />;');

fs.writeFileSync(file1, content);

const file2 = 'src/components/layout/Footer.jsx';
let content2 = fs.readFileSync(file2, 'utf8');

content2 = content2.replace(/const UzcardLogo = \(\) => <span.*?>UZCARD<\/span>;/g, 'const UzcardLogo = () => <img src="https://uzcard.uz/images/logo.png" alt="Uzcard" className="h-5 object-contain" />;');
content2 = content2.replace(/const HumoLogo = \(\) => <span.*?>HUMO<\/span>;/g, 'const HumoLogo = () => <img src="/logos/humo.png" alt="Humo" className="h-4 object-contain" />;');
content2 = content2.replace(/const VisaLogo = \(\) => <span.*?>VISA<\/span>;/g, 'const VisaLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 object-contain" onError={(e) => { e.target.src="https://cdn.iconscout.com/icon/free/png-256/visa-3-225544.png" }} />;');
content2 = content2.replace(/const ClickLogo = \(\) => <span.*?>CLICK<\/span>;/g, 'const ClickLogo = () => <img src="/logos/click.png" alt="Click" className="h-4 object-contain" />;');
content2 = content2.replace(/const PaymeLogo = \(\) => <span.*?>Payme<\/span>;/g, 'const PaymeLogo = () => <img src="https://cdn.paycom.uz/logo/payme_color.svg" alt="Payme" className="h-4 object-contain" onError={(e) => { e.target.src="https://payme.uz/assets/images/logo.png" }} />;');
content2 = content2.replace(/const MastercardLogo = \(\) => \(<div.*?>.*?<\/div>\);/g, 'const MastercardLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 object-contain" onError={(e) => { e.target.src="https://cdn.iconscout.com/icon/free/png-256/mastercard-3521564-2944982.png" }} />;');

fs.writeFileSync(file2, content2);
