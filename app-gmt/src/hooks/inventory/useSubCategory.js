import { useState } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tm_itcl from "@/models/inventory/tm_itcl.json";
const dataModel = generateDataModel(tm_itcl);
import { apiRequest } from "@/utils/api.js";
import { generateGuid } from "@/utils/guid.js";

const useSubCategory = () => {
  //hooks
  const { showToast, confirm, alert, isBusy, setIsBusy } = useAppUI();
  const [crTitle, setCrTitle] = useState("Sub Category List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  //other states
  const [categoryDataList, setCategoryDataList] = useState([]);

  //functions
  const loadSubCategory = async () => {
    try {
      setIsBusy(true);
      const apiVersion = "/v7/";
      const apiEndPoint = "/data?key=tm_itcl;tm_itcg";
      const resp = await apiRequest(apiVersion, apiEndPoint, {});
      //console.log("resp", resp.tm_itcl.data);
      setDataList(resp.tm_itcl.data);
      setCategoryDataList(resp.tm_itcg.data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tm_itcl);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setFormData(rowData);
    setCrTitle("Edit Sub Category");
    setCrView("form");
  };
  const handleDelete = (rowData) => {
    confirm({
      message: `Do you want to delete this ${rowData.itcl_name}?`,
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
      const apiEndPoint = `/destroy/${rowData.id}?key=tm_itcl`;
      const reqBody = { lfcl_id: rowData.lfcl_id == 1 ? 2 : 1 };
      const resp = await apiRequest(apiVersion, apiEndPoint, { body: reqBody });
      //console.log("resp", resp);
      if (resp.tm_itcl.status) {
        await loadRoles();
        alert({
          message: `Sub Category deleted successfully ${rowData.itcl_name}`,
          header: "Deleted",
        });
      } else {
        alert({
          message: resp.tm_itcl.message,
          header: "Error while Deleting",
        });
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Sub Category List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Sub Category");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
  };

  const handleRefreshClick = () => {
    setCrTitle("Sub Category List");
    setCrView("list");
    loadSubCategory();
  };

  const handleAddNewClick = () => {
    setCrTitle("Add Sub Category");
    setCrView("form");
    setFormData(dataModel);
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tm_itcl);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      if (formData.id) {
        const apiVersion = "/v7/";
        const apiEndPoint = `/update/${formData.id}?key=tm_itcl`;
        const reqBody = formData;
        const resp = await apiRequest(apiVersion, apiEndPoint, {
          body: reqBody,
        });
        //console.log("resp", resp);
        if (resp.tm_itcl.status) {
          //await loadRoles();
          setDataList((prevList) =>
            prevList.map((item) =>
              item.id === reqBody.id
                ? { ...item, ...reqBody } // merge updated fields
                : item,
            ),
          );
          alert({
            message: `Sub Category edited successfully ${formData.itcl_name}`,
            header: "Edited",
          });
          setCrTitle("Sub Category List");
          setCrView("list");
        } else {
          alert({
            message: resp.tm_itcl.message,
            header: "Error while Editing",
          });
        }
      } else {
        const apiVersion = "/v7/";
        const apiEndPoint = "/store?key=tm_itcl";
        const reqBody = {
          ...formData,
          uuid: generateGuid(),
        };

        const resp = await apiRequest(apiVersion, apiEndPoint, {
          body: reqBody,
        });
        //console.log("resp", resp);
        if (resp.tm_itcl.status) {
          //await loadRoles();
          setDataList((prev) => [...prev, reqBody]);
          alert({
            message: `Sub Category saved successfully ${formData.itcl_name}`,
            header: "Saved",
          });
          setCrTitle("Sub Category List");
          setCrView("list");
        } else {
          alert({
            message: resp.tm_itcl.message,
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
    categoryDataList,
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
export default useSubCategory;
