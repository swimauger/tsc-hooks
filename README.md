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

## Available Hooks
<table width="100%">
  <thead>
    <th>Hook ID</th>
    <th>Description</th>
    <th>Author</th>
  </thead>
  <tbody>
    <tr>
      <td>copy-files</td>
      <td>
        <code>tsc</code> does not copy over extra files like .xml, .txt, .html, etc. after compilation.
        This hook fixes this by copying over files specified in "include". It also ignores files specified in "exclude".
      </td>
      <td>Mark Auger (<a href="https://github.com/swimauger">swimauger</a>)</td>
    </tr>
    <tr>
      <td>file-permissions</td>
      <td>
        This hook sets permissions to files after <code>tsc</code> has completed.
        <code>tsconfig.json</code>:</br>
        <code>
        ...
        "hooks": [...,"file-permissions"],
        "filePermissions": {
            "./dist/fileA.js": "0244",
            "./dist/index.js": "0744"
        }
        ...
        </code>
      </td>
      <td>Joel (<a href="https://github.com/dderjoel">dderjoel</a>)</td>
    </tr>
    <tr>
      <td>&lt;your-hook-id&gt;</td>
      <td>Learn how to create your own hook <a href="./docs/CONTRIBUTING.md">here</a></td>
      <td>&lt;Your name here&gt;</td>
    </tr>
  </tbody>
</table>

## What Can TSC Hooks Do?
- TypeScript Compiler hooks are scripts that can execute on compilation of your TypeScript project using `tsc`
- They can provide new tsconfig options to help your project run smoother
- They can add new functionality to the compilation process
