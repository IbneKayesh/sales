import { http } from "./client";

const encode = (value) => encodeURIComponent(JSON.stringify(value));

/**
 * Generic JSON-document repository for one FileBase collection.
 * Files are stored as 1.json, 2.json, ... under the collection folder.
 */
export function createDocumentRepository(collection) {
  return {
    async list({ filter = {}, sort = { createdAt: -1 }, limit = 1000, offset = 0 } = {}) {
      const response = await http.get(
        `/${collection}?filter=${encode(filter)}&sort=${encode(sort)}&limit=${limit}&offset=${offset}`
      );
      return response?.data ?? [];
    },

    async get(id) {
      const response = await http.get(`/${collection}/${id}`);
      return response?.data ?? null;
    },

    async count(filter = {}) {
      const response = await http.get(`/${collection}/count?filter=${encode(filter)}`);
      return response?.count ?? 0;
    },

    async create(document) {
      const response = await http.post(`/${collection}`, document);
      return response?.data ?? null;
    },

    async update(id, changes) {
      const response = await http.patch(`/${collection}/${id}`, changes);
      return response?.data ?? null;
    },

    remove(id) {
      return http.delete(`/${collection}/${id}`);
    },
  };
}

export const banksApi = createDocumentRepository("banks");
export const accountsApi = createDocumentRepository("accounts");
export const savingsApi = createDocumentRepository("savings");
export const dpsApi = createDocumentRepository("dps");
export const fdApi = createDocumentRepository("fd");
export const transactionsApi = createDocumentRepository("transactions");
export const exampleDocumentsApi = createDocumentRepository("example_docs");

/** API + collection for every sub-account type. */
export const childAccountApis = {
  Savings: savingsApi,
  DPS: dpsApi,
  FD: fdApi,
};

export const childAccountCollections = {
  Savings: "savings",
  DPS: "dps",
  FD: "fd",
};

export const modelsApi = {
  async list() {
    const response = await http.get("/models");
    return response?.data ?? {};
  },
};

export const documentsApi = {
  forCollection: (collection) => createDocumentRepository(collection),
};

export const collectionsApi = {
  async list() {
    const response = await http.get("/collections");
    return response?.data ?? [];
  },

  create(name) {
    return http.post("/collections", { name });
  },

  drop(name) {
    return http.delete(`/collections/${name}`);
  },
};
