import { ServiceOptions } from '../../types';
import { resolveConfig, validateOptions } from '../config/serviceConfig';
import { createService } from '../service';
import CustomSSR from '../bean/CustomSSR';
import { Build } from '@fmfe/genesis-compiler';

export async function createGenesisServiceInstance(config: ServiceOptions, isModel = false) {
    config = resolveConfig(config, isModel);

    try {
        await validateOptions(config);
        return await createService(config);
    } catch (e) {
        console.error(e?.message)
    }
}

export async function buildGenesisService(config: ServiceOptions, isModel = false) {
    config = resolveConfig(config, isModel);

    try {
        const ssr = CustomSSR.createInstanceByServiceOptions(config);

        const build = new Build(ssr);
        await build.start();
    } catch (e) {
        console.error(e?.message)
    }
}
