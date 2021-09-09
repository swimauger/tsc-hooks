const PERMISSION_PROPERTY_KEY = "filePermissions";
module.exports = {
  dependencies: [],
  onPostCompilation: function (api) {
    const { chmodSync, existsSync } = require("fs");

    const permissions = api.tsconfig[PERMISSION_PROPERTY_KEY];
    // if there no permissions, silently return without doing anything.
    if (!permissions) {
      return;
    }

    // permisions is a dictionary of key:path+filename and value:string_octal_permission
    // "./dist/index.js": "0744"

    // filter valid entries
    const valid = Object.entries(permissions).filter(
      ([filepath, string_octal_permission]) => {
        // file must exist
        if (!existsSync(filepath)) {
          return false;
        }
        // permission must be a string
        if (!typeof string_octal_permission === "string") {
          return false;
        }
        //  and the string must be starting with 0 and three numbers 0-7
        return /0[0-7]{3}/.test(string_octal_permission);
      }
    );
    // for each of the valid enties, execute the required chmod Call
    valid.forEach(([filepath, permissions]) => {
      // chmod also accepts a string, which is parsed octally
      chmodSync(filepath, permissions);
    });
  },
};
