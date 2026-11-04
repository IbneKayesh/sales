import { useState } from "react";
import { PiggyBank } from "lucide-react";
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
import {
  ACCOUNT_STATUS,
  ACCOUNT_TYPE_OPTIONS,
  INTEREST_PAYMENT_TYPES,
} from "../../lib/domain/constants";
import { formatMoney, todayISO } from "../../lib/domain/format";
import { validateRecord } from "../../lib/domain/validation";

const EMPTY_FORM = {
  type: "DPS",
  bankId: "",
  accountId: "",
  accountNo: "",
  label: "",
  status: "active",
  rate: "",
  openDate: todayISO(),
  closeDate: "",
  notes: "",
  installmentAmount: "",
  installmentsTotal: "",
  installmentsPaid: "",
  installmentDay: "",
  totalInterest: "",
  interestEarned: "",
  lastInstallmentDate: "",
  nextInstallmentDate: "",
  principal: "",
  interestPaymentType: "Yearly",
  nextInterestPaymentDate: "",
};

function toForm(account) {
  if (!account) return { ...EMPTY_FORM };

  const form = { ...EMPTY_FORM };

  for (const [key, value] of Object.entries(account)) {
    if (key in form) form[key] = value ?? "";
  }

  form.type = account.type || "DPS";
  form.bankId = account.bankId || "";
  form.accountId = account.accountId || "";
  form.openDate = account.openDate || todayISO();
  form.interestPaymentType = account.interestPaymentType || "Yearly";

  return form;
}

export function SubAccountForm({ account, onClose, onSave }) {
  const { accounts, banks } = useBanking();
  const { getModel } = useModels();
  const toast = useToast();
  const isEdit = Boolean(account?._id);

  const [form, setForm] = useState(() => toForm(account));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isDps = form.type === "DPS";
  const isFd = form.type === "FD";
  const modelName = isDps ? "dps" : isFd ? "fd" : "savings";
  const bankAccounts = accounts.filter((item) => item.bankId === form.bankId);
  const installmentAmount = Number(form.installmentAmount) || 0;
  const installmentsTotal = Number(form.installmentsTotal) || 0;
  const installmentsPaid = Number(form.installmentsPaid) || 0;
  const principal = Number(form.principal) || 0;
  const totalInterest = Number(form.totalInterest) || 0;

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function setBank(bankId) {
    setForm((current) => ({ ...current, bankId, accountId: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!form.bankId) nextErrors.bankId = "Select a bank";
    if (!form.accountId) nextErrors.accountId = "Select the parent bank account";
    if (!form.accountNo.trim()) nextErrors.accountNo = "Account number is required";
    if (isDps && installmentAmount <= 0) {
      nextErrors.installmentAmount = "Enter the installment amount";
    }
    if (isDps && installmentsTotal <= 0) {
      nextErrors.installmentsTotal = "Enter the number of installments";
    }
    if (isFd && principal <= 0) nextErrors.principal = "Enter the FD principal";

    const payload = {
      type: form.type,
      accountId: form.accountId,
      accountNo: form.accountNo.trim(),
      label: form.label.trim() || form.type,
      status: form.status,
      rate: Number(form.rate) || 0,
      openDate: form.openDate,
      closeDate: form.closeDate,
      notes: form.notes,
    };

    if (isDps) {
      Object.assign(payload, {
        installmentAmount,
        installmentsTotal,
        installmentDay: Number(form.installmentDay) || 0,
        totalPayable: installmentAmount * installmentsTotal,
        totalInterest,
        installmentsPaid,
        totalPaid: installmentAmount * installmentsPaid,
        interestEarned: Number(form.interestEarned) || 0,
        lastInstallmentDate: form.lastInstallmentDate || null,
        nextInstallmentDate: form.nextInstallmentDate || null,
      });
    }

    if (isFd) {
      Object.assign(payload, {
        principal,
        totalInterest,
        maturityAmount: principal + totalInterest,
        interestPaymentType: form.interestPaymentType,
        interestPaymentDate: form.openDate,
        nextInterestPaymentDate: form.nextInterestPaymentDate || null,
      });
    }

    const mergedErrors = {
      ...nextErrors,
      ...validateRecord(getModel(modelName), payload),
    };

    setErrors(mergedErrors);
    if (Object.keys(mergedErrors).length) return;

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
      title={isEdit ? "Edit sub account" : "Add sub account"}
      icon={PiggyBank}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="sub-account-form"
            variant="primary"
            loading={saving}
          >
            {isEdit ? "Save changes" : "Add account"}
          </Button>
        </>
      }
    >
      <form
        id="sub-account-form"
        className="form-grid form-grid--3"
        onSubmit={handleSubmit}
      >
        <Field label="Type" htmlFor="sub-type">
          <Select
            id="sub-type"
            value={form.type}
            disabled={isEdit}
            onChange={(event) => setField("type", event.target.value)}
          >
            {ACCOUNT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Bank" htmlFor="sub-bank" required error={errors.bankId}>
          <Select
            id="sub-bank"
            value={form.bankId}
            onChange={(event) => setBank(event.target.value)}
          >
            <option value="">Select bank…</option>
            {banks.map((bank) => (
              <option key={bank._id} value={bank._id}>
                {bank.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Bank account"
          htmlFor="sub-parent"
          required
          error={errors.accountId}
        >
          <Select
            id="sub-parent"
            value={form.accountId}
            onChange={(event) => setField("accountId", event.target.value)}
          >
            <option value="">Select account…</option>
            {bankAccounts.map((item) => (
              <option key={item._id} value={item._id}>
                {item.accountNo} — {item.accountName}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Account no" htmlFor="sub-account-no" required error={errors.accountNo}>
          <Input
            id="sub-account-no"
            mono
            value={form.accountNo}
            onChange={(event) => setField("accountNo", event.target.value)}
            placeholder="e.g. 15001000005"
          />
        </Field>

        <Field label="Label" htmlFor="sub-label">
          <Input
            id="sub-label"
            value={form.label}
            onChange={(event) => setField("label", event.target.value)}
            placeholder="e.g. 1st DPS"
          />
        </Field>

        <Field label="Status" htmlFor="sub-status">
          <Select
            id="sub-status"
            value={form.status}
            onChange={(event) => setField("status", event.target.value)}
          >
            {Object.entries(ACCOUNT_STATUS).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Rate (%)" htmlFor="sub-rate">
          <Input
            id="sub-rate"
            type="number"
            step="0.01"
            value={form.rate}
            onChange={(event) => setField("rate", event.target.value)}
            placeholder="9.5"
          />
        </Field>

        <Field label="Open date" htmlFor="sub-open">
          <Input
            id="sub-open"
            type="date"
            value={form.openDate}
            onChange={(event) => setField("openDate", event.target.value)}
          />
        </Field>

        <Field label="Close date" htmlFor="sub-close">
          <Input
            id="sub-close"
            type="date"
            value={form.closeDate || ""}
            onChange={(event) => setField("closeDate", event.target.value)}
          />
        </Field>

        <Field label="Total interest" htmlFor="sub-total-interest">
          <Input
            id="sub-total-interest"
            type="number"
            step="0.01"
            value={form.totalInterest}
            onChange={(event) => setField("totalInterest", event.target.value)}
            placeholder="0.00"
          />
        </Field>

        {isDps ? (
          <>
            <Field
              label="Installment amount"
              htmlFor="sub-installment-amount"
              required
              error={errors.installmentAmount}
            >
              <Input
                id="sub-installment-amount"
                type="number"
                step="0.01"
                value={form.installmentAmount}
                onChange={(event) => setField("installmentAmount", event.target.value)}
                placeholder="5000"
              />
            </Field>

            <Field
              label="No. of installments"
              htmlFor="sub-installments-total"
              required
              error={errors.installmentsTotal}
            >
              <Input
                id="sub-installments-total"
                type="number"
                value={form.installmentsTotal}
                onChange={(event) => setField("installmentsTotal", event.target.value)}
                placeholder="60"
              />
            </Field>

            <Field label="Installments paid" htmlFor="sub-installments-paid">
              <Input
                id="sub-installments-paid"
                type="number"
                value={form.installmentsPaid}
                onChange={(event) => setField("installmentsPaid", event.target.value)}
                placeholder="2"
              />
            </Field>

            <Field label="Installment day" htmlFor="sub-installment-day">
              <Input
                id="sub-installment-day"
                type="number"
                min="1"
                max="28"
                value={form.installmentDay}
                onChange={(event) => setField("installmentDay", event.target.value)}
                placeholder="5"
              />
            </Field>

            <Field label="Interest earned" htmlFor="sub-interest-earned">
              <Input
                id="sub-interest-earned"
                type="number"
                step="0.01"
                value={form.interestEarned}
                onChange={(event) => setField("interestEarned", event.target.value)}
                placeholder="950"
              />
            </Field>

            <Field label="Last installment date" htmlFor="sub-last-installment">
              <Input
                id="sub-last-installment"
                type="date"
                value={form.lastInstallmentDate || ""}
                onChange={(event) => setField("lastInstallmentDate", event.target.value)}
              />
            </Field>

            <Field label="Next installment date" htmlFor="sub-next-installment">
              <Input
                id="sub-next-installment"
                type="date"
                value={form.nextInstallmentDate || ""}
                onChange={(event) => setField("nextInstallmentDate", event.target.value)}
              />
            </Field>
          </>
        ) : isFd ? (
          <>
            <Field
              label="Principal"
              htmlFor="sub-principal"
              required
              error={errors.principal}
            >
              <Input
                id="sub-principal"
                type="number"
                step="0.01"
                value={form.principal}
                onChange={(event) => setField("principal", event.target.value)}
                placeholder="100000"
              />
            </Field>

            <Field label="Interest payment type" htmlFor="sub-interest-type">
              <Select
                id="sub-interest-type"
                value={form.interestPaymentType}
                onChange={(event) =>
                  setField("interestPaymentType", event.target.value)
                }
              >
                {INTEREST_PAYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Next interest payment" htmlFor="sub-next-interest">
              <Input
                id="sub-next-interest"
                type="date"
                value={form.nextInterestPaymentDate || ""}
                onChange={(event) =>
                  setField("nextInterestPaymentDate", event.target.value)
                }
              />
            </Field>
          </>
        ) : null}

        <Field label="Notes" htmlFor="sub-notes" full>
          <Textarea
            id="sub-notes"
            rows={2}
            value={form.notes}
            onChange={(event) => setField("notes", event.target.value)}
            placeholder="Optional notes…"
          />
        </Field>

        <div className="form-summary field--full">
          {isDps ? (
            <>
              <span>
                Total payable:{" "}
                <strong>{formatMoney(installmentAmount * installmentsTotal)}</strong>
              </span>
              <span>
                Paid:{" "}
                <strong>{formatMoney(installmentAmount * installmentsPaid)}</strong>
              </span>
            </>
          ) : (
            <span>
              Maturity value:{" "}
              <strong>{formatMoney(principal + totalInterest)}</strong>
            </span>
          )}
        </div>
      </form>
    </Modal>
  );
}
