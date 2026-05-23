import useTables from "../hooks/useTables.js";
import TablesSidebar from "./TablesSidebar";

const Tables = () => {
  const {
    isBusy,
    dataList,
    formData,
    isSideBar,
    handleInputChange,
    handleRowClick,
    handleCloseSidebar,
    handleDelete,
    handleSave,
    handleAddNew,
    columnList,
    formDataColumn,
    handleInputChangeColumn,
    handleEditColumn,
    handleSaveColumn,
    handleDeleteColumn,
  } = useTables();

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h2 className="page-title">Tables List</h2>
          <p className="page-subtitle">
            Define and manage your database tables
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAddNew}
          disabled={isBusy}
        >
          + Add Table
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Serial #</th>
              <th>Table Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList &&
              dataList.length > 0 &&
              dataList.map((table) => (
                <tr key={table.id}>
                  <td>{table.serial_number || "-"}</td>
                  <td>{table.table_name}</td>
                  <td>{table.table_description || "-"}</td>
                  <td>
                    {table.created_at
                      ? new Date(table.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleRowClick(table)}
                      title="Edit table"
                    >
                      / Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <TablesSidebar
        isBusy={isBusy}
        formData={formData}
        formDataColumn={formDataColumn}
        columnList={columnList}
        isSideBar={isSideBar}
        onInputChange={handleInputChange}
        onInputChangeColumn={handleInputChangeColumn}
        onEditColumn={handleEditColumn}
        onCloseSidebar={handleCloseSidebar}
        onDelete={handleDelete}
        onDeleteColumn={handleDeleteColumn}
        onSave={handleSave}
        onSaveColumn={handleSaveColumn}
      />
    </div>
  );
};
export default Tables;
