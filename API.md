# API

## Create a Node

```ts
import Node from "@wecandobetter/node";

const node = new Node<{ n: number }>({
  id: "A", // If not provided, a random UUID will be generated
  shouldActivate: (node, ctx) => ctx.n > 0, // Optional activation function
});
```

## Add Middleware

```ts
import Node from "@wecandobetter/node";

const node = new Node<{ n: number }>({ id: "A" });

// Add as many middleware as you want
// Middleware is executed in the order it is added
node.use(async (ctx, next) => {
  ctx.n += 10;
  await next();
});
```

## Link Nodes

```ts
import Node from "@wecandobetter/node";

const nodeA = new Node<{ n: number }>({ id: "A" });
const nodeB = new Node<{ n: number }>({ id: "B" });

// Link node A to node B
// When node A is activated and has completed processing, node B will be touched
nodeA.link(nodeB);

// Optionally provide an activation function
// The linked node will only be touched if the activation function returns true
nodeA.link(nodeB, (node, ctx) => ctx.n > 0);
```

## Sink Output

```ts
import Node from "@wecandobetter/node";

const node = new Node<{ n: number }>({ id: "A" });

// Sinks are executed when the node is activated and has completed processing
node.sink((ctx) => console.log(`Sink output: ${ctx.n}`));
```

## Touch a Node

```ts
import Node from "@wecandobetter/node";

const node = new Node<{ n: number }>({ id: "A" });

// The context is passed to the activation function and middleware
const context = { n: 5 };

// Touch the node with the context
await node.touch(context);
```

## Explore Nodes

```ts
import Node from "@wecandobetter/node";

const nodeA = new Node<{ n: number }>({ id: "A" });
const nodeB = new Node<{ n: number }>({ id: "B" });
const nodeC = new Node<{ n: number }>({ id: "C" });

nodeA.link(nodeB);
nodeB.link(nodeC);

// Generate a graph representation of the node and its linked nodes
console.log(nodeA.explore());

// Output:
//
// "A": {
//   "B": {
//     "C": {}
//   }
// }
```
