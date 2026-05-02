import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useContacts from "@/hooks/crm/useContacts";
import ContactsListComp from "./ContactsListComp";
import ContactsFormComp from "./ContactsFormComp";

const ContactsPage = () => {
  const {
    //hooks
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    cntct_ctype_options,
    cntct_sorce_options,
    cntct_crncy_options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
  } = useContacts();

  const isList = crView === "list" && true;
  const isForm = crView === "form" && true;

  const cardTitle = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <span className="page-title-text">{crTitle}</span>
        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              label="Back"
              icon="pi pi-arrow-left"
              size="small"
              severity="secondary"
              onClick={handleBackClick}
              disabled={isList}
            />
            <Button
              label="Search"
              icon="pi pi-search"
              size="small"
              severity="info"
              onClick={handleSearchClick}
              disabled={isForm}
            />
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              size="small"
              severity="warning"
              onClick={handleRefreshClick}
              disabled={isForm}
            />
            <Button
              label="New"
              icon="pi pi-plus"
              size="small"
              severity="help"
              onClick={handleAddNewClick}
            />
            <Button
              label="Submit"
              icon="pi pi-save"
              size="small"
              severity="success"
              onClick={handleSubmitClick}
              disabled={isList}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };
  return (
    <Card title={cardTitle} className="shadow-1 p-2">
      {isList && (
        <ContactsListComp
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
          cntct_ctype_options={cntct_ctype_options}
          cntct_sorce_options={cntct_sorce_options}
          cntct_crncy_options={cntct_crncy_options}
        />
      )}
    </Card>
  );
};
export default ContactsPage;
