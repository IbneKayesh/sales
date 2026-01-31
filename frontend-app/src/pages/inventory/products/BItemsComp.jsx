import { Chip } from "primereact/chip";
import { useBusiness } from "@/hooks/setup/useBusiness";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActiveRowCell from "@/components/ActiveRowCell";
import ZeroRowCell from "@/components/ZeroRowCell";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const BItemsComp = ({
  onFetchBusinessItems,
  dataList,
  onFilterBusinessItems,
}) => {
  const { dataList: businessOptions } = useBusiness();
  const [selBusinessId, setSelBusinessId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const filterOptions = [
    { label: "All Items", value: "all", icon: "pi pi-list" },
    {
      label: "Low Stock",
      value: "low_stock",
      icon: "pi pi-exclamation-triangle",
    },
    {
      label: "Out of Stock",
      value: "out_of_stock",
      icon: "pi pi-times-circle",
    },
    {
      label: "Bad Stock",
      value: "bad_stock",
      icon: "pi pi-exclamation-triangle",
    },
    {
      label: "Without Margin",
      value: "without_margin",
      icon: "pi pi-arrow-up-right",
    },
    {
      label: "Purchase Bookings",
      value: "purchase_bookings",
      icon: "pi pi-bookmark",
    },
    {
      label: "Sales Bookings",
      value: "sales_bookings",
      icon: "pi pi-bookmark",
    },
    {
      label: "With Discount",
      value: "with_discount",
      icon: "pi pi-bookmark",
    },
    { label: "Inactives", value: "inactives", icon: "pi pi-eye-slash" },
  ];

  const handleFilterChange = (e) => {
    setFilterType(e.value);
    if (onFilterBusinessItems) {
      onFilterBusinessItems(e.value);
    }
  };

  
  const onExportCsv = () => {
    toast.current.show({
      severity: "warn",
      summary: "Permission Denied",
      detail: "You are not allowed to export CSV",
      life: 3000,
    });
  };

  const onImportCsv = () => {
    toast.current.show({
      severity: "warn",
      summary: "Permission Denied",
      detail: "You are not allowed to import CSV",
      life: 3000,
    });
  };

  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="flex flex-wrap align-items-center gap-2">
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

          <Dropdown
            value={filterType}
            options={filterOptions}
            onChange={handleFilterChange}
            placeholder="Select Status"
            className="p-inputtext-sm w-full md:w-15rem"
            checkmark={true}
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
          />
        </div>
        <div className="flex align-items-center gap-2">
          <Button
            type="button"
            icon="pi pi-file-excel"
            severity="success"
            size="small"
            tooltip="Export CSV"
            tooltipOptions={{ position: "bottom" }}
            onClick={onExportCsv}
          />
          <Button
            type="button"
            icon="pi pi-file-import"
            severity="info"
            size="small"
            tooltip="Import CSV"
            tooltipOptions={{ position: "bottom" }}
            onClick={onImportCsv}
          />
        </div>
      </div>
    );
  };

  const handleSelectBusiness = (id) => {
    setSelBusinessId(id);
    onFetchBusinessItems(id);
  };

  const action_BT = (rowData) => {
    return (
      <span
        className={`pi ${
          rowData.bitem_actve
            ? "pi-check-circle text-green-500"
            : "pi-times-circle text-red-500"
        }`}
      ></span>
    );
  };

  const items_iname_BT = (rowData) => {
    return (
      <>
        <ActiveRowCell
          text={rowData.items_iname}
          status={rowData.bitem_actve}
        />
        <span className="text-sm text-gray-600 ml-1">
          {rowData.items_idesc}
        </span>
      </>
    );
  };

  const bitem_lprat_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_lprat} text={Number(rowData.bitem_lprat).toFixed(2)} />
    );
  };

  const bitem_dprat_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_dprat} text={Number(rowData.bitem_dprat).toFixed(2)} />
    );
  };

  const bitem_mcmrp_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_mcmrp} text={Number(rowData.bitem_mcmrp).toFixed(2)} />
    );
  };

  const bitem_sddsp_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_sddsp} text={Number(rowData.bitem_sddsp).toFixed(2)} />
    );
  };

  const bitem_gstkq_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_gstkq} text={Number(rowData.bitem_gstkq).toFixed(2)} />
    );
  };

  const bitem_bstkq_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_bstkq} text={Number(rowData.bitem_bstkq).toFixed(2)} />
    );
  };

  const bitem_mnqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_mnqty} text={Number(rowData.bitem_mnqty).toFixed(2)} />
    );
  };

  const bitem_mxqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_mxqty} text={Number(rowData.bitem_mxqty).toFixed(2)} />
    );
  };

  const bitem_pbqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_pbqty} text={Number(rowData.bitem_pbqty).toFixed(2)} />
    );
  };

  const bitem_sbqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_sbqty} text={Number(rowData.bitem_sbqty).toFixed(2)} />
    );
  };

  const bitem_mpric_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_mpric} text={Number(rowData.bitem_mpric).toFixed(2)} />
    );
  };

  return (
    <>
      <div className="flex flex-wrap">
        {businessOptions.map((business) => (
          <Chip
            key={business.id}
            label={business.bsins_bname}
            icon="pi pi-home"
            className={
              selBusinessId === business.id
                ? "bg-gray-800 text-white mr-2"
                : "bg-gray-300 text-gray-600 mr-2"
            }
            value={business.bsins_bname}
            style={{ cursor: "pointer" }}
            onClick={() => handleSelectBusiness(business.id)}
          />
        ))}
      </div>
      <div className={`p-1 ${dataList?.length > 0 ? "" : ""}`}>
        <DataTable
          value={dataList}
          paginator
          rows={15}
          rowsPerPageOptions={[15, 50, 100]}
          emptyMessage="No data found."
          size="small"
          rowHover
          showGridlines
          globalFilter={globalFilter}
          header={header()}
        >
          <Column
            field="items_iname"
            header="Name"
            body={items_iname_BT}
            sortable
          />
          <Column
            field="bitem_lprat"
            header="Purchase Rate"
            sortable
            body={bitem_lprat_BT}
          />
          <Column
            field="bitem_dprat"
            header="Distributor Rate"
            sortable
            body={bitem_dprat_BT}
          />
          <Column
            field="bitem_mcmrp"
            header="MRP"
            sortable
            body={bitem_mcmrp_BT}
          />
          <Column
            field="bitem_sddsp"
            header="Discount %"
            sortable
            body={bitem_sddsp_BT}
          />
          <Column field="bitem_snote" header="Note" sortable />
          <Column
            field="bitem_gstkq"
            header="Good Stock"
            sortable
            body={bitem_gstkq_BT}
          />
          <Column
            field="bitem_bstkq"
            header="Bad Stock"
            sortable
            body={bitem_bstkq_BT}
          />
          <Column
            field="bitem_mnqty"
            header="Minimum Stock"
            sortable
            body={bitem_mnqty_BT}
          />
          <Column
            field="bitem_mxqty"
            header="Maximum Stock"
            sortable
            body={bitem_mxqty_BT}
          />
          <Column
            field="bitem_pbqty"
            header="Purchase Booking"
            sortable
            body={bitem_pbqty_BT}
          />
          <Column
            field="bitem_sbqty"
            header="Sales Booking"
            sortable
            body={bitem_sbqty_BT}
          />
          <Column
            field="bitem_mpric"
            header="Margin Price"
            sortable
            body={bitem_mpric_BT}
          />
          <Column header={dataList?.length + " rows"} body={action_BT} />
        </DataTable>
      </div>
    </>
  );
};

export default BItemsComp;
