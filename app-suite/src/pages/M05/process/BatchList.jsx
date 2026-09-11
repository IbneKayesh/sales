import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import { PageSection } from "@/components/PageCard";
import { getRelativeDays, formatDate } from "@/utils/datetime.js";
import { formatNumber } from "@/utils/misc";
import Badge from "@/components/Badge";

const BatchList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prbtc_itype", header: "Type", width: "80px" },
    { key: "prbtc_group", header: "Group", width: "80px" },
    { key: "price_cname", header: "Name", width: "80px" },
    { key: "prbtc_brcod", header: "Barcode", width: "80px" },
    { key: "prbtc_batch", header: "Batch", width: "80px" },
    { key: "prbtc_srial", header: "Serial", width: "80px" },
    {
      key: "prbtc_gdstk",
      header: "Good",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {formatNumber(row.prbtc_gdstk)} {row.runit_cname}
          </span>
        );
      },
    },
    {
      key: "prbtc_bdstk",
      header: "Reject",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {formatNumber(row.prbtc_bdstk)} {row.runit_cname}
          </span>
        );
      },
    },
    {
      key: "prbtc_fgrat",
      header: "Cost Rate",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "prbtc_fgval",
      header: "Value",
      width: "80px",
      body: (v) => formatNumber(v),
      footer: (_, row) => {
        return formatNumber(
          row.reduce((sum, row) => sum + Number(row.prbtc_fgval ?? 0), 0),
        );
      },
    },
    { key: "dpart_cname", header: "Department", width: "80px" },
    { key: "prbtc_wkshf", header: "Shift", width: "80px" },
    { key: "prbtc_emply", header: "Manager", width: "80px" },
    { key: "prbtc_notes", header: "Notes", width: "100px" },
    {
      key: "prbtc_crdat",
      header: "Date",
      width: "80px",
      body: (v) => formatDate(v),
    },
    {
      key: "prbtc_stats",
      header: "Status",
      width: "80px",
      body: (v) => (
        <Badge
          variant={
            v === "Closed" ? "danger" : v === "Completed" ? "primary" : "success"
          }
        >
          {v}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.prbtc_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];
  return (
    <PageSection title="Output / Batch Complete">
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={1000}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        exportFilename="data-export.csv"
        //onRowClick={(row) => onEdit(row)}
        emptyMessage="No batch records found"
        className="mt-2"
      />
    </PageSection>
  );
};
export default BatchList;
