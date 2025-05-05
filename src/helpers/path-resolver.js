import path from 'path';

export function resolvePath(currentDir, sourcePath) {
    return path.isAbsolute(sourcePath) ? sourcePath : path.resolve(currentDir, sourcePath);
}
