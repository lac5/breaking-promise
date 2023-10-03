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
    const routine = new Routine<T>();
    const promise = new BreakingPromise<T>((resolve, reject) => {
        deferred.promise(resolve, reject);
    });
    promise[_deferred] = deferred;
    promise[_routine] = routine;
    return { promise, deferred, routine };
}
