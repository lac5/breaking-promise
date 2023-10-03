import { BreakingPromise } from "../breaking-promise.js";
import { _deferred, _routine } from "../symbols.js";
import { CatchCallback, ThenCallback } from "../types.js";

export function then<T, U = T, V = never>(this: BreakingPromise<T>, thenCb?: ThenCallback<T, U>|null, catchCb?: CatchCallback<V>|null) {
    let promise = new BreakingPromise<U|V>((resolve, reject) => {
        Promise.prototype.then.call(
            Promise.prototype.then.call(
                this,
                thenCb,
                catchCb),
            resolve,
            reject);
    });
    promise[_deferred] = this[_deferred] as any;
    promise[_routine] = this[_routine] as any;
    return promise;
}
