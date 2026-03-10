import { DocsShell } from "@/features/shell";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsShell showHeader={false} contentWidth="fluid" contentInset="none">
      {children}
    </DocsShell>
  );
}
