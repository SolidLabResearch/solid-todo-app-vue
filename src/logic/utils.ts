const taskStatusValues: string[] = [
  'false',
  'true'
]

// The allowed characters are sort of strict, but should be fine for a prototype
const allowedCharacters: string = 'abcdefghijklmnopqrstuwvxyz1234567890'

// These default values for task path and WebID are for development purposes to avoid re-typing
// const defaultTaskPath: string = '{storage}/tasks/{tasklist}'
// const defaultWebId: string = 'http://localhost:3000/profile/card#me'

const defaultTaskPath: string = 'private/todos/todos'
const defaultWebId: string = ''

function identifierFromName(name: string): string {
  // This will throw an error when name is undefined, which can be the case if the user does not provide one, but it is fine
  return Array.from(name.trim().toLowerCase()).map((char) => allowedCharacters.includes(char) ? char : '-').join('')
}

export { taskStatusValues, defaultWebId, defaultTaskPath, identifierFromName }
