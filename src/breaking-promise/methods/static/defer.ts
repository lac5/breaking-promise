import { BreakingPromise } from "../../breaking-promise.js";
import { Deferred } from "../../../deferred/deferred.js";
import { Routine } from "../../../routine/routine.js";
import { _deferred, _routine } from "../../symbols.js";

export function defer<T>(this: typeof BreakingPromise): {
    promise: BreakingPromise<T>,
    deferred: Deferred<T>,
    routine: Routine<T>,
} {
    const deferred = new Deferred<T>();
    const promise = new BreakingPromise<T>((resolve, reject) => {
        deferred.promise(resolve, reject);
    });
    const routine = new Routine(promise);
    promise[_deferred] = deferred;
    promise[_routine] = routine;
    return { promise, deferred, routine };
}
