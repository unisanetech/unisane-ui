'use client';

import Image from 'next/image';
import { Button } from '@unisane/ui/button';
import { Card } from '@unisane/ui/card';
import { Icon } from '@unisane/ui/icon';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';

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
    <Card variant="outlined" className="bg-surface h-full">
      <Card.Content className="flex h-full min-h-0 flex-col gap-2 p-0 font-normal">
        <Surface
          tone="surfaceContainerLow"
          rounded="sm"
          className="relative h-[33%] min-h-[72px] overflow-hidden"
        >
          <Image
            src="/images/home/stay-map.svg"
            alt="UrbanNord map preview"
            fill
            className="object-cover"
          />
          <Surface
            tone="surface"
            rounded="full"
            className="border-outline-variant absolute top-2 right-2 border px-2.5 py-0.5"
          >
            <Typography variant="titleSmall" component="p" className="text-on-surface">
              $1,320
            </Typography>
          </Surface>
        </Surface>

        <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-3 pb-3 @sm:px-4 @sm:pb-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <Typography
                variant="titleLarge"
                component="p"
                className="text-on-surface leading-tight"
              >
                UrbanNord
              </Typography>
              <div className="text-on-surface-variant flex items-center gap-1">
                <Icon symbol="location_on" size={14} className="text-on-surface-variant" />
                <Typography variant="bodySmall" component="p" className="text-on-surface-variant">
                  Germany, Berlin
                </Typography>
              </div>
            </div>

            <Surface
              tone="surfaceContainerLow"
              rounded="full"
              className="flex h-8 w-8 items-center justify-center"
            >
              <Icon symbol="favorite" size={18} filled className="text-error" />
            </Surface>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {previewImages.map((image) => (
              <Surface
                key={image.src}
                tone="surfaceContainerLow"
                rounded="sm"
                className="relative h-[46px] overflow-hidden"
              >
                <Image src={image.src} alt={image.alt} fill className="object-cover" />
                {image.overlay ? (
                  <div className="bg-scrim/55 absolute inset-0 flex items-center justify-center">
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
                  <Typography
                    variant="labelSmall"
                    component="p"
                    className="text-on-surface-variant line-clamp-1"
                  >
                    {amenity.label}
                  </Typography>
                  <Typography
                    variant="labelMedium"
                    component="p"
                    className="text-on-surface line-clamp-1"
                  >
                    {amenity.value}
                  </Typography>
                </div>
              </Surface>
            ))}
          </div>

          <div className="mt-auto flex items-end justify-between gap-2">
            <div className="min-w-0">
              <Typography
                variant="headlineLarge"
                component="p"
                className="text-on-surface leading-tight"
              >
                $180
              </Typography>
              <Typography variant="bodyMedium" component="p" className="text-on-surface-variant">
                / per night
              </Typography>
            </div>

            <Button
              variant="filled"
              size="sm"
              className="pointer-events-none h-8 shrink-0 rounded-full px-4"
            >
              Book Now
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
