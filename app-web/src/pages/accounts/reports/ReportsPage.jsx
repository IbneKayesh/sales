import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useReports from "@/hooks/accounts/useReports.js";
import SearchComp from "./SearchComp";
import TBComp from "./TBComp";

const ReportsPage = () => {
  const {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    mjrnl_dpart_Options,
    mjrnl_fsyar_Options,
    mjrnl_acprd_Options,
    djrnl_chtac_Options,
    djrnl_party_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleQueryClick
    //other functions
  } = useReports();

  const isList = crView === "list" && true;
  const isForm = crView === "form" && true;

  const cardTitle = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <span className="page-title-text">{crTitle}</span>
        <div className="flex gap-2">
          <ButtonGroup>
            {isForm && (
              <Button
                label="Back"
                icon="pi pi-arrow-left"
                size="small"
                severity="secondary"
                onClick={handleBackClick}
              />
            )}
            {isList && (
              <Button
                label="Find"
                icon="pi pi-search"
                size="small"
                severity="info"
                onClick={handleSearchClick}
              />
            )}
            {isList && (
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
            {crView === "search" && (
              <Button
                label="Search"
                icon="pi pi-search"
                size="small"
                severity="success"
                onClick={handleQueryClick}
              />
            )}
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Card title={cardTitle} className="shadow-2 border-round p-2">
      {JSON.stringify(dataList)}
      {crView === "search" && (
        <SearchComp
          formData={formData}
          errors={errors}
          onChange={handleChange}
          mjrnl_dpart_Options={mjrnl_dpart_Options}
          mjrnl_fsyar_Options={mjrnl_fsyar_Options}
          mjrnl_acprd_Options={mjrnl_acprd_Options}
          djrnl_chtac_Options={djrnl_chtac_Options}
          djrnl_party_Options={djrnl_party_Options}
        />
      )}
       {crView === "SYS_TB1" && (
        <TBComp
          pageAuth={pageAuth}
          dataList={dataList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </Card>
  );
};

export default ReportsPage;
