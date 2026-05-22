import "./Tables.css";
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
    <div className="tables-container">
      <h2>Tables List</h2>
      <button className="add-button" onClick={handleAddNew} disabled={isBusy}>
        + Add Table
      </button>
      <div className="table-responsive">
        <table className="tables-table">
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
            {dataList && dataList.length > 0 ? (
              dataList.map((table) => (
                <tr key={table.id}>
                  <td>{table.serial_number || "-"}</td>
                  <td className="font-medium">{table.table_name}</td>
                  <td>{table.table_description || "-"}</td>
                  <td>
                    {table.created_at
                      ? new Date(table.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => handleRowClick(table)}>
                      / edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No tables found.
                </td>
              </tr>
            )}
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
