export function classNames (...classes: String[]) {
  return classes.filter(Boolean).join(" ")
}
