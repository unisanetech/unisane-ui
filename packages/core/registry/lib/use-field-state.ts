'use client';

import { useId, type ReactNode } from 'react';

type UseFieldStateOptions = {
  id?: string;
  idPrefix: string;
  helperText?: ReactNode;
  active?: boolean;
  hasValue?: boolean;
  forceFloating?: boolean;
};

export function useFieldState({
  id,
  idPrefix,
  helperText,
  active = false,
  hasValue = false,
  forceFloating = false,
}: UseFieldStateOptions) {
  const generatedId = useId();
  const fieldId = id ?? `${idPrefix}-${generatedId}`;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const isFloating = forceFloating || active || hasValue;

  return {
    fieldId,
    helperId,
    isFloating,
  };
}
