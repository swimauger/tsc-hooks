# Contributing

**First and foremost**,

thank you for considering to contribute to this project! All help is not only welcomed, but appreciated!

**Secondly**,

there are two specific kinds of changes I will be looking for and those are:

1. [A New Hook Contribution](#creating-a-hook)
2. [A Library Contribution](#editing-the-library)

*If either of those interest you, you can click on their respective links.*

**Lastly**,

when you are finished with your changes and are ready to commit them, please use [gitmoji]() to format your commit messages and ensure you are branching off of the latest available branch for the project, i.e - never the `main` branch

## Creating a Hook
To create a hook, in the root of the project you can run:

`node run create-hook <hook-name>`

Notice this will have added a new hook folder with the same exact structure and content as the `example` hook. In addition though, it will also add your hook's test suite to the Dockerfile.

### Dependencies

`dependencies` is an array property you can specify on your hook to install npm packages. The reason I don't want to save the dependencies directly in tsc-hooks is to avoid making tsc-hooks an enormous install.

Later in your hook listeners, you can require the dependencies you specified.

### Hook Lifecycle
`onInitCompilation` - This listener is called before the TypeScript compiler begins compiling

`onPostCompilation` - This listener is called when the TypeScript compiler finishes compiling, *or more accurately when the process finishes*

You may notice that both listeners are passed an `api` argument, more about that below.

### API

```ts
{
  tsconfig: {
    ...tsconfig, // api.tsconfig contains all the properties from the tsconfig used to compile
    save: Function, // api.tsconfig.save() will save any modified properties to api.tsconfig directly
    ignore: Function, // api.tsconfig.ignore(configOption), in some cases tsc complains about options it doesn't know about in the tsconfig, so you will need to ignore them. Take a look at copy-files hook for a good example of this.
    path: string, // api.tsconfig.path is the path to the tsconfig file
    directory: string // api.tsconfig.directory is the path to the tsconfig directory
  },
  // args coming soon...
}
```

### Deleting a Hook
If you want to delete the hook for some reason, you can run:

`node run delete-hook <hook-name>`

## Editing the Library

This is basically any edit you make to tsc-hooks that does not involve creating a new hook.

In other words, this could be:
- An issue you picked up from the [issues](https://github.com/swimauger/tsc-hooks/issues) queue on GitHub,
- A TODO item you picked up from the [TODO](./TODO.md) list, *in which case you can strike that item off of the TODO*
- An idea for the project, *in which case I'd love to read about it in the [Discussions](https://github.com/swimauger/tsc-hooks/discussions) on GitHub*
