import { ExecutorContext } from '@nrwl/devkit';

export function mockExecutorContext(executorName: string, workspaceVersion = 2): ExecutorContext {
  return {
    projectName: 'proj',
    root: '/root',
    cwd: '/root',
    workspace: {
      version: workspaceVersion,
      projects: {
        proj: {
          root: 'apps/proj',
          targets: {
            test: {
              executor: `@ago-dev/aws-cdk-v2:${executorName}`,
            },
          },
        },
      },
    },
    target: {
      executor: `@ago-dev/aws-cdk-v2:${executorName}`,
    },
    isVerbose: true,
  };
}
