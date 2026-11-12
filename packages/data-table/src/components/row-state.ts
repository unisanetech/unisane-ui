interface RowInteractionState {
  isSelected?: boolean;
  isActive?: boolean;
  isFocused?: boolean;
}

interface RowBackgroundState extends RowInteractionState {
  zebra?: boolean;
  isOddRow?: boolean;
}

// Style only the row and its immediate cells. Never create an ancestor hover
// group: nested action controls own their own hover and focus feedback.
export function getRowHoverBackgroundClass({
  isSelected = false,
  isActive = false,
  isFocused = false,
  isDropTarget = false,
}: RowInteractionState & { isDropTarget?: boolean }): string | null {
  if (isSelected || isActive || isFocused || isDropTarget) return null;
  return 'hover:bg-surface-container-low hover:[&>td]:bg-surface-container-low';
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
