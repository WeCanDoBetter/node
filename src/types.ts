/** May or may not be a promise. */
export type MaybePromise<T> = T | Promise<T>;

/**
 * A processor is a function that takes a context and returns a promise that
 * resolves when the processor is done. The processor can throw an error to
 * indicate that it failed to process the context.
 * @param T The type of the context.
 * @param ctx The context to process.
 */
export type Processor<T> = (
  ctx: T,
) => Promise<void>;

/**
 * An executor is a function that takes a context and an optional abort signal
 * and returns a promise that resolves when the executor is done. The executor
 * can throw an error to indicate that it failed to execute the context. If the
 * executor is aborted, it should stop executing the context.
 * @param T The type of the context.
 * @param ctx The context to execute.
 * @param signal The abort signal.
 * @throws An {@link AggregateError} if the executor failed to execute the
 * context.
 */
export type Executor<T> = (
  ctx: T,
  signal?: AbortSignal,
) => Promise<void>;

/**
 * The next function for middleware.
 * Calling this function will execute the next processor.
 */
export type Next = () => Promise<void>;

/**
 * A middleware processor is a function that takes a context and a next
 * function and returns a promise that resolves when the processor is done. The
 * processor can throw an error to indicate that it failed to process the
 * context.
 * @param T The type of the context.
 * @param ctx The context to process.
 * @param next The next function.
 */
export type MiddlewareProcessor<T> = (
  ctx: T,
  next: Next,
) => Promise<void>;

/**
 * A middleware executor is a function that takes a context and an optional
 * abort signal and returns a promise that resolves when the executor is done.
 * The executor can throw an error to indicate that it failed to execute the
 * context. If the executor is aborted, it should stop executing the context.
 * @param T The type of the context.
 * @param ctx The context to execute.
 * @param signal The abort signal (optional).
 * @throws An {@link AggregateError} if the executor failed to execute the
 * context.
 */
export type MiddlewareExecutor<T> = (
  ctx: T,
  signal?: AbortSignal,
) => Promise<void>;
