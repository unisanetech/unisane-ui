export function generateSharedRuntimeUtilities() {
  return `
/* ============================================================
   SHARED RUNTIME UTILITIES
   Public utility aliases that source-mode and package-mode consumers
   both rely on at runtime.
   ============================================================ */

@layer utilities {
  .duration-short {
    transition-duration: var(--duration-short);
  }

  .duration-snappy {
    transition-duration: var(--duration-snappy);
  }

  .duration-medium {
    transition-duration: var(--duration-medium);
  }

  .duration-emphasized {
    transition-duration: var(--duration-emphasized);
  }

  .duration-long {
    transition-duration: var(--duration-long);
  }
}
`;
}
