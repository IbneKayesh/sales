import { useSessions } from "@/hooks/support/useSessions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { formatDate, formatDateTime } from "@/utils/datetime";
import ZeroRowCell from "@/components/ZeroRowCell";

const SessionsPage = () => {
  const { dataList, handleRefresh, handleDelete } = useSessions();

  const getHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0 text-xl">User Sessions</h3>

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

  const createdAt_BT = (rowData) => {
    return formatDateTime(rowData.createdAt);
  };
  const lastActivity_BT = (rowData) => {
    return formatDateTime(rowData.lastActivity);
  };
  const expiresAt_BT = (rowData) => {
    return formatDateTime(rowData.expiresAt);
  };
  const action_BT = (rowData) => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          icon="pi pi-trash"
          size="small"
          severity="danger"
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
          onClick={() => handleDelete(rowData)}
        />
      </div>
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
          <Column field="email" header="Email" />
          <Column field="name" header="Name" />
          <Column field="contact" header="Contact" />
          <Column field="business" header="Business" />
          <Column field="role" header="Role" />
          <Column field="createdAt" header="Created At" body={createdAt_BT} />
          <Column
            field="lastActivity"
            header="Last Activity"
            body={lastActivity_BT}
          />
          <Column field="expiresAt" header="Expires At" body={expiresAt_BT} />
          <Column header={dataList?.length + " rows"} body={action_BT} />
        </DataTable>
      </Card>
    </>
  );
};

export default SessionsPage;
