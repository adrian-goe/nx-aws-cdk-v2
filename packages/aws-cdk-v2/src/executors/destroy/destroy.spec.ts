import * as childProcess from 'child_process';
import * as path from 'path';

import { logger } from '@nrwl/devkit';

import { DestroyExecutorSchema } from './schema';
import executor from './destroy';
import { LARGE_BUFFER } from '../../utils/executor.util';
import { mockExecutorContext } from '../../utils/testing';

const options: DestroyExecutorSchema = {};

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
      `node ${process.env.NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js destroy`,
      expect.objectContaining({
        cwd: expect.stringContaining(path.join(context.root, context.workspace.projects['proj'].root)),
        env: process.env,
        maxBuffer: LARGE_BUFFER,
      })
    );

    expect(logger.debug).toHaveBeenLastCalledWith(
      `Executing command: node ${process.env.NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js destroy`
    );
  });

  it('run cdk destroy command stack', async () => {
    const option: DestroyExecutorSchema = Object.assign({}, options);
    const stackName = 'test';
    option['stacks'] = stackName;

    await executor(option, context);

    expect(childProcess.exec).toHaveBeenCalledWith(
      `node ${process.env.NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js destroy ${stackName}`,
      expect.objectContaining({
        env: process.env,
        maxBuffer: LARGE_BUFFER,
      })
    );

    expect(logger.debug).toHaveBeenLastCalledWith(
      `Executing command: node ${process.env.NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js destroy ${stackName}`
    );
  });
});
