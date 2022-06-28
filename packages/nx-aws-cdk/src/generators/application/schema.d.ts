import { Linter } from '@nrwl/linter';

export interface ApplicationSchema {
  name: string;
  tags?: string;
  directory?: string;
  skipFormat?: boolean;
  linter?: Linter;
  unitTestRunner?: 'jest' | 'none';
  setParserOptionsProject?: boolean;
}
