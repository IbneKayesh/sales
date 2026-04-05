import { Chip } from "primereact/chip";
import { useBusinessSgd } from "@/hooks/setup/useBusinessSgd";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActiveRowCell from "@/components/ActiveRowCell";
import ZeroRowCell from "@/components/ZeroRowCell";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import { Dialog } from "primereact/dialog";
import { useStockReports } from "@/hooks/inventory/useStockReports";

const BItemsComp = ({
  onFetchBusinessItems,
  dataList,
  onFilterBusinessItems,
  onConvertStock,
}) => {
  const { dataList: businessOptions, handleGetAllActiveBusiness } =
    useBusinessSgd();
  const { dataList: itemLedgerDataList, handleGetItemLedger } =
  useStockReports();
  const [selBusinessId, setSelBusinessId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const [ledgerDlg, setLedgerDlg] = useState(false);
  const [selBItemId, setSelBItemId] = useState(null);

  useEffect(() => {
    handleGetAllActiveBusiness();
  }, []);

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
      label: "Good or Tracking Stock",
      value: "good_or_tracking_stock",
      icon: "pi pi-exclamation-circle",
    },
    {
      label: "Good Stock",
      value: "good_stock",
      icon: "pi pi-check-circle",
    },
    {
      label: "Tracking Stock",
      value: "tracking_stock",
      icon: "pi pi-check-circle",
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
            className="p-inputtext-sm w-full md:w-20rem"
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

  const handleLedgerDlg = (rowData) => {
    setLedgerDlg(true);
    setSelBItemId(rowData);
    handleGetItemLedger(rowData.id);
  };

  const action_BT = (rowData) => {
    return (
      <>
        {rowData.bitem_frmla ? (
          <Button
            type="button"
            icon="pi pi-arrow-right-arrow-left"
            severity="success"
            size="small"
            tooltip="Convert Stock"
            tooltipOptions={{ position: "left" }}
            onClick={() => onConvertStock(rowData, selBusinessId)}
          />
        ) : (
          <span className="p-button bg-gray-500"></span>
        )}

        <Button
          type="button"
          icon="pi pi-list"
          severity="success"
          size="small"
          tooltip="Ledger"
          tooltipOptions={{ position: "left" }}
          onClick={() => handleLedgerDlg(rowData)}
        />
      </>
    );
  };

  const items_iname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md text-gray-700">
          <ActiveRowCell
            text={rowData.items_iname}
            status={rowData.bitem_actve}
          />
        </span>
        <div className="text-sm">{rowData.items_icode}</div>
        <span className="text-sm text-gray-400">{rowData.items_idesc}</span>
      </div>
    );
  };

  const bitem_lprat_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <ZeroRowCell
          value={rowData.bitem_lprat}
          text={"PP: " + Number(rowData.bitem_lprat).toFixed(2)}
        />
        <ZeroRowCell
          value={rowData.bitem_dprat}
          text={"DP: " + Number(rowData.bitem_dprat).toFixed(2)}
        />
        <ZeroRowCell
          value={rowData.bitem_mcmrp}
          text={"MRP: " + Number(rowData.bitem_mcmrp).toFixed(2)}
        />
      </div>
    );
  };

  const bitem_sddsp_BT = (rowData) => {
    return (
      <ZeroRowCell
        value={rowData.bitem_sddsp}
        text={Number(rowData.bitem_sddsp).toFixed(2)}
      />
    );
  };

  const bitem_gstkq_BT = (rowData) => {
    const totalStock =
      Number(rowData.bitem_gstkq) +
      Number(rowData.bitem_bstkq) +
      Number(rowData.bitem_istkq);
    return (
      <div className="flex flex-column">
        <ZeroRowCell
          value={rowData.bitem_gstkq}
          text={"Good: " + Number(rowData.bitem_gstkq).toFixed(2)}
        />
        <ZeroRowCell
          value={rowData.bitem_bstkq}
          text={"Bad: " + Number(rowData.bitem_bstkq).toFixed(2)}
        />
        <ZeroRowCell
          value={rowData.bitem_istkq}
          text={"Tracking: " + Number(rowData.bitem_istkq).toFixed(2)}
        />
        <span className="font-bold">
          <ConvertedQtyComponent
            qty={totalStock}
            dfQty={rowData.items_dfqty}
            pname={rowData.puofm_untnm}
            sname={rowData.suofm_untnm}
          />
        </span>
      </div>
    );
  };

  const bitem_mnqty_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <ZeroRowCell
          value={rowData.bitem_mnqty}
          text={"Min: " + Number(rowData.bitem_mnqty).toFixed(2)}
        />
        <ZeroRowCell
          value={rowData.bitem_mxqty}
          text={"Max: " + Number(rowData.bitem_mxqty).toFixed(2)}
        />
      </div>
    );
  };

  const bitem_pbqty_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <ZeroRowCell
          value={rowData.bitem_pbqty}
          text={"Purchase: " + Number(rowData.bitem_pbqty).toFixed(2)}
        />
        <ZeroRowCell
          value={rowData.bitem_sbqty}
          text={"Sales: " + Number(rowData.bitem_sbqty).toFixed(2)}
        />
      </div>
    );
  };

  const bitem_mpric_BT = (rowData) => {
    return (
      <ZeroRowCell
        value={rowData.bitem_mpric}
        text={Number(rowData.bitem_mpric).toFixed(2)}
      />
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
                ? "bg-blue-800 text-white mr-2"
                : "bg-blue-300 text-white mr-2"
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
            header="Rate"
            sortable
            body={bitem_lprat_BT}
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
            header="Stock"
            sortable
            body={bitem_gstkq_BT}
          />
          <Column
            field="bitem_mnqty"
            header="Overflow"
            sortable
            body={bitem_mnqty_BT}
          />
          <Column
            field="bitem_pbqty"
            header="Booking"
            sortable
            body={bitem_pbqty_BT}
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

      <Dialog
        header={
          <>
            <span className="text-blue-500">Purchase to Sales Ledger of </span>
            {/* {selectedItemDetail?.product_code || "N/A"} -{" "}
            {selectedItemDetail?.product_name || "N/A"}
            <br />
            Current Stock:{" "}
            <ConvertedQtyComponent
              qty={selectedItemDetail.stock_qty}
              rowData={selectedItemDetail}
            />
            <span className="text-blue-500"> or </span>
            {selectedItemDetail.stock_qty} {selectedItemDetail.small_unit_name} */}
          </>
        }
        visible={ledgerDlg}
        // style={{ width: "50vw" }}
        onHide={() => {
          if (!ledgerDlg) return;
          setLedgerDlg(false);
        }}
      >
        <div className="m-0">
          {/* {JSON.stringify(itemLedger)} */}
          <DataTable
            value={itemLedgerDataList}
            keyField="id"
            emptyMessage="No data found."
            size="small"
            showGridlines
          >
            <Column field="minvc_trnno" header="ID" />
            <Column field="minvc_trdat" header="Date" />
            <Column field="cinvc_itrat" header="Rate" />
            <Column field="cinvc_itqty" header="Qty" />
          </DataTable>
        </div>
      </Dialog>
    </>
  );
};

export default BItemsComp;
