export default function when<T>(predicate: boolean | (() => boolean), truthy: T, falsy: T) {
  const conditionType = typeof predicate;
  if (conditionType === "boolean" && predicate) return truthy;
  if (conditionType === "function" && (predicate as () => boolean)() === true) return truthy;
  return falsy;
}
