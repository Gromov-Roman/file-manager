import { createHash } from 'crypto';
import fs from 'fs';
import { resolvePath } from '../helpers/path-resolver.js';

export class HashManager {
    constructor(currentDir) {
        this.currentDir = currentDir;
    }

    async calculateHash(filePath) {
        if (!filePath) {
            console.log('Invalid input');
            return;
        }

        try {
            const resolvedPath = resolvePath(this.currentDir, filePath);
            const fileStream = fs.createReadStream(resolvedPath);
            const hash = createHash('sha256');

            fileStream.on('data', (data) => hash.update(data));

            return new Promise((resolve, reject) => {
                fileStream.on('end', () => {
                    console.log(hash.digest('hex'));
                    resolve();
                });

                fileStream.on('error', (error) => reject(error));
            });
        } catch (error) {
            console.error('Operation failed:', error.message);
            throw error;
        }
    }
}
