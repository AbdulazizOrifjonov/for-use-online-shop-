const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetail.jsx', 'utf8');

const briefSpecsCode = `
          {Object.keys(specs).length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">{t('product.brief_specs', 'Mahsulot haqida qisqacha')}</h3>
              <div className="space-y-2 text-[13px]">
                {Object.entries(specs).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="flex items-baseline">
                    <span className="text-muted-foreground shrink-0">{key}</span>
                    <div className="flex-grow border-b border-dotted border-border mx-2"></div>
                    <span className="font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
              {Object.keys(specs).length > 6 && (
                <button
                  type="button"
                  onClick={() => {
                     const trigger = document.querySelector('[value="specs"]');
                     if (trigger) { trigger.click(); trigger.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
                  }}
                  className="mt-3 text-[13px] font-semibold text-primary hover:underline"
                >
                  Barcha xususiyatlari &gt;
                </button>
              )}
            </div>
          )}
`;

code = code.replace(
  /<div className="mt-5 rounded-2xl border border-primary\/20 bg-\[#EAF8EF\]/,
  briefSpecsCode + '\n\n            <div className="mt-5 rounded-2xl border border-primary/20 bg-[#EAF8EF]'
);

fs.writeFileSync('src/pages/ProductDetail.jsx', code);
