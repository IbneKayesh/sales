import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { formatDate, formatDateTime } from "@/utils/datetime";
import { Badge } from "primereact/badge";
import { SplitButton } from "primereact/splitbutton";
import { Tag } from "primereact/tag";
import { useState, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import EmptyState from "@/components/EmptyState";

const ListComp = ({ dataList, onEdit }) => {
  const [globalFilter, setGlobalFilter] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filterOptions = useMemo(() => {
    const options = [
      { label: "All Contacts", value: "all", icon: "pi pi-users" },
    ];
    const uniqueContacts = new Map();

    dataList?.forEach((item) => {
      if (item.minvc_cntct && !uniqueContacts.has(item.minvc_cntct)) {
        uniqueContacts.set(item.minvc_cntct, item.cntct_cntnm);
      }
    });

    const contactOpts = Array.from(uniqueContacts.entries()).map(
      ([value, label]) => ({
        label,
        value,
        icon: "pi pi-user",
      }),
    );

    contactOpts.sort((a, b) => a.label.localeCompare(b.label));
    return [...options, ...contactOpts];
  }, [dataList]);

  const statusFilterOptions = [
    { label: "All Status", value: "all", icon: "pi pi-filter" },
    { label: "Unpaid", value: "unpaid", icon: "pi pi-times-circle" },
    { label: "Paid", value: "paid", icon: "pi pi-check-circle" },
    { label: "Partial", value: "partial", icon: "pi pi-exclamation-circle" },
    { label: "Posted", value: "posted", icon: "pi pi-lock" },
    { label: "Draft (Unposted)", value: "draft", icon: "pi pi-pencil" },
    { label: "Closed", value: "closed", icon: "pi pi-check" },
    {
      label: "VAT Collected",
      value: "vat-collected",
      icon: "pi pi-percentage",
    },
    {
      label: "VAT Not Collected",
      value: "vat-not-collected",
      icon: "pi pi-percentage",
    },
    {
      label: "Cancelled",
      value: "cancelled",
      icon: "pi pi-ban",
    },
  ];

  const filteredData = useMemo(() => {
    let data = dataList || [];

    if (filterType && filterType !== "all") {
      data = data.filter((item) => item.minvc_cntct === filterType);
    }

    if (statusFilter && statusFilter !== "all") {
      switch (statusFilter) {
        case "unpaid":
          data = data.filter((i) => i.minvc_ispad === 0);
          break;
        case "paid":
          data = data.filter((i) => i.minvc_ispad === 1);
          break;
        case "partial":
          data = data.filter((i) => i.minvc_ispad === 2);
          break;
        case "posted":
          data = data.filter((i) => i.minvc_ispst === 1);
          break;
        case "draft":
          data = data.filter((i) => i.minvc_ispst === 0);
          break;
        case "closed":
          data = data.filter((i) => i.minvc_iscls === 1);
          break;
        case "vat-collected":
          data = data.filter((i) => i.minvc_vatcl === 1);
          break;
        case "vat-not-collected":
          data = data.filter((i) => i.minvc_vatcl === 0);
          break;
        case "cancelled":
          data = data.filter((i) => i.minvc_hscnl === 1);
          break;
      }
    }

    return data;
  }, [dataList, filterType, statusFilter]);

  const handleFilterChange = (e) => {
    setFilterType(e.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.value);
  };

  const header = () => {
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
          <Dropdown
            value={filterType}
            options={filterOptions}
            onChange={handleFilterChange}
            placeholder="Select Filter"
            className="p-inputtext-sm w-full md:w-18rem"
            itemTemplate={(option) => (
              <div className="flex align-items-center gap-2">
                <i className={option.icon}></i>
                <span>{option.label}</span>
              </div>
            )}
            valueTemplate={(option, props) => {
              if (option) {
                return (
                  <div className="flex align-items-center gap-2">
                    <i className={option.icon}></i>
                    <span>{option.label}</span>
                  </div>
                );
              }
              return <span>{props.placeholder}</span>;
            }}
            checkmark={true}
          />

          <Dropdown
            value={statusFilter}
            options={statusFilterOptions}
            onChange={handleStatusFilterChange}
            placeholder="Status Filter"
            className="p-inputtext-sm w-full md:w-15rem"
            itemTemplate={(option) => (
              <div className="flex align-items-center gap-2">
                <i className={option.icon}></i>
                <span>{option.label}</span>
              </div>
            )}
            valueTemplate={(option, props) => {
              if (option) {
                return (
                  <div className="flex align-items-center gap-2">
                    <i className={option.icon}></i>
                    <span>{option.label}</span>
                  </div>
                );
              }
              return <span>{props.placeholder}</span>;
            }}
            checkmark={true}
          />
        </div>
      </div>
    );
  };

  const minvc_trnno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-blue-600">
          {rowData.minvc_trnno},{" "}
          <span className="text-md text-blue-400 mt-1">
            Invoice
          </span>
        </span>
        <span className="text-sm font-italic text-green-600 mt-1">
          {rowData.cntct_cntnm},{" "}
          <span className="text-xs text-gray-600">{rowData.cntct_cntps}</span>
        </span>
      </div>
    );
  };

  const minvc_trdat_BT = (rowData) => {
    const { minvc_trdat, minvc_refno, minvc_trnte } = rowData;
    return (
      <div className="flex flex-column">
        {formatDate(minvc_trdat)}
        {(minvc_refno || minvc_trnte) && (
          <small className="text-xs text-gray-500 font-italic mt-1">
            {[minvc_refno, minvc_trnte].filter(Boolean).join(" • ")}
          </small>
        )}
      </div>
    );
  };

  const minvc_pyamt_BT = (rowData) => {
    const { minvc_pyamt, minvc_pdamt, minvc_duamt } = rowData;

    return (
      <div className="flex gap-1">
        <span className="text-primary font-bold">
          {Number(minvc_pyamt).toFixed(2)}
        </span>
        •
        <span className="text-green-500 font-bold">
          {Number(minvc_pdamt || 0).toFixed(2)}
        </span>
        •
        <span className="text-red-500 font-bold">
          {Number(minvc_duamt || 0).toFixed(2)}
        </span>
      </div>
    );
  };

  const is_paid_BT = (rowData) => {
    const statusMap = {
      1: { severity: "success", label: "Paid", icon: "pi-check-circle" },
      0: { severity: "danger", label: "Unpaid", icon: "pi-times-circle" },
      2: {
        severity: "warning",
        label: "Partial",
        icon: "pi-exclamation-circle",
      },
    };

    const status = statusMap[rowData.minvc_ispad];

    return (
      <div className="flex flex-wrap gap-1 align-items-center">
        {status && (
          <Tag
            value={status.label}
            severity={status.severity}
            icon={`pi ${status.icon}`}
            rounded
            className="px-2"
          />
        )}
        {rowData.minvc_ispst === 1 ? (
          <Tag
            value="Posted"
            severity="info"
            icon="pi pi-lock"
            rounded
            className="px-2"
          />
        ) : (
          <Tag
            value="Draft"
            severity="secondary"
            icon="pi pi-pencil"
            rounded
            className="px-2"
          />
        )}
        {rowData.minvc_iscls === 1 ? (
          <Tag value="Closed" severity="contrast" rounded />
        ) : null}
      </div>
    );
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.minvc_trnno}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => {
        // onDelete logic would go here if provided via props
      },
    });
  };

  const action_BT = (rowData) => {
    const menuItems = [
      {
        label: "Delete",
        icon: "pi pi-trash",
        className: "text-red-500",
        command: () => handleDelete(rowData),
        disabled: !!rowData.edit_stop,
      },
    ];

    return (
      <div className="flex justify-content-center">
        <SplitButton
          icon={rowData.edit_stop ? "pi pi-eye" : "pi pi-pencil"}
          size="small"
          onClick={() => onEdit(rowData)}
          model={menuItems}
          severity={rowData.edit_stop ? "secondary" : "info"}
          className="p-button-rounded"
        />
      </div>
    );
  };

  const dataTable_FT = () => {
    const stats = {
      paid: filteredData.filter((i) => i.minvc_ispad === 1).length,
      unpaid: filteredData.filter((i) => i.minvc_ispad === 0).length,
      partial: filteredData.filter((i) => i.minvc_ispad === 2).length,
      due: filteredData.reduce((s, i) => s + Number(i.minvc_duamt || 0), 0),
      unposted: filteredData.filter((i) => i.minvc_ispst !== 1).length,
    };

    return (
      <div className="flex flex-wrap justify-content-center font-bold gap-4 py-2">
        {filteredData.length > 0 && (
          <div className="text-blue-500 gap-2">
            <span>Records: </span>
            <span>{filteredData.length}</span>
          </div>
        )}
        {stats.due > 0 && (
          <div className="text-red-500 gap-2">
            <span>Dues: </span>
            <span>{Number(stats.due).toFixed(2)}</span>
          </div>
        )}
        <div className="flex gap-2">
          {stats.paid > 0 && (
            <Badge value={`Paid: ${stats.paid}`} severity="success" />
          )}
          {stats.unpaid > 0 && (
            <Badge value={`Unpaid: ${stats.unpaid}`} severity="danger" />
          )}
          {stats.unposted > 0 && (
            <Badge value={`Drafts: ${stats.unposted}`} severity="warning" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      <DataTable
        value={filteredData}
        dataKey="pmstr_trnno"
        paginator
        rows={15}
        rowsPerPageOptions={[15, 50, 100]}
        emptyMessage="No data found."
        size="small"
        className={`shadow-1 ${filteredData.length === 0 && "hidden"}`}
        rowHover
        showGridlines
        globalFilter={globalFilter}
        globalFilterFields={[
          "minvc_trnno",
          "cntct_cntnm",
          "cntct_cntps",
          "minvc_refno",
          "minvc_trnte",
        ]}
        header={header()}
        footer={dataTable_FT}
      >
        <Column
          field="minvc_trnno"
          header="No"
          body={minvc_trnno_BT}
          sortable
        />
        <Column header="Date & Notes" body={minvc_trdat_BT} />
        <Column header="Payable • Paid • Due" body={minvc_pyamt_BT} />
        <Column header="Status" body={is_paid_BT} />
        <Column body={action_BT} style={{ width: "100px" }} />
      </DataTable>
            {filteredData.length === 0 && <EmptyState />}
    </div>
  );
};

export default ListComp;
