import { COMPONENT_REGISTRY } from '@/lib/docs/registry/selectors';

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPONENT_REGISTRY.map(({ slug }) => ({ slug }));
}

export default function ComponentDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
