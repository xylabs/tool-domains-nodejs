export class ValidationError extends Error {
  public action: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public source: any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(action: string, source: any) {
    super()
    this.action = action
    this.source = source
    if (source.stack) {
      this.stack = source.stack
    }
  }
}
