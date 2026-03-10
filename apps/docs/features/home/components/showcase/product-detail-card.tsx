"use client";

import { Badge, Button, Card, Typography } from "@unisane/ui";

const productHighlights = [
  ["local_shipping", "Free express shipping"],
  ["verified", "Authenticity guarantee"],
] as const;

export function ProductDetailCard() {
  return (
    <Card variant="filled" className="h-full bg-surface">
      <Card.Header className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Typography variant="labelMedium" component="p" className="text-on-surface-variant">
              Commerce
            </Typography>
            <Card.Title className="mt-1">Opus SP wedge</Card.Title>
          </div>
          <Badge color="tertiary" variant="tonal">
            In stock
          </Badge>
        </div>
      </Card.Header>

      <Card.Content className="space-y-3 px-4 py-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-primary">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className="material-symbols-outlined text-[15px] leading-none"
              >
                star
              </span>
            ))}
          </div>
          <Typography
            variant="labelMedium"
            component="p"
            className="text-on-surface-variant"
          >
            27 reviews
          </Typography>
        </div>

        <div className="flex items-end gap-2">
          <Typography
            variant="headlineSmall"
            component="p"
            className="text-on-surface"
          >
            $190.89
          </Typography>
          <Typography
            variant="titleSmall"
            component="p"
            className="text-on-surface-variant line-through"
          >
            $229.99
          </Typography>
          <Badge color="error" variant="tonal">
            17% off
          </Badge>
        </div>

        <Typography
          variant="bodySmall"
          component="p"
          className="line-clamp-3 text-on-surface-variant"
        >
          Limited-run equipment with premium finishing, clean weighting, and a
          performance-first profile for demanding rounds.
        </Typography>

        <div className="space-y-2">
          {productHighlights.map(([icon, label]) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                {icon}
              </span>
              <Typography
                variant="bodySmall"
                component="p"
                className="text-on-surface-variant"
              >
                {label}
              </Typography>
            </div>
          ))}
        </div>
      </Card.Content>

      <Card.Footer className="gap-2.5 px-4 pt-0 pb-4">
        <Button variant="filled" size="sm" className="pointer-events-none flex-1">
          Add to cart
        </Button>
        <Button
          variant="outlined"
          size="sm"
          className="pointer-events-none px-3"
          aria-label="Save item"
        >
          <span className="material-symbols-outlined text-[18px]">favorite</span>
        </Button>
      </Card.Footer>
    </Card>
  );
}
