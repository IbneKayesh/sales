import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave, IconPrint } from "@/icons";
import Button from "@/components/Button";
import useDeliveryTrips from "@/hooks/M02/useDeliveryTrips";
import DeliveryTripsList from "./DeliveryTripsList";
import DeliveryTripsForm from "./DeliveryTripsForm";
import ItemList from "./ItemList";
import DeliveryTripPrint from "./DeliveryTripPrint";
import usePrint from "@/hooks/usePrint";

const DeliveryTripsPage = () => {
  const print = usePrint();
  const {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    dpart_Options,
    refid_Options,
    party_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //invoice items
    handleDeleteItem,
    //print
    formDataPrint,
    handlePrint,
  } = useDeliveryTrips();

  const handleShowPrint = async (rowData) => {
    await handlePrint(rowData);
    print.show();
  };

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Delivery Trips"
            subtitle={`${listData.length} Deliveries`}
          />
          <PageCardActions>
            {pgView === "SYS_VW_LST_1" && (
              <Button variant="info" size="sm" onClick={handleSearch}>
                <IconSearch size={14} className="icon-left" />
                Search
              </Button>
            )}
            {pgView === "SYS_VW_LST_1" && (
              <Button size="sm" onClick={handleAddNew}>
                <IconPlus size={14} className="icon-left" />
                Add
              </Button>
            )}
            {pgView === "SYS_VW_FRM_1" && (
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                <IconClose size={14} className="icon-left" />
                Cancel
              </Button>
            )}
            {pgView === "SYS_VW_FRM_1" && formData?.id && (
              <Button variant="info" size="sm" onClick={handleShowPrint}>
                <IconPrint size={14} className="icon-left" />
                Print / Export
              </Button>
            )}
            {pgView === "SYS_VW_FRM_1" && (
              <Button variant="info" size="sm" onClick={handleSubmit}>
                <IconSave size={14} className="icon-left" />
                {formData?.id ? "Update" : "Create"}
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <DeliveryTripsList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && (
            <DeliveryTripsForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              dpart_Options={dpart_Options}
              party_Options={party_Options}
              refid_Options={refid_Options}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && listDataItem.length > 0 && (
            <ItemList
              readOnly={readOnly}
              listData={listDataItem}
              // onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          )}

          {/*Print preview*/}
          <DeliveryTripPrint
            open={print.open}
            onClose={print.hide}
            formData={formDataPrint}
          />
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default DeliveryTripsPage;
