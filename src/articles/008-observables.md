---
path: /articles/observables
date: 2019-02-07
title: Observables
peek: Or, an idiomatic way to avoid callback hell.
tags: [javascript, rxjs]
imported: true
---

Reactive programming is a paradigm that focuses on asynchronous data flow over time. It's well-fitted to any application that deals with
network requests, user input, or any sort of input that comes at varying intervals over time. There are a few different established
patterns for dealing with this sort of input, and you're likely already familiar with at least one.

## Callbacks

The original solution to this was to use callback functions. Let's look at an example of this:

```js
function loadData(path, callback) {
  try {
    const data = /* load some data from `path` */;
    callback(data, null);
  } catch (err) {
    callback([], err);
  }
}

loadData('/api/users', (users, err) => {
  // do something with `users`
});
```

This works alright for one-time use, but you quickly run into a problem known as **callback hell**:

```js
loadData('/api/users', (users, err) => {
  loadData('/api/posts', (posts, err) => {
    loadData('/api/comments', (comments, err) => {
      // as you can imagine, it only gets worse from here
    });
  });
});
```

## Promises

The first widely adopted solution to this came in the form of `Promise`s, originally provided via 3rd party libraries like
[Bluebird](http://bluebirdjs.com/docs/getting-started.html) and [Q](https://github.com/kriskowal/q); they've since been incorporated into
JS core with [ES6](http://es6-features.org/#PromiseUsage). Functions that return a `Promise` can be chained with a `.then()` call to handle
data returned via `resolve` and optionally a `.catch()` call to handle errors throw with `reject`:

```js
function loadData(path) {
  return new Promise((resolve, reject) => {
    try {
      const data = /* load some data from `path` */;
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
}

loadData('/api/users')
  .then(users => {
    // do something with users
  })
  .catch(err => {
    // handle the err
  })
```

While this doesn't entirely avoid callback hell, it at least flattens it out:

```js
loadData('/api/users')
  .then(users => {
    return new Promise((resolve, reject) => {
      loadData('/api/posts')
        .then(resolve)
        .catch(reject);
    });
  })
  .then(posts => {
    return new Promise((resolve, reject) => {
      loadData('/api/comments')
        .then(resolve)
        .catch(reject);
    });
  })
  .then(comments => {
    // do something with `comments`
  });
```

This opens up a new problem with variable scoping, though: when chaining `Promise` calls, you have to return every variable you want to use
later on down the chain, even if you don't use it in the directly following call:

```js
loadData('/api/users')
  .then(users => {
    return new Promise((resolve, reject) => {
      loadData('/api/posts')
        .then(posts => resolve([users, posts]))
        .catch(reject);
    });
  })
  .then(([users, posts]) => {
    return new Promise((resolve, reject) => {
      loadData('/api/comments')
        .then(comments => resolve([users, posts, comments]))
        .catch(reject);
    });
  })
  .then(([users, posts, comments]) => {
    // do something with `users, `posts, and `comments`
  });
```

## Asynchronous Functions

Our code is less nested but more needlessly complex. Enter
[ES8](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)'s `async`/`await`:

```js
function loadData(path) {
  return new Promise((resolve, reject) => {
    try {
      const data = /* load some data from `path` */;
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
}

async function run() {
  try {
    const users = await loadData('/api/users');
    const posts = await loadData('/api/posts');
    const comments = await loadData('/api/comments');
  } catch (err) {
    // handle `err` (thrown by any of the 3 Promises)
  }
}

run();
```

Asynchronous functions are an abstraction built on top of `Promise`s, and as you can see often drastically simplify code structure.
However, they're still only well-suited to one-shot asynchronous actions such as a single network request. What if we wanted to open a
channel and listen for many inputs over time?

## Observables

Observables provide an [idiomatic](https://stackoverflow.com/a/84270/885098) solution to handling continuous input streams using a pattern
that will be immediately famililar to anyone who's used a `Promise`. They have not been implemented in native JS, so to use them you'll need
to pull from a reactive programming library like [RxJS](https://rxjs-dev.firebaseapp.com/). Here's what an `Observable` looks like in
action:

```js
import { Observable } from 'rxjs';

const obs = new Observable(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});

obs.subscribe(value => {
  console.log(value);
});
// 1
// 2
// 3
```

An Observable's `.subscribe()` method works just like a Promise's `.then()`, except it's invoked each time the Observable pushes a new value
with `.next()`. RxJS provides some useful helper methods to build Observables for you from existing data sources, both synchronous and
asynchronous. Let's look at `of`:

```js
import { of } from 'rxjs';

const obs = of(1, 2, 3);

obs.subscribe(value => {
  console.log(value);
});
// 1
// 2
// 3
```

`of` will create an Observable from any iterable collection that will emit each value of the collection. When calling `.subscribe()` on
an Observable, you can subscribe a few different ways:

```js
import { of } from 'rxjs';

const obs = of(1, 2, 3);

// single callback on `.next()`
obs.subscribe(val => /* do something with val */);

// multiple callbacks for `.next()`, `.error()`, and `.complete()`
obs.subscribe(
  val => /* do something with `val` */,
  err => /* handle `err` */,
  () => /* Observable completed */,
);

// observer Object with `next`, `error`, and `complete` props
obs.subscribe({
  next: val => /* do something with `val` */,
  error: err => /* handle `err` */,
  complete: () => /* Observable completed */,
});
```

If you're already working in a project that relies on `Promise`s and want to try out Observables, just wrap them with RxJS's `from`.

```js
import { from } from 'rxjs';

const obs = from(loadData('api/users'));

obs.subscribe({
  next: users => /* do something with `users` */,
  error: err => /* handle `err` */,
});
```

## Unicast vs. Multicast Observables

Standard `Observable`s are _unicast_, which means each subscriber created by calling `.subscribe()` on the Observable gets a new instance
of the Observable. When running synchronous, repeatable Observables like we've used above, this is usually fine.

```js
import { of } from 'rxjs';

const obs = of(1, 2, 3);

obs.subscribe(val => console.log('first', val));
obs.subscribe(val => console.log('second', val));
// first 1
// first 2
// first 3
// second 1
// second 2
// second 3
```

### Subjects

In the **Real World&trade;**, this is rarely the intended result. If we want to hook up multiple subscribers, we generally want to have
each subscriber react to every `next` output at the same time. To have multiple subscriptions hooked up to the same source Observable,
we need to use a `Subject`. RxJS `Subject`s accept inputs via their `.next()` method and in turn send these inputs along to _any number of
subscribers_ in tandem. `Subject`s may also be used as a subscriber for an `Observable` like so:

```js
import { from, Subject } from 'rxjs';

const sub = new Subject();

sub.subscribe(val => console.log('first', val));
sub.subscribe(val => console.log('second', val));

const obs = from(1, 2, 3);
obs.subscribe(sub);
// first 1
// second 1
// first 2
// second 2
// first 3
// second 3
```

To get this effect from an existing Observable, we have to _multicast_ that observable Observable by piping its outputs through a `Subject`:

```js
import { of } from 'rxjs';

const obs = of(1, 2, 3);
const sub = new Subject();
const multicasted = obs.multicast(sub);

sub.subscribe(val => console.log(val));

multicasted.connect(); // I'll explain this in a sec
```

Just remember - if you only care about one subscriber or each subscriber in exlusion, use an `Observable`. If you want to have your output
synced between multiple subscribers in real time, use a `Subject`.

## Hot vs. Cold Observables

By default, Observables are **cold** - they won't begin outputting values until the first observer subscribes. Often this is best, since
any values output before an observer had subscribed would essentially be thrown away. In our previous example, we had to call `.connect()`
on a multicasted Observable before it would begin emitting values to subscribers. We have to do this because there is an inherit
disconnect within multicasted Observables and their Subject. Observers don't subscribe directly to the source Observable, but instead
subscribe to the multicasted Subject. As a result, the source Observable never sees an observer subscribe, and since it's cold, it will
never start emitting values. Calling `.connect()` on a multicast Subject will trigger its source Observable and have it start emitting
values.

This behavior may be desirable in certain situtations, as we'll see in a moment. Observables that begin emitting values upon instantiation
instead of waiting for an observer to subscribe are referred to as **hot**. So, when may this be useful?

### Replay Subjects

Say we want to keep a record of all messages sent over a channel, but we may not care to view them until the user navigates to the route
responsible for displaying these messages. Instead of hooking up a distinct service that subscribes and records these messages, we can
hand that function over to RxJS in the form of a `ReplaySubject`:

```js
import { from, ReplaySubject } from 'rxjs';
import { getMessagesForChannel } from '../api';

const obs = from(getMessagesForChannel('channel'));
const sub = new ReplaySubject();
obs.subscribe(sub);

// channel emits 'foo'
// channel emits 'bar'
// channel emits 'baz'

// sometime later, once the user navigates to `/messages`

sub.subscribe(message => {
  console.log(message);
});
// immediately:
// foo
// bar
// baz
```

Though the observer didn't subscribe until _after_ the channel had emitted 3 values, it's callback is immediately invoked 3 times as `sub`
replays every input it had previously received.

### Behavior Subjects

Similarly, you may want to get the last emitted value from a hot `Subject` when you subscribe. Imagine a `Subject` that emits the color
theme for a website whenever the user changes to a new theme - any components that want to resopnd to this change would need to immediately
get the most recent theme value on mount, and then listen for future changes and respond accordingly. This may be accomplished using a
`BehaviorSubject`:

```js
import { from, BehaviorSubject } from 'rxjs';
import { getTheme } from '../services/theme.service';

const obs = from(getTheme());
const sub = new BehaviorSubject();
obs.subscribe(sub);

// user changes theme to 'blue'
// user changes theme to 'red'

// sometime later, when a new component is mounted

sub.subscribe(theme => {
  console.log(theme);
});
// immediately:
// red
```

## Conclusion

RxJS comes packed with a ton of useful features for working with input streams, and today we've only looked at a small subset of those
features. If you're working on a project that deals heavily with asynchronous streams, you should absolutely consider implementing
Observables today!
