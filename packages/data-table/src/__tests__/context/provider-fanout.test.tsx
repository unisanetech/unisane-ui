import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableProvider } from "../../context/provider";
import { usePagination } from "../../context/hooks/use-pagination";
import { useSelection } from "../../context/hooks/use-selection";
import type { Column } from "../../types";

type TestRow = {
  id: string;
  name: string;
};

const testColumns: Column<TestRow>[] = [{ key: "name", header: "Name" }];

function PaginationProbe({
  onRender,
}: {
  onRender: (snapshot: { page: number; pageSize: number }) => void;
}) {
  const { page, pageSize } = usePagination();
  onRender({ page, pageSize });

  return (
    <div data-testid="pagination-probe">
      {page}:{pageSize}
    </div>
  );
}

function SelectionToggle() {
  const { toggleSelect } = useSelection();

  return (
    <button type="button" onClick={() => toggleSelect("row-1")}>
      Toggle selection
    </button>
  );
}

describe("DataTableProvider slice subscriptions", () => {
  it("does not rerender pagination consumers when selection state changes", () => {
    const renderSpy = vi.fn<(snapshot: { page: number; pageSize: number }) => void>();

    render(
      <DataTableProvider columns={testColumns} initialPageSize={25}>
        <PaginationProbe onRender={renderSpy} />
        <SelectionToggle />
      </DataTableProvider>
    );

    const initialRenderCount = renderSpy.mock.calls.length;
    expect(initialRenderCount).toBeGreaterThan(0);
    expect(screen.getByTestId("pagination-probe").textContent).toBe("1:25");

    fireEvent.click(screen.getByRole("button", { name: "Toggle selection" }));

    expect(renderSpy).toHaveBeenCalledTimes(initialRenderCount);
    expect(screen.getByTestId("pagination-probe").textContent).toBe("1:25");
  });
});
