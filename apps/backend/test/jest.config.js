module.exports = {
    rootDir: __dirname,
    moduleNameMapper: {
        '^@models/(.*)$': '<rootDir>/../src/models/$1',
        '^@utils/(.*)$': '<rootDir>/../src/utils/$1',
        '^@app/(.*)$': '<rootDir>/../src/$1'
    }
};
