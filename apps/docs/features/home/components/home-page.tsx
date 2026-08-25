'use client';

import React from 'react';
import { ComponentGridSection } from './component-grid-section';
import { HeroSection } from './hero-section';
import { ThemeControlFab } from './system-anatomy-section';

export function HomePage() {
  return (
    <div className="@container bg-surface min-h-screen">
      <HeroSection />
      <ComponentGridSection />
      <ThemeControlFab />
    </div>
  );
}
