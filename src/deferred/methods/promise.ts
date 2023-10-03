import { Deferred } from "../deferred.js";
import { Status } from "../types.js";
import { Resolve, Reject } from "../../types.js";
import { aggreagateError } from "../../aggregate-error.js";

export function promise<T>(this: Deferred<T>, promiseResolve: Resolve<T, Resolve.Return<T>|void>, promiseReject: Reject<Error, Reject.Return|void>) {
    const reject: Reject  = (error: Reject.Reason) => {
        this.status = Status.Force;
        this.value = void 0;
        this.error = error;
        try {
            promiseReject(error);
        } catch (anotherError) {
            return Promise.reject(aggreagateError([], 'Error handling promises'));
        }
        return Promise.reject(error);
    };
    const resolve: Resolve<T> = (value: Resolve.Value<T>) => {
        return Promise.resolve(value).then((value: T) => {
            this.status = Status.Force;
            this.value = value;
            this.error = void 0;
            try {
                promiseResolve(value);
            } catch (error) {
                return reject(error);
            }
            return value;
        }, reject);
    };
    this.resolve = resolve;
    this.reject = reject;
    return this;
}
