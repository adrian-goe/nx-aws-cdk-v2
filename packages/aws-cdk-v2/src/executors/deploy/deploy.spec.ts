import * as path from 'path';
import * as childProcess from 'child_process';
import { detectPackageManager, logger } from '@nrwl/devkit';

import executor from './deploy';
import { DeployExecutorSchema } from './schema';
import { LARGE_BUFFER } from '../../utils/executor.util';
import { mockExecutorContext } from '../../utils/testing';

const options: DeployExecutorSchema = {};

const NX_WORKSPACE_ROOT = process.env.NX_WORKSPACE_ROOT ?? '';
if (!NX_WORKSPACE_ROOT) {
  throw new Error('CDK not Found');
}

const packageManager = detectPackageManager();
const generatePath = `"${packageManager} dlx ts-node --require tsconfig-paths/register --project ${NX_WORKSPACE_ROOT}/tsconfig.base.json"`;
const nodeCommandWithRelativePath = `node --require ts-node/register ${NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js -a ${generatePath} deploy`;

describe('aws-cdk-v2 deploy Executor', () => {
  const context = mockExecutorContext('deploy');

  beforeEach(async () => {
    jest.spyOn(logger, 'debug');
    jest.spyOn(childProcess, 'exec');
  });

  afterEach(() => jest.clearAllMocks());

  it('run cdk deploy command', async () => {
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

  it('run cdk deploy command stack', async () => {
    const option: DeployExecutorSchema = Object.assign({}, options);
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

  it('run cdk deploy command context options', async () => {
    const option: DeployExecutorSchema = Object.assign({}, options);
    const contextOptionString = 'key=value';
    option['context'] = contextOptionString;
    await executor(option, context);

    expect(childProcess.exec).toHaveBeenCalledWith(
      `${nodeCommandWithRelativePath} --context ${contextOptionString}`,
      expect.objectContaining({
        env: process.env,
        maxBuffer: LARGE_BUFFER,
      })
    );

    expect(logger.debug).toHaveBeenLastCalledWith(
      `Executing command: ${nodeCommandWithRelativePath} --context ${contextOptionString}`
    );
  });

  it('run cdk deploy command with multiple context options', async () => {
    const option: DeployExecutorSchema = Object.assign({}, options);
    const contextOptions = ['firstKey=firstValue', 'secondKey=secondValue'];
    option['context'] = contextOptions;
    await executor(option, context);

    const contextCmd = contextOptions.map((option) => `--context ${option}`).join(' ');
    expect(childProcess.exec).toHaveBeenCalledWith(
      `${nodeCommandWithRelativePath} ${contextCmd}`,
      expect.objectContaining({
        env: process.env,
        maxBuffer: LARGE_BUFFER,
      })
    );

    expect(logger.debug).toHaveBeenLastCalledWith(`Executing command: ${nodeCommandWithRelativePath} ${contextCmd}`);
  });

  it('run cdk deploy command with boolean context option', async () => {
    const option: DeployExecutorSchema = Object.assign({}, options);
    option['context'] = true;
    await executor(option, context);

    expect(childProcess.exec).toHaveBeenCalledWith(
      `${nodeCommandWithRelativePath} --context true`,
      expect.objectContaining({
        env: process.env,
        maxBuffer: LARGE_BUFFER,
      })
    );

    expect(logger.debug).toHaveBeenLastCalledWith(`Executing command: ${nodeCommandWithRelativePath} --context true`);
  });
});
