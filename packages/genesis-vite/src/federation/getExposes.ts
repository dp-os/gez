import { type Genesis } from 'genesis3'
import axios from 'axios'

import { type Manifest } from '../build/build-federation'

// import path from 'node:path'
// import { mkdirSync, existsSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
export async function getExposes (genesis: Genesis) {
  const remotes = genesis.federation?.remotes
  if (remotes) {
    console.log('@load exposes', remotes)

    for (const remote of remotes) {
      const { name, clientOrigin } = remote
      const url = `${clientOrigin}/${name}/node-exposes/manifest.json`
      console.log('@load file', url)
      // const res = await loadFile(url)
      const res = await axios.get<Manifest>(url)
      console.log('@res', res)
    }
  }
}

// async function loadFile (url: string) {
//   const { data } = await axios.get<Manifest>(url)
//   console.log(data)
//   return data
// }
