import { Quad } from 'rdf-js'

interface ITask {
  id: string
  title: string
  description: string

  save: () => void
  delete: () => void
}

class Task implements ITask {
  id: string
  title: string
  description: string

  constructor(quads: Quad[]) {
    this.id = quads[0].subject.value
    this.title = quads.find((quad) => quad.predicate.value.endsWith('title'))?.object.value ?? 'undefined'
    this.description = quads.find((quad) => quad.predicate.value.endsWith('description'))?.object.value ?? ''
  }

  save(): void {
    console.log(`Save ${this.id}`)
    console.log({
      id: this.id,
      title: this.title,
      description: this.description
    })
  }

  delete(): void {
    console.log(`Delete ${this.id}`)
  }
}

export { type ITask, Task }
