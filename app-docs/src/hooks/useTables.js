import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { generateGuid } from "../utils/guid";

const useTables = () => {
  const [isBusy, setIsBusy] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [formData, setFormData] = useState({});
  const [isSideBar, setIsSideBar] = useState(false);

  const handleGetAll = async () => {
    const resp = await apiRequest("api/tables/get-all", { body: {} });
    setDataList(resp.data);
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  const handleRowClick = (data) => {
    setFormData(data);
    setIsSideBar(true);
  };

  const handleCloseSidebar = () => {
    setFormData({});
    setIsSideBar(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      setIsBusy(true);
      try {
        await apiRequest("api/tables/delete", { body: { id: id } });
        handleGetAll();
        handleCloseSidebar();
      } catch (err) {
        console.error("Error deleting table:", err);
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleSave = async (data) => {
    setIsBusy(true);
    try {
      if (data.id) {
        await apiRequest("api/tables/edit", { body: data });
      } else {
        const reqBody = {
          ...data,
          id: generateGuid(),
        };
        await apiRequest("api/tables/add", { body: reqBody });
      }
      handleGetAll();
      handleCloseSidebar();
    } catch (err) {
      console.error("Error saving table:", err);
    } finally {
      setIsBusy(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNew = () => {
    setFormData({
      id: "",
      table_name: "",
      table_description: "",
      serial_number: "",
    });
    setIsSideBar(true);
  };

  const [columnList, setColumnList] = useState([]);
  const [formDataColumn, setFormDataColumn] = useState({});

  useEffect(() => {
    if (formData.id && isSideBar) {
      handleGetColumnsByTable(formData.id);
    } else {
      setColumnList([]);
      setFormDataColumn({});
    }
  }, [formData.id, isSideBar]);

  const handleGetColumnsByTable = async (table_id) => {
    try {
      const resp = await apiRequest("api/columns/get-by-table", {
        body: { table_id },
      });
      setColumnList(resp.data || []);
    } catch (err) {
      console.error("Error fetching columns:", err);
    }
  };

  const handleInputChangeColumn = (name, value) => {
    if (name === "clear") {
      setFormDataColumn({});
      return;
    }

    setFormDataColumn((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditColumn = (column) => {
    setFormDataColumn({
      ...column,
      is_nullable: column.is_nullable ?? true,
      is_primary: column.is_primary ?? false,
      is_foreign: column.is_foreign ?? false,
    });
  };

  const handleSaveColumn = async (data) => {
    if (!formData.id) {
      alert("Please save the table before adding columns.");
      return;
    }

    setIsBusy(true);
    try {
      const columnData = {
        ...data,
        table_id: formData.id,
      };

      if (data.id) {
        await apiRequest("api/columns/edit", { body: columnData });
      } else {
        const reqBody = {
          ...columnData,
          id: generateGuid(),
          is_nullable:
            columnData.is_nullable === undefined
              ? true
              : columnData.is_nullable,
          is_primary:
            columnData.is_primary === undefined
              ? false
              : columnData.is_primary,
          is_foreign:
            columnData.is_foreign === undefined
              ? false
              : columnData.is_foreign,
        };
        await apiRequest("api/columns/add", { body: reqBody });
      }

      setFormDataColumn({});
      await handleGetColumnsByTable(formData.id);
    } catch (err) {
      console.error("Error saving column:", err);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (window.confirm("Are you sure you want to delete this column?")) {
      setIsBusy(true);
      try {
        await apiRequest("api/columns/delete", { body: { id: columnId } });
        await handleGetColumnsByTable(formData.id);
        setFormDataColumn((prev) => (prev.id === columnId ? {} : prev));
      } catch (err) {
        console.error("Error deleting column:", err);
      } finally {
        setIsBusy(false);
      }
    }
  };

  //columns are below

  return {
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
  //columns are below
  };
};
export default useTables;
