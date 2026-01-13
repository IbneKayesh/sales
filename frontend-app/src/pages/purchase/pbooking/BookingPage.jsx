import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import EntryComp from "./EntryComp";
import { usePbooking } from "@/hooks/purchase/usePbooking";

const BookingPage = () => {
  const {
    dataList,
    isBusy,
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
  } = usePbooking();

    const getHeader = () => {
      const isList = currentView === "list";
  
      return (
        <div className="flex align-items-center justify-content-between">
          <h3 className="m-0">
            {isList ? "Booking List" : formData.id ? "Edit Booking" : "Add New Booking"}
          </h3>
  
          <div className="flex gap-2">
            <ButtonGroup>
              <Button
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
    <Card header={getHeader()} className="bg-dark-200 border-round p-3">
      {/* {JSON.stringify(dataList)} */}
      <EntryComp
        errors={errors}
        formData={formData}
        handleChange={handleChange}
      />
    </Card>
  );
};

export default BookingPage;
