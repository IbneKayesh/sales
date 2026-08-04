import DataTable from "@/components/DataTable";
import { formatNumber } from "@/utils/misc";

const RPT_FS_TB = ({ listData }) => {
  const dtcolumns_SYS_RPT_FS_TB = [
    { key: "name", header: "Account", width: "80px" },
    { key: "type", header: "Type", width: "80px" },
    { key: "drVal", header: "Debit (Dr)", width: "80px", align: "right" },
    { key: "crVal", header: "Account", width: "80px", align: "right" },
  ];

  const tb_data = Object.values(
    listData.reduce((acc, row) => {
      const key = row.chtac_chtno;

      if (!acc[key]) {
        acc[key] = {
          name: `${row.chtac_cname} (${row.chtac_chtno})`,
          type: row.chtac_ctype,
          drVal: 0,
          crVal: 0,
        };
      }

      acc[key].drVal += Number(row.jrnlc_drval || 0);
      acc[key].crVal += Number(row.jrnlc_crval || 0);

      return acc;
    }, {}),
  );

  const tb_data_sum = tb_data.reduce(
    (sum, row) => {
      sum.drVal += row.drVal;
      sum.crVal += row.crVal;
      return sum;
    },
    {
      name: "Total",
      drVal: 0,
      crVal: 0,
    },
  );

  const diffVal = Math.abs(tb_data_sum.drVal - tb_data_sum.crVal);
  const isBalanced = diffVal < 0.01;

  return (
    <>
      <DataTable
        columns={dtcolumns_SYS_RPT_FS_TB}
        data={tb_data}
        pageSize={100}
        sortable
        striped
        hoverable
        dense
        emptyMessage="No data available"
      />
      <div className="page-card__footer">
        <span className="fw-semibold">Total</span>
        <div className="d-flex gap-4">
          <span
            className="fw-bold"
            style={{
              minWidth: "120px",
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatNumber(tb_data_sum.drVal)}
          </span>
          <span
            className="fw-bold"
            style={{
              minWidth: "120px",
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatNumber(tb_data_sum.crVal)}
          </span>
        </div>
      </div>

      <div
        className={`page-card__footer fw-semibold ${isBalanced ? "text-success" : "text-danger"}`}
      >
        {isBalanced
          ? "✓ Trial Balance is Balanced"
          : `✗ Difference: ${formatNumber(diffVal)}`}
      </div>
    </>
  );
};
export default RPT_FS_TB;
