import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  Wallet,
  Landmark,
  TrendingDown,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const accountGroups = [
  {
    id: "assets",
    name: "Assets",
    total: 42500.0,
    icon: <Landmark size={20} />,
    color: "#0F766E",
    bg: "rgba(15,118,110,0.12)",
    accounts: [
      { id: "1001", name: "Cash in Hand", balance: 1240.0 },
      { id: "1002", name: "Bank Account (Main)", balance: 31260.0 },
      { id: "1005", name: "Accounts Receivable", balance: 10000.0 },
    ],
  },
  {
    id: "liabilities",
    name: "Liabilities",
    total: 8400.0,
    icon: <TrendingDown size={20} />,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
    accounts: [
      { id: "2001", name: "Accounts Payable", balance: 6200.0 },
      { id: "2005", name: "Sales Tax Payable", balance: 2200.0 },
    ],
  },
  {
    id: "income",
    name: "Income",
    total: 124780.0,
    icon: <TrendingUp size={20} />,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.12)",
    accounts: [
      { id: "4001", name: "Sales Revenue", balance: 112000.0 },
      { id: "4005", name: "Service Income", balance: 12780.0 },
    ],
  },
  {
    id: "expenses",
    name: "Expenses",
    total: 62450.0,
    icon: <Wallet size={20} />,
    color: "#F97316",
    bg: "rgba(249,115,22,0.12)",
    accounts: [
      { id: "5001", name: "Cost of Goods Sold", balance: 45000.0 },
      { id: "5010", name: "Utilities", balance: 1250.0 },
      { id: "5020", name: "Rent Expense", balance: 16200.0 },
    ],
  },
];

const ChartOfAccounts = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(["assets", "income"]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleGroup = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Chart of Accounts</span>
      </div>

      <div style={{ padding: "12px 16px" }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <Search
            size={18}
            color="var(--text-secondary)"
            style={{ position: "absolute", left: "12px", top: "10px" }}
          />
          <input
            type="text"
            placeholder="Search accounts..."
            style={{ paddingLeft: "40px", marginBottom: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Account Tree */}
        <div>
          {accountGroups.map((group) => (
            <div key={group.id} style={{ marginBottom: "12px" }}>
              {/* Group Header */}
              <div
                onClick={() => toggleGroup(group.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: "var(--surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  boxShadow: "var(--shadow)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: group.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: group.color,
                    }}
                  >
                    {group.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "15px",
                        color: "var(--on-surface)",
                      }}
                    >
                      {group.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {group.accounts.length} Accounts
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "var(--on-surface)",
                    }}
                  >
                    ${group.total.toLocaleString()}
                  </div>
                  {expanded.includes(group.id) ? (
                    <ChevronDown size={20} color="var(--border)" />
                  ) : (
                    <ChevronRight size={20} color="var(--border)" />
                  )}
                </div>
              </div>

              {/* Group Items */}
              {expanded.includes(group.id) && (
                <div
                  style={{
                    marginLeft: "16px",
                    marginTop: "4px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {group.accounts.map((acc) => (
                    <div
                      key={acc.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        background: "var(--surface)",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        opacity: 0.9,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--text-secondary)",
                            width: "35px",
                          }}
                        >
                          {acc.id}
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--on-surface)",
                          }}
                        >
                          {acc.name}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "var(--on-surface)",
                        }}
                      >
                        ${acc.balance.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAB for new account */}
      <button
        style={{
          position: "fixed",
          bottom: "85px",
          right: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "28px",
          background: "var(--primary)",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 12px rgba(15,118,110,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default ChartOfAccounts;
