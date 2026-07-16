'use client';

import { Card, Surface, Typography } from '@unisane/ui';
import { Badge } from '@unisane/ui/badge';
import { Checkbox } from '@unisane/ui/checkbox';
import { SelectField } from '@unisane/ui/select-field';
import { TextField } from '@unisane/ui/text-field';

const planOptions = [
  { value: 'starter', label: 'Starter' },
  { value: 'growth', label: 'Growth' },
  { value: 'enterprise', label: 'Enterprise' },
];

const ownerOptions = [
  { value: 'ops', label: 'Operations' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
];

export function WorkspaceSetupCard() {
  return (
    <Card variant="elevated" className="h-full">
      <Card.Header className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Card.Title>Create workspace</Card.Title>
            <Card.Description className="mt-2 max-w-[34ch]">
              Plan, ownership, modules, and notifications in one setup flow.
            </Card.Description>
          </div>
          <Badge color="primary" variant="tonal">
            Draft
          </Badge>
        </div>
      </Card.Header>

      <Card.Content className="space-y-3 px-4 py-0">
        <TextField
          id="home-hero-workspace"
          label="Workspace"
          placeholder="Northstar"
          size="sm"
          leadingIcon={
            <span className="material-symbols-outlined text-[16px] leading-none">domain</span>
          }
          className="pointer-events-none"
        />
        <TextField
          id="home-hero-support-email"
          label="Support email"
          placeholder="ops@northstar.so"
          size="sm"
          leadingIcon={
            <span className="material-symbols-outlined text-[16px] leading-none">
              alternate_email
            </span>
          }
          className="pointer-events-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            id="home-hero-plan"
            label="Plan"
            size="sm"
            options={planOptions}
            value="growth"
            portal={false}
            className="pointer-events-none"
          />
          <SelectField
            id="home-hero-owner"
            label="Owner"
            size="sm"
            options={ownerOptions}
            value="ops"
            portal={false}
            className="pointer-events-none"
          />
        </div>
        <Surface tone="surfaceContainerLow" rounded="sm" className="p-3.5">
          <Checkbox
            id="home-hero-notifications"
            label="Enable notifications"
            defaultChecked
            className="pointer-events-none"
          />
          <Typography
            variant="bodySmall"
            component="p"
            className="text-on-surface-variant mt-1 pl-13"
          >
            Alert owners for approvals and handoffs.
          </Typography>
        </Surface>
      </Card.Content>
    </Card>
  );
}
