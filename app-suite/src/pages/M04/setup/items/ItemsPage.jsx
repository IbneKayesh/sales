import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import {
  IconSearch,
  IconClose,
  IconPlus,
  IconSave,
  IconChevronLeft,
  IconUser,
  IconDollar,
} from "@/icons";
import Button from "@/components/Button";
import Modal, { ModalHeader, ModalTitle, ModalBody } from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import useItems from "@/hooks/M04/useItems";
import ItemsList from "./ItemsList";
import ItemsForm from "./ItemsForm";
import PriceList from "./PriceList";
import PriceForm from "./PriceForm";
import PriceLedger from "./PriceLedger";
import ItemContactForm from "./ItemContactForm";

const ItemsPage = () => {
  const {
    isBusy,
    pgView,
    pageAuth,
    tcVisibleItem,
    readOnly,
    stopEdit,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    units_Options,
    sgrup_Options,
    scatg_Options,
    brand_Options,
    dpart_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //price
    thisItem,
    handlePrice,
    handleChangePrice,
    handleEditPrice,
    handleDeletePrice,
    handleAddNewPrice,
    handleCancelPrice,
    handleSubmitPrice,
    //ledger
    selectedItemPrice,
    listDataLedger,
    handleLedger,
    //item contact
    cntct_Options,
    formDataCntct,
    listDataCntct,
    handleChangeCntct,
    handleDeleteCntct,
    handleSubmitCntct,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
    //filter
    mcatg_Options,
    formDataFilter,
  } = useItems();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={
              ["SYS_VW_LST_1", "SYS_VW_FRM_1"].some((view) =>
                pgView.includes(view),
              )
                ? "Items"
                : "Prices"
            }
            subtitle={
              ["SYS_VW_LST_1", "SYS_VW_FRM_1"].some((view) =>
                pgView.includes(view),
              )
                ? listData.length + " Items"
                : listDataItem.length + " Prices"
            }
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
            {pgView === "SYS_VW_FRM_1" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShowModal("SUPPLIER")}
              >
                <IconUser size={14} className="icon-left" />
                Supplier
              </Button>
            )}
            {pgView === "SYS_VW_FRM_1" && (
              <Button variant="info" size="sm" onClick={handleSubmit}>
                <IconSave size={14} className="icon-left" />
                {formData?.id ? "Update" : "Create"}
              </Button>
            )}
            {pgView === "SYS_VW_LST_2" && (
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                <IconChevronLeft size={14} className="icon-left" />
                Items
              </Button>
            )}
            {pgView === "SYS_VW_LST_2" && (
              <Button size="sm" onClick={handleAddNewPrice}>
                <IconPlus size={14} className="icon-left" />
                Add
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <ItemsList
              cfColumns={tcVisibleItem.filter(
                (f) => f.tabcl_table === "SYS_INVENTORY_ITEMS_LIST",
              )}
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPrice={handlePrice}
              mcatg_Options={mcatg_Options}
              formData={formDataFilter}
              onChange={handleChange}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && (
            <ItemsForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              //others
              units_Options={units_Options}
              sgrup_Options={sgrup_Options}
              scatg_Options={scatg_Options}
              brand_Options={brand_Options}
              //item contact
              listDataCntct={listDataCntct}
              onDeleteCntct={handleDeleteCntct}
            />
          )}

          {pgView === "SYS_VW_LST_2" && (
            <>
              <p className="text-indigo-700 p-1">
                Item: {thisItem.items_iname}
              </p>
              <PriceList
                cfColumns={tcVisibleItem.filter(
                  (f) => f.tabcl_table === "SYS_INVENTORY_ITEMS_PRICE_LIST",
                )}
                listData={listDataItem}
                onEdit={handleEditPrice}
                onDelete={handleDeletePrice}
                onLedger={handleLedger}
              />

              {selectedItemPrice.price_cname && (
                <div className="mt-2">
                  <p className="text-indigo-700 p-2">
                    Price: {selectedItemPrice.price_cname}
                  </p>
                  {listDataLedger.length > 0 ? (
                    <PriceLedger listData={listDataLedger} />
                  ) : (
                    <EmptyState
                      title="No price ledger data"
                      message="No transaction found with this price item"
                    />
                  )}
                </div>
              )}
            </>
          )}
          {pgView === "SYS_VW_FRM_2" && (
            <PriceForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formDataItem}
              formErrors={formErrors}
              onChange={handleChangePrice}
              onCancel={handleCancelPrice}
              onSubmit={handleSubmitPrice}
              dpart_Options={dpart_Options}
            />
          )}

          {/* Single Modal for Item form */}
          <Modal open={showModal.show} onClose={handleHideModal} size="xl">
            <ModalHeader>
              <ModalTitle
                title={modalTitle.title}
                subtitle={modalTitle.subTitle}
                onClose={handleHideModal}
              />
            </ModalHeader>
            <ModalBody>
              {showModal.modal === "SUPPLIER" && (
                <ItemContactForm
                  isBusy={isBusy}
                  readOnly={readOnly}
                  stopEdit={stopEdit}
                  formData={formDataCntct}
                  formErrors={formErrors}
                  onChange={handleChangeCntct}
                  onSubmit={handleSubmitCntct}
                  cntct_Options={cntct_Options}
                />
              )}
            </ModalBody>
          </Modal>
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default ItemsPage;
