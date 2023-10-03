import { BreakingPromise } from "../../breaking-promise.js";
import { Reason } from "../../types.js";

export function reject(reason?: Reason) {
    return new BreakingPromise<never>((_, reject) => reject(reason));
}
