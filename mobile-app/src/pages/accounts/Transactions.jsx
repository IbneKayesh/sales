import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const transactions = [
  {
    id: "TXN-4421",
    desc: "Sales Receipt - INV-1001",
    type: "Credit",
    amount: 1275.0,
    date: "20/02/2026",
    cat: "Sales",
    icon: <ArrowUpRight size={18} />,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.12)",
  },
  {
    id: "TXN-4420",
    desc: "Office Rent - Feb",
    type: "Debit",
    amount: 1200.0,
    date: "19/02/2026",
    cat: "Rent",
    icon: <ArrowDownRight size={18} />,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
  },
  {
    id: "TXN-4419",
    desc: "Payment to Supplier - ABC",
    type: "Debit",
    amount: 850.4,
    date: "19/02/2026",
    cat: "Payables",
    icon: <ArrowDownRight size={18} />,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
  },
  {
    id: "TXN-4418",
    desc: "Cash Deposit",
    type: "Credit",
    amount: 500.0,
    date: "18/02/2026",
    cat: "Transfer",
    icon: <ArrowUpRight size={18} />,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.12)",
  },
  {
    id: "TXN-4417",
    desc: "Electricity Bill",
    type: "Debit",
    amount: 145.2,
    date: "17/02/2026",
    cat: "Utilities",
    icon: <ArrowDownRight size={18} />,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
  },
];

const Transactions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTxns = transactions.filter(
    (t) =>
      t.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cat.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Transaction Ledger</span>
        <button
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "var(--primary)",
          }}
        >
          <Download size={20} />
        </button>
      </div>

      <div style={{ padding: "12px 16px" }}>
        {/* Search & Date Filter */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={18}
              color="var(--text-secondary)"
              style={{ position: "absolute", left: "12px", top: "10px" }}
            />
            <input
              type="text"
              placeholder="Search ledger..."
              style={{ paddingLeft: "40px", marginBottom: 0 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--background)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--on-background)",
            }}
          >
            <Calendar size={20} />
          </button>
        </div>

        {/* Summary Card */}
        <div
          className="card"
          style={{
            padding: "16px",
            marginBottom: "16px",
            background:
              "linear-gradient(135deg, var(--surface), var(--background))",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Net Cash Flow
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "var(--primary)",
                  marginTop: "4px",
                }}
              >
                +$420.60
              </div>
            </div>
            <div
              style={{
                textAlign: "right",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              <div>In: $1,775.00</div>
              <div>Out: $1,354.40</div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div>
          {filteredTxns.map((t) => (
            <div
              key={t.id}
              className="card"
              style={{ padding: "14px", marginBottom: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: t.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: t.color,
                    }}
                  >
                    {t.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "var(--on-surface)",
                      }}
                    >
                      {t.desc}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                        marginTop: "2px",
                      }}
                    >
                      {t.cat} • {t.date}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: t.color,
                    }}
                  >
                    {t.type === "Credit" ? "+" : "-"}${t.amount.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                    }}
                  >
                    {t.id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
