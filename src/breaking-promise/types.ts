import type * as types from '../types.js';
import type { Routine } from '../routine/routine.js';

export const enum Status {
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected',
}

export type Value<T> = types.Value<T>;
export type Reason = types.Reason;

export type Reject = types.Reject<Reason, Reject.Return>;
type _Reason = Reason;
export namespace Reject {
    export type Reason = _Reason;
    export type Return = void;
}

export interface Resolve<T> {
    (value: T): Resolve.Return
}
export namespace Resolve {
    export type Value<T> = PromiseLike<T>|T;
    export type Return = void;
}

export interface ConstructorCallback<T> {
    (resolve: Resolve<T>, reject: Reject): void
}

export interface BreakCallback<T, U> {
    (this: Routine<U>, value?: T|void): types.Generator<U>
}

export interface ThenCallback<T, U> {
    (value: T): U|PromiseLike<U>
}

export interface CatchCallback<T = Reason> {
    (reason: Reason): T|PromiseLike<T>
}
