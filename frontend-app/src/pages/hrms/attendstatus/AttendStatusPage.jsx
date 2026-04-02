import { useAttendStatus } from "@/hooks/hrms/useAttendStatus";
import AttendStatusListComp from "./AttendStatusListComp";
import AttendStatusFormComp from "./AttendStatusFormComp";
import EmpLeaveFormComp from "./EmpLeaveFormComp";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";

const AttendStatusPage = () => {
  const {
    isBusy,
    dataList,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
    //leave manage
    handleEmployeeLeave,
    empLeaveFormData,
    handleChangeEmpLeave,
    handleSaveEmpLeave,
  } = useAttendStatus();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Attendance Status List"
            : formData.id
              ? "Edit Attendance Status"
              : "New Attendance Status"}
        </h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              onClick={handleRefresh}
              disabled={!isList}
            />
            <Button
              label="Employee Leave"
              icon="pi pi-plus"
              size="small"
              severity="warning"
              onClick={handleEmployeeLeave}
              disabled={!isList}
            />
            <Button
              label="New"
              icon="pi pi-plus"
              size="small"
              severity="info"
              onClick={handleAddNew}
              disabled={!isList}
            />
            <Button
              label="Back"
              icon="pi pi-arrow-left"
              size="small"
              severity="help"
              onClick={handleCancel}
              disabled={isList}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card header={getHeader()} className="border-round p-3">
        {currentView === "list" ? (
          <AttendStatusListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : currentView === "emp-leave" ? (
          <EmpLeaveFormComp
            isBusy={isBusy}
            errors={errors}
            formData={empLeaveFormData}
            onChange={handleChangeEmpLeave}
            onSave={handleSaveEmpLeave}
          />
        ) : (
          <AttendStatusFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
          />
        )}
      </Card>
    </>
  );
};

export default AttendStatusPage;
