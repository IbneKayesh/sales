import fs from "node:fs/promises";
import path from "node:path";

import { Collection } from "./collection.js";
import { WriteQueue } from "./write-queue.js";

import { randomUUID } from "node:crypto";

export class FileBase {
  constructor(dataPath) {
    this.dataPath = path.resolve(dataPath);

    this.collectionsPath = path.join(
      this.dataPath,
      "collections"
    );

    this.tempPath = path.join(
      this.dataPath,
      "_temp"
    );

    this.queue = new WriteQueue();
  }

  async initialize() {
    await fs.mkdir(this.collectionsPath, {
      recursive: true
    });

    await fs.mkdir(this.tempPath, {
      recursive: true
    });

    await fs.mkdir(
      path.join(this.dataPath, "_system"),
      { recursive: true }
    );

    // Remove abandoned temporary files from an
    // interrupted atomic write.
    const temporaryFiles = await fs.readdir(this.tempPath);

    for (const file of temporaryFiles) {
      await fs.rm(path.join(this.tempPath, file), {
        force: true,
        recursive: true
      });
    }

    return this;
  }

  collection(name) {
    return new Collection(this, name);
  }

  async atomicWrite(destination, data) {
    const tempName = `${randomUUID()}.tmp`;
    const tempFile = path.join(this.tempPath, tempName);

    const content = JSON.stringify(data, null, 2);

    let handle;

    try {
      handle = await fs.open(tempFile, "wx");

      await handle.writeFile(content, "utf8");
      await handle.sync();
      await handle.close();

      handle = null;

      await fs.rename(tempFile, destination);
    } catch (error) {
      if (handle) {
        await handle.close().catch(() => {});
      }

      await fs.rm(tempFile, { force: true }).catch(() => {});

      throw error;
    }
  }
}