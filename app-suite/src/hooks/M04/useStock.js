import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmib_brand from "@/models/M04/tmib_brand.json";
const dataModel = generateDataModel(tmib_brand);
import { stockAPI } from "@/api/M04/stockAPI.js";
import { tabColumnsAPI } from "@/api/M01/tabColumnsAPI.js";

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

  const getAllStock = async () => {
    try {
      setIsBusy(true);
      const resp = await stockAPI.getAvailable({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getTabColumns();
    getAllStock();
  }, []);

  const handleSearch = async () => {
    getAllStock();
  };

  const handleEdit = async (row) => {};

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
    //functions
    handleSearch,
    handleEdit,
  };
};
export default useStock;
