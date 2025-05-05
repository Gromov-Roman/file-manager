import fs from 'fs';
import path from 'path';
import { resolvePath } from '../helpers/path-resolver.js';

export class NavigationManager {
    constructor(currentDir) {
        this.currentDir = currentDir;
    }

    navigateUp() {
        const parentDir = path.dirname(this.currentDir);

        if (parentDir === this.currentDir) {
            return this.currentDir;
        }

        return parentDir;
    }

    changeDirectory(targetPath) {
        if (!targetPath) {
            console.log('Invalid input');
            return;
        }

        try {
            const resolvedPath = resolvePath(this.currentDir, targetPath);

            const stats = fs.statSync(resolvedPath);

            if (!stats.isDirectory()) {
                console.log('Not a directory');
                return;
            }

            const normalizedPath = path.normalize(resolvedPath);

            // For Windows, check drive root
            if (process.platform === 'win32') {
                const currentDrive = this.currentDir.split(path.sep)[0];
                const targetDrive = normalizedPath.split(path.sep)[0];

                if (currentDrive && targetDrive && currentDrive !== targetDrive) {
                    return normalizedPath;
                }

                return this.currentDir;
            }

            if (normalizedPath.length < path.parse(this.currentDir).root.length) {
                return this.currentDir;
            }

            return normalizedPath;
        } catch (error) {
            console.error('Operation failed:', error.message);
            return this.currentDir;
        }
    }

    async listDirectory() {
        try {
            const items = await fs.promises.readdir(this.currentDir, { withFileTypes: true });

            const directories = [];
            const files = [];

            for (const item of items) {
                if (item.isDirectory()) {
                    directories.push({ name: item.name, type: 'directory' });
                } else if (item.isFile()) {
                    let ext = '';

                    const chunks = item.name.split('.');
                    if (chunks.length > 1) {
                        ext = ` .${chunks.at(-1)}`;
                    }

                    files.push({ name: item.name, type: 'file', ext });
                }
            }

            directories.sort((a, b) => a.name.localeCompare(b.name));
            files.sort((a, b) => a.name.localeCompare(b.name));

            const directoriesData = directories.map((item) => {
                return { name: item.name, type: `📁 ${item.type}` };
            });

            const filesData = files.map((item) => {
                return { name: item.name, type: `📄 ${item.type}${item.ext}` };
            });


            if (directoriesData.length) {
                console.log('📁 Directories:');
                console.table(directoriesData);
            } else {
                console.log('No directories');
            }

            if (filesData.length) {
                console.log('📄 Files:');
                console.table(filesData);
            } else {
                console.log('No files');
            }
        } catch (error) {
            console.log('Operation failed:', error);
        }
    }
}

