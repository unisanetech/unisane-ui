"use client";

import { useEffect, useState } from "react";
import { Typography } from "@unisane/ui";
import { cn } from "@unisane/ui/lib/utils";

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
            return prev.boundingClientRect.top < curr.boundingClientRect.top
              ? prev
              : curr;
          });
          setActiveId(closest.target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
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

    element.scrollIntoView({ behavior: "smooth" });
    setActiveId(id);
    window.history.pushState(null, "", `#${id}`);
  };

  return (
    <aside className="hidden w-56 shrink-0 @5xl:block">
      <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <Typography
          variant="labelMedium"
          component="span"
          className="mb-2 block text-on-surface-variant"
        >
          On this page
        </Typography>
        <Typography
          variant="headlineMedium"
          component="h4"
          className="mb-6 text-on-surface"
        >
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
                  "block rounded-lg border px-3 py-2 text-left text-body-medium transition-all duration-short",
                  isActive
                    ? "border-outline-variant font-medium text-on-surface"
                    : "border-transparent text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface"
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
