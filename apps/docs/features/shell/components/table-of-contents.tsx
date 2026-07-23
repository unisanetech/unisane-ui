'use client';

import { useEffect, useState } from 'react';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';

interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  title: string;
  items: TocItem[];
}

export function TableOfContents({ title, items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const closest = visibleEntries.reduce((prev, curr) => {
            return prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr;
          });
          setActiveId(closest.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    element.scrollIntoView({ behavior: 'smooth' });
    setActiveId(id);
    window.history.pushState(null, '', `#${id}`);
  };

  return (
    <aside className="hidden w-56 shrink-0 @5xl:block">
      <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <Typography
          variant="labelMedium"
          component="span"
          className="text-on-surface-variant mb-2 block"
        >
          On this page
        </Typography>
        <Typography variant="headlineMedium" component="h4" className="text-on-surface mb-6">
          {title}
        </Typography>
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => handleClick(event, item.id)}
                className={cn(
                  'text-body-medium duration-short block rounded-lg border px-3 py-2 text-left transition-all',
                  isActive
                    ? 'border-outline-variant text-on-surface font-medium'
                    : 'text-on-surface-variant hover:bg-state-hover hover:text-on-surface border-transparent',
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
