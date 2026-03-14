import {
  ComponentCatalog,
  ComponentCatalogHeader,
} from "@/features/docs-page/components/component-catalog";

export default function ComponentsPage() {
  return (
    <div className="w-full pb-16 @3xl:pb-24">
      <ComponentCatalogHeader />
      <ComponentCatalog />
    </div>
  );
}
