// Inline SVG payment logos — no external requests, always renders correctly
export const UzcardLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 90 30" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="90" height="30" rx="4" fill="#00529B"/>
    <text x="45" y="21" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="1">UZCARD</text>
  </svg>
);

export const HumoLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 80 30" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="30" rx="4" fill="#1a1a2e"/>
    <text x="40" y="21" textAnchor="middle" fill="#F2B705" fontSize="14" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="2">HUMO</text>
  </svg>
);

export const VisaLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 80 30" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="30" rx="4" fill="#1A1F71"/>
    <text x="40" y="22" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial,sans-serif" fontStyle="italic" letterSpacing="1">VISA</text>
  </svg>
);

export const MastercardLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 54 34" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="54" height="34" rx="4" fill="#252525"/>
    <circle cx="21" cy="17" r="11" fill="#EB001B"/>
    <circle cx="33" cy="17" r="11" fill="#F79E1B"/>
    <path d="M27 9.8a11 11 0 0 1 0 14.4A11 11 0 0 1 27 9.8z" fill="#FF5F00"/>
  </svg>
);

export const ClickLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 80 30" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="30" rx="4" fill="#00A1E6"/>
    <text x="40" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="1">CLICK</text>
  </svg>
);

export const PaymeLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 80 30" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="30" rx="4" fill="#35C6A7"/>
    <text x="40" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="0.5">payme</text>
  </svg>
);
