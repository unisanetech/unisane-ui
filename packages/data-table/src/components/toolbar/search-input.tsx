'use client';

import { useState, useEffect, useRef, useCallback, useId } from 'react';
import { cn } from '@unisane/ui/utils';
import { Icon } from '@unisane/ui/icon';
import { Button } from '@unisane/ui/button';
import { IconButton } from '@unisane/ui/icon-button';
import { useFiltering } from '../../context';
import { useDebounce } from '../../hooks/utilities/use-debounce';
import { useI18n } from '../../i18n';

const SEARCH_DEBOUNCE_MS = 300;

interface SearchInputProps {
  /** Additional class names */
  className?: string;
  /** Placeholder text - if not provided, uses i18n default */
  placeholder?: string;
  /** Whether to enable Cmd+K / Ctrl+K keyboard shortcut to focus search */
  enableGlobalShortcut?: boolean;
}

/**
 * Responsive search input component using container queries.
 *
 * Container breakpoints (based on parent @container):
 * - < @3xl: Icon button that opens full-width overlay within toolbar
 * - @3xl+: Fixed-width inline input field (240px)
 *
 * This follows the dataflow-extract ReviewHeader pattern where
 * search adapts to container width, not viewport width.
 */
export function SearchInput({
  className,
  placeholder,
  enableGlobalShortcut = true,
}: SearchInputProps) {
  const { t } = useI18n();
  const { searchText, setSearch } = useFiltering();
  const effectivePlaceholder = placeholder ?? t('searchPlaceholder');
  const searchId = useId();
  const descriptionId = `${searchId}-desc`;
  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState(searchText);
  // Overlay expanded state (for smaller containers)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  // Debounced value for actual filtering
  const debouncedValue = useDebounce(localValue, SEARCH_DEBOUNCE_MS);
  // Track previous searchText to detect external clears
  const prevSearchTextRef = useRef(searchText);
  // Input ref for focus management
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: Cmd+K / Ctrl+K to focus search
  useEffect(() => {
    if (!enableGlobalShortcut) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();

        // If on small screen (overlay mode), open the overlay
        // Otherwise focus the inline input
        const isSmallScreen = !window.matchMedia('(min-width: 1024px)').matches;
        if (isSmallScreen) {
          setIsOverlayOpen(true);
        } else {
          inputRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [enableGlobalShortcut]);

  // Sync debounced value to context
  useEffect(() => {
    if (debouncedValue !== searchText) {
      setSearch(debouncedValue);
    }
  }, [debouncedValue, searchText, setSearch]);

  // Sync external changes (e.g., clear from filter chips)
  useEffect(() => {
    if (prevSearchTextRef.current !== '' && searchText === '') {
      setLocalValue('');
    }
    prevSearchTextRef.current = searchText;
  }, [searchText]);

  // Focus overlay input when expanded
  useEffect(() => {
    if (isOverlayOpen) {
      setTimeout(() => overlayInputRef.current?.focus(), 50);
    }
  }, [isOverlayOpen]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    setSearch('');
  }, [setSearch]);

  const handleOverlayClose = useCallback(() => {
    setIsOverlayOpen(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        if (isOverlayOpen) {
          handleOverlayClose();
        } else {
          inputRef.current?.blur();
        }
      }
    },
    [isOverlayOpen, handleOverlayClose],
  );

  // Check if there's an active search (to show indicator on icon)
  const hasActiveSearch = searchText.length > 0;

  return (
    <>
      {/* Small/Medium containers (< @3xl): Icon button that opens overlay */}
      <IconButton
        variant="standard"
        size="md"
        aria-label={t('openSearch')}
        onClick={() => setIsOverlayOpen(true)}
        className={cn('relative @3xl:hidden', className)}
        selected={hasActiveSearch}
        icon={
          <>
            <Icon symbol="search" />
            {hasActiveSearch && (
              <span className="bg-primary absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
            )}
          </>
        }
      />

      {/* Search overlay (takes full toolbar width) - visible when isOverlayOpen */}
      {isOverlayOpen && (
        <div
          className={cn(
            'bg-surface border-primary absolute top-0 right-0 bottom-0 left-0 z-50 flex items-center gap-2 border-b-2 px-3 @3xl:hidden',
            'animate-in fade-in duration-150',
          )}
        >
          <Icon symbol="search" className="text-on-surface-variant h-5 w-5 shrink-0" />
          <input
            ref={overlayInputRef}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            placeholder={effectivePlaceholder}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={t('searchPlaceholder')}
            className={cn(
              'h-full min-w-0 flex-1 border-none bg-transparent outline-none',
              'text-body-medium text-on-surface placeholder:text-on-surface-variant',
            )}
          />
          {localValue && (
            <Button
              onClick={handleClear}
              variant="text"
              size="sm"
              className="text-primary shrink-0"
            >
              {t('clear')}
            </Button>
          )}
          <IconButton
            variant="standard"
            size="md"
            onClick={handleOverlayClose}
            className="shrink-0"
            aria-label={t('clearSearch')}
            icon={<Icon symbol="close" />}
          />
        </div>
      )}

      {/* Large containers (@3xl+): Inline input field */}
      <div
        role="search"
        aria-label={t('searchPlaceholder')}
        className={cn(
          'bg-surface border-outline-subtle relative hidden h-9 items-center rounded border @3xl:flex',
          'focus-within:border-primary focus-within:ring-focus-ring focus-within:ring-1',
          'w-60 transition-all duration-200',
          className,
        )}
      >
        <span id={descriptionId} className="sr-only">
          {effectivePlaceholder}
        </span>
        <span className="flex h-full w-9 shrink-0 items-center justify-center" aria-hidden="true">
          <Icon symbol="search" className="text-on-surface-variant h-5 w-5" />
        </span>
        <input
          id={searchId}
          ref={inputRef}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          placeholder={effectivePlaceholder}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-describedby={descriptionId}
          aria-label={t('searchPlaceholder')}
          className={cn(
            'text-body-medium h-full min-w-0 flex-1 bg-transparent pr-2',
            'text-on-surface placeholder:text-on-surface-variant outline-none',
          )}
        />
        {localValue && (
          <IconButton
            onClick={handleClear}
            variant="standard"
            size="sm"
            className="shrink-0"
            aria-label={t('clearSearch')}
            icon={<Icon symbol="close" />}
          />
        )}
      </div>
    </>
  );
}

// ─── MOBILE SEARCH OVERLAY ──────────────────────────────────────────────────

interface MobileSearchOverlayProps {
  /** Whether the overlay is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Placeholder text - if not provided, uses i18n default */
  placeholder?: string;
}

/**
 * Full-screen search overlay for mobile devices.
 * Based on the dataflow-extract ReviewHeader pattern.
 */
export function MobileSearchOverlay({ isOpen, onClose, placeholder }: MobileSearchOverlayProps) {
  const { t } = useI18n();
  const { searchText, setSearch } = useFiltering();
  const effectivePlaceholder = placeholder ?? t('searchPlaceholder');
  const [localValue, setLocalValue] = useState(searchText);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce(localValue, SEARCH_DEBOUNCE_MS);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Sync debounced value to context
  useEffect(() => {
    if (debouncedValue !== searchText) {
      setSearch(debouncedValue);
    }
  }, [debouncedValue, searchText, setSearch]);

  // Sync external clears
  useEffect(() => {
    if (searchText === '' && localValue !== '') {
      setLocalValue('');
    }
  }, [searchText, localValue]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    setSearch('');
  }, [setSearch]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'bg-surface absolute inset-0 z-50 flex items-center px-2',
        'animate-in fade-in slide-in-from-top-2 duration-200',
      )}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-1 items-center gap-2">
        <Icon symbol="search" className="text-on-surface-variant ml-2 h-5 w-5 shrink-0" />
        <input
          ref={inputRef}
          autoFocus
          type="text"
          inputMode="search"
          enterKeyHint="search"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={effectivePlaceholder}
          className={cn(
            'flex-1 border-none bg-transparent outline-none',
            'text-body-large text-on-surface placeholder:text-on-surface-variant h-12',
          )}
        />
        <div className="flex shrink-0 items-center gap-2">
          {localValue && (
            <Button
              onClick={handleClear}
              variant="text"
              size="sm"
              className="text-on-surface-variant hover:text-on-surface"
            >
              {t('clear')}
            </Button>
          )}
          <IconButton
            variant="standard"
            size="md"
            onClick={handleClose}
            aria-label={t('clearSearch')}
            icon={<Icon symbol="close" />}
          />
        </div>
      </div>
    </div>
  );
}
