import { BreakingPromise } from "../breaking-promise.js";
import { Deferred } from "../../deferred/deferred.js";
import { Routine } from "../../routine/routine.js";
import { _deferred, _routine } from "../symbols.js";
import type { BreakCallback } from "../types.js";

export function nest<T, U>(this: BreakingPromise<T>, generator?: BreakCallback<void, U>|null):
    BreakingPromise<void>|BreakingPromise<U>
{
    if (generator == null) return BreakingPromise.resolve();
    const deferred = new Deferred<U>();
    const promise = new BreakingPromise<U>((resolve, reject) => {
        deferred.promise(resolve, reject);
    });
    const routine = new Routine(promise);
    this[_deferred] ??= new Deferred<T>();
    const parent = this[_deferred];
    deferred.stop = function(this: Deferred<U>, force?: boolean) {
        deferred.status = force ? Deferred.Status.Force : Deferred.Status.Stop;
        parent.stop(force);
    };
    this[_routine] ??= new Routine(this);
    routine.shadow(this[_routine]);
    promise[_deferred] = deferred;
    promise[_routine] = routine;
    deferred.iterate(generator.call(routine))
        .then(deferred.resolve, deferred.reject);
    return promise;
}
