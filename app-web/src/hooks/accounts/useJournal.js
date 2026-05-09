import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_mjrnl from "@/models/accounts/tmtb_mjrnl.json";
const dataModel = generateDataModel(tmtb_mjrnl);
import { journalAPI } from "@/api/accounts/journalAPI.js";
import { shortdataAPI } from "@/api/settings/shortdataAPI.js";
import { departmentsAPI } from "@/api/settings/departmentsAPI.js";
import { fiscalYearAPI } from "@/api/accounts/fiscalYearAPI.js";
import { acPeriodAPI } from "@/api/accounts/acPeriodAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";

const useJournal = () => {
  //hooks :: menuId M05-M02,
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
  const [crTitle, setCrTitle] = useState("Journal List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [mjrnl_dpart_Options, setMjrnl_dpart_Options] = useState([]);
  const [mjrnl_crncy_Options, setMjrnl_crncy_Options] = useState([]);
  const [mjrnl_fsyar_Options, setMjrnl_fsyar_Options] = useState([]);
  const [mjrnl_acprd_Options, setMjrnl_acprd_Options] = useState([]);

  const mjrnl_trtyp_Options = [
    {
      label: "Journal Voucher",
      value: "Journal Voucher",
    },
    {
      label: "Payment Voucher",
      value: "Payment Voucher",
    },
    {
      label: "Receipt Voucher",
      value: "Receipt Voucher",
    },
    {
      label: "Contra Entry",
      value: "Contra Entry",
    },
    {
      label: "Adjustment Entry",
      value: "Adjustment Entry",
    },
  ];

  //other states items
  const [formDataItems, setFormDataItems] = useState({});
  const [dataListItems, setDataListItems] = useState([]);

  useEffect(() => {
    const perms = getPageAuth("M05-M02");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadJournal = async () => {
    try {
      setIsBusy(true);
      const resp = await journalAPI.getAll({});
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
    const newErrors = validate({ ...formData, [field]: value }, tmtb_mjrnl);
    setErrors(newErrors);

    if (field === "mjrnl_fsyar") {
      handleGetAccountPeriod(value);
    }
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Journal");
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
      const resp = await journalAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Journal List");
        setCrView("list");
        loadJournal();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Journal List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Journal");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Journal List");
    setCrView("list");
    loadJournal();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add Journal");
    setCrView("form");
    setFormData(dataModel);

    handleGetDepartment();
    handleGetCurrency();
    handleGetFiscalYear();
    //handleGetAccountPeriod();
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmtb_mjrnl);
      setErrors(newErrors);
      //console.log("handleSave: ", newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      //console.log("newErrors", newErrors);
      const resp = await journalAPI.upsert(formData);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Journal List");
        setCrView("list");
        loadJournal();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //other functions
  const handleGetDepartment = async () => {
    if (mjrnl_dpart_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await departmentsAPI.getAllActive();
      //console.log("resp", resp);
      setMjrnl_dpart_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetCurrency = async () => {
    if (mjrnl_crncy_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await shortdataAPI.getCurrency();
      //console.log("resp", resp);
      setMjrnl_crncy_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetFiscalYear = async () => {
    if (mjrnl_fsyar_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await fiscalYearAPI.getAllActive();
      //console.log("resp1", resp);
      setMjrnl_fsyar_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };
  const handleGetAccountPeriod = async (id) => {
    if (mjrnl_acprd_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await acPeriodAPI.getAllActive({ acprd_fsyar: id });
      //console.log("resp", resp);
      setMjrnl_acprd_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  
  const handleChangeItems = (field, value) => {
    setFormDataItems((prev) => ({ ...prev, [field]: value }));
    //const newErrors = validate({ ...formDataItems, [field]: value }, tmtb_mjrnl);
   //setErrors(newErrors);
  };


  const handleAddToListClick = () => {    
    console.log("formDataItems", formDataItems)
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
    mjrnl_dpart_Options,
    mjrnl_crncy_Options,
    mjrnl_fsyar_Options,
    mjrnl_acprd_Options,
    mjrnl_trtyp_Options,
    formDataItems,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
    //other functions
    handleChangeItems,
    handleAddToListClick,
  };
};
export default useJournal;
