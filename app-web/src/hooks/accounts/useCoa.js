import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_chtac from "@/models/accounts/tmtb_chtac.json";
const dataModel = generateDataModel(tmtb_chtac);
import { coaAPI } from "@/api/accounts/coaAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";

const useCoa = () => {
  //hooks :: menuId M05-M01-M001,
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
  const [crTitle, setCrTitle] = useState("COA List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [chtac_chtac_Options, setChtac_chtac_Options] = useState([]);

  const chtac_ctype_Options = [
    {
      label: "Asset",
      value: "Asset",
      range_start: "1000",
      range_end: "1999",
    },
    {
      label: "Liability",
      value: "Liability",
      range_start: "2000",
      range_end: "2999",
    },
    {
      label: "Equity",
      value: "Equity",
      range_start: "3000",
      range_end: "3999",
    },
    {
      label: "Income",
      value: "Income",
      range_start: "4000",
      range_end: "4999",
    },
    {
      label: "Expense",
      value: "Expense",
      range_start: "5000",
      range_end: "5999",
    },
  ];

  useEffect(() => {
    const perms = getPageAuth("M05-M01-M001");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadAccountHeads = async () => {
    try {
      setIsBusy(true);
      const resp = await coaAPI.getAll({});
      //console.log("resp", resp);
      setDataList(resp.data || []);
      showToastError(resp);

      //make this parent
      const list = resp.data || [];
      const parentOptions = list
        .filter((item) => item.chtac_actve)
        .filter((item) => !item.chtac_alpst)
        .map((item) => ({
          id: item.id,
          chtac_cname: `${item.chtac_cname} (${item.chtac_chtno})`,
        }));
      parentOptions.push({ id: "-", chtac_cname: "(No Parent)" });
      setChtac_chtac_Options(parentOptions);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmtb_chtac);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit COA");
    setCrView("form");
  };

  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.chtac_actve ? "Deactivate" : "Activate"} this ${rowData.chtac_cname}?`,
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
      const resp = await coaAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("COA List");
        setCrView("list");
        loadAccountHeads();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("COA List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search COA");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("COA List");
    setCrView("list");
    loadAccountHeads();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add COA");
    setCrView("form");
    setFormData(dataModel);
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmtb_chtac);
      setErrors(newErrors);
      //console.log("handleSave: ", formData);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const chtac_chtno = chtac_ctype_Options.find(
        (item) => item.value === formData.chtac_ctype,
      )?.range_start;

      const reqBody = {
        ...formData,
        chtac_chtno: chtac_chtno,
      };
      setIsBusy(true);

      const resp = await coaAPI.upsert(reqBody);
      console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("COA List");
        setCrView("list");
        loadAccountHeads();
      }
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
    chtac_chtac_Options,
    chtac_ctype_Options,
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
export default useCoa;
