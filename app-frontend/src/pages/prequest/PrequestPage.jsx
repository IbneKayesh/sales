import React, { useState, useRef, useEffect } from "react";
import { usePoMaster } from "@/hooks/prequest/usePoMaster";
import { usePoChild } from "@/hooks/prequest/usePoChild";
import { useContacts } from "@/hooks/setup/useContacts";
import { useItems } from "@/hooks/inventory/useItems";
import PrequestMasterListComponent from "./PrequestMasterListComponent";
import PrequestMasterFormComponent from "./PrequestMasterFormComponent";
import PrequestChildListComponent from "./PrequestChildListComponent";
import PrequestChildFormComponent from "./PrequestChildFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from "primereact/tabview";

const PrequestPage = () => {
  const toast = useRef(null);
  const {
    poMasters,
    toastBox: masterToastBox,
    isBusy: masterIsBusy,
    currentView: masterCurrentView,
    errors: masterErrors,
    formDataPoMaster,
    handleChange: handleMasterChange,
    handleCancel: handleMasterCancel,
    handleAddNew: handleMasterAddNew,
    handleEditPoMaster,
    handleDeletePoMaster,
    handleSavePoMaster,
  } = usePoMaster();

  const {
    poChildren,
    toastBox: childToastBox,
    isBusy: childIsBusy,
    currentView: childCurrentView,
    errors: childErrors,
    formDataPoChild,
    handleChange: handleChildChange,
    handleCancel: handleChildCancel,
    handleAddNew: handleChildAddNew,
    handleEditPoChild,
    handleDeletePoChild,
    handleSavePoChild,
  } = usePoChild();

  const { contacts } = useContacts();
  const { items } = useItems();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedMasterId, setSelectedMasterId] = useState(null);

  useEffect(() => {
    if (masterToastBox) {
      toast.current.show({
        severity: masterToastBox.severity,
        summary: masterToastBox.summary,
        detail: masterToastBox.detail,
        life: 3000,
      });
    }
  }, [masterToastBox]);

  useEffect(() => {
    if (childToastBox) {
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
          {isList ? "Purchase Order Masters" : formDataPoMaster.po_master_id ? "Edit Purchase Order" : "Add New Purchase Order"}
        </h2>

        {isList ? (
          <Button
            label="New Purchase Order"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={handleMasterAddNew}
          />
        ) : (
          <Button
            type="button"
            label="Purchase Orders"
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
          {isList ? "Purchase Order Items" : formDataPoChild.id ? "Edit Item" : "Add New Item"}
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
      <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
        <TabPanel header="Purchase Orders">
          <Card header={getMasterHeader()} className="bg-dark-200 border-round p-3">
            {masterCurrentView === "list" ? (
              <PrequestMasterListComponent
                dataList={poMasters}
                onEdit={handleEditPoMaster}
                onDelete={handleDeletePoMaster}
                onSelect={handleMasterSelect}
              />
            ) : (
              <PrequestMasterFormComponent
                isBusy={masterIsBusy}
                errors={masterErrors}
                formData={formDataPoMaster}
                onChange={handleMasterChange}
                onSave={handleSavePoMaster}
                contacts={contacts}
              />
            )}
          </Card>
        </TabPanel>
        <TabPanel header="Order Items">
          <Card header={getChildHeader()} className="bg-dark-200 border-round p-3">
            {childCurrentView === "list" ? (
              <PrequestChildListComponent
                dataList={poChildren.filter(child => !selectedMasterId || child.po_master_id === selectedMasterId)}
                onEdit={handleEditPoChild}
                onDelete={handleDeletePoChild}
                selectedMasterId={selectedMasterId}
              />
            ) : (
              <PrequestChildFormComponent
                isBusy={childIsBusy}
                errors={childErrors}
                formData={formDataPoChild}
                onChange={handleChildChange}
                onSave={handleSavePoChild}
                items={items}
                poMasters={poMasters}
              />
            )}
          </Card>
        </TabPanel>
      </TabView>
    </>
  );
};

export default PrequestPage;
