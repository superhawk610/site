---
path: /articles/search-context
date: 2019-02-02
title: Creating a search context
subtitle: Searching for user input in a dataset
peek: |
  A common task in front-end development is taking
  a string of user input and filtering a dataset for rows
  that contain that input. Let's explore that.
tags: [javascript]
imported: true
---

There are a handful of tasks common to nearly all front-end development projects - today we're going
to look at filtering a dataset by user input. First off, let's take a look at our dataset:

```js
const data = [
  { name: 'John Doe', job: 'Developer', office: '3A' },
  { name: 'Jane Doe', job: 'Designer', office: '5B' },
  { name: 'Foo Bar', job: 'Engineer', office: '7C' },
];
```

In our project, this dataset is displayed in a table with an input that allows users to
search for the value of any field present on a row, something like

| Name     | Job       | Office |
| -------- | --------- | ------ |
| John Doe | Developer | 3A     |
| Jane Doe | Designer  | 5B     |
| Foo Bar  | Engineer  | 7C     |

If the user searches for `'Doe'`, then the table should filter accordingly:

| Name     | Job       | Office |
| -------- | --------- | ------ |
| John Doe | Developer | 3A     |
| Jane Doe | Designer  | 5B     |

## Implementation

There are a few ways you could go about implementing this, but let's look at a simple one. We will
use `Array.prototype.filter` to return only the rows in which the user input matches some part of at
least one field value. Here's our first attempt\*:

```js
function getRowsMatchingUserInput(input) {
  return data.filter(row => {
    const searchContext = `${row.name}${row.job}${row.office}`;
    return searchContext.indexOf(input) !== -1;
  });
}
```

Let's walk through that for a single row:

```js
const searchContext = `${row.name}${row.job}${row.office}`;
// searchContext === 'JohnDoeDeveloper3A'

return searchContext.indexOf(input) !== -1;
// searchContext.indexOf('Doe') === 4
// return true
```

It works! What about uppercase vs. lowercase inputs? Let's make sure it matches regardless, since
users generally prefer lowercase:

```js
function getRowsMatchingUserInput(input) {
  return data.filter(row => {
    const searchContext = `${row.name}${row.job}${row.office}`.toLowerCase();
    return searchContext.indexOf(input.toLowerCase()) !== -1;
  });
}
```

Now that should work and be case-insensitive:

```js
const searchContext = `${row.name}${row.job}${row.office}`.toLowerCase();
// searchContext === 'johndoedeveloper3a'

return searchContext.indexOf(input.toLowerCase()) !== -1;
// searchContext.indexOf('doe') === 4
// return true
```

Now we wouldn't be real developers if we didn't consider edge cases. Wikipedia defines
[edge cases](https://en.wikipedia.org/wiki/Edge_case) as a situation that "involves input
values that require special handling." Let's take the input `'bare'` as an example. This shouldn't
return anything since no user has a property that contains it, right?

| Name    | Job      | Office |
| ------- | -------- | ------ |
| Foo Bar | Engineer | 7C     |

Wait, what? The table should be empty, but it isn't. Why is that? Let's step through our filter for
this row:

```js
const searchContext = `${row.name}${row.job}${row.office}`.toLowerCase();
// searchContext === 'foobarengineer7c'

return searchContext.indexOf(input.toLowerCase()) !== -1;
// searchContext.indexOf('bare') === 3
// return true
```

Oh! The input `'bare'` is matching the end of `'Foo Bar'` and the beginning of `'Engineer'`! That's no
good. How can we solve this? We need to add a delimiter between fields when constructing our search
context, some character that the user can't type on their keyboard that will prevent this behavior.
It just so happens that JavaScript has the perfect candidate - the null character! JS represents this
with an escape character since we can't type it from a keyboard: `'\0'`. Let's rework our
filter function:

```js
function getRowsMatchingUserInput(input) {
  return data.filter(row => {
    const searchContext = `${row.name}\0${row.job}\0${row.office}`.toLowerCase();
    return searchContext.indexOf(input.toLowerCase()) !== -1;
  });
}
```

And it works!

| Name                          | Job | Office |
| ----------------------------- | --- | ------ |
| no rows found matching `bare` |

Let's clean up our implementation using a helper function\*:

```js
function createSearchContext(...fields) {
  return fields.join('\0').toLowerCase();
}

function getRowsMatchingUserInput(input) {
  return data.filter(row => {
    const searchContext = createSearchContext(row.name, row.job, row.office);
    return searchContext.indexOf(input.toLowerCase()) !== -1;
  });
}
```

And there you have it, a clean user input search implementation in just 10 lines. Be sure to check
back tomorrow, where we'll `reduce` our way to victory!

&nbsp;

&nbsp;

**\*NOTE:** If you're confused by template literals like <code>&#96;\${value}&#96;</code> or the parameter spread operator (eg - `function unknownParameterCount(...params) {}`), check out this
[cool ES6 reference](https://melanieseltzer.github.io/es6-all-the-things/) by
[@melanieseltzer](https://github.com/melanieseltzer).
