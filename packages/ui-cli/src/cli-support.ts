import chalk from 'chalk';
import prompts from 'prompts';

interface Choice<T> {
  title: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

export const log = {
  banner(title = 'Unisane'): void {
    console.log(chalk.cyan.bold(`\n${title}\n`));
  },
  success(message: string): void {
    console.log(chalk.green(`✔ ${message}`));
  },
  error(message: string): void {
    console.error(chalk.red(`✖ ${message}`));
  },
  warn(message: string): void {
    console.warn(chalk.yellow(`⚠ ${message}`));
  },
  info(message: string): void {
    console.log(chalk.blue(`ℹ ${message}`));
  },
  dim(message: string): void {
    console.log(chalk.dim(message));
  },
  newline(): void {
    console.log();
  },
};

export const prompt = {
  async confirm(options: { message: string; initial?: boolean }): Promise<boolean> {
    const response = await prompts(
      {
        type: 'confirm',
        name: 'value',
        message: options.message,
        initial: options.initial ?? false,
      },
      {
        onCancel: () => {
          throw new Error('Prompt cancelled.');
        },
      },
    );
    return typeof response.value === 'boolean' ? response.value : false;
  },
  async multiselect<T>(options: {
    message: string;
    choices: Choice<T>[];
    min?: number;
    max?: number;
  }): Promise<T[] | undefined> {
    const response = await prompts(
      {
        type: 'multiselect',
        name: 'value',
        message: options.message,
        choices: options.choices,
        min: options.min,
        max: options.max,
      },
      {
        onCancel: () => {
          throw new Error('Prompt cancelled.');
        },
      },
    );
    return Array.isArray(response.value) ? (response.value as T[]) : undefined;
  },
};
