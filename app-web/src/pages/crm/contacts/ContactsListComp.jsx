import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import CSVExport from "@/components/CSVExport";

const ContactsListComp = ({ dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const export_columns = [
    { header: "Type", accessor: "cntct_ctype" },
    { header: "Source", accessor: "cntct_sorce" },
    { header: "Name", accessor: "cntct_cntnm" },
    { header: "Person", accessor: "cntct_cntps" },
    { header: "Contact No", accessor: "cntct_cntno" },
    { header: "Email", accessor: "cntct_email" },
    { header: "TIN No", accessor: "cntct_tinno" },
    { header: "Trade", accessor: "cntct_trade" },
    { header: "Office Address", accessor: "cntct_ofadr" },
    { header: "Factory Address", accessor: "cntct_fcadr" },
    { header: "Country", accessor: "cntct_cntry" },
    { header: "Currency", accessor: "cntct_crncy" },
    { header: "Discount %", accessor: "cntct_dspct" },
    { header: "Credit Limit", accessor: "cntct_crlmt" },
    { header: "Balance", accessor: "cntct_crbal" },
  ];

  const cntct_ctype_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-700 text-sm">
          Type: {rowData.cntct_ctype}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Source: {rowData.cntct_sorce}
        </span>
      </div>
    );
  };
  const cntct_cntnm_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <ActiveRowCell
          text={rowData.cntct_cntnm}
          status={rowData.cntct_actve}
        />
        <span className="text-sm">TIN: {rowData.cntct_tinno}</span>
        <span className="text-sm">Trade: {rowData.cntct_trade}</span>
      </div>
    );
  };

  const cntct_cntps_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">Person: {rowData.cntct_cntps}</span>
        <span className="text-sm">Contact: {rowData.cntct_cntno}</span>
        <span className="text-sm">Email: {rowData.cntct_email}</span>
      </div>
    );
  };
  const cntct_ofadr_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">Office: {rowData.cntct_ofadr}</span>
        <span className="text-sm">Factory: {rowData.cntct_fcadr}</span>
        <span className="text-sm">Country: {rowData.cntct_cntry}</span>
      </div>
    );
  };

  const cntct_crncy_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">Currency: {rowData.cntct_crncy}</span>
        <span className="text-sm">Discount %: {rowData.cntct_dspct}</span>
        <span className="text-sm">Credit Limit: {rowData.cntct_crlmt}</span>
        <span className="text-sm">Balance: {rowData.cntct_crbal}</span>
      </div>
    );
  };

  //show on form in view mode
  const cntct_crusr_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-700 text-sm">
          Created By: {rowData.aemp_iusr}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Modified By: {rowData.aemp_eusr}
        </span>
        <span className="text-gray-700 text-sm">
          Created Date: {rowData.aemp_iusr}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Modified Date: {rowData.aemp_eusr}
        </span>
      </div>
    );
  };

  const action_BT = (rowData) => {
    let menuItems = [
      {
        label: rowData.cntct_actve ? "Deactivate" : "Activate",
        icon: `pi ${
          rowData.cntct_actve
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
              fileName={`contacts_${new Date().toISOString().slice(0, 10)}`}
              columns={export_columns}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
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
        "cntct_ctype",
        "cntct_sorce",
        "cntct_cntnm",
        "cntct_cntps",
        "cntct_cntno",
        "cntct_email",
        "cntct_tinno",
        "cntct_trade",
        "cntct_ofadr",
        "cntct_fcadr",
        "cntct_cntry",
        "cntct_crncy",
        "cntct_dspct",
        "cntct_crlmt",
        "cntct_crbal",
      ]}
      header={dt_HT}
    >
      <Column header="Sl" body={(rowData, options) => options.rowIndex + 1} />
      <Column header="Type" body={cntct_ctype_BT} sortable />
      <Column header="Name" body={cntct_cntnm_BT} sortable />
      <Column header="Contact" body={cntct_cntps_BT} sortable />
      <Column header="Address" body={cntct_ofadr_BT} sortable />
      <Column header="Credit" body={cntct_crncy_BT} sortable />
      <Column header={dataList?.length + " rows"} body={action_BT} />
    </DataTable>
  );
};
export default ContactsListComp;