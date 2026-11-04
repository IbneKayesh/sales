import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import {
  Badge,
  Button,
  Field,
  Input,
  Modal,
  Select,
} from "../../components/ui";
import { useBanking } from "../../hooks/useBanking";
import { useModels } from "../../hooks/useModels";
import { useToast } from "../../hooks/useToast";
import { creditEntry, debitEntry } from "../../lib/domain/aggregates";
import {
  SYSTEM_ACCOUNTS,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_OPTIONS,
} from "../../lib/domain/constants";
import { formatMoney, todayISO } from "../../lib/domain/format";
import { validateRecord } from "../../lib/domain/validation";

const EMPTY_FORM = {
  date: todayISO(),
  type: "deposit",
  amount: "",
  debit: "",
  credit: "",
  reference: "",
  description: "",
};

function keyOf(entry) {
  if (!entry) return "";
  return `${entry.kind === "system" ? "system" : "child"}:${entry.id}`;
}

function toForm(transaction, defaultLegs) {
  if (!transaction) return { ...EMPTY_FORM, ...defaultLegs };

  return {
    date: transaction.date || todayISO(),
    type: transaction.type || "deposit",
    amount: String(transaction.amount ?? ""),
    debit: keyOf(debitEntry(transaction)),
    credit: keyOf(creditEntry(transaction)),
    reference: transaction.reference || "",
    description: transaction.description || "",
  };
}

export function TransactionForm({ transaction, onClose, onSave }) {
  const { savings, dps, fd } = useBanking();
  const { getModel } = useModels();
  const toast = useToast();
  const isEdit = Boolean(transaction);

  const childOptions = (list, type) =>
    list.map((child) => ({
      key: `child:${child._id}`,
      kind: "child",
      id: child._id,
      type,
      accountId: child.accountId,
      accountNo: child.accountNo,
      name: `${child.bankName || "Bank"} · ${type} ${child.accountNo}`,
      bankId: child.bankId,
      bankName: child.bankName,
    }));

  const savingsOptions = childOptions(savings, "Savings");
  const dpsOptions = childOptions(dps, "DPS");
  const fdOptions = childOptions(fd, "FD");
  const systemOptions = SYSTEM_ACCOUNTS.map((system) => ({
    key: `system:${system.code}`,
    kind: "system",
    id: system.code,
    type: system.code,
    accountId: "",
    accountNo: "",
    name: system.label,
    bankId: "",
    bankName: "",
  }));

  const allOptions = [
    ...savingsOptions,
    ...dpsOptions,
    ...fdOptions,
    ...systemOptions,
  ];

  const groups = [
    ["Savings sub accounts", savingsOptions],
    ["DPS sub accounts", dpsOptions],
    ["FD sub accounts", fdOptions],
    ["Income / expense accounts", systemOptions],
  ];

  function defaultKey(slot) {
    if (slot?.startsWith("system:")) return slot;
    if (slot === "savings") return savingsOptions[0]?.key || "";
    if (slot === "dps") return dpsOptions[0]?.key || "";
    if (slot === "fd") return fdOptions[0]?.key || "";
    return "";
  }

  function defaultLegs(type) {
    const meta = TRANSACTION_TYPES[type] ?? TRANSACTION_TYPES.deposit;
    const debit = defaultKey(meta.debit);
    let credit = defaultKey(meta.credit);

    if (credit && credit === debit) {
      credit =
        allOptions.find((option) => option.kind === "child" && option.key !== debit)
          ?.key || "";
    }

    return { debit, credit };
  }

  const [form, setForm] = useState(() =>
    toForm(transaction, defaultLegs(transaction?.type || "deposit"))
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const debitOption = allOptions.find((option) => option.key === form.debit);
  const creditOption = allOptions.find((option) => option.key === form.credit);
  const amount = Number(form.amount) || 0;
  const balanced = Boolean(debitOption && creditOption) && amount > 0;

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function changeType(type) {
    setForm((current) => ({ ...current, type, ...defaultLegs(type) }));
    setErrors((current) => ({ ...current, debit: "", credit: "", type: "" }));
  }

  function renderOptions() {
    return (
      <>
        <option value="">Select sub account…</option>
        {groups.map(([label, list]) =>
          list.length ? (
            <optgroup key={label} label={label}>
              {list.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.name}
                </option>
              ))}
            </optgroup>
          ) : null
        )}
      </>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const entries =
      debitOption && creditOption
        ? [
            {
              side: "debit",
              kind: debitOption.kind,
              id: debitOption.id,
              type: debitOption.type,
              accountId: debitOption.accountId,
              accountNo: debitOption.accountNo,
              name: debitOption.name,
              bankId: debitOption.bankId,
              bankName: debitOption.bankName,
              amount,
            },
            {
              side: "credit",
              kind: creditOption.kind,
              id: creditOption.id,
              type: creditOption.type,
              accountId: creditOption.accountId,
              accountNo: creditOption.accountNo,
              name: creditOption.name,
              bankId: creditOption.bankId,
              bankName: creditOption.bankName,
              amount,
            },
          ]
        : [];

    const bankLeg = entries.find((entry) => entry.bankId);

    const payload = {
      date: form.date,
      type: form.type,
      amount,
      entries,
      debitTotal: amount,
      creditTotal: amount,
      bankId: bankLeg?.bankId || "",
      bankName: bankLeg?.bankName || "",
      reference: form.reference.trim(),
      description: form.description.trim(),
    };

    const nextErrors = {};

    if (!form.date) nextErrors.date = "Pick a date";
    if (!debitOption) nextErrors.debit = "Select the debit sub account";
    if (!creditOption) nextErrors.credit = "Select the credit sub account";
    if (debitOption && creditOption && debitOption.key === creditOption.key) {
      nextErrors.credit = "Debit and credit must be different accounts";
    }

    const merged = {
      ...nextErrors,
      ...validateRecord(getModel("transactions"), payload),
    };

    setErrors(merged);
    if (Object.keys(merged).length) return;

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
      title={isEdit ? "Edit journal entry" : "New journal entry"}
      icon={ArrowLeftRight}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="transaction-form"
            variant="primary"
            loading={saving}
          >
            {isEdit ? "Save changes" : "Post transaction"}
          </Button>
        </>
      }
    >
      <form id="transaction-form" className="form-grid" onSubmit={handleSubmit}>
        <Field label="Date" htmlFor="tx-date" required error={errors.date}>
          <Input
            id="tx-date"
            type="date"
            value={form.date}
            onChange={(event) => setField("date", event.target.value)}
          />
        </Field>

        <Field label="Type" htmlFor="tx-type">
          <Select
            id="tx-type"
            value={form.type}
            onChange={(event) => changeType(event.target.value)}
          >
            {TRANSACTION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Amount" htmlFor="tx-amount" required error={errors.amount}>
          <Input
            id="tx-amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(event) => setField("amount", event.target.value)}
            placeholder="0.00"
          />
        </Field>

        <Field label="Reference" htmlFor="tx-reference">
          <Input
            id="tx-reference"
            value={form.reference}
            onChange={(event) => setField("reference", event.target.value)}
            placeholder="Cheque / TRX no (optional)"
          />
        </Field>

        <Field
          label="Debit (Dr)"
          htmlFor="tx-debit"
          required
          error={errors.debit}
          hint="Sub account that receives the value"
        >
          <Select
            id="tx-debit"
            value={form.debit}
            onChange={(event) => setField("debit", event.target.value)}
          >
            {renderOptions()}
          </Select>
        </Field>

        <Field
          label="Credit (Cr)"
          htmlFor="tx-credit"
          required
          error={errors.credit}
          hint="Sub account or income/expense that gives the value"
        >
          <Select
            id="tx-credit"
            value={form.credit}
            onChange={(event) => setField("credit", event.target.value)}
          >
            {renderOptions()}
          </Select>
        </Field>

        <Field label="Description" htmlFor="tx-description" full>
          <Input
            id="tx-description"
            value={form.description}
            onChange={(event) => setField("description", event.target.value)}
            placeholder="e.g. Client payment, DPS Oct-26, ATM withdrawal…"
          />
        </Field>

        <div className="form-summary field--full">
          <Badge tone={balanced ? "success" : "warning"} dot>
            {balanced
              ? "Balanced double entry · total debit = total credit"
              : "Choose both legs to balance the entry"}
          </Badge>
          <span>
            Dr {formatMoney(amount)} · Cr {formatMoney(amount)}
          </span>
        </div>
      </form>
    </Modal>
  );
}
