import { useState } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmrb_dzone from "@/models/crm/tmrb_dzone.json";
const dataModel = generateDataModel(tmrb_dzone);
import { apiRequest } from "@/utils/api.js";
import { dzoneAPI } from "@/api/crm/dzoneAPI.js";

const useDZone = () => {
  //hooks
  const { showToast, showToastError, confirm, alert, isBusy, setIsBusy } = useAppUI();
  const [crTitle, setCrTitle] = useState("Zone List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  //functions
  const loadDZone = async () => {
    try {
      setIsBusy(true);
      const resp = await dzoneAPI.getAll({});
      //console.log("resp", resp);
      setDataList(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmrb_dzone);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setFormData(rowData);
    setCrTitle("Edit Zone");
    setCrView("form");
  };
  const handleDelete = (rowData) => {
    confirm({
      message: `Do you want to ${rowData.dzone_actve ? "Deactivate" : "Activate"} this ${rowData.dzone_dname}?`,
      header: "Confirmation!",
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
      const resp = await dzoneAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Zone List");
        setCrView("list");
        loadDZone();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Zone List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Zone");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Zone List");
    setCrView("list");
    loadDZone();
  };

  const handleAddNewClick = () => {
    setCrTitle("Add Zone");
    setCrView("form");
    setFormData(dataModel);
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmrb_dzone);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await dzoneAPI.upsert(formData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Zone List");
        setCrView("list");
        loadDZone();
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
export default useDZone;
