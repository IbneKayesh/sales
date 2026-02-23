import useOrders from "@/hooks/sales/useOrders";
import OrderList from "./OrderList";
import OrderEntry from "./OrderEntry";

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
    handleCreateOrder,
    handleBack
  } = useOrders();
  return (
    <div className="page-container">
      {currentView === "list" && (
        <OrderList
          dataList={dataList}
          isBusy={isBusy}
          searchData={searchData}
          setSearchData={setSearchData}
          orderStatusOptions={orderStatusOptions}
          filteredOrders={filteredOrders}
          onCreateOrder={handleCreateOrder}
        />
      )}
      {currentView === "entry" && (
        <OrderEntry formData={formData} onBack={handleBack}
        />
      )}
    </div>
  );
};
export default OrderPage;
