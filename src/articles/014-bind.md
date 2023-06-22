---
path: /articles/bind
date: 2019-02-21
title: B is for Bind
subtitle: ABCs of JavaScript
peek: |
  JavaScript always knows exactly what context you
  intended. For those times where it doesn't, try out a bind.
tags: [abcs, javascript]
imported: true
---

Alright, honesty time - I thought I would make it through at least the first half of the alphabet before I ran out of
immediately obvious topics to write about; turns out I only got through A before hitting a snag. What cool, interesting
or complex topic can I write about for B? B...b...break? I want to save that for **L**oops. B...b...booleans? That's _way_
too broad. B...b...bcrypt? That's a package, which I guess counts, but it's not really part of the _JavaScript_ ABCs.

![google-search](../images/014-google-search.png)

When all else fails, you know where to go. Thanks to our dear friend frantic Google searching, we have our topic for today -
**bind**! I am not surprised that it ranks 2<sup>nd</sup> in my search suggestions - binding is one of those topics that can be totally
ignored 99% of the time but will send you running in circles for hours that 1% of the time where it's crucial.

## Binding

So, what is binding? What do you bind? To what? When do you need to bind? Great questions! Let's tackle them one at a time.

### What is binding?

To understand binding, we must first take a step back and look at `this`. Every operation in JavaScript is executed in a **context**
that gives it access to a handful of variables by default. For example, in a browser context (e.g. - running JS code from a `<script>`
tag in a web page), the context includes some global variables like `window`, `document`, `location`, and so on. We refer to this as
the **default context** - it's the context you get out of the box.

```js
console.log(window); // Window {...}
```

How does JS know where to get `window` in the code block above? It checks if `window` exists on `this`! We could rewrite the code above
using `this` explicitly like so:

```js
console.log(this.window); // Window {...}
```

What if we run a function from within another context? When you define a function on an object, that object becomes the function's
context, and thus `this` within that function's scope is no longer the default context:

```js
const context = {
  foo: 'foo',
  print: function() {
    console.log(this.foo);
  },
};

context.print(); // foo
```

### Arrow Function Context

Now is a good time to point out the elephant in the room: **arrow functions**. Arrow functions are generally used as a dropin replacement
for the slightly more verbose `function() { }` syntax, but they work _slightly differently_ under the hood. Arrow functions do not get
a context, so calling `this` within an arrow function will refer to the default global context:

```js
const context = {
  foo: 'foo',
  print: () => {
    console.log(this.foo);
  },
};

context.print(); // undefined
```

### What do you bind?

When you want to assign a context other than the default context, use `.bind()`! If you have a top level function that refers to `this`,
you can change that function's context using `bind`:

```js
function doStuff() {
  console.log(this);
}

doStuff(); // Window {...}

const foo = { foo: 'foo' };

const doStuffWithFoo = doStuff.bind(foo);

doStuffWithFoo(); // { foo: 'foo' }
```

If you don't want to create a new function (like `doStuffWithFoo` above), you can `call` a function and provide the context as
the first argument:

```js
function doStuff() {
  console.log(this);
}

doStuff(); // Window {...}

const foo = { foo: 'foo' };

doStuff.call(foo); // { foo: 'foo' }
```

This works with functions that have arguments as well, each argument just gets shifted over by one:

```js
function doMoreStuff(a, b, c) {
  console.log(this, a, b, c);
}

doStuff(1, 2, 3); // Window {...} 1 2 3

const foo = { foo: 'foo' };

doStuff.call(foo, 4, 5, 6); // { foo: 'foo' } 4 5 6
```

### When should you bind?

Binding is generally one of those concepts that you can ignore until you find yourself in a situation where you need it. A common
case for binding in modern development is class methods:

```js
class MyClass {
  classVariable = 'foo';

  print() {
    console.log(this.classVariable);
  }
}

const c = new MyClass();
c.print(); // foo

const f = c.print;
f(); // undefined
```

We want to print out the class's instance variable `classVariable`, but got `undefined`! By default, class methods are not
bound to the parent class context. When writing classes, we generally perform this binding in the **constructor** where we _do_
have direct access to the class context:

```js
class MyClass {
  classVariable = 'foo';

  constructor() {
    this.print = this.print.bind(this);
  }

  print() {
    console.log(this.classVariable);
  }
}

const c = new MyClass();
c.print(); // foo

const f = c.print;
f(); // foo
```

The [Class Properties Proposal](https://github.com/tc39/proposal-class-fields) provides an idiomatic way to automatically bind
class methods to their parent class context:

```js
class MyClass {
  classVariable = 'foo';

  print = () => {
    console.log(this.classVariable);
  };
}

const c = new MyClass();
const f = c.print;
f(); // foo
```

Don't let the arrow function fool you - though arrow functions in the wild _do not_ have a context, in this proposal they
will be automatically assigned to the parent class context.

## Conclusion

Unlike most articles I've written in the past, I _don't_ encourage you to go out and find everywhere you can to stuff `.bind()`
into your app code. You're likely not using it now and will likely be better off keeping it that way. Add it to your hidden
debugging arsenal, and if you ever see any unexpected `undefined` values, consider your code's context as a possible source
of errors.
