---
path: /articles/const
date: 2019-03-03
title: C is for Const
subtitle: ABCs of JavaScript
peek: |
  JavaScript always knows exactly what variable context you
  intended. For those times where it doesn't, try out a const.
tags: [abcs, javascript]
imported: true
---

JavaScript is well known for being a beginner-friendly language - it abstracts many more complex concepts away from the developer, allowing new programmers to quickly
pick up the basics and learn the intricacies later on at their own pace.

## Variable Scope

JS has a single keyword for declaring a variable identifier - `var`. Variables are accessible from anywhere within the scope in which they were declared - for top-level
declarations, they are available in the global scope (everywhere, essentially).

```js
var foo = 'foo';

// global scope access ✅
console.log(foo); // foo

function myFunction() {
  // function scope access ✅
  console.log(foo); // foo

  function myNestedFunction() {
    // nested function scope access ✅
    console.log(foo); // foo

    // and so on...
  }
}
```

Variables declared with `var` from within a function are **function-scoped**, meaning they're available _anywhere_ within that function:

```js
function myFunction() {
  var foo = 'foo';

  // function scope access ✅
  console.log(foo); // foo

  function myNestedFunction() {
    // nested function scope access ✅
    console.log(foo); // foo
  }

  // and so on...
}

// global scope access ❌
console.log(foo); // undefined
```

However, this can lead to some unintended effects when working with **blocks** (anything wrapped in curly braces, eg - `if` statements,
`for` loops, etc):

```js
function myFunction() {
  for (var i = 0; i < 100; i++) {
    // do something
  }

  console.log(i);
}

myFunction(); // 99
```

To keep our code clear of accidental side effects, we really only want variables to stick around within the **block** they're declared in,
not the **function**.

## ES Block-Scoped Variables

ECMAScript is a community-driven standard to bring additional features to the base JS spec. ES introduced two new variable types - `let` and `const`.
These work very similarly to `var`, with the key difference being that they're **block-scoped**! Let's rewrite our previous example using `let` instead
of `var` to see what that means:

```js
function myFunction() {
  for (let i = 0; i < 100; i++) {
    // do something
  }

  console.log(i);
}

myFunction(); // ReferenceError: i is not defined
```

The loop iterator `i` is only relevant to the `for` block in which it's declared, so we shouldn't be using it outside of that block scope. Using
a `let` declaration insures that an Error is thrown if we try to do so.

## Immutable References

All `var` declarations are rewritable, or **mutable**. This means we can do this:

```js
var a = 0;
a = 1;
a = 2;
a = 3;
```

This also works with `let` (it's a mutable identifier):

```js
let b = 0;
b = 1;
b = 2;
b = 3;
```

For mutable values, this is fine, but often we want to insure that a value is not reassigned once it has been declared - enter `const`! Use `const`
to declare a variable that you do not want to be reassigned:

```js
const c = 0;
c = 1; // TypeError: Assignment to a constant variable.
```

A helpful pattern to use when writing JS is to think `const`-first: declare all variables as `const` by default, only using `let` when you know you'll
be reassigning that variable. This will help you avoid common pitfalls and unintended side-effects that stem from application-wide mutability.

## Referencing a Variable Before Declaration

JavaScript `var` declarations are **hoisted**, meaning they're raised to the top of their declaration scope and given a value of `undefined` before that
scope is executed. This allows you to do this:

```js
function myFunction() {
  console.log(foo); // undefined

  var foo = 'foo';
}
```

This is **always** an [anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern#Programming) and should be avoided. This behavior is changed to instead
throw an Error with `let` and `const`:

```js
function myFunction() {
  console.log(foo); // ReferenceError: foo is not defined
  let foo = 'foo';
}

function myOtherFunction() {
  console.log(bar);
  const bar = 'bar'; // ReferenceError: bar is not defined
}
```

## Reference Immutability vs Value Immutability

There's an important distinction to be made when using `const` for immutability:

```js
const obj = { foo: 'foo' };
obj.foo = 'bar'; // ✅ OK
obj = { foo: 'bar' }; // ❌ TypeError: Assignment to a constant variable
```

Variables declared with `const` have **reference immutability** but not **value immutability** - this means they may not be reassigned but may still be mutated.
Their **reference** never changes, which means the underlying memory address that stores their contents remains constant, but the contents of that memory may
still be changed:

```js
const a = { foo: 'foo' };
const b = a;
console.log(a === b); // true
const c = { foo: 'foo' };
console.log(a === c); // false
```

### Value Immutability

If you want to prevent an object from being mutated, you have a few options:

- `Object.freeze` will prevent an entire object from being mutated:

```js
const obj = Object.freeze({ foo: 'foo' });
obj.foo = 'bar';
console.log(obj.foo); // foo
obj.bar = 'bar';
console.log(obj.bar); // undefined
```

- `Object.seal` will prevent adding/removing properties to an object, but will still allow for mutation of existing properties:

```js
const obj = Object.seal({ foo: 'foo' });
obj.foo = 'bar';
console.log(obj.foo); // bar
obj.bar = 'bar';
console.log(obj.bar); // undefined
```

- `Object.defineProperty` may be used to prevent mutation of a single property on an object using the `writable` property:

```js
const obj = {};
Object.defineProperty(obj, 'foo', {
  value: 'foo',
  writable: false,
});
console.log(obj.foo); // foo
obj.foo = 'bar';
console.log(obj.foo); // foo
obj.bar = 'bar';
console.log(obj.bar); // bar
```

It's important to remember that these methods won't throw on an attempted mutation, they'll just prevent it from having any effect.

## Conclusion

When writing JS, think `const`-first: declare all variables as `const` by default, only using `let` when you know you'll
be reassigning that variable. Never use `var` - function-scoped declarations will only cause you headache down the road. ES5 is
implemented in all modern browsers, so you don't even need to use a transpiler to start using `const` today!
