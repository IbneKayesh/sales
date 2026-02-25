import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { contactsAPI } from "@/api/crm/contactsAPI";

const mockOutlets = [
  {
    id: 1,
    name: "John Smith",
    initials: "JS",
    email: "john@example.com",
    phone: "+1 234 567 890",
    address: "123 Business Way, Suite 400, NY 10001",
    joined: "Jan 12, 2025",
    spent: 4280.0,
    tag: "VIP",
    color: "#F97316",
    stats: {
      totalSpent: 4280.0,
      orders: 12,
      outstanding: 150.0,
    },
    history: [
      { id: "ORD-8821", date: "20/02/2026", amount: 450.0, status: "New" },
      {
        id: "ORD-8790",
        date: "05/02/2026",
        amount: 120.0,
        status: "Delivered",
      },
      {
        id: "ORD-8752",
        date: "12/01/2026",
        amount: 890.0,
        status: "Delivered",
      },
    ],
  },
  {
    id: 2,
    name: "Sarah Miller",
    initials: "SM",
    email: "sarah@example.com",
    phone: "+1 987 654 321",
    spent: 1920.5,
    tag: "Regular",
    color: "#0F766E",
    stats: {
      totalSpent: 1920.5,
      orders: 8,
      outstanding: 0.0,
    },
    history: [
      {
        id: "ORD-8810",
        date: "15/02/2026",
        amount: 320.5,
        status: "Delivered",
      },
    ],
  },
  {
    id: 3,
    name: "Tech Solutions",
    initials: "TS",
    email: "info@tech.com",
    phone: "+1 555 019 999",
    spent: 9100.0,
    tag: "VIP",
    color: "#F97316",
    stats: {
      totalSpent: 9100.0,
      orders: 25,
      outstanding: 500.0,
    },
    history: [],
  },
];

const useOutlets = () => {
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

  const loadContacts = async () => {
    try {
      setIsBusy(true);
      setDataList([]);
      const formDataNew = {
        cntct_users: user?.emply_users,
        cntct_bsins: user?.emply_bsins,
      };

      const response = await contactsAPI.getAll(formDataNew);
      setDataList(response?.data || []);
      console.log("loadContacts: ", response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [searchData]);

  const handleCreateNew = () => {
    setCurrentView("form");
  };

  // const [outlets, setOutlets] = useState(mockOutlets);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [viewComp, setViewComp] = useState("list");
  // const [selectedId, setSelectedId] = useState(null);
  // const [searchTerm, setSearchTerm] = useState("");

  // const selectedOutlet = useMemo(() => {
  //   return outlets.find((o) => o.id === selectedId);
  // }, [outlets, selectedId]);

  // const filteredOutlets = useMemo(() => {
  //   return outlets.filter(
  //     (o) =>
  //       o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       o.email.toLowerCase().includes(searchTerm.toLowerCase()),
  //   );
  // }, [outlets, searchTerm]);

  // const handleViewDetail = (id) => {
  //   setSelectedId(id);
  //   setViewComp("view");
  // };

  // const handleAdd = () => {
  //   setSelectedId(null);
  //   setViewComp("form");
  // };

  // const handleEdit = () => {
  //   setViewComp("form");
  // };

  // const handleBack = () => {
  //   if (viewComp === "form" && selectedId) {
  //     setViewComp("view");
  //   } else {
  //     setViewComp("list");
  //     setSelectedId(null);
  //   }
  // };

  // const handleCancel = () => {
  //   if (selectedId) {
  //     setViewComp("view");
  //   } else {
  //     setViewComp("list");
  //   }
  // };

  return {
    dataList,
    isBusy,
    currentView,
    errors,
    formData,
    searchData,
    setSearchData,
    handleCreateNew,
    // handleBack,
  };
};

export default useOutlets;
