import { useState, useEffect } from "react";
import { contactAPI } from "@/api/crm/contactAPI";
import tmcb_cntcs from "@/models/crm/tmcb_cntcs.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const dataModel = generateDataModel(tmcb_cntcs, { edit_stop: 0 });

export const useContacts = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const cntct_sorceOptions = [{ label: "Local", value: "Local" }];
  const cntct_cntryOptions = [{ label: "Bangladesh", value: "Bangladesh" }];

  // const [ledgerContactList, setLedgerContactList] = useState([]);
  // const [contactPaymentList, setContactPaymentList] = useState([]);
  // const [supplierList, setSupplierList] = useState([]);
  // const [contactCustomerList, setContactCustomerList] = useState([]);
  // const [contactsLedger, setContactsLedger] = useState([]);

  const loadContacts = async () => {
    try {
      const response = await contactAPI.getAll({
        cntct_users: user.users_users,
      });
      // response = { message, data }
      setDataList(response.data);
      setAllData(response.data);

      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    //console.log("useEffect", dataModel);
    loadContacts();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmcb_cntcs);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
    setErrors({});
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    handleClear();
    setCurrentView("form");
  };

  const handleEdit = (data) => {
    //console.log("edit: " + JSON.stringify(data));
    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await contactAPI.delete(rowData);

      const updatedList = allData.filter((c) => c.id !== rowData.id);
      setAllData(updatedList);
      setDataList(updatedList);

      showToast(
        response.success ? "info" : "error",
        response.success ? "Deleted" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("error", "Error", error?.message || "Failed to delete data");
    }
  };

  const handleRefresh = () => {
    loadContacts();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, tmcb_cntcs);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        cntct_users: user.users_users,
        cntct_bsins: user.users_bsins,
        cntct_cntad: "0",
        user_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await contactAPI.update(formDataNew);
      } else {
        response = await contactAPI.create(formDataNew);
      }

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );

      handleClear();
      setCurrentView("list");
      loadContacts();
    } catch (error) {
      console.error("Error saving data:", error);

      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  //other functions
  const [contactListDdl, setContactListDdl] = useState([]);
  const fetchContactListDdl = async (trhed_cntyp) => {
    try {
      const response = await contactAPI.getByType({
        cntct_users: user.users_users,
        cntct_ctype: trhed_cntyp,
      });
      console.log("fetchContactListDdl: ", trhed_cntyp);
      //response = { success, message, data }
      // const ddlData = response.data.map((item) => ({
      //   value: item.id,
      //   label: item.cntct_cntnm,
      // }));
      setContactListDdl(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //ledger
  const [ledgerDataList, setLedgerDataList] = useState([]);
  const handleShowContactLedger = async (contact) => {
    try {
      const response = await contactAPI.getContactLedger({
        paybl_users: user.users_users,
        paybl_bsins: user.users_bsins,
        paybl_cntct: contact.id,
      });
      // response = { message, data }
      setLedgerDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //supplier list
  const [supplierList, setSupplierList] = useState([]);

  const fetchSupplierList = async () => {
    let supplierData = [];
    if (dataList.length > 0) {
      supplierData = dataList.filter((c) =>
        ["Supplier", "Both"].includes(c.cntct_ctype),
      );
    } else {
      const response = await contactAPI.getAll({
        cntct_users: user.users_users,
      });
      supplierData = response.data;
    }
    //console.log("supplierData: ", supplierData);
    setSupplierList(supplierData);
  };

  const handleFilterDataList = (filterType) => {
    if (filterType.toLowerCase() === "both") {
      setDataList(allData);
    } else {
      const filteredData = allData.filter(
        (c) => c.cntct_ctype.toLowerCase() === filterType.toLowerCase(),
      );
      setDataList(filteredData);
    }
  };

  return {
    dataList,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
    cntct_sorceOptions,
    cntct_cntryOptions,
    contactListDdl,
    fetchContactListDdl,
    //ledger
    handleShowContactLedger,
    ledgerDataList,
    //supplier list
    supplierList,
    fetchSupplierList,
    handleFilterDataList,
  };
};
