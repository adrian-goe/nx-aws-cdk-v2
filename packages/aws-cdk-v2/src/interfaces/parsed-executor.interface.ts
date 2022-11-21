export interface ParsedExecutorInterface {
  parseArgs?: Record<string, string>;
  stacks?: string[];
  sourceRoot: string;
  root: string;
}
