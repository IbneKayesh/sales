export class WriteQueue {
  constructor() {
    this.queue = Promise.resolve();
  }

  run(operation) {
    const result = this.queue.then(operation);

    // Keep the queue alive if an operation fails.
    this.queue = result.catch(() => {});

    return result;
  }
}