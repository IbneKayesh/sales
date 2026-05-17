import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useMrr from "@/hooks/inventory/useMrr.js";
import MrrFormComp from "./MrrFormComp";
import MrrListComp from "./MrrListComp";

const MrrPage = () => {
  const {
    //hooks
    pageAuth,
    crTitle,
    crView,
    readOnly,
    formData,
    errors,
    dataList,
    //other states
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
    //other functions
    //entry forms + items
    mrrmt_cntct_Options,
    mrrdt_items_Options,
    dataListItems,
    formDataItems,
    handleChangeItems,
    handleAddItemsClick,
    handleRemoveItemsClick,
    //costing forms + costing items
    formDataCosting,
    dataListCosting,
    mrrcs_csmod_Options,
    mrrcs_clmod_Options,
    mrrcs_chead_Options,
    handleChangeCosting,
    handleAddCostingClick,
    handleRemoveCostingClick,
    //payment forms + payment items
    formDataPymt,
    dataListPymt,
    mrrpy_pmode_Options,
    handleChangePymt,
    handleAddPaymentClick,
    handleRemovePaymentClick,
  } = useMrr();

  const isList = crView === "list" && true;
  const isForm = crView === "form" && true;

  const cardTitle = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <span className="page-title-text">{crTitle}</span>
        <div className="flex gap-2">
          <ButtonGroup>
            {crView === "SYS_FRM_1" && (
              <Button
                label="Back"
                icon="pi pi-arrow-left"
                size="small"
                severity="secondary"
                onClick={handleBackClick}
              />
            )}
            {crView === "SYS_LST_1" && (
              <Button
                label="Find"
                icon="pi pi-search"
                size="small"
                severity="info"
                onClick={handleSearchClick}
              />
            )}
            {crView === "SYS_LST_1" && (
              <Button
                label="Refresh"
                icon="pi pi-refresh"
                size="small"
                severity="warning"
                onClick={handleRefreshClick}
              />
            )}
            <Button
              label="New"
              icon="pi pi-plus"
              size="small"
              severity="help"
              onClick={handleAddNewClick}
            />
            {crView === "SYS_FRM_1" && (
              <Button
                label="Submit"
                icon="pi pi-save"
                size="small"
                severity="success"
                onClick={handleSubmitClick}
              />
            )}
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Card title={cardTitle} className="shadow-2 border-round p-2">
      {crView === "SYS_LST_1" && (
        <MrrListComp
          pageAuth={pageAuth}
          dataList={dataList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {crView === "SYS_FRM_1" && (
        <MrrFormComp
          readOnly={readOnly}
          formData={formData}
          errors={errors}
          onChange={handleChange}
          mrrmt_cntct_Options={mrrmt_cntct_Options}
          mrrdt_items_Options={mrrdt_items_Options}
          dataListItems={dataListItems}
          formDataItems={formDataItems}
          onChangeItems={handleChangeItems}
          onAddItemsClick={handleAddItemsClick}
          onRemoveItemsClick={handleRemoveItemsClick}
          //costing forms + costing items
          formDataCosting={formDataCosting}
          dataListCosting={dataListCosting}
          mrrcs_csmod_Options={mrrcs_csmod_Options}
          mrrcs_clmod_Options={mrrcs_clmod_Options}
          mrrcs_chead_Options={mrrcs_chead_Options}
          onChangeCosting={handleChangeCosting}
          onAddCostingClick={handleAddCostingClick}
          onRemoveCostingClick={handleRemoveCostingClick}
          //payment forms + payment items
          formDataPymt={formDataPymt}
          dataListPymt={dataListPymt}
          mrrpy_pmode_Options={mrrpy_pmode_Options}
          onChangePymt={handleChangePymt}
          onAddPaymentClick={handleAddPaymentClick}
          onRemovePaymentClick={handleRemovePaymentClick}
        />
      )}
    </Card>
  );
};

export default MrrPage;
