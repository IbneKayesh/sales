import { useState } from "react";
import { FolderPlus, FolderTree, RefreshCw } from "lucide-react";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
} from "../../components/ui";
import { useDocuments } from "../../hooks/useDocuments";
import { DocumentForm } from "./DocumentForm";
import { DocumentList } from "./DocumentList";

export function DocumentsPage() {
  const documents = useDocuments();

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate(event) {
    event.preventDefault();
    const name = newName.trim();

    if (!name) {
      setFormError("Collection name is required");
      return;
    }

    setCreating(true);
    setFormError("");
    try {
      await documents.createCollection(name);
      setCreateOpen(false);
      setNewName("");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function closeCreateModal() {
    setCreateOpen(false);
    setNewName("");
    setFormError("");
  }

  return (
    <>
      <PageHeader
        title="JSON Documents"
        subtitle="Example CRUD over raw JSON documents stored as short numeric files"
        actions={
          <>
            <Button
              iconOnly
              variant="ghost"
              onClick={documents.refreshDocuments}
              aria-label="Refresh documents"
            >
              <RefreshCw size={15} />
            </Button>
            <Button variant="primary" onClick={() => setCreateOpen(true)}>
              <FolderPlus size={15} /> New collection
            </Button>
          </>
        }
      />

      {documents.collections.length > 0 ? (
        <div className="collection-bar">
          <span className="collection-bar__label">Collection</span>
          <div className="chip-list">
            {documents.collections.map((name) => (
              <button
                key={name}
                type="button"
                className={`chip${documents.selected === name ? " is-active" : ""}`}
                aria-pressed={documents.selected === name}
                onClick={() => documents.selectCollection(name)}
              >
                <FolderTree size={13} aria-hidden="true" />
                {name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {documents.selected ? (
        <DocumentList {...documents} />
      ) : (
        <Card>
          <EmptyState
            icon={FolderTree}
            title={
              documents.collectionsLoading
                ? "Loading collections…"
                : "No collections yet"
            }
            description={
              documents.collectionsLoading
                ? "Fetching collections from the local JSON store."
                : "Create a collection to start inserting JSON documents."
            }
            action={
              documents.collectionsLoading ? null : (
                <Button variant="primary" onClick={() => setCreateOpen(true)}>
                  <FolderPlus size={15} /> New collection
                </Button>
              )
            }
          />
        </Card>
      )}

      {documents.formDocument !== undefined ? (
        <DocumentForm
          collection={documents.selected}
          document={documents.formDocument}
          repository={documents.repository}
          onClose={() => documents.setFormDocument(undefined)}
          onSaved={documents.handleSaved}
        />
      ) : null}

      {createOpen ? (
        <Modal
          title="Create collection"
          icon={FolderPlus}
          size="sm"
          onClose={closeCreateModal}
          footer={
            <>
              <Button onClick={closeCreateModal} disabled={creating}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="collection-form"
                variant="primary"
                loading={creating}
              >
                Create collection
              </Button>
            </>
          }
        >
          <form id="collection-form" onSubmit={handleCreate}>
            <Field
              label="Collection name"
              htmlFor="collection-name"
              required
              error={formError}
              hint="Lowercase letters, numbers, underscores and dashes only."
            >
              <Input
                id="collection-name"
                value={newName}
                autoComplete="off"
                placeholder="e.g. audit_logs, suppliers, config"
                onChange={(event) => {
                  setNewName(
                    event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
                  );
                  setFormError("");
                }}
              />
            </Field>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
