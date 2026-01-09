import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { paymentModeOptions } from "@/utils/vtable";
import { useContacts } from "@/hooks/crm/useContacts";
import { useBusiness } from "@/hooks/auth/useBusiness";
import { useAccountsHeads } from "@/hooks/accounts/useAccountsHeads";
import { useAccounts } from "@/hooks/accounts/useAccounts";

const LedgerFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  //options
  selectedHead,
  setSelectedHead,
}) => {
  const { businessListDdl, fetchBusinessListDdl } = useBusiness();
  const { headListDdl, fetchHeadListDdl } = useAccountsHeads();
  const { contactListDdl, fetchContactListDdl } = useContacts();
  const { accountsListDdl, fetchAccountsListDdl } = useAccounts();

  useEffect(() => {
    fetchBusinessListDdl();
    fetchHeadListDdl();
    fetchAccountsListDdl();
  }, []);

  useEffect(() => {
    //contacts
    if (selectedHead) {
      fetchContactListDdl(selectedHead.trhed_cntyp);
    }
  }, [selectedHead]);

  const handleChange = (name, value) => {
    onChange(name, value);
    const selectedHead = headListDdl?.find((f) => f.id === value);
    console.log("selectedHead: ", selectedHead);
    setSelectedHead(selectedHead || null);
  };

  return (
    <>
      {/* {JSON.stringify(selectedHead)} */}
      <div className="grid">
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_bsins"
            className="block text-900 font-medium mb-2"
          >
            Business
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="ledgr_bsins"
            value={formData.ledgr_bsins}
            options={businessListDdl}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("ledgr_bsins", e.value)}
            className={`w-full ${errors.ledgr_bsins ? "p-invalid" : ""}`}
            placeholder={`Select Business`}
            filter
            showClear
          />
          {errors.ledgr_bsins && (
            <small className="mb-3 text-red-500">{errors.ledgr_bsins}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_trhed"
            className="block text-900 font-medium mb-2"
          >
            Head
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="ledgr_trhed"
            value={formData.ledgr_trhed}
            options={headListDdl.map((item) => ({
              value: item.id,
              label: item.trhed_hednm + ", " + item.trhed_cntyp,
            }))}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => handleChange("ledgr_trhed", e.value)}
            className={`w-full ${errors.ledgr_trhed ? "p-invalid" : ""}`}
            placeholder={`Select Head`}
            filter
            showClear
          />
          {errors.ledgr_trhed && (
            <small className="mb-3 text-red-500">{errors.ledgr_trhed}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="ledgr_cntct"
            className="block text-900 font-medium mb-2"
          >
            Contact
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="ledgr_cntct"
            value={formData.ledgr_cntct}
            options={contactListDdl.map((item) => ({
              label: item.cntct_cntnm,
              value: item.id,
            }))}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("ledgr_cntct", e.value)}
            className={`w-full ${errors.ledgr_cntct ? "p-invalid" : ""}`}
            placeholder={`Select Contact`}
            filter
            showClear
          />
          {errors.ledgr_cntct && (
            <small className="mb-3 text-red-500">{errors.ledgr_cntct}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_bacts"
            className="block text-900 font-medium mb-2"
          >
            Account
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="ledgr_bacts"
            value={formData.ledgr_bacts}
            options={accountsListDdl}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("ledgr_bacts", e.value)}
            className={`w-full ${errors.ledgr_bacts ? "p-invalid" : ""}`}
            placeholder={`Select Account`}
            filter
            showClear
          />
          {errors.ledgr_bacts && (
            <small className="mb-3 text-red-500">{errors.ledgr_bacts}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_pymod"
            className="block text-900 font-medium mb-2"
          >
            Mode
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="ledgr_pymod"
            value={formData.ledgr_pymod}
            options={paymentModeOptions}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("ledgr_pymod", e.value)}
            className={`w-full ${errors.ledgr_pymod ? "p-invalid" : ""}`}
            placeholder={`Select Mode`}
            filter
            showClear
          />
          {errors.ledgr_pymod && (
            <small className="mb-3 text-red-500">{errors.ledgr_pymod}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_trdat"
            className="block text-900 font-medium mb-2"
          >
            Ledger Date <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="ledgr_trdat"
            value={formData.ledgr_trdat ? new Date(formData.ledgr_trdat) : null}
            onChange={(e) =>
              onChange(
                "ledgr_trdat",
                e.value ? e.value.toISOString().split("T")[0] : ""
              )
            }
            className={`w-full ${errors.ledgr_trdat ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select Ledger Date`}
          />
          {errors.ledgr_trdat && (
            <small className="mb-3 text-red-500">{errors.ledgr_trdat}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="ledgr_refno"
            className="block text-900 font-medium mb-2"
          >
            Ledger Ref
          </label>
          <InputText
            name="ledgr_refno"
            value={formData.ledgr_refno}
            onChange={(e) => onChange("ledgr_refno", e.target.value)}
            className={`w-full ${errors.ledgr_refno ? "p-invalid" : ""}`}
            placeholder={`Enter Ledger Ref`}
          />
          {errors.ledgr_refno && (
            <small className="mb-3 text-red-500">{errors.ledgr_refno}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="ledgr_notes"
            className="block text-900 font-medium mb-2"
          >
            Note
          </label>
          <InputText
            name="ledgr_notes"
            value={formData.ledgr_notes}
            onChange={(e) => onChange("ledgr_notes", e.target.value)}
            className={`w-full ${errors.ledgr_notes ? "p-invalid" : ""}`}
            placeholder={`Enter Note`}
          />
          {errors.ledgr_notes && (
            <small className="mb-3 text-red-500">{errors.ledgr_notes}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_dbamt"
            className="block text-900 font-medium mb-2"
          >
            Amount <span className="text-red-500">*</span>
          </label>
          <InputNumber
            name="ledgr_dbamt"
            value={formData.ledgr_dbamt}
            onValueChange={(e) => onChange("ledgr_dbamt", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`${errors.ledgr_dbamt ? "p-invalid" : ""}`}
            style={{ width: "100%" }}
            inputStyle={{ width: "100%" }}
          />
          {errors.ledgr_dbamt && (
            <small className="mb-3 text-red-500">{errors.ledgr_dbamt}</small>
          )}
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
        />
      </div>
    </>
  );
};

export default LedgerFormComp;
