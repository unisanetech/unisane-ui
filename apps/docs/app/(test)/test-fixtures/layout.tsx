import { notFound } from 'next/navigation';

export default function TestRouteLayout({ children }: { children: React.ReactNode }) {
  const testRoutesEnabled =
    process.env.NODE_ENV !== 'production' || process.env.UNISANE_UI_TEST_ROUTES === '1';

  if (!testRoutesEnabled) {
    notFound();
  }

  return children;
}
