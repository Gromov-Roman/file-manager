export const Commands = Object.freeze({
    // Navigation
    UP: 'up',
    CD: 'cd',
    LS: 'ls',
    // Files
    CAT: 'cat',
    ADD: 'add',
    RM: 'rm',
    CP: 'cp',
    MV: 'mv',
    RN: 'rn',
    MKDIR: 'mkdir',
    // OS
    OS: 'os',
    // Hash
    HASH: 'hash',
    // zip
    COMPRESS: 'compress',
    DECOMPRESS: 'decompress',
    // Exit
    EXIT: '.exit'
});

export const OSFlags = Object.freeze({
    EOL: '--EOL',
    CPUS: '--cpus',
    HOMEDIR: '--homedir',
    USERNAME: '--username',
    ARCHITECTURE: '--architecture'
});
