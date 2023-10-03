import type { Deferred } from "../deferred.js";
import { Status } from "../types.js";

export function stop(this: Deferred, force?: boolean) {
    this.status = force ? Status.Force : Status.Stop;
}
