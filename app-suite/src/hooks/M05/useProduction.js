import { useState, useEffect } from "react";
import tmmb_prods from "@/models/M05/tmmb_prods.json";
import { validateModel, getFormDefaults } from "@/utils/modelValidator";

const EMPTY_FORM = getFormDefaults(tmmb_prods);

const useProduction = () => {
  //hooks
  //const { showToast, showToastError, confirm, alert, isBusy, setIsBusy } = useAppUI();
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [crTitle, setCrTitle] = useState("Production List");
  const [crView, setCrView] = useState("SYS_FRM_1");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  //functions

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
  };

  const handleAddNew = () => {
    setCrView("SYS_FRM_1");
    resetForm();
  };

  const handleChange = (f, v) => {
    // console.log("f", f);
    // console.log("v", v);
    setFormData((prev) => ({
      ...prev,
      [f]: v,
    }));
  };
  const handleSave = async () => {
    //console.log("handleSave", formData);
    const frmErr = validateModel(formData, tmmb_prods);
    //console.log("handleSaveErrr", frmErr);
    setFormErrors(frmErr);
    if (Object.keys(frmErr).length > 0) return;

    setDataList((prev) => [...prev, { ...formData }]);
    resetForm();
    setCrView("SYS_LST_1");
  };
  const handleCancel = () => {
    setCrView("SYS_LST_1");
    resetForm();
  };

  return {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    formErrors,
    dataList,
    //functions
    handleChange,
    handleAddNew,
    handleSave,
    handleCancel,
  };
};
export default useProduction;
