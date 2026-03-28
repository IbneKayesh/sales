import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { paymentModeOptions } from "@/utils/vtable";
import { useAccountsSgd } from "@/hooks/accounts/useAccountsSgd";
import RequiredText from "@/components/RequiredText";
import { useContactsSgd } from "@/hooks/crm/useContactsSgd";

const TransferFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  const { dataList: ledgr_bactsOptions, handleGetAllActiveAccounts } =
    useAccountsSgd();
  const { dataList: ledgr_cntctOptions, handleGetContactsByType } =
    useContactsSgd();
  const [isSameAccount, setisSameAccount] = useState(false);

  useEffect(() => {
    handleGetAllActiveAccounts();
  }, []);

  useEffect(() => {
    handleGetContactsByType("Internal");
  }, []);

  useEffect(() => {
    if (
      formData.ledgr_bacts_from === formData.ledgr_bacts_to ||
      formData.ledgr_cntct_from !== formData.ledgr_cntct_to
    ) {
      setisSameAccount(true);
    } else {
      setisSameAccount(false);
    }
  }, [formData]);

  return (
    <>
      {/* {JSON.stringify(formData)} */}
      <div className="grid">
        <div className="col-12 md:col-3">
          <label
            htmlFor="ledgr_bacts_from"
            className="block font-bold mb-2 text-red-800"
          >
            From Account
          </label>
          <Dropdown
            name="ledgr_bacts_from"
            value={formData.ledgr_bacts_from}
            options={ledgr_bactsOptions}
            optionLabel="bacts_bankn"
            optionValue="id"
            onChange={(e) => onChange("ledgr_bacts_from", e.value)}
            className={`w-full ${errors.ledgr_bacts_from ? "p-invalid" : ""}`}
            placeholder={`Select From Account`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_bacts_from} />
        </div>
        <div className={`col-12 md:col-3`}>
          <label
            htmlFor="ledgr_cntct"
            className="block font-bold mb-2 text-red-800"
          >
            From Contact
          </label>
          <Dropdown
            name="ledgr_cntct_from"
            value={formData.ledgr_cntct_from}
            options={ledgr_cntctOptions}
            optionLabel="cntct_cntnm"
            optionValue="id"
            onChange={(e) => onChange("ledgr_cntct_from", e.value)}
            className={`w-full ${errors.ledgr_cntct_from ? "p-invalid" : ""}`}
            placeholder={`Select Contact`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_cntct_from} />
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_pymod_from"
            className="block font-bold mb-2 text-red-800"
          >
            From Mode
          </label>
          <Dropdown
            name="ledgr_pymod_from"
            value={formData.ledgr_pymod_from}
            options={paymentModeOptions}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("ledgr_pymod_from", e.value)}
            className={`w-full ${errors.ledgr_pymod_from ? "p-invalid" : ""}`}
            placeholder={`Select Mode`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_pymod_from} />
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="ledgr_refno_from"
            className="block font-bold mb-2 text-red-800"
          >
            From Ref
          </label>
          <InputText
            name="ledgr_refno_from"
            value={formData.ledgr_refno_from}
            onChange={(e) => onChange("ledgr_refno_from", e.target.value)}
            className={`w-full ${errors.ledgr_refno_from ? "p-invalid" : ""}`}
            placeholder={`Enter Ledger Ref`}
          />
          <RequiredText text={errors.ledgr_refno_from} />
        </div>

        <div className="col-12 md:col-3">
          <label
            htmlFor="ledgr_bacts_to"
            className="block font-bold mb-2 text-red-800"
          >
            To Account
          </label>
          <Dropdown
            name="ledgr_bacts_to"
            value={formData.ledgr_bacts_to}
            options={ledgr_bactsOptions}
            optionLabel="bacts_bankn"
            optionValue="id"
            onChange={(e) => onChange("ledgr_bacts_to", e.value)}
            className={`w-full ${errors.ledgr_bacts_to ? "p-invalid" : ""}`}
            placeholder={`Select To Account`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_bacts_to} />
        </div>
        <div className={`col-12 md:col-3`}>
          <label
            htmlFor="ledgr_cntct"
            className="block font-bold mb-2 text-red-800"
          >
            To Contact
          </label>
          <Dropdown
            name="ledgr_cntct_to"
            value={formData.ledgr_cntct_to}
            options={ledgr_cntctOptions}
            optionLabel="cntct_cntnm"
            optionValue="id"
            onChange={(e) => onChange("ledgr_cntct_to", e.value)}
            className={`w-full ${errors.ledgr_cntct_to ? "p-invalid" : ""}`}
            placeholder={`Select Contact`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_cntct_to} />
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_pymod_to"
            className="block font-bold mb-2 text-red-800"
          >
            To Mode
          </label>
          <Dropdown
            name="ledgr_pymod_to"
            value={formData.ledgr_pymod_to}
            options={paymentModeOptions}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("ledgr_pymod_to", e.value)}
            className={`w-full ${errors.ledgr_pymod_to ? "p-invalid" : ""}`}
            placeholder={`Select Mode`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_pymod_to} />
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="ledgr_refno_to"
            className="block font-bold mb-2 text-red-800"
          >
            To Ref
          </label>
          <InputText
            name="ledgr_refno_to"
            value={formData.ledgr_refno_to}
            onChange={(e) => onChange("ledgr_refno_to", e.target.value)}
            className={`w-full ${errors.ledgr_refno_to ? "p-invalid" : ""}`}
            placeholder={`Enter Ledger Ref`}
          />
          <RequiredText text={errors.ledgr_refno_to} />
        </div>

        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_trdat"
            className="block font-bold mb-2 text-red-800"
          >
            Ledger Date <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="ledgr_trdat"
            value={formData.ledgr_trdat ? new Date(formData.ledgr_trdat) : null}
            onChange={(e) =>
              onChange(
                "ledgr_trdat",
                e.value ? e.value.toISOString().split("T")[0] : "",
              )
            }
            className={`w-full ${errors.ledgr_trdat ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select Ledger Date`}
            variant="filled"
          />
          <RequiredText text={errors.ledgr_trdat} />
        </div>
        <div className="col-12 md:col-6">
          <label htmlFor="ledgr_notes" className="block font-bold mb-2">
            Note
          </label>
          <InputText
            name="ledgr_notes"
            value={formData.ledgr_notes}
            onChange={(e) => onChange("ledgr_notes", e.target.value)}
            className={`w-full ${errors.ledgr_notes ? "p-invalid" : ""}`}
            placeholder={`Enter Note`}
          />
          <RequiredText text={errors.ledgr_notes} />
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="ledgr_dbamt"
            className="block font-bold mb-2 text-red-800"
          >
            Amount <span className="text-red-500">*</span>
          </label>
          <InputNumber
            name="ledgr_dbamt"
            value={formData.ledgr_dbamt}
            onValueChange={(e) => onChange("ledgr_dbamt", e.value)}
            className={`${errors.ledgr_dbamt ? "p-invalid" : ""}`}
            style={{ width: "100%" }}
            inputStyle={{ width: "100%" }}
            minFractionDigits={2}
            maxFractionDigits={2}
          />
          <RequiredText text={errors.ledgr_dbamt} />
        </div>
      </div>

      <div className="flex justify-content-end">
        <Button
          type="button"
          label={formData.id ? "Update" : "Save"}
          icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
          severity="success"
          size="small"
          loading={isBusy}
          onClick={onSave}
          disabled={isSameAccount}
        />
      </div>
    </>
  );
};

export default TransferFormComp;
