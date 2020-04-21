# `useMemoValue()`

> Reuse the previous version of a value unless it has changed

## Install

```sh
npm install --save-dev use-memo-value
```

## Usage

If you don't know all the members of an object, you may want to use a "shallow
compare" to memoize the value so you can rely on React's referential equality
(such as in `useEffect(..., deps)`).

```js
import useMemoValue from "use-memo-value"

function MyComponent(props) {
  let rawParams = getCurrentUrlQueryParams() // we don't know the shape of this object
  let memoizedParams = useMemoValue(rawParams)

  useEffect(() => {
    search(memoizedParams)
  }, [memoizedParams])

  // ...
}
```

> **Note:** If you know the shape of your object, you are likely better off not
> using this library.

If you need to customize how the values are compared, you can pass a comparator
as a second argument:

```js
let memoizedValue = useMemoValue(rawValue, (nextValue, previousValue) => {
  return Object.is(a, b) // or whatever
})
```

The comparator will not be called until there's a new value.
