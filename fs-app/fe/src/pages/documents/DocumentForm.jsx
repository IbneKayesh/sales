import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Badge, Button, Field, Modal, Textarea } from "../../components/ui";
import { useToast } from "../../hooks/useToast";

const INTERNAL_FIELDS = new Set(["_id", "_version", "createdAt", "updatedAt"]);

function editableFields(document) {
  if (!document) return {};

  return Object.fromEntries(
    Object.entries(document).filter(([key]) => !INTERNAL_FIELDS.has(key))
  );
}

export function DocumentForm({ collection, document, repository, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(document);

  const [json, setJson] = useState(() =>
    JSON.stringify(editableFields(document), null, 2)
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    let payload;
    try {
      payload = JSON.parse(json);
    } catch (err) {
      setError(err.message);
      return;
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      setError("Document must be a JSON object { … }");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const saved = isEdit
        ? await repository.update(document._id, payload)
        : await repository.create(payload);

      toast.success(isEdit ? "Document updated" : "Document inserted");
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title={isEdit ? "Edit document" : "Insert document"}
      icon={isEdit ? Pencil : Plus}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="document-form"
            variant="primary"
            loading={saving}
          >
            {isEdit ? "Save changes" : "Insert"}
          </Button>
        </>
      }
    >
      {isEdit ? (
        <div className="doc-meta">
          <Badge className="u-mono" tone="neutral">
            file: {document._id}.json
          </Badge>
          <Badge tone="brand">v{document._version}</Badge>
          <Badge tone="neutral">
            updated {new Date(document.updatedAt).toLocaleString()}
          </Badge>
        </div>
      ) : null}

      <form id="document-form" onSubmit={handleSubmit}>
        <Field label={`Document JSON in “${collection}”`} htmlFor="document-json">
          <Textarea
            id="document-json"
            className="code-input"
            spellCheck={false}
            value={json}
            onChange={(event) => {
              setJson(event.target.value);
              setError("");
            }}
          />
        </Field>
      </form>

      {error ? (
        <div className="alert alert--danger" role="alert">
          {error}
        </div>
      ) : null}
    </Modal>
  );
}
