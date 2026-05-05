import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useContacts from "@/hooks/crm/useContacts";
import ContactsListComp from "./ContactsListComp";
import ContactsFormComp from "./ContactsFormComp";

const ContactsPage = () => {
  const {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    cntct_ctype_Options,
    cntct_sorce_Options,
    cntct_trtry_Options,
    cntct_tarea_Options,
    cntct_dzone_Options,
    dzone_cntry_Options,
    cntct_crncy_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
    //contact address
    formDataAddress,
    handleChangeAddress,
    handleSubmitAddressClick,
    dataListAddress,
    handleEditAddress,
  } = useContacts();

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
        <ContactsListComp
          pageAuth={pageAuth}
          dataList={dataList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {isForm && (
        <ContactsFormComp
          formData={formData}
          errors={errors}
          onChange={handleChange}
          cntct_ctype_Options={cntct_ctype_Options}
          cntct_sorce_Options={cntct_sorce_Options}
          cntct_trtry_Options={cntct_trtry_Options}
          cntct_tarea_Options={cntct_tarea_Options}
          cntct_dzone_Options={cntct_dzone_Options}
          dzone_cntry_Options={dzone_cntry_Options}
          cntct_crncy_Options={cntct_crncy_Options}
          //contact address
          formDataAddress={formDataAddress}
          onChangeAddress={handleChangeAddress}
          onSubmitAddressClick={handleSubmitAddressClick}
          dataListAddress={dataListAddress}
          onEditAddress={handleEditAddress}
        />
      )}
    </Card>
  );
};

export default ContactsPage;
