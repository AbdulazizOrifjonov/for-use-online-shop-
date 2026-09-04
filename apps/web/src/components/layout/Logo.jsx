import { cn } from '@/lib/utils';

export function Logo({ className }) {
  return (
    <div className={cn('flex items-center shrink-0 rounded-lg border border-border bg-card overflow-hidden', className)}>
      <img
        src="/logo.png"
        alt="COMPUZ Computer Store"
        className="object-contain h-full w-auto"
      />
    </div>
  );
}
