import { Status, Value, Error } from './types.js';
import * as types from './types.js';
import { Resolve, Reject } from '../types.js';

import * as Methods from './methods/index.js';

export class Deferred<T = any> {
    status = Status.Go;
    value: Value<T> = void 0;
    error: Error = void 0;
    resolve: Resolve<T>|null = null;
    reject: Reject<Error>|null = null;

    declare promise: typeof Methods.promise;
    declare iterate: typeof Methods.iterate;
}

Deferred.prototype.promise = Methods.promise;
Deferred.prototype.iterate = Methods.iterate;

export namespace Deferred {
    export import Status = types.Status;
    export import Value = types.Value;
    export import Error = types.Error;
}
