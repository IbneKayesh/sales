import React, { useRef, useEffect } from "react";
import useSettings from "@/hooks/setup/useSettings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

const SettingsPage = () => {
  const toast = useRef(null);
  const { toastBox, dataList } = useSettings();

  useEffect(() => {
    if (toastBox && toast.current) {
      toast.current.show({
        severity: toastBox.severity,
        summary: toastBox.summary,
        detail: toastBox.detail,
        life: 3000,
      });
    }
  }, [toastBox]);

  return (
    <>
      <Toast ref={toast} />
      <Card header={"Settings"} className="bg-dark-200 border-round p-3">
        <DataTable value={dataList} emptyMessage="No data found." size="small">
          <Column field="setting_page" header="Page" />
          <Column field="setting_name" header="Name" />
          <Column field="setting_key" header="Key" />
          <Column field="setting_value" header="Value" />
        </DataTable>
      </Card>
    </>
  );
};

export default SettingsPage;
