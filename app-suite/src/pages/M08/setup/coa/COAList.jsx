import DataTable from '@/components/DataTable'

const COAList = ({ dataList, onEdit }) => {
  const dtColumns = [{ key: "name", header: "Name", width: "180px" }];
  return (
    <div className="grid">
      <DataTable
        columns={dtColumns}
        data={dataList}
        pageSize={10}
        sortable
        searchable
        striped
        hoverable
        exportable
        exportFilename="users-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No users found"
      />
    </div>
  );
};
export default COAList;
