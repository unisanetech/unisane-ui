'use client';

import { Button, Surface, TextField, Typography } from '@unisane/ui';

export function AiChatWorkspaceBlock() {
  return (
    <Surface
      tone="surface"
      rounded="sm"
      className="border-outline-variant h-full w-full overflow-hidden border"
    >
      <div className="flex min-h-[420px] flex-col justify-between p-5">
        <div className="space-y-4">
          <Surface tone="surfaceContainerLow" rounded="sm" className="ml-auto max-w-[75%] p-3">
            <Typography variant="bodyMedium">
              Turn this review queue into a cleaner triage flow with approval notes.
            </Typography>
          </Surface>
          <Surface tone="primaryContainer" rounded="sm" className="max-w-[82%] p-3.5">
            <Typography variant="bodyMedium" className="text-on-primary-container">
              I can scaffold a review workspace with list-detail layout, filters, and a supporting
              pane for properties.
            </Typography>
          </Surface>
          <Surface tone="surfaceContainerLow" rounded="sm" className="max-w-[82%] p-3.5">
            <Typography variant="bodyMedium" className="text-on-surface-variant">
              Included: queue list, detail panel, notes area, owner status, and escalation actions.
            </Typography>
          </Surface>
        </div>

        <Surface tone="surfaceContainerLow" rounded="sm" className="p-3">
          <TextField
            id="block-ai-chat-input"
            label="Ask anything"
            placeholder="Describe the app interface you need"
            size="sm"
            className="pointer-events-none"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {['attach_file', 'language', 'lightbulb'].map((icon) => (
                <Surface
                  key={icon}
                  tone="surface"
                  rounded="full"
                  className="flex h-8 w-8 items-center justify-center"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                    {icon}
                  </span>
                </Surface>
              ))}
            </div>
            <Button
              size="sm"
              className="pointer-events-none h-8 min-w-8 rounded-full px-0"
              aria-label="Send"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </Button>
          </div>
        </Surface>
      </div>
    </Surface>
  );
}
