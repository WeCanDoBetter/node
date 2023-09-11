import type { Node } from "./Node.js";

/** May or may not be a promise. */
export type MaybePromise<T> = T | Promise<T>;

/**
 * The next function for middleware.
 * Calling this function will execute the next processor.
 */
export type Next = () => Promise<void>;

/**
 * A processor is a function that takes a context and a next
 * function and returns a promise that resolves when the processor is done. The
 * processor can throw an error to indicate that it failed to process the
 * context.
 * @param T The type of the context.
 * @param ctx The context to process.
 * @param next The next function.
 */
export type Processor<T> = (
  ctx: T,
  next: Next,
) => Promise<void>;

/**
 * A executor is a function that takes a context and an optional
 * abort signal and returns a promise that resolves when the executor is done.
 * The executor can throw an error to indicate that it failed to execute the
 * context. If the executor is aborted, it should stop executing the context.
 * @param T The type of the context.
 * @param ctx The context to execute.
 * @param signal The abort signal (optional).
 * @throws An {@link AggregateError} if the executor failed to execute the
 * context.
 */
export type Executor<T> = (
  ctx: T,
  signal?: AbortSignal,
) => Promise<void>;

/**
 * The activation function. The node will only be activated if the function
 * returns true.
 * @param T The type of the context.
 * @param node The node to activate.
 * @param ctx The context to activate.
 * @returns Whether the node should be activated.
 */
export type ActivateFn<T> = (node: Node<T>, ctx: T) => boolean;

/**
 * The activation function. The node will only be activated if the function
 * returns true. If the value is true, the node will always be activated.
 * @param T The type of the context.
 */
export type ShouldActivate<T> = ActivateFn<T> | true;

/**
 * A sink is a function which can be used to output the context to an external
 * system. Sinks are called after the node has been activated and all
 * middleware has been executed.
 * @param T The type of the context.
 */
export type Sink<T> = (ctx: T) => MaybePromise<void>;
