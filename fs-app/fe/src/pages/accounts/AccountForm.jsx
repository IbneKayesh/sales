import { useState } from "react";
import { Wallet } from "lucide-react";
import {
  Button,
  Field,
  Input,
  Modal,
  Select,
  Textarea,
} from "../../components/ui";
import { useBanking } from "../../hooks/useBanking";
import { useModels } from "../../hooks/useModels";
import { useToast } from "../../hooks/useToast";
import { BANK_STATUS, BANK_TYPES } from "../../lib/domain/constants";
import { validateRecord } from "../../lib/domain/validation";

export function AccountForm({ account, onClose, onSave }) {
  const { banks } = useBanking();
  const { getModel } = useModels();
  const toast = useToast();
  const isEdit = Boolean(account);

  const [form, setForm] = useState(() => ({
    bankId: account?.bankId || banks[0]?._id || "",
    accountName: account?.accountName || "",
    accountNo: account?.accountNo || "",
    type: account?.type || "Savings",
    openingBalance: String(account?.openingBalance ?? ""),
    status: account?.status || "active",
    notes: account?.notes || "",
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
      bankId: form.bankId,
      accountName: form.accountName.trim(),
      accountNo: form.accountNo.trim(),
      type: form.type,
      openingBalance: Number(form.openingBalance) || 0,
      status: form.status,
      notes: form.notes,
    };

    const nextErrors = validateRecord(getModel("accounts"), payload);

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
      title={isEdit ? "Edit bank account" : "Add bank account"}
      icon={Wallet}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="account-form"
            variant="primary"
            loading={saving}
          >
            {isEdit ? "Save changes" : "Add account"}
          </Button>
        </>
      }
    >
      <form id="account-form" className="form-grid" onSubmit={handleSubmit}>
        <Field label="Bank" htmlFor="account-bank" required error={errors.bankId}>
          <Select
            id="account-bank"
            value={form.bankId}
            onChange={(event) => setField("bankId", event.target.value)}
          >
            <option value="">Select bank…</option>
            {banks.map((bank) => (
              <option key={bank._id} value={bank._id}>
                {bank.name} — {bank.branch}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Account name" htmlFor="account-name" required error={errors.accountName}>
          <Input
            id="account-name"
            value={form.accountName}
            onChange={(event) => setField("accountName", event.target.value)}
            placeholder="e.g. Travel trading"
          />
        </Field>

        <Field label="Account no" htmlFor="account-no" required error={errors.accountNo}>
          <Input
            id="account-no"
            mono
            value={form.accountNo}
            onChange={(event) => setField("accountNo", event.target.value)}
            placeholder="e.g. 15001000001"
          />
        </Field>

        <Field label="Type" htmlFor="account-type">
          <Select
            id="account-type"
            value={form.type}
            onChange={(event) => setField("type", event.target.value)}
          >
            {BANK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Opening balance" htmlFor="account-opening">
          <Input
            id="account-opening"
            type="number"
            step="0.01"
            value={form.openingBalance}
            onChange={(event) => setField("openingBalance", event.target.value)}
            placeholder="0.00"
          />
        </Field>

        <Field label="Status" htmlFor="account-status">
          <Select
            id="account-status"
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

        <Field label="Notes" htmlFor="account-notes" full>
          <Textarea
            id="account-notes"
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
