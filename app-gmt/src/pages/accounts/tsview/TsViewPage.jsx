import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useTsView from "@/hooks/accounts/useTsView";
import TsViewFormComp from "./TsViewFormComp";
import TsViewListComp from "./TsViewListComp";

const TsViewPage = () => {
  const {
    //hooks
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
  } = useTsView();

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
              //disabled={isList}
              disabled={true}
            />
            <Button
              label="Search"
              icon="pi pi-search"
              size="small"
              severity="info"
              onClick={handleSearchClick}
              //disabled={isForm}
              disabled={true}
            />
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              size="small"
              severity="warning"
              onClick={handleRefreshClick}
              //disabled={isForm}
            />
            <Button
              label="New"
              icon="pi pi-plus"
              size="small"
              severity="help"
              onClick={handleAddNewClick}
              disabled={true}
            />
            <Button
              label="Submit"
              icon="pi pi-save"
              size="small"
              severity="success"
              onClick={handleSubmitClick}
              //disabled={isList}
              disabled={true}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Card title={cardTitle} className="shadow-2 border-round p-2">
      {isList && (
        <TsViewListComp
          dataList={dataList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {isForm && (
        <TsViewFormComp
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />
      )}
    </Card>
  );
};

export default TsViewPage;
