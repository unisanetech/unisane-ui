export { getNestedValue, setNestedValue, getNestedValueSafe, type GetNestedValueOptions } from "@/components/ui/data-table/utils/get-nested-value";
export {
  ensureRowIds,
  validateRowIds,
  findDuplicateRowIds,
} from "@/components/ui/data-table/utils/ensure-row-ids";

// Re-export error from errors module
export { DuplicateRowIdError } from "@/components/ui/data-table/errors";

// Deprecation utilities (for future use)
export {
  warnDeprecatedProp,
  resolveDeprecatedProp,
  clearDeprecationWarnings,
} from "@/components/ui/data-table/utils/deprecation";

// Grouping utilities
export {
  getNestedValue as getNestedGroupValue,
  formatGroupLabel,
  calculateAggregation,
  buildNestedGroups,
  buildGroupedData,
  type BuildGroupsOptions,
} from "@/components/ui/data-table/utils/grouping";

// Logger utility - standardized error handling
export {
  createLogger,
  logger,
  devWarn,
  logAndThrow,
  logRecoverable,
  withErrorLogging,
  withErrorLoggingSync,
  type LogLevel,
  type LogContext,
  type LoggerOptions,
} from "@/components/ui/data-table/utils/logger";

// Pagination utilities
export {
  getTotalPages,
  clampPage,
  getPageIndices,
  getPaginationState,
} from "@/components/ui/data-table/utils/pagination";

// Safe execution utilities - error handling wrappers
export {
  safeExecute,
  safeExecuteAsync,
  safeBatchExecute,
  createSafeFilter,
  createSafeFilters,
  createSafeSort,
  createSafeSearch,
  createSafeCellRenderer,
  createSafeAccessor,
  type SafeExecuteOptions,
  type CellRenderContext,
} from "@/components/ui/data-table/utils/safe-execute";

// Validation utilities - column and data validation
export {
  validateColumns,
  assertValidColumns,
  isValidColumnKey,
  findDuplicateColumnKeys,
  getAllColumnKeys,
  validateRowIds as validateRowIdsUniqueness,
  type ValidationResult,
  type ValidateColumnsOptions,
} from "@/components/ui/data-table/utils/validation";

// Controlled state desync warnings
export {
  DesyncDetector,
  createDesyncDetector,
  warnControlledDesync,
  type ControlledStateType,
  type DesyncWarning,
  type DesyncDetectorOptions,
} from "@/components/ui/data-table/utils/controlled-state-warnings";

// Type guards - safe DOM and object type checking
export {
  // DOM element guards
  isHTMLElement,
  isInputElement,
  isTextAreaElement,
  isButtonElement,
  isSelectElement,
  isTableCellElement,
  isTableRowElement,
  isEditableElement,
  isInteractiveElement,
  // Object guards
  isPlainObject,
  isArray,
  isString,
  isNumber,
  isBoolean,
  isDate,
  isDefined,
  isNullish,
  // Array utilities
  safeArrayAccess,
  first,
  last,
  // Event utilities
  shouldIgnoreEvent,
  closestElement,
  // Parse utilities
  safeParseInt,
  safeParseFloat,
} from "@/components/ui/data-table/utils/type-guards";
