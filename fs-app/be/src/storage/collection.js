import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { matches, sortDocuments } from "./query.js";
import { StorageError } from "./errors.js";

const COLLECTION_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/;
const ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

function validateCollection(name) {
  if (!COLLECTION_PATTERN.test(name)) {
    throw new StorageError("Invalid collection name", 400);
  }
}

function validateId(id) {
  if (typeof id !== "string" || !ID_PATTERN.test(id)) {
    throw new StorageError("Invalid document ID", 400);
  }
}

function validateDocument(data) {
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    throw new StorageError("Document must be an object", 400);
  }

  if (
    Object.hasOwn(data, "__proto__") ||
    Object.hasOwn(data, "constructor") ||
    Object.hasOwn(data, "prototype")
  ) {
    throw new StorageError("Invalid document properties", 400);
  }

  return structuredClone(data);
}

// Before running the application, make sure the collection directory is created before any operation.

// In collection.js, add this helper:



// function async ensureDirectory() {
//   await fs.mkdir(this.directory, { recursive: true });
// }

export class Collection {
  constructor(engine, name) {
    validateCollection(name);

    this.engine = engine;
    this.name = name;

    this.directory = path.join(
      engine.collectionsPath,
      name
    );
  }

  async initialize() {
    await fs.mkdir(this.directory, { recursive: true });
  }

  documentPath(id) {
    validateId(id);

    return path.join(this.directory, `${id}.json`);
  }

  async readFile(id) {
    try {
      const content = await fs.readFile(
        this.documentPath(id),
        "utf8"
      );

      return JSON.parse(content);
    } catch (error) {
      if (error.code === "ENOENT") {
        return null;
      }

      throw error;
    }
  }

  async ensureDirectory() {
    await fs.mkdir(this.directory, { recursive: true });
  }

  async insert(data) {
    await this.ensureDirectory();
    return this.engine.queue.run(async () => {
      const document = validateDocument(data);

      const id = randomUUID();
      const now = new Date().toISOString();

      const record = {
        ...document,
        _id: id,
        _version: 1,
        createdAt: now,
        updatedAt: now
      };

      await this.engine.atomicWrite(
        this.documentPath(id),
        record
      );

      return record;
    });
  }

  async findById(id) {
    return this.readFile(id);
  }

  async find(filter = {}, options = {}) {
    let files;
    try {
      files = await fs.readdir(this.directory);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }

    const records = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const id = file.slice(0, -5);
      const record = await this.readFile(id);

      if (record && matches(record, filter)) {
        records.push(record);
      }
    }

    const sorted = sortDocuments(records, options.sort || {});

    const offset = Math.max(0, options.offset || 0);
    const limit = Math.max(0, options.limit ?? sorted.length);

    return sorted.slice(offset, offset + limit);
  }

  async count(filter = {}) {
    const records = await this.find(filter);
    return records.length;
  }

  async update(id, changes) {
    return this.engine.queue.run(async () => {
      const current = await this.readFile(id);

      if (!current) {
        throw new StorageError("Document not found", 404);
      }

      const patch = validateDocument(changes);

      for (const protectedField of [
        "_id",
        "_version",
        "createdAt"
      ]) {
        if (Object.hasOwn(patch, protectedField)) {
          throw new StorageError(
            `Cannot modify ${protectedField}`,
            400
          );
        }
      }

      const updated = {
        ...current,
        ...patch,
        _id: current._id,
        _version: current._version + 1,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString()
      };

      await this.engine.atomicWrite(
        this.documentPath(id),
        updated
      );

      return updated;
    });
  }

  async delete(id) {
    return this.engine.queue.run(async () => {
      const filename = this.documentPath(id);

      try {
        await fs.unlink(filename);
        return true;
      } catch (error) {
        if (error.code === "ENOENT") {
          return false;
        }

        throw error;
      }
    });
  }
}