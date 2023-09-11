/**
 * A middleware error. This error is thrown when a middleware processor throws an
 * error. The error will contain the context that was being processed.
 * @param T The type of the context.
 */
export class MiddlewareError<T = unknown> extends AggregateError {
  /** The context that was being processed. */
  readonly ctx?: T;

  constructor(
    errors: readonly Error[],
    message?: string,
    ctx?: T,
  ) {
    super(errors, message);
    this.ctx = ctx;
  }
}

/**
 * A pipeline error. This error is thrown when a pipeline executor throws an
 * error. The error will contain the context that was being processed.
 * @param T The type of the context.
 */
export class PipelineError<T = unknown> extends AggregateError {
  /** The context that was being processed. */
  readonly ctx?: T;

  constructor(
    errors: readonly Error[],
    message?: string,
    ctx?: T,
  ) {
    super(errors, message);
    this.ctx = ctx;
  }
}
