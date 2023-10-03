export type Value<T = any> = T|undefined;

export type Reason = Value<any>;

export interface Reject<T = Reject.Reason, U = Reject.Return> {
    (reason?: T): U
}
type _Reason = Reason;
export namespace Reject {
    export type Reason = _Reason;
    export type Return = Promise<never>;
}

export interface Resolve<T, U = Resolve.Return<T>> {
    (value: T): U
}
export namespace Resolve {
    export type Value<T> = T
    export type Return<T> = Promise<T>;
}

export type Next<T> = IteratorResult<any, T|void>;

export type Generator<T> = globalThis.Generator<any, T|void, Next<T>>;
