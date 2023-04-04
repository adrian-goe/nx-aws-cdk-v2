import * as childProcess from 'child_process';
import * as path from 'path';

import { logger } from '@nrwl/devkit';

import { BootstrapExecutorSchema } from './schema';
import executor from './bootstrap';
import { generateCommandString, LARGE_BUFFER } from '../../utils/executor.util';
import { mockExecutorContext } from '../../utils/testing';

const options: BootstrapExecutorSchema = {};

const nodeCommandWithRelativePath = generateCommandString('bootstrap', 'apps/proj');

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
        cwd: expect.stringContaining(context.root),
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
