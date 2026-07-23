// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Pagination, type PaginationLinkProps } from '../../src/components/pagination';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(ui);
  });

  return {
    root,
    container,
    async rerender(nextUi: React.ReactNode) {
      await act(async () => {
        root.render(nextUi);
      });
    },
  };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

async function click(element: Element, options?: MouseEventInit) {
  let dispatched = false;
  await act(async () => {
    dispatched = element.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, ...options }),
    );
  });
  return dispatched;
}

function pageLabels(container: HTMLElement) {
  return Array.from(container.querySelectorAll('[aria-label^="Page "]')).map((element) =>
    element.getAttribute('aria-label'),
  );
}

describe('Pagination', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing for an empty or invalid page collection', async () => {
    const rendered = await render(
      <Pagination currentPage={1} totalPages={0} onPageChange={() => {}} />,
    );

    expect(rendered.container.firstElementChild).toBeNull();

    await rendered.rerender(
      <Pagination currentPage={1} totalPages={Number.NaN} onPageChange={() => {}} />,
    );
    expect(rendered.container.firstElementChild).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('normalizes fractional and shrinking controlled bounds', async () => {
    const rendered = await render(
      <Pagination currentPage={20.8} totalPages={5.9} onPageChange={() => {}} />,
    );

    expect(
      rendered.container.querySelector('[aria-current="page"]')?.getAttribute('aria-label'),
    ).toBe('Page 5');
    expect(pageLabels(rendered.container)).toEqual([
      'Page 1',
      'Page 2',
      'Page 3',
      'Page 4',
      'Page 5',
    ]);
    expect(
      (rendered.container.querySelector('[aria-label="Next page"]') as HTMLButtonElement).disabled,
    ).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('builds stable start, middle, and end ranges from siblingCount', async () => {
    const rendered = await render(
      <Pagination currentPage={1} totalPages={10} siblingCount={1} onPageChange={() => {}} />,
    );
    expect(pageLabels(rendered.container)).toEqual([
      'Page 1',
      'Page 2',
      'Page 3',
      'Page 4',
      'Page 5',
      'Page 10',
    ]);
    expect(rendered.container.querySelectorAll('[aria-hidden="true"].px-2')).toHaveLength(1);

    await rendered.rerender(
      <Pagination currentPage={5} totalPages={10} siblingCount={1} onPageChange={() => {}} />,
    );
    expect(pageLabels(rendered.container)).toEqual([
      'Page 1',
      'Page 4',
      'Page 5',
      'Page 6',
      'Page 10',
    ]);

    await rendered.rerender(
      <Pagination currentPage={9} totalPages={10} siblingCount={0} onPageChange={() => {}} />,
    );
    expect(pageLabels(rendered.container)).toEqual(['Page 1', 'Page 8', 'Page 9', 'Page 10']);

    await cleanup(rendered.root, rendered.container);
  });

  it('uses one button action mode with bounded previous and next controls', async () => {
    const onPageChange = vi.fn();
    const rendered = await render(
      <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />,
    );

    expect(rendered.container.querySelectorAll('a')).toHaveLength(0);
    expect(rendered.container.querySelectorAll('button')).toHaveLength(5);

    await click(rendered.container.querySelector('[aria-label="Previous page"]')!);
    await click(rendered.container.querySelector('[aria-label="Page 3"]')!);
    await click(rendered.container.querySelector('[aria-label="Next page"]')!);

    expect(onPageChange.mock.calls).toEqual([[1], [3], [3]]);

    await cleanup(rendered.root, rendered.container);
  });

  it('uses native links for every active destination without preventing activation', async () => {
    const onPageChange = vi.fn();
    const rendered = await render(
      <Pagination
        currentPage={2}
        totalPages={3}
        getPageHref={(page) => `/results?page=${page}`}
        onPageChange={onPageChange}
      />,
    );

    expect(rendered.container.querySelectorAll('a')).toHaveLength(5);
    expect(rendered.container.querySelectorAll('button')).toHaveLength(0);
    expect(
      rendered.container.querySelector('[aria-label="Previous page"]')?.getAttribute('href'),
    ).toBe('/results?page=1');
    expect(rendered.container.querySelector('[aria-label="Next page"]')?.getAttribute('href')).toBe(
      '/results?page=3',
    );

    const link = rendered.container.querySelector('[aria-label="Page 3"]')!;
    expect(await click(link, { metaKey: true })).toBe(true);
    expect(onPageChange).toHaveBeenCalledWith(3);

    await cleanup(rendered.root, rendered.container);
  });

  it('gives a framework renderer complete anchor props', async () => {
    const received = vi.fn<(page: number, props: PaginationLinkProps) => void>();
    const rendered = await render(
      <Pagination
        currentPage={2}
        totalPages={3}
        getPageHref={(page) => `/catalog/${page}`}
        renderLink={(page, props) => {
          received(page, props);
          return <a data-framework-link="true" {...props} />;
        }}
      />,
    );

    expect(received).toHaveBeenCalledTimes(5);
    expect(received.mock.calls[2]?.[0]).toBe(2);
    expect(received.mock.calls[2]?.[1]).toMatchObject({
      href: '/catalog/2',
      'aria-current': 'page',
      'aria-label': 'Page 2',
    });
    expect(received.mock.calls[2]?.[1].children).toBeDefined();
    expect(rendered.container.querySelectorAll('[data-framework-link="true"]')).toHaveLength(5);

    await cleanup(rendered.root, rendered.container);
  });

  it('forwards the nav boundary and supports localizable accessible names', async () => {
    const ref = createRef<HTMLElement>();
    const rendered = await render(
      <Pagination
        ref={ref}
        currentPage={2}
        totalPages={3}
        onPageChange={() => {}}
        data-testid="results-pagination"
        labels={{
          navigation: 'Result pages',
          previous: 'Earlier results',
          next: 'Later results',
          page: (page) => `Result page ${page}`,
        }}
      />,
    );

    const nav = rendered.container.querySelector('nav');
    expect(ref.current).toBe(nav);
    expect(nav?.dataset.testid).toBe('results-pagination');
    expect(nav?.getAttribute('aria-label')).toBe('Result pages');
    expect(rendered.container.querySelector('[aria-label="Earlier results"]')).not.toBeNull();
    expect(rendered.container.querySelector('[aria-label="Later results"]')).not.toBeNull();
    expect(
      rendered.container
        .querySelector('[aria-label="Result page 2"]')
        ?.getAttribute('aria-current'),
    ).toBe('page');

    await cleanup(rendered.root, rendered.container);
  });
});
