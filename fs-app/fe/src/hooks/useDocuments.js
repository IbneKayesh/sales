import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "./useToast";
import { collectionsApi, documentsApi } from "../lib/api/repositories";

const PAGE_SIZE = 50;
const DEFAULT_COLLECTION = "example_docs";

export function useDocuments() {
  const toast = useToast();

  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState("");
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [formDocument, setFormDocument] = useState(undefined);

  const fetchCollections = useCallback(() => collectionsApi.list(), []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const names = await fetchCollections();
        if (cancelled) return;
        setCollections(names);
        setSelected((current) =>
          current ||
          (names.includes(DEFAULT_COLLECTION) ? DEFAULT_COLLECTION : names[0] ?? "")
        );
      } catch (err) {
        if (!cancelled) toast.error(err.message);
      } finally {
        if (!cancelled) setCollectionsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchCollections, toast]);

  const repository = useMemo(() => documentsApi.forCollection(selected), [selected]);

  useEffect(() => {
    if (!selected) return undefined;

    let cancelled = false;

    (async () => {
      try {
        const docs = await repository.list({ sort: { createdAt: -1 } });
        if (cancelled) return;
        setDocuments(docs);
        setPage(0);
      } catch (err) {
        if (!cancelled) toast.error(err.message);
      } finally {
        if (!cancelled) setDocumentsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [repository, selected, toast]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return documents;

    return documents.filter((document) =>
      JSON.stringify(document).toLowerCase().includes(query)
    );
  }, [documents, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);

  function selectCollection(name) {
    if (name === selected) return;
    setDocumentsLoading(true);
    setSelected(name);
    setSearch("");
    setPage(0);
  }

  async function refreshDocuments() {
    if (!selected) return;
    setDocumentsLoading(true);
    try {
      setDocuments(await repository.list({ sort: { createdAt: -1 } }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDocumentsLoading(false);
    }
  }

  function handleSaved(saved) {
    setDocuments((current) => {
      const exists = current.some((document) => document._id === saved._id);
      return exists
        ? current.map((document) => (document._id === saved._id ? saved : document))
        : [saved, ...current];
    });
  }

  function requestDelete(document) {
    toast.confirm({
      title: "Delete document?",
      message: `Document ${document._id} will be removed from ${selected}.`,
      confirmLabel: "Yes, delete",
      onConfirm: async () => {
        try {
          await repository.remove(document._id);
          setDocuments((current) =>
            current.filter((item) => item._id !== document._id)
          );
          toast.success("Document deleted");
        } catch (err) {
          toast.error(err.message);
        }
      },
    });
  }

  function requestDropCollection() {
    toast.confirm({
      title: `Drop ${selected}?`,
      message: `All ${documents.length} documents in this collection will be deleted.`,
      confirmLabel: "Yes, drop",
      onConfirm: async () => {
        try {
          await collectionsApi.drop(selected);
          const names = await fetchCollections();
          setCollections(names);
          setSelected(names[0] ?? "");
          setDocuments([]);
          toast.success("Collection dropped");
        } catch (err) {
          toast.error(err.message);
        }
      },
    });
  }

  async function createCollection(name) {
    await collectionsApi.create(name);
    const names = await fetchCollections();
    setCollections(names);
    setDocumentsLoading(true);
    setSelected(name);
    toast.success(`Collection “${name}” created`);
  }

  return {
    collections,
    collectionsLoading,
    selected,
    documents,
    documentsLoading,
    filtered,
    pageSize: PAGE_SIZE,
    pageCount,
    currentPage,
    setPage,
    search,
    setSearch,
    formDocument,
    setFormDocument,
    repository,
    selectCollection,
    refreshDocuments,
    handleSaved,
    requestDelete,
    requestDropCollection,
    createCollection,
  };
}
