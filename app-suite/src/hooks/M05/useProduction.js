import { useState, useEffect } from "react";
import tmmb_prods from "@/models/M05/tmmb_prods.json";
import { validateModel, getFormDefaults } from "@/utils/modelValidator";
import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconSave,
  IconSearch,
  IconBackArrow,
  IconClose,
} from "@/assets/icons";

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
  const [crTitle, setCrTitle] = useState("Brand List");
  const [crView, setCrView] = useState("SYS_LST_1");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);


  //functions

  const handleAddNew = () => {
    console.log("handleAddNew");
  };

  const handleChange = () => {
    console.log("handleChange");
  };

  return {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //functions
    handleAddNew,
    handleChange,
  };
};
export default useProduction;
