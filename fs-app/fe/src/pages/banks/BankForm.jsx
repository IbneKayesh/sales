import { useState } from "react";
import { Landmark } from "lucide-react";
import {
  Button,
  Field,
  Input,
  Modal,
  Select,
  Textarea,
} from "../../components/ui";
import { useModels } from "../../hooks/useModels";
import { useToast } from "../../hooks/useToast";
import { BANK_STATUS } from "../../lib/domain/constants";
import { validateRecord } from "../../lib/domain/validation";

export function BankForm({ bank, onClose, onSave }) {
  const { getModel } = useModels();
  const toast = useToast();
  const isEdit = Boolean(bank);

  const [form, setForm] = useState(() => ({
    name: bank?.name || "",
    branch: bank?.branch || "",
    status: bank?.status || "active",
    notes: bank?.notes || "",
  }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      branch: form.branch.trim(),
      status: form.status,
      notes: form.notes,
    };

    const nextErrors = validateRecord(getModel("banks"), payload);

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await onSave(payload);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title={isEdit ? "Edit bank" : "Add bank"}
      icon={Landmark}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="bank-form" variant="primary" loading={saving}>
            {isEdit ? "Save changes" : "Add bank"}
          </Button>
        </>
      }
    >
      <form id="bank-form" className="form-grid" onSubmit={handleSubmit}>
        <Field label="Bank name" htmlFor="bank-name" required error={errors.name}>
          <Input
            id="bank-name"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            placeholder="e.g. Brac Bank Ltd"
          />
        </Field>

        <Field label="Branch" htmlFor="bank-branch" required error={errors.branch}>
          <Input
            id="bank-branch"
            value={form.branch}
            onChange={(event) => setField("branch", event.target.value)}
            placeholder="e.g. Gulshan 2"
          />
        </Field>

        <Field label="Status" htmlFor="bank-status">
          <Select
            id="bank-status"
            value={form.status}
            onChange={(event) => setField("status", event.target.value)}
          >
            {Object.entries(BANK_STATUS).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Notes" htmlFor="bank-notes" full>
          <Textarea
            id="bank-notes"
            rows={2}
            value={form.notes}
            onChange={(event) => setField("notes", event.target.value)}
            placeholder="Optional notes…"
          />
        </Field>
      </form>
    </Modal>
  );
}
