import { checkFilesExist, ensureNxProject, readJson, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { logger } from '@nrwl/devkit';

describe('aws-cdk-v2 e2e', () => {
  beforeAll(() => {
    ensureNxProject('@ago-dev/nx-aws-cdk-v2', 'dist/packages/aws-cdk-v2');
  });

  it('should create aws-cdk', async () => {
    const plugin = uniq('aws-cdk-v2');

    await runNxCommandAsync(`generate @ago-dev/nx-aws-cdk-v2:application ${plugin}`);
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('aws-cdk-v2');

      await runNxCommandAsync(`generate @ago-dev/nx-aws-cdk-v2:application ${plugin} --directory subdir`);
      expect(() => checkFilesExist(`apps/subdir/${plugin}/src/main.ts`)).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const plugin = uniq('aws-cdk-v2');

      await runNxCommandAsync(`generate @ago-dev/nx-aws-cdk-v2:application ${plugin} --tags e2etag,e2ePackage`);
      const nxJson = readJson(`apps/${plugin}/project.json`);
      expect(nxJson.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });

  //TODO find a good way to test bootstrap command. Maybe with localstack
  xdescribe('bootstrap', () => {
    beforeEach(() => {
      jest.spyOn(logger, 'debug');
    });
    it('should try to bootstrap', async () => {
      const plugin = uniq('aws-cdk-v2');

      await runNxCommandAsync(`generate @ago-dev/nx-aws-cdk-v2:application ${plugin} --tags e2etag,e2ePackage`);
      await runNxCommandAsync(`bootstrap ${plugin} --profile=test123`);
      expect(logger.debug).toHaveBeenLastCalledWith(
        `Executing command: node ${process.env.NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js bootstrap ${plugin} --profile=test123`
      );
    }, 120000);

    it('should try to bootstrap with aws environments', async () => {
      const plugin = uniq('aws-cdk-v2');

      await runNxCommandAsync(`generate @ago-dev/nx-aws-cdk-v2:application ${plugin} --tags e2etag,e2ePackage`);
      await runNxCommandAsync(`bootstrap ${plugin} aws://123456789012/us-east-1`);
      expect(logger.debug).toHaveBeenLastCalledWith(
        `Executing command: node ${process.env.NX_WORKSPACE_ROOT}/node_modules/aws-cdk/bin/cdk.js bootstrap aws://123456789012/us-east-1`
      );
    }, 120000);
  });
});
