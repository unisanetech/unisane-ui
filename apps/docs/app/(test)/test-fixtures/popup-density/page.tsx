'use client';
import { useState } from 'react';
import { PopupDensityProvider } from '@unisane/ui/popup-density-provider';
import { SelectField } from '@unisane/ui/select-field';
import { Combobox } from '@unisane/ui/combobox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@unisane/ui/dropdown-menu';
import { Button } from '@unisane/ui/button';
const options = [
  { value: 'first', label: 'First option' },
  { value: 'disabled', label: 'Unavailable option', disabled: true },
  {
    value: 'long',
    label: 'A longer choice that can wrap naturally when the available width is constrained',
  },
];
export default function PopupDensityFixture() {
  const [choice, setChoice] = useState('first');
  return (
    <main className="bg-surface text-on-surface min-h-dvh" style={{ padding: 24 }}>
      <h1>Popup density</h1>
      <PopupDensityProvider density="compact">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            maxWidth: 384,
            gap: 24,
            marginTop: 24,
          }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent size="lg">
              <DropdownMenuItem>Review</DropdownMenuItem>
              <DropdownMenuItem disabled>Unavailable action</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SelectField
            label="Select choice"
            labelPlacement="stacked"
            size="md"
            value={choice}
            onValueChange={setChoice}
            options={options}
          />
          <Combobox
            label="Search choice"
            size="md"
            value={choice}
            onValueChange={setChoice}
            options={options}
          />
          <p aria-live="polite">Selected: {choice}</p>
        </div>
      </PopupDensityProvider>
    </main>
  );
}
