# API

## Create a Node

```ts
import Node from "@wecandobetter/node";

const node = new Node<number>({
  id: "A",
  shouldActivate: (node, ctx) => ctx > 0,
});
```

## Add Middleware

```ts
import Node from "@wecandobetter/node";

const node = new Node<number>({ id: "A" });

node.use(async (ctx, next) => {
  ctx += 10;
  await next(ctx);
});
```

## Link Nodes

```ts
import Node from "@wecandobetter/node";

const nodeA = new Node<number>({ id: "A" });
const nodeB = new Node<number>({ id: "B" });

nodeA.link(nodeB);
```

## Touch a Node

```ts
import Node from "@wecandobetter/node";

const node = new Node<number>({ id: "A" });

const context = 5;
await node.touch(context);
```

## Sink Output

```ts
import Node from "@wecandobetter/node";

const node = new Node<number>({ id: "A" });

node.sink((ctx) => console.log(`Sink output: ${ctx}`));
```

## Explore Nodes

```ts
import Node from "@wecandobetter/node";

const nodeA = new Node<number>({ id: "A" });
const nodeB = new Node<number>({ id: "B" });
const nodeC = new Node<number>({ id: "C" });

nodeA.link(nodeB);
nodeB.link(nodeC);

console.log(nodeA.explore());

// Output:
//
// "A": {
//   "B": {
//     "C": {}
//   }
// }
```
