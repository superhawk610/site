---
path: /articles/assert
date: 2019-02-19
title: A is for Assert
subtitle: ABCs of JavaScript
peek: |
  All programmers are perfect, of course.
  For those times where we're not, toss in an assert.
tags: [abcs, javascript]
imported: true
---

If you've only worked on your own projects in the past, you may not be familiar with assertions. An **assertion** is a simple test to
check that an unknown value matches a known form. When working exclusively on a project, you write all the code you run, so you
generally know exactly what function parameters will be since you're passing them yourself. In addition, the advent of static typing
in the form of Flow and TypeScript often removes the need for basic type assertions since your editor will catch the problem before
you ever run your code.

You don't actually write all the code you run, do you? Modern JS relies heavily on `node_modules`, a directory we pull from regularly
without ever seeing the source code directly. Assertions are key in well-written library code as they insure the project that they're
used in does so properly and as expected by the library author. Node has a builtin `assert` module that works well for this:

```js
const assert = require('assert');

assert.equal(1, 2); // AssertionError: 1 == 2
```

Obviously 1 is not equal to 2, so `assert` throws an `AssertionError` to let the user know. Most libraries will wrap this in a `try/catch`
and in turn throw a prettier error that's more descriptive of the problem:

```js
const assert = require('assert');

function acceptsOne(val) {
  try {
    assert.equal(val, 1);
  } catch (err) {
    assert.ok(err instanceof assert.AssertionError);
    throw new Error('this function only accepts the value `1`');
  }
}
```

## Complex Assertions

For more complex assertions, you can run your own check and assert that it returns a truthy value using `assert.ok`, or just call
`assert()` directly.

```js
const assert = require('assert');

assert.ok(true);
// is the same as
assert(true);
```

Using this format, we can check that a number is within an acceptable range, that an array is of the required length, or even check
that a string matches a pattern:

```js
const assert = require('assert');

function acceptsLessThan100(num) {
  try {
    assert(num < 100);
  } catch (err) {
    throw new Error('this function only accepts numbers less than `100`');
  }
}

function acceptsLongArrays(arr) {
  try {
    assert(arr.length > 100);
  } catch (err) {
    throw new Error(
      'this function only accepts arrays with 100 or more elements',
    );
  }
}

function savePassword(password) {
  try {
    assert(
      password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      ),
    );
  } catch (err) {
    // maybe we just want to warn the user is their password is insecure
    // but continue processing it regardless - we can just log a warning
    console.warn('your password is insecure');
  }

  // ...
}
```

## CLI Tools

If you ever find yourself writing a CLI tool, you'll find that a few preemptive assertions can save you a ton of headache down the road,
avoiding head-scratching bugs and angry issues on your repo. It's best to insure that CLI options come in the form that you expect -
better to quit immediately and warn the user about invalid input rather than press forward and potentially damage their system with some
unforeseen behavior. Even just asserting things as simple as the truthiness of a parameter can be helpful, as _you_ know not to call it
without a required parameter but your users may not.

```js
const assert = require('assert');
const { FILES, NAME } = process.env;

try {
  assert(FILES);
  assert(NAME);
  assert(FILES.length);
  assert(NAME[0] !== '/');
} catch (err) {
  console.error('you must provide a list of files FILES and an output');
  console.error('file NAME that does not begin with a `/`');
}
```

## Unit Testing

What if you don't make a habit of writing libraries? You'll still run into assertions in the form of **unit testing**. You may be more
familiar with [Jest's](https://jestjs.io/) `expect` (or [Jasmine](https://jasmine.github.io/) if you've been around a bit longer). Unit
testing frameworks provide a robust abstraction on top of simple assertions, providing you with valuable detailed feedback on why a
particular assertion failed and a simple to use CLI to automate your tests on your machine or as a part of your
[continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) pipeline.

With a unit testing framework, you generally provide a value to a top level function like `expect` and then describe how it should look
to matchers like `.toBe()`, `.toEqual()`, `.toMatchObject()`, and so on.

```js
const users = getUsers();

// test for exact value matches with `.toBe()`
expect(users.length).toBe(4);

// test for value equality (but not reference equality) with `.toEqual()`
expect(users[0]).toEqual({
  id: 1,
  name: 'John Doe',
  active: true,
});

// test for interface matching with `.toMatchObject()`
expect(users[1]).toMatchObject({
  active: true,
});
```

## Conclusion

Assertions can help prevent unexpected behavior before it has a chance to occur. Use a common pattern like Node's builtin `assert` or
`expect` (or equivalent) from your unit testing framework to make the intent of your assertions clear to others. Assert away!
