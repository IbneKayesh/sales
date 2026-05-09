import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_party from "@/models/accounts/tmtb_party.json";
const dataModel = generateDataModel(tmtb_party);
import { partiesAPI } from "@/api/accounts/partiesAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";
import { contactAPI } from "@/api/crm/contactAPI.js";
import { coaAPI } from "@/api/accounts/coaAPI.js";

const useParties = () => {
  //hooks :: menuId M05-M01-M002,
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
  const [crTitle, setCrTitle] = useState("Party Accounts List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [party_vndor_Options, setParty_vndor_Options] = useState([]);
  const [party_chtrc_Options, setParty_chtrc_Options] = useState([]);
  const [party_chtpy_Options, setParty_chtpy_Options] = useState([]);
  const [party_chtad_Options, setParty_chtad_Options] = useState([]);

  const party_ptype_Options = [
    {
      label: "Vendor",
      value: "Vendor",
    },
    {
      label: "Employee",
      value: "Employee",
    },
    {
      label: "Bank",
      value: "Bank",
    },
  ];

  useEffect(() => {
    const perms = getPageAuth("M05-M01-M002");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadParties = async () => {
    try {
      setIsBusy(true);
      const resp = await partiesAPI.getAll({});
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
    const newErrors = validate({ ...formData, [field]: value }, tmtb_party);
    setErrors(newErrors);

    if (field === "party_ptype") {
      //reset for any type
      setParty_vndor_Options([]);
      setFormData((prev) => ({ ...prev, party_pname: "" }));
      if (value === "Vendor") {
        handleGetContacts();
      }
    }
    if (field === "party_vndor") {
      const party_pname = party_vndor_Options.find((f) => f.id == value).cntct_cntnm;
      setFormData((prev) => ({ ...prev, party_pname: party_pname }));
    }
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Party Accounts");
    setCrView("form");
    handleGetCoaPosting();
  };

  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.party_actve ? "Deactivate" : "Activate"} this ${rowData.party_pname}?`,
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
      const resp = await partiesAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Party Accounts List");
        setCrView("list");
        loadParties();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Party Accounts List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Party Accounts");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Party Accounts List");
    setCrView("list");
    loadParties();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add Party Accounts");
    setCrView("form");
    setFormData(dataModel);
    handleGetCoaPosting();
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmtb_party);
      setErrors(newErrors);
      //console.log("handleSave: ", formData);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await partiesAPI.upsert(formData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Party Accounts List");
        setCrView("list");
        loadParties();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //other functions

  const handleGetContacts = async () => {
    try {
      setIsBusy(true);
      const resp = await contactAPI.getAvailContactAccounts();
      //console.log("resp", resp);
      setParty_vndor_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetCoaPosting = async () => {
    try {
      setIsBusy(true);
      const resp = await coaAPI.getCoaPosting();
      //console.log("resp", resp.data);

      const chtac_list = resp.data
      .map((item) => ({
        id: item.id,
        chtac_cname: `${item.chtac_ctype} > ${item.chtac_cname} #${item.chtac_chtno}`,
      }));
      //console.log("chtac_list", chtac_list);
      setParty_chtrc_Options(chtac_list);
      setParty_chtpy_Options(chtac_list);
      setParty_chtad_Options(chtac_list);
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
    party_ptype_Options,
    party_vndor_Options,
    party_chtrc_Options,
    party_chtpy_Options,
    party_chtad_Options,
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
export default useParties;
