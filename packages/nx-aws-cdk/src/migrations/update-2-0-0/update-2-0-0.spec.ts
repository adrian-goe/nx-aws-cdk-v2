import { Tree } from '@angular-devkit/schematics';
import { readJsonInTree } from '@nrwl/workspace';
import * as path from 'path';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

describe('Update 2.0.0', () => {
  let tree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    tree = Tree.empty();
    tree = createEmptyWorkspace(tree);
    schematicRunner = new SchematicTestRunner('@nrwl/react', path.join(__dirname, '../../../migrations.json'));
  });

  it(`should update libs`, async () => {
    tree.overwrite(
      'package.json',
      JSON.stringify({
        dependencies: {},
        devDependencies: {
          'eslint-plugin-cdk': '^1.3.0',
        },
      })
    );

    tree = await schematicRunner.runSchematicAsync('update-2.0.0', {}, tree).toPromise();

    const packageJson = readJsonInTree(tree, '/package.json');
    expect(packageJson).toMatchObject({
      dependencies: {},
      devDependencies: {
        'eslint-plugin-cdk': '^1.7.0',
      },
    });
  });
});
