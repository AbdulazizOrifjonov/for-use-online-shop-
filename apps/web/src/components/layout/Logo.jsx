import { cn } from '@/lib/utils';

export function Logo({ className }) {
  return (
    <div className={cn('inline-flex shrink-0 items-center', className)}>
      {/* Light mode logo (swapped per request) */}
      <img
        src="/logo.png"
        alt="COMPUZ Computer Store"
        className="object-contain h-full w-auto rounded-xl border-2 border-border shadow-sm dark:hidden"
      />
      {/* Dark mode logo (swapped per request) */}
      <img
        src="/logo-light.png"
        alt="COMPUZ Computer Store"
        className="object-contain h-full w-auto rounded-xl border-2 border-border shadow-sm hidden dark:block"
      />
    </div>
  );
}
