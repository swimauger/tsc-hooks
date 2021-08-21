module.exports = () => {
  return {
    rootDir: 'hooks',
    modulePathIgnorePatterns: [ "<rootDir>/(.*)/test" ]
  };
};