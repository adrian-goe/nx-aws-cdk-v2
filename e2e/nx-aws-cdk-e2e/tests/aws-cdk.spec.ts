import { checkFilesExist, ensureNxProject, readJson, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';

describe('aws-cdk-v2 e2e', () => {
  beforeAll(() => {
    ensureNxProject('@ago-dev/aws-cdk-v2', 'dist/packages/aws-cdk-v2');
  });

  it('should create aws-cdk', async () => {
    const plugin = uniq('aws-cdk-v2');

    await runNxCommandAsync(`generate @ago-dev/aws-cdk-v2:application ${plugin}`);
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('aws-cdk-v2');

      await runNxCommandAsync(`generate @ago-dev/aws-cdk-v2:application ${plugin} --directory subdir`);
      expect(() => checkFilesExist(`apps/subdir/${plugin}/src/main.ts`)).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const plugin = uniq('aws-cdk-v2');

      await runNxCommandAsync(`generate @ago-dev/aws-cdk-v2:application ${plugin} --tags e2etag,e2ePackage`);
      const nxJson = readJson(`apps/${plugin}/project.json`);
      expect(nxJson.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
