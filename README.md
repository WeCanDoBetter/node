# @wecandobetter/node

![npm](https://img.shields.io/npm/v/@wecandobetter/node)
![GitHub](https://img.shields.io/github/license/wecandobetter/node)

A versatile Node-based system with activation functions, middleware processing,
and sinks. Empower your applications with flexible node interactions and context
management!

## Features 🎢

- 🔌 Define and link nodes to create complex workflows and data flows.
- ♻ Implement activation functions to control when nodes are triggered.
- 🔧 Utilize middleware processing for fine-tuned data transformation.
- 📤 Output context to external systems with ease using sinks.
- 🔮 Debug and visualize node relationships with the explore method.
- 📥 Asynchronous processing for outputs and sinks to optimize performance.

## Installation 📦

Install the package via npm:

```bash
npm install @wecandobetter/node
```

## Usage 📘

```typescript
import { Node } from "@wecandobetter/node";

// Create nodes and define their behavior
const nodeA = new Node<number>({ id: "A", activate: (ctx) => ctx > 0 });
const nodeB = new Node<number>({ id: "B" });

// Link nodes together
nodeA.link(nodeB);

// Add middleware to process context
nodeA.use(async (ctx, next) => {
  ctx += 10;
  await next(ctx);
});

// Define sinks for output
nodeB.sink((ctx) => console.log(`Sink output: ${ctx}`));

// Touch the nodes with context
const context = 5;
await nodeA.touch(context);

// Output: Sink output: 15
```

## API Documentation 📜

- [Node<T>](#Node)
- [shouldActivate<T>](#shouldActivate)

For detailed API documentation, please refer to the [API Documentation](API.md).

## License 📜

This project is licensed under the [MIT License](LICENSE).

## Contributing 🙋‍♂️

Contributions are welcome! Feel free to open issues and submit pull requests.

## Credits 👏

Made with ❤️‍🔥 by [We Can Do Better](https://wcdb.life).
