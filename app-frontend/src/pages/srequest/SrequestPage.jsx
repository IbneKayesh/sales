import React, { useState, useRef, useEffect } from "react";
import { useSoMaster } from "@/hooks/srequest/useSoMaster";
import { useSoChild } from "@/hooks/srequest/useSoChild";
import { useContacts } from "@/hooks/setup/useContacts";
import { useItems } from "@/hooks/inventory/useItems";
import SrequestMasterListComponent from "./SrequestMasterListComponent";
import SrequestMasterFormComponent from "./SrequestMasterFormComponent";
import SrequestChildListComponent from "./SrequestChildListComponent";
import SrequestChildFormComponent from "./SrequestChildFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from "primereact/tabview";

const SrequestPage = () => {
  const toast = useRef(null);
  const {
    soMasters,
    toastBox: masterToastBox,
    isBusy: masterIsBusy,
    currentView: masterCurrentView,
    errors: masterErrors,
    formDataSoMaster,
    handleChange: handleMasterChange,
    handleCancel: handleMasterCancel,
    handleAddNew: handleMasterAddNew,
    handleEditSoMaster,
    handleDeleteSoMaster,
    handleSaveSoMaster,
  } = useSoMaster();

  const {
    soChildren,
    toastBox: childToastBox,
    isBusy: childIsBusy,
    currentView: childCurrentView,
    errors: childErrors,
    formDataSoChild,
    handleChange: handleChildChange,
    handleCancel: handleChildCancel,
    handleAddNew: handleChildAddNew,
    handleEditSoChild,
    handleDeleteSoChild,
    handleSaveSoChild,
  } = useSoChild();

  const { contacts } = useContacts();
  const { items } = useItems();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedMasterId, setSelectedMasterId] = useState(null);

  useEffect(() => {
    if (masterToastBox && toast.current) {
      toast.current.show({
        severity: masterToastBox.severity,
        summary: masterToastBox.summary,
        detail: masterToastBox.detail,
        life: 3000,
      });
    }
  }, [masterToastBox]);

  useEffect(() => {
    if (childToastBox && toast.current) {
      toast.current.show({
        severity: childToastBox.severity,
        summary: childToastBox.summary,
        detail: childToastBox.detail,
        life: 3000,
      });
    }
  }, [childToastBox]);

  const getMasterHeader = () => {
    const isList = masterCurrentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h2 className="m-0">
          {isList
            ? "Sales Order Masters"
            : formDataSoMaster.so_master_id
            ? "Edit Sales Order"
            : "Add New Sales Order"}
        </h2>

        {isList ? (
          <Button
            label="New Sales Order"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={handleMasterAddNew}
          />
        ) : (
          <Button
            type="button"
            label="Sales Orders"
            icon="pi pi-arrow-left"
            onClick={handleMasterCancel}
          />
        )}
      </div>
    );
  };

  const getChildHeader = () => {
    const isList = childCurrentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h2 className="m-0">
          {isList
            ? "Sales Order Items"
            : formDataSoChild.id
            ? "Edit Item"
            : "Add New Item"}
        </h2>

        {isList ? (
          <Button
            label="New Item"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={handleChildAddNew}
          />
        ) : (
          <Button
            type="button"
            label="Items"
            icon="pi pi-arrow-left"
            onClick={handleChildCancel}
          />
        )}
      </div>
    );
  };

  const handleMasterSelect = (masterId) => {
    setSelectedMasterId(masterId);
    setActiveTab(1); // Switch to child tab
  };

  return (
    <>
      <Toast ref={toast} />
      <TabView
        activeIndex={activeTab}
        onTabChange={(e) => setActiveTab(e.index)}
      >
        <TabPanel header="Sales Orders">
          <Card
            header={getMasterHeader()}
            className="bg-dark-200 border-round p-3"
          >
            {masterCurrentView === "list" ? (
              <SrequestMasterListComponent
                dataList={soMasters}
                onEdit={handleEditSoMaster}
                onDelete={handleDeleteSoMaster}
                onSelect={handleMasterSelect}
              />
            ) : (
              <SrequestMasterFormComponent
                isBusy={masterIsBusy}
                errors={masterErrors}
                formData={formDataSoMaster}
                onChange={handleMasterChange}
                onSave={handleSaveSoMaster}
                contacts={contacts}
              />
            )}
          </Card>
        </TabPanel>
        <TabPanel header="Order Items">
          <Card
            header={getChildHeader()}
            className="bg-dark-200 border-round p-3"
          >
            {childCurrentView === "list" ? (
              <SrequestChildListComponent
                dataList={soChildren.filter(
                  (child) =>
                    !selectedMasterId || child.so_master_id === selectedMasterId
                )}
                onEdit={handleEditSoChild}
                onDelete={handleDeleteSoChild}
                selectedMasterId={selectedMasterId}
              />
            ) : (
              <SrequestChildFormComponent
                isBusy={childIsBusy}
                errors={childErrors}
                formData={formDataSoChild}
                onChange={handleChildChange}
                onSave={handleSaveSoChild}
                items={items}
                soMasters={soMasters}
              />
            )}
          </Card>
        </TabPanel>
      </TabView>
    </>
  );
};

export default SrequestPage;
