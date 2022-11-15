export function errMsg (error: unknown) {
  return error instanceof Error ? error.message : error as string
}
