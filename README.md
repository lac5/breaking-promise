Have you ever wantted to stop an async function after it exicuted?

```js
async function countTo100Million() {
    for (let i = 1; i < 100_000_000; i++) {
        console.log(i);
        await new Promise(r => setTimeout(r, 1000));
    }
}

await countTo100Million();
/* Oops! Can't stop it now! */
```

Well now there's an options!

## Install
```
npm install breaking-promise
```

## BreakingPromise
`BreakingPromise` is a class that extneds JavaAScript's `Promise` class and adds an additional method `.break(...)` which allows you to stop it at any point.

### Examples

#### Start
`BreakingPromise.start(...)` starts a promise. It expects a generator function, and you can use `yield` like `await` similar to the [`co` module](https://www.npmjs.com/package/co).

##### `.start(function)`
```js
import { BreakingPromise } from 'breaking-promise';

/* Count to 100,000,000. */
var promise = BreakingPromise.start(functon*() {
    for (let i = 1; i < 100_000_000; i++) {
        console.log(i);
        yield new Promise(r => setTimeout(r, 1000));
    }
});
```

#### Break
`.break()` breaks a promise. It will stop at wherever the last `yield` that it's currently on.

##### `.break()`
```js
/* This is taking too long... */
setTimeout(() => {
    promise.break();
    /* No more counting. */
}, 5000);

await promise;
```

#### Break safely
If there's a `try { } finally { }` block in the generator function, the `finally` block will run before breaking. Think of `.break()` as like inserting a `return` at wherever the generator currently is.

##### `.break()`
```js
/* Count to 100,000,000. */
var promise = BreakingPromise.start(functon*() {
    let i;
    try {
        for (i = 1; i < 100_000_000; i++) {
            console.log(i);
            yield new Promise(r => setTimeout(r, 1000));
        }
    } finally {
        /* Count down to 0. */
        for (i--; i >= 0; i--) {
            console.log(i);
            yield new Promise(r => setTimeout(r, 1000));
        }
    }
});

setTimeout(() => {
    promise.break();
}, 5000);

await promise;

/* Results:
1
2
3
4
5
4
3
2
1
0
*/
```

#### Break unsafely
Calling `.break(true)`will force the promise to keep breaking until it's over. This is like turning every `yield` into `return`.

##### `.break(true)`
```js
// ...

setTimeout(() => {
    promise.break(true);
}, 5000);

await promise;

/* Results:
1
2
3
4
5
4
*/
```

#### Break and start again
You can pass a generator function to start a new promise when the previous one stops. 

##### `.break(function)`
```js
await promise.break(function*() {
    /* Wait until promise is funished */
    Console.log('Now hold your breath for 10 seconds:');
    yield new Promise(r => setTimeout(r, 10000));
    Console.log('Now breathe');
});
```

Passing `true` will force it to stop.

##### `.break(function, true)`
```js
await promise.break(function*() {
    console.log('Stop!');
}, true);
```

Another option is to pass an error handler similar to `.then`.

##### `.break(function, function)`
```js
await promise.break(function*(value) {
    console.log('Hold on...');
    yield new Promise(r => setTimeout(r, 10000));
    console.log('I see %o', value);
}, function*(error) {
    consol.log('Oh no! ...');
    yield new Promise(r => setTimeout(r, 10000));
    consol.log('An error!');
    console.error(error);
});
```

### Links
[GitHub](https://github.com/lac5/breaking-promise) |
[Issues](https://github.com/lac5/breaking-promise/issues) |
[npmjs](https://www.npmjs.com/package/breaking-promise)
