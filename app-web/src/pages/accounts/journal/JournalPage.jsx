import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useJournal from "@/hooks/accounts/useJournal.js";
import JournalFormComp from "./JournalFormComp";
import JournalListComp from "./JournalListComp";

const JournalPage = () => {
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
    mjrnl_crncy_Options,
    mjrnl_fsyar_Options,
    mjrnl_acprd_Options,
    mjrnl_trtyp_Options,
    formDataItems,
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
    handleChangeItems,
    handleAddToListClick,
  } = useJournal();

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
            {isForm && (
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
      {isList && (
        <JournalListComp
          pageAuth={pageAuth}
          dataList={dataList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {isForm && (
        <JournalFormComp
          formData={formData}
          errors={errors}
          onChange={handleChange}
          mjrnl_dpart_Options={mjrnl_dpart_Options}
          mjrnl_crncy_Options={mjrnl_crncy_Options}
          mjrnl_fsyar_Options={mjrnl_fsyar_Options}
          mjrnl_acprd_Options={mjrnl_acprd_Options}
          mjrnl_trtyp_Options={mjrnl_trtyp_Options}
          onChangeItems={handleChangeItems}
          onAddToListClick={handleAddToListClick}
          formDataItems={formDataItems}
        />
      )}
    </Card>
  );
};

export default JournalPage;
