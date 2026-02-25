import useOrders from "@/hooks/sales/useOrders";
import OrderListComp from "./OrderListComp";
import OrderEntryComp from "./OrderEntryComp";

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
    handleBack
  } = useOrders();
  return (
    <div className="page-container">
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
      {currentView === "entry" && (
        <OrderEntryComp formData={formData} onBack={handleBack}
        />
      )}
    </div>
  );
};
export default OrderPage;
