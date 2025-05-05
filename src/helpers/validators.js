import { Commands, OSFlags } from '../consts/enums.js';

export function isValidCommand(cmd) {
    return Object.values(Commands).includes(cmd);
}

export function isValidOSFlag(flag) {
    return Object.values(OSFlags).includes(flag);
}
