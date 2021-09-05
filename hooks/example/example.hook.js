module.exports = {
  dependencies: [ 'chalk' ], // Needed NPM Modules, these modules will be installed using `npm i <dependency>...`
  onInitCompilation: function(api) {
    const chalk = require('chalk');

    console.log(chalk.cyan('onInitCompilation is executed before tsc has started compilation'));

    console.log('Below is the api context in the onInitCompilation function:');
    console.log(api);

    console.log("Init Message:", api.tsconfig.message);
    api.tsconfig.message = "POST MESSAGE";
  },
  onPostCompilation: function(api) {
    const chalk = require('chalk');

    console.log(chalk.magenta('onPostCompilation is executed after tsc has completed compilation'));

    console.log('Below is the api context in the onPostCompilation function:');
    console.log(api);

    console.log("Post Message:", api.tsconfig.message);
  }
}