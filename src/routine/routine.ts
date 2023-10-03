import type { BreakingPromise } from '../breaking-promise/breaking-promise.js';
import { Status, Return, Throw } from './types.js';
import * as types from './types.js';

export class Routine<T> {
    #status: Status = Status.Unset;
    #return: Return<T> = void 0;
    #throw: Throw = void 0;
    #parent: Routine<any|undefined>|undefined = void 0;

    readonly promise: BreakingPromise<T>;

    constructor(promise: BreakingPromise<T>) {
        this.promise = promise;
    }

    get return(): Return<T>|void {
        if (this.#status === 'return') {
            return Routine.returnOf(this);
        }
    }
    set return(value: Return<T>) {
        Routine.returnOf(this, value);
    }

    get throw(): Throw|void {
        if (this.#status === 'throw') {
            return Routine.throwOf(this);
        }
    }
    set throw(reason: Throw) {
        Routine.throwOf(this, reason);
    }

    returnOr(value?: Return<T>|undefined) {
        if (this.#status === 'return') {
            let shadow = this.#parent;
            if (shadow != null) {
                return shadow.#return;
            }
            return this.#return;
        }
        return value;
    }

    throwOr(reason?: Throw|undefined) {
        if (this.#status === 'throw') {
            let shadow = this.#parent;
            if (shadow != null) {
                return shadow.#throw;
            }
            return this.#throw;
        }
        return reason;
    }

    shadow(routine: Routine<any>) {
        this.#parent = routine;
        this.#status = routine.#status;
    }

    static returnOf<T>(routine: Routine<T>, value: Return<T>|undefined): void;
    static returnOf<T>(routine: Routine<T>): Return<T>;
    static returnOf<T>(...args: [routine: Routine<T>]|[routine: Routine<T>, Return<T>|undefined]): Return<T>|void {
        let routine = args[0];
        if (args.length < 2) {
            let parent = routine.#parent;
            if (parent != null) {
                return Routine.returnOf(parent);
            }
            return routine.#return;
        } else {
            let value = args[1];
            routine.#status = Status.Return;
            routine.#return = value;
            routine.#throw = void 0;
            let shadow = routine.#parent;
            if (shadow != null) {
                Routine.returnOf(shadow, value as Return<any>);
            }
        }
    }

    static throwOf(routine: Routine<any>, value: Throw): void;
    static throwOf(routine: Routine<any>): Throw;
    static throwOf(...args: [routine: Routine<any>]|[routine: Routine<any>, Throw]): Throw|void {
        let routine = args[0];
        if (args.length < 2) {
            let parent = routine.#parent;
            if (parent != null) {
                Routine.throwOf(parent);
            }
            return routine.#throw;
        } else {
            let reason = args[1];
            routine.#status = Status.Return;
            routine.#throw = reason;
            let parent = routine.#parent;
            if (parent != null) {
                Routine.throwOf(parent, reason);
            }
        }
    }
}

export namespace Routine {
    export import Status = types.Status;
    export import Return = types.Return;
    export import Throw = types.Throw;
}
