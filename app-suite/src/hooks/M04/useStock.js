import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmib_brand from "@/models/M04/tmib_brand.json";
const dataModel = generateDataModel(tmib_brand);
import { stockAPI } from "@/api/M04/stockAPI.js";
import { tabColumnsAPI } from "@/api/M01/tabColumnsAPI.js";
import { departmentAPI } from "@/api/M01/departmentAPI.js";

const useStock = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M04-M0005");
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [tcVisibleItem, setTcVisibleItem] = useState([]);
  const [readOnly, setReadOnly] = useState(false);
  const [stopEdit, setStopEdit] = useState(false);
  const [listData, setListData] = useState([]);
  const [formData, setFormData] = useState(dataModel);
  const [listDataItem, setListDataItem] = useState([]);
  const [formDataItem, setFormDataItem] = useState({});
  const [formErrors, setFormErrors] = useState({});
  //others
  const [dpart_Options, setDpart_Options] = useState([]);

  //Table Columns
  const getTabColumns = async () => {
    try {
      setIsBusy(true);
      const resp = await tabColumnsAPI.getByPage({
        tabcl_cname: "SYS_INVENTORY_STOCK",
      });
      const list = resp.data || [];
      //console.log("list", list);
      setTcVisibleItem(list);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };

  const getAllDepartments = async () => {
    if (dpart_Options.length > 0) {
      return;
    }
    try {
      const resp = await departmentAPI.getAllActive({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {}
  };

  useEffect(() => {
    getTabColumns();
    getAllDepartments();
  }, []);

  const handleSearch = async () => {
    getStockLine();
  };

  const getStockLine = async () => {
    try {
      setIsBusy(true);
      const resp = await stockAPI.getStockLine(formData);
      const list = resp.data || [];
      setListData(list);
      if (!resp.success) {
        //resp.message
        showToast("Select Department", {
          type: resp.success ? "success" : "danger",
        });
      }
      //console.log("resp", resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
  };

  const handleEdit = async (row) => {
    const isExists = listDataItem?.find((opt) => opt.id === row.id);
    if (isExists) {
      showToast("This Stock is already added", { type: "warning" });
      return;
    }

    // Only check similarity if the list already contains items
    if (listDataItem?.length > 0) {
      const isSimilar = listDataItem.find(
        (opt) => opt.stock_price === row.stock_price,
      );
      if (!isSimilar) {
        showToast(`Select similar > ${listDataItem[0]?.price_cname}`, {
          type: "warning",
        });
        return;
      }
    }

    const newItemList = [...(listDataItem || []), row];
    setListDataItem(newItemList);
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormDataItem(dataModel);
    setListDataItem([]);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      if (listDataItem.length < 2) {
        showToast("Select at least 2 items", { type: "danger" });
        return;
      }

      const reqBody = {
        stock_lines: listDataItem,
      };
      setIsBusy(true);

      const resp = await stockAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? Saved : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setListDataItem([]);
        getStockLine();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  return {
    isBusy,
    pgView,
    pageAuth,
    tcVisibleItem,
    readOnly,
    stopEdit,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    dpart_Options,
    //functions
    handleChange,
    handleEdit,
    handleSearch,
    handleCancel,
    handleSubmit,
  };
};
export default useStock;
