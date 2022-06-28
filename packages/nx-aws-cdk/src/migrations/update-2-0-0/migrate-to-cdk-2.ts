import { chain } from '@angular-devkit/schematics';
import { formatFiles, renameNpmPackages } from '@nrwl/workspace';
import { CDK_VERSION } from '../../utils/cdk-shared';
import { renamePackageImports } from '@nrwl/workspace/src/utils/rules/rename-package-imports';

export default function update() {
  return chain([
    renameNpmPackages({
      '@aws-cdk/core': ['aws-cdk-lib', CDK_VERSION],
    }),
    renamePackageImports({
      '@aws-cdk/assert': 'aws-cdk-lib/assertions',
    }),
    formatFiles(),
  ]);
}
