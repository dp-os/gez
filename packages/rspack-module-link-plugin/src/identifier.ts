import upath from 'upath';

export function generateIdentifier({
    root,
    name,
    filePath
}: { root: string; name: string; filePath: string }) {
    const file = upath.relative(upath.toUnix(root), upath.toUnix(filePath));
    return `${name}@${file}`;
}
