Andor
===

A library for asserting conditions.

```js
import { and, is, it }, checkThat from 'andor';

var isTrue = checkThat(person)
        .is(merried)
        .and(haveChildren)
        .or(isDeveloper)
        .isTrue();
```

or

```js
var isTrue = or(isDeveloper(person), and(haveChildren, merried));

```



WIP