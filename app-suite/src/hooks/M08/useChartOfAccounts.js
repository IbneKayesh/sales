import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { coaAPI } from "@/api/M08/coaAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_chtac from "@/models/M08/tmtb_chtac.json";
const dataModel = generateDataModel(tmtb_chtac);
import { buildPaths } from "@/utils/pathBuilder.js";

const useChartOfAccounts = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M08-M0001");
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [readOnly, setReadOnly] = useState(false);
  const [stopEdit, setStopEdit] = useState(false);
  const [listData, setListData] = useState([]);
  const [formData, setFormData] = useState(dataModel);
  const [listDataItem, setListDataItem] = useState([]);
  const [formDataItem, setFormDataItem] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [chtac_chtac_Options, setChtac_chtac_Options] = useState([]);

  const getAllCoa = async () => {
    try {
      setIsBusy(true);
      const resp = await coaAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
      //make this parent
      const listActive = list
        .filter((item) => item.chtac_actve)
        .map((item) => ({
          id: item.id,
          name: item.chtac_cname,
          parent_id: item.chtac_chtac,
        }));

      // setChtac_chtac_Options(
      //   buildPaths([
      //     { id: "-", name: "(No Parent)", parent_id: "-" },
      //     ...listActive,
      //   ]),
      // );

      setChtac_chtac_Options(buildPaths(listActive));
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllCoa();
  }, []);

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmtb_chtac);
    setFormErrors(newErrors);
    if (f === "chtac_chtac" && v === "-") {
      setStopEdit(false);
    } else {
      setStopEdit(true);

      const chtac_ctype = listData.find((opt) => opt.id === v);
      console.log(chtac_ctype);
      setFormData((prev) => ({
        ...prev,
        chtac_ctype: chtac_ctype?.chtac_ctype,
        chtac_ntype: chtac_ctype?.chtac_ntype,
      }));
    }
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.chtac_actve;
    const dataName = rowData.chtac_cname;
    const confirmation = await confirmBox({
      title: isActive ? "Deactivate" : "Activate",
      message: `Are you sure you want to ${
        isActive ? "deactivate" : "activate"
      } "${dataName}"?`,
      confirmText: isActive ? "Deactivate" : "Activate",
      variant: isActive ? "danger" : "success",
    });
    if (!confirmation) return;

    try {
      setIsBusy(true);
      const resp = await coaAPI.delete(rowData);
      alertBox({
        title: resp.success
          ? isActive
            ? "Deactivated"
            : "Activated"
          : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllCoa();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllCoa();
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmtb_chtac);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await coaAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllCoa();
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
    readOnly,
    stopEdit,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    chtac_chtac_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
  };
};
export default useChartOfAccounts;
