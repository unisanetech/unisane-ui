import { DocsShell } from "@/features/shell";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsShell>{children}</DocsShell>;
}
