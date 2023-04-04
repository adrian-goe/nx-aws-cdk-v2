import * as childProcess from 'child_process';
import * as path from 'path';

import { detectPackageManager, logger } from '@nrwl/devkit';

import { DestroyExecutorSchema } from './schema';
import executor from './destroy';
import { LARGE_BUFFER } from '../../utils/executor.util';
import { mockExecutorContext } from '../../utils/testing';

const options: DestroyExecutorSchema = {};

const NX_WORKSPACE_ROOT = process.env.NX_WORKSPACE_ROOT ?? '';
if (!NX_WORKSPACE_ROOT) {
  throw new Error('CDK not Found');
}

const packageManager = detectPackageManager();
const generatePath = `"${packageManager} dlx ts-node --require tsconfig-paths/register --project ${NX_WORKSPACE_ROOT}/tsconfig.base.json"`;
const nodeCommandWithRelativePath = `node --require ts-node/register ${NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js -a ${generatePath} destroy`;

describe('aws-cdk-v2 Destroy Executor', () => {
  const context = mockExecutorContext('destroy');

  beforeEach(async () => {
    jest.spyOn(logger, 'debug');
    jest.spyOn(childProcess, 'exec');
  });

  afterEach(() => jest.clearAllMocks());

  it('run cdk destroy command', async () => {
    await executor(options, context);

    expect(childProcess.exec).toHaveBeenCalledWith(
      nodeCommandWithRelativePath,
      expect.objectContaining({
        cwd: expect.stringContaining(path.join(context.root, context.workspace.projects['proj'].root)),
        env: process.env,
        maxBuffer: LARGE_BUFFER,
      })
    );

    expect(logger.debug).toHaveBeenLastCalledWith(`Executing command: ${nodeCommandWithRelativePath}`);
  });

  it('run cdk destroy command stack', async () => {
    const option: DestroyExecutorSchema = Object.assign({}, options);
    const stackName = 'test';
    option['stacks'] = stackName;

    await executor(option, context);

    expect(childProcess.exec).toHaveBeenCalledWith(
      `${nodeCommandWithRelativePath} ${stackName}`,
      expect.objectContaining({
        env: process.env,
        maxBuffer: LARGE_BUFFER,
      })
    );

    expect(logger.debug).toHaveBeenLastCalledWith(`Executing command: ${nodeCommandWithRelativePath} ${stackName}`);
  });
});
