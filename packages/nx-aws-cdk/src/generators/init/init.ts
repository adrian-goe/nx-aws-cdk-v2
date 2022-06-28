import { addDependenciesToPackageJson, convertNxGenerator, formatFiles, GeneratorCallback, Tree } from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';

import { InitGeneratorSchema } from './schema';
import { CDK_ESLINT_VERSION, CDK_VERSION } from '../../utils/cdk-shared';

function normalizeOptions(schema: InitGeneratorSchema) {
  return {
    ...schema,
    unitTestRunner: schema.unitTestRunner ?? 'jest',
  };
}

export async function initGenerator(host: Tree, options: InitGeneratorSchema) {
  let jestInstall: GeneratorCallback;
  const schema = normalizeOptions(options);

  if (schema.unitTestRunner === 'jest') {
    jestInstall = await jestInitGenerator(host, {});
  }

  const installTask = addDependenciesToPackageJson(
    host,
    {
      'aws-cdk': CDK_VERSION,
      'aws-cdk-lib': CDK_VERSION,
    },
    {
      'eslint-plugin-cdk': CDK_ESLINT_VERSION,
    }
  );

  if (!schema.skipFormat) {
    await formatFiles(host);
  }

  return async () => {
    if (jestInstall) {
      await jestInstall();
    }
    await installTask();
  };
}

export default initGenerator;
export const initSchematic = convertNxGenerator(initGenerator);
