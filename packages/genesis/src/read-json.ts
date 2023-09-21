import fs from 'fs'

export function readJson<T> (file: string, defaultValue: T): T {
  if (fs.existsSync(file)) {
    const text = fs.readFileSync(file, 'utf-8')
    return JSON.parse(text)
  }
  return defaultValue
}
