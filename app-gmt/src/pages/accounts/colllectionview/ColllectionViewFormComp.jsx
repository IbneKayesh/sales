import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";

const ColllectionViewFormComp = ({ formData, showDialog, onCloseClick }) => {
  const rowData = formData.formData;
  const dataList = formData.formList;

  const drAmt = dataList.reduce((sum, item) => sum + (item.add_debit || 0), 0);
  const crAmt = dataList.reduce((sum, item) => sum + (item.add_credit || 0), 0);

  const ttAmt = Number(drAmt - crAmt).toFixed(3);
  return (
    <Dialog
      visible={showDialog}
      onHide={onCloseClick}
      header={`Detail of - ${rowData.ctrn_code}`}
      style={{ width: "50%" }}
      modal
    >
      <div className="grid">
        {/* {JSON.stringify(rowData)} */}
        <div className="col-12 md:col-6">
          <label className="block font-bold mb-2">Date</label>
          <InputText
            name="ctrn_date"
            value={rowData.ctrn_date}
            className={`w-full`}
            disabled={true}
            variant="filled"
          />
        </div>
        <div className="col-12 md:col-6">
          <label className="block font-bold mb-2">Note</label>
          <InputText
            name="ctrn_note"
            value={rowData.ctrn_note}
            className={`w-full`}
            disabled={true}
            variant="filled"
          />
        </div>
        <div className="col-12 md:col-6">
          <label className="block font-bold mb-2">Outlet</label>
          <InputText
            name="site_name"
            value={rowData.site_name}
            className={`w-full`}
            disabled={true}
            variant="filled"
          />
        </div>
        <div className="col-12 md:col-6">
          <label className="block font-bold mb-2">Type</label>
          <InputText
            name="role_name"
            value={rowData.clpt_name}
            className={`w-full`}
            disabled={true}
            variant="filled"
          />
        </div>
        <div className="col-12 md:col-6">
          <label className="block font-bold mb-2">Amount</label>
          <InputText
            name="role_name"
            value={rowData.ctrn_amnt}
            className={`w-full`}
            disabled={true}
            variant="filled"
          />
        </div>
        <div className="col-12 md:col-6">
          <label className="block font-bold mb-2">Matching</label>
          <InputText
            name="role_name"
            value={rowData.clmt_name}
            className={`w-full`}
            disabled={true}
            variant="filled"
          />
        </div>
        <div className="col-12 md:col-12">
          <label className="block font-bold mb-2">Bank</label>
          <InputText
            name="role_name"
            value={rowData.bank_name}
            className={`w-full`}
            disabled={true}
            variant="filled"
          />
        </div>
        <div className="col-12">
          <DataTable
            value={dataList}
            emptyMessage="No data found."
            size="small"
            rowHover
            showGridlines
          >
            <Column field="atrn_note" header="Code" />
            <Column
              field="atrn_date"
              header="Date"
              footer={`Total: ` + ttAmt}
            />
            <Column field="add_debit" header="Invoice" footer={drAmt} />
            <Column field="add_credit" header="Return" footer={crAmt} />
          </DataTable>
        </div>
      </div>
    </Dialog>
  );
};
export default ColllectionViewFormComp;
