export type SelectionControlSize = 'sm' | 'md';

export const selectionControlSizeClasses: Record<
  SelectionControlSize,
  {
    control: string;
    frame: string;
    icon: string;
    radioDot: string;
  }
> = {
  sm: {
    control: 'h-[18px] w-[18px]',
    frame: 'h-7 w-7',
    icon: 'h-[18px] w-[18px] p-[3px]',
    radioDot: 'after:h-2 after:w-2',
  },
  md: {
    control: 'size-icon-sm',
    frame: 'h-10 w-10',
    icon: 'size-icon-sm p-0.5',
    radioDot: 'after:h-2.5 after:w-2.5',
  },
};
