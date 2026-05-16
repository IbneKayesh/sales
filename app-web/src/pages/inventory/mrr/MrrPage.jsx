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
    formData,
    errors,
    dataList,
    //other states
    migrn_cntct_Options,
    price_items_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
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
          formData={formData}
          errors={errors}
          onChange={handleChange}
          migrn_cntct_Options={migrn_cntct_Options}
          price_items_Options={price_items_Options}
        />
      )}
    </Card>
  );
};

export default MrrPage;
