import { useGrains } from "@/hooks/support/useGrains";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";

const GrainsPage = () => {
  const { dataList, handleRefresh } = useGrains();

  const crgrn_tblnm_HT = () => {
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
        <h3 className="m-0">Grains: {balance}</h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              onClick={handleRefresh}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };

  const crgrn_dbgrn_BT = (item) => {
    return <>{Number(item.crgrn_dbgrn) > 0 ? Number(item.crgrn_dbgrn) : "0"}</>;
  };

  const crgrn_crgrn_BT = (item) => {
    return <>{Number(item.crgrn_crgrn) > 0 ? Number(item.crgrn_crgrn) : "0"}</>;
  };

  return (
    <>
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        <DataTable
          value={dataList}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="No data found."
          size="small"
          rowHover
          showGridlines
        >
          <Column field="crgrn_tblnm" header={crgrn_tblnm_HT} />
          <Column field="crgrn_tbltx" header="Source Name" />
          <Column field="crgrn_refno" header="Ref No" />
          <Column field="crgrn_dbgrn" header="Debit (-)" body={crgrn_dbgrn_BT} />
          <Column field="crgrn_crgrn" header="Credit (+)" body={crgrn_crgrn_BT} />
        </DataTable>
      </Card>
    </>
  );
};

export default GrainsPage;
