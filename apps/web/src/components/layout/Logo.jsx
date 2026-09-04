import { cn } from '@/lib/utils';

export function Logo({ className }) {
  return (
    <div className={cn('inline-flex shrink-0 items-center', className)}>
      {/* Light mode logo */}
      <img
        src="/logo-light.png"
        alt="COMPUZ Computer Store"
        className="object-contain h-full w-auto dark:hidden"
      />
      {/* Dark mode logo */}
      <img
        src="/logo.png"
        alt="COMPUZ Computer Store"
        className="object-contain h-full w-auto hidden dark:block"
      />
    </div>
  );
}
