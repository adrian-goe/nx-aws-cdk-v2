import { DestroyExecutorSchema } from './schema';
import { createCommand, parseArgs, runCommandProcess } from '../../utils/executor.util';
import { ParsedExecutorInterface } from '../../interfaces/parsed-executor.interface';
import { ExecutorContext } from '@nx/devkit';

export interface ParsedDestroyExecutorOption extends ParsedExecutorInterface {
  stacks?: string[];
  app?: string;
  sourceRoot: string;
  root: string;
}

export default async function runExecutor(options: DestroyExecutorSchema, context: ExecutorContext) {
  const normalizedOptions = normalizeOptions(options, context);
  const result = await runDestroy(normalizedOptions, context);

  return {
    success: result,
  };
}

function runDestroy(options: ParsedDestroyExecutorOption, context: ExecutorContext) {
  const command = createCommand('destroy', options);
  return runCommandProcess(command, context.root);
}

function normalizeOptions(options: DestroyExecutorSchema, context: ExecutorContext): ParsedDestroyExecutorOption {
  const parsedArgs = parseArgs(options);
  let stacks;

  if (Object.prototype.hasOwnProperty.call(options, 'stacks')) {
    stacks = options.stacks;
  }

  // eslint-disable-next-line no-unsafe-optional-chaining
  const { sourceRoot, root } = context.projectsConfigurations.projects[context.projectName];

  return {
    ...options,
    parseArgs: parsedArgs,
    stacks,
    sourceRoot,
    root,
  };
}
