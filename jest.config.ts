const { getJestProjects } = require('@nx/jest');

export default {
  projects: [...getJestProjects(), '<rootDir>/e2e/aws-cdk-v2-e2e/test'],
};
