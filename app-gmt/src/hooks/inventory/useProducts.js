import { useState } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tm_role from "@/models/setup/tm_role.json";
const dataModel = generateDataModel(tm_role);
import { apiRequest } from "@/utils/api.js";

const useProducts = () => {
  //hooks
  const { showToast, confirm, alert, isBusy, setIsBusy } = useAppUI();
  const [crTitle, setCrTitle] = useState("Products List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  //functions
  const loadRoles = async () => {
    try {
      setIsBusy(true);
      const apiVersion = "/v7/";
      const apiEndPoint = "/data?key=tm_role";
      const resp = await apiRequest(apiVersion, apiEndPoint, {});
      //console.log("resp", resp.tm_role.data);
      setDataList(resp.tm_role.data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tm_role);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setFormData(rowData);
    setCrTitle("Edit Products");
    setCrView("form");
  };
  const handleDelete = (rowData) => {
    confirm({
      message: `Do you want to delete this ${rowData.role_name}?`,
      header: "Delete Confirmation",
      accept: () => {
        onDelete(rowData);
      },
      reject: () => {
        console.log("Operation is cancelled");
      },
    });
  };
  const onDelete = async (rowData) => {
    try {
      setIsBusy(true);
      const apiVersion = "/v7/";
      const apiEndPoint = `/destroy/${rowData.id}?key=tm_role`;
      const reqBody = { lfcl_id: rowData.lfcl_id == 1 ? 2 : 1 };
      const resp = await apiRequest(apiVersion, apiEndPoint, { body: reqBody });
      //console.log("resp", resp);
      if (resp.tm_role.status) {
        await loadRoles();
        alert({
          message: `Products deleted successfully ${rowData.role_name}`,
          header: "Deleted",
        });
      } else {
        alert({
          message: resp.tm_role.message,
          header: "Error while Deleting",
        });
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Products List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Products");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
  };

  const handleRefreshClick = () => {
    setCrTitle("Products List");
    setCrView("list");
    loadRoles();
  };

  const handleAddNewClick = () => {
    setCrTitle("Add Products");
    setCrView("form");
    setFormData(dataModel);
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tm_role);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      if (formData.id) {
        const apiVersion = "/v4/";
        const apiEndPoint = `/update/${formData.id}?key=tm_role`;
        const reqBody = formData;
        const resp = await apiRequest(apiVersion, apiEndPoint, {
          body: reqBody,
        });
        //console.log("resp", resp);
        if (resp.tm_role.status) {
          //await loadRoles();
          setDataList((prevList) =>
            prevList.map((item) =>
              item.id === reqBody.id
                ? { ...item, ...reqBody } // merge updated fields
                : item,
            ),
          );
          alert({
            message: `Products edited successfully ${formData.role_name}`,
            header: "Edited",
          });
          setCrTitle("Products List");
          setCrView("list");
        } else {
          alert({
            message: resp.tm_role.message,
            header: "Error while Editing",
          });
        }
      } else {
        const apiVersion = "/v4/";
        const apiEndPoint = "/store?key=tm_role";
        const reqBody = formData;
        const resp = await apiRequest(apiVersion, apiEndPoint, {
          body: reqBody,
        });
        //console.log("resp", resp);
        if (resp.tm_role.status) {
          //await loadRoles();
          setDataList((prev) => [...prev, reqBody]);
          alert({
            message: `Products saved successfully ${formData.role_name}`,
            header: "Saved",
          });
          setCrTitle("Products List");
          setCrView("list");
        } else {
          alert({
            message: resp.tm_role.message,
            header: "Error while Saving",
          });
        }
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };
  return {
    //hooks
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
  };
};
export default useProducts;
