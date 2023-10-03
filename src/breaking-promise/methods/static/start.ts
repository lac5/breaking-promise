import { BreakingPromise } from "../../breaking-promise.js";
import { BreakCallback } from "../../types.js";

export function start<T>(this: typeof BreakingPromise, generator: BreakCallback<void, T>) {
    const { promise, deferred, routine } = this.defer<T>();
    deferred.iterate(generator.call(routine))
        .then(deferred.resolve, deferred.reject);
    return promise;
}
