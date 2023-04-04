import { BootstrapExecutorSchema } from './schema';
import { createCommand, parseArgs, runCommandProcess } from '../../utils/executor.util';
import { ParsedExecutorInterface } from '../../interfaces/parsed-executor.interface';
import { ExecutorContext } from '@nrwl/devkit';

export interface ParsedBootstrapExecutorOption extends ParsedExecutorInterface {
  profile?: string;
  app?: string;
  sourceRoot: string;
  root: string;
}

export default async function runExecutor(options: BootstrapExecutorSchema, context: ExecutorContext) {
  const normalizedOptions = normalizeOptions(options, context);
  const result = await runBootstrap(normalizedOptions, context);

  return {
    success: result,
  };
}

function runBootstrap(options: ParsedBootstrapExecutorOption, context: ExecutorContext) {
  const command = createCommand('bootstrap', options);
  return runCommandProcess(command, context.root);
}

function normalizeOptions(options: BootstrapExecutorSchema, context: ExecutorContext): ParsedBootstrapExecutorOption {
  const parsedArgs = parseArgs(options);
  let profile;

  if (Object.prototype.hasOwnProperty.call(options, 'profile')) {
    profile = `--profile ${options.profile}`;
  }

  // eslint-disable-next-line no-unsafe-optional-chaining
  const { sourceRoot, root } = context?.workspace?.projects[context.projectName];

  return {
    ...options,
    parseArgs: parsedArgs,
    profile,
    sourceRoot,
    root,
  };
}
