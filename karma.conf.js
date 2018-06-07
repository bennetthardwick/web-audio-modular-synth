module.exports = function(config) {
  let config = {
    frameworks: ["jasmine", "karma-typescript"],
    files: [{ pattern: "src/**/*.ts" }],
    preprocessors: {
      "**/*.ts": ["karma-typescript"]
    },
    karmaTypescriptConfig: {
      reports: {
        lcovonly: {
          directory: "coverage",
          filename: "lcov.info",
          subdirectory: "lcov"
        }
      },
      compilerOptions: {
        lib: ["dom", "es6"]
      }
    },
    reporters: ["spec"],
    browsers: ["Chrome"],
    customLaunchers: {
      Chrome_travis_ci: {
        base: "Chrome",
        flags: ["--no-sandbox"]
      }
    },
    singleRun: true
  };

  if (process.env.TRAVIS) {
    config.browsers = ["Chrome_travis_ci"];
  }

  config.set(config);
};
