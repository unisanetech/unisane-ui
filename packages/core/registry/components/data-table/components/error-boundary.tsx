'use client';

import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/components/ui/data-table/i18n';
import { DataTableError, DataTableErrorCode } from '@/components/ui/data-table/errors/base';
import { ErrorSeverity } from '@/components/ui/data-table/errors/severity';
import type { ErrorHub } from '@/components/ui/data-table/errors/error-hub';

// ─── ERROR STATE PROPS ───────────────────────────────────────────────────────

interface DataTableErrorDisplayProps {
  error: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
}

/**
 * Error state component for displaying table errors
 */
export function DataTableErrorDisplay({
  error,
  resetError,
  title,
  message,
}: DataTableErrorDisplayProps) {
  const { t } = useI18n();
  const displayTitle = title ?? t('errorTitle');
  const displayMessage = message ?? error.message ?? t('errorMessage');

  return (
    <div className="bg-surface border-outline-soft flex flex-col items-center justify-center rounded-lg border px-4 py-16 text-center">
      <div className="bg-error-container mb-4 flex h-12 w-12 items-center justify-center rounded-full">
        <Icon symbol="error" className="text-error h-6 w-6" />
      </div>
      <h3 className="text-title-medium text-on-surface mb-1">{displayTitle}</h3>
      <p className="text-body-medium text-on-surface-variant mb-4 max-w-md">{displayMessage}</p>
      {process.env.NODE_ENV === 'development' && (
        <details className="mb-4 w-full max-w-md text-left">
          <summary className="text-label-medium text-on-surface-variant hover:text-on-surface cursor-pointer">
            {t('errorDetails')}
          </summary>
          <pre className="bg-surface-container text-body-small text-error mt-2 max-h-32 overflow-auto rounded-sm p-3">
            {error.stack ?? error.message}
          </pre>
        </details>
      )}
      {resetError && (
        <Button variant="filled" onClick={resetError}>
          <Icon symbol="refresh" className="mr-2 h-4 w-4" />
          {t('retry')}
        </Button>
      )}
    </div>
  );
}

// ─── ERROR BOUNDARY PROPS ────────────────────────────────────────────────────

interface DataTableErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI when error occurs */
  fallback?: ReactNode | ((props: { error: Error; reset: () => void }) => ReactNode);
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Error hub to report errors to (integrates with DataTable error system) */
  errorHub?: ErrorHub;
}

interface DataTableErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for DataTable components
 * Catches JavaScript errors in child component tree and displays a fallback UI
 *
 * @example
 * ```tsx
 * <DataTableErrorBoundary
 *   onError={(error, info) => logError(error, info)}
 *   fallback={({ error, reset }) => (
 *     <CustomError error={error} onReset={reset} />
 *   )}
 * >
 *   <DataTable data={data} columns={columns} />
 * </DataTableErrorBoundary>
 * ```
 */
export class DataTableErrorBoundary extends Component<
  DataTableErrorBoundaryProps,
  DataTableErrorBoundaryState
> {
  constructor(props: DataTableErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): DataTableErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('DataTable Error:', error);
      console.error('Error Info:', errorInfo.componentStack);
    }

    // Report to error hub if available
    if (this.props.errorHub) {
      const dataTableError = new DataTableError(
        `React render error: ${error.message}`,
        DataTableErrorCode.RENDER_ERROR,
        {
          severity: ErrorSeverity.FATAL,
          cause: error,
          context: {
            componentStack: errorInfo.componentStack,
          },
        },
      );
      this.props.errorHub.report(dataTableError);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // Custom fallback render function
      if (typeof fallback === 'function') {
        return fallback({ error, reset: this.resetError });
      }

      // Custom fallback element
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return <DataTableErrorDisplay error={error} resetError={this.resetError} />;
    }

    return children;
  }
}

export default DataTableErrorBoundary;
