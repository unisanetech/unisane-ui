"use client";

import React from "react";
import { HomeContentSection, HomeHeroSection, HomeViewport } from "./section-layout";
import { HeroSection } from "./hero-section";
import { StatsSection } from "./stats-section";
import { FeaturesSection } from "./features-section";
import { ComponentGridSection } from "./component-grid-section";
import { CtaSection } from "./cta-section";

export function HomePage() {
  return (
    <div className="@container">
      <HomeViewport>
        <HomeHeroSection>
          <HeroSection />
        </HomeHeroSection>
        <StatsSection />
      </HomeViewport>

      <HomeContentSection>
        <FeaturesSection />
      </HomeContentSection>

      <HomeContentSection className="border-t border-outline-weak">
        <ComponentGridSection />
      </HomeContentSection>

      <HomeContentSection className="border-t border-outline-weak">
        <CtaSection />
      </HomeContentSection>
    </div>
  );
}
