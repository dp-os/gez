import { setNodeEnv, getGenesisConfig } from '../utils';
import { GenesisConfig } from '../../types';
import { buildGenesisService } from '../compile';

export async function build() {
    setNodeEnv('production');
    let config: GenesisConfig = getGenesisConfig();

    await buildGenesisService(config);

    if (config.models && config.models.length) {
        for (let i = 0; i < config.models.length; i++) {
            const modelConfig = config.models[i];
            await buildGenesisService(modelConfig, true);
        }
    }

    process.exit();
}
