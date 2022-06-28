import { Tree } from '@angular-devkit/schematics';
import { readJsonInTree } from '@nrwl/workspace';
import * as path from 'path';
import { createEmptyWorkspace, runSchematic } from '@nrwl/workspace/testing';
import { CDK_VERSION } from '../../utils/cdk-shared';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/schematic-test-runner';

describe('Update AWS CDK dependencies to v2', () => {
  let tree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    tree = Tree.empty();
    tree = createEmptyWorkspace(tree);
    schematicRunner = new SchematicTestRunner('@nrwl/next', path.join(__dirname, '../../../migrations.json'));
    tree.overwrite(
      'package.json',
      JSON.stringify({
        devDependencies: {
          '@aws-cdk/core': '^1.127.0',
        },
      })
    );
  });

  it(`should update '@aws-cdk/core', if used, to the new package names`, async () => {
    tree = await schematicRunner.runSchematicAsync('migrate-to-cdk-2', {}, tree).toPromise();

    const packageJson = readJsonInTree(tree, '/package.json');
    expect(packageJson).toMatchObject({
      devDependencies: {
        'aws-cdk-lib': CDK_VERSION,
      },
    });
  });

  it(`should update '@aws-cdk/core' to the 'aws-sdk-lib' where imported`, async () => {
    tree = await runSchematic('lib', { name: 'library-1' }, tree);

    const moduleThatImports = 'libs/library-1/src/importer.ts';
    tree.create(
      moduleThatImports,
      `import * as cdk from '@aws-cdk/core';
      const app = new cdk.App();
      `
    );

    tree = await schematicRunner.runSchematicAsync('migrate-to-cdk-2', {}, tree).toPromise();

    expect(tree.read(moduleThatImports).toString()).toContain(`import * as cdk from 'aws-cdk-lib';`);
  });
  it(`should update '@aws-cdk/assert', if used, to 'aws-cdk-lib/assertions' where imported`, async () => {
    tree = await runSchematic('lib', { name: 'library-1' }, tree);

    const moduleThatImports = 'libs/library-1/src/importer.ts';
    tree.create(
      moduleThatImports,
      `import * as cdk from '@aws-cdk/core';
      const app = new cdk.App();
      `
    );

    tree = await schematicRunner.runSchematicAsync('migrate-to-cdk-2', {}, tree).toPromise();

    expect(tree.read(moduleThatImports).toString()).toContain(`import * as cdk from 'aws-cdk-lib';`);
  });
});
