/**
 * 修复模块联邦 获取 export default 导出取值错误的问题
 * 详情：https://github.com/webpack/webpack/issues/17874
 * @param mod 模块的对象
 */
export function fixMod<T>(mod: T): T {
    const obj: any = mod;
    return obj?.__esModule ? obj.default : obj;
}
