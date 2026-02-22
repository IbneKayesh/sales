import useOrders from "@/hooks/sales/useOrders";
import OrderList from "./OrderList";

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
    filteredOrders
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
        />
      )}
    </div>
  );
};
export default OrderPage;
