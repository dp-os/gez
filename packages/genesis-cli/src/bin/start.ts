import { setNodeEnv, getGenesisConfig } from '../utils';
import { createGenesisServiceInstance } from '../compile';

export async function start() {
    setNodeEnv('production');
    const config = getGenesisConfig();

    await createGenesisServiceInstance(config);

    if (config.models && config.models.length) {
        for (let i = 0; i < config.models.length; i++) {
            const modelConfig = config.models[i];
            await createGenesisServiceInstance(modelConfig, true);
        }
    }
}
