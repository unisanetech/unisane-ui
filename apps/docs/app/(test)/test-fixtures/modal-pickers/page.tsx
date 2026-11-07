'use client';

import { useState } from 'react';
import { Button } from '@unisane/ui/button';
import { Combobox } from '@unisane/ui/combobox';
import { Dialog } from '@unisane/ui/dialog';
import { Sheet } from '@unisane/ui/sheet';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@unisane/ui/select';

export default function ModalPickersFixture() {
  const [open, setOpen] = useState(false);
  const [presentation, setPresentation] = useState('dialog');
  const [choice, setChoice] = useState('');
  const fields = (
    <div className="space-y-4">
      <div data-testid="invoice-field">
        <Combobox
          label="Invoice"
          value={choice}
          onValueChange={setChoice}
          options={Array.from({ length: 40 }, (_, index) => ({
            value: `invoice-${index + 1}`,
            label: `Old invoice ${index + 1}`,
          }))}
          hasMore
          onLoadMore={() => {}}
        />
      </div>
      <Select>
        <SelectTrigger aria-label="Status">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
        </SelectContent>
      </Select>
      <p aria-live="polite">Selected: {choice || 'None'}</p>
    </div>
  );
  return (
    <main className="bg-surface text-on-surface min-h-dvh p-4">
      <div className="flex flex-wrap gap-2">
        {['dialog', 'fullscreen', 'right', 'bottom'].map((value) => (
          <Button
            key={value}
            onClick={() => {
              setPresentation(value);
              setOpen(true);
            }}
          >
            Open {value}
          </Button>
        ))}
      </div>
      {presentation === 'dialog' || presentation === 'fullscreen' ? (
        <Dialog
          title="Review old payment"
          open={open}
          onOpenChange={setOpen}
          mobilePresentation={presentation === 'fullscreen' ? 'fullscreen' : 'centered'}
          actions={<Button onClick={() => setOpen(false)}>Done</Button>}
        >
          {fields}
        </Dialog>
      ) : (
        <Sheet
          title="Review old payment"
          open={open}
          onOpenChange={setOpen}
          placement={presentation === 'bottom' ? 'bottom' : 'right'}
          footer={<Button onClick={() => setOpen(false)}>Done</Button>}
        >
          {fields}
        </Sheet>
      )}
    </main>
  );
}
