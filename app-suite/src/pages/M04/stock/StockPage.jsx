import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave, IconCheck } from "@/icons";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Chip from "@/components/Chip";
import useStock from "@/hooks/M04/useStock";
import StockList from "./StockList";

const StockPage = () => {
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
    dpart_Options,
    //functions
    handleChange,
    handleEdit,
    handleSearch,
    handleCancel,
    handleSubmit,
  } = useStock();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Stock" subtitle={`${listData.length} Stock`} />
          <PageCardActions>
            {pgView === "SYS_VW_LST_1" && (
              <>
                <Button variant="info" size="sm" onClick={handleSearch}>
                  <IconSearch size={14} className="icon-left" />
                  Search
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCancel}>
                  <IconClose size={14} className="icon-left" />
                  Cancel
                </Button>
                <Button
                  variant="info"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={listDataItem?.length < 2}
                >
                  <IconSave size={14} className="icon-left" />
                  Create
                </Button>
              </>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <>
              <div className="grid mb-2">
                <div className="col-span-3">
                  <Dropdown
                    label="Department"
                    options={dpart_Options}
                    value={formData.dpart_id}
                    onChange={(e) => handleChange("dpart_id", e.target.value)}
                    error={formErrors.dpart_id}
                    placeholder="Select..."
                    //disabled={readOnly}
                    optionValue="id"
                    optionLabel="dpart_cname"
                  />
                </div>
                {listDataItem?.map((item) => (
                  <div key={item.id} className="col-span-12">
                    <Chip variant="info" icon={<IconCheck size={12} />}>
                      {item.stock_trnno} - {item.price_cname}:{" "}
                      {item.stock_ohqty} {item.runit_cname}
                    </Chip>
                  </div>
                ))}

                {listDataItem?.length > 0 && (
                  <div className="col-span-12">
                    <Chip variant="success" icon={<IconPlus size={12} />}>
                      Total: {listDataItem[0]?.price_cname}
                      {", Total = "}
                      {listDataItem.reduce(
                        (total, item) => total + Number(item.stock_ohqty || 0),
                        0,
                      )}{" "}
                      {listDataItem[0]?.units_cname}
                    </Chip>
                  </div>
                )}
              </div>
              <StockList
                cfColumns={tcVisibleItem.filter(
                  (f) => f.tabcl_table === "SYS_INVENTORY_STOCK_ITEMS_LIST",
                )}
                listData={listData}
                onEdit={handleEdit}
              />
            </>
          )}
          {pgView === "SYS_VW_FRM_1" && (
            <StockList
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
            />
          )}
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default StockPage;
