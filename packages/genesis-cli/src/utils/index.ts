import fs from 'fs-extra'
import { CONFIG_FILE_NAME, ROOT } from './constant';
import { dirname, join } from 'path';
import { GenesisConfig, ServiceOptions } from '../../types';

export * from './constant'
export * from './env'

export function injectStart(str: string, startStr: string): string {
    return str.startsWith(startStr)
        ? str
        : startStr + str
}

export function findConfigDir(dir: string): string {
    if (fs.existsSync(join(dir, CONFIG_FILE_NAME))) {
        return dir;
    }

    const parentDir = dirname(dir);

    return dir === parentDir
        ? dir
        : findConfigDir(parentDir);
}

export function getConfigPath() {
    const configDir = findConfigDir(ROOT);
    const configFile = join(configDir, CONFIG_FILE_NAME);

    if (!fs.existsSync(configFile)) {
        throw new Error('Can not find config file ' + CONFIG_FILE_NAME);
    }

    return configFile;
}

export function getGenesisConfig(): GenesisConfig {
    const configFile = getConfigPath()
    delete require.cache[configFile];

    try {
        return require(configFile) as GenesisConfig;
    } catch (err) {
        console.error(err?.message)
        throw err
    }

}
