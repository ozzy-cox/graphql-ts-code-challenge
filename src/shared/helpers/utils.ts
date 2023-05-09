import { Truthy } from 'lodash'

export const filterOutErrors = <T>(items: (T | Error)[]) => items.filter((item): item is T => !(item instanceof Error))

export const filterTruthy = <T>(items: T[]) => items.filter((item: T): item is Truthy<T> => Boolean(item))
