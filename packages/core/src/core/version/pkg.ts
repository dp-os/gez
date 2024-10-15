import fs from 'node:fs';

import type { PackageJson } from '../gez';

export function getPkgHash(filename: string): string | null {
    try {
        const json: PackageJson = JSON.parse(
            fs.readFileSync(filename, 'utf-8')
        );
        return json.hash || null;
    } catch {
        return null;
    }
}
