import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SplitButton } from "primereact/splitbutton";
import RequiredText from "@/components/RequiredText";

const ContactsAddressComp = ({
  formData,
  errors,
  onChange,
  onSaveClick,
  dataList,
  onEdit,
  onDelete,
}) => {
  const action_BT = (rowData) => {
    let menuItems = [
      {
        label: rowData.cntad_actve ? "Deactivate" : "Activate",
        icon: `pi ${
          rowData.cntad_actve
            ? "pi-trash text-red-400"
            : "pi-check-circle text-green-400"
        }`,
        command: () => onDelete(rowData),
      },
    ];
    return (
      <div className="flex flex-wrap gap-2">
        <SplitButton
          icon="pi pi-pencil"
          size="small"
          tooltip="Edit"
          severity="secondary"
          outlined
          tooltipOptions={{ position: "left" }}
          onClick={() => onEdit(rowData)}
          model={menuItems}
        />
      </div>
    );
  };

  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2">Person Name</label>
          <InputText
            name="cntad_cntps"
            value={formData.cntad_cntps}
            onChange={(e) => onChange("cntad_cntps", e.target.value)}
            className={`w-full ${errors.cntad_cntps ? "p-invalid" : ""}`}
            placeholder="Enter person name"
          />
          <RequiredText text={errors.cntad_cntps} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2">Contact No</label>
          <InputText
            name="cntad_cntno"
            value={formData.cntad_cntno}
            onChange={(e) => onChange("cntad_cntno", e.target.value)}
            className={`w-full ${errors.cntad_cntno ? "p-invalid" : ""}`}
            placeholder="Enter contact no"
          />
          <RequiredText text={errors.cntad_cntno} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2">Email</label>
          <InputText
            name="cntad_email"
            value={formData.cntad_email}
            onChange={(e) => onChange("cntad_email", e.target.value)}
            className={`w-full ${errors.cntad_email ? "p-invalid" : ""}`}
            placeholder="Enter email"
          />
          <RequiredText text={errors.cntad_email} />
        </div>
        <div className="col-12 md:col-3">
          <label className="block font-bold mb-2">Office Address</label>
          <InputText
            name="cntad_ofadr"
            value={formData.cntad_ofadr}
            onChange={(e) => onChange("cntad_ofadr", e.target.value)}
            className={`w-full ${errors.cntad_ofadr ? "p-invalid" : ""}`}
            placeholder="Enter office address"
          />
          <RequiredText text={errors.cntad_ofadr} />
        </div>
        <div className="col-12 md:col-3">
          <label className="block font-bold mb-2">Google Maps</label>
          <InputText
            name="cntad_gmaps"
            value={formData.cntad_gmaps}
            onChange={(e) => onChange("cntad_gmaps", e.target.value)}
            className={`w-full ${errors.cntad_gmaps ? "p-invalid" : ""}`}
            placeholder="Enter maps link"
          />
          <RequiredText text={errors.cntad_gmaps} />
        </div>
        <div className="col-12 md:col-10">
          <label className="block font-bold mb-2">Notes</label>
          <InputText
            name="cntad_notes"
            value={formData.cntad_notes}
            onChange={(e) => onChange("cntad_notes", e.target.value)}
            className={`w-full ${errors.cntad_notes ? "p-invalid" : ""}`}
            placeholder="Enter notes"
          />
          <RequiredText text={errors.cntad_notes} />
        </div>
        <div className="col-12 md:col-2 flex align-items-end">
          <Button
            label={formData.id ? "Update" : "Add Address"}
            icon="pi pi-plus"
            className="w-full"
            onClick={onSaveClick}
          />
        </div>
      </div>
      <div className="mt-4">
        <DataTable
          value={dataList}
          emptyMessage="No addresses found."
          size="small"
          rowHover
          showGridlines
        >
          <Column
            header="Sl"
            body={(rowData, options) => options.rowIndex + 1}
          />
          <Column field="cntad_cntps" header="Person" />
          <Column field="cntad_cntno" header="Contact No" />
          <Column field="cntad_email" header="Email" />
          <Column field="cntad_ofadr" header="Office Address" />
          <Column field="cntad_notes" header="Notes" />
          <Column field="cntad_gmaps" header="Google Maps" />
          <Column header={dataList?.length + " rows"} body={action_BT} />
        </DataTable>
      </div>
    </>
  );
};
export default ContactsAddressComp;
