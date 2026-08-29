import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';

// SVG Logos for Payment Methods
const PaymeLogo = () => (
  <svg viewBox="0 0 100 30" className="h-6 w-auto fill-current" preserveAspectRatio="xMidYMid meet">
    <path fill="#2EBDAD" d="M11.5,18.7c0,2.1-1.6,3.6-3.8,3.6H4.2v6.6H0V3h7.6c2.3,0,3.9,1.5,3.9,3.6c0,1.3-0.6,2.4-1.6,3.1 C10.9,10.4,11.5,11.5,11.5,18.7z M7.7,6.6c0-0.4-0.3-0.7-0.7-0.7H4.2v3.7h2.7c0.4,0,0.7-0.3,0.7-0.7V6.6z M7.7,18.7c0-0.4-0.3-0.7-0.7-0.7H4.2v3.7h2.7 c0.4,0,0.7-0.3,0.7-0.7V18.7z" />
    <path fill="#2EBDAD" d="M26.2,16.5h-5.2l-1.3,4.1h-4l5.6-17h4.8l5.6,17h-4.2L26.2,16.5z M23.6,8l-1.8,5.4h3.6L23.6,8z"/>
    <path fill="#2EBDAD" d="M42.8,20.6L37.1,3h4.3l3.5,11.7L48.4,3h4.2l-8.4,26h-4V20.6z"/>
    <path fill="#2EBDAD" d="M72.9,20.6L67.1,3h4.1l3.7,12.3L78.6,3h4.2l-8.4,26h-4V20.6z"/>
    <path fill="#2EBDAD" d="M99.6,17.2h-12c0.2,2.3,2.1,4.1,4.4,4.1c1.5,0,2.8-0.7,3.5-1.9l3.5,1.7c-1.4,2.4-3.9,3.9-7,3.9 c-4.8,0-8.6-3.8-8.6-8.6s3.8-8.6,8.6-8.6c4.6,0,8.3,3.6,8.6,8.2l0,1.2H99.6z M87.8,14.3h8c-0.4-2-2.1-3.5-4-3.5 C89.9,10.8,88.2,12.3,87.8,14.3z"/>
  </svg>
);

const ClickLogo = () => (
  <svg viewBox="0 0 100 30" className="h-6 w-auto fill-[#00529C]" preserveAspectRatio="xMidYMid meet">
    <path d="M12.9,14.8c0,4.3-3.4,7.8-7.7,7.8s-7.7-3.5-7.7-7.8c0-4.3,3.4-7.8,7.7-7.8C9.5,7,12.9,10.5,12.9,14.8z M2,14.8 c0,3.3,2.4,5.9,5.5,5.9c3.1,0,5.5-2.7,5.5-5.9c0-3.3-2.4-5.9-5.5-5.9C4.4,8.9,2,11.6,2,14.8z"/>
    <path d="M17.1,7.2h4.5v15.2h-4.5V7.2z"/>
    <path d="M26.2,7.2h4.5v15.2h-4.5V7.2z"/>
    <path d="M43.7,7.2c3.4,0,6.2,2.3,7,5.5l-4.2,1.1c-0.4-1.4-1.5-2.4-2.8-2.4c-1.7,0-3,1.4-3,3.4c0,2,1.4,3.4,3,3.4 c1.3,0,2.5-1,2.8-2.4l4.2,1.1c-0.8,3.2-3.6,5.5-7,5.5c-4.2,0-7.5-3.5-7.5-7.7S39.5,7.2,43.7,7.2z"/>
    <path d="M53.6,7.2h4.5v7.2l5.6-7.2h5.5l-6.5,7.5l7.1,7.7h-5.8l-5.8-6.4v6.4h-4.5V7.2z"/>
  </svg>
);

const UzcardLogo = () => (
  <svg viewBox="0 0 100 30" className="h-6 w-auto fill-[#005187]" preserveAspectRatio="xMidYMid meet">
    <path d="M28.3,16.3c0,4.1-3.2,7.3-7.2,7.3H3.6V2.6h17.5C25.1,2.6,28.3,5.8,28.3,9.9V16.3z M24,9.9c0-1.8-1.4-3.3-3.1-3.3H8 v13.1h12.9c1.7,0,3.1-1.5,3.1-3.3V9.9z" />
    <path d="M40.3,2.6v3.9H32.4v13.3h-4V2.6H40.3z" />
    <path d="M42,23.5l10.4-16h-9.5V2.6h15.2v4.7L47.7,23.5H42z" />
    <path d="M83,9.5c0-4-3-7.1-7.2-7.1c-4.1,0-7.3,3-7.3,7.1v5.1c0,4,3.2,7.1,7.3,7.1c4.1,0,7.2-3.1,7.2-7.1V9.5z M79,14.6 c0,1.9-1.4,3.4-3.2,3.4c-1.8,0-3.3-1.5-3.3-3.4V9.5c0-1.9,1.5-3.4,3.3-3.4c1.8,0,3.2,1.5,3.2,3.4V14.6z" />
    <path d="M88.5,23.5h-4.1V2.6h4.1v7.6c1-1.4,2.5-2.2,4.3-2.2c3.5,0,6.2,2.8,6.2,6.4v3.1c0,3.5-2.7,6.4-6.2,6.4 C91,23.8,89.5,23,88.5,21.6V23.5z M94.8,17.4v-3.1c0-1.5-1.2-2.7-2.7-2.7c-1.5,0-2.8,1.2-2.8,2.7v3.1c0,1.5,1.3,2.7,2.8,2.7 C93.6,20.2,94.8,18.9,94.8,17.4z" />
    <circle cx="95.5" cy="5.4" r="1.3" fill="#F47D20" />
  </svg>
);

const HumoLogo = () => (
  <svg viewBox="0 0 100 30" className="h-6 w-auto fill-[#D4AF37]" preserveAspectRatio="xMidYMid meet">
    <path d="M12.9,23.5H9.2v-8.6H3.6v8.6H0V2.6h3.6v8.3h5.6V2.6h3.6V23.5z" />
    <path d="M26,2.6v13.5c0,2.3-1.8,4.1-4.1,4.1s-4.1-1.8-4.1-4.1V2.6h3.6v13.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V2.6H26z" />
    <path d="M43.7,23.5h-3.6v-13l-4.1,7l-4.1-7v13h-3.6V2.6h4.2l3.5,6.1l3.5-6.1h4.2V23.5z" />
    <path d="M60.8,13.1c0,5.8-4.7,10.6-10.6,10.6S39.6,18.9,39.6,13.1S44.3,2.5,50.2,2.5S60.8,7.3,60.8,13.1z M57.2,13.1 c0-3.9-3.1-7-7-7s-7,3.1-7,7s3.1,7,7,7S57.2,17,57.2,13.1z" />
  </svg>
);

const VisaLogo = () => (
  <svg viewBox="0 0 100 30" className="h-6 w-auto fill-[#1A1F71]" preserveAspectRatio="xMidYMid meet">
    <path d="M41.4,2.5L34,22.8H27.5L32.2,2.5H41.4z M17,2.5l-4.5,13.8l-1.9-9.8c-0.3-2-2.1-3.6-4.1-4L0,1.9v2.2 c1.7,0.4,3.7,1.1,4.9,2l4.2,16.7h7.1l6.7-20.2H17z M74.7,6.8c-1.3-0.5-3.3-1-5.5-1c-6,0-10.2,3.1-10.3,7.5c0,3.3,3,5.2,5.3,6.2 c2.4,1.1,3.2,1.8,3.2,2.8c0,1.5-1.9,2.2-3.6,2.2c-2.4,0-4.6-0.6-6.4-1.6l-0.9-0.4l-1,6C57.3,29.4,60.1,30,63.1,30 c6.4,0,10.6-3.1,10.6-7.8c0-2.6-1.5-4.5-5.1-6.2c-2.2-1.1-3.5-1.8-3.5-2.8c0-0.9,1.1-1.9,3.4-1.9c1.9,0,3.6,0.4,5,1l0.6,0.3 L74.7,6.8z M91.3,2.5h-5.4c-1.4,0-2.6,0.8-3.2,2.1L73.1,22.8h7.4l1.5-4h9l0.9,4h6.5L91.3,2.5z M84.3,13.3l2.4-6.3l1.4,6.3H84.3z" />
    <path fill="#F7B600" d="M17,2.5l-4.5,13.8l-1.9-9.8c-0.3-2-2.1-3.6-4.1-4L0,1.9v2.2c1.7,0.4,3.7,1.1,4.9,2l4.2,16.7h7.1l6.7-20.2H17z" />
  </svg>
);

const MastercardLogo = () => (
  <svg viewBox="0 0 100 60" className="h-6 w-auto" preserveAspectRatio="xMidYMid meet">
    <circle cx="32" cy="30" r="20" fill="#EB001B" />
    <circle cx="68" cy="30" r="20" fill="#F79E1B" />
    <path fill="#FF5F00" d="M50,12.7c-4.9,0-9.4,2.5-11.9,6.5c3.2,4.8,3.2,16.8,0,21.6c2.5,4,7,6.5,11.9,6.5s9.4-2.5,11.9-6.5 c-3.2-4.8-3.2-16.8,0-21.6C59.4,15.2,54.9,12.7,50,12.7z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="mt-16 bg-[#1D2132] text-[#9CA3AF] pb-24 lg:pb-8 font-sans">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 xl:grid-cols-6 text-sm">
          
          {/* Column 1: Brand & Contact */}
          <div className="xl:col-span-2 flex flex-col gap-5">
            <Link to="/" className="inline-block text-white">
              <Logo size={42} />
            </Link>
            <p className="mt-2 text-[#9CA3AF]">
              Savollaringiz bo'lsa, javob tayyormiz!
            </p>
            <a href="tel:+998555001101" className="text-xl font-bold text-white hover:text-primary transition-colors">
              +998 55 500-11-01
            </a>
            <div className="mt-2 text-sm text-[#9CA3AF] leading-relaxed">
              Ish vaqti: <br />
              <span className="font-semibold text-white/90">Har kuni: 09:00 - 21:00</span>
            </div>
          </div>

          {/* Column 2: Payment Methods */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white mb-2">To'lov usullari</h4>
            <div className="grid grid-cols-2 gap-3 max-w-[200px]">
              <div className="flex items-center justify-center rounded-lg bg-[#282C3D] border border-white/5 h-12 w-full hover:border-white/20 transition-colors">
                <UzcardLogo />
              </div>
              <div className="flex items-center justify-center rounded-lg bg-[#282C3D] border border-white/5 h-12 w-full hover:border-white/20 transition-colors">
                <HumoLogo />
              </div>
              <div className="flex items-center justify-center rounded-lg bg-[#282C3D] border border-white/5 h-12 w-full hover:border-white/20 transition-colors">
                <VisaLogo />
              </div>
              <div className="flex items-center justify-center rounded-lg bg-[#282C3D] border border-white/5 h-12 w-full hover:border-white/20 transition-colors">
                <ClickLogo />
              </div>
              <div className="flex items-center justify-center rounded-lg bg-[#282C3D] border border-white/5 h-12 w-full hover:border-white/20 transition-colors">
                <PaymeLogo />
              </div>
              <div className="flex items-center justify-center rounded-lg bg-[#282C3D] border border-white/5 h-12 w-full hover:border-white/20 transition-colors">
                <MastercardLogo />
              </div>
            </div>
          </div>

          {/* Column 3: Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white mb-2">Ma'lumot</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-white transition-colors">Biz haqimizda</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Maxfiylik siyosati</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Ommaviy oferta</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Qaytarish siyosati</Link></li>
            </ul>
          </div>

          {/* Column 4: Services */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white mb-2">Xizmatlar</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="hover:text-white transition-colors">Biz bilan bog'laning</Link></li>
              <li><Link to="/partnership" className="hover:text-white transition-colors">Biz bilan Hamkorlik qilish</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">TSS</Link></li>
              <li><Link to="/sitemap" className="hover:text-white transition-colors">Sayt xaritasi</Link></li>
            </ul>
          </div>

          {/* Column 5: For Customers */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white mb-2">Mijozlar uchun</h4>
            <ul className="space-y-3">
              <li><Link to="/locations" className="hover:text-white transition-colors">Manzillar</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">TSS</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Qaytarish siyosati</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 text-[13px]">
          <p>© {new Date().getFullYear()} . Barcha huquqlar himoyalangan.</p>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
