import os from 'os';

import { OSFlags } from '../consts/enums.js';
import { isValidOSFlag } from '../helpers/validators.js';

export class OsManager {
    getOSInfo(flag) {
        if (!flag) {
            console.log('Invalid input');
            return;
        }

        try {
            if (!isValidOSFlag(flag)) {
                console.log('Invalid input');
                return;
            }

            switch (flag) {
                case OSFlags.EOL:
                    console.log(JSON.stringify(os.EOL));
                    break;
                case OSFlags.CPUS:
                    const cpus = os.cpus();
                    console.log(`Overall amount of CPUs: ${cpus.length}`);
                    cpus.forEach((cpu, i) => {
                        console.log(`CPU ${i + 1}: ${cpu.model} (${(cpu.speed / 1000).toFixed(2)} GHz)`);
                    });
                    break;
                case OSFlags.HOMEDIR:
                    console.log(os.homedir());
                    break;
                case OSFlags.USERNAME:
                    console.log(os.userInfo().username);
                    break;
                case OSFlags.ARCHITECTURE:
                    console.log(os.arch());
                    break;
                default:
                    console.log('Invalid input');
            }
        } catch (error) {
            console.error('Operation failed:', error.message);
            throw error;
        }
    }
}
