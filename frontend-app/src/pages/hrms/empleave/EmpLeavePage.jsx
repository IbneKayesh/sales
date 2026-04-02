import { useEmpLeave } from "@/hooks/hrms/useEmpLeave";
import EmpLeaveListComp from "./EmpLeaveListComp";
import EmpLeaveFormComp from "./EmpLeaveFormComp";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import SearchComp from "./SearchComp";

const EmpLeavePage = () => {
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
     //search
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,
    searchOptions,
    //emp leave
    handleEmpLeaveList,
    empLeaveList
  } = useEmpLeave();


  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Employee Leave List"
            : formData.id
              ? "Edit Leave Entitlement"
              : "New Leave Entitlement"}
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
          <>
            <SearchComp
              formData={searchBoxData}
              handleChange={handleChangeSearchInput}
              handleSearch={handleSearch}
              searchOptions={searchOptions}
            />
            <EmpLeaveListComp
              dataList={dataList}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        ) : (
          <EmpLeaveFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            onEmpLeaveList={handleEmpLeaveList}
            dataList={empLeaveList}
          />
        )}
      </Card>
    </>
  );
};

export default EmpLeavePage;
