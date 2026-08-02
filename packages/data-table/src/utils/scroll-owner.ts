export function findVerticalScrollOwner(element: HTMLElement): HTMLElement | null {
  let candidate = element.parentElement;

  while (candidate) {
    const { overflowY } = window.getComputedStyle(candidate);
    if (
      /(auto|scroll|overlay)/.test(overflowY) &&
      candidate.scrollHeight > candidate.clientHeight + 1
    ) {
      return candidate;
    }
    candidate = candidate.parentElement;
  }

  return null;
}
