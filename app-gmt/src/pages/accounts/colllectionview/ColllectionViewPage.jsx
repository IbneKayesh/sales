import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useColllectionView from "@/hooks/accounts/useColllectionView";
import ColllectionViewFormComp from "./ColllectionViewFormComp";
import ColllectionViewListComp from "./ColllectionViewListComp";
import SearchComp from "./SearchComp";

const ColllectionViewPage = () => {
  const {
    //hooks
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    formDataSearch,
    aemp_id_Options,
    clpt_id_Options,
    //functions
    handleChange,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleFindClick,
    handleView,
    handleCloseClick,
  } = useColllectionView();

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
              label={crView === "search" ? "Hide" : "Search"}
              icon={crView === "search" ? "pi pi-filter-slash" : "pi pi-search"}
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
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Card title={cardTitle} className="shadow-2 border-round p-2">
      {crView === "search" && (
        <SearchComp
          formData={formDataSearch}
          onChange={handleChange}
          onSubmitClick={handleFindClick}
          aemp_id_Options={aemp_id_Options}
          clpt_id_Options={clpt_id_Options}
        />
      )}
      {(crView === "list" || crView === "form") && (
        <ColllectionViewListComp dataList={dataList} onEdit={handleView} />
      )}
      {isForm && (
        <ColllectionViewFormComp
          formData={formData}
          showDialog={crView === "form"}
          onCloseClick={handleCloseClick}
        />
      )}
    </Card>
  );
};

export default ColllectionViewPage;
