# Web Worker Pattern Documentation

Tools that perform heavy computation can offload work to Web Workers.

## Pattern

1. Create a worker file:

   ```
   src/tools/my-tool/worker.ts
   ```

2. In your tool component:

   ```tsx
   const worker = new Worker(new URL("./worker.ts", import.meta.url), {
     type: "module",
   });
   ```

3. Set `capabilities.supportsWorker: true` in your tool definition.

## Guidelines

- Workers should be created lazily (only when needed)
- Clean up workers in `onUnmount` lifecycle hook
- Use `transferable` objects for large data (ArrayBuffers)
- Handle worker errors gracefully with try/catch
