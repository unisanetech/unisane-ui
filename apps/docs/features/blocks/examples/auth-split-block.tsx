'use client';

import { Button, Checkbox, Surface, TextField, Typography } from '@unisane/ui';

export function AuthSplitBlock() {
  return (
    <Surface
      tone="surface"
      rounded="sm"
      className="border-outline-variant grid h-full w-full overflow-hidden border @3xl:grid-cols-[minmax(0,1.1fr)_420px]"
    >
      <Surface
        tone="secondaryContainer"
        className="flex min-h-[420px] flex-col justify-between p-8"
      >
        <div className="space-y-4">
          <Typography variant="labelLarge" className="text-on-secondary-container/72">
            Team portal
          </Typography>
          <Typography
            variant="displaySmall"
            className="text-on-secondary-container max-w-[9ch] leading-[0.92]"
          >
            Welcome back.
          </Typography>
          <Typography
            variant="bodyLarge"
            className="text-on-secondary-container/82 max-w-[28ch] leading-relaxed"
          >
            Review approvals, manage handoffs, and coordinate cross-functional work from one
            workspace.
          </Typography>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Surface tone="surface" rounded="sm" className="p-4">
            <Typography variant="headlineSmall">24</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant mt-1">
              Active reviews
            </Typography>
          </Surface>
          <Surface tone="surface" rounded="sm" className="p-4">
            <Typography variant="headlineSmall">8</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant mt-1">
              Owners online
            </Typography>
          </Surface>
        </div>
      </Surface>

      <div className="flex min-h-[420px] items-center p-8">
        <Surface tone="surface" rounded="sm" className="w-full">
          <div className="space-y-5">
            <div className="space-y-2">
              <Typography variant="headlineSmall">Sign in</Typography>
              <Typography variant="bodyMedium" className="text-on-surface-variant">
                Continue to your operations workspace.
              </Typography>
            </div>

            <div className="space-y-3">
              <TextField
                id="block-auth-split-email"
                label="Email"
                placeholder="ops@northstar.so"
                size="sm"
                className="pointer-events-none"
              />
              <TextField
                id="block-auth-split-password"
                label="Password"
                placeholder="Enter password"
                size="sm"
                type="password"
                className="pointer-events-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Checkbox
                id="block-auth-split-remember"
                label="Remember me"
                defaultChecked
                className="pointer-events-none"
              />
              <Typography variant="bodySmall" className="text-primary">
                Forgot password?
              </Typography>
            </div>

            <div className="space-y-3">
              <Button className="pointer-events-none w-full">Sign in</Button>
              <Button variant="tonal" className="pointer-events-none w-full">
                Continue with Google
              </Button>
            </div>
          </div>
        </Surface>
      </div>
    </Surface>
  );
}
