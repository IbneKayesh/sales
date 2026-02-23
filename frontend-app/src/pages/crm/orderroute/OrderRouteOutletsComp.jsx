import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { formatDate } from "@/utils/datetime";
import ActiveRowCell from "@/components/ActiveRowCell";
import { Button } from "primereact/button";
import { useContactsSgd } from "@/hooks/crm/useContactsSgd";
import { useEmployeesSgd } from "@/hooks/hrms/useEmployeesSgd";
import { Dropdown } from "primereact/dropdown";
import { useEffect } from "react";

const OrderRouteOutletsComp = ({
  dataList,
  onDelete,
  selectedRoute,
  outletFormData,
  onChange,
  errors,
  onSave,
}) => {
  const { dataList: outletOptions, handleLoadRouteOutlets } = useContactsSgd();
  const { dataList: employeeOptions, handleLoadAvailableRouteEmployees } =
    useEmployeesSgd();
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    if (selectedRoute.id) {
      handleLoadRouteOutlets(selectedRoute.id);
    }
    if (selectedRoute.id && selectedRoute.total_outlets === 0) {
      handleLoadAvailableRouteEmployees();
    }
  }, [selectedRoute]);

  useEffect(() => {
    if (employeeOptions) {
      setEmployeeList(employeeOptions);
    }
  }, [employeeOptions]);

  useEffect(() => {
    if (selectedRoute.id && selectedRoute.total_outlets > 0) {
      setEmployeeList([
        {
          id: dataList[0]?.cnrut_empid,
          emply_ename: dataList[0]?.emply_ename,
        },
      ]);
    }
  }, [dataList]);

  const [globalFilter, setGlobalFilter] = useState(null);

  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="flex flex-wrap align-items-center gap-2">
          <div className="p-inputgroup w-full md:w-25rem">
            <span className="p-inputgroup-addon bg-gray-100">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              type="search"
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="p-inputtext-sm"
            />
          </div>
        </div>

        <div className="flex align-items-center gap-2"></div>
      </div>
    );
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.cntct_cntnm}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData);
      },
      reject: () => {
        // Do nothing on reject
      },
    });
  };

  const action_BT = (rowData) => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          icon="pi pi-trash"
          size="small"
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
          severity="danger"
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  const cnrut_lvdat_BT = (rowData) => {
    return <>{formatDate(rowData.cnrut_lvdat)}</>;
  };

  const cntct_cntnm_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.cntct_cntnm}</span>
        <span className="text-sm text-blue-500">
          {rowData.cntct_cntps}, {rowData.cntct_cntno}
        </span>
        <span className="text-sm text-blue-500">{rowData.cntct_ofadr}</span>
      </div>
    );
  };

  const emply_ecode_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.emply_ename}</span>
        <span className="text-sm text-blue-500">{rowData.emply_ecode}</span>
      </div>
    );
  };

  return (
    <div className="p-1">
      <div className="p-3 border-round-xl shadow-2 bg-white mb-3">
        {/* Header */}
        <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-4">
          {/* Title Section */}
          <div>
            <h2 className="m-0 text-900 font-semibold">
              🚚 Order Route Outlets
            </h2>
            <small className="text-600">Manage route outlet details</small>
          </div>

          {/* Route Details */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-2 bg-blue-50 text-blue-700 border-round-lg text-sm font-medium">
              📍 {selectedRoute.rutes_rname}
            </span>
            <span className="px-3 py-2 bg-green-50 text-green-700 border-round-lg text-sm font-medium">
              📅 {selectedRoute.rutes_dname}
            </span>
            <span className="px-3 py-2 bg-purple-50 text-purple-700 border-round-lg text-sm font-medium">
              🗺 {selectedRoute.trtry_wname}
            </span>
            <span className="px-3 py-2 bg-orange-50 text-orange-700 border-round-lg text-sm font-medium">
              🏘 {selectedRoute.tarea_tname}
            </span>
            <span className="px-3 py-2 bg-teal-50 text-teal-700 border-round-lg text-sm font-medium">
              🌎 {selectedRoute.dzone_dname}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-top-1 border-200 my-4"></div>

        {/* Form Section */}
        <div className="grid formgrid p-fluid">
          <div className="field col-12 md:col-2">
            <label
              htmlFor="cnrut_srlno"
              className="font-medium text-700 mb-2 block text-red-800"
            >
              Sl No
            </label>
            <InputText
              name="cnrut_srlno"
              value={outletFormData.cnrut_srlno}
              onChange={(e) => onChange("cnrut_srlno", e.target.value)}
              className={`w-full ${errors.cnrut_srlno ? "p-invalid" : ""}`}
              placeholder={`Enter Sl No`}
            />
          </div>

          <div className="field col-12 md:col-4">
            <label
              htmlFor="cnrut_cntct"
              className="font-medium text-700 mb-2 block"
            >
              Outlet
            </label>
            <Dropdown
              name="cnrut_cntct"
              value={outletFormData.cnrut_cntct}
              options={outletOptions}
              onChange={(e) => onChange("cnrut_cntct", e.value)}
              className={`w-full ${errors.cnrut_cntct ? "p-invalid" : ""}`}
              placeholder={`Select Outlet`}
              optionLabel="cntct_cntnm"
              optionValue="id"
            />
          </div>

          <div className="field col-12 md:col-4">
            <label
              htmlFor="cnrut_empid"
              className="font-medium text-700 mb-2 block"
            >
              Employee
            </label>
            <Dropdown
              name="cnrut_empid"
              value={outletFormData.cnrut_empid}
              options={employeeList}
              onChange={(e) => onChange("cnrut_empid", e.value)}
              className={`w-full ${errors.cnrut_empid ? "p-invalid" : ""}`}
              placeholder={`Select Employee`}
              optionLabel="emply_ename"
              optionValue="id"
            />
          </div>

          <div className="field col-12 md:col-2 justify-content-end mt-4">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={"Add Outlet"}
              icon={"pi pi-check"}
              severity="success"
              size="small"
            />
          </div>
        </div>
      </div>
      <ConfirmDialog />
      <DataTable
        value={dataList}
        paginator
        rows={15}
        rowsPerPageOptions={[15, 50, 100]}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
        globalFilter={globalFilter}
        globalFilterFields={["cnrut_srlno", "cnrut_lvdat"]}
        header={header()}
      >
        <Column field="cnrut_srlno" header="Sl No" sortable />
        <Column field="cnrut_lvdat" header="Last Visit" body={cnrut_lvdat_BT} />
        <Column field="cntct_cntnm" header="Outlet" body={cntct_cntnm_BT} />
        <Column field="emply_ecode" header="Employee" body={emply_ecode_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default OrderRouteOutletsComp;
