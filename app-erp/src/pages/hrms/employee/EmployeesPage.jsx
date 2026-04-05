import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { useEmployees } from "@/hooks/hrms/useEmployees";
import EmployeeListComp from "./EmployeeListComp";
import EmployeeFormComp from "./EmployeeFormComp";
import EmployeeSalaryComp from "./EmployeeSalaryComp";

const EmployeesPage = () => {
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
    //salary
    handleEmployeeSalary,
    empSalaryData,
    handleChangeEmpSalary,
    handleSaveEmpSalary,
    empSalaryList,
    handleDeleteSalary,
  } = useEmployees();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Employee List"
            : formData.id
              ? "Edit Employee"
              : "New Employee"}
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
          <EmployeeListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onEmployeeSalary={handleEmployeeSalary}
          />
        ) : currentView === "emp-salary" ? (
          <EmployeeSalaryComp
            isBusy={isBusy}
            errors={errors}
            formData={empSalaryData}
            onChange={handleChangeEmpSalary}
            onSave={handleSaveEmpSalary}
            dataList={empSalaryList}
            onDelete={handleDeleteSalary}
          />
        ) : (
          <EmployeeFormComp
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

export default EmployeesPage;
