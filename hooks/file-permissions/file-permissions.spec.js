const { execSync } = require("child_process");
const { resolve } = require("path");
const { accessSync, constants } = require("fs");
const TEST_FOLDER = resolve(__dirname, "test");
beforeAll(() => {
  execSync("npm run build", { cwd: TEST_FOLDER });
});

/**
 *
 * Why not other tests?
 * We cant really get the permissions from the OS for "groups" or "other"
 * Secondly, we cannot remove the write permission, because then the
 * copy-files hook won't be able to overwrite it in subsequent tests
 * We cannot remove read permission, cause then we won't be able access
 * the file at all.
 *
 * So we can only test whether the x got added to the file, and assume that
 * the rest has worked.
 */

describe("file-permissions tests", () => {
  // according to the tsconfig-file
  // "./dist/fileA.js": "0644", (which was 444)
  // "./dist/index.js": "0744", (which was 644)

  const expectedPermission0644 =
    constants.F_OK | constants.W_OK | constants.R_OK;

  const expectedPermission0744 = expectedPermission0644 | constants.X_OK;

  test("fileA.js", () => {
    const file = resolve(TEST_FOLDER, "dist", "fileA.js");

    // should be ok
    expect(() => accessSync(file, expectedPermission0644)).not.toThrow();

    // should not have the x
    expect(() => accessSync(file, expectedPermission0744)).toThrow();
  });

  test("index.js", () => {
    const file = resolve(TEST_FOLDER, "dist", "index.js");

    // should be ok
    expect(() => accessSync(file, expectedPermission0644)).not.toThrow();

    // should also have the x
    expect(() => accessSync(file, expectedPermission0744)).not.toThrow();
  });
});

