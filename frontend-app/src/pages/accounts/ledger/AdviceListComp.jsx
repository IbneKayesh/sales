import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate } from "@/utils/datetime";

const AdviceListComp = ({ dataList }) => {
  const payad_srcnm_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="font-md">{rowData.payad_srcnm}</span>
        <span className="font-bold text-blue-700">{rowData.payad_refno}</span>
      </div>
    );
  };
  const payad_trdat_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="font-md">{formatDate(rowData.payad_trdat)}</span>
        <span className="font-sm text-gray-500">{rowData.payad_descr}</span>
      </div>
    );
  };

  return (
    <>
      {/* {JSON.stringify(dataList)} */}
      <div className="p-1">
        <DataTable
          value={dataList}
          paginator
          rows={50}
          rowsPerPageOptions={[50, 100, 200]}
          emptyMessage="No data found."
          size="small"
          rowHover
          showGridlines
        >
          <Column field="payad_srcnm" header="Source" body={payad_srcnm_BT} />
          <Column field="payad_trdat" header="Date" body={payad_trdat_BT} />
          <Column field="payad_rfamt" header="Amount" />
        </DataTable>
      </div>
    </>
  );
};

export default AdviceListComp;
