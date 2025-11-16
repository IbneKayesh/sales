import React, { useState, useRef, useEffect } from "react";
import { usePoMaster } from "@/hooks/prequest/usePoMaster";
import { usePoChild } from "@/hooks/prequest/usePoChild";
import { useItems } from "@/hooks/inventory/useItems";
import PrequestMasterListComponent from "./PrequestMasterListComponent";
import PrequestMasterFormComponent from "./PrequestMasterFormComponent";
import PrequestChildEditableTableComponent from "./PrequestChildEditableTableComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from "primereact/tabview";

const PrequestPage = () => {
  const { items } = useItems();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedMasterId, setSelectedMasterId] = useState(null);

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
    handleRefresh,
    handleSavePoMaster,
    poTypeOptions,
    refNoOptions,
  } = usePoMaster();

  const {
    poChildren,
    toastBox: childToastBox,
    isBusy: childIsBusy,
    handleSaveAll,
  } = usePoChild(selectedMasterId?.po_master_id);

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
        <h3 className="m-0">
          {isList
            ? "Purchase Order"
            : formDataPoMaster.po_master_id
            ? "Edit Purchase Order"
            : "Add New Purchase Order"}
        </h3>

        {isList ? (
          <div className="flex gap-2">
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              onClick={handleRefresh}
            />
            <Button
              label="New Purchase Order"
              icon="pi pi-plus"
              size="small"
              onClick={handleMasterAddNew}
            />
          </div>
        ) : (
          <Button
            label="Purchase Orders"
            icon="pi pi-arrow-left"
            size="small"
            onClick={handleMasterCancel}
          />
        )}
      </div>
    );
  };

  const getChildHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <h4 className="m-0">
          {selectedMasterId?.order_no} ({selectedMasterId?.ref_no})
        </h4>
      </div>
    );
  };

  const handleMasterSelect = (rowData) => {
    setSelectedMasterId(rowData);
    setActiveTab(1); // Switch to child tab
  };

  return (
    <>
      <Toast ref={toast} />
      <TabView
        activeIndex={activeTab}
        onTabChange={(e) => setActiveTab(e.index)}
      >
        <TabPanel header="Purchase Orders">
          <Card
            header={getMasterHeader()}
            className="bg-dark-200 border-round p-2"
          >
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
                poTypeOptions={poTypeOptions}
                refNoOptions={refNoOptions}
              />
            )}
          </Card>
        </TabPanel>
        <TabPanel header="Order Items">
          <Card
            header={getChildHeader()}
            className="bg-dark-200 border-round p-2"
          >
            <PrequestChildEditableTableComponent
              selectedMasterId={selectedMasterId}
              poChildren={poChildren}
              items={items}
              onSaveAll={handleSaveAll}
            />
          </Card>
        </TabPanel>
      </TabView>
    </>
  );
};

export default PrequestPage;
