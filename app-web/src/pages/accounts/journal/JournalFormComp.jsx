import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { TreeSelect } from "primereact/treeselect";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";
import EmptyState from "@/components/EmptyState";

const JournalFormComp = ({
  formData,
  errors,
  onChange,
  mjrnl_dpart_Options,
  mjrnl_crncy_Options,
  mjrnl_fsyar_Options,
  mjrnl_acprd_Options,
  mjrnl_trtyp_Options,
  djrnl_chtac_Options,
  djrnl_party_Options,
  onChangeItems,
  onAddToListClick,
  formDataItems,
  dataListItems,
  onRemoveItemsClick,
}) => {
  const action_BT = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-trash"
          size="small"
          severity="danger"
          onClick={() => onRemoveItemsClick(rowData)}
          disabled={formData.id}
        />
      </div>
    );
  };

  return (
    <>
      <div className="grid">
        {/* {JSON.stringify(mjrnl_acprd_Options)} */}
        <div className="col-12 md:col-3">
          <label className="block font-bold mb-2 text-red-800">C/C</label>
          <Dropdown
            name="mjrnl_dpart"
            value={formData.mjrnl_dpart}
            onChange={(e) => onChange("mjrnl_dpart", e.value)}
            options={mjrnl_dpart_Options}
            optionLabel="dpart_dname"
            optionValue="id"
            className={`w-full ${errors.mjrnl_dpart ? "p-invalid" : ""}`}
            size={"small"}
            placeholder={`Enter C/C`}
            filter
            showClear
          />
          <RequiredText text={errors.mjrnl_dpart} />
        </div>
        <div className="col-12 md:col-2 hidden">
          <label className="block font-bold mb-2 text-red-800">Currency</label>
          <Dropdown
            name="mjrnl_crncy"
            value={formData.mjrnl_crncy}
            onChange={(e) => onChange("mjrnl_crncy", e.value)}
            options={mjrnl_crncy_Options}
            optionLabel="label_text"
            optionValue="value_text"
            className={`w-full ${errors.mjrnl_crncy ? "p-invalid" : ""}`}
            size={"small"}
            placeholder={`Enter currency`}
            filter
            showClear
          />
          <RequiredText text={errors.mjrnl_crncy} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2 text-red-800">Type</label>
          <Dropdown
            name="mjrnl_trtyp"
            value={formData.mjrnl_trtyp}
            onChange={(e) => onChange("mjrnl_trtyp", e.value)}
            options={mjrnl_trtyp_Options}
            optionLabel="label"
            optionValue="value"
            className={`w-full ${errors.mjrnl_trtyp ? "p-invalid" : ""}`}
            size={"small"}
            placeholder={`Enter type`}
            filter
            showClear
          />
          <RequiredText text={errors.mjrnl_trtyp} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2 text-red-800">Trn No</label>
          <InputText
            name="mjrnl_trnno"
            value={formData.mjrnl_trnno}
            onChange={(e) => onChange("mjrnl_trnno", e.target.value)}
            className={`w-full ${errors.mjrnl_trnno ? "p-invalid" : ""}`}
            placeholder={`Enter trn no`}
            disabled={true}
            variant="filled"
          />
          <RequiredText text={errors.mjrnl_trnno} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2 text-red-800">Trn Date</label>
          <Calendar
            name="mjrnl_trdat"
            value={formData.mjrnl_trdat ? new Date(formData.mjrnl_trdat) : null}
            onChange={(e) =>
              onChange(
                "mjrnl_trdat",
                e.value ? e.value.toLocaleString().split("T")[0] : "",
              )
            }
            className={`w-full ${errors.mjrnl_trdat ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select trn date`}
            disabled={formData.id}
            variant={formData.id ? "filled" : ""}
          />
          <RequiredText text={errors.mjrnl_trdat} />
        </div>
        <div className="col-12 md:col-3">
          <label className="block font-bold mb-2 text-red-800">Ref No</label>
          <InputText
            name="mjrnl_refno"
            value={formData.mjrnl_refno}
            onChange={(e) => onChange("mjrnl_refno", e.target.value)}
            className={`w-full ${errors.mjrnl_refno ? "p-invalid" : ""}`}
            placeholder={`Enter ref no`}
          />
          <RequiredText text={errors.mjrnl_refno} />
        </div>
        <div className="col-12 md:col-6">
          <label className="block font-bold mb-2 text-red-800">Narration</label>
          <InputText
            name="mjrnl_narrt"
            value={formData.mjrnl_narrt}
            onChange={(e) => onChange("mjrnl_narrt", e.target.value)}
            className={`w-full ${errors.mjrnl_narrt ? "p-invalid" : ""}`}
            placeholder={`Enter narration`}
          />
          <RequiredText text={errors.mjrnl_narrt} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2 text-red-800">Debit</label>
          <InputText
            name="mjrnl_drval"
            value={formData.mjrnl_drval}
            onChange={(e) => onChange("mjrnl_drval", e.target.value)}
            className={`w-full ${errors.mjrnl_drval ? "p-invalid" : ""}`}
            placeholder={`Enter debit`}
            disabled={true}
            variant="filled"
          />
          <RequiredText text={errors.mjrnl_drval} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2 text-red-800">Credit</label>
          <InputText
            name="mjrnl_crval"
            value={formData.mjrnl_crval}
            onChange={(e) => onChange("mjrnl_crval", e.target.value)}
            className={`w-full ${errors.mjrnl_crval ? "p-invalid" : ""}`}
            placeholder={`Enter credit`}
            disabled={true}
            variant="filled"
          />
          <RequiredText text={errors.mjrnl_crval} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2 text-red-800">Status</label>
          <InputText
            name="mjrnl_stats"
            value={formData.mjrnl_stats}
            onChange={(e) => onChange("mjrnl_stats", e.target.value)}
            className={`w-full ${errors.mjrnl_stats ? "p-invalid" : ""}`}
            placeholder={`Enter status`}
            disabled={true}
            variant="filled"
          />
          <RequiredText text={errors.mjrnl_stats} />
        </div>
      </div>
      <div className="p-card p-3 mt-3">
        {!formData.id && (
          <div className="grid">
            <div className="col-12 md:col-4">
              <label className="block font-bold mb-2 text-red-800">COA</label>
              <TreeSelect
                value={formDataItems.djrnl_chtac}
                options={djrnl_chtac_Options}
                onChange={(e) => onChangeItems("djrnl_chtac", e.value)}
                placeholder="Select COA"
                className={`w-full ${errors.djrnl_chtac ? "p-invalid" : ""}`}
                size={"small"}
                filter
                showClear
              />
              <RequiredText text={errors.djrnl_chtac} />
            </div>
            <div className="col-12 md:col-4">
              <label className="block font-bold mb-2 text-red-800">Party Account</label>
              <Dropdown
                name="djrnl_party"
                value={formDataItems.djrnl_party}
                onChange={(e) => onChangeItems("djrnl_party", e.value)}
                options={djrnl_party_Options}
                optionLabel="label_text"
                optionValue="value_text"
                className={`w-full ${errors.djrnl_party ? "p-invalid" : ""}`}
                size={"small"}
                placeholder={`Enter party`}
                filter
                showClear
              />
              <RequiredText text={errors.djrnl_party} />
            </div>
            <div className="col-12 md:col-2">
              <label className="block font-bold mb-2 text-red-800">Debit</label>
              <InputText
                name="djrnl_drval"
                value={formDataItems.djrnl_drval}
                onChange={(e) => onChangeItems("djrnl_drval", e.target.value)}
                className={`w-full ${errors.djrnl_drval ? "p-invalid" : ""}`}
                placeholder={`Enter debit`}
              />
              <RequiredText text={errors.djrnl_drval} />
            </div>
            <div className="col-12 md:col-2">
              <label className="block font-bold mb-2 text-red-800">
                Credit
              </label>
              <InputText
                name="djrnl_crval"
                value={formDataItems.djrnl_crval}
                onChange={(e) => onChangeItems("djrnl_crval", e.target.value)}
                className={`w-full ${errors.djrnl_crval ? "p-invalid" : ""}`}
                placeholder={`Enter credit`}
              />
              <RequiredText text={errors.djrnl_crval} />
            </div>
            <div className="col-12 md:col-10">
              <label className="block font-bold mb-2 text-red-800">
                Description
              </label>
              <InputText
                name="djrnl_descr"
                value={formDataItems.djrnl_descr}
                onChange={(e) => onChangeItems("djrnl_descr", e.target.value)}
                className={`w-full ${errors.djrnl_descr ? "p-invalid" : ""}`}
                placeholder={`Enter description`}
              />
              <RequiredText text={errors.djrnl_descr} />
            </div>
            <div className="col-12 md:col-2">
              <Button
                label="Add to List"
                icon="pi pi-plus"
                size="small"
                severity="secondary"
                className="mt-4"
                onClick={() => onAddToListClick()}
              />
            </div>
          </div>
        )}
        <div className="grid mt-3">
          <div className="col-12">
            {dataListItems.length > 0 ? (
              <DataTable
                value={dataListItems}
                emptyMessage="No data found."
                size="small"
                rowHover
                showGridlines
              >
                <Column
                  header="Sl"
                  body={(rowData, options) => options.rowIndex + 1}
                />
                <Column field="chtac_cname" header="COA" />
                <Column field="party_pname" header="Party" />
                <Column field="djrnl_drval" header="Debit" />
                <Column field="djrnl_crval" header="Credit" />
                <Column field="djrnl_descr" header="Description" />
                <Column
                  header={dataListItems?.length + " rows"}
                  body={action_BT}
                />
              </DataTable>
            ) : (
              <EmptyState stateMessage={"No journal entries added yet!"} />
            )}
          </div>
        </div>
      </div>

      <div className="grid mt-2">
        {formData.id && (
          <AuditFields
            active={formData.mjrnl_actve}
            createdBy={formData.crusr_cname}
            createdAt={formData.mjrnl_crdat}
            updatedBy={formData.upusr_cname}
            updatedAt={formData.mjrnl_updat}
            revNo={formData.mjrnl_rvnmr}
          />
        )}
      </div>
    </>
  );
};
export default JournalFormComp;
