'use client';

import Image from 'next/image';
import { Button, Card, Icon, Surface, Typography } from '@unisane/ui';
import { Badge } from '@unisane/ui/badge';
import { Divider } from '@unisane/ui/divider';

type CartItem = {
  name: string;
  thumbnail: string;
  thumbnailAlt: string;
  price: string;
  previousPrice?: string;
  savings?: string;
  quantity: number;
  details: Array<{ label: string; value: string }>;
};

const cartItems: CartItem[] = [
  {
    name: 'MacBook Pro 14” M3',
    thumbnail: '/images/home/cart-macbook.svg',
    thumbnailAlt: 'MacBook Pro 14 M3',
    price: '€2,859.99',
    previousPrice: '€4,085.70',
    savings: 'Save 30%',
    quantity: 1,
    details: [
      { label: 'Color', value: 'Space Gray' },
      { label: 'Memory', value: '8GB unified memory' },
    ],
  },
  {
    name: 'iPhone 15 Pro Max 256GB',
    thumbnail: '/images/home/cart-iphone.svg',
    thumbnailAlt: 'iPhone 15 Pro Max 256GB',
    price: '€1,619.99',
    quantity: 1,
    details: [{ label: 'Color', value: 'Blue Titanium' }],
  },
];

const completeWithItems = [
  {
    name: 'Apple Watch Series 9',
    thumbnail: '/images/home/cart-watch.svg',
    thumbnailAlt: 'Apple Watch Series 9',
  },
  {
    name: '11-inch iPad Pro',
    thumbnail: '/images/home/cart-ipad.svg',
    thumbnailAlt: '11-inch iPad Pro',
  },
] as const;

function QuantityControl({ value }: { value: number }) {
  return (
    <Surface
      tone="surface"
      rounded="sm"
      className="border-outline-variant pointer-events-none inline-flex items-center gap-1 border px-1.5 py-0.5"
    >
      <Icon symbol="remove" size={14} className="text-on-surface-variant" />
      <Typography
        variant="labelMedium"
        component="span"
        className="text-on-surface min-w-3 text-center"
      >
        {value}
      </Typography>
      <Icon symbol="add" size={14} className="text-on-surface-variant" />
    </Surface>
  );
}

export function ProductDetailCard() {
  return (
    <Card variant="outlined" className="bg-surface h-full">
      <Card.Content className="flex h-full min-h-0 flex-col gap-2 overflow-hidden px-3 py-3 font-normal @sm:px-4 @sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Icon symbol="close" size={18} className="text-on-surface-variant" />
            <Typography variant="titleMedium" component="p" className="text-on-surface">
              Shopping Cart
            </Typography>
          </div>
          <Typography variant="labelMedium" component="p" className="text-on-surface-variant">
            (2 items)
          </Typography>
        </div>

        <div className="space-y-1">
          <Typography variant="bodySmall" component="p" className="text-on-surface-variant">
            You are eligible for free shipping.
          </Typography>
          <Surface
            tone="surfaceContainerHighest"
            rounded="full"
            className="h-1 w-full overflow-hidden"
          >
            <Surface tone="primary" rounded="full" className="h-full w-4/4" />
          </Surface>
        </div>

        <Divider className="bg-outline-variant/70" />

        <div className="space-y-1">
          {cartItems.map((item, index) => (
            <div key={item.name} className="space-y-1.5 py-0.5">
              <div className="grid grid-cols-[46px_minmax(0,1fr)_auto] items-start gap-2">
                <Surface
                  tone="surface"
                  rounded="sm"
                  className="border-outline-variant flex h-[46px] w-[46px] items-center justify-center border p-1"
                >
                  <Image
                    src={item.thumbnail}
                    alt={item.thumbnailAlt}
                    width={160}
                    height={160}
                    className="h-full w-full object-contain"
                  />
                </Surface>

                <div className="space-y-0.5">
                  <Typography
                    variant="titleSmall"
                    component="p"
                    className="text-on-surface line-clamp-1 leading-tight"
                  >
                    {item.name}
                  </Typography>
                  {item.details.map((detail) => (
                    <Typography
                      key={`${item.name}-${detail.label}`}
                      variant="bodySmall"
                      component="p"
                      className="text-on-surface line-clamp-1"
                    >
                      <span className="text-on-surface-variant">{detail.label}:</span>{' '}
                      {detail.value}
                    </Typography>
                  ))}
                </div>

                <div className="space-y-0.5 text-right">
                  {item.previousPrice ? (
                    <Typography
                      variant="labelSmall"
                      component="p"
                      className="text-on-surface-variant line-through"
                    >
                      {item.previousPrice}
                    </Typography>
                  ) : null}
                  <Typography
                    variant="titleMedium"
                    component="p"
                    className="text-on-surface leading-tight"
                  >
                    {item.price}
                  </Typography>
                  {item.savings ? (
                    <Badge variant="tonal" color="success" size="sm" className="mt-0.5">
                      {item.savings}
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="mt-1.5 grid grid-cols-[46px_minmax(0,1fr)_auto] items-center gap-2">
                <div aria-hidden />
                <div className="text-on-surface-variant pointer-events-none inline-flex items-center gap-1">
                  <Icon symbol="delete" size={14} />
                  <Typography variant="labelMedium" component="p">
                    Remove
                  </Typography>
                </div>
                <div className="justify-self-end">
                  <QuantityControl value={item.quantity} />
                </div>
              </div>

              {index < cartItems.length - 1 ? <Divider className="mt-1" /> : null}
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-2">
          <Divider />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Typography variant="titleSmall" component="p" className="text-on-surface">
                Complete with
              </Typography>
              <Typography variant="labelMedium" component="p" className="text-on-surface-variant">
                View all
              </Typography>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {completeWithItems.map((item) => (
                <Surface
                  key={item.name}
                  tone="surface"
                  rounded="sm"
                  className="border-outline-variant flex items-center gap-1.5 border p-1.5"
                >
                  <Surface
                    tone="surface"
                    rounded="sm"
                    className="flex h-8 w-8 items-center justify-center p-0.5"
                  >
                    <Image
                      src={item.thumbnail}
                      alt={item.thumbnailAlt}
                      width={120}
                      height={120}
                      className="h-full w-full object-contain"
                    />
                  </Surface>
                  <Typography
                    variant="labelMedium"
                    component="p"
                    className="text-on-surface line-clamp-2 flex-1 leading-tight"
                  >
                    {item.name}
                  </Typography>
                  <Surface
                    tone="surface"
                    rounded="sm"
                    className="border-outline-variant pointer-events-none flex h-6 w-6 items-center justify-center border"
                  >
                    <Icon symbol="add" size={14} className="text-on-surface-variant" />
                  </Surface>
                </Surface>
              ))}
            </div>
          </div>

          <Divider />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Typography variant="titleMedium" component="p" className="text-on-surface">
                Subtotal:
              </Typography>
              <Typography variant="headlineSmall" component="p" className="text-on-surface">
                €4,479.98
              </Typography>
            </div>
            <Typography variant="bodySmall" component="p" className="text-on-surface-variant">
              Shipping, taxes, and discounts calculated at checkout.
            </Typography>
            <div className="grid grid-cols-2 gap-1.5">
              <Button variant="tonal" size="sm" className="pointer-events-none">
                View Cart
              </Button>
              <Button variant="filled" size="sm" className="pointer-events-none">
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
