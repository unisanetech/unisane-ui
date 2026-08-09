// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../src/components/accordion';
import { Avatar, AvatarGroup } from '../../src/components/avatar';
import { BottomAppBar, BottomAppBarAction } from '../../src/components/bottom-app-bar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../src/components/breadcrumb';
import {
  FeedLayout,
  ListDetailLayout,
  SupportingPaneLayout,
} from '../../src/components/canonical-layouts';
import { Card } from '../../src/components/card';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../src/components/command';
import { FabMenu } from '../../src/components/fab-menu';
import { ModeSwitcher } from '../../src/components/mode-switcher';
import { PaneGroup } from '../../src/components/pane-group';
import { Progress } from '../../src/components/progress';
import { Rating } from '../../src/components/rating';
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonText,
} from '../../src/components/skeleton';
import { Slider } from '../../src/components/slider';
import { StatCard, StatGrid } from '../../src/components/stat-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src/components/table';
import { TopAppBar } from '../../src/components/top-app-bar';
import { AppearanceProvider } from '../../src/layout/appearance-provider';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => root.render(ui));
  return { root, container };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => root.unmount());
  container.remove();
}

async function click(element: Element) {
  await act(async () => element.dispatchEvent(new MouseEvent('click', { bubbles: true })));
}

describe('remaining public component fleet', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as typeof ResizeObserver;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme-mode');
    document.documentElement.classList.remove('dark');
  });

  it('Accordion owns accessible expanded state', async () => {
    const rendered = await render(
      <Accordion>
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>Account details</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const trigger = rendered.container.querySelector('button')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(rendered.container.querySelector('[role="region"]')?.getAttribute('aria-hidden')).toBe(
      'false',
    );
    await cleanup(rendered.root, rendered.container);
  });

  it('Avatar and AvatarGroup expose meaningful image and group labels', async () => {
    const rendered = await render(
      <AvatarGroup max={1}>
        <Avatar fallback="Ada" />
        <Avatar fallback="Grace" />
      </AvatarGroup>,
    );
    expect(rendered.container.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe(
      'Avatar group',
    );
    expect(rendered.container.querySelector('[aria-label="1 more"]')).not.toBeNull();
    await cleanup(rendered.root, rendered.container);
  });

  it('BottomAppBar forwards native attributes, refs, and action state', async () => {
    const ref = createRef<HTMLDivElement>();
    const rendered = await render(
      <BottomAppBar ref={ref} aria-label="Document actions" data-testid="bar">
        <BottomAppBarAction icon={<span>+</span>} label="Create" active />
      </BottomAppBar>,
    );
    expect(ref.current?.dataset.testid).toBe('bar');
    expect(ref.current?.getAttribute('role')).toBe('toolbar');
    expect(rendered.container.querySelector('button')?.getAttribute('aria-pressed')).toBe('true');
    await cleanup(rendered.root, rendered.container);
  });

  it('Breadcrumb uses navigation, list, link, and current-page semantics', async () => {
    const rendered = await render(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(rendered.container.querySelector('nav')?.getAttribute('aria-label')).toBe('breadcrumb');
    expect(rendered.container.querySelector('a')?.getAttribute('href')).toBe('/');
    expect(rendered.container.querySelector('ol')?.textContent).toContain('Settings');
    await cleanup(rendered.root, rendered.container);
  });

  it('canonical layout recipes preserve their distinct structural boundaries', async () => {
    const rendered = await render(
      <>
        <ListDetailLayout list={<span>List</span>} detail={<span>Detail</span>} />
        <SupportingPaneLayout
          main={<span>Main</span>}
          supporting={<span>Support</span>}
          defaultOpen
        />
        <FeedLayout>
          <article>Feed item</article>
        </FeedLayout>
      </>,
    );
    expect(rendered.container.querySelector('[data-pane="list"]')).not.toBeNull();
    expect(rendered.container.querySelector('[data-pane="main"]')?.getAttribute('role')).toBe(
      'main',
    );
    expect(rendered.container.querySelector('aside')).not.toBeNull();
    expect(rendered.container.textContent).toContain('Feed item');
    await cleanup(rendered.root, rendered.container);
  });

  it('Card chooses a native button only for actionable content', async () => {
    const rendered = await render(
      <>
        <Card>Passive</Card>
        <Card onClick={() => undefined}>Action</Card>
      </>,
    );
    expect(rendered.container.querySelectorAll('button')).toHaveLength(1);
    expect(rendered.container.querySelector('button')?.textContent).toContain('Action');
    await cleanup(rendered.root, rendered.container);
  });

  it('Command exposes the combobox and option collection owned by cmdk', async () => {
    const rendered = await render(
      <Command>
        <CommandInput aria-label="Search commands" />
        <CommandList>
          <CommandEmpty>Nothing found</CommandEmpty>
          <CommandItem value="open">Open</CommandItem>
        </CommandList>
      </Command>,
    );
    expect(rendered.container.querySelector('[cmdk-input]')?.getAttribute('aria-label')).toBe(
      'Search commands',
    );
    expect(rendered.container.querySelector('[cmdk-item]')?.textContent).toBe('Open');
    await cleanup(rendered.root, rendered.container);
  });

  it('FabMenu controls menu visibility and invokes one action', async () => {
    const onAction = vi.fn();
    const rendered = await render(
      <FabMenu actions={[{ label: 'Add note', icon: <span>+</span>, onClick: onAction }]} />,
    );
    const trigger = rendered.container.querySelector('[aria-haspopup="menu"]')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    await click(rendered.container.querySelector('[role="menuitem"]')!);
    expect(onAction).toHaveBeenCalledOnce();
    await cleanup(rendered.root, rendered.container);
  });

  it('ModeSwitcher writes appearance mode through the shared provider', async () => {
    const rendered = await render(
      <AppearanceProvider enabledAxes={['mode']} persistence="none">
        <ModeSwitcher />
      </AppearanceProvider>,
    );
    const dark = Array.from(rendered.container.querySelectorAll('[role="radio"]')).find((node) =>
      node.textContent?.includes('Dark'),
    )!;
    await click(dark);
    expect(dark.getAttribute('aria-checked')).toBe('true');
    expect(document.documentElement.getAttribute('data-theme-mode')).toBe('dark');
    await cleanup(rendered.root, rendered.container);
  });

  it('PaneGroup keeps sidebar and detail ownership explicit', async () => {
    const rendered = await render(
      <PaneGroup sidebar={<span>Results</span>} detail={<span>Preview</span>} showDetail />,
    );
    expect(rendered.container.textContent).toContain('Results');
    expect(rendered.container.textContent).toContain('Preview');
    await cleanup(rendered.root, rendered.container);
  });

  it('Progress publishes determinate and indeterminate ARIA values without runtime style injection', async () => {
    const rendered = await render(
      <>
        <Progress value={42} />
        <Progress variant="circular" indeterminate />
      </>,
    );
    const bars = rendered.container.querySelectorAll('[role="progressbar"]');
    expect(bars[0]?.getAttribute('aria-valuenow')).toBe('42');
    expect(bars[1]?.hasAttribute('aria-valuenow')).toBe(false);
    expect(document.getElementById('unisane-progress-indeterminate')).toBeNull();
    await cleanup(rendered.root, rendered.container);
  });

  it('Rating behaves as a native radio group', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(<Rating defaultValue={2} onValueChange={onValueChange} />);
    const radios = rendered.container.querySelectorAll('[role="radio"]');
    expect(radios).toHaveLength(5);
    await click(radios[3]!);
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(radios[3]?.getAttribute('aria-checked')).toBe('true');
    await cleanup(rendered.root, rendered.container);
  });

  it('Skeleton recipes remain presentation-only and hidden from assistive technology', async () => {
    const rendered = await render(
      <>
        <Skeleton width={20} />
        <SkeletonText />
        <SkeletonAvatar />
        <SkeletonCard />
      </>,
    );
    expect(
      rendered.container.querySelectorAll('[aria-hidden="true"]').length,
    ).toBeGreaterThanOrEqual(6);
    await cleanup(rendered.root, rendered.container);
  });

  it('Slider delegates value and label semantics to a native range input', async () => {
    const rendered = await render(
      <Slider aria-label="Volume" defaultValue={25} min={0} max={80} />,
    );
    const input = rendered.container.querySelector('input')!;
    expect(input.type).toBe('range');
    expect(input.getAttribute('aria-label')).toBe('Volume');
    expect(input.getAttribute('aria-valuenow')).toBe('25');
    expect(input.getAttribute('aria-valuemax')).toBe('80');
    await cleanup(rendered.root, rendered.container);
  });

  it('StatCard and StatGrid retain semantic content without a second data model', async () => {
    const rendered = await render(
      <StatGrid columns={2}>
        <StatCard label="Revenue" value="$12k" trend={{ value: 8, direction: 'up' }} />
      </StatGrid>,
    );
    expect(rendered.container.textContent).toContain('Revenue');
    expect(rendered.container.textContent).toContain('↑8%');
    await cleanup(rendered.root, rendered.container);
  });

  it('Table recipes render native table structure', async () => {
    const rendered = await render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(rendered.container.querySelector('table')).not.toBeNull();
    expect(rendered.container.querySelector('th')?.scope).toBe('col');
    expect(rendered.container.querySelector('td')?.textContent).toBe('Ada');
    await cleanup(rendered.root, rendered.container);
  });

  it('TopAppBar uses a native header and forwards native attributes and refs', async () => {
    const ref = createRef<HTMLElement>();
    const rendered = await render(
      <TopAppBar ref={ref} title="Workspace" data-testid="top" actions={<button>Save</button>} />,
    );
    expect(ref.current?.tagName).toBe('HEADER');
    expect(ref.current?.dataset.testid).toBe('top');
    expect(ref.current?.getAttribute('aria-label')).toBe('Workspace');
    await cleanup(rendered.root, rendered.container);
  });
});
