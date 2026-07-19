import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActiveRowCell from "@/components/ActiveRowCell";
import EmptyState from "@/components/EmptyState";

const AccoutnsCode = ({ dataList }) => {
  
  const party_cname_BT = (rowData) => {
    return (
      <ActiveRowCell text={rowData.party_cname} status={rowData.party_actve} />
    );
  };

  
  const chtac_cname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-gray-700 text-sm">
          {rowData.chtac_cname}
        </span>
        <span className="text-gray-700 text-sm mt-1">
          Type: {rowData.chtac_ctype}
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="mt-4">
        {dataList.length > 0 ? (
          <DataTable
            value={dataList}
            emptyMessage="No code found."
            size="small"
            rowHover
            showGridlines
          >
            <Column
              header="Sl"
              body={(rowData, options) => options.rowIndex + 1}
            />
            <Column field="party_ptype" header="Type" />
            <Column field="party_cname" header="Ledger Name" body={party_cname_BT} />
            <Column field="party_opbal" header="Opening Balance"/>
            <Column field="chtac_cname" header="Chart Of Accounts" body={chtac_cname_BT} />
          </DataTable>
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
};
export default AccoutnsCode;
