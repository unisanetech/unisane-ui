'use client';

import { Button, Checkbox, Surface, TextField, Typography } from '@unisane/ui';

export function AuthCenteredBlock() {
  return (
    <Surface
      tone="surfaceContainerLow"
      rounded="sm"
      className="flex min-h-[420px] w-full items-center justify-center p-8"
    >
      <Surface
        tone="surface"
        rounded="sm"
        className="border-outline-variant/15 shadow-1 w-full max-w-[26rem] border p-6"
      >
        <div className="space-y-5">
          <div className="space-y-2 text-center">
            <Typography variant="headlineSmall">Create account</Typography>
            <Typography variant="bodyMedium" className="text-on-surface-variant">
              Start a new workspace and invite your team.
            </Typography>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextField
              id="block-auth-centered-first-name"
              label="First name"
              placeholder="Estelle"
              size="sm"
              className="pointer-events-none"
            />
            <TextField
              id="block-auth-centered-last-name"
              label="Last name"
              placeholder="Frye"
              size="sm"
              className="pointer-events-none"
            />
          </div>

          <div className="space-y-3">
            <TextField
              id="block-auth-centered-email"
              label="Email"
              placeholder="estelle@northstar.so"
              size="sm"
              className="pointer-events-none"
            />
            <TextField
              id="block-auth-centered-password"
              label="Password"
              placeholder="Create password"
              size="sm"
              type="password"
              className="pointer-events-none"
            />
          </div>

          <Checkbox
            id="block-auth-centered-terms"
            label="I agree to the platform terms"
            defaultChecked
            className="pointer-events-none"
          />

          <div className="space-y-3">
            <Button className="pointer-events-none w-full">Create account</Button>
            <Typography variant="bodySmall" className="text-on-surface-variant text-center">
              Already have an account? <span className="text-primary">Sign in</span>
            </Typography>
          </div>
        </div>
      </Surface>
    </Surface>
  );
}
