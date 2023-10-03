import { Status, Return, Throw } from './types.js';
import * as types from './types.js';

export class Routine<T> {
    #status: Status = Status.Unset;
    #return: Return<T> = void 0;
    #throw: Throw = void 0;

    get return() { return this.#status === 'return' ? this.#return : void 0; }
    set return(value) { 
        if (!(#return in this)) return;
        this.#status = Status.Return;
        this.#return = value;
        this.#throw = void 0;
    }

    get throw() { return this.#status === 'throw' ? this.#throw : void 0; }
    set throw(reason) { 
        this.#status = Status.Throw;
        this.#throw = reason;
    }

    returnOr(value?: T|undefined) {
        return this.#status === 'return' ? this.#return : value;
    }

    throwOr(reason?: any|undefined) {
        return this.#status === 'throw' ? this.#throw : reason;
    }
}

export namespace Routine {
    export import Status = types.Status;
    export import Return = types.Return;
    export import Throw = types.Throw;
}
