export class StorageError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "StorageError";
    this.statusCode = statusCode;
  }
}