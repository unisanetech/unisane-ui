export function generateScrollbarSection() {
  return `
/* ============================================================
   SCROLLBAR STYLING
   Consistent scrollbars for all modes
   ============================================================ */

/* Webkit scrollbar (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-surface-container-low);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--color-outline-variant);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-outline);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-outline-variant) var(--color-surface-container-low);
}

/* Dark mode scrollbar adjustments */
.dark ::-webkit-scrollbar-track,
:root:not(.light) ::-webkit-scrollbar-track {
  background: var(--color-surface-container);
}

.dark ::-webkit-scrollbar-thumb,
:root:not(.light) ::-webkit-scrollbar-thumb {
  background: var(--color-outline-variant);
}

.dark ::-webkit-scrollbar-thumb:hover,
:root:not(.light) ::-webkit-scrollbar-thumb:hover {
  background: var(--color-outline);
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    scrollbar-color: var(--color-outline-variant) var(--color-surface-container);
  }
}

.dark {
  scrollbar-color: var(--color-outline-variant) var(--color-surface-container);
}
`;
}
