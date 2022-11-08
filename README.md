# Solid Tasks

This is an experimental to-do list application built on top of Solid, in an effort to identify challenges related to developing interoperable applications on top of Solid. This is **not intended for actual use** in any capacity whatsoever, and exists as a technical prototype. There is currently no live version available, due to the production build breaking libraries, which is being investigated. Running locally works.

The prototype uses:

* [Vue](https://vuejs.org/) for the user interface
* [Vite](https://vitejs.dev/) for development, building, bundling (might need to be changed, investigation pending)
* [Comunica with link traversal](https://github.com/comunica/comunica-feature-link-traversal) for reading and writing data
* [Small custom vocabulary](https://github.com/SolidLabResearch/solid-todo-app-react/tree/main/ontology) for describing the data
* The data can be stored in a Solid pod, for example using the [Community Solid Server](https://github.com/CommunitySolidServer/CommunitySolidServer)

Thus far, the prototype offers the following functionality:

* Logging in and out with a WebID, where the OIDC issuer is discovered via `solid:oidcIssuer`, and displaying the user's name from `foaf:name` or `foaf:givenName` after logging in
* Creating, renaming and removing to-do lists and to-do entries within those lists, in a nested fashion
* Language selection, before or after logging in, with choice saved in cookies

The prototype also allows customising the storage paths for newly-created to-do lists and entries:

* Default without `pim:storage` present is `private/todosnew/todos.ttl` under the path that contains the WebID, and it is this way to match the React prototype
* Default with `pim:storage` present is `private/todosnew/todos.ttl` under the path pointed at by `pim:storage`
* The `http://example.org/todolist/pathTemplate` predicate can be used to define a custom path, for example `http://somepod.example.com/todos/{tasklist}`, with the following templates available to use in the string: `year`, `month`, `date`, `timenow`, `tasklist`, `task`, `storage`

The usual commands are available:

* `yarn run dev` for local development
* `yarn run lint` for ESLint
* `yarn run build` for bundling for production
* `yarn run preview` for previewing production bundle
