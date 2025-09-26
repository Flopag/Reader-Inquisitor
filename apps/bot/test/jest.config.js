module.exports = {
    rootDir: __dirname,
    moduleNameMapper: {
        '^@utils/(.*)$': '<rootDir>/../src/utils/$1',
        '^@app/(.*)$': '<rootDir>/../src/$1'
    }
};
