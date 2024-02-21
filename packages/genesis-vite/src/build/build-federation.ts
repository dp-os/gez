import { zipFile } from './zip'
import { mkdirSync, existsSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import CryptoJS from 'crypto-js'

export interface Manifest {
  /**
   * 客户端入口文件内容哈希
   */
  client: number

  /**
   * 服务端入口文件内容哈希
   */
  server: number

  /**
   * 是否存在 dts 类型文件
   */
  dts: boolean

  /**
   * 构建时间
   */
  buildTime: number
}

/**
 * 构建模块联邦使用的代码
 * 1. 将服务端代码压缩并写入到 dist/client/node-exposes 文件夹中
 * 2. 将 dts 文件夹压缩并写入到 dist/client/node-exposes 文件夹中
 * 3. 写入 manifest.json 文件
 */
export const buildFederation = async () => {
  const clientFile = readFileSync('./dist/client/manifest.json').toString('utf-8')
  const serverFile = readFileSync('./dist/server/index.js').toString('utf-8')
  const clientHash = CryptoJS.MD5(clientFile).toString()
  const serverHash = CryptoJS.MD5(serverFile).toString()
  const manifest = {
    client: clientHash,
    server: serverHash,
    dts: false,
    buildTime: Date.now()
  }

  copyFileSync('./dist/client/manifest.json', './dist/server/manifest.json')

  mkdirSync('./dist/client/node-exposes')
  zipFile('./dist/client', `./dist/client/node-exposes/${clientHash}.zip`)
  zipFile('./dist/server', `./dist/client/node-exposes/${serverHash}.zip`)

  if (existsSync('./types')) {
    manifest.dts = true
    zipFile('./types', `./dist/client/node-exposes/${serverHash}-dts.zip`)
  }

  writeFileSync('./dist/client/node-exposes/manifest.json', JSON.stringify(manifest, null, 4))
}
