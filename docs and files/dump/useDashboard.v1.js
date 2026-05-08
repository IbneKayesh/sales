import { useState, useMemo, useEffect, useCallback } from "react";

const initial_ui_data = {
  api: "/dashboard/root",
  title: "Enterprise Dashboard",
  subtitle: "Real-time system overview",
  component: [
    {
      type: "box",
      title: "Finance",
      subtitle: "Revenue, Expenses, Profitability",
      icon: "pi pi-money-bill",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      data: { value: "$2.4M", sub_value: "+12.5%" },
      child: {
        api: "/dashboard/finance",
        title: "Finance & Accounts",
        subtitle: "General Ledger & Financial Statements",
        component: [
          {
            type: "box",
            title: "Receivables",
            subtitle: "Customer Invoices",
            icon: "pi pi-download",
            iconColor: "text-blue-500",
            iconBg: "bg-blue-100",
            data: { value: "$850K", sub_value: "5% overdue" },
            child: {
              api: "/dashboard/finance/receivables",
              title: "Receivables Detail",
              subtitle: "Aging report and pending collections",
              component: [
                {
                  type: "box",
                  title: "Domestic",
                  subtitle: "Local Clients",
                  icon: "pi pi-home",
                  iconColor: "text-blue-500",
                  iconBg: "bg-blue-100",
                  data: { value: "$600K", sub_value: "+2% MoM" },
                  child: {
                    api: "/dashboard/finance/receivables/domestic",
                    title: "Domestic Clients",
                    subtitle: "B2B and B2C domestic partners",
                    component: [
                      {
                        type: "box",
                        title: "Retailers",
                        subtitle: "B2C Partners",
                        icon: "pi pi-shopping-bag",
                        iconColor: "text-orange-500",
                        iconBg: "bg-orange-100",
                        data: { value: "$250K", sub_value: "Healthy" },
                        child: {},
                      },
                      {
                        type: "box",
                        title: "Wholesalers",
                        subtitle: "B2B Partners",
                        icon: "pi pi-building",
                        iconColor: "text-purple-500",
                        iconBg: "bg-purple-100",
                        data: { value: "$350K", sub_value: "Check pending" },
                        child: {},
                      },
                    ],
                  },
                },
                {
                  type: "box",
                  title: "International",
                  subtitle: "Global Partners",
                  icon: "pi pi-globe",
                  iconColor: "text-indigo-500",
                  iconBg: "bg-indigo-100",
                  data: { value: "$250K", sub_value: "Currency flux" },
                  child: {},
                },
              ],
            },
          },
          {
            type: "box",
            title: "Payables",
            subtitle: "Supplier Payments",
            icon: "pi pi-upload",
            iconColor: "text-orange-500",
            iconBg: "bg-orange-100",
            data: { value: "$320K", sub_value: "3 due today" },
            child: {},
          },
        ],
      },
    },
    {
      type: "box",
      title: "Sales & CRM",
      subtitle: "Leads, Orders, Relations",
      icon: "pi pi-users",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      data: { value: "1,450", sub_value: "+45 today" },
      child: {
        api: "/dashboard/sales",
        title: "Sales Operations",
        subtitle: "Performance metrics and order tracking",
        component: [
          {
            type: "box",
            title: "Active Orders",
            subtitle: "Processing & Logistics",
            icon: "pi pi-shopping-cart",
            iconColor: "text-orange-500",
            iconBg: "bg-orange-100",
            data: { value: "342", sub_value: "12 delayed" },
            child: {
              api: "/dashboard/sales/orders",
              title: "Order Tracking",
              component: [
                {
                  type: "box",
                  title: "Processing",
                  subtitle: "Internal Approval",
                  icon: "pi pi-spinner",
                  iconColor: "text-blue-500",
                  iconBg: "bg-blue-100",
                  data: { value: "45", sub_value: "Avg 2h" },
                  child: {
                    api: "/dashboard/sales/orders/proc",
                    title: "Processing Stage",
                    component: [
                      {
                        type: "box",
                        title: "Verification",
                        subtitle: "ID & Credit Check",
                        icon: "pi pi-check-circle",
                        iconColor: "text-green-500",
                        iconBg: "bg-green-100",
                        data: { value: "12", sub_value: "Manual needed" },
                        child: {},
                      },
                      {
                        type: "box",
                        title: "Packaging",
                        subtitle: "Ready for Dispatch",
                        icon: "pi pi-box",
                        iconColor: "text-brown-500",
                        iconBg: "bg-orange-100",
                        data: { value: "33", sub_value: "Bulk orders" },
                        child: {},
                      },
                    ],
                  },
                },
                {
                  type: "box",
                  title: "Shipped",
                  subtitle: "Out for Delivery",
                  icon: "pi pi-truck",
                  iconColor: "text-green-500",
                  iconBg: "bg-green-100",
                  data: { value: "128", sub_value: "20 arrived" },
                  child: {},
                },
              ],
            },
          },
        ],
      },
    },
    {
      type: "box",
      title: "Inventory",
      subtitle: "Stock & Warehousing",
      icon: "pi pi-box",
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-100",
      data: { value: "45.2K", sub_value: "3 low alerts" },
      child: {
        api: "/dashboard/inventory",
        title: "Warehouse Management",
        subtitle: "Stock levels and procurement logistics",
        component: [
          {
            type: "box",
            title: "Main Hub",
            subtitle: "Primary Storage",
            icon: "pi pi-building",
            iconColor: "text-blue-500",
            iconBg: "bg-blue-100",
            data: { value: "32K", sub_value: "85% cap" },
            child: {},
          },
          {
            type: "box",
            title: "Stock-in",
            subtitle: "Inbound Shipments",
            icon: "pi pi-download",
            iconColor: "text-green-500",
            iconBg: "bg-green-100",
            data: { value: "12", sub_value: "Expected 2pm" },
            child: {},
          },
        ],
      },
    },
    {
      type: "box",
      title: "Staff & HR",
      subtitle: "Personnel & Payroll",
      icon: "pi pi-id-card",
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
      data: { value: "156", sub_value: "2 new hire" },
      child: {},
    },
    {
      type: "box",
      title: "Settings",
      subtitle: "System Configurations",
      icon: "pi pi-cog",
      iconColor: "text-gray-600",
      iconBg: "bg-gray-100",
      data: { value: "Admin", sub_value: "Up-to-date" },
      child: {},
    },
  ],
};





const useDashboard = () => {
  const [history, setHistory] = useState([
    { data: initial_ui_data, title: "Dashboard" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(history[0]);

  // Fake API call to fetch layer data
  const fetchLayerData = useCallback(async (layer) => {
    setLoading(true);
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCurrentLayer(layer);
    setLoading(false);
  }, []);

  useEffect(() => {
    const activeLayer = history[history.length - 1];
    fetchLayerData(activeLayer);
  }, [history, fetchLayerData]);

  // Global index of all components for search
  const allSearchableItems = useMemo(() => {
    const items = [];
    const traverse = (node, path) => {
      if (!node.component) return;
      node.component.forEach((comp) => {
        items.push({
          ...comp,
          parentHistory: path,
          fullPath: path.map((p) => p.title).join(" > "),
        });
        if (comp.child && comp.child.component) {
          traverse(comp.child, [
            ...path,
            { data: comp.child, title: comp.title },
          ]);
        }
      });
    };
    traverse(initial_ui_data, [{ data: initial_ui_data, title: "Dashboard" }]);
    return items;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === "") return null;
    const term = searchTerm.toLowerCase();
    return allSearchableItems.filter(
      (item) =>
        item.title?.toLowerCase().includes(term) ||
        item.subtitle?.toLowerCase().includes(term),
    );
  }, [searchTerm, allSearchableItems]);

  const handleBoxClick = (comp) => {
    if (comp.child && comp.child.component && comp.child.component.length > 0) {
      setSearchTerm("");
      setHistory([...history, { data: comp.child, title: comp.title }]);
    }
  };

  const handleSearchResultClick = (result) => {
    setHistory(result.parentHistory);
    setSearchTerm("");
  };

  const navigateTo = (index) => {
    setSearchTerm("");
    setHistory(history.slice(0, index + 1));
  };

  return {
    currentLayer,
    history,
    searchTerm,
    setSearchTerm,
    searchResults,
    handleBoxClick,
    handleSearchResultClick,
    navigateTo,
    loading,
  };
};

export default useDashboard;
