"use client";

import { Surface } from "@unisane/ui";
import { AiChatCard } from "./showcase/ai-chat-card";
import { OperationsBoardCard } from "./showcase/operations-board-card";
import { ProductDetailCard } from "./showcase/product-detail-card";
import { WorkspaceSetupCard } from "./showcase/workspace-setup-card";

export function HeroShowcase() {
  return (
    <Surface
      tone="surfaceContainerLow"
      rounded="sm"
      className="h-full p-1.5 @sm:p-2"
    >
      <div className="grid h-full grid-cols-1 gap-1.5 @sm:gap-2 @lg:grid-cols-2 @lg:auto-rows-fr">
        <WorkspaceSetupCard />
        <OperationsBoardCard />
        <AiChatCard />
        <ProductDetailCard />
      </div>
    </Surface>
  );
}
