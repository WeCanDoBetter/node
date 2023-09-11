/// <reference types="jest" />

import { Node } from "../src/Node.js";

describe("Node API", () => {
  it("should create a Node with provided options", () => {
    const node = new Node<{ n: number }>({
      id: "A",
      shouldActivate: (node, ctx) => ctx.n > 0,
    });

    expect(node).toBeDefined();
    expect(node.id).toBe("A");
  });

  it("should add middleware to a Node", async () => {
    const node = new Node<{ n: number }>({ id: "A" });
    const context = { n: 5 };

    node.use(async (ctx, next) => {
      ctx.n += 10;
      await next();
    });

    await node.touch(context);

    expect(context.n).toBe(15);
  });

  it("should link Nodes with or without activation function", () => {
    const nodeA = new Node<{ n: number }>({ id: "A" });
    const nodeB = new Node<{ n: number }>({ id: "B" });

    // Link nodeA to nodeB without activation function
    nodeA.link(nodeB);

    // Link nodeA to nodeB with activation function
    nodeA.link(nodeB, (_node, ctx) => ctx.n > 0);

    // Activate nodeA
    const contextA = { n: 5 };
    nodeA.touch(contextA);

    // Activate nodeB
    const contextB = { n: 0 };
    nodeA.touch(contextB);

    // nodeB should only be activated for the first context
    expect(contextA.n).toBe(5);
    expect(contextB.n).toBe(0);
  });

  it("should sink output when Node is activated", async () => {
    const node = new Node<{ n: number }>({ id: "A" });
    const context = { n: 5 };

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    node.sink((ctx) => console.log(`Sink output: ${ctx.n}`));
    await node.touch(context);

    expect(consoleSpy).toHaveBeenCalledWith("Sink output: 5");
    consoleSpy.mockRestore();
  });

  it("should explore linked Nodes and generate a graph representation", () => {
    const nodeA = new Node<{ n: number }>({ id: "A" });
    const nodeB = new Node<{ n: number }>({ id: "B" });
    const nodeC = new Node<{ n: number }>({ id: "C" });

    nodeA.link(nodeB);
    nodeB.link(nodeC);

    const graph = nodeA.explore();

    expect(graph).toEqual({
      A: {
        B: {
          C: {},
        },
      },
    });
  });
});
