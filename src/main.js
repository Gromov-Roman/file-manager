import { FileManager } from './file-manager.js';

function parseUsername() {
    const args = process.argv.slice(2);
    const usernameArg = args.find(arg => arg.startsWith('--username='));

    if (!usernameArg) {
        console.log('Username argument is required. Use --username=your_username');
        process.exit(1);
    }

    return usernameArg.split('=')[1] || 'Anonymous';
}

function main() {
    try {
        const username = parseUsername();
        const fileManager = new FileManager(username);

        process.on('SIGINT', () => fileManager.exit());
        fileManager.start();
    } catch (error) {
        console.error('Error starting the file manager:', error.message);
        process.exit(1);
    }
}

main();
