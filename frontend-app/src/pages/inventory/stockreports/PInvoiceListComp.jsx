import { useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { parseAttributes } from "@/utils/jsonParser";
import { formatDate } from "@/utils/datetime";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import { Button } from "primereact/button";
import PriceDlgComp from "./PriceDlgComp";

const PInvoiceListComp = ({ dataList, isBusy, isSummary }) => {
  const [selectedTrackedItem, setSelectedTrackedItem] = useState(null);

  const handleUpdatePrice = (product) => {
    setSelectedTrackedItem(product);
  };

  const displayData = useMemo(() => {
    if (!isSummary) return dataList;

    const summaryMap = new Map();

    dataList.forEach((item) => {
      const key = `${item.items_icode}_${item.cinvc_attrb}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, { ...item, cinvc_ohqty: 0, crcpt_itamt: 0 });
      }
      const existing = summaryMap.get(key);
      existing.cinvc_ohqty += Number(item.cinvc_ohqty || 0);
      existing.crcpt_itamt += Number(item.crcpt_itamt || 0);
    });

    return Array.from(summaryMap.values());
  }, [dataList, isSummary]);
  const items_iname_BT = (rowData) => {
    const parsedAttr = parseAttributes(rowData.cinvc_attrb);
    return (
      <div className="flex flex-column">
        <span className="text-md">{`${rowData.items_icode} - ${rowData.items_iname}`}</span>
        {/* {JSON.stringify(rowData)} */}
        {Object.keys(parsedAttr).length > 0 && (
          <span className="text-gray-600 text-sm">
            {Object.entries(parsedAttr)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </span>
        )}
      </div>
    );
  };

  const minvc_trnno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.minvc_trnno}</span>
        <span className="text-gray-500 text-sm">{rowData.cntct_cntnm}</span>
      </div>
    );
  };

  const cinvc_itrat_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          PP: {Number(rowData.cinvc_itrat).toFixed(2)}
        </span>
        <span className="text-md">
          DP: {Number(rowData.cinvc_dprat).toFixed(2)}
        </span>
        <span className="text-md">
          MRP: {Number(rowData.cinvc_mcmrp).toFixed(2)}
        </span>
      </div>
    );
  };

  const cinvc_itqty_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-500 text-sm">
          Qty: {Number(rowData.cinvc_itqty).toFixed(2)}
        </span>
        <span className="text-gray-500 text-sm">
          Returned: {Number(rowData.cinvc_rtqty).toFixed(2)}
        </span>
        <span className="text-gray-500 text-sm">
          Sold: {Number(rowData.cinvc_slqty).toFixed(2)}
        </span>
      </div>
    );
  };

  const cinvc_ohqty_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          {Number(rowData.cinvc_ohqty).toFixed(2)} {rowData.puofm_untnm}
        </span>
        <span className="text-blue-600 text-sm">
          Bulk:{" "}
          <ConvertedQtyComponent
            qty={rowData.cinvc_ohqty}
            dfQty={rowData.items_dfqty}
            pname={rowData.puofm_untnm}
            sname={rowData.suofm_untnm}
          />
        </span>
      </div>
    );
  };

  const action_BT = (rowData) => {
    return (
      <Button
        label="Price"
        icon="pi pi-pencil"
        onClick={() => handleUpdatePrice(rowData)}
        severity="info"
        size="small"
      />
    );
  };

  return (
    <div className="p-1">
      <DataTable
        value={displayData}
        loading={isBusy}
        paginator
        rows={15}
        rowsPerPageOptions={[15, 50, 100]}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
      >
        <Column
          field="items_iname"
          header="Item Name"
          sortable
          filter
          filterPlaceholder="Search by name"
          body={items_iname_BT}
        />
        {!isSummary && (
          <Column field="minvc_trnno" header="Invoice" body={minvc_trnno_BT} />
        )}
        {!isSummary && (
          <Column field="cinvc_itrat" header="Price" body={cinvc_itrat_BT} />
        )}
        {!isSummary && (
          <Column
            field="cinvc_itqty"
            header="Qty"
            sortable
            bodyStyle={{ textAlign: "right" }}
            body={cinvc_itqty_BT}
          />
        )}
        <Column
          field="cinvc_ohqty"
          header="Stock"
          sortable
          bodyStyle={{ textAlign: "right" }}
          body={cinvc_ohqty_BT}
        />
        {!isSummary && <Column body={action_BT} style={{ width: "100px" }} />}
      </DataTable>
      {selectedTrackedItem && <PriceDlgComp formData={selectedTrackedItem} />}
    </div>
  );
};

export default PInvoiceListComp;
