'use client';

import { DocLayout, DocSection, CliCommand } from '@/features/docs-page';
import { Card } from '@unisane/ui/card';
import { Typography } from '@unisane/ui/typography';
import { Button } from '@unisane/ui/button';
import { IconButton } from '@unisane/ui/icon-button';
import { Checkbox } from '@unisane/ui/checkbox';
import { TextField } from '@unisane/ui/text-field';
import { useState } from 'react';

const TOC_ITEMS = [
  { id: 'first-component', label: 'Your First Component' },
  { id: 'adding-interactivity', label: 'Adding Interactivity' },
  { id: 'building-a-form', label: 'Building a Form' },
  { id: 'next-steps', label: 'Next Steps' },
];

export default function QuickStartPage() {
  return (
    <DocLayout
      title="Quick Start"
      description="Build your first interface with Unisane UI in just a few minutes. Follow along with these examples."
      toc={TOC_ITEMS}
    >
      {/* First Component */}
      <DocSection
        id="first-component"
        title="Your First Component"
        description="Let's start by creating a simple card component with a button."
      >
        <div className="space-y-6">
          <Typography variant="bodyMedium" className="text-on-surface-variant max-w-2xl">
            First, add the components you need using the CLI:
          </Typography>
          <CliCommand command="unisane ui add button card" />

          <Typography variant="bodyMedium" className="text-on-surface-variant max-w-2xl">
            Then use them in your component:
          </Typography>

          <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
            <CodeBlock
              title="app/page.tsx"
              code={`import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <Card className="p-6 max-w-sm">
      <h2 className="text-xl font-semibold mb-2">
        Welcome to Unisane UI
      </h2>
      <p className="mb-4 text-on-surface-variant">
        Beautiful, accessible components
        for your next project.
      </p>
      <Button variant="filled">
        Get Started
      </Button>
    </Card>
  );
}`}
            />
            <PreviewCard title="Result">
              <Card className="max-w-sm p-6">
                <h2 className="text-on-surface mb-2 text-xl font-semibold">
                  Welcome to Unisane UI
                </h2>
                <p className="text-on-surface-variant mb-4">
                  Beautiful, accessible components for your next project.
                </p>
                <Button variant="filled">Get Started</Button>
              </Card>
            </PreviewCard>
          </div>
        </div>
      </DocSection>

      {/* Adding Interactivity */}
      <DocSection
        id="adding-interactivity"
        title="Adding Interactivity"
        description="Unisane UI components work seamlessly with React state and event handlers."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
            <CodeBlock
              title="Counter.tsx"
              code={`"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Card className="p-6 text-center">
      <p className="text-4xl font-bold mb-4">
        {count}
      </p>
      <div className="flex gap-2 justify-center">
        <IconButton
          variant="tonal"
          onClick={() => setCount(c => c - 1)}
          aria-label="Decrease"
        >
          <span className="material-symbols-outlined">
            remove
          </span>
        </IconButton>
        <IconButton
          variant="tonal"
          onClick={() => setCount(c => c + 1)}
          aria-label="Increase"
        >
          <span className="material-symbols-outlined">
            add
          </span>
        </IconButton>
      </div>
      <Button
        variant="text"
        onClick={() => setCount(0)}
        className="mt-4"
      >
        Reset
      </Button>
    </Card>
  );
}`}
            />
            <PreviewCard title="Result">
              <CounterDemo />
            </PreviewCard>
          </div>
        </div>
      </DocSection>

      {/* Building a Form */}
      <DocSection
        id="building-a-form"
        title="Building a Form"
        description="Combine form components to create interactive user interfaces."
      >
        <div className="space-y-6">
          <CliCommand command="unisane ui add text-field checkbox" />

          <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
            <CodeBlock
              title="SignUpForm.tsx"
              code={`"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TextField } from "@/components/ui/text-field";

export function SignUpForm() {
  const [agreed, setAgreed] = useState(false);

  return (
    <Card className="p-6 max-w-sm">
      <h2 className="text-xl font-semibold mb-4">
        Create Account
      </h2>

      <form className="space-y-4">
        <TextField
          label="Full Name"
          placeholder="John Doe"
        />
        <TextField
          label="Email"
          type="email"
          placeholder="john@example.com"
        />
        <TextField
          label="Password"
          type="password"
        />

        <Checkbox
          checked={agreed}
          onChange={setAgreed}
          label="I agree to the terms"
        />

        <Button
          variant="filled"
          className="w-full"
          disabled={!agreed}
        >
          Sign Up
        </Button>
      </form>
    </Card>
  );
}`}
            />
            <PreviewCard title="Result">
              <SignUpFormDemo />
            </PreviewCard>
          </div>
        </div>
      </DocSection>

      {/* Next Steps */}
      <DocSection
        id="next-steps"
        title="Next Steps"
        description="Now that you've built your first components, explore more of what Unisane UI has to offer."
      >
        <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
          <NextStepCard
            icon="palette"
            title="Customize Styling"
            description="Learn how to customize components with Tailwind CSS and design tokens."
            href="/docs/getting-started/styling"
          />
          <NextStepCard
            icon="dark_mode"
            title="Build Themes"
            description="Create light and dark themes with the powerful theming system."
            href="/docs/getting-started/theming"
          />
          <NextStepCard
            icon="widgets"
            title="Browse Components"
            description="Explore all 50+ components available in the library."
            href="/docs/components"
          />
          <NextStepCard
            icon="architecture"
            title="Blocks"
            description="Explore reusable app blocks built from Unisane UI components."
            href="/docs/blocks"
          />
        </div>
      </DocSection>
    </DocLayout>
  );
}

// Demo Components

function CounterDemo() {
  const [count, setCount] = useState(0);

  return (
    <Card className="p-6 text-center">
      <p className="text-on-surface mb-4 text-4xl font-bold">{count}</p>
      <div className="flex justify-center gap-2">
        <IconButton
          variant="tonal"
          onClick={() => setCount((c) => c - 1)}
          aria-label="Decrease"
          icon={<span className="material-symbols-outlined">remove</span>}
        />
        <IconButton
          variant="tonal"
          onClick={() => setCount((c) => c + 1)}
          aria-label="Increase"
          icon={<span className="material-symbols-outlined">add</span>}
        />
      </div>
      <Button variant="text" onClick={() => setCount(0)} className="mt-4">
        Reset
      </Button>
    </Card>
  );
}

function SignUpFormDemo() {
  const [agreed, setAgreed] = useState(false);

  return (
    <Card className="max-w-sm p-6">
      <h2 className="text-on-surface mb-4 text-xl font-semibold">Create Account</h2>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <TextField label="Full Name" placeholder="John Doe" />
        <TextField label="Email" type="email" placeholder="john@example.com" />
        <TextField label="Password" type="password" />
        <Checkbox
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          label="I agree to the terms"
        />
        <Button variant="filled" className="w-full" disabled={!agreed}>
          Sign Up
        </Button>
      </form>
    </Card>
  );
}

// Helper Components

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="border-outline-variant overflow-hidden rounded-lg border">
      <div className="bg-surface-container border-outline-variant border-b px-4 py-2">
        <Typography variant="labelMedium" className="text-on-surface-variant font-mono">
          {title}
        </Typography>
      </div>
      <div className="bg-surface-container-low">
        <pre className="overflow-x-auto p-4">
          <code className="text-body-small text-on-surface font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-outline-variant overflow-hidden rounded-lg border">
      <div className="bg-surface-container border-outline-variant border-b px-4 py-2">
        <Typography variant="labelMedium" className="text-on-surface-variant">
          {title}
        </Typography>
      </div>
      <div className="bg-surface-container-low flex min-h-64 items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}

function NextStepCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a href={href} className="group block">
      <Card variant="outlined" className="hover:bg-surface-container h-full p-5 transition-colors">
        <div className="flex gap-4">
          <div className="bg-tertiary-container flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">
              {icon}
            </span>
          </div>
          <div>
            <Typography
              variant="titleMedium"
              className="group-hover:text-primary mb-1 transition-colors"
            >
              {title}
            </Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              {description}
            </Typography>
          </div>
        </div>
      </Card>
    </a>
  );
}
