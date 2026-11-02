import { useEffect, useState, useCallback, useRef } from "react";
import { filebase } from "../api/filebase";

// ─── JSON value renderer ───────────────────────────────────────────────────
function JsonValue({ value }) {
  if (value === null)
    return <span className="json-value json-null">null</span>;
  if (typeof value === "boolean")
    return <span className="json-value json-boolean">{String(value)}</span>;
  if (typeof value === "number")
    return <span className="json-value json-number">{value}</span>;
  if (typeof value === "string")
    return (
      <span className="json-value json-string truncate" title={value}>
        {value}
      </span>
    );
  if (Array.isArray(value))
    return (
      <span className="json-value text-dim">
        [{value.length} items]
      </span>
    );
  return (
    <span className="json-value text-dim">
      {"{"}…{"}"}
    </span>
  );
}

// ─── Detect column keys from documents (skip internal fields for display) ──
const INTERNAL = new Set(["_id", "_version", "createdAt", "updatedAt"]);

function getColumns(docs) {
  const seen = new Set();
  for (const doc of docs) {
    for (const key of Object.keys(doc)) {
      if (!INTERNAL.has(key)) seen.add(key);
    }
  }
  return [...seen].slice(0, 8); // max 8 user columns
}

// ─── JSON editor modal ──────────────────────────────────────────────────────
function DocModal({ collection, doc, onClose, onSaved, toast }) {
  const isEdit = !!doc;

  // Strip internal fields for editing
  const userFields = isEdit
    ? Object.fromEntries(
        Object.entries(doc).filter(([k]) => !INTERNAL.has(k))
      )
    : {};

  const [json, setJson] = useState(
    JSON.stringify(userFields, null, 2)
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function validateJson(str) {
    try {
      const parsed = JSON.parse(str);
      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        return [null, "Must be a JSON object { … }"];
      }
      return [parsed, null];
    } catch (e) {
      return [null, e.message];
    }
  }

  async function handleSave() {
    const [parsed, err] = validateJson(json);
    if (err) {
      setError(err);
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        const updated = await filebase.update(collection, doc._id, parsed);
        toast.success("Document updated");
        onSaved(updated.data);
      } else {
        const created = await filebase.insert(collection, parsed);
        toast.success("Document inserted");
        onSaved(created.data);
      }
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit document" : "Insert document"}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <span style={{ fontSize: 18 }}>{isEdit ? "✏️" : "➕"}</span>
          <span className="modal-title">
            {isEdit ? "Edit Document" : "Insert Document"}
          </span>
          {isEdit && (
            <span
              className="font-mono text-dim"
              style={{ fontSize: 11, marginLeft: 4 }}
            >
              {doc._id.slice(0, 8)}…
            </span>
          )}
          <button
            className="btn btn-ghost btn-icon ml-auto"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {isEdit && (
            <div
              className="flex gap-8 items-center mb-12"
              style={{ flexWrap: "wrap", gap: 6 }}
            >
              {["_id", "_version", "createdAt", "updatedAt"].map((k) => (
                <span key={k} className="badge badge-dim font-mono">
                  {k}: {String(doc[k]).slice(0, 20)}
                </span>
              ))}
            </div>
          )}

          <div className="input-group">
            <label className="input-label" htmlFor="doc-json-editor">
              Document JSON
            </label>
            <textarea
              id="doc-json-editor"
              className="textarea"
              value={json}
              onChange={(e) => {
                setJson(e.target.value);
                setError("");
              }}
              rows={14}
              spellCheck={false}
            />
          </div>

          {error && (
            <div
              className="mt-8"
              style={{
                color: "var(--red)",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                background: "var(--red-soft)",
                padding: "8px 10px",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            id={isEdit ? "save-doc-btn" : "insert-doc-btn"}
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner" style={{ width: 14, height: 14 }} />
                Saving…
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Insert"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete confirm modal ───────────────────────────────────────────────────
function DeleteModal({ collection, doc, onClose, onDeleted, toast }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await filebase.delete(collection, doc._id);
      toast.success("Document deleted");
      onDeleted(doc._id);
      onClose();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <span style={{ fontSize: 18 }}>🗑</span>
          <span className="modal-title">Delete Document</span>
          <button
            className="btn btn-ghost btn-icon ml-auto"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="confirm-warning">
            <span>⚠</span>
            <div>
              This will permanently delete document{" "}
              <strong className="font-mono">{doc._id.slice(0, 12)}…</strong>.
              This action cannot be undone.
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Drop collection confirm modal ─────────────────────────────────────────
function DropCollectionModal({ name, onClose, onDropped, toast }) {
  const [dropping, setDropping] = useState(false);
  const [confirm, setConfirm] = useState("");

  async function handleDrop() {
    setDropping(true);
    try {
      await filebase.dropCollection(name);
      toast.success(`Collection "${name}" dropped`);
      onDropped();
      onClose();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDropping(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <span style={{ fontSize: 18 }}>💥</span>
          <span className="modal-title">Drop Collection</span>
          <button
            className="btn btn-ghost btn-icon ml-auto"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="confirm-warning">
            <span>⚠</span>
            <div>
              Dropping <strong>{name}</strong> will permanently delete{" "}
              <em>all documents</em> in this collection.
            </div>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="drop-confirm-input">
              Type the collection name to confirm
            </label>
            <input
              id="drop-confirm-input"
              className="input"
              placeholder={name}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            id="confirm-drop-btn"
            className="btn btn-danger"
            onClick={handleDrop}
            disabled={dropping || confirm !== name}
          >
            {dropping ? "Dropping…" : "Drop Collection"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main DocumentManager ───────────────────────────────────────────────────
export default function DocumentManager({ collection, toast, onCollectionDropped }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  const [editDoc, setEditDoc] = useState(null);   // null = insert mode, object = edit mode
  const [showInsert, setShowInsert] = useState(false);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [showDrop, setShowDrop] = useState(false);

  const abortRef = useRef(null);

  const loadDocuments = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    try {
      const result = await filebase.find(
        collection,
        {},
        { createdAt: -1 },
        1000,
        0
      );
      if (!ctrl.signal.aborted) {
        setDocuments(result.data);
        setPage(0);
      }
    } catch (err) {
      if (!ctrl.signal.aborted) toast.error(err.message);
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, [collection, toast]);

  useEffect(() => {
    loadDocuments();
    setSearch("");
  }, [loadDocuments]);

  // Filter by search term (client-side)
  const filtered = documents.filter((doc) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return JSON.stringify(doc).toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const columns = getColumns(paginated.length ? paginated : documents.slice(0, 20));

  function handleInserted(doc) {
    setDocuments((prev) => [doc, ...prev]);
  }

  function handleUpdated(doc) {
    setDocuments((prev) =>
      prev.map((d) => (d._id === doc._id ? doc : d))
    );
  }

  function handleDeleted(id) {
    setDocuments((prev) => prev.filter((d) => d._id !== id));
  }

  return (
    <div>
      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Documents</div>
          <div className="stat-value">{documents.length}</div>
          <div className="stat-sub">in {collection}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Filtered</div>
          <div className="stat-value">{filtered.length}</div>
          <div className="stat-sub">matching search</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Columns</div>
          <div className="stat-value">{columns.length}</div>
          <div className="stat-sub">user fields</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Page</div>
          <div className="stat-value">{totalPages > 0 ? page + 1 : 0}</div>
          <div className="stat-sub">of {totalPages}</div>
        </div>
      </div>

      {/* Search + actions bar */}
      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-input-icon">🔍</span>
          <input
            id="doc-search"
            className="input search-input"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search documents…"
          />
        </div>
        <button
          className="btn btn-secondary"
          onClick={loadDocuments}
          disabled={loading}
          title="Refresh"
          id="refresh-btn"
        >
          {loading ? <span className="spinner" /> : "⟳"}
        </button>
        <button
          id="insert-doc-trigger"
          className="btn btn-primary"
          onClick={() => { setEditDoc(null); setShowInsert(true); }}
        >
          ＋ Insert
        </button>
        <button
          id="drop-collection-trigger"
          className="btn btn-danger btn-sm"
          onClick={() => setShowDrop(true)}
          title="Drop collection"
        >
          🗑 Drop
        </button>
      </div>

      {/* Table */}
      {loading && documents.length === 0 ? (
        <div className="loading-row">
          <span className="spinner" />
          Loading documents…
        </div>
      ) : paginated.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">{search ? "🔍" : "📭"}</span>
          <span className="empty-title">
            {search ? "No matching documents" : "No documents yet"}
          </span>
          <span className="empty-sub">
            {search
              ? "Try a different search term"
              : `Insert the first document into "${collection}"`}
          </span>
          {!search && (
            <button
              className="btn btn-primary mt-8"
              onClick={() => { setEditDoc(null); setShowInsert(true); }}
            >
              ＋ Insert Document
            </button>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 130 }}>_id</th>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                  <th style={{ width: 80 }}>version</th>
                  <th style={{ width: 160 }}>createdAt</th>
                  <th style={{ width: 100, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <span
                        className="table-cell-mono truncate"
                        style={{ display: "block", maxWidth: 120 }}
                        title={doc._id}
                      >
                        {doc._id.slice(0, 8)}…
                      </span>
                    </td>
                    {columns.map((col) => (
                      <td key={col}>
                        <span className="table-cell-value">
                          <JsonValue value={doc[col]} />
                        </span>
                      </td>
                    ))}
                    <td>
                      <span className="badge badge-accent">v{doc._version}</span>
                    </td>
                    <td>
                      <span className="table-cell-mono" style={{ fontSize: 11 }}>
                        {new Date(doc.createdAt).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div
                        className="flex gap-8 items-center"
                        style={{ justifyContent: "flex-end" }}
                      >
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="Edit"
                          onClick={() => setEditDoc(doc)}
                        >
                          ✏
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="Delete"
                          style={{ color: "var(--red)" }}
                          onClick={() => setDeleteDoc(doc)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <span>
                {page * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE + PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div className="pagination-controls">
                <button
                  className="btn btn-ghost btn-sm btn-icon"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const pg = totalPages <= 7
                    ? i
                    : page < 4
                    ? i
                    : page > totalPages - 4
                    ? totalPages - 7 + i
                    : page - 3 + i;
                  return (
                    <button
                      key={pg}
                      className={`btn btn-sm btn-icon${pg === page ? " btn-primary" : " btn-ghost"}`}
                      onClick={() => setPage(pg)}
                    >
                      {pg + 1}
                    </button>
                  );
                })}
                <button
                  className="btn btn-ghost btn-sm btn-icon"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {(showInsert || editDoc) && (
        <DocModal
          collection={collection}
          doc={editDoc}
          onClose={() => { setShowInsert(false); setEditDoc(null); }}
          onSaved={editDoc ? handleUpdated : handleInserted}
          toast={toast}
        />
      )}

      {deleteDoc && (
        <DeleteModal
          collection={collection}
          doc={deleteDoc}
          onClose={() => setDeleteDoc(null)}
          onDeleted={handleDeleted}
          toast={toast}
        />
      )}

      {showDrop && (
        <DropCollectionModal
          name={collection}
          onClose={() => setShowDrop(false)}
          onDropped={onCollectionDropped}
          toast={toast}
        />
      )}
    </div>
  );
}