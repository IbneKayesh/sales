import useOutlets from "@/hooks/crm/useOutlets";
import OutletListComp from "./OutletListComp";
import OutletViewComp from "./OutletViewComp";
import OutletFormComp from "./OutletFormComp";

const OutletsPage = () => {
  const {
    outlets,
    viewComp,
    selectedOutlet,
    searchTerm,
    setSearchTerm,
    handleViewDetail,
    handleAdd,
    handleBack,
    handleEdit,
    handleCancel,
  } = useOutlets();

  return (
    <>
      {viewComp === "list" && (
        <OutletListComp
          outlets={outlets}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleViewDetail={handleViewDetail}
          handleAdd={handleAdd}
        />
      )}
      {viewComp === "view" && (
        <OutletViewComp
          outlet={selectedOutlet}
          handleBack={handleBack}
          handleEdit={handleEdit}
        />
      )}
      {viewComp === "form" && (
        <OutletFormComp
          outlet={selectedOutlet}
          handleBack={handleBack}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
};

export default OutletsPage;
