import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_mjrnl from "@/models/accounts/tmtb_mjrnl.json";
import tmtb_djrnl from "@/models/accounts/tmtb_djrnl.json";
const dataModel = generateDataModel(tmtb_mjrnl);
const dataModelItem = generateDataModel(tmtb_djrnl);
import { journalAPI } from "@/api/accounts/journalAPI.js";
import { departmentsAPI } from "@/api/settings/departmentsAPI.js";
import { fiscalYearAPI } from "@/api/accounts/fiscalYearAPI.js";
import { acPeriodAPI } from "@/api/accounts/acPeriodAPI.js";
import { coaAPI } from "@/api/accounts/coaAPI.js";
import { partiesAPI } from "@/api/accounts/partiesAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";
import { buildCoaTree, findCoaTree } from "@/utils/jsonParser.js";

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
      label: "Contra Voucher",
      value: "Contra Voucher",
    },
    {
      label: "Purchase Voucher",
      value: "Purchase Voucher",
    },
    {
      label: "Payment Voucher",
      value: "Payment Voucher",
    },
    {
      label: "Sales Voucher",
      value: "Sales Voucher",
    },
    {
      label: "Receipt Voucher",
      value: "Receipt Voucher",
    },
    {
      label: "Adjustment Entry",
      value: "Adjustment Entry",
    },
  ];

  //other states items
  const [djrnl_chtac_Options, setDjrnl_chtac_Options] = useState([]);
  const [djrnl_party_Options, setDjrnl_party_Options] = useState([]);
  const [formDataItems, setFormDataItems] = useState(dataModelItem);
  const [dataListItems, setDataListItems] = useState([]);

  useEffect(() => {
    const perms = getPageAuth("M05-M02");
    setPageAuth(perms);
  }, [getPageAuth]);

  useEffect(() => {
    const totalDr = dataListItems.reduce(
      (acc, curr) => acc + Number(curr.djrnl_drval || 0),
      0,
    );
    const totalCr = dataListItems.reduce(
      (acc, curr) => acc + Number(curr.djrnl_crval || 0),
      0,
    );

    setFormData((prev) => ({
      ...prev,
      mjrnl_drval: Number(totalDr).toFixed(2),
      mjrnl_crval: Number(totalCr).toFixed(2),
    }));
  }, [dataListItems]);

  //functions
  const loadJournal = async () => {
    try {
      setIsBusy(true);
      const resp = await journalAPI.getAll({});
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
    const newErrors = validate({ ...formData, [field]: value }, tmtb_mjrnl);
    setErrors(newErrors);

    // if (field === "mjrnl_fsyar") {
    //   handleGetAccountPeriod(value);
    // }
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Journal");
    setCrView("form");
    handleGetDetail(rowData.id);
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
    handleGetCOA();
    setFormDataItems(dataModelItem);
    setDataListItems([]);
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmtb_mjrnl);
      setErrors(newErrors);
      //console.log("handleSave: ", newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      //console.log("newErrors", newErrors);

      setIsBusy(true);

      if (dataListItems.length === 0) {
        showToast("error", "Error", "No items added");
        return;
      }

      const totalDr = dataListItems.reduce(
        (acc, curr) => acc + Number(curr.djrnl_drval || 0),
        0,
      );
      const totalCr = dataListItems.reduce(
        (acc, curr) => acc + Number(curr.djrnl_crval || 0),
        0,
      );

      if (Number(totalDr).toFixed(2) !== Number(totalCr).toFixed(2)) {
        showToast("error", "Error", "Debit and Credit amounts must be equal");
        return;
      }

      const reqBody = {
        ...formData,
        mjrnl_crncy: "BDT",
        tmtb_djrnl: dataListItems || [],
      };

      const resp = await journalAPI.upsert(reqBody);
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
    // if (mjrnl_crncy_Options.length > 0) {
    //   return;
    // }
    // try {
    //   setIsBusy(true);
    //   const resp = await shortdataAPI.getCurrency();
    //   //console.log("getCurrency resp", resp);
    //   setMjrnl_crncy_Options(resp.data);
    //   showToastError(resp);
    //   if (resp.data.length === 1) {
    //     setFormData((prev) => ({
    //       ...prev,
    //       mjrnl_crncy: resp.data[0].value_text,
    //     }));
    //   }
    // } catch (error) {
    // } finally {
    //   setIsBusy(false);
    // }
    return;
  };

  const handleGetFiscalYear = async () => {
    // if (mjrnl_fsyar_Options.length > 0) {
    //   return;
    // }
    // try {
    //   setIsBusy(true);
    //   const resp = await fiscalYearAPI.getAllActive();
    //   //console.log("resp1", resp);
    //   setMjrnl_fsyar_Options(resp.data);
    //   showToastError(resp);
    //   // if (resp.data.length === 1) {
    //   //   setFormData((prev) => ({
    //   //     ...prev,
    //   //     mjrnl_fsyar: resp.data[0].id,
    //   //   }));
    //   // }
    // } catch (error) {
    // } finally {
    //   setIsBusy(false);
    // }
    return;
  };
  const handleGetAccountPeriod = async (id) => {
    // if (mjrnl_acprd_Options.length > 0) {
    //   return;
    // }
    // try {
    //   setIsBusy(true);
    //   const resp = await acPeriodAPI.getAllActive({ acprd_fsyar: id });
    //   //console.log("resp", resp);
    //   setMjrnl_acprd_Options(resp.data);
    //   showToastError(resp);
    //   if (resp.data.length === 1) {
    //     setFormData((prev) => ({
    //       ...prev,
    //       mjrnl_acprd: resp.data[0].id,
    //     }));
    //   }
    // } catch (error) {
    // } finally {
    //   setIsBusy(false);
    // }
    return;
  };

  const handleGetCOA = async () => {
    if (mjrnl_fsyar_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      //const resp = await coaAPI.getCoaPosting();
      const resp = await coaAPI.getWithPartyCount();
      //console.log("resp1", resp);

      // const ddlData = (resp?.data || []).map((item) => ({
      //   value_text: item.id,
      //   label_text: `${item.chtac_ctype} > ${item.chtac_cname} #${item.chtac_chtno}`,
      // }));
      // setDjrnl_chtac_Options(ddlData);
      const list = resp.data.map((item) => ({
        ...item,
        chtac_cname: item.party_count > 0 ? item.chtac_cname + " / " + item.party_count : item.chtac_cname,
      }));
      const coaTree = buildCoaTree(list);
      setDjrnl_chtac_Options(coaTree);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetPartyCoa = async (value) => {
    try {
      setIsBusy(true);
      const resp = await partiesAPI.getByCoa({ party_chtac: value });
      //console.log("resp1", resp);

      const ddlData = (resp?.data || []).map((item) => ({
        value_text: item.id,
        label_text:
          item.party_pname +
          " | " +
          item.party_ptype +
          " | " +
          item.party_pcode,
      }));

      setDjrnl_party_Options(ddlData);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChangeItems = (field, value) => {
    setFormDataItems((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataItems, [field]: value },
      tmtb_djrnl,
    );
    setErrors(newErrors);
    //console.log("field", field);
    if (field === "djrnl_chtac") {
      setFormDataItems((prev) => ({ ...prev, djrnl_party: "" }));
      handleGetPartyCoa(value);
    }
    if (field === "djrnl_drval") {
      setFormDataItems((prev) => ({ ...prev, djrnl_crval: 0 }));
    }

    if (field === "djrnl_crval") {
      setFormDataItems((prev) => ({ ...prev, djrnl_drval: 0 }));
    }
  };

  const handleAddToListClick = async () => {
    const newErrors = validate(formDataItems, tmtb_djrnl);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (formDataItems.djrnl_drval === 0 && formDataItems.djrnl_crval === 0) {
      showToast("error", "Error", "Enter debit/credit value");
      return;
    }

    // ✅ CHECK DUPLICATE FIRST (outside state setter)
    const exists = dataListItems.some(
      (x) => x.djrnl_party === formDataItems.djrnl_party,
    );

    if (exists) {
      showToast("error", "Error", "Party already exists");
      return;
    }

    //console.log("djrnl_party_Options", djrnl_party_Options);

    // const chtac_cname = djrnl_chtac_Options.find(
    //   (item) => item.id === formDataItems.djrnl_chtac,
    // ).chtac_cname;

    const node = findCoaTree(djrnl_chtac_Options, formDataItems.djrnl_chtac);
    const chtac_cname = `${node?.data?.chtac_chtno} - ${node?.data?.chtac_cname}`;

    const party_pname = djrnl_party_Options.find(
      (item) => item.value_text === formDataItems.djrnl_party,
    ).label_text;
    const itemBody = {
      ...formDataItems,
      chtac_cname: chtac_cname,
      party_pname: party_pname,
    };

    // ✅ SAFE TO ADD
    setDataListItems((prev) => [...prev, itemBody]);
    setFormDataItems(dataModelItem);
  };

  const handleRemoveItemsClick = (rowData) => {
    setDataListItems((prev) =>
      prev.filter((x) => x.djrnl_party !== rowData.djrnl_party),
    );
  };

  const handleGetDetail = async (id) => {
    try {
      setIsBusy(true);
      const resp = await journalAPI.getDetail({ djrnl_mjrnl: id });
      //console.log("resp", resp);
      setDataListItems(resp.data);
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
    mjrnl_dpart_Options,
    mjrnl_crncy_Options,
    mjrnl_fsyar_Options,
    mjrnl_acprd_Options,
    mjrnl_trtyp_Options,
    djrnl_chtac_Options,
    djrnl_party_Options,
    formDataItems,
    dataListItems,
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
    handleRemoveItemsClick,
  };
};
export default useJournal;

// The Golden Rule
// | Account Type | Debit Effect | Credit Effect |
// | ------------ | ------------ | ------------- |
// | Asset        | Increase (+) | Decrease (-)  |
// | Expense      | Increase (+) | Decrease (-)  |
// | Liability    | Decrease (-) | Increase (+)  |
// | Income       | Decrease (-) | Increase (+)  |
// | Equity       | Decrease (-) | Increase (+)  |

// DEAD CLIC
// DEAD = Debit increases
// Assets + Expenses + Drawings

// CLIC = Credit increases
// Liability + Income + Capital

// Apply formula:
// Nature	Formula
// ASSET	DR - CR
// EXPENSE	DR - CR
// LIABILITY	CR - DR
// INCOME	CR - DR
// EQUITY	CR - DR
