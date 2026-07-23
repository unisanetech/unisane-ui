import { Button } from '@unisane/ui/button';
import { Card } from '@unisane/ui/card';
import { Checkbox } from '@unisane/ui/checkbox';
import { SelectField } from '@unisane/ui/select-field';
import { TextField } from '@unisane/ui/text-field';
import type { PatternPageDoc } from './types';
import { formsPatternMeta as meta } from './pattern-page-meta';

const heroVisual = (
  <div className="grid gap-3">
    <TextField id="forms-pattern-name" label="Workspace name" placeholder="Northstar" size="sm" />
    <div className="grid grid-cols-2 gap-3">
      <SelectField
        id="forms-pattern-plan"
        label="Plan"
        size="sm"
        value="growth"
        portal={false}
        options={[
          { value: 'starter', label: 'Starter' },
          { value: 'growth', label: 'Growth' },
        ]}
      />
      <TextField id="forms-pattern-owner" label="Owner" placeholder="Operations" size="sm" />
    </div>
    <Checkbox id="forms-pattern-notify" label="Notify owners on launch" defaultChecked />
    <div className="flex justify-end">
      <Button size="sm">Create workspace</Button>
    </div>
  </div>
);

export const formsPatternPage: PatternPageDoc = {
  ...meta,
  heroVisual,
  heroPreview: { tone: 'surfaceContainerLow', minHeight: 'md', padding: 'md' },
  sections: [
    {
      type: 'blocks',
      id: 'blocks',
      title: 'Form blocks',
      description:
        'Reusable form compositions built from the shared field family and action patterns.',
      previewDefaults: {
        tone: 'surfaceContainerLow',
        minHeight: 'lg',
        padding: 'md',
      },
      examples: [
        {
          id: 'workspace-setup-form',
          title: 'Workspace setup form',
          description:
            'A compact create flow with shared field sizing and one clear submit action.',
          component: (
            <Card variant="outlined" className="w-full max-w-[30rem]">
              <Card.Header>
                <Card.Title>Create workspace</Card.Title>
                <Card.Description>
                  Plan, ownership, modules, and notifications in one setup flow.
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-3">
                <TextField
                  id="pattern-workspace-name"
                  label="Workspace name"
                  placeholder="Northstar"
                  size="sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <SelectField
                    id="pattern-workspace-plan"
                    label="Plan"
                    size="sm"
                    value="growth"
                    portal={false}
                    options={[
                      { value: 'starter', label: 'Starter' },
                      { value: 'growth', label: 'Growth' },
                    ]}
                  />
                  <TextField
                    id="pattern-workspace-owner"
                    label="Owner"
                    placeholder="Operations"
                    size="sm"
                  />
                </div>
                <Checkbox
                  id="pattern-workspace-notify"
                  label="Notify owners when workspace is ready"
                  defaultChecked
                />
              </Card.Content>
              <Card.Footer className="justify-end">
                <Button size="sm">Create workspace</Button>
              </Card.Footer>
            </Card>
          ),
          code: `import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";

export function WorkspaceSetupForm() {
  return (
    <Card variant="outlined">
      <Card.Header>
        <Card.Title>Create workspace</Card.Title>
        <Card.Description>
          Plan, ownership, modules, and notifications in one setup flow.
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-3">
        <TextField id="workspace-name" label="Workspace name" placeholder="Northstar" size="sm" />
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            id="workspace-plan"
            label="Plan"
            size="sm"
            value="growth"
            portal={false}
            options={[
              { value: "starter", label: "Starter" },
              { value: "growth", label: "Growth" },
            ]}
          />
          <TextField id="workspace-owner" label="Owner" placeholder="Operations" size="sm" />
        </div>
        <Checkbox
          id="workspace-notify"
          label="Notify owners when workspace is ready"
          defaultChecked
        />
      </Card.Content>
      <Card.Footer className="justify-end">
        <Button size="sm">Create workspace</Button>
      </Card.Footer>
    </Card>
  );
}`,
        },
        {
          id: 'review-filter-form',
          title: 'Queue filter bar',
          description: 'Inline filters for review screens and operational queues.',
          component: (
            <Card variant="filled" className="w-full max-w-[34rem]">
              <Card.Content className="space-y-3">
                <div className="grid grid-cols-[minmax(0,1.5fr)_1fr_1fr] gap-3">
                  <TextField
                    id="pattern-filter-search"
                    label="Search"
                    placeholder="Search accounts"
                    size="sm"
                  />
                  <SelectField
                    id="pattern-filter-status"
                    label="Status"
                    size="sm"
                    value="review"
                    portal={false}
                    options={[
                      { value: 'review', label: 'In review' },
                      { value: 'blocked', label: 'Blocked' },
                    ]}
                  />
                  <SelectField
                    id="pattern-filter-owner"
                    label="Owner"
                    size="sm"
                    value="ops"
                    portal={false}
                    options={[
                      { value: 'ops', label: 'Operations' },
                      { value: 'billing', label: 'Billing' },
                    ]}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Checkbox id="pattern-filter-urgent" label="Urgent only" />
                  <Button variant="tonal" size="sm">
                    Apply filters
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ),
          code: `import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";

export function ReviewFilterBar() {
  return (
    <Card variant="filled">
      <Card.Content className="space-y-3">
        <div className="grid grid-cols-[minmax(0,1.5fr)_1fr_1fr] gap-3">
          <TextField id="filter-search" label="Search" placeholder="Search accounts" size="sm" />
          <SelectField
            id="filter-status"
            label="Status"
            size="sm"
            value="review"
            portal={false}
            options={[
              { value: "review", label: "In review" },
              { value: "blocked", label: "Blocked" },
            ]}
          />
          <SelectField
            id="filter-owner"
            label="Owner"
            size="sm"
            value="ops"
            portal={false}
            options={[
              { value: "ops", label: "Operations" },
              { value: "billing", label: "Billing" },
            ]}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Checkbox id="filter-urgent" label="Urgent only" />
          <Button variant="tonal" size="sm">Apply filters</Button>
        </div>
      </Card.Content>
    </Card>
  );
}`,
        },
      ],
    },
    {
      type: 'do-dont',
      id: 'guidance',
      title: 'Composition guidance',
      dos: [
        'Group related fields into small, scannable clusters.',
        'Use section titles sparingly and rely on spacing for rhythm.',
        'Keep the action area visually connected to the inputs it submits.',
      ],
      donts: [
        'Do not mix multiple field size systems in one form.',
        'Do not use switch for options that only apply on submit.',
        'Do not scatter validation state across unrelated surfaces.',
      ],
    },
    {
      type: 'links',
      id: 'components',
      title: 'Components used in form flows',
      items: [
        {
          title: 'Text Field',
          href: '/docs/components/text-field',
          description: 'Primary text input primitive for form-heavy screens.',
          icon: 'text_fields',
        },
        {
          title: 'Select',
          href: '/docs/components/select',
          description: 'Structured option selection with the shared field sizing contract.',
          icon: 'arrow_drop_down_circle',
        },
        {
          title: 'Checkbox',
          href: '/docs/components/checkbox',
          description: 'Submitted options and multi-select controls.',
          icon: 'check_box',
        },
      ],
    },
  ],
};
