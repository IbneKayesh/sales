import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import InactiveText from "@/components/InactiveText";
import { getRelativeDays } from "@/utils/datetime.js";

const DeliveryTripsList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "dpart_cname", header: "Department", width: "80px" },
    { key: "party_cname", header: "Party", width: "80px" },
    { key: "tripm_trnno", header: "Trn", width: "80px" },
    {
      key: "tripm_trdat",
      header: "Date",
      width: "80px",
      body: (v) => getRelativeDays(v),
    },
    { key: "tripm_trpmv", header: "Vehicle", width: "80px" },
    { key: "tripm_blamt", header: "Amount", width: "80px" },
    // {
    //   key: "brand_cname",
    //   header: "Brand Name",
    //   width: "80px",
    //   body: (_, row) => {
    //     return <InactiveText text={row.brand_cname} active={row.brand_actve} />;
    //   },
    // },
    {
      key: "tripm_ispnd",
      header: "Status",
      width: "110px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Delivered" : "Pending"}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.tripm_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
  return (
    <DataTable
      columns={dtColumns}
      data={listData}
      pageSize={15}
      sortable
      searchable
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
      autofit
    />
  );
};
export default DeliveryTripsList;
