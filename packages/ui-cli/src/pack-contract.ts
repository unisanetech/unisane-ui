export type UiPackEffect = 'offline' | 'read-network' | 'write' | 'spend-impact';
export type UiPackWriteTarget = 'project' | 'secret-store' | 'remote';
export type UiPackRiskGuard =
  | 'production'
  | 'security-sensitive'
  | 'destructive'
  | 'irreversible'
  | 'publish';

export interface UiPackCommandDescriptor {
  id: string;
  path: readonly string[];
  maximumEffect: UiPackEffect;
  writeTargets: UiPackWriteTarget[];
  riskGuards: UiPackRiskGuard[];
}

export interface UiPackCommandContext {
  argv: readonly string[];
  cwd: string;
  json?: boolean;
  selection?: {
    command: UiPackCommandDescriptor;
    packId: string;
  };
}

export interface UiPackCommandResult {
  schemaVersion: 1;
  command: string;
  pack: string;
  maximumEffect: UiPackEffect;
  actualEffect: UiPackEffect;
  writeTargets: UiPackWriteTarget[];
  riskGuards: UiPackRiskGuard[];
  status: 'ok' | 'failed';
  result: { exitCode: number; output: unknown };
  diagnostics: string[];
  artifacts: string[];
  nextActions: string[];
  presentation?: { stdout: string; stderr: string };
}

function parseCapturedOutput(stdout: string): unknown {
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return trimmed;
  }
}

function capturedExitCode(error: unknown): number | null {
  if (
    typeof error === 'object' &&
    error !== null &&
    'exitCode' in error &&
    typeof error.exitCode === 'number'
  ) {
    return error.exitCode;
  }
  return null;
}

export async function runCapturedUiCommand(
  context: UiPackCommandContext,
  run: () => Promise<void>,
): Promise<UiPackCommandResult> {
  const selection = context.selection;
  if (!selection) {
    throw new Error('[UI_CLI_SELECTION_MISSING] UI commands require exact pack selection.');
  }

  const stdoutWrite = process.stdout.write.bind(process.stdout);
  const stderrWrite = process.stderr.write.bind(process.stderr);
  const previousExitCode = process.exitCode;
  let stdout = '';
  let stderr = '';
  let exitCode = 0;
  process.exitCode = undefined;
  process.stdout.write = ((chunk: unknown) => {
    stdout += String(chunk);
    return true;
  }) as typeof process.stdout.write;
  process.stderr.write = ((chunk: unknown) => {
    stderr += String(chunk);
    return true;
  }) as typeof process.stderr.write;
  try {
    await run();
    exitCode = typeof process.exitCode === 'number' ? process.exitCode : 0;
  } catch (error) {
    exitCode = capturedExitCode(error) ?? 1;
    if (capturedExitCode(error) === null) {
      stderr += `${error instanceof Error ? error.message : String(error)}\n`;
    }
  } finally {
    process.stdout.write = stdoutWrite;
    process.stderr.write = stderrWrite;
    process.exitCode = previousExitCode;
  }

  return {
    schemaVersion: 1,
    command: selection.command.id,
    pack: selection.packId,
    maximumEffect: selection.command.maximumEffect,
    actualEffect: selection.command.maximumEffect,
    writeTargets: selection.command.writeTargets,
    riskGuards: selection.command.riskGuards,
    status: exitCode === 0 ? 'ok' : 'failed',
    result: { exitCode, output: parseCapturedOutput(stdout) },
    diagnostics: context.json && stderr.trim() ? [stderr.trim()] : [],
    artifacts: [],
    nextActions: [],
    ...(context.json ? {} : { presentation: { stdout, stderr } }),
  };
}
