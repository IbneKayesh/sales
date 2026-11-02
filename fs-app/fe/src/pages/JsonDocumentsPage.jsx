import { useState, useEffect, useCallback } from "react";
import { filebase } from "../api/filebase";
import DocumentManager from "../components/DocumentManager";

export default function JsonDocumentsPage({ toast }) {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("customers");
  const [newColName, setNewColName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const loadCollections = useCallback(async () => {
    try {
      const res = await filebase.listCollections();
      const list = res.data || [];
      setCollections(list);
      if (list.length > 0 && !list.includes(selectedCollection)) {
        setSelectedCollection(list[0]);
      }
    } catch (err) {
      toast.error("Failed to load collections: " + err.message);
    }
  }, [selectedCollection, toast]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  async function handleCreateCollection(e) {
    e.preventDefault();
    const trimmed = newColName.trim();
    if (!trimmed) return;
    setCreating(true);
    setError("");
    try {
      await filebase.createCollection(trimmed);
      toast.success(`Collection "${trimmed}" created!`);
      setNewColName("");
      setShowCreateModal(false);
      await loadCollections();
      setSelectedCollection(trimmed);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function handleCollectionDropped() {
    loadCollections();
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-16" style={{ flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚙️</span> Custom JSON Documents
          </h1>
          <p className="page-sub">
            Directly view, edit, and insert raw JSON documents into any collection
          </p>
        </div>

        <div className="flex gap-8 items-center">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowCreateModal(true)}
            id="create-collection-btn"
          >
            ＋ New Collection
          </button>
        </div>
      </div>

      {/* Collection Tab Selector */}
      <div
        className="card mb-16"
        style={{
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dim)" }}>
          Active Collection:
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {collections.map((col) => (
            <button
              key={col}
              id={`col-pill-${col}`}
              onClick={() => setSelectedCollection(col)}
              className={`btn btn-sm ${
                selectedCollection === col ? "btn-primary" : "btn-ghost"
              }`}
              style={{ borderRadius: "var(--radius-full)", padding: "4px 12px", fontSize: 13 }}
            >
              📁 {col}
            </button>
          ))}
          {collections.length === 0 && (
            <span className="text-dim" style={{ fontSize: 13 }}>No collections found</span>
          )}
        </div>
      </div>

      {/* Document Manager Body */}
      {selectedCollection && (
        <DocumentManager
          key={selectedCollection}
          collection={selectedCollection}
          toast={toast}
          onCollectionDropped={handleCollectionDropped}
        />
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
        >
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span style={{ fontSize: 18 }}>📁</span>
              <span className="modal-title">Create New Collection</span>
              <button
                className="btn btn-ghost btn-icon ml-auto"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateCollection}>
              <div className="modal-body">
                <div className="input-group">
                  <label className="input-label" htmlFor="new-col-input">
                    Collection Name
                  </label>
                  <input
                    id="new-col-input"
                    className="input"
                    placeholder="e.g. audit_logs, suppliers, config"
                    value={newColName}
                    onChange={(e) => {
                      setNewColName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""));
                      setError("");
                    }}
                    autoFocus
                    required
                  />
                  <span className="input-hint" style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
                    Lowercase letters, numbers, underscores, and dashes only.
                  </span>
                </div>

                {error && (
                  <div
                    className="mt-8"
                    style={{
                      color: "var(--red)",
                      fontSize: 12,
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating || !newColName.trim()}
                >
                  {creating ? "Creating…" : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
