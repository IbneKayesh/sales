import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { StorageError } from "../storage/errors.js";

/** Models live at <project>/model/*.json and drive write validation. */
const modelsPath = fileURLToPath(new URL("../../../model/", import.meta.url));

let cache = null;

async function loadModels() {
  if (cache) return cache;

  let files = [];
  try {
    files = await fs.readdir(path.resolve(modelsPath));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    cache = {};
    return cache;
  }

  const models = {};

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const raw = await fs.readFile(path.join(path.resolve(modelsPath), file), "utf8");
    const model = JSON.parse(raw);

    if (model?.collection) models[model.collection] = model;
  }

  cache = models;
  return models;
}

export async function listModels() {
  return loadModels();
}

export async function getModel(collection) {
  const models = await loadModels();
  return models[collection] ?? null;
}

function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

export function validateWithModel(model, data) {
  if (!model) return [];

  const errors = [];

  for (const field of model.fields ?? []) {
    const value = data?.[field.name];

    if (field.required && isEmpty(value)) {
      errors.push(`${field.label || field.name} is required`);
      continue;
    }

    if (isEmpty(value)) continue;

    switch (field.type) {
      case "number":
        if (typeof value !== "number" || Number.isNaN(value)) {
          errors.push(`${field.label || field.name} must be a number`);
        } else if (field.min !== undefined && value < field.min) {
          errors.push(`${field.label || field.name} must be at least ${field.min}`);
        }
        break;
      case "string":
      case "date":
        if (typeof value !== "string") {
          errors.push(`${field.label || field.name} must be text`);
        } else if (field.maxLength && value.length > field.maxLength) {
          errors.push(
            `${field.label || field.name} must be at most ${field.maxLength} characters`
          );
        }
        break;
      case "enum":
        if (!field.values?.includes(value)) {
          errors.push(
            `${field.label || field.name} must be one of: ${field.values?.join(", ")}`
          );
        }
        break;
      case "array":
        if (!Array.isArray(value)) {
          errors.push(`${field.label || field.name} must be a list`);
        }
        break;
      default:
        break;
    }
  }

  if (model.balancedEntries) {
    const entries = Array.isArray(data?.entries) ? data.entries : [];
    const debits = entries
      .filter((entry) => entry.side === "debit")
      .reduce((total, entry) => total + (Number(entry.amount) || 0), 0);
    const credits = entries
      .filter((entry) => entry.side === "credit")
      .reduce((total, entry) => total + (Number(entry.amount) || 0), 0);

    if (entries.length !== 2) {
      errors.push("A transaction needs exactly one debit and one credit entry");
    }
    if (debits !== credits) {
      errors.push(`Debits (${debits}) must equal credits (${credits})`);
    }
    if (debits <= 0) {
      errors.push("Transaction amount must be greater than zero");
    }
  }

  return errors;
}

/** Throws a 400 StorageError when a record does not satisfy its model. */
export async function validateRecord(collection, data) {
  const model = await getModel(collection);
  if (!model) return;

  const errors = validateWithModel(model, data);

  if (errors.length) {
    throw new StorageError(errors[0], 400);
  }
}
