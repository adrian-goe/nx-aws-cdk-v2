import * as path from 'path';
import {
  addProjectConfiguration,
  convertNxGenerator,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  ProjectConfiguration,
  Tree,
  updateJson,
  runTasksInSerial,
  updateProjectConfiguration,
} from '@nx/devkit';
import { jestProjectGenerator } from '@nx/jest';
import { Linter, lintProjectGenerator } from '@nx/eslint';

import { ApplicationSchema } from './schema';
import { initGenerator } from '../init/init';

interface NormalizedSchema extends ApplicationSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(host: Tree, options: ApplicationSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags ? options.tags.split(',').map((s) => s.trim()) : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    linter: options.linter ?? Linter.EsLint,
    unitTestRunner: options.unitTestRunner ?? 'jest',
  };
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };

  generateFiles(host, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

function addJestFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(host, path.join(__dirname, 'jest-files'), options.projectRoot, templateOptions);
}
async function addLintingToApplication(tree: Tree, options: NormalizedSchema): Promise<GeneratorCallback> {
  return await lintProjectGenerator(tree, {
    linter: options.linter,
    project: options.projectName,
    tsConfigPaths: [joinPathFragments(options.projectRoot, 'tsconfig.*?.json')],
    eslintFilePatterns: [`${options.projectRoot}/**/*.ts`],
    skipFormat: true,
    setParserOptionsProject: options.setParserOptionsProject,
  });
}

function updateLintConfig(tree: Tree, options: NormalizedSchema) {
  updateJson(tree, `${options.projectRoot}/.eslintrc.json`, (json) => {
    json.plugins = json?.plugins || [];
    const plugins: string[] = json.plugins;

    const hasCdkPlugin = plugins.findIndex((row) => row === 'cdk') >= 0;
    if (!hasCdkPlugin) {
      plugins.push('cdk');
    }
    return json;
  });
}

export async function applicationGenerator(host: Tree, options: ApplicationSchema) {
  const tasks: GeneratorCallback[] = [];
  const normalizedOptions = normalizeOptions(host, options);
  const initTask = await initGenerator(host, {
    ...options,
    skipFormat: true,
  });

  tasks.push(initTask);

  const project: ProjectConfiguration = {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      deploy: {
        executor: '@ago-dev/nx-aws-cdk-v2:deploy',
        options: {},
      },
      destroy: {
        executor: '@ago-dev/nx-aws-cdk-v2:destroy',
        options: {},
      },
      bootstrap: {
        executor: '@ago-dev/nx-aws-cdk-v2:bootstrap',
        options: {},
      },
    },
    tags: normalizedOptions.parsedTags,
  };
  addProjectConfiguration(host, normalizedOptions.projectName, project);

  updateProjectConfiguration(host, normalizedOptions.projectName, project);
  addFiles(host, normalizedOptions);

  if (normalizedOptions.linter !== Linter.None) {
    const lintTask = await addLintingToApplication(host, normalizedOptions);
    tasks.push(lintTask);
    updateLintConfig(host, normalizedOptions);
  }

  if (normalizedOptions.unitTestRunner === 'jest') {
    const jestTask = await jestProjectGenerator(host, {
      project: normalizedOptions.projectName,
      setupFile: 'none',
      skipSerializers: true,
      supportTsx: false,
      babelJest: false,
      testEnvironment: 'node',
      skipFormat: true,
    });
    tasks.push(jestTask);
    addJestFiles(host, normalizedOptions);
  }

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}
export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
