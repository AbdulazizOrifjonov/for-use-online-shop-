import { cn } from '@/lib/utils';

export function Logo({ size = 40, className }) {
  return (
    <div className={cn('flex items-center shrink-0 rounded-lg border border-border bg-card overflow-hidden', className)}>
      <img
        src="/logo.png"
        alt="COMPUZ Computer Store"
        className="object-contain"
        style={{ height: size, width: 'auto', minWidth: size * 3 }}
      />
    </div>
  );
}
