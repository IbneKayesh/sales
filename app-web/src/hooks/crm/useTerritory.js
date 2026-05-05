import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmcb_trtry from "@/models/crm/tmcb_trtry.json";
const dataModel = generateDataModel(tmcb_trtry);
import { territoryAPI } from "@/api/crm/territoryAPI.js";
import { shortdataAPI } from "@/api/settings/shortdataAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";
import { dzoneAPI } from "@/api/crm/dzoneAPI.js";
import { tareaAPI } from "@/api/crm/tareaAPI.js";

const useTerritory = () => {
  //hooks :: menuId M01-M01-M03,
  //mnusr_extpr : export, mnusr_addpr : add, mnusr_edtpr : edit, mnusr_delpr : delete
  const { getPageAuth } = useAuth();
  const { showToast, showToastError, confirm, alert, isBusy, setIsBusy } =
    useAppUI();
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [crTitle, setCrTitle] = useState("Territory List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [dzone_cntry_Options, setDzone_cntry_Options] = useState([]);
  const [tarea_dzone_Options, setTarea_dzone_Options] = useState([]);
  const [trtry_tarea_Options, setTrtry_tarea_Options] = useState([]);

  useEffect(() => {
    const perms = getPageAuth("M01-M01-M03");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadTerritory = async () => {
    try {
      setIsBusy(true);
      const resp = await territoryAPI.getAll({});
      //console.log("resp", resp);
      setDataList(resp.data || []);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmcb_trtry);
    setErrors(newErrors);

    console.log("field", field);
    console.log("value", value);
    
    if (field === "dzone_cntry") {
      handleGetDZone(value);
    }

    if (field === "tarea_dzone") {
      handleGetTArea(value);
    }
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Territory");
    setCrView("form");
    handleGetCountry();
  };

  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.trtry_actve ? "Deactivate" : "Activate"} this ${rowData.trtry_wname}?`,
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
      const resp = await territoryAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Territory List");
        setCrView("list");
        loadTerritory();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Territory List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Territory");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Territory List");
    setCrView("list");
    loadTerritory();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add Territory");
    setCrView("form");
    setFormData(dataModel);
    handleGetCountry();
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmcb_trtry);
      setErrors(newErrors);
      console.log("handleSave: ", formData);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await territoryAPI.upsert(formData);
      //console.log("resp", resp);

      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      
      if (resp.success) {
        setCrTitle("Territory List");
        setCrView("list");
        loadTerritory();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetCountry = async () => {
    if (dzone_cntry_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await shortdataAPI.getCountry();
      //console.log("resp", resp);
      setDzone_cntry_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetDZone = async (dzone_cntry) => {
    // if (dzone_cntry_Options.length > 0) {
    //   return;
    // }    
    //console.log("field", dzone_cntry);
    try {
      setIsBusy(true);
      const resp = await dzoneAPI.getByCountry({ dzone_cntry: dzone_cntry });
      //console.log("resp", resp);
      setTarea_dzone_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetTArea = async (tarea_dzone) => {
    // if (dzone_cntry_Options.length > 0) {
    //   return;
    // }    
    //console.log("field", tarea_dzone);
    try {
      setIsBusy(true);
      const resp = await tareaAPI.getByDZone({ tarea_dzone: tarea_dzone });
      //console.log("resp", resp);
      setTrtry_tarea_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  return {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    dzone_cntry_Options,
    tarea_dzone_Options,
    trtry_tarea_Options,
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
export default useTerritory;
