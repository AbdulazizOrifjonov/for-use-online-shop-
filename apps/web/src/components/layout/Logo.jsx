import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Logo({ size = 32, className }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <img
        src="/logo-wide.png"
        alt="Professional Tools"
        onError={() => setImgFailed(true)}
        className={cn('shrink-0 object-contain', className)}
        style={{ height: size, width: 'auto' }}
      />
    );
  }

  return (
    <div className={cn('flex items-center gap-2 shrink-0', className)}>
      <span
        className="flex items-center justify-center rounded-lg bg-primary font-bold text-white"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        PT
      </span>
      <span className="font-bold text-primary hidden sm:inline-block" style={{ fontSize: size * 0.5 }}>
        Professional Tools
      </span>
    </div>
  );
}
