import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ordersAPI } from "@/api/sales/ordersAPI";
import { formatDateForAPI } from "@/utils/datetime";

const useOrders = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [searchData, setSearchData] = useState({
    search: "",
    status: null,
    date: new Date(),
  });
  const orderStatusOptions = [
    { label: "All Status", value: null },
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Overdue", value: "Overdue" },
  ];

  const loadOrders = async () => {
    try {
      setIsBusy(true);
      setDataList([]);
      const formDataNew = {
        emply_users: user?.emply_users,
        emply_bsins: user?.emply_bsins,
        user_id: user?.id,
        fodrm_trdat: formatDateForAPI(searchData.date),
      };

      const response = await ordersAPI.getAll(formDataNew);
      setDataList(response?.data || []);
      //console.log("loadOrders: ", response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [searchData.date]);

  const filteredOrders = dataList.filter((inv) => {
    const matchesSearch =
      !searchData.search ||
      inv.cntct_cntnm.toLowerCase().includes(searchData.search.toLowerCase()) ||
      inv.rutes_rname.toLowerCase().includes(searchData.search.toLowerCase()) ||
      inv.fodrm_odamt.toString().includes(searchData.search.toLowerCase());
    // const matchesStatus =
    //   !searchData.status || inv.fodrm_stats === searchData.status;
    //return matchesSearch && matchesStatus;
    return matchesSearch;
  });

  //     const filteredOrders = dataList.filter(
  //     (inv) =>
  //       inv.cntct_cntnm.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       inv.rutes_rname.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       inv.fodrm_odamt.toString().includes(searchTerm.toLowerCase()),
  //     //&& (!searchData.status || inv.fodrm_stats === searchData.status),
  //   );


  const handleCreateNew = (item) => {
    setCurrentView("entry");
    setFormData(item);
  };

  const handleBack = () => {
    setCurrentView("list");
    setFormData({});
  };

  return {
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
  };
};
export default useOrders;
