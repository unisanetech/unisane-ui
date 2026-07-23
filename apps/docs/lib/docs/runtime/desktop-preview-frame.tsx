'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@unisane/ui/utils';

interface DesktopPreviewFrameProps {
  children: React.ReactNode;
  designWidth?: number;
  designHeight?: number;
  className?: string;
}

export function DesktopPreviewFrame({
  children,
  designWidth = 960,
  designHeight = 560,
  className,
}: DesktopPreviewFrameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [hostWidth, setHostWidth] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof ResizeObserver === 'undefined') {
      return;
    }

    const update = () => {
      setHostWidth(host.clientWidth);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(host);

    return () => observer.disconnect();
  }, []);

  const scale = hostWidth > 0 ? Math.min(1, hostWidth / designWidth) : 1;
  const scaledHeight = Math.max(1, Math.round(designHeight * scale));

  return (
    <div ref={hostRef} className={cn('w-full', className)}>
      <div
        className="mx-auto"
        style={{ width: Math.max(1, Math.round(designWidth * scale)), height: scaledHeight }}
      >
        <div
          className="origin-top-left"
          style={{
            width: designWidth,
            height: designHeight,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
