import fs from 'node:fs'
import path from 'node:path'
import JSZIP from 'jszip'

/**
 * 读取文件并写入 JSZIP
 * @param zip - JSZIP 对象
 * @param path - 文件路径
 */
const readFileSync = async (
  zip: JSZIP,
  path: string
) => {
  const files = fs.readdirSync(path)// 读取目录中的所有文件及文件夹（同步操作）
  files.forEach((fileName) => {
    const fullPath = `${path}/${fileName}`
    const fileStats = fs.statSync(fullPath)
    if (fileStats.isDirectory()) { // 如果是目录则继续读取
      zip.folder(fileName)// 压缩对象中生成该目录
      readFileSync(zip, fullPath)// 重新检索目录文件
    } else { // 如果是文件则写入
      zip.file(fileName, fs.readFileSync(fullPath))
    }
  })
}

/**
 * 压缩文件夹
 * @param from - 源文件路径
 * @param to - 目标文件路径
 */
export const zipFile = async (
  from: string,
  to: string
) => {
  const zip = new JSZIP()
  const fromPath = path.resolve(from)
  const toPath = path.resolve(to)
  readFileSync(zip, fromPath) // 读取文件
  const contentStream = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9
    }
  })
  fs.writeFileSync(toPath, contentStream, 'utf-8')
}
