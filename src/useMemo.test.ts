import test from "ava"
import { renderHook, act } from "@testing-library/react-hooks"
import { useState } from "react"
import useMemoValue from "./useMemoValue"

test("basics", t => {
	let { result } = renderHook(() => {
		let [rawValue, setRawValue] = useState({ name: "starting value" })
		let memoValue = useMemoValue(rawValue)
		return { rawValue, setRawValue, memoValue }
	})

	// init
	t.is(result.current.rawValue, result.current.memoValue)

	// update to same value
	act(() => result.current.setRawValue({ name: "starting value" }))
	t.not(result.current.rawValue, result.current.memoValue)
	t.is(result.current.memoValue.name, "starting value")

	// update to new value
	act(() => result.current.setRawValue({ name: "changed value" }))
	t.is(result.current.rawValue, result.current.memoValue)
	t.is(result.current.memoValue.name, "changed value")
})

test("comparator", t => {
	let fooComparatorCalled = 0
	let barComparatorCalled = 0

	let fooComparator = (a: any, b: any) => {
		fooComparatorCalled++
		return a.foo === b.foo
	}

	let barComparator = (a: any, b: any) => {
		barComparatorCalled++
		return a.bar === b.bar
	}

	let { result } = renderHook(() => {
		let [rawValue, setRawValue] = useState({ foo: 1, bar: 1 })
		let [comparator, setComparator] = useState(() => fooComparator)
		let memoValue = useMemoValue(rawValue, comparator)
		return { rawValue, setRawValue, setComparator, memoValue }
	})

	// init
	t.is(result.current.memoValue.foo, 1)
	t.is(result.current.memoValue.bar, 1)
	t.is(fooComparatorCalled, 0)
	t.is(barComparatorCalled, 0)

	// change something comparator cares about
	act(() => result.current.setRawValue({ foo: 2, bar: 2 }))
	t.is(result.current.memoValue.foo, 2)
	t.is(result.current.memoValue.bar, 2)
	t.is(fooComparatorCalled, 1)
	t.is(barComparatorCalled, 0)

	// change something comparator doesn't care about
	act(() => result.current.setRawValue({ foo: 2, bar: 3 }))
	t.is(result.current.memoValue.foo, 2)
	t.is(result.current.memoValue.bar, 2)
	t.is(fooComparatorCalled, 2)
	t.is(barComparatorCalled, 0)

	// switch comparators
	act(() => result.current.setComparator(() => barComparator))
	t.is(result.current.memoValue.foo, 2)
	t.is(result.current.memoValue.bar, 3)
	t.is(fooComparatorCalled, 2)
	t.is(barComparatorCalled, 1)

	// change something comparator cares about
	act(() => result.current.setRawValue({ foo: 2, bar: 4 }))
	t.is(result.current.memoValue.foo, 2)
	t.is(result.current.memoValue.bar, 4)
	t.is(fooComparatorCalled, 2)
	t.is(barComparatorCalled, 2)

	// change something comparator doesn't care about
	act(() => result.current.setRawValue({ foo: 3, bar: 4 }))
	t.is(result.current.memoValue.foo, 2)
	t.is(result.current.memoValue.bar, 4)
	t.is(fooComparatorCalled, 2)
	t.is(barComparatorCalled, 3)
})
