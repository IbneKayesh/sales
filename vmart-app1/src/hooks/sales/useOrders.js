// ─────────────────────────────────────────────────────────────────────────────
// useOrders — SHOP order management using demo data (no live API)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { DEMO_ORDERS, DEMO_CUSTOMERS, getOrdersForShop } from "@/hooks/useVmartData";

const useOrders = () => {
  const { user }        = useAuth();
  const { showToast }   = useToast();
  const [dataList,      setDataList]      = useState([]);
  const [isBusy,        setIsBusy]        = useState(false);
  const [currentView,   setCurrentView]   = useState("list");
  const [errors,        setErrors]        = useState({});
  const [formData,      setFormData]      = useState({});
  const [searchData,    setSearchData]    = useState({ search: "", status: null, date: new Date() });

  const orderStatusOptions = [
    { label: "All Status",  value: null },
    { label: "PENDING",     value: "PENDING" },
    { label: "DELIVERED",   value: "DELIVERED" },
    { label: "PAID",        value: "PAID" },
    { label: "COMPLETED",   value: "COMPLETED" },
  ];

  const loadOrders = () => {
    setIsBusy(true);
    // Use demo data — filter by shopId
    const shopId = user?.shopId || 1;
    const orders = getOrdersForShop(shopId).map((o) => {
      const customer = DEMO_CUSTOMERS.find((c) => c.id === o.customerId);
      return {
        ...o,
        id:           o.id,
        cnrut_srlno:  o.orderNo,
        cntct_cntnm:  customer?.name || "Customer",
        fodrm_odamt:  o.total,
        fodrm_stats:  o.status,
        cnrut_lvdat:  o.date,
        rutes_dname:  o.shopName,
        rutes_rname:  o.status,
      };
    });
    setDataList(orders);
    setIsBusy(false);
  };

  useEffect(() => { loadOrders(); }, [searchData.date]);

  const filteredOrders = dataList.filter((inv) => {
    const matchesSearch = !searchData.search ||
      (inv.cntct_cntnm || "").toLowerCase().includes(searchData.search.toLowerCase()) ||
      (inv.fodrm_odamt || "").toString().includes(searchData.search);
    const matchesStatus = !searchData.status || inv.fodrm_stats === searchData.status;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNew = (item) => {
    setCurrentView("form");
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
