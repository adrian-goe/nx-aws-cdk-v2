import * as path from 'path';

import { DeployExecutorSchema } from './schema';
import { createCommand, runCommandProcess, parseArgs } from '../../utils/executor.util';
import { ParsedExecutorInterface } from '../../interfaces/parsed-executor.interface';
import { ExecutorContext } from '@nrwl/devkit';

export interface ParsedDeployExecutorOption extends ParsedExecutorInterface {
  parseArgs?: Record<string, string>;
  stacks?: string[];
  sourceRoot: string;
  root: string;
}

export default async function runExecutor(options: DeployExecutorSchema, context: ExecutorContext) {
  const normalizedOptions = normalizeOptions(options, context);
  const result = await runDeploy(normalizedOptions, context);

  return {
    success: result,
  };
}

async function runDeploy(options: ParsedDeployExecutorOption, context: ExecutorContext) {
  const command = createCommand('deploy', options);
  return runCommandProcess(command, path.join(context.root, options.root));
}

function normalizeOptions(options: DeployExecutorSchema, context: ExecutorContext): ParsedDeployExecutorOption {
  const parsedArgs = parseArgs(options);
  let stacks;

  if (Object.prototype.hasOwnProperty.call(options, 'stacks')) {
    stacks = options.stacks;
  }

  // eslint-disable-next-line no-unsafe-optional-chaining
  const { sourceRoot, root } = context?.workspace?.projects[context.projectName];

  return {
    ...options,
    parseArgs: parsedArgs,
    stacks,
    sourceRoot,
    root,
  };
}
