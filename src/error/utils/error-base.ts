export class ErrorBase<T extends string> extends Error {
  public name: T
  public message: string
  public cause: unknown

  public constructor({name, message, cause}: { name: T, message: string, cause?: unknown}) {
    super();
    this.name = name
    this.message = message
    this.cause = cause
  }
}