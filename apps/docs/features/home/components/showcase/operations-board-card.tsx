'use client';

import Image from 'next/image';
import { Button, Card, Icon, Surface, Typography } from '@unisane/ui';

type PreviewImage = {
  src: string;
  alt: string;
  overlay?: string;
};

const previewImages: PreviewImage[] = [
  {
    src: '/images/home/stay-room-1.svg',
    alt: 'UrbanNord room preview 1',
  },
  {
    src: '/images/home/stay-room-2.svg',
    alt: 'UrbanNord room preview 2',
  },
  {
    src: '/images/home/stay-room-3.svg',
    alt: 'UrbanNord room preview 3',
    overlay: '+7',
  },
];

const amenities = [
  { icon: 'square_foot', label: 'Area', value: '78sqm' },
  { icon: 'bathtub', label: 'Rooms', value: '5.2 bath' },
  { icon: 'local_parking', label: 'Parking', value: '2 garages' },
] as const;

export function OperationsBoardCard() {
  return (
    <Card variant="outlined" className="h-full bg-surface">
      <Card.Content className="flex h-full min-h-0 flex-col gap-2 p-0 font-normal">
        <Surface tone="surfaceContainerLow" rounded="sm" className="relative h-[33%] min-h-[72px] overflow-hidden">
          <Image src="/images/home/stay-map.svg" alt="UrbanNord map preview" fill className="object-cover" />
          <Surface
            tone="surface"
            rounded="full"
            className="absolute top-2 right-2 border border-outline-variant px-2.5 py-0.5"
          >
            <Typography variant="titleSmall" component="p" className="text-on-surface">
              $1,320
            </Typography>
          </Surface>
        </Surface>

        <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-3 pb-3 @sm:px-4 @sm:pb-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <Typography variant="titleLarge" component="p" className="text-on-surface leading-tight">
                UrbanNord
              </Typography>
              <div className="flex items-center gap-1 text-on-surface-variant">
                <Icon symbol="location_on" size={14} className="text-on-surface-variant" />
                <Typography variant="bodySmall" component="p" className="text-on-surface-variant">
                  Germany, Berlin
                </Typography>
              </div>
            </div>

            <Surface tone="surfaceContainerLow" rounded="full" className="flex h-8 w-8 items-center justify-center">
              <Icon symbol="favorite" size={18} filled className="text-error" />
            </Surface>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {previewImages.map((image) => (
              <Surface key={image.src} tone="surfaceContainerLow" rounded="sm" className="relative h-[46px] overflow-hidden">
                <Image src={image.src} alt={image.alt} fill className="object-cover" />
                {image.overlay ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-scrim/55">
                    <Typography variant="titleMedium" component="p" className="text-on-surface">
                      {image.overlay}
                    </Typography>
                  </div>
                ) : null}
              </Surface>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-1">
            {amenities.map((amenity) => (
              <Surface
                key={amenity.label}
                tone="surfaceContainerLow"
                rounded="full"
                className="flex items-center gap-1.5 px-2 py-1"
              >
                <Surface
                  tone="surface"
                  rounded="full"
                  className="flex h-5 w-5 items-center justify-center"
                >
                  <Icon symbol={amenity.icon} size={12} className="text-tertiary" />
                </Surface>
                <div className="min-w-0">
                  <Typography variant="labelSmall" component="p" className="line-clamp-1 text-on-surface-variant">
                    {amenity.label}
                  </Typography>
                  <Typography variant="labelMedium" component="p" className="line-clamp-1 text-on-surface">
                    {amenity.value}
                  </Typography>
                </div>
              </Surface>
            ))}
          </div>

          <div className="mt-auto flex items-end justify-between gap-2">
            <div className="min-w-0">
              <Typography variant="headlineLarge" component="p" className="leading-tight text-on-surface">
                $180
              </Typography>
              <Typography variant="bodyMedium" component="p" className="text-on-surface-variant">
                / per night
              </Typography>
            </div>

            <Button variant="filled" size="sm" className="pointer-events-none h-8 shrink-0 rounded-full px-4">
              Book Now
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
