"use client";

import { useState } from "react";
import { ComponentDoc } from "../types";
import { HeroBackground } from "../../runtime/hero-background";
import { DatePicker, MonthPicker } from "@unisane/ui";

const MonthPickerHeroVisual = () => (
  <HeroBackground tone="secondary">
    <div className="bg-surface w-80 rounded-sm border border-outline-variant p-6 shadow-xl">
      <div className="text-label-medium text-on-surface-variant mb-2">Month</div>
      <div className="border-outline-variant flex items-center justify-between rounded-sm border-2 px-4 py-3">
        <span className="text-body-medium text-on-surface">Mar 2026</span>
        <span className="material-symbols-outlined text-on-surface-variant">calendar_today</span>
      </div>
      <div className="bg-surface-container mt-2 rounded-sm p-4 shadow-2">
        <div className="mb-3 flex items-center justify-between">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_left</span>
          <span className="text-title-small text-on-surface">2026</span>
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
            <div
              key={month}
              className={`rounded-sm px-3 py-2 text-center text-label-medium ${
                month === "Mar" ? "bg-primary text-on-primary" : "text-on-surface"
              }`}
            >
              {month}
            </div>
          ))}
        </div>
      </div>
    </div>
  </HeroBackground>
);

const MonthPickerBasicExample = () => {
  const [month, setMonth] = useState("2026-03");
  return (
    <div className="w-full max-w-xs">
      <MonthPicker label="Start month" value={month} onValueChange={setMonth} />
    </div>
  );
};

export const monthPickerDoc: ComponentDoc = {
  slug: "month-picker",
  name: "Month Picker",
  description:
    "Month picker provides a compact field and popover grid for selecting month-level values.",
  category: "text-inputs",
  status: "stable",
  icon: "calendar_month",
  importPath: "@unisane/ui",
  exports: ["MonthPicker"],
  heroVisual: <MonthPickerHeroVisual />,
  examplesPreview: {
    overflow: "visible",
    minHeight: "lg",
  },
  choosing: {
    description:
      "Choose month picker when the product needs month/year precision instead of exact dates.",
    columns: {
      emphasis: "Component",
      component: "Preview",
      rationale: "When to use",
      examples: "Common uses",
    },
    rows: [
      {
        emphasis: "Month Picker",
        component: (
          <div className="w-56">
            <MonthPicker label="Month" value="2026-03" />
          </div>
        ),
        rationale: "Use when day-level precision would add noise.",
        examples: "Resume timelines, billing months, reporting periods",
      },
      {
        emphasis: "Date Picker",
        component: (
          <div className="w-56">
            <DatePicker label="Date" value={new Date(2026, 2, 13)} />
          </div>
        ),
        rationale: "Use when exact day selection matters.",
        examples: "Appointments, deadlines, event dates",
      },
    ],
  },
  placement: {
    description:
      "Month pickers are commonly used in forms that need period-level precision.",
    previewDefaults: {
      overflow: "visible",
      minHeight: "lg",
      align: "start",
      justify: "start",
    },
    examples: [
      {
        title: "Form input",
        visual: <MonthPickerBasicExample />,
        caption: "Click to open the month grid.",
      },
    ],
  },
  props: [
    {
      name: "value",
      type: "string",
      description: "Controlled month value in YYYY-MM format.",
    },
    {
      name: "defaultValue",
      type: "string",
      description: "Default month value in YYYY-MM format.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Callback fired when a month is selected.",
    },
    {
      name: "open",
      type: "boolean",
      description: "Controlled open state for the month popover.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "false",
      description: "Initial open state for uncontrolled usage.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback fired when the month popover opens or closes.",
    },
    {
      name: "label",
      type: "string",
      default: '"Month"',
      description: "Label for the trigger field.",
    },
    {
      name: "variant",
      type: '"outlined" | "filled"',
      default: '"outlined"',
      description: "Visual style variant of the trigger field.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Shared field size used for the trigger height and spacing.",
    },
    {
      name: "min",
      type: "string",
      description: "Minimum selectable month in YYYY-MM format.",
    },
    {
      name: "max",
      type: "string",
      description: "Maximum selectable month in YYYY-MM format.",
    },
  ],
  accessibility: {
    screenReader: [
      "Input is properly labeled.",
      "Month popup is announced when opened.",
      "Selected month is displayed in the trigger field.",
    ],
    keyboard: [
      { key: "Enter/Space", description: "Open month popup from the trigger field." },
      { key: "Escape", description: "Close month popup." },
    ],
    focus: ["Focus visible on trigger field and month buttons."],
  },
  implementation: {
    description: "Use controlled state for month values stored as YYYY-MM.",
    code: `import { MonthPicker } from "@unisane/ui";
import { useState } from "react";

function TimelineForm() {
  const [startMonth, setStartMonth] = useState("2026-03");

  return (
    <MonthPicker
      label="Start month"
      value={startMonth}
      onValueChange={setStartMonth}
    />
  );
}`,
  },
  related: [
    {
      slug: "date-picker",
      reason: "Use for exact day-level dates.",
    },
    {
      slug: "text-field",
      reason: "Base field component used internally.",
    },
  ],
};
