# TypeScript Compiler Hooks

<img align="right" width="25%" src="./icon.png">

![](https://img.shields.io/npm/dw/tsc-hooks?color=3478C6&style=for-the-badge)
![](https://img.shields.io/npm/v/tsc-hooks?color=82ABDC&style=for-the-badge)
![](https://img.shields.io/github/repo-size/swimauger/tsc-hooks?color=DDDDDD&label=Size&style=for-the-badge)
![](https://img.shields.io/github/license/swimauger/tsc-hooks?color=FFFFFF&style=for-the-badge)

## **Installation**
#### **For Project Specific `tsc`:**
`yarn add tsc-hooks --dev`
#### **For Global `tsc`:**
`yarn global add tsc-hooks`

## Getting Started
*Example tsconfig.json*
```json5
{
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": [ "src/**/*" ],
  "exclude": [ "src/**/*.txt" ],
  "hooks": [ "copy-files" ] // hooks is a new property you can add to tsconfig to add custom hooks
  
  /* For more hooks look below... */
}
```
Hooks are executed in the same order as defined in `tsconfig.json`s hook property.

## Available Hooks
| Hook ID | Description | Author |
| ------- | ----------- | ------ |
| copy-files | `tsc` does not copy over extra files like .xml, .txt, .html, etc. after compilation. This hook fixes this by copying over files specified in "include". It also ignores files specified in "exclude". | Mark Auger ([swimauger]( https://github.com/swimauger )) |
| file-permissions | This hook sets permissions to files after `tsc` has completed.|joel([dderjoel](https://github.com/dderjoel)) |
| &lt;your-hook-id&gt; | Learn how to create your own hook [here](./docs/CONTRIBUTING.md) | &lt;Your name here&gt; |


## Examples

### file-permissions

1. `tsc` compiles `index.ts` to `./dist/index.js`
1. The `copy-files`-hook will copy the `src/helperProgram.bin` to `./dist/helperProgram.bin`
1. The `file-permissions`-hook will set the permissions r-xr--r-- to `./dist/{helperProgram.bin, index.js}` (assuming `./src/index.ts` has a shebang like `#!/usr/bin/env node`, one can now execute `./dist/index.js`)

Expample-`tsconfig.json`:
```json5
{
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": [ "src/index.ts", "src/helperProgram.bin" ],
  "exclude": [ "src/**/*.txt" ],
  "hooks": [ "copy-files", "file-permissions" ] 
  "filePermissions": {
    "./dist/helperProgram.bin": "0544",
    "./dist/index.js": "0544"
  }
}
```


## What Can TSC Hooks Do?
- TypeScript Compiler hooks are scripts that can execute on compilation of your TypeScript project using `tsc`
- They can provide new tsconfig options to help your project run smoother
- They can add new functionality to the compilation process
