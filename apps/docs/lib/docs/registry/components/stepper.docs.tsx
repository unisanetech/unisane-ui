'use client';

import { Card } from '@unisane/ui/card';
import { Stepper } from '@unisane/ui/stepper';
import { HeroBackground } from '../../runtime/hero-background';
import type { ComponentDoc } from '../types';

const setupSteps = [
  { value: 'account', label: 'Account', description: 'Create login' },
  { value: 'profile', label: 'Profile', description: 'Add details' },
  { value: 'confirm', label: 'Confirm', description: 'Review setup' },
];

const StepperHeroVisual = () => (
  <HeroBackground tone="tertiary">
    <div className="bg-surface border-outline-variant w-80 rounded-sm border p-6 shadow-xl">
      <Stepper aria-label="Setup progress" steps={setupSteps} value="profile" />
    </div>
  </HeroBackground>
);

export const stepperDoc: ComponentDoc = {
  slug: 'stepper',
  name: 'Stepper',
  description:
    'Stepper presents one controlled process sequence with passive progress or optional native step selection.',
  category: 'navigation',
  status: 'stable',
  icon: 'linear_scale',

  importPath: '@/components/ui/stepper',
  exports: ['Stepper'],

  heroVisual: <StepperHeroVisual />,

  choosing: {
    description:
      'Use passive mode to report progress. Add onValueChange only when users may select available steps directly.',
    columns: {
      emphasis: 'Mode',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Passive progress',
        component: <Stepper steps={setupSteps} value="profile" />,
        rationale: 'The surrounding workflow owns next and back actions.',
        examples: 'Linear forms, Checkout, Onboarding',
      },
      {
        emphasis: 'Selectable steps',
        component: (
          <Stepper
            steps={[setupSteps[0]!, setupSteps[1]!, { ...setupSteps[2]!, disabled: true }]}
            value="profile"
            onValueChange={() => {}}
          />
        ),
        rationale: 'Completed or otherwise available stages can be revisited directly.',
        examples: 'Editable setup, Non-linear review',
      },
    ],
  },

  hierarchy: {
    description:
      'Value identifies one current step; earlier completion derives by order unless a step explicitly overrides it.',
    items: [
      {
        component: <Stepper steps={setupSteps} value="account" />,
        title: 'Current',
        subtitle: 'Exactly one resolved step uses aria-current="step"',
      },
      {
        component: <Stepper steps={setupSteps} value="confirm" />,
        title: 'Completed',
        subtitle: 'Earlier steps derive completion and expose localized status',
      },
      {
        component: (
          <Stepper
            steps={[
              { ...setupSteps[0]!, completed: false },
              setupSteps[1]!,
              { ...setupSteps[2]!, completed: true },
            ]}
            value="profile"
          />
        ),
        title: 'Explicit completion',
        subtitle: 'Non-linear processes can override completion without conflicting current state',
      },
    ],
  },

  placement: {
    description:
      'Horizontal orientation fits short sequences above content; vertical orientation fits narrow or description-heavy layouts.',
    examples: [
      {
        title: 'Horizontal process',
        visual: (
          <Card variant="outlined" padding="lg" className="mx-auto max-w-md">
            <Stepper aria-label="Checkout progress" steps={setupSteps} value="profile" />
          </Card>
        ),
        caption: 'A passive sequence above workflow content',
      },
      {
        title: 'Vertical process',
        visual: (
          <Card variant="outlined" padding="lg" className="mx-auto max-w-80">
            <Stepper
              aria-label="Account setup progress"
              orientation="vertical"
              steps={setupSteps}
              value="profile"
              onValueChange={() => {}}
            />
          </Card>
        ),
        caption: 'The entire sequence and connectors use vertical geometry',
      },
    ],
  },

  props: [
    {
      name: 'steps',
      type: 'StepperStep[]',
      required: true,
      description:
        'Stable-value step catalog with rich labels, descriptions, completion overrides, and disabled state.',
    },
    {
      name: 'value',
      type: 'string',
      required: true,
      description:
        'Controlled current step value. Missing or disabled values resolve to the first available step.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description:
        'Enables native button selection for available steps. Omit it for passive progress.',
    },
    {
      name: 'orientation',
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: 'Controls the entire sequence layout, alignment, and connector geometry.',
    },
    {
      name: 'labels',
      type: 'Partial<StepperLabels>',
      description: 'Localizes positional and completed status text.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Classes applied to the native ordered-list boundary.',
    },
  ],

  accessibility: {
    screenReader: [
      'The root is an ordered list and every step is a native list item.',
      'Exactly one resolved item uses aria-current="step".',
      'Position and completed status are localized; disabled interactive steps use native disabled semantics.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Moves through available step buttons only in selectable mode' },
      { key: 'Enter / Space', description: 'Activates a focused available step button' },
    ],
    focus: [
      'Passive progress adds no false focus stops or pointer affordances.',
      'Selectable steps use native buttons and the shared visible focus treatment.',
    ],
  },

  implementation: {
    description:
      'Keep process content and next/back actions in the application; Stepper owns only progress presentation and optional step selection.',
    code: `import { Stepper } from "@/components/ui/stepper";
import { useState } from "react";

const steps = [
  { value: "cart", label: "Cart", description: "Review items" },
  { value: "shipping", label: "Shipping", description: "Enter address" },
  { value: "payment", label: "Payment", description: "Add payment" },
  { value: "confirm", label: "Confirm", description: "Place order", disabled: true },
];

function CheckoutProgress() {
  const [value, setValue] = useState("shipping");

  return (
    <Stepper
      aria-label="Checkout progress"
      steps={steps}
      value={value}
      onValueChange={setValue}
    />
  );
}`,
  },

  related: [
    {
      slug: 'progress',
      reason: 'Use Progress when numbered stages and direct step identity are unnecessary.',
    },
    {
      slug: 'tabs',
      reason: 'Use Tabs for peer content views rather than ordered process stages.',
    },
    {
      slug: 'button',
      reason: 'Applications own next, back, submit, and workflow actions outside Stepper.',
    },
  ],
};
