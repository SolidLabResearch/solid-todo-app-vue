# Solid Tasks

This is an experimental to-do list application built on top of Solid, in an effort to identify challenges related to developing interoperable applications on top of Solid. This is **not intended for actual use** in any capacity whatsoever, and exists as a technical prototype. There is a live version [available](https://solidlabresearch.github.io/solid-todo-app-vue/) published on GitHub Pages from the main branch.

## Dependencies

* [Vue](https://vuejs.org/) for the user interface
* [Webpack](https://webpack.js.org/) for development server, building, bundling
* [Comunica with link traversal](https://github.com/comunica/comunica-feature-link-traversal) for reading and writing data
* [Small custom vocabulary](https://github.com/SolidLabResearch/solid-todo-app-react/tree/main/ontology) for describing the data
* The data can be stored in a Solid pod, for example using the [Community Solid Server](https://github.com/CommunitySolidServer/CommunitySolidServer)

## Functionality

Thus far, the prototype offers the following functionality:

* Logging in and out with a WebID, where the OIDC issuer is discovered via `solid:oidcIssuer`, and displaying the user's name from `foaf:name` or `foaf:givenName` after logging in
* Creating, renaming and removing to-do lists and to-do entries within those lists, in a nested fashion
* Language selection, before or after logging in, with choice saved in cookies


## Storage strategies

The prototype also allows customising the storage paths for newly-created to-do lists and entries:

* Default without `pim:storage` present is `private/todos/todos` under the path that contains the WebID, and it is this way to match the React prototype
* Default with `pim:storage` present is `private/todos/todos` under the path pointed at by `pim:storage`
* The `http://example.org/todolist/pathTemplate` predicate can be used to define a custom path, for example `{storage}/tasks/{tasklist}`, with the following templates available to use in the string: `year`, `month`, `date`, `timenow`, `tasklist`, `task`, `storage`

Examples of different storage strategies that can be implemented with the template:

* All tasks in single file: `{storage}/tasks/singlefile`
* All lists in different files: `{storage}/tasks/{tasklist}`
* All individual tasks in different files: `{storage}/tasks/{tasklist}/{task}`
* All tasks for one year in their own file: `{storage}/tasks/{year}`

## Development setup

The project uses [Yarn]() for package management, and offers the usual commands:

* `yarn run dev` for local development
* `yarn run lint` for ESLint
* `yarn run build` for bundling for production

For example, to start the application locally after cloning, with optional `--ignore-engines` flag if the local Node version is an up-to-date one:

```
yarn install
yarn run dev
```

## Issues

Any issues encountered can be reported via the GitHub issue tracker. However, before reporting issues, please note that this is not a production-ready application and is not intended for everyday use.
