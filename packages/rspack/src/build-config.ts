import type { Gez } from '@gez/core';
import type { RspackOptions } from '@rspack/core';
import { type BuildTarget, createBaseConfig } from './config';

export type { BuildTarget };

export interface BuildContext {
    /**
     * 构建的 gez 实例
     */
    gez: Gez;
    /**
     * 构建的目标
     */
    target: BuildTarget;
    /**
     * 构建的配置
     */
    config: RspackOptions;
}

/**
 * 创建构建上下文
 * @param gez
 * @param target
 * @returns
 */
export function createBuildContext(
    gez: Gez,
    target: BuildTarget
): BuildContext {
    return {
        gez,
        target,
        config: createBaseConfig(gez, target)
    };
}

/**
 * 更新构建上下文
 */
export type ModifyBuildContext<T = void> = (buildContext: BuildContext) => T;
