import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useContactsSgd } from "@/hooks/crm/useContactsSgd";
import { useBusinessSgd } from "@/hooks/setup/useBusinessSgd";
import { useAccountsHeadsSgd } from "@/hooks/accounts/useAccountsHeadsSgd";
import { useAccountsSgd } from "@/hooks/accounts/useAccountsSgd";
import RequiredText from "@/components/RequiredText";
import { pyadv_srcnmOptions, paymentModeOptions } from "@/utils/vtable";

const LedgerFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  //options
}) => {
  const { dataList: ledgr_bsinsOptions, handleGetAllActiveBusiness } =
    useBusinessSgd();
  const { dataList: ledgr_trhedOptions, handleGetAllActiveHeads } =
    useAccountsHeadsSgd();
  const { dataList: ledgr_cntctOptions, handleGetContactsByType } =
    useContactsSgd();
  const { dataList: ledgr_bactsOptions, handleGetAllActiveAccounts } =
    useAccountsSgd();

  const [selectedHead, setSelectedHead] = useState(null);
  useEffect(() => {
    handleGetAllActiveBusiness();
    handleGetAllActiveHeads();
    handleGetAllActiveAccounts();
  }, []);

  useEffect(() => {
    //contacts
    if (selectedHead) {
      handleGetContactsByType(selectedHead.trhed_cntyp);
    }
  }, [selectedHead]);

  const handleChange = (name, value) => {
    onChange(name, value);
    const selectedHead = ledgr_trhedOptions?.find((f) => f.id === value);
    //console.log("selectedHead: ", selectedHead);
    setSelectedHead(selectedHead || null);
  };

  const ledgr_trhed_IT = (option) => {
    return (
      <div className="flex flex-column">
        <div className="font-semibold">{option.trhed_hednm}</div>
        <div className="text-sm text-gray-600">
          {option.trhed_grpnm} of {option.trhed_cntyp} will
        </div>
        {option.trhed_grtyp === "In" ? (
          <span className="text-blue-500">Increase Balance</span>
        ) : (
          <span className="text-orange-500">Decrease Balance</span>
        )}
      </div>
    );
  };

  const ledgr_trhed_VT = (option) => {
    if (!option) {
      return "Select Head";
    }

    return (
      <div className="flex flex-column">
        <span className="font-semibold">
          {option.trhed_grtyp === "In" ? (
            <span className="text-blue-600">
              {option.trhed_hednm}, {option.trhed_cntyp}
            </span>
          ) : (
            <span className="text-orange-600">
              {option.trhed_hednm}, {option.trhed_cntyp}
            </span>
          )}
        </span>
      </div>
    );
  };

  return (
    <>
      {/* {JSON.stringify(formData)} */}
      <div className="grid">
        <div className="col-12 md:col-4">
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
            options={ledgr_bsinsOptions}
            optionLabel="bsins_bname"
            optionValue="id"
            onChange={(e) => onChange("ledgr_bsins", e.value)}
            className={`w-full ${errors.ledgr_bsins ? "p-invalid" : ""}`}
            placeholder={`Select Business`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_bsins} />
        </div>
        <div className="col-12 md:col-4">
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
            options={ledgr_trhedOptions}
            optionLabel="trhed_hednm"
            optionValue="id"
            onChange={(e) => handleChange("ledgr_trhed", e.value)}
            className={`w-full ${errors.minvc_cntct ? "p-invalid" : ""}`}
            placeholder={`Select head`}
            filter
            showClear
            itemTemplate={ledgr_trhed_IT}
            valueTemplate={ledgr_trhed_VT}
          />
          <RequiredText text={errors.ledgr_trhed} />
        </div>
        <div className="col-12 md:col-4">
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
            options={ledgr_cntctOptions}
            optionLabel="cntct_cntnm"
            optionValue="id"
            onChange={(e) => onChange("ledgr_cntct", e.value)}
            className={`w-full ${errors.ledgr_cntct ? "p-invalid" : ""}`}
            placeholder={`Select Contact`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_cntct} />
        </div>
        <div className="col-12 md:col-4">
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
            options={ledgr_bactsOptions}
            optionLabel="bacts_bankn"
            optionValue="id"
            onChange={(e) => onChange("ledgr_bacts", e.value)}
            className={`w-full ${errors.ledgr_bacts ? "p-invalid" : ""}`}
            placeholder={`Select Account`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_bacts} />
        </div>
        <div className="col-12 md:col-3">
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
          <RequiredText text={errors.ledgr_pymod} />
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
                e.value ? e.value.toISOString().split("T")[0] : "",
              )
            }
            className={`w-full ${errors.ledgr_trdat ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select Ledger Date`}
          />
          <RequiredText text={errors.ledgr_trdat} />
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
          <RequiredText text={errors.ledgr_refno} />
        </div>
        <div className="col-12 md:col-8">
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
          <RequiredText text={errors.ledgr_notes} />
        </div>
        <div className="col-12 md:col-4">
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
          <RequiredText text={errors.ledgr_dbamt} />
        </div>
      </div>

      <div className="flex justify-content-end">
        <Button
          type="button"
          label={formData.id ? "Update" : "Save"}
          icon="pi pi-check"
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
