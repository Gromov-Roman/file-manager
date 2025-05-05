import fs from 'fs';
import { resolvePath } from '../helpers/path-resolver.js';
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';

export class ZipManager {
    constructor(currentDir) {
        this.currentDir = currentDir;
    }

    async compressFile(sourcePath, destinationPath) {
        if (!sourcePath || !destinationPath) {
            console.log('Invalid input');
            return;
        }

        try {
            const resolvedSourcePath = resolvePath(this.currentDir, sourcePath);
            const resolvedDestPath = resolvePath(this.currentDir, destinationPath);

            const readStream = fs.createReadStream(resolvedSourcePath);
            const writeStream = fs.createWriteStream(resolvedDestPath);
            const brotli = createBrotliCompress();

            await pipeline(readStream, brotli, writeStream);
        } catch (error) {
            console.error('Operation failed:', error.message);
            throw error;
        }
    }

    async decompressFile(sourcePath, destinationPath) {
        if (!sourcePath || !destinationPath) {
            console.log('Invalid input');
            return;
        }

        try {
            const resolvedSourcePath = resolvePath(this.currentDir, sourcePath);
            const resolvedDestPath = resolvePath(this.currentDir, destinationPath);

            const readStream = fs.createReadStream(resolvedSourcePath);
            const writeStream = fs.createWriteStream(resolvedDestPath);
            const brotli = createBrotliDecompress();

            await pipeline(readStream, brotli, writeStream);
        } catch (error) {
            console.error('Operation failed:', error.message);
            throw error;
        }
    }
}
