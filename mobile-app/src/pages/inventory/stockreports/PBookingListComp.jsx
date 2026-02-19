import { useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { parseAttributes } from "@/utils/jsonParser";
import { formatDate } from "@/utils/datetime";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";

const PBookingListComp = ({ dataList, isBusy, isSummary }) => {
  const displayData = useMemo(() => {
    if (!isSummary) return dataList;

    const summaryMap = new Map();

    dataList.forEach((item) => {
      const key = `${item.items_icode}_${item.cbkng_attrb}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, { ...item, cbkng_pnqty: 0, cbkng_itamt: 0 });
      }
      const existing = summaryMap.get(key);
      existing.cbkng_pnqty += Number(item.cbkng_pnqty || 0);
      existing.cbkng_itamt += Number(item.cbkng_itamt || 0);
    });

    return Array.from(summaryMap.values());
  }, [dataList, isSummary]);
  const items_iname_BT = (rowData) => {
    const parsedAttr = parseAttributes(rowData.cbkng_attrb);
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

  const mbkng_trnno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.mbkng_trnno}</span>
        <span className="text-gray-500 text-sm">{rowData.cntct_cntnm}</span>
      </div>
    );
  };

  const cbkng_itqty_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-500 text-sm">
          Qty: {Number(rowData.cbkng_itqty).toFixed(2)}
        </span>
        <span className="text-gray-500 text-sm">
          Received: {Number(rowData.cbkng_rcqty).toFixed(2)}
        </span>
        <span className="text-gray-500 text-sm">
          Cancelled: {Number(rowData.cbkng_cnqty).toFixed(2)}
        </span>
      </div>
    );
  };

  const cbkng_pnqty_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          {Number(rowData.cbkng_pnqty).toFixed(2)} {rowData.puofm_untnm}
        </span>
        <span className="text-blue-600 text-sm">
          <ConvertedQtyComponent
            qty={rowData.cbkng_pnqty}
            dfQty={rowData.items_dfqty}
            pname={rowData.puofm_untnm}
            sname={rowData.suofm_untnm}
          />
        </span>
      </div>
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
          <Column field="mbkng_trnno" header="Booking" body={mbkng_trnno_BT} />
        )}
        {!isSummary && (
          <Column
            field="cbkng_itqty"
            header="Qty"
            sortable
            bodyStyle={{ textAlign: "right" }}
            body={cbkng_itqty_BT}
          />
        )}
        <Column
          field="cbkng_pnqty"
          header="Booking"
          sortable
          bodyStyle={{ textAlign: "right" }}
          body={cbkng_pnqty_BT}
        />
      </DataTable>
    </div>
  );
};

export default PBookingListComp;
