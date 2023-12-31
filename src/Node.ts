import type { Processor, ShouldActivate, Sink } from "./types.js";
import { pipe } from "./util.js";

export interface NodeInit<T> {
  /** The ID of the node. */
  readonly id?: string;
  /**
   * The activation function. The node will only be activated if the function
   * returns true. If the value is true, the node will always be activated.
   */
  readonly shouldActivate?: ShouldActivate<T>;
}

/**
 * A node is a unit of execution. A node can be linked to other nodes. When a
 * node is activated, it will execute its middleware stack. If the node is
 * activated, it will also activate its outputs. If the node is not activated,
 * it will not execute its middleware stack or activate its outputs.
 * @param T The type of the context.
 */
export class Node<T> {
  /**
   * Checks whether the node should be activated. If the activation function is a
   * function, it will be called with the context and the node.
   * @param T The type of the context.
   * @param shouldActivate The activation function.
   * @param node The node to activate.
   * @param ctx The context to activate.
   * @returns Whether the node should be activated.
   */
  static shouldActivate<T>(
    shouldActivate: ShouldActivate<T> | undefined,
    node: Node<T>,
    ctx: T,
  ): boolean {
    return (shouldActivate === undefined || shouldActivate === true) ||
      shouldActivate(node, ctx);
  }

  /** The ID of the node. */
  readonly id: string;

  /** The metadata of the node. */
  readonly metadata: Record<string, unknown> = {};

  /** The activation function. */
  shouldActivate: ShouldActivate<T>;

  /** The middleware stack. */
  readonly #stack: Processor<T>[] = [];
  /** The outputs of the node. */
  readonly #outputs = new Map<Node<T>, ShouldActivate<T>>();
  /** The sinks of the node. */
  readonly #sinks = new Set<Sink<T>>();

  constructor({ id, shouldActivate }: NodeInit<T>) {
    this.id = id ?? crypto.randomUUID();
    this.shouldActivate = shouldActivate ?? true;
  }

  /**
   * The middleware stack.
   */
  get stack(): ReadonlyArray<Processor<T>> {
    return this.#stack;
  }

  /**
   * The outputs of the node.
   */
  get outputs(): ReadonlyMap<Node<T>, ShouldActivate<T>> {
    return this.#outputs;
  }

  /**
   * The sinks of the node.
   */
  get sinks(): ReadonlySet<Sink<T>> {
    return this.#sinks;
  }

  /**
   * Adds one or more processors to the middleware stack. The processors will be
   * executed in the order they are added.
   * @param processors The processors to add.
   */
  use(...processors: Processor<T>[]): Node<T> {
    this.#stack.push(...processors);
    return this;
  }

  /**
   * Links the given node to this node. When the node is activated, the given node
   * will be touched with the same context. If the given node is already linked
   * to this node, the activation function will be updated.
   * @param node The node to link.
   * @param shouldActivate The activation function. If set, the node will only be
   * touched if the function returns true.
   */
  link(node: Node<T>, shouldActivate?: ShouldActivate<T>): Node<T> {
    this.#outputs.set(node, shouldActivate ?? true);
    return this;
  }

  /**
   * Unlinks the given node from this node. If the given node is not linked to
   * this node, this method does nothing.
   * @param node The node to unlink.
   */
  unlink(node: Node<T>): Node<T> {
    this.#outputs.delete(node);
    return this;
  }

  /**
   * Unlinks all nodes from this node.
   */
  unlinkAll(): Node<T> {
    this.#outputs.clear();
    return this;
  }

  /**
   * Adds a sink to the node. When this node is activated, the sink will be
   * called with the context. If the sink is already added to this node, this
   * method does nothing.
   * @param sink The sink to add.
   */
  sink(sink: Sink<T>): Node<T> {
    this.#sinks.add(sink);
    return this;
  }

  /**
   * Removes a sink from the node. If the sink is not added to this node, this
   * method does nothing.
   * @param sink The sink to remove.
   */
  unsink(sink: Sink<T>): Node<T> {
    this.#sinks.delete(sink);
    return this;
  }

  /**
   * Clears the middleware stack.
   */
  clearStack(): Node<T> {
    this.#stack.length = 0;
    return this;
  }

  /**
   * Clears the sinks.
   */
  clearSinks(): Node<T> {
    this.#sinks.clear();
    return this;
  }

  /**
   * Touches the node. If the node is activated, the middleware stack will be
   * executed. If the node is not activated, this method does nothing.
   * @param ctx The context to touch.
   * @param shouldActivate The activation function. This will override the
   * activation function of the node.
   * @throws An {@link MiddlewareError} if the middleware failed to execute.
   */
  async touch(ctx: T, shouldActivate?: ShouldActivate<T>): Promise<void> {
    const activateFn = shouldActivate ?? this.shouldActivate;

    if (!Node.shouldActivate(activateFn, this, ctx)) {
      return;
    }

    // NOTE: Errors are handled by the pipeline.
    await pipe(...this.#stack)(ctx);

    if (this.#outputs.size) {
      // Touch all outputs in parallel. We don't need to wait for them to
      // finish. We also don't care if they fail. We just want to make sure
      // they are touched, and don't hold up the control flow.
      Promise.allSettled(
        [...this.#outputs.entries()].map(([node, shouldActivate]) =>
          Node.shouldActivate(shouldActivate, node, ctx)
            ? node.touch(ctx)
            : null
        ),
      );
    }

    if (this.#sinks.size) {
      // Sink all sinks in parallel. We don't need to wait for them to finish.
      // We also don't care if they fail. We just want to make sure they are
      // sunk, and don't hold up the control flow.
      Promise.allSettled(
        [...this.#sinks.values()].map((sink) => sink(ctx)),
      );
    }
  }

  /**
   * Explore the node and its outputs. This method is used for debugging.
   * @param wrap Whether to wrap the tree in an object with this node's ID as
   * the key. Defaults to true.
   * @returns A tree of the node and its outputs.
   */
  explore(wrap = true): Record<string, Record<string, unknown>> {
    const tree: Record<string, Record<string, unknown>> = {};

    for (const node of this.#outputs.keys()) {
      tree[node.id] = node.explore(false);
    }

    return wrap ? { [this.id]: tree } : tree;
  }
}
