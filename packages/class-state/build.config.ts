import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  entries: [
    {
      input: './src/',
      format: 'esm',
      ext: 'mjs',
      declaration: true
    },
    {
      input: './src/',
      ext: 'cjs',
      format: 'cjs'
    }
  ]
})
