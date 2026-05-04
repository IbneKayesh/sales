import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import CSVExport from "@/components/CSVExport";

const UsersListComp = ({ pageAuth, dataList, onEdit, onDelete, onMenuPermission}) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const export_columns = [
    { header: "Email", accessor: "users_email" },
    { header: "Name", accessor: "users_uname" },
    { header: "Contact", accessor: "users_cntct" },
    { header: "Status", accessor: "users_stats" },
    { header: "Reg No", accessor: "users_regno" },
    { header: "Reg Date", accessor: "users_regdt" },
    { header: "Last Login", accessor: "users_lstgn" },
    { header: "Last Password Change", accessor: "users_lstpd" },
    { header: "Notes", accessor: "users_notes" },
    { header: "No Of Credits", accessor: "users_nofcr" },
    { header: "Is Primary", accessor: "users_isprm" },
    { header: "Is Primary", accessor: "users_apink" },
    { header: "Master User", accessor: "users_apusr" },
    { header: "Role", accessor: "users_urole" },
    { header: "Business", accessor: "users_bsins" },
    { header: "Employee", accessor: "users_emply" },
    { header: "Active", accessor: "users_actve" },
  ];

  const users_uname_BT = (rowData) => {
    return (
      <ActiveRowCell text={rowData.users_uname} status={rowData.users_actve} />
    );
  };

  const users_stats_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-700 text-sm">
          Status: {rowData.users_stats}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Reg No: {rowData.users_regno}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Reg Date: {rowData.users_regdt}
        </span>
      </div>
    );
  };

  const users_ltokn_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-700 text-sm">
          Token: {rowData.users_ltokn}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Last Login: {rowData.users_lstgn}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Last Password Change: {rowData.users_lstpd}
        </span>
      </div>
    );
  };

  const users_notes_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-700 text-sm">
          Notes: {rowData.users_notes}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          No Of Credit: {rowData.users_nofcr}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Is Primary: {rowData.users_isprm ? "Primary" : "Secondary"}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          API Link: {rowData.users_apink}
        </span>
      </div>
    );
  };

  const users_apusr_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-700 text-sm mt-1">
          Role: {rowData.users_urole}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Business: {rowData.users_bsins}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Employee: {rowData.users_emply}
        </span>
      </div>
    );
  };

  const action_BT = (rowData) => {
    let menuItems = [
      {
        label: "Menu",
        icon: `pi pi-list`,
        command: () => onMenuPermission(rowData),
      },
      {
        label: rowData.users_actve ? "Deactivate" : "Activate",
        icon: `pi ${
          rowData.users_actve
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
            placeholder="Search here"
            className="p-inputtext-sm"
          />
        </div>

        <div className="flex flex-wrap align-items-center gap-2 w-full md:w-auto">
          <CSVExport
            data={dataList}
            fileName={`dzone-${new Date().toISOString().slice(0, 10)}`}
            columns={export_columns}
            disable={pageAuth.extpr}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
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
        globalFilterFields={export_columns.map((col) => col.accessor)}
        header={dt_HT}
      >
        <Column header="Sl" body={(rowData, options) => options.rowIndex + 1} />
        <Column field="users_email" header="Code" sortable />
        <Column
          field="users_uname"
          header="Name"
          body={users_uname_BT}
          sortable
        />
        <Column field="users_cntct" header="Contact" sortable />
        <Column
          field="users_stats"
          header="Status"
          body={users_stats_BT}
          sortable
        />
        <Column
          field="users_ltokn"
          header="Token"
          body={users_ltokn_BT}
          sortable
        />
        <Column
          field="users_notes"
          header="Notes"
          body={users_notes_BT}
          sortable
        />
        <Column
          field="users_apusr"
          header="Master User"
          body={users_apusr_BT}
          sortable
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};
export default UsersListComp;
