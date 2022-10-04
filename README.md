# Solid ToDo Prototype

This is just a small experiment to figure out some details related to implementing a to-do application on top of Solid, and is **not intended for actual use** in any capacity whatsoever. The prototpe is written with [Vue](https://vuejs.org/), and uses [Vite](https://vitejs.dev/) for bundling. The to-do entries are intended to be stored in a Solid pod, and fetched using [Comunica](https://github.com/comunica/comunica-feature-link-traversal).

So far, the prototype does the following:

* Allows logging in and out of a webId provider
  * The user provides their webId, and the provider is discovered via `solid:oidcIssuer` predicate in their webId triples using a SPARQL query
  * The application fetches and displays the user's name from `foaf:name` or `foaf:givenName` after logging in, with a SPARQL query
* Displays to-do entries (using an adaptation of schema.org) using a SPARQL query
  * Allows saving changes to existing to-do entries
  * Creating news ones does not work yet

The usual commands are available:

* `yarn run dev` for local development
* `yarn run lint` for ESLint
* `yarn run build` for bundling for production
* `yarn run preview` for previewing production bundle

Example to-do list is available at [data/todolist$.ttl](data/todolist$.ttl).
