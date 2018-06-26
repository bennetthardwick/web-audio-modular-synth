module.exports = function(config) {
  let configuration = {
    frameworks: ["jasmine", "karma-typescript"],
    files: [{ pattern: "src/**/*.ts" }],
    preprocessors: {
      "**/*.ts": ["karma-typescript"]
    },
    autoWatch: true,
    karmaTypescriptConfig: {
      reports: {
        lcovonly: {
          directory: "coverage",
          filename: "lcov.info",
          subdirectory: "lcov"
        },
        html: "coverage"
      },
      compilerOptions: {
        lib: ["dom", "es6", "es2016.array.include"]
      }
    },
    reporters: ["spec", "karma-typescript"],
    browsers: ["ChromeHeadless"],
    customLaunchers: {
      Chrome_travis_ci: {
        base: "Chrome",
        flags: ["--no-sandbox"]
      }
    }
  };

  if (process.env.TRAVIS) {
    configuration.autoWatch = false;
    configuration.singleRun = true;
    configuration.browsers = ["Chrome_travis_ci"];
  }

  config.set(configuration);
};
