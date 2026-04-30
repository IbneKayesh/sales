import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";

const InvoiceViewComp = ({
  formData,
  formDataList,
  showDialog,
  onCloseClick,
}) => {
  const rowData = formData;
  const dataList = formDataList;
  return (
    <Dialog
      visible={showDialog}
      onHide={onCloseClick}
      header={`Detail of - ${rowData.ordm_ornm}`}
      style={{ width: "50%" }}
      modal
    >
      {/* {JSON.stringify(dataList)} */}
      <div className="grid">
        <div className="col-12 md:col-6">
          <label className="block font-bold mb-2">Order No</label>
          <InputText
            name="ctrn_date"
            value={rowData.ordm_ornm}
            className={`w-full`}
            disabled={true}
            variant="filled"
          />
        </div>
        <div className="col-12 md:col-6">
          <label className="block font-bold mb-2">Date</label>
          <InputText
            name="dlvm_date"
            value={rowData.dlvm_date}
            className={`w-full`}
            disabled={true}
            variant="filled"
          />
        </div>
        <div className="col-12 md:col-6">
          <label className="block font-bold mb-2">Depot</label>
          <InputText
            name="dlrm_name"
            value={rowData.dlrm_name}
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
          <label className="block font-bold mb-2">SR / Route</label>
          <InputText
            name="aemp_name"
            value={rowData.aemp_name}
            className={`w-full`}
            disabled={true}
            variant="filled"
          />
        </div>
        <div className="col-12 md:col-6">
          <label className="block font-bold mb-2">Amount</label>
          <InputText
            name="123"
            value={rowData.clmt_name || 0}
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
            <Column field="amim_code" header="Code" />
            <Column field="amim_name" header="Name" />
            <Column field="dlvd_qnty" header="Qty" />
            <Column field="price" header="Price" />
            <Column field="dlvd_uprc" header="Amount" />
          </DataTable>
        </div>
      </div>
    </Dialog>
  );
};
export default InvoiceViewComp;
