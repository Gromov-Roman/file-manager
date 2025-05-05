import fs from 'fs';
import path from 'path';
import { resolvePath } from '../helpers/path-resolver.js';
import { pipeline } from 'stream/promises';

export class FilesManager {
    constructor(currentDir) {
        this.currentDir = currentDir;
    }

    async readFile(filePath) {
        if (!filePath) {
            console.log('Invalid input');
            return;
        }

        try {
            const resolvedPath = resolvePath(this.currentDir, filePath);
            const readStream = fs.createReadStream(resolvedPath, {encoding: 'utf8'});

            readStream.on('data', (chunk) => process.stdout.write(chunk));

            return new Promise((resolve, reject) => {
                readStream.on('end', () => {
                    console.log();
                    resolve();
                });

                readStream.on('error', (error) => reject(error));
            });
        } catch (error) {
            console.error('Operation failed:', error.message);
            throw error;
        }
    }

    async createFile(fileName) {
        if (!fileName) {
            console.log('Invalid input');
            return;
        }

        try {
            const filePath = path.resolve(this.currentDir, fileName);
            await fs.promises.writeFile(filePath, '', {flag: 'wx'});
        } catch (error) {
            console.error('Operation failed:', error.message);
            throw error;
        }
    }

    async removeFile(filePath) {
        if (!filePath) {
            console.log('Invalid input');
            return;
        }

        try {
            const resolvedPath = resolvePath(this.currentDir, filePath);

            await fs.promises.unlink(resolvedPath);
        } catch (error) {
            console.error('Operation failed:', error.message);
            throw error;
        }
    }

    async copyFile(sourcePath, destinationDir) {
        if (!sourcePath || !destinationDir) {
            console.log('Invalid input');
            return;
        }

        try {
            const resolvedSourcePath = resolvePath(this.currentDir, sourcePath);
            const resolvedDestDir = resolvePath(this.currentDir, destinationDir);
            const destStats = await fs.promises.stat(resolvedDestDir);

            if (!destStats.isDirectory()) {
                console.error('Operation failed:', 'Destination is not a directory');
                return;
            }

            const fileName = path.basename(resolvedSourcePath);
            const destinationPath = path.join(resolvedDestDir, fileName);

            const readStream = fs.createReadStream(resolvedSourcePath);
            const writeStream = fs.createWriteStream(destinationPath);

            await pipeline(readStream, writeStream);
        } catch (error) {
            console.error('Operation failed:', error.message);
            throw error;
        }
    }

    async moveFile(sourcePath, destinationDir) {
        if (!sourcePath || !destinationDir) {
            console.log('Invalid input');
            return;
        }

        try {
            await this.copyFile(sourcePath, destinationDir);

            const resolvedSourcePath = resolvePath(this.currentDir, sourcePath);

            await fs.promises.unlink(resolvedSourcePath);
        } catch (error) {
            console.error('Operation failed:', error.message);
            throw error;
        }
    }

    async renameFile(oldPath, newName) {
        if (!oldPath || !newName) {
            console.log('Invalid input');
            return;
        }

        try {
            const resolvedOldPath = resolvePath(this.currentDir, oldPath);
            const dirName = path.dirname(resolvedOldPath);
            const resolvedNewPath = path.join(dirName, newName);

            await fs.promises.rename(resolvedOldPath, resolvedNewPath);
        } catch (error) {
            console.error('Operation failed:', error.message);
            throw error;
        }
    }

    async createDirectory(dirName) {
        if (!dirName) {
            console.log('Invalid input');
            return;
        }

        try {
            const dirPath = path.resolve(this.currentDir, dirName);
            await fs.promises.mkdir(dirPath);
        } catch (error) {
            console.error('Operation failed:', error.message);
            throw error;
        }
    }
}
