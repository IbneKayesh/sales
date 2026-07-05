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
    djrnl_chtac_Options,
    djrnl_party_Options,
    formDataItems,
    dataListItems,
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
    handleRemoveItemsClick,
  } = useJournal();

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
                disabled={formData.id}
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
        <JournalListComp
          pageAuth={pageAuth}
          dataList={dataList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
     {crView === "SYS_FRM_1" && (
        <JournalFormComp
          formData={formData}
          errors={errors}
          onChange={handleChange}
          mjrnl_dpart_Options={mjrnl_dpart_Options}
          mjrnl_crncy_Options={mjrnl_crncy_Options}
          mjrnl_fsyar_Options={mjrnl_fsyar_Options}
          mjrnl_acprd_Options={mjrnl_acprd_Options}
          mjrnl_trtyp_Options={mjrnl_trtyp_Options}
          djrnl_chtac_Options={djrnl_chtac_Options}
          djrnl_party_Options={djrnl_party_Options}
          onChangeItems={handleChangeItems}
          onAddToListClick={handleAddToListClick}
          formDataItems={formDataItems}
          dataListItems={dataListItems}
          onRemoveItemsClick={handleRemoveItemsClick}
        />
      )}
    </Card>
  );
};

export default JournalPage;
