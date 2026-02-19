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

const ListComp = ({ dataList, onEdit }) => {
  const [globalFilter, setGlobalFilter] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filterOptions = useMemo(() => {
    const options = [
      { label: "All Warehouses", value: "all", icon: "pi pi-users" },
    ];
    const uniqueContacts = new Map();

    dataList?.forEach((item) => {
      if (item.mtrsf_bsins_to && !uniqueContacts.has(item.mtrsf_bsins_to)) {
        uniqueContacts.set(item.mtrsf_bsins_to, item.bsins_bname);
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
    { label: "Posted", value: "posted", icon: "pi pi-lock" },
    { label: "Draft (Unposted)", value: "draft", icon: "pi pi-pencil" },
    { label: "Closed", value: "closed", icon: "pi pi-check" },
  ];

  const filteredData = useMemo(() => {
    let data = dataList || [];

    if (filterType && filterType !== "all") {
      data = data.filter((item) => item.mtrsf_bsins_to === filterType);
    }

    if (statusFilter && statusFilter !== "all") {
      switch (statusFilter) {
        case "unpaid":
          data = data.filter((i) => i.mbkng_ispad === 0);
          break;
        case "paid":
          data = data.filter((i) => i.mbkng_ispad === 1);
          break;
        case "partial":
          data = data.filter((i) => i.mbkng_ispad === 2);
          break;
        case "posted":
          data = data.filter((i) => i.mbkng_ispst === 1);
          break;
        case "draft":
          data = data.filter((i) => i.mbkng_ispst === 0);
          break;
        case "closed":
          data = data.filter((i) => i.mbkng_iscls === 1);
          break;
        case "vat-collected":
          data = data.filter((i) => i.mbkng_vatcl === 1);
          break;
        case "vat-not-collected":
          data = data.filter((i) => i.mbkng_vatcl === 0);
          break;
        case "cancelled":
          data = data.filter((i) => i.mbkng_hscnl === 1);
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

  const mtrsf_trnno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-blue-600">
          {rowData.mtrsf_trnno},{" "}
          <span className="text-md text-blue-400 mt-1">
            Transfer
          </span>
        </span>
        <span className="text-sm font-italic text-green-600 mt-1">
          {rowData.bsins_bname}
        </span>
      </div>
    );
  };

  const mtrsf_trdat_BT = (rowData) => {
    const { mtrsf_trdat, mtrsf_refno, mtrsf_trnte } = rowData;
    return (
      <div className="flex flex-column">
        {formatDate(mtrsf_trdat)}
        {(mtrsf_refno || mtrsf_trnte) && (
          <small className="text-xs text-gray-500 font-italic mt-1">
            {[mtrsf_refno, mtrsf_trnte].filter(Boolean).join(" • ")}
          </small>
        )}
      </div>
    );
  };

  const mtrsf_odamt_BT = (rowData) => {
    const { mtrsf_odamt, mtrsf_excst, mtrsf_ttamt } = rowData;

    return (
      <div className="flex gap-1">
        <span className="text-primary font-bold">
          {Number(mtrsf_odamt).toFixed(2)}
        </span>
        •
        <span className="text-green-500 font-bold">
          {Number(mtrsf_excst || 0).toFixed(2)}
        </span>
        •
        <span className="text-red-500 font-bold">
          {Number(mtrsf_ttamt || 0).toFixed(2)}
        </span>
      </div>
    );
  };

  const mtrsf_isrcv_BT = (rowData) => {
    const statusMap = {
      1: { severity: "success", label: "Received", icon: "pi-check-circle" },
      0: { severity: "danger", label: "Unreceived", icon: "pi-times-circle" },
    };

    const status = statusMap[rowData.mtrsf_isrcv];

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
        {rowData.mtrsf_ispst === 1 ? (
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
      </div>
    );
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.mbkng_trnno}"?`,
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
      paid: filteredData.filter((i) => i.mbkng_ispad === 1).length,
      unpaid: filteredData.filter((i) => i.mbkng_ispad === 0).length,
      partial: filteredData.filter((i) => i.mbkng_ispad === 2).length,
      due: filteredData.reduce((s, i) => s + Number(i.mbkng_duamt || 0), 0),
      unposted: filteredData.filter((i) => i.mbkng_ispst !== 1).length,
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
        dataKey="mtrsf_trnno"
        paginator
        rows={15}
        rowsPerPageOptions={[15, 50, 100]}
        emptyMessage="No data found."
        size="small"
        className="shadow-1"
        rowHover
        showGridlines
        globalFilter={globalFilter}
        globalFilterFields={[
          "mtrsf_trnno",
          "bsins_bname",
          "mtrsf_refno",
          "mtrsf_trnte",
        ]}
        header={header()}
        footer={dataTable_FT}
      >
        <Column
          field="mtrsf_trnno"
          header="No"
          body={mtrsf_trnno_BT}
          sortable
        />
        <Column header="Date & Notes" body={mtrsf_trdat_BT} />
        <Column header="Order • Cost • Total" body={mtrsf_odamt_BT} />
        <Column header="Status" body={mtrsf_isrcv_BT} />
        <Column body={action_BT} style={{ width: "100px" }} />
      </DataTable>
    </div>
  );
};

export default ListComp;
