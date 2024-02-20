import { type Genesis, type Remote } from 'genesis3'
import fs from 'node:fs'
import path from 'node:path'
import axios from 'axios'
import JSZIP, { type JSZipObject } from 'jszip'

import { type Manifest } from '../build/build-federation'

/**
 * 获取远程依赖
*/
export async function getExposes (genesis: Genesis) {
  try {
    const remotes = genesis.federation?.remotes
    if (remotes) {
      console.log('@load exposes', remotes)

      for (const remote of remotes) {
        const { name, clientOrigin } = remote
        const { data: manifest } = await axios.get<Manifest>(`${clientOrigin}/${name}/node-exposes/manifest.json`)
        await loadExpose({
          remote,
          manifest
        })
      }
    }
  } catch (error) {
    console.error(new Error('get exposes failed'))
  }
  process.exit(0)
}

/**
 * 根据配置加载远程资源
 * 如果存在 dts 则一并下载
*/
async function loadExpose ({
  remote,
  manifest
}: {
  remote: Remote
  manifest: Manifest
}) {
  const { name, clientOrigin } = remote
  const { server, dts } = manifest

  const url = `${clientOrigin}/${name}/node-exposes/${server}.zip`
  await loadFile(url, `./node_modules/${name}`)

  if (dts) {
    const url = `${clientOrigin}/${name}/node-exposes/${server}-dts.zip`
    await loadFile(url, `./node_modules/${name}`)
  }
}

/**
 * 加载远程资源并下载到本地
*/
async function loadFile (url: string, savePath: string) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer' // 类型必须为arraybuffer
  })
  const zip = new JSZIP()
  const zipData = await zip.loadAsync(res.data)
  await saveZipFiles(zipData.files, savePath)
}

/**
 * 保存解压后的资源
*/
async function saveZipFiles (files: Record<string, JSZipObject>, savePath: string) {
  console.log('@saveZipFiles', savePath)
  for (const filename of Object.keys(files)) {
    const dest = path.join(savePath, filename)
    // 如果该文件为目录需先创建文件夹
    if (files[filename].dir) {
      console.log('@make dir =======', dest)
      fs.mkdirSync(dest, {
        recursive: true
      })
    } else {
      // 把每个文件buffer写到硬盘中
      console.log('@write file =======', dest)
      const content = await files[filename].async('nodebuffer')
      fs.writeFileSync(dest, content)
    }
  }
}
