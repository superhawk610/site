---
path: /articles/metasyntactic-variables
date: 2019-02-10
title: Metasyntactic Variables
subtitle: foo, bar, baz, and the lot
peek: |
  You use them every day and you've probably never
  given them a second thought. What is a foo? How exactly does
  one bar? How big is a baz? Great question.
tags: [javascript, python]
imported: true
---

Here's a question I bet you've never asked yourself - why do we use `foo` and `bar` when whiteboarding a problem? These terms actually
have a name - **metasyntactic variables**! We use them when we need to express function logic outside of direct context or application. But
why those terms that we see all over the place? Great question, the answer to which, as best I can tell, is a big _shrug_. It's just what
you use. They makes sense if you take a second to think about it - you generally only ever need a few terms to describe a digestable snippet
of code, and it's fine to reuse these when moving from one situtation to the next.

We can just use single characters like `a`, `b`, `c` and so on, but 3 characters tends to be the right amount to be able to clearly discern
a variable at a glance, as well as being closer to the length of variable names used in real applications.

```js
// this is a bit hard to read at a glance
function (a, b, c) {
  const d = getSomething();
  const e = a + b;
  return e;
}

// this is easier to read quickly
function (foo, bar, baz) {
  const qux = getSomething();
  const quuz = foo + bar;
  return quuz;
}
```

## Python

If you come from a Python background, you may be used to the metasyntactic variables [recommended](https://wiki.python.org/moin/PythonStyle)
by the creator:

- `spam`
- `ham`
- `eggs`

If you didn't know, Python _is_ in fact named after the British comedy group formed in the 60s, perhaps best known for their comedies of
the same name (Monty Python et. al).

## More Than Just `foo` and `bar`

What if you're mocking out a more complex problem and you need more than just a few placeholder variable names? Well here's a list you can
pull from (courtesy of @substack on [GitHub](https://github.com/substack/metasyntactic-variables)):

- `foo`
- `bar`
- `baz`
- `qux`
- `quux`
- `corge`
- `grault`
- `garply`
- `waldo`
- `fred`
- `plugh`
- `xyzzy`
- `thud`

## RFC3092

Though many are fine with just shrugging and accepting that these variable names are no more than a product of the swirling pool of those
who came before us, there has been some effort put into codifying them. IETF [RFC3092](https://www.ietf.org/rfc/rfc3092.txt) took note of
the fact that many previous RFCs "contain[ed] the terms `foo`, `bar`, or `foobar` as metasyntactic variables without any proper explanation
or definition" and made an effort to categorize them in an official manner. It's definitely worth a read if you have some downtime.
