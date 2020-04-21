import { useRef, useEffect } from "react"
import shallowEqual from "shallowequal"

const FIRST_RUN = {} // an opaque value

/**
 * A function to compare two values to determine if they can be considered equal.
 */
export type Comparator<T> = (a: T, b: T) => boolean

/**
 * Reuse the previous version of a value unless it has changed.
 * @param value The current value.
 * @param comparator An function to compare the current value to its previous value, defaults to "shallowEqual"
 */
export default function useMemoValue<T>(
	value: T,
	comparator: Comparator<T> = shallowEqual,
): T {
	let ref = useRef(FIRST_RUN as T)
	let nextValue = ref.current

	useEffect(() => {
		ref.current = nextValue
	})

	if (ref.current === FIRST_RUN || !comparator(value, ref.current)) {
		nextValue = value
	}

	return nextValue
}
