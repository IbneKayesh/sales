import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";

const ColllectionViewListComp = ({ dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  const onExportCSV = () => {
    dt.current.exportCSV();
  };

  const clmt_name_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-700 text-sm">
          Matching: {rowData.clmt_name}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Status: {rowData.lfcl_name}
        </span>
      </div>
    );
  };

  const ctrn_chqn_BT= (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-700 text-sm">
          Cheque: {rowData.ctrn_chqn}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Bank: {rowData.bank_name}
        </span>
      </div>
    );
  };

  const aemp_iusr_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-700 text-sm">
          Created By: {rowData.aemp_iusr}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Modified By: {rowData.aemp_eusr}
        </span>
      </div>
    );
  };

  const action_BT = (rowData) => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="View"
          icon="pi pi-eye"
          size="small"
          onClick={() => onEdit(rowData)}
        />
      </div>
    );
  };

  const tableHeader = () => {
    return (
      <div className="flex flex-column md:flex-row align-items-center justify-content-between gap-3">
        <div className="p-inputgroup w-full md:w-25rem">
          <span className="p-inputgroup-addon bg-gray-100">
            <i className="pi pi-search"></i>
          </span>
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="p-inputtext-sm"
          />
        </div>

        <div className="flex flex-column md:flex-row align-items-center gap-2 w-full md:w-auto">
          <div className="card flex flex-wrap gap-2">
            <Button
              label="Export"
              icon="pi pi-file-excel"
              size="small"
              onClick={onExportCSV}
              disabled={!dataList.length > 0}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* {JSON.stringify(dataList)} */}
      <DataTable
        value={dataList}
        paginator
        rows={25}
        rowsPerPageOptions={[25, 50, 100, 200]}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
        globalFilter={globalFilter}
        header={tableHeader()}
        ref={dt}
        exportFilename={`export_${new Date().toISOString().slice(0, 10)}`}
      >
        <Column header="Sl" body={(rowData, options) => options.rowIndex + 1} />
        <Column field="id" header="Id" sortable />
        <Column field="site_name" header="Outlet" sortable />
        <Column field="ctrn_code" header="Code" sortable />
        <Column field="ctrn_date" header="Date" sortable />
        <Column field="ctrn_note" header="Note" sortable />
        <Column field="ctrn_amnt" header="Amount" sortable />
        <Column field="clpt_name" header="Type" sortable />
        <Column
          field="clmt_name"
          header="Matching/Status"
          body={clmt_name_BT}
        />
        <Column field="ctrn_chqn" header="Cheque/Bank" body={ctrn_chqn_BT} />
        <Column field="aemp_iusr" header="User" body={aemp_iusr_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};
export default ColllectionViewListComp;
