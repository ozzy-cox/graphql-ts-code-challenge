export const filterOutErrors = <T>(items: (T | Error)[]) => items.filter((item): item is T => !(item instanceof Error))
