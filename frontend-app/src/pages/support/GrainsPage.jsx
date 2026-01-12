import { useGrains } from "@/hooks/support/useGrains";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { formatDate, formatDateTime } from "@/utils/datetime";

const GrainsPage = () => {
  const { dataList, handleRefresh, handleGenerate } = useGrains();

  const crgrn_tbltx_HT = () => {
    return <>{dataList?.length} rows</>;
  };

  const sumCrgrnDbgrn = dataList.reduce(
    (sum, item) => sum + (Number(item.crgrn_dbgrn) || 0),
    0
  );

  const sumCrgrnCrgrn = dataList.reduce(
    (sum, item) => sum + (Number(item.crgrn_crgrn) || 0),
    0
  );

  const balance = sumCrgrnCrgrn - sumCrgrnDbgrn;

  const getHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0 text-xl text-green-500">Grains: {balance}</h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              onClick={handleRefresh}
            />            
            <Button
              icon="pi pi-plus"
              size="small"
              severity="success"
              onClick={handleGenerate}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };
  const crgrn_isdat_BT = (rowData) => {
    return <>{formatDate(rowData.crgrn_isdat)}</>;
  };

  const crgrn_dbgrn_BT = (rowData) => {
    return <>{Number(rowData.crgrn_dbgrn) > 0 ? Number(rowData.crgrn_dbgrn) : "0"}</>;
  };

  const crgrn_crgrn_BT = (rowData) => {
    return <>{Number(rowData.crgrn_crgrn) > 0 ? Number(rowData.crgrn_crgrn) : "0"}</>;
  };

  const crgrn_dbgrn_FT = () => {
    return dataList.reduce(
      (sum, item) => sum + (Number(item.crgrn_dbgrn) || 0),
      0
    );
  };

  const crgrn_crgrn_FT = () => {
    return dataList.reduce(
      (sum, item) => sum + (Number(item.crgrn_crgrn) || 0),
      0
    );
  };

  return (
    <>
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        <DataTable
          value={dataList}
          paginator
          rows={15}
          rowsPerPageOptions={[15, 50, 100]}
          emptyMessage="No data found."
          size="small"
          rowHover
          showGridlines
        >
          <Column field="crgrn_bsins" header="Table" />
          <Column field="crgrn_tbltx" header={crgrn_tbltx_HT} />
          <Column field="crgrn_refno" header="Ref No" />
          <Column field="crgrn_isdat" header="Date" body={crgrn_isdat_BT} />
          <Column field="crgrn_dbgrn" header="Debit (-)" body={crgrn_dbgrn_BT} footer={crgrn_dbgrn_FT} />
          <Column field="crgrn_crgrn" header="Credit (+)" body={crgrn_crgrn_BT} footer={crgrn_crgrn_FT} />
        </DataTable>
      </Card>
    </>
  );
};

export default GrainsPage;
