import { Routine } from '../routine/index.js';
import { Deferred } from '../deferred/index.js';
import * as routine from '../routine/index.js';
import * as deferred from '../deferred/index.js';

import { Status, Value, Reason, Resolve, Reject, ConstructorCallback } from './types.js';
import * as types from './types.js';

import {_deferred, _routine } from './symbols.js';
import * as Methods from './methods/index.js';

export class BreakingPromise<T> extends Promise<T> {
    [_deferred]: Deferred<T>|null = null;
    [_routine]: Routine<T>|null = null;

    status: Status = Status.Pending;
    value: Value<T> = void 0;
    reason: Reason = void 0;

    constructor(callback: ConstructorCallback<T>) {
        let resolve: Resolve<T>, reject: Reject;
        super((resolve_, reject_) => {
            resolve = resolve_;
            reject = reject_;
        });
        const rejectWrap = (reason: Reject.Reason) => {
            if (this[_routine] != null) {
                reason = this[_routine].throwOr(reason);
            }
            this.break(true);
            this.reason = reason;
            this.status = Status.Rejected;
            this[_deferred] = null;
            this[_routine] = null;
            reject(reason);
        };
        const resolveWrap = (value?: Resolve.Value<T>) => {
            Promise.resolve(value).then((value: T|undefined) => {
                if (this[_routine] != null) {
                    value = this[_routine].returnOr(value);
                }
                this.break(true);
                this.value = value;
                this.status = Status.Fulfilled;
                this[_deferred] = null;
                this[_routine] = null;
                resolve(value!);
            }, rejectWrap);
        };
        callback(resolveWrap, rejectWrap);
    }

    declare break: typeof Methods.breakFn;
    declare then: typeof Methods.then;
    declare catch: typeof Methods.catchFn;

    static start = Methods.Static.start;
    static defer = Methods.Static.defer;
    static resolve = Methods.Static.resolve;
    static reject = Methods.Static.reject;
}

BreakingPromise.prototype.break = Methods.breakFn;
BreakingPromise.prototype.then = Methods.then;
BreakingPromise.prototype.catch = Methods.catchFn;

export namespace BreakingPromise {
    export import Routine = routine.Routine;
    export import Deferred = deferred.Deferred;
    export import Status = types.Status;
    export import Value = types.Value;
    export import Reason = types.Reason;
    export import Reject = types.Reject;
    export import Resolve = types.Resolve;
    export import ConstructorCallback = types.ConstructorCallback;
    export import BreakCallback = types.BreakCallback;
    export import ThenCallback = types.ThenCallback;
    export import CatchCallback = types.CatchCallback;
}
