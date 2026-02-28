import useOrders from "@/hooks/sales/useOrders";
import OrderListComp from "./OrderListComp";
import OrderFormComp from "./OrderFormComp";
import TitleTopBar from "@/components/TitleTopBar";
import LiteLoader from "@/components/LiteLoader";

const OrderPage = () => {
  const {
    dataList,
    isBusy,
    currentView,
    errors,
    formData,
    searchData,
    setSearchData,
    orderStatusOptions,
    filteredOrders,
    handleCreateNew,
    handleBack,
  } = useOrders();

  return (
    <>
      <TitleTopBar
        viewName={currentView}
        titleName="Order"
        idValue={formData.id}
        funcName={handleBack}
      />
      <div className="page-container">
        {isBusy && <LiteLoader />}
        {currentView === "list" && (
          <OrderListComp
            dataList={dataList}
            isBusy={isBusy}
            searchData={searchData}
            setSearchData={setSearchData}
            orderStatusOptions={orderStatusOptions}
            filteredOrders={filteredOrders}
            onCreateNew={handleCreateNew}
          />
        )}
        {currentView === "form" && (
          <OrderFormComp formData={formData} onBack={handleBack} />
        )}
      </div>
    </>
  );
};

export default OrderPage;
