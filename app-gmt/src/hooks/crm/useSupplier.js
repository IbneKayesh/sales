import { useState } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tm_supl from "@/models/crm/tm_supl.json";
const dataModel = generateDataModel(tm_supl);
import { apiRequest } from "@/utils/api.js";

const useSupplier = () => {
  //hooks
  const { showToast, confirm, alert, isBusy, setIsBusy } = useAppUI();
  const [crTitle, setCrTitle] = useState("Supplier List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  //other states
  const [acmpDataList, setAcmpDataList] = useState([]);


  //functions
  const loadSupplier = async () => {
    try {
      setIsBusy(true);
      const apiVersion = "/v7/";
      const apiEndPoint = "/data?key=tm_supl;tm_acmp";
      const resp = await apiRequest(apiVersion, apiEndPoint, {});
      //console.log("resp", resp.tm_supl.data);
      setDataList(resp.tm_supl.data);
      setAcmpDataList(resp.tm_acmp.data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tm_supl);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setFormData(rowData);
    setCrTitle("Edit Supplier");
    setCrView("form");
  };
  const handleDelete = (rowData) => {
    confirm({
      message: `Do you want to delete this ${rowData.supl_name}?`,
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
      const apiEndPoint = `/destroy/${rowData.id}?key=tm_supl`;
      const reqBody = { lfcl_id: rowData.lfcl_id == 1 ? 2 : 1 };
      const resp = await apiRequest(apiVersion, apiEndPoint, { body: reqBody });
      //console.log("resp", resp);
      if (resp.tm_supl.status) {
        await loadSupplier();
        alert({
          message: `Supplier deleted successfully ${rowData.supl_name}`,
          header: "Deleted",
        });
      } else {
        alert({
          message: resp.tm_supl.message,
          header: "Error while Deleting",
        });
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Supplier List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Supplier");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
  };

  const handleRefreshClick = () => {
    setCrTitle("Supplier List");
    setCrView("list");
    loadSupplier();
  };

  const handleAddNewClick = () => {
    setCrTitle("Add Supplier");
    setCrView("form");
    setFormData(dataModel);
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tm_supl);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      if (formData.id) {
        const apiVersion = "/v5/";
        const apiEndPoint = `/update/${formData.id}?key=tm_supl`;
        const reqBody = formData;
        const resp = await apiRequest(apiVersion, apiEndPoint, {
          body: reqBody,
        });
        //console.log("resp", resp);
        if (resp.tm_supl.status) {
          //await loadSupplier();
          setDataList((prevList) =>
            prevList.map((item) =>
              item.id === reqBody.id
                ? { ...item, ...reqBody } // merge updated fields
                : item,
            ),
          );
          alert({
            message: `Supplier edited successfully ${formData.supl_name}`,
            header: "Edited",
          });
          setCrTitle("Supplier List");
          setCrView("list");
        } else {
          alert({
            message: resp.tm_supl.message,
            header: "Error while Editing",
          });
        }
      } else {
        const apiVersion = "/v4/";
        const apiEndPoint = "/store?key=tm_supl";
        const reqBody = formData;
        const resp = await apiRequest(apiVersion, apiEndPoint, {
          body: reqBody,
        });
        //console.log("resp", resp);
        if (resp.tm_supl.status) {
          //await loadSupplier();
          setDataList((prev) => [...prev, reqBody]);
          alert({
            message: `Supplier saved successfully ${formData.supl_name}`,
            header: "Saved",
          });
          setCrTitle("Supplier List");
          setCrView("list");
        } else {
          alert({
            message: resp.tm_supl.message,
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
    acmpDataList,
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
export default useSupplier;
