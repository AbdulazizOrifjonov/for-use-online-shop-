import { cn } from '@/lib/utils';

export function Logo({ size = 32, className }) {
  // We recreate the COMPUZ logo vibe using SVG inline
  // A glowing blue 'C' inside a laptop frame with pixel blocks
  return (
    <div className={cn('flex items-center gap-2 shrink-0', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Glowing effect behind */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="c-grad" x1="20" y1="30" x2="80" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38B6FF" />
            <stop offset="1" stopColor="#0B57D0" />
          </linearGradient>
        </defs>

        {/* Laptop frame outline (silver/white) */}
        <path d="M10 20 h70 v50 h-70 z" stroke="#E2EAF4" strokeWidth="3" rx="4" />
        <path d="M5 70 h80 v6 h-80 z" fill="#8B9BB4" rx="2" />
        
        {/* Pixel blocks on top right */}
        <rect x="75" y="10" width="8" height="8" fill="#38B6FF" />
        <rect x="65" y="15" width="8" height="8" fill="#E2EAF4" />
        <rect x="70" y="25" width="8" height="8" fill="#0B57D0" />
        <rect x="85" y="15" width="8" height="8" fill="#0D1B2A" stroke="#38B6FF" strokeWidth="1" />

        {/* Big stylized 'C' inside */}
        <path
          d="M 65 30 L 40 30 L 30 50 L 40 70 L 65 70 L 58 55 L 45 55 L 40 45 L 45 35 L 65 35 Z"
          fill="url(#c-grad)"
          filter="url(#glow)"
        />
      </svg>
      <div className="flex flex-col justify-center hidden sm:flex">
        <span 
          className="font-extrabold tracking-wide uppercase leading-none" 
          style={{ fontSize: size * 0.6, color: '#E2EAF4' }}
        >
          COMPU<span className="text-[#38B6FF]">Z</span>
        </span>
        <span 
          className="font-semibold tracking-[0.2em] text-[#38B6FF] leading-none mt-1" 
          style={{ fontSize: size * 0.2 }}
        >
          COMPUTER STORE
        </span>
      </div>
    </div>
  );
}
