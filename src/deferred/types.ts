import type * as types from '../types.js';

export const enum Status {
    Go = 'go',
    Stop = 'stop',
    Force = 'force',
}

export type Value<T = any> = T|undefined;
export type Error = types.Reason;
