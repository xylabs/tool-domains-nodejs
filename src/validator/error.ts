export class ValidationError extends Error {
  public action: string
  public source: any
  constructor(action: string, source: any) {
    super()
    this.action = action
    this.source = source
    if (source.stack) {
      this.stack = source.stack
    }
  }
}
