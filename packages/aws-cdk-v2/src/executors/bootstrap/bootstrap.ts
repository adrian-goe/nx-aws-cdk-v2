import * as path from 'path';

import { BootstrapExecutorSchema } from './schema';
import { createCommand, parseArgs, runCommandProcess } from '../../utils/executor.util';
import { ParsedExecutorInterface } from '../../interfaces/parsed-executor.interface';
import { ExecutorContext } from '@nrwl/devkit';

export interface ParsedBootstrapExecutorOption extends ParsedExecutorInterface {
  parseArgs?: Record<string, string>;
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
  return runCommandProcess(command, path.join(context.root, options.root));
}

function normalizeOptions(options: BootstrapExecutorSchema, context: ExecutorContext): ParsedBootstrapExecutorOption {
  const parsedArgs = parseArgs(options);
  let profile;

  if (Object.prototype.hasOwnProperty.call(options, 'profile')) {
    profile = `--profile ${options.profile}`;
  }

  const { sourceRoot, root } = context?.workspace?.projects[context.projectName];

  return {
    ...options,
    parseArgs: parsedArgs,
    profile,
    sourceRoot,
    root,
  };
}
