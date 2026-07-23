'use client';

import { useState } from 'react';
import type { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Button } from '@unisane/ui/button';
import { Drawer } from '@unisane/ui/drawer';

function DrawerPreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open preferences</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Preferences"
        description="Adjust this workspace without leaving the current task."
        footerRight={<Button onClick={() => setOpen(false)}>Done</Button>}
        showCloseButton
      >
        <p className="text-body-medium text-on-surface-variant">
          Drawer content stays scrollable while its header and footer remain anchored.
        </p>
      </Drawer>
    </>
  );
}

export const drawerDoc: ComponentDoc = {
  slug: 'drawer',
  name: 'Drawer',
  description:
    'A bottom-anchored modal surface for focused supporting tasks on constrained screens.',
  category: 'containment',
  status: 'stable',
  icon: 'vertical_align_top',
  importPath: '@/components/ui/drawer',
  exports: ['Drawer', 'DrawerProps', 'DrawerSize'],
  heroVisual: (
    <HeroBackground tone="secondary">
      <DrawerPreview />
    </HeroBackground>
  ),
  variants: [
    {
      name: 'size',
      type: 'DrawerSize',
      default: '"md"',
      options: [
        { value: 'sm', label: 'Small', description: 'Short decisions and compact forms.' },
        { value: 'md', label: 'Medium', description: 'Default supporting tasks.' },
        { value: 'lg', label: 'Large', description: 'Longer forms and previews.' },
        { value: 'full', label: 'Full', description: 'Near full-screen mobile workflows.' },
      ],
    },
  ],
  props: [
    { name: 'open', type: 'boolean', description: 'Controlled open state.' },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Receives dismissal and open changes.',
    },
    { name: 'title', type: 'ReactNode', description: 'Accessible visible heading.' },
    { name: 'description', type: 'ReactNode', description: 'Accessible supporting description.' },
    { name: 'footer', type: 'ReactNode', description: 'Anchored footer content.' },
  ],
  accessibility: {
    keyboard: [{ key: 'Escape', description: 'Dismisses the drawer when dismissible.' }],
    focus: ['Focus is trapped while open and restored after dismissal.'],
    motion: ['Swipe dismissal can be disabled while retaining button and keyboard dismissal.'],
  },
  implementation: {
    code: `import { Drawer } from "@/components/ui/drawer";`,
  },
  related: [
    { slug: 'sheet', reason: 'Use Sheet for edge-anchored desktop supporting content.' },
    { slug: 'dialog', reason: 'Use Dialog for centered decisions and prompts.' },
  ],
};
