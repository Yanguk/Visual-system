module.exports = {
  setupFilesAfterEnv: ['./jest-setup.js'],
  testTimeout: 10000,
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: ['/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)'],
};
