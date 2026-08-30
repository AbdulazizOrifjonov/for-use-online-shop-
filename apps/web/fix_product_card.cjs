const fs = require('fs');
let code = fs.readFileSync('src/components/product/ProductCard.jsx', 'utf8');

// Fix 1: Named group for hover to avoid triggering from parent sliders
code = code.replace(/className="group relative flex flex-col/g, 'className="group/card relative flex flex-col');
code = code.replace(/group-hover:scale-110/g, 'group-hover/card:scale-110');
code = code.replace(/group-hover:opacity-100/g, 'group-hover/card:opacity-100');

// Fix 2: Price layout to prevent height jumps
code = code.replace(
  /<div className="mt-auto flex flex-wrap items-baseline gap-1\.5">[\s\S]*?<\/div>/,
  `<div className="mt-auto flex flex-col gap-0.5 min-h-[40px] justify-end">
          <span className="text-sm font-bold sm:text-base text-destructive">{formatUZS(currentPrice)}</span>
          <span className="text-[11px] text-muted-foreground line-through h-[14px]">
            {discountPercent > 0 ? formatUZS(oldPrice) : ''}
          </span>
        </div>`
);

fs.writeFileSync('src/components/product/ProductCard.jsx', code);
