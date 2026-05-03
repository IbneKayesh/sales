import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import CSVExport from "@/components/CSVExport";

const DZoneListComp = ({ dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const export_columns = [
    { header: "Country", accessor: "dzone_cntry" },
    { header: "Code", accessor: "dzone_dcode" },
    { header: "Name", accessor: "dzone_dname" },
    { header: "Active", accessor: "dzone_actve" },
  ];

  const dzone_dname_BT = (rowData) => {
    return (
      <ActiveRowCell text={rowData.dzone_dname} status={rowData.dzone_actve} />
    );
  };

  const action_BT = (rowData) => {
    let menuItems = [
      {
        label: rowData.dzone_actve ? "Deactivate" : "Activate",
        icon: `pi ${
          rowData.dzone_actve
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

  const dt_HT = () => {
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
            <CSVExport
              data={dataList}
              fileName={`dzone-${new Date().toISOString().slice(0, 10)}`}
              columns={export_columns}
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
        globalFilterFields={[
          "dzone_cntry",
          "dzone_dcode",
          "dzone_dname",
          "dzone_actve",
        ]}
        header={dt_HT}
      >
        <Column header="Sl" body={(rowData, options) => options.rowIndex + 1} />
        <Column field="dzone_dcode" header="Code" sortable />
        <Column
          field="dzone_dname"
          header="Name"
          sortable
          body={dzone_dname_BT}
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};
export default DZoneListComp;
