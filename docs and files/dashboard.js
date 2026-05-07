const dashboardData = {
  id: "root",
  api: "/dashboard/root",

  title: "Enterprise Dashboard",
  subtitle: "Real-time system overview",

  components: [
    {
      id: "finance",
      type: "box",

      title: "Finance",
      subtitle: "Revenue, Expenses, Profitability",

      icon: "pi pi-money-bill",
      theme: "success",

      stats: {
        value: "$2.4M",
        change: "+12.5%",
      },

      next: {
        id: "finance-dashboard",
        api: "/dashboard/finance",

        title: "Finance & Accounts",
        subtitle: "General Ledger & Financial Statements",

        components: [
          {
            id: "receivables",
            type: "box",

            title: "Receivables",
            subtitle: "Customer Invoices",

            icon: "pi pi-download",
            theme: "primary",

            stats: {
              value: "$850K",
              change: "5% overdue",
            },

            next: {
              id: "receivables-dashboard",
              api: "/dashboard/finance/receivables",

              title: "Receivables Detail",
              subtitle: "Aging report and pending collections",

              components: [
                {
                  id: "domestic",
                  type: "box",

                  title: "Domestic",
                  subtitle: "Local Clients",

                  icon: "pi pi-home",
                  theme: "info",

                  stats: {
                    value: "$600K",
                    change: "+2% MoM",
                  },

                  next: {
                    id: "domestic-dashboard",
                    api: "/dashboard/finance/receivables/domestic",

                    title: "Domestic Clients",
                    subtitle: "B2B and B2C domestic partners",

                    components: [
                      {
                        id: "retailers",
                        type: "box",

                        title: "Retailers",
                        subtitle: "B2C Partners",

                        icon: "pi pi-shopping-bag",
                        theme: "warning",

                        stats: {
                          value: "$250K",
                          change: "Healthy",
                        },

                        next: null,
                      },

                      {
                        id: "wholesalers",
                        type: "box",

                        title: "Wholesalers",
                        subtitle: "B2B Partners",

                        icon: "pi pi-building",
                        theme: "secondary",

                        stats: {
                          value: "$350K",
                          change: "Check pending",
                        },

                        next: null,
                      },
                    ],
                  },
                },

                {
                  id: "international",
                  type: "box",

                  title: "International",
                  subtitle: "Global Partners",

                  icon: "pi pi-globe",
                  theme: "primary",

                  stats: {
                    value: "$250K",
                    change: "Currency fluctuation",
                  },

                  next: null,
                },
              ],
            },
          },

          {
            id: "payables",
            type: "box",

            title: "Payables",
            subtitle: "Supplier Payments",

            icon: "pi pi-upload",
            theme: "warning",

            stats: {
              value: "$320K",
              change: "3 due today",
            },

            next: null,
          },
        ],
      },
    },

    {
      id: "sales",
      type: "box",

      title: "Sales & CRM",
      subtitle: "Leads, Orders, Relations",

      icon: "pi pi-users",
      theme: "primary",

      stats: {
        value: "1,450",
        change: "+45 today",
      },

      next: {
        id: "sales-dashboard",
        api: "/dashboard/sales",

        title: "Sales Operations",
        subtitle: "Performance metrics and order tracking",

        components: [
          {
            id: "orders",
            type: "box",

            title: "Active Orders",
            subtitle: "Processing & Logistics",

            icon: "pi pi-shopping-cart",
            theme: "warning",

            stats: {
              value: "342",
              change: "12 delayed",
            },

            next: {
              id: "orders-dashboard",
              api: "/dashboard/sales/orders",

              title: "Order Tracking",
              subtitle: "Live order pipeline",

              components: [
                {
                  id: "processing",
                  type: "box",

                  title: "Processing",
                  subtitle: "Internal Approval",

                  icon: "pi pi-spinner",
                  theme: "info",

                  stats: {
                    value: "45",
                    change: "Avg 2h",
                  },

                  next: {
                    id: "processing-dashboard",
                    api: "/dashboard/sales/orders/processing",

                    title: "Processing Stage",
                    subtitle: "Verification and packaging workflow",

                    components: [
                      {
                        id: "verification",
                        type: "box",

                        title: "Verification",
                        subtitle: "ID & Credit Check",

                        icon: "pi pi-check-circle",
                        theme: "success",

                        stats: {
                          value: "12",
                          change: "Manual review",
                        },

                        next: null,
                      },

                      {
                        id: "packaging",
                        type: "box",

                        title: "Packaging",
                        subtitle: "Ready for Dispatch",

                        icon: "pi pi-box",
                        theme: "warning",

                        stats: {
                          value: "33",
                          change: "Bulk orders",
                        },

                        next: null,
                      },
                    ],
                  },
                },

                {
                  id: "shipped",
                  type: "box",

                  title: "Shipped",
                  subtitle: "Out for Delivery",

                  icon: "pi pi-truck",
                  theme: "success",

                  stats: {
                    value: "128",
                    change: "20 arrived",
                  },

                  next: null,
                },
              ],
            },
          },
        ],
      },
    },

    {
      id: "inventory",
      type: "box",

      title: "Inventory",
      subtitle: "Stock & Warehousing",

      icon: "pi pi-box",
      theme: "info",

      stats: {
        value: "45.2K",
        change: "3 low alerts",
      },

      next: {
        id: "inventory-dashboard",
        api: "/dashboard/inventory",

        title: "Warehouse Management",
        subtitle: "Stock levels and procurement logistics",

        components: [
          {
            id: "main-hub",
            type: "box",

            title: "Main Hub",
            subtitle: "Primary Storage",

            icon: "pi pi-building",
            theme: "primary",

            stats: {
              value: "32K",
              change: "85% capacity",
            },

            next: null,
          },

          {
            id: "stock-in",
            type: "box",

            title: "Stock-in",
            subtitle: "Inbound Shipments",

            icon: "pi pi-download",
            theme: "success",

            stats: {
              value: "12",
              change: "Expected 2 PM",
            },

            next: null,
          },
        ],
      },
    },

    {
      id: "hr",
      type: "box",

      title: "Staff & HR",
      subtitle: "Personnel & Payroll",

      icon: "pi pi-id-card",
      theme: "secondary",

      stats: {
        value: "156",
        change: "2 new hires",
      },

      next: null,
    },

    {
      id: "settings",
      type: "box",

      title: "Settings",
      subtitle: "System Configurations",

      icon: "pi pi-cog",
      theme: "dark",

      stats: {
        value: "Admin",
        change: "Up-to-date",
      },

      next: null,
    },
  ],
};
