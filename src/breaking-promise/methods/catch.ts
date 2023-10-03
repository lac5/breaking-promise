import { BreakingPromise } from "../breaking-promise.js";
import { _deferred, _routine } from "../symbols.js";
import { CatchCallback } from "../types.js";

export function catchFn<T, U = T, V = never>(this: BreakingPromise<T>, catchCb?: CatchCallback<V>|null) {
    let promise = new BreakingPromise<U|V>((resolve, reject) => {
        Promise.prototype.then.call(
            Promise.prototype.catch.call(
                this,
                catchCb),
            resolve,
            reject);
    });
    promise[_deferred] = this[_deferred] as any;
    promise[_routine] = this[_routine] as any;
    return promise;
}
