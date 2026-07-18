import DataTable from '@/components/DataTable'

const COAList = ({ dataList, onEdit }) => {
  const dtColumns = [{ key: "name", header: "Name", width: "180px" }];
  return (
    <DataTable
      columns={dtColumns}
      data={dataList}
      pageSize={10}
      sortable
      searchable
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
    />
  );
};
export default COAList;
