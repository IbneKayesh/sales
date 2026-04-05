import { Dropdown } from "primereact/dropdown";
import RequiredText from "@/components/RequiredText";
import { pyadv_srcnmOptions, paymentModeOptions } from "@/utils/vtable";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate, formatDateTime } from "@/utils/datetime";
import { useAccountsHeadsSgd } from "@/hooks/accounts/useAccountsHeadsSgd";
import { useEffect, useState, useMemo } from "react";
import { useAccountsSgd } from "@/hooks/accounts/useAccountsSgd";
import { InputText } from "primereact/inputtext";

const AdviceEntryComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onFindAdvice,
  dataList,
  dataListSelected,
  onAddPaymentAdvice,
  onRemovePaymentAdvice,
  onSave,
}) => {
  const { dataList: ledgr_trhedOptions, handleGetAllAdviceHeads } =
    useAccountsHeadsSgd();
  const { dataList: ledgr_bactsOptions, handleGetAllActiveAccounts } =
    useAccountsSgd();
  const [ledgr_cntctOptions, setLedgr_cntctOptions] = useState([]);
  const [filteredDataList, setFilteredDataList] = useState([]);

  useEffect(() => {
    handleGetAllAdviceHeads();
    handleGetAllActiveAccounts();
  }, []);

  useEffect(() => {
    const uniqueMap = new Map();

    dataListSelected.forEach((item) => {
      if (!uniqueMap.has(item.cntct_cntnm)) {
        uniqueMap.set(item.cntct_cntnm, {
          label: item.cntct_cntnm,
          value: item.payad_cntct,
        });
      }
    });

    setLedgr_cntctOptions(Array.from(uniqueMap.values()));
  }, [dataListSelected]);

  // useEffect(() => {
  //   const uniqueContact = dataListSelected.map((item) => {
  //     return { label: item.cntct_cntnm, value: item.payad_cntct };
  //   });
  //   setLedgr_cntctOptions(uniqueContact);
  // }, [dataListSelected]);

  useEffect(() => {
    const ledgr_dbamt_val = dataListSelected.reduce(
      (acc, item) => acc + (Number(item.payad_rfamt) || 0),
      0,
    );
    onChange("ledgr_dbamt", ledgr_dbamt_val);

    const ledgr_refno_val = dataListSelected
      .map((item) => item.payad_refno)
      .filter(Boolean) // removes null/undefined/empty
      .join(", ");

    onChange("ledgr_refno", ledgr_refno_val);
  }, [dataListSelected]);

  useEffect(() => {
    const filtered = dataList.filter((item) => {
      const isNotSelected = !dataListSelected.some(
        (selectedItem) => selectedItem.payad_refid === item.payad_refid,
      );
      return isNotSelected;
    });
    setFilteredDataList(filtered);
  }, [dataList, dataListSelected]);

  //selected
  const action_BT_Sel = (rowData) => {
    return (
      <Button
        type="button"
        label={"Remove from List"}
        icon={"pi pi-minus"}
        severity="danger"
        size="small"
        onClick={() => onRemovePaymentAdvice(rowData)}
      />
    );
  };

  const payad_srcnm_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="font-md">{rowData.cntct_cntnm}</span>
        <span className="font-bold text-blue-700">{rowData.payad_srcnm}</span>
      </div>
    );
  };

  const payad_trdat_BT = (rowData) => {
    return formatDate(rowData.payad_trdat);
  };

  const action_BT = (rowData) => {
    return (
      <Button
        type="button"
        label={"Add to List"}
        icon={"pi pi-plus"}
        severity="success"
        size="small"
        onClick={() => onAddPaymentAdvice(rowData)}
      />
    );
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
            htmlFor="ledgr_trhed"
            className="block font-bold mb-2 text-red-800"
          >
            Head
          </label>
          <Dropdown
            name="ledgr_trhed"
            value={formData.ledgr_trhed}
            options={ledgr_trhedOptions}
            optionLabel="trhed_hednm"
            optionValue="id"
            onChange={(e) => onChange("ledgr_trhed", e.value)}
            className={`w-full ${errors.ledgr_trhed ? "p-invalid" : ""}`}
            placeholder={`Enter head`}
            filter
            showClear
            itemTemplate={ledgr_trhed_IT}
            valueTemplate={ledgr_trhed_VT}
            disabled={dataListSelected.length > 0}
          />
          <RequiredText text={errors.ledgr_trhed} />
        </div>
        <div
          className={`col-12 md:col-4 ${dataListSelected.length === 0 && "hidden"}`}
        >
          <label
            htmlFor="ledgr_cntct"
            className="block font-bold mb-2 text-red-800"
          >
            Contact
          </label>
          <Dropdown
            name="ledgr_cntct"
            value={formData.ledgr_cntct}
            onChange={(e) => onChange("ledgr_cntct", e.value)}
            options={ledgr_cntctOptions}
            optionLabel="label"
            optionValue="value"
            className={`w-full ${errors.ledgr_cntct ? "p-invalid" : ""}`}
            placeholder={`Enter contact`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_cntct} />
        </div>
        <div
          className={`col-12 md:col-4 ${dataListSelected.length === 0 && "hidden"}`}
        >
          <label
            htmlFor="ledgr_bacts"
            className="block font-bold mb-2 text-red-800"
          >
            Accounts
          </label>
          <Dropdown
            name="ledgr_bacts"
            value={formData.ledgr_bacts}
            onChange={(e) => onChange("ledgr_bacts", e.value)}
            options={ledgr_bactsOptions}
            optionLabel="bacts_bankn"
            optionValue="id"
            className={`w-full ${errors.ledgr_bacts ? "p-invalid" : ""}`}
            placeholder={`Enter account`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_bacts} />
        </div>

        <div
          className={`col-12 md:col-2 ${dataListSelected.length === 0 && "hidden"}`}
        >
          <label
            htmlFor="ledgr_pymod"
            className="block font-bold mb-2 text-red-800"
          >
            Payment Mode
          </label>
          <Dropdown
            name="ledgr_pymod"
            value={formData.ledgr_pymod}
            options={paymentModeOptions}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("ledgr_pymod", e.value)}
            className={`w-full ${errors.ledgr_pymod ? "p-invalid" : ""}`}
            placeholder={`Select Payment mode`}
            filter
            showClear
          />
          <RequiredText text={errors.ledgr_pymod} />
        </div>

        <div
          className={`col-12 md:col-6 ${dataListSelected.length === 0 && "hidden"}`}
        >
          <label
            htmlFor="ledgr_refno"
            className="block font-bold mb-2 text-red-800"
          >
            Ref
          </label>
          <InputText
            name="ledgr_refno"
            value={formData.ledgr_refno}
            onChange={(e) => onChange("ledgr_refno", e.value)}
            className={`w-full ${errors.ledgr_refno ? "p-invalid" : ""}`}
            placeholder={`Enter ref`}
            disabled
          />
          <RequiredText text={errors.ledgr_refno} />
        </div>
        <div
          className={`col-12 md:col-2 ${dataListSelected.length === 0 && "hidden"}`}
        >
          <label
            htmlFor="ledgr_notes"
            className="block font-bold mb-2"
          >
            Notes
          </label>
          <InputText
            name="ledgr_notes"
            value={formData.ledgr_notes}
            onChange={(e) => onChange("ledgr_notes", e.target.value)}
            className={`w-full ${errors.ledgr_notes ? "p-invalid" : ""}`}
            placeholder={`Enter notes`}
          />
          <RequiredText text={errors.ledgr_notes} />
        </div>
        <div
          className={`col-12 md:col-2 ${dataListSelected.length === 0 && "hidden"}`}
        >
          <label
            htmlFor="ledgr_dbamt"
            className="block font-bold mb-2 text-red-800"
          >
            Amount
          </label>
          <InputText
            name="ledgr_dbamt"
            value={formData.ledgr_dbamt}
            //onChange={(e) => onChange("ledgr_dbamt", e.value)}
            className={`w-full ${errors.ledgr_dbamt ? "p-invalid" : ""}`}
            placeholder={`Enter amount`}
            disabled
          />
          <RequiredText text={errors.ledgr_dbamt} />
        </div>

        <div className="col-12 md:col-2 hidden">
          <label
            htmlFor="pyadv_srcnm"
            className="block font-bold mb-2 text-red-800"
          >
            Source
          </label>
          <Dropdown
            name="pyadv_srcnm"
            value={formData.pyadv_srcnm}
            options={pyadv_srcnmOptions}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("pyadv_srcnm", e.value)}
            className={`w-full ${errors.pyadv_srcnm ? "p-invalid" : ""}`}
            placeholder={`Select Source`}
            filter
            showClear
          />
          <RequiredText text={errors.pyadv_srcnm} />
        </div>
        <div className="col-12 md:col-2 justify-content-end align-items-end">
          <Button
            type="button"
            label={"Find"}
            icon={"pi pi-search"}
            severity="info"
            size="small"
            className={`mt-4 w-full ${dataListSelected.length > 0 ? "hidden" : ""}`}
            onClick={onFindAdvice}
          />
          <Button
            type="button"
            label={"Save"}
            icon={"pi pi-save"}
            severity="success"
            size="small"
            className={`mt-4 w-full ${dataListSelected.length > 0 ? "" : "hidden"}`}
            onClick={onSave}
          />
        </div>
      </div>
      <div className="p-1">
        {/* {dataList.length} {dataListSelected.length} */}
        <DataTable
          value={dataListSelected}
          emptyMessage="No data found."
          size="small"
          className={`${dataListSelected.length === 0 && "hidden"} mb-3`}
          rowHover
          showGridlines
        >
          <Column field="payad_srcnm" header="Source" body={payad_srcnm_BT} />
          <Column field="payad_trdat" header="Date" body={payad_trdat_BT} />
          <Column field="payad_rfamt" header="Amount" />
          <Column field="payad_refno" header="Ref No" />
          <Column field="payad_descr" header="Description" />
          <Column
            header={dataListSelected?.length + " rows"}
            body={action_BT_Sel}
          />
        </DataTable>

        <DataTable
          value={filteredDataList}
          paginator
          rows={50}
          rowsPerPageOptions={[50, 100, 200]}
          emptyMessage="No data found."
          size="small"
          className={`${filteredDataList.length === 0 && "hidden"} mb-3`}
          rowHover
          showGridlines
        >
          <Column field="payad_srcnm" header="Source" body={payad_srcnm_BT} />
          <Column field="payad_trdat" header="Date" body={payad_trdat_BT} />
          <Column field="payad_rfamt" header="Amount" />
          <Column field="payad_refno" header="Ref No" />
          <Column field="payad_descr" header="Description" />
          <Column
            header={filteredDataList?.length + " rows"}
            body={action_BT}
          />
        </DataTable>
      </div>
    </>
  );
};

export default AdviceEntryComp;
