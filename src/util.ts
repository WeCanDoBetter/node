import { MiddlewareError, PipelineError } from "./errors";
import type { MiddlewareExecutor, MiddlewareProcessor, Next } from "./types";

/**
 * Creates an executor that executes the given processors as middleware. The
 * processors are executed in the order they are given. If any processor throws
 * an error, the executor will throw an {@link PipelineError} with the
 * error(s) as its cause(s). If the executor is aborted, the next processors
 * will not be executed.
 * @param T The type of the context.
 * @param processors The processors to execute as middleware.
 * @returns A processor that executes the given processors as middleware.
 */
export function pipeMiddleware<T>(
  ...processors: MiddlewareProcessor<T>[]
): MiddlewareExecutor<T> {
  return (ctx, signal) => {
    const stack = [...processors];

    const next: Next = async () => {
      if (signal?.aborted) {
        return;
      }

      const processor = stack.shift();

      if (!processor) {
        return;
      }

      try {
        await processor(ctx, next);
      } catch (error: any) {
        throw new PipelineError(
          [
            new MiddlewareError([error], "Failed to execute processor", ctx),
          ],
          "Failed to execute pipeline",
          ctx,
        );
      }
    };

    return next();
  };
}
