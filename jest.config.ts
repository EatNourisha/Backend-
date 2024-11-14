import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest', 
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', 
  },
  transformIgnorePatterns: [
    'node_modules/(?!(date-fns|bullmq|@bull-board/express|lodash-es)/)', 
  ],
};

export default config;
