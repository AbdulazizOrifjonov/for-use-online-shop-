
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { UzcardLogo, HumoLogo, VisaLogo, MastercardLogo, ClickLogo, PaymeLogo } from '../PaymentLogos';


export function Footer() {
  return (
    <footer className="mt-auto bg-[#070F1A] text-white/80 border-t border-[#1E3A5F]/50">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 text-sm">
          
          {/* Column 1: Brand & Contact */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-block text-white">
              <Logo size={40} />
            </Link>
            <p className="mt-2 text-[#9CA3AF] max-w-xs">
              Savollaringiz bo'lsa, javob berishga tayyormiz!
            </p>
            <a href="tel:+998555001101" className="text-xl font-bold text-white hover:text-primary transition-colors">
              +998 55 500-11-01
            </a>
            <div className="text-sm text-[#9CA3AF] leading-relaxed">
              Ish vaqti: <br />
              <span className="font-semibold text-white/90">Har kuni: 09:00 - 21:00</span>
            </div>
          </div>

          {/* Column 2: Info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white mb-1">Ma'lumot</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors">Biz haqimizda</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Maxfiylik siyosati</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Ommaviy oferta</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Qaytarish siyosati</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white mb-1">Xizmatlar</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-white transition-colors">Biz bilan bog'laning</Link></li>
              <li><Link to="/partnership" className="hover:text-white transition-colors">Biz bilan Hamkorlik qilish</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">TSS</Link></li>
              <li><Link to="/sitemap" className="hover:text-white transition-colors">Sayt xaritasi</Link></li>
            </ul>
          </div>

          {/* Column 4: For Customers */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white mb-1">Mijozlar uchun</h4>
            <ul className="space-y-2">
              <li><Link to="/locations" className="hover:text-white transition-colors">Manzillar</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">TSS</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Qaytarish siyosati</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 text-[13px] gap-4">
          <p>© {new Date().getFullYear()} COMPUZ. Barcha huquqlar himoyalangan.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex h-8 items-center justify-center rounded bg-[#0D1B2A] px-3 border border-[#1E3A5F]"><UzcardLogo /></div>
            <div className="flex h-8 items-center justify-center rounded bg-[#0D1B2A] px-3 border border-[#1E3A5F]"><HumoLogo /></div>
            <div className="flex h-8 items-center justify-center rounded bg-[#0D1B2A] px-3 border border-[#1E3A5F]"><VisaLogo /></div>
            <div className="flex h-8 items-center justify-center rounded bg-[#0D1B2A] px-3 border border-[#1E3A5F]"><ClickLogo /></div>
            <div className="flex h-8 items-center justify-center rounded bg-[#0D1B2A] px-3 border border-[#1E3A5F]"><PaymeLogo /></div>
            <div className="flex h-8 items-center justify-center rounded bg-[#0D1B2A] px-3 border border-[#1E3A5F]"><MastercardLogo /></div>
          </div>

          <div className="flex items-center gap-2">
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
