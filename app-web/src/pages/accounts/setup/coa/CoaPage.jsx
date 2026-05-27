import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useCoa from "@/hooks/accounts/useCoa";
import CoaFormComp from "./CoaFormComp";
import CoaListComp from "./CoaListComp";

const CoaPage = () => {
  const {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    chtac_chtac_Options,
    chtac_ctype_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
  } = useCoa();

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
        <CoaListComp
          pageAuth={pageAuth}
          dataList={dataList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {crView === "SYS_FRM_1" && (
        <CoaFormComp
          formData={formData}
          errors={errors}
          onChange={handleChange}
          chtac_chtac_Options={chtac_chtac_Options}
          chtac_ctype_Options={chtac_ctype_Options}
        />
      )}
    </Card>
  );
};

export default CoaPage;
