import DataTable from "@/components/DataTable";
import { formatNumber } from "@/utils/misc";

const formatHeader = (key) => {
  return key
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return value;
  }

  // Number / Decimal
  if (typeof value === "number" && Number.isFinite(value)) {
    return formatNumber(value);
  }

  // Numeric string
  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (trimmedValue !== "" && !Number.isNaN(Number(trimmedValue))) {
      return formatNumber(Number(trimmedValue));
    }
  }

  // Normal string / other values
  return value;
};

const StandardList = ({ listData = [] }) => {
  const keys = listData.length > 0 ? Object.keys(listData[0]) : [];

  const dtColumns = keys.length
    ? keys.map((key) => ({
        key,
        header: formatHeader(key),
        width: "120px",
        body: formatValue,
      }))
    : [
        {
          key: "__empty",
          header: "",
          width: "120px",
        },
      ];

  return (
    <DataTable
      columns={dtColumns}
      data={listData}
      pageSize={1500}
      sortable
      searchable
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      // onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
    />
  );
};

export default StandardList;
