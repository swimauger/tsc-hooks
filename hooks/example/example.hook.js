module.exports = {
  dependencies: [ 'chalk' ], // Needed NPM Modules, these modules will be installed using `npm i <dependency>...`
  config: [ 'compilerOptions.message' ], // Custom properties introduced, ex: "compilerOptions.someProperty" in tsconfig
  arguments: { // Custom arguments when using tsc
    messageVarName: [ 'msg', 'message' ] // Used like "tsc --message 'Cool Message'" or "tsc -msg 'Cool Alias'"
  },
  onInitCompilation: function() {
    console.log(this.chalk.cyan('onInitCompilation is executed before tsc has started compilation'));

    console.log('Below is the `this` context in the onInitCompilation function:');
    console.log(this);

    console.log("Message:", this.messageVarName);
  },
  onPostCompilation: function() {
    console.log(this.chalk.magenta('onPostCompilation is executed after tsc has completed compilation'));

    console.log('Below is the `this` context in the onPostCompilation function:');
    console.log(this);
  }
}