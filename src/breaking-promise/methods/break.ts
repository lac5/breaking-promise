import { BreakingPromise } from "../breaking-promise.js";
import { _deferred } from "../symbols.js";
import { BreakCallback, Reason } from "../types.js";

export function breakFn<T, U>(this: BreakingPromise<T>, thenGenerator: BreakCallback<T, U>|null, catchGenerator: BreakCallback<Reason, U>|null): BreakingPromise<U>;
export function breakFn<T, U>(this: BreakingPromise<T>, thenGenerator: BreakCallback<T, U>|null, force: boolean): BreakingPromise<U>;
export function breakFn<T, U>(this: BreakingPromise<T>, thenGenerator: BreakCallback<T, U>): BreakingPromise<U>;
export function breakFn<T, U>(this: BreakingPromise<T>, force: boolean): BreakingPromise<T>;
export function breakFn<T, U>(this: BreakingPromise<T>): BreakingPromise<T>;
export function breakFn<T, U>(this: BreakingPromise<T>, ...args:
    []|
    [boolean|BreakCallback<T, U>|null]|
    [BreakCallback<T, U>|null, boolean|BreakCallback<Reason, U>|null]
): BreakingPromise<T>|BreakingPromise<U> {
    let thenGenerator: BreakCallback<T, U>|null;
    let catchGenerator: BreakCallback<Reason, U>|null;
    let force: boolean;
    if (typeof args[0] === 'function') {
        thenGenerator = args[0];
        if (typeof args[1] === 'function') {
            catchGenerator = args[1];
            force = false;
        } else {
            catchGenerator = null;
            force = !!args[1];
        }
    } else {
        thenGenerator = null;
        catchGenerator = null;
        force = !!args[0];
    }
    if (force) {
        if (this[_deferred] != null) {
            this[_deferred].stop(true);
        }
        if (thenGenerator != null) {
            return BreakingPromise.start<U>(thenGenerator as BreakCallback<void, U>);
        }
    } else {
        if (this[_deferred] != null) {
            this[_deferred].stop();
        }
        if (thenGenerator != null || catchGenerator != null) {
            const { promise, deferred, routine } = BreakingPromise.defer<U>();
            const start = thenGenerator != null ? (value: T) => {
                (deferred.iterate(thenGenerator!.call(routine, value))
                    .then(deferred.resolve, deferred.reject));
            } : null;
            const catchFn = catchGenerator != null ? (reason: Reason) => {
                (deferred.iterate(catchGenerator!.call(routine, reason))
                    .then(deferred.resolve, deferred.reject));
            } : null;
            Promise.prototype.then.call(this, start, catchFn ?? start);
            return promise;
        }
    }
    return this;
}
