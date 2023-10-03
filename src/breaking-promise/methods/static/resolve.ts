import { BreakingPromise } from "../../breaking-promise.js";
import { _deferred, _routine } from "../../symbols.js";

export function resolve<T>(this: typeof BreakingPromise, value?: T) {
    if (value instanceof BreakingPromise) {
        let promise = new BreakingPromise<T>((resolve, reject) => {
            Promise.prototype.then.call(value, resolve, reject);
        });
        promise[_deferred] = value[_deferred];
        promise[_routine] = value[_routine];
        return promise;
    } else if (value != null) {
        return new BreakingPromise<typeof value>((resolve, reject) =>
            Promise.resolve(value).then(resolve, reject)
        );
    } else {
        return new BreakingPromise<typeof value>((resolve) => resolve(value));
    }
}
