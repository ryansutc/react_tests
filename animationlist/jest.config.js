module.exports = {
  transform: {
    "\\.(js|ts|jsx|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!@esri/calcite-ui-icons/*)",
  ],
  moduleNameMapper: {
    "^[./a-zA-Z0-9$_-]+\\.svg$": "<rootDir>/src/uitests/mocks/imgMock.js",
    "^[./a-zA-Z0-9$_-]+\\.png$": "<rootDir>/src/uitests/mocks/imgMock.js",
    "^[./a-zA-Z0-9$_-]+\\.scss$": "<rootDir>/src/uitests/mocks/imgMock.js",
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
    "!**/uitests/**/*.[jt]s?(x)",
    "!**/compiled/**/*",
    "!**/build/**/*",
  ],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/components/*.js", // for now, we don't worry too much about react components at unit test level.
    "src/components/helpers/*.js",
    "!src/**/*test.js",
  ],
};
