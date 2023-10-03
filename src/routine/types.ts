export const enum Status {
    Return = 'return',
    Throw = 'throw',
    Unset = 'unset',
}

export type Return<T = any> = T|undefined;

export type Throw = Return<any>;
