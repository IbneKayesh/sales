import { useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { parseAttributes } from "@/utils/jsonParser";
import { formatDate } from "@/utils/datetime";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";

const PReceiptListComp = ({ dataList, isBusy, isSummary }) => {
  const displayData = useMemo(() => {
    if (!isSummary) return dataList;

    const summaryMap = new Map();

    dataList.forEach((item) => {
      const key = `${item.items_icode}_${item.crcpt_attrb}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, { ...item, crcpt_ohqty: 0, crcpt_itamt: 0 });
      }
      const existing = summaryMap.get(key);
      existing.crcpt_ohqty += Number(item.crcpt_ohqty || 0);
      existing.crcpt_itamt += Number(item.crcpt_itamt || 0);
    });

    return Array.from(summaryMap.values());
  }, [dataList, isSummary]);
  const items_iname_BT = (rowData) => {
    const parsedAttr = parseAttributes(rowData.crcpt_attrb);
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

  const mrcpt_trnno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.mrcpt_trnno}</span>
        <span className="text-gray-500 text-sm">{rowData.cntct_cntnm}</span>
      </div>
    );
  };

  const crcpt_itqty_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-500 text-sm">
          Qty: {Number(rowData.crcpt_itqty).toFixed(2)}
        </span>
        <span className="text-gray-500 text-sm">
          Returned: {Number(rowData.crcpt_rtqty).toFixed(2)}
        </span>
        <span className="text-gray-500 text-sm">
          Sales: {Number(rowData.crcpt_slqty).toFixed(2)}
        </span>
      </div>
    );
  };

  const crcpt_ohqty_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          {Number(rowData.crcpt_ohqty).toFixed(2)} {rowData.puofm_untnm}
        </span>
        <span className="text-blue-600 text-sm">
          <ConvertedQtyComponent
            qty={rowData.crcpt_ohqty}
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
          <Column field="mrcpt_trnno" header="Receipt" body={mrcpt_trnno_BT} />
        )}
        {!isSummary && (
          <Column
            field="crcpt_itqty"
            header="Qty"
            sortable
            bodyStyle={{ textAlign: "right" }}
            body={crcpt_itqty_BT}
          />
        )}
        <Column
          field="crcpt_ohqty"
          header="Stock"
          sortable
          bodyStyle={{ textAlign: "right" }}
          body={crcpt_ohqty_BT}
        />
      </DataTable>
    </div>
  );
};

export default PReceiptListComp;
