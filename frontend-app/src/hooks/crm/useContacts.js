import { useState, useEffect } from "react";
import { contactAPI } from "@/api/crm/contactAPI";
import tmcb_cntcs from "@/models/crm/tmcb_cntcs.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";

const dataModel = generateDataModel(tmcb_cntcs, { edit_stop: 0 });

export const useContacts = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [dataListAll, setDataListAll] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const cntct_sorceOptions = [{ label: "Local", value: "Local" }];

  // const [ledgerContactList, setLedgerContactList] = useState([]);
  // const [contactPaymentList, setContactPaymentList] = useState([]);
  // const [supplierList, setSupplierList] = useState([]);
  // const [contactCustomerList, setContactCustomerList] = useState([]);
  // const [contactsLedger, setContactsLedger] = useState([]);

  const loadContacts = async () => {
    try {
      setIsBusy(true);
      const response = await contactAPI.getAll({
        muser_id: user.users_users,
      });
      // response = { message, data }
      setDataList(response.data);
      setDataListAll(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Contacts",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
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
      setIsBusy(true);
      // Call API, unwrap { message, data }
      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      const response = await contactAPI.delete(formDataNew);

      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);

        const updatedListAll = dataListAll.filter((u) => u.id !== rowData.id);
        setDataListAll(updatedListAll);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Contact - ${rowData.cntct_cntnm} ${
          response.success ? "is deleted by" : "delete failed by"
        } ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      notify({
        severity: "error",
        summary: "Contact",
        detail: error?.message || "Failed to delete data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRefresh = () => {
    loadContacts();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formData, tmcb_cntcs);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        cntct_users: user.users_users,
        cntct_bsins: user.users_bsins,
        muser_id: user.users_users,
        bsins_id: user.users_bsins,
        cntct_cntad: "0",
        suser_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await contactAPI.update(formDataNew);
      } else {
        response = await contactAPI.create(formDataNew);
      }

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Contact - ${formDataNew.cntct_cntnm} ${
          response.success
            ? formData.id
              ? "modified"
              : "created"
            : formData.id
              ? "modification failed"
              : "creation failed"
        } by ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });

      if (response.success) {
        handleClear();
        setCurrentView("list");
        loadContacts();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Contact",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //other functions
  const [contactListDdl, setContactListDdl] = useState([]);
  const fetchContactListDdl = async (trhed_cntyp) => {
    try {
      const response = await contactAPI.getByType({
        muser_id: user.users_users,
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
        muser_id: user.users_users,
        bsins_id: user.users_bsins,
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
        muser_id: user.users_users,
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
    isBusy,
    dataList,
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
