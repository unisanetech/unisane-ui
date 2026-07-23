interface RowInteractionState {
  isSelected?: boolean;
  isActive?: boolean;
  isFocused?: boolean;
}

interface RowBackgroundState extends RowInteractionState {
  zebra?: boolean;
  isOddRow?: boolean;
}

export function getRowInteractionBackgroundClass({
  isSelected = false,
  isActive = false,
  isFocused = false,
}: RowInteractionState): string | null {
  if (isSelected) return 'bg-surface-container-high';
  if (isActive) return 'bg-surface-container';
  if (isFocused) return 'bg-surface-container-low';
  return null;
}

export function getRowBackgroundClass({
  isSelected = false,
  isActive = false,
  isFocused = false,
  zebra = false,
  isOddRow = false,
}: RowBackgroundState): string {
  return (
    getRowInteractionBackgroundClass({ isSelected, isActive, isFocused }) ??
    (zebra && isOddRow ? 'bg-surface-container-lowest' : 'bg-surface')
  );
}
