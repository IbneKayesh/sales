import { useAttendLog } from "@/hooks/hrms/useAttendLog";
import AttendLogListComp from "./AttendLogListComp";
import AttendLogFormComp from "./AttendLogFormComp";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { Badge } from "primereact/badge";

const AttendLogPage = () => {
  const {
    isBusy,
    dataList,
    localList,
    errors,
    formData,
    handleChange,
    handleClear,
    handleDelete,
    handleDeleteLocal,
    handleRefresh,
    handleSave,
    handleSync,
  } = useAttendLog();

  const getHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">{"Attendance Log"}</h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              onClick={handleRefresh}
              disabled={isBusy}
            />
            <Button
              label={
                localList.length > 0
                  ? `Sync (${localList.length} pending)`
                  : "Sync"
              }
              icon="pi pi-cloud-upload"
              size="small"
              severity="info"
              onClick={handleSync}
              disabled={isBusy || localList.length === 0}
              loading={isBusy}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card header={getHeader()} className="border-round p-3">
        <AttendLogFormComp
          isBusy={isBusy}
          errors={errors}
          formData={formData}
          onChange={handleChange}
          onSave={handleSave}
        />
        <AttendLogListComp
          localList={localList}
          dataList={dataList}
          onDelete={handleDelete}
          onDeleteLocal={handleDeleteLocal}
        />
      </Card>
    </>
  );
};

export default AttendLogPage;
