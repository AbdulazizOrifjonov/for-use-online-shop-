const fs = require('fs');

const file1 = 'src/pages/ProductDetail.jsx';
let content = fs.readFileSync(file1, 'utf8');

// Replace the garbage SVG components with text-based ones
content = content.replace(/const UzcardLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const UzcardLogo = () => <span className="font-bold text-[#005187] tracking-tight italic text-lg">UZCARD</span>;');
content = content.replace(/const HumoLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const HumoLogo = () => <span className="font-bold text-[#F2B705] tracking-tight text-lg">HUMO</span>;');
content = content.replace(/const VisaLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const VisaLogo = () => <span className="font-bold text-[#1434CB] italic tracking-tighter text-lg">VISA</span>;');
content = content.replace(/const ClickLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const ClickLogo = () => <span className="font-bold text-[#00A1E6] tracking-tight text-lg">CLICK</span>;');
content = content.replace(/const PaymeLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const PaymeLogo = () => <span className="font-bold text-[#35C6A7] tracking-tight text-lg">Payme</span>;');
content = content.replace(/const MastercardLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const MastercardLogo = () => (<div className="flex -space-x-1.5 items-center justify-center"><div className="w-4 h-4 rounded-full bg-[#EB001B] mix-blend-multiply"></div><div className="w-4 h-4 rounded-full bg-[#F79E1B] mix-blend-multiply"></div></div>);');

fs.writeFileSync(file1, content);

const file2 = 'src/components/layout/Footer.jsx';
let content2 = fs.readFileSync(file2, 'utf8');

content2 = content2.replace(/const UzcardLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const UzcardLogo = () => <span className="font-bold text-white tracking-tight italic text-sm">UZCARD</span>;');
content2 = content2.replace(/const HumoLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const HumoLogo = () => <span className="font-bold text-[#F2B705] tracking-tight text-sm">HUMO</span>;');
content2 = content2.replace(/const VisaLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const VisaLogo = () => <span className="font-bold text-white italic tracking-tighter text-sm">VISA</span>;');
content2 = content2.replace(/const ClickLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const ClickLogo = () => <span className="font-bold text-[#00A1E6] tracking-tight text-sm">CLICK</span>;');
content2 = content2.replace(/const PaymeLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const PaymeLogo = () => <span className="font-bold text-[#35C6A7] tracking-tight text-sm">Payme</span>;');
content2 = content2.replace(/const MastercardLogo = \(\) => \([\s\S]*?<\/svg>\s*\);/g, 'const MastercardLogo = () => (<div className="flex -space-x-1.5 items-center justify-center"><div className="w-4 h-4 rounded-full bg-[#EB001B] mix-blend-multiply"></div><div className="w-4 h-4 rounded-full bg-[#F79E1B] mix-blend-multiply"></div></div>);');

fs.writeFileSync(file2, content2);
console.log('Done replacing logos');
