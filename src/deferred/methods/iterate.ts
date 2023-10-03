import { Deferred } from "../deferred.js";
import { Next, Generator } from "../../types.js";
import { Status } from "../types.js";

export async function iterate<T>(this: Deferred<T>, iterator: Generator<T>): Promise<T> {
    let next: Next<T> = {
        value: void 0,
        done: false
    };

    let returnValue: T = next.value;

    const onResolve = (value: any) => {
        switch (this.status) {
            case 'stop':
                this.status = Status.Go;
                /* fall through */
            case 'force':
                next = iterator.return(value) ?? {
                    value: next.value,
                    done: true
                };
                returnValue = next.value;
                break;
            default:
                next = iterator.next(value) ?? {
                    value: next.value,
                    done: true
                };
        }
    };

    const onReject = (error: any) => {
        switch (this.status) {
            case 'stop':
                this.status = Status.Go;
                /* fall through */
            case 'force':
                next = iterator.return(void 0) ?? {
                    value: next.value,
                    done: true
                };
                returnValue = next.value;
                break;
            default:
                next = iterator.throw(error) ?? {
                    value: next.value,
                    done: true
                };
        }
    };

    const unhandledError = (error: any) => {
        return this.reject!(error);
    };

    while (!next.done) {
        await Promise.resolve(next.value)
            .then(onResolve, onReject)
            .catch(unhandledError);
    }

    return returnValue;
}
