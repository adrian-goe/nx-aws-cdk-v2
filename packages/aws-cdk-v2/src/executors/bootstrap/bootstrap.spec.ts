import * as childProcess from 'child_process';
import * as path from 'path';

import { logger } from '@nrwl/devkit';

import { BootstrapExecutorSchema } from './schema';
import executor from './bootstrap';
import { LARGE_BUFFER } from '../../utils/executor.util';
import { mockExecutorContext } from '../../utils/testing';

const options: BootstrapExecutorSchema = {};

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
      `node ${process.env.NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js bootstrap`,
      expect.objectContaining({
        cwd: expect.stringContaining(path.join(context.root, context.workspace.projects['proj'].root)),
        env: process.env,
        maxBuffer: LARGE_BUFFER,
      })
    );

    expect(logger.debug).toHaveBeenLastCalledWith(
      `Executing command: node ${process.env.NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js bootstrap`
    );
  });

  it('run cdk bootstrap command profile', async () => {
    const option: BootstrapExecutorSchema = Object.assign({}, options);
    const profile = 'prod';
    option['profile'] = profile;
    await executor(option, context);

    expect(childProcess.exec).toHaveBeenCalledWith(
      `node ${process.env.NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js bootstrap --profile ${profile}`,
      expect.objectContaining({
        env: process.env,
        maxBuffer: LARGE_BUFFER,
      })
    );

    expect(logger.debug).toHaveBeenLastCalledWith(
      `Executing command: node ${process.env.NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js bootstrap --profile ${profile}`
    );
  });
});
