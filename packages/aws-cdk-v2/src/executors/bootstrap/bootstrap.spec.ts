import * as childProcess from 'child_process';
import * as path from 'path';

import { detectPackageManager, logger } from '@nrwl/devkit';

import { BootstrapExecutorSchema } from './schema';
import executor from './bootstrap';
import { LARGE_BUFFER } from '../../utils/executor.util';
import { mockExecutorContext } from '../../utils/testing';

const options: BootstrapExecutorSchema = {};

const NX_WORKSPACE_ROOT = process.env.NX_WORKSPACE_ROOT ?? '';
if (!NX_WORKSPACE_ROOT) {
  throw new Error('CDK not Found');
}

const packageManager = detectPackageManager();
const generatePath = `"${packageManager} dlx ts-node --require tsconfig-paths/register --project ${NX_WORKSPACE_ROOT}/tsconfig.base.json"`;
const nodeCommandWithRelativePath = `node --require ts-node/register ${NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js -a ${generatePath} bootstrap`;

describe('aws-cdk-v2 Bootstrap Executor', () => {
  const context = mockExecutorContext('bootstrap');

  beforeEach(async () => {
    jest.spyOn(logger, 'debug');
    jest.spyOn(childProcess, 'exec');
  });

  afterEach(() => jest.clearAllMocks());

  it('run cdk bootstrap command', async () => {
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

  it('run cdk bootstrap command profile', async () => {
    const option: BootstrapExecutorSchema = Object.assign({}, options);
    const profile = 'prod';
    option['profile'] = profile;
    await executor(option, context);

    expect(childProcess.exec).toHaveBeenCalledWith(
      `${nodeCommandWithRelativePath} --profile ${profile}`,
      expect.objectContaining({
        env: process.env,
        maxBuffer: LARGE_BUFFER,
      })
    );

    expect(logger.debug).toHaveBeenLastCalledWith(
      `Executing command: ${nodeCommandWithRelativePath} --profile ${profile}`
    );
  });
});
