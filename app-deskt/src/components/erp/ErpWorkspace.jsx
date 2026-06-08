import "./ErpWorkspace.css";

const moduleData = {
  sales: {
    title: "Sales",
    summary: ["BDT 1.24M today", "38 pending invoices", "7 overdue follow-ups"],
    columns: ["Customer", "Document", "Status", "Amount"],
    rows: [
      ["Apex Traders", "INV-1008", "Draft", "BDT 86,000"],
      ["North Star Ltd", "INV-1009", "Approved", "BDT 142,500"],
      ["Blue Ocean", "INV-1010", "Due", "BDT 49,800"],
    ],
  },
  purchase: {
    title: "Purchase",
    summary: ["12 open POs", "5 awaiting GRN", "BDT 540K committed"],
    columns: ["Supplier", "Document", "Status", "Amount"],
    rows: [
      ["Prime Supply", "PO-430", "Ordered", "BDT 74,000"],
      ["Metro Tools", "BILL-219", "Review", "BDT 31,200"],
      ["Akash Paper", "PO-431", "Received", "BDT 18,900"],
    ],
  },
  inventory: {
    title: "Inventory",
    summary: ["1,842 SKUs", "26 low stock", "4 warehouse zones"],
    columns: ["Item", "Location", "Status", "Quantity"],
    rows: [
      ["A4 Paper Box", "Main", "Low", "16"],
      ["Thermal Roll", "Counter", "Ready", "240"],
      ["Barcode Label", "Store B", "Ready", "910"],
    ],
  },
  settings: {
    title: "Settings",
    summary: ["4 roles", "9 active users", "2 approval flows"],
    columns: ["Area", "Owner", "Status", "Updated"],
    rows: [
      ["Sales Terms", "Admin", "Active", "Today"],
      ["Purchase Approval", "Manager", "Draft", "Yesterday"],
      ["Inventory Rules", "Admin", "Active", "Jun 6"],
    ],
  },
};

const fallbackData = moduleData.sales;

const ErpWorkspace = ({ item }) => {
  const data = moduleData[item.module] || fallbackData;

  return (
    <section className="erp-workspace">
      <header className="erp-header">
        <div>
          <p className="erp-kicker">{data.title}</p>
          <h1>{item.name}</h1>
        </div>
        <div className="erp-actions">
          <button className="btn-default" type="button">New</button>
          <button className="btn-default" type="button">Export</button>
        </div>
      </header>

      <div className="erp-summary">
        {data.summary.map((text) => (
          <div className="erp-stat" key={text}>{text}</div>
        ))}
      </div>

      <div className="erp-table-wrap">
        <table className="erp-table">
          <thead>
            <tr>
              {data.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.join("-")}>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ErpWorkspace;

