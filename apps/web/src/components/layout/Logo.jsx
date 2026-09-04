import { cn } from '@/lib/utils';

export function Logo({ className }) {
  return (
    <div className={cn('inline-flex shrink-0 items-center', className)}>
      <img
        src="/logo.png"
        alt="COMPUZ Computer Store"
        className="object-contain h-full w-auto rounded-xl border-2 border-border bg-card shadow-sm"
      />
    </div>

  );
}
