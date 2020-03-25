---
path: /articles/object-spread
date: 2019-02-12
title: 'Tips & Tricks: Object Spread'
peek: |
  The ECMAScript standard has brought with it many
  useful syntactic shortcuts that make development quick and
  easy, if not a bit cryptic at times. Let's take a look at the
  object spread operator.
tags: [javascript]
imported: true
---

Here's the setup: you have an object and you want to assign a new property on that object to some value. Here's the vanilla JS way to go
about it:

```js
function setBar(obj) {
  obj.bar = 'bar';
  return obj;
}

var obj = { foo: 'foo' };
setBar(obj);
// {
//   foo: 'foo',
//   bar: 'bar',
// }
```

This isn't perfect though, as it's best practice for functions to have no side effects; when you call a function, it should do what it
explicitly states that it does and _nothing else_. In JS, objects are passed by reference, so when you call a function with an object as
a parameter, you're just passing a reference to that object to the function - this means that any modifications you make to the object from
within the function will modify the original object, which can lead to some unintended consequences down the road.

```js
function setBar(obj) {
  obj.bar = 'bar';
  return obj;
}

var obj = { foo: 'foo' };
setBar(obj);
// obj.bar === 'bar'
```

## Avoiding Side Effects

If we want to avoid this, we need to create a _copy_ of the object parameter(s) inside the function body and return that instead of mutating
the argument object directly. The modern JS spec has introduced `Object.assign` to assist with this process:

```js
function setBar(obj) {
  const copy = Object.assign({}, obj);
  copy.bar = 'bar';
  return copy;
}

var obj = { foo: 'foo' };
var newObj = setBar(obj); // newObj.bar === 'bar'
// obj.bar === undefined
```

Object assignment enumerates over all the instance properties of each argument in sequence and applies them to the first argument (if you
aren't assigning to an existing object, just pass an empty object `{}` as the first argument).

```js
const obj = { foo: 'foo' };
const mod = Object.assign({}, obj); // { foo: 'foo' }
console.log(obj === mod); // false (mod is a new instance)

Object.assign({}, { foo: 'foo' }, { bar: 'bar' }, { baz: 'baz' });
// {
//   foo: 'foo',
//   bar: 'bar',
//   baz: 'baz',
// }

// properties later in sequence will overwrite previous argument properties
Object.assign({}, { foo: 'foo' }, { foo: 'bar' });
// {
//   foo: 'bar',
// }
```

## ES Object Spread Operator

ECMAScript introduces the object spread operator `...` to allow for enumerating over an object's properties inline. There are a few
different ways to make use of it, from simple to a bit more complex.

### Shallow Copy

It may be used to create a **shallow copy** of an object a la `Object.assign`:

```js
const obj = { foo: 'foo' };
const mod = { ...obj };
```

A shallow copy will duplicate an object's values by reference, which means that mutating object values on a copy will still
mutate the original object's properties as well:

```js
const obj = { foo: { bar: 'bar' } };
const mod = { ...obj };

console.log(obj.foo.bar); // bar
mod.foo.bar = 'foo';
console.log(obj.foo.bar); // foo
```

If you want to instead create a completely independent copy of an object, you'll need to perform a **deep copy**, which you can either
perform yourself or pull from a package such as [deep-copy](https://www.npmjs.com/package/deep-copy).

### Inline Array Map

We can utilize the object spread operator to write a very minimal array mapping (when returning an object from an arrow function, make sure
to wrap the object in parentheses to assert that it's not a function body like `() => ({})`):

```js
const users = [
  { id: 1, first: 'Jane', last: 'Doe' },
  { id: 2, first: 'John', last: 'Doe' },
  { id: 3, first: 'Foo', last: 'Bar' },
];

console.log(
  users.map(user => ({
    ...user,
    name: `${user.first} ${user.last}`,
  })),
);
// [
//   { id: 1, first: 'Jane', last: 'Doe', name: 'Jane Doe' },
//   { id: 2, first: 'John', last: 'Doe', name: 'John Doe' },
//   { id: 3, first: 'Foo', last: 'Bar', name: 'Foo Bar' },
// ];
```

### Variable Key Assignment

Varible key assignment allows setting an object property value inline. Traditionally this couldn't be accomplished inline and required
using string-indexed array access syntax:

#### Traditional Method

```js
// traditional method
const three = 3;
const calc = {};
calc[parseInt('1')] = 'one';
calc[1 + 1] = 'two';
calc[three] = 'three';
// calc === {
//   1: 'one',
//   2: 'two',
//   3: 'three',
// }
```

#### ES Method

```js
// ES method
const three = 3;
const calc = {
  [parseInt('1')]: 'one',
  [1 + 1]: 'two',
  [three]: 'three',
};
// calc === {
//   1: 'one',
//   2: 'two',
//   3: 'three',
// }
```

By combining object spread and variable key assignment, we can create very powerful mapping functions in just a few lines (you'll
recognize `keyBy` from the previous article about [Reducers](/articles/reducers)):

```js
function keyBy(arr, key) {
  return arr.reduce(
    (map, obj) => ({
      ...map,
      [obj[key]]: obj,
    }),
    {},
  );
}

const users = [
  { id: 1, name: 'Jane Doe' },
  { id: 2, name: 'John Doe' },
];
keyBy(users, 'id');
// {
//   1: { id: 1, name: 'Jane Doe' },
//   2: { id: 2, name: 'John Doe' },
// }
```

### Guarded / Conditional Key Assignment

Occasionally we want to assign one or more properties if a condition is true, or optionally a different one or more properties if the
condition is false. Let's look at the traditional and ES methods of accomplishing this:

#### Traditional Method

```js
const obj = {};

// guarded assignment
if (someCondition) {
  obj.foo = 'foo';
}

// conditional assignment
if (anotherCondition) {
  obj.bar = 'bar';
} else {
  obj.quz = 'quz';
}
```

#### ES Method

```js
// guarded assignment
const obj = {
  ...(someCondition && {
    foo: 'foo',
  }),
};

// conditional assignment
const obj = {
  ...(anotherCondition
    ? {
        bar: 'bar',
      }
    : {
        quz: 'quz',
      }),
};
```

## Conclusion

Object spread assignment is a great tool for expressing routine assignment logic in an idiomatic and concise way. Tomorrow we'll look
at the other use case for `...`, the parameter spread operator.
