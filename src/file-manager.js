import os from 'os';
import readline from 'readline';

import { Commands } from './consts/enums.js';
import { isValidCommand } from './helpers/validators.js';
import { FilesManager } from './modules/files.js';
import { HashManager } from './modules/hash.js';
import { NavigationManager } from './modules/navigation.js';
import { OsManager } from './modules/os.js';
import { ZipManager } from './modules/zip.js';

export class FileManager {
    #currentDir = os.homedir();

    get currentDir() {
        return this.#currentDir;
    }

    set currentDir(newDir) {
        this.#currentDir = newDir;

        this.navigation.currentDir = newDir;
        this.files.currentDir = newDir;
        this.hash.currentDir = newDir;
        this.zip.currentDir = newDir;
    }


    constructor(username) {
        this.username = username;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        });

        this.navigation = new NavigationManager(this.currentDir);
        this.files = new FilesManager(this.currentDir);
        this.os = new OsManager();
        this.hash = new HashManager(this.currentDir);
        this.zip = new ZipManager(this.currentDir);
    }

    start() {
        console.log(`Welcome to the File Manager, ${this.username}!`);
        this.printCurrentDir();

        this.rl.prompt();

        this.rl.on('line', async (line) => {
            const input = line.trim();

            if (input === Commands.EXIT) {
                this.exit();
                return;
            }

            try {
                await this.processCommand(input);
            } catch (error) {
                console.error('Operation failed:', error.message);
            }

            this.printCurrentDir();
            this.rl.prompt();
        });

        this.rl.on('close', () => {
            this.exit();
        });
    }

    exit() {
        console.log(`Thank you for using File Manager, ${this.username}, goodbye!`);
        process.exit(0);
    }

    printCurrentDir() {
        console.log(`You are currently in ${this.currentDir}`);
    }

    async processCommand(input) {
        const [command, ...args] = input.split(' ');

        if (!isValidCommand(command)) {
            console.log('Invalid input');
            return;
        }

        const processedArgs = [];
        let currentArg = '';
        let inQuotes = false;

        for (const arg of args) {
            if (arg.startsWith('"') && !inQuotes) {
                inQuotes = true;
                currentArg = arg.slice(1);
            } else if (arg.endsWith('"') && inQuotes) {
                inQuotes = false;
                currentArg += ' ' + arg.slice(0, -1);
                processedArgs.push(currentArg);
                currentArg = '';
            } else if (inQuotes) {
                currentArg += ' ' + arg;
            } else {
                processedArgs.push(arg);
            }
        }

        if (inQuotes) {
            console.log('Invalid input');
            return;
        }

        const finalArgs = processedArgs.length > 0 ? processedArgs : args;

        switch (command) {
            // Navigation
            case Commands.UP:
                this.currentDir = this.navigation.navigateUp();
                break;
            case Commands.CD:
                this.currentDir = this.navigation.changeDirectory(finalArgs[0]);
                break;
            case Commands.LS:
                await this.navigation.listDirectory();
                break;

            // Files
            case Commands.CAT:
                await this.files.readFile(finalArgs[0]);
                break;
            case Commands.ADD:
                await this.files.createFile(finalArgs[0]);
                break;
            case Commands.RM:
                await this.files.removeFile(finalArgs[0]);
                break;
            case Commands.CP:
                await this.files.copyFile(finalArgs[0], finalArgs[1]);
                break;
            case Commands.MV:
                await this.files.moveFile(finalArgs[0], finalArgs[1]);
                break;
            case Commands.RN:
                await this.files.renameFile(finalArgs[0], finalArgs[1]);
                break;
            case Commands.MKDIR:
                await this.files.createDirectory(finalArgs[0]);
                break;

            // OS
            case Commands.OS:
                this.os.getOSInfo(finalArgs[0]);
                break;

            // Hash
            case Commands.HASH:
                await this.hash.calculateHash(finalArgs[0]);
                break;

            // zip
            case Commands.COMPRESS:
                await this.zip.compressFile(finalArgs[0], finalArgs[1]);
                break;
            case Commands.DECOMPRESS:
                await this.zip.decompressFile(finalArgs[0], finalArgs[1]);
                break;

            default:
                console.log('Invalid input');
        }
    }
}
