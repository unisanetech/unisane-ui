'use client';

import { useState } from 'react';
import { Button } from '@unisane/ui/button';
import { ConfirmDialog } from '@unisane/ui/confirm-dialog';
import { Icon } from '@unisane/ui/icon';
import type { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';

function ConfirmDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Delete workspace
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        tone="danger"
        title="Delete workspace?"
        description="This permanently deletes the workspace and cannot be undone."
        confirmLabel="Delete"
        onConfirm={async () => {
          await Promise.resolve();
        }}
      />
    </>
  );
}

const ConfirmDialogHero = () => (
  <HeroBackground tone="surface">
    <div className="bg-surface border-outline-subtle w-80 overflow-hidden rounded-lg border shadow-lg">
      <div className="border-outline-subtle flex items-start gap-3 border-b p-5">
        <div className="bg-error-container text-on-error-container flex size-10 items-center justify-center rounded-md">
          <Icon symbol="warning" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-title-medium text-on-surface">Delete workspace?</p>
          <p className="text-body-small text-on-surface-variant">This action cannot be undone.</p>
        </div>
      </div>
      <div className="border-outline-subtle flex justify-end gap-2 border-t p-3">
        <Button variant="text" size="sm">
          Cancel
        </Button>
        <Button variant="filled" size="sm" className="bg-error text-on-error">
          Delete
        </Button>
      </div>
    </div>
  </HeroBackground>
);

export const confirmDialogDoc: ComponentDoc = {
  slug: 'confirm-dialog',
  name: 'Confirm Dialog',
  description:
    'Confirm Dialog owns the complete accessible lifecycle for consequential user decisions.',
  category: 'containment',
  status: 'stable',
  icon: 'warning',
  importPath: '@/components/ui/confirm-dialog',
  exports: ['ConfirmDialog', 'ConfirmDialogProps'],
  heroVisual: <ConfirmDialogHero />,
  docsLayout: { hideChoosing: true, hidePlacement: true },
  examples: [
    {
      id: 'danger-confirmation',
      title: 'Destructive confirmation',
      description: 'Success closes automatically; pending work blocks every dismissal path.',
      component: <ConfirmDialogExample />,
      code: `import { ConfirmDialog } from "@/components/ui/confirm-dialog";

<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  tone="danger"
  title="Delete workspace?"
  description="This permanently deletes the workspace and cannot be undone."
  confirmLabel="Delete"
  onConfirm={() => deleteWorkspace()}
  onConfirmError={(error) => reportError(error)}
/>`,
    },
  ],
  variants: [
    {
      name: 'tone',
      type: '"neutral" | "danger" | "warning"',
      default: '"neutral"',
      options: [
        { value: 'neutral', label: 'Neutral', description: 'Normal reversible decisions.' },
        { value: 'warning', label: 'Warning', description: 'Decisions requiring extra caution.' },
        { value: 'danger', label: 'Danger', description: 'Destructive or irreversible actions.' },
      ],
    },
  ],
  props: [
    { name: 'open', type: 'boolean', description: 'Controlled open state.' },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'Initial open state for uncontrolled use.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Reports every accepted state transition.',
    },
    {
      name: 'title',
      type: 'DialogTitle',
      required: true,
      description: 'Visible accessible name for the decision.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Concise consequence or supporting context.',
    },
    {
      name: 'onConfirm',
      type: '() => boolean | void | Promise<boolean | void>',
      required: true,
      description:
        'Runs the action. Success closes; returning false keeps the dialog open after a handled failure.',
    },
    {
      name: 'onConfirmError',
      type: '(error: unknown) => void',
      description: 'Receives rejected confirmation errors while the dialog remains open.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'External pending state; returned promises are tracked automatically.',
    },
    {
      name: 'confirmDisabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables only the confirm action.',
    },
    {
      name: 'confirmLabel / cancelLabel',
      type: 'string',
      description: 'Explicit labels for the decision actions.',
    },
    {
      name: 'onCancel',
      type: '() => void',
      description: 'Runs before cancellation closes the dialog.',
    },
  ],
  accessibility: {
    screenReader: [
      'Uses role="alertdialog", aria-modal, a visible labelled title, and an optional description.',
      'The generic close icon is omitted so the decision has exactly cancel and confirm actions.',
    ],
    keyboard: [
      { key: 'Escape', description: 'Cancels when no confirmation is pending.' },
      { key: 'Tab', description: 'Cycles between enabled actions and interactive body content.' },
    ],
    focus: [
      'Cancel receives initial focus as the safer action.',
      'Every dismissal path is blocked while confirmation is pending.',
      'Focus returns to the previous active element after close.',
    ],
  },
  implementation: {
    description:
      'Return the action promise. Return false only when the callback handles a failure and the user should retry.',
    code: `import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function RemoveMemberDialog({ open, setOpen, memberId }) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      tone="danger"
      title="Remove member?"
      description="They will immediately lose workspace access."
      confirmLabel="Remove"
      onConfirm={async () => {
        const result = await removeMember(memberId);
        return result.ok;
      }}
      onConfirmError={(error) => reportError(error)}
    />
  );
}`,
  },
  related: [
    { slug: 'dialog', reason: 'Use Dialog for forms or custom modal action layouts.' },
    { slug: 'alert', reason: 'Use Alert for non-modal status communication.' },
  ],
};
