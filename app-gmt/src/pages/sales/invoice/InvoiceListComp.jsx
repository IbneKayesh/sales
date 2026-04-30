import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";

const InvoiceListComp = ({ dataList, onView, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  const onExportCSV = () => {
    dt.current.exportCSV();
  };

  const dlvm_code_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-700 text-sm">
          Invoice: {rowData.dlvm_code}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Order: {rowData.ordm_ornm}
        </span>
      </div>
    );
  };

  const action_BT = (rowData) => {
    let menuItems = [
      {
        label: rowData.lfcl_id === 1 ? "Deactivate" : "Activate",
        icon: `pi ${
          rowData.lfcl_id === 1
            ? "pi-trash text-red-400"
            : "pi-check-circle text-green-400"
        }`,
        command: () => onDelete(rowData),
      },
    ];
    return (
      <div className="flex flex-wrap gap-2">
        <SplitButton
          icon="pi pi-eye"
          size="small"
          tooltip="View"
          tooltipOptions={{ position: "top" }}
          onClick={() => onView(rowData)}
          model={menuItems}
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
        <Column
          field="dlvm_code"
          header="Invoice/Order No"
          sortable
          body={dlvm_code_BT}
        />
        <Column field="dlvm_date" header="Order Date" sortable />
        <Column field="aemp_name" header="SR" sortable />
        <Column field="site_name" header="Outlet" sortable />
        <Column field="aemp_iusr" header="Created By" sortable />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};
export default InvoiceListComp;
