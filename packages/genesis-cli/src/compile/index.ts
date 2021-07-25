import { ServiceOptions } from '../../types';
import { resolveConfig, validateOptions } from '../config/serviceConfig';
import { createService } from '../service';
import CustomSSR from '../bean/CustomSSR';
import { Build } from '@fmfe/genesis-compiler';

/**
 * create GenesisServiceInstance
 * @param config
 * @param isModel
 */
export async function createGenesisServiceInstance(config: ServiceOptions, isModel = false) {
    await validateOptions(config);
    // with default config
    config = resolveConfig(config, isModel);
    try {
        return await createService(config);
    } catch (e) {
        console.error(e?.message)
    }
}

/**
 * build GenesisService
 * @param config build config
 * @param isModel is sub service
 */
export async function buildGenesisService(config: ServiceOptions, isModel = false) {
    await validateOptions(config);
    config = resolveConfig(config, isModel);

    try {
        // create ssr
        const ssr = CustomSSR.createInstanceByServiceOptions(config);

        // build
        const build = new Build(ssr);
        await build.start();
    } catch (e) {
        console.error(e?.message)
    }
}
