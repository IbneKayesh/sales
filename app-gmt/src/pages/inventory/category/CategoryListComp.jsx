import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";

const CategoryListComp = ({ dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  const onExportCSV = () => {
    dt.current.exportCSV();
  };
  const itcg_name_BT = (rowData) => {
    return <ActiveRowCell text={rowData.itcg_name} status={rowData.lfcl_id} />;
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
          icon="pi pi-pencil"
          size="small"
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
          onClick={() => onEdit(rowData)}
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
        <Column field="itcg_name" header="Name" sortable body={itcg_name_BT} />
        <Column field="itcg_code" header="Code" sortable />
        <Column field="aemp_iusr" header="User" body={aemp_iusr_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};
export default CategoryListComp;
