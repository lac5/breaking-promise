export const aggreagateError = typeof AggregateError !== 'undefined' ?
    (errors: any[], message: string) => new AggregateError(errors, message) :
    (errors: any[], message: string) => new Error((message ? [message + ':'].concat(errors.map(String)) : errors).join('\n'))
