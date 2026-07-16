'use client';

import { Button, Card, Surface, Typography } from '@unisane/ui';
import { TextField } from '@unisane/ui/text-field';

const prompts = ['What is causing this error?', 'Is contrast strong enough?'] as const;

const tools = ['attach_file', 'language', 'lightbulb', 'more_horiz'] as const;

export function AiChatCard() {
  return (
    <Card variant="low" className="bg-surface h-full">
      <Card.Content className="flex h-full flex-col px-5 py-5">
        <div className="flex flex-1 flex-col justify-between gap-5">
          <div className="flex flex-1 items-center justify-center">
            <Typography
              variant="headlineMedium"
              component="p"
              className="text-on-surface max-w-[11ch] text-center leading-tight"
            >
              What can I help with?
            </Typography>
          </div>

          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2.5">
              {prompts.map((prompt) => (
                <Surface key={prompt} tone="surfaceContainerLow" rounded="sm" className="p-3.5">
                  <Typography variant="bodySmall" component="p" className="text-on-surface">
                    {prompt}
                  </Typography>
                </Surface>
              ))}
            </div>

            <Surface tone="surfaceContainerLow" rounded="sm" className="p-3">
              <TextField
                id="home-hero-chat-input"
                label="Ask anything"
                placeholder="Ask anything"
                size="sm"
                className="pointer-events-none"
              />
              <div className="mt-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {tools.map((icon) => (
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
                  variant="filled"
                  size="sm"
                  className="pointer-events-none h-8 min-w-8 rounded-full px-0"
                  aria-label="Send message"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                </Button>
              </div>
            </Surface>

            <Typography
              variant="bodySmall"
              component="p"
              className="text-on-surface-variant px-1 text-center"
            >
              AI can make mistakes. Please double-check responses.
            </Typography>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
