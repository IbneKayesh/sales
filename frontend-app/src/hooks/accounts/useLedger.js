import { useState, useEffect } from "react";
import { accountsAPI } from "@/api/accounts/accountsAPI";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { formatDateForAPI } from "@/utils/datetime";
import { useBusy, useNotification } from "@/hooks/useAppUI";
import { accountsLedgerAPI } from "@/api/accounts/accountsLedgerAPI";
import tmtb_ledgr from "@/models/accounts/tmtb_ledgr.json";
import tmtb_ledgr_transfer from "@/models/accounts/tmtb_ledgr_transfer.json";

const dataModel = generateDataModel(tmtb_ledgr, { edit_stop: 0 });
const dataModel_transfer = generateDataModel(tmtb_ledgr_transfer, {
  edit_stop: 0,
});

export const useLedger = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadLedger = async () => {
    try {
      setIsBusy(true);
      const response = await accountsLedgerAPI.getAll({
        ledgr_users: user.users_users,
        ledgr_bsins: user.users_bsins,
      });
      //response = { success, message, data }

      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Ledger",
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
    loadLedger();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmtb_ledgr);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
    setErrors({});

    setFormDataPaymentAdvice({});
    setPaymentAdviceList([]);
    setPaymentAdviceSelectedList([]);
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

      setIsBusy(true);
      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      const response = await accountsAPI.delete(formDataNew);

      // Remove deleted account from local state
      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Accounts - ${rowData.bacts_bankn} ${
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
        summary: "Accounts",
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
    loadLedger();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formData, tmtb_ledgr);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const amount = Number(formData.ledgr_dbamt) || 0;
      if (amount <= 0) {
        notify({
          severity: "error",
          summary: "Ledger",
          detail: "Transfer amount must be greater than 0",
          toast: true,
          notification: true,
          log: false,
        });
        return;
      }
      // Ensure id exists (for create)
      setIsBusy(true);
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        ledgr_users: user.users_users,
        ledgr_bsins: user.users_bsins,
        ledgr_trdat: formatDateForAPI(formData.ledgr_trdat),
        ledgr_isref: false,
        suser_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await accountsLedgerAPI.update(formDataNew);
      } else {
        response = await accountsLedgerAPI.create(formDataNew);
      }

      // Update toast using API message

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Ledger - ${formData.ledgr_refno} ${
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
        // Clear form & reload
        handleClear();
        setCurrentView("list");
        await loadLedger(); // make sure we wait for updated data
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Ledger",
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
  const handleViewAdvice = async (rowData) => {
    //console.log("rowData", rowData);

    try {
      setIsBusy(true);
      const response = await accountsLedgerAPI.getLedgerPaymentAdvice({
        payad_ledgr: rowData.id,
      });
      //response = { success, message, data }

      setPaymentAdviceList(response.data);

      setCurrentView("advice-list");
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Ledger",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //payment advice
  const [formDataPaymentAdvice, setFormDataPaymentAdvice] = useState({});
  const [paymentAdviceList, setPaymentAdviceList] = useState([]);
  const [paymentAdviceSelectedList, setPaymentAdviceSelectedList] = useState(
    [],
  );
  const handleAddNewAdvice = () => {
    handleClear();
    setCurrentView("advice-entry");
  };
  const handleChangePaymentAdvice = (field, value) => {
    setFormDataPaymentAdvice((prev) => ({ ...prev, [field]: value }));
    // const newErrors = validate(
    //   { ...formDataPaymentAdvice, [field]: value },
    //   tmtb_ledgr,
    // );
    // setErrors(newErrors);
    //console.log("formDataPaymentAdvice", formDataPaymentAdvice, field);
    if (field === "ledgr_trhed") {
      setErrors({ ledgr_trhed: "" });
    }
  };

  const handleFindAdvice = async () => {
    try {
      if (!formDataPaymentAdvice.ledgr_trhed) {
        setErrors({
          ledgr_trhed: "Transaction Head is required",
        });
        return;
      }

      setIsBusy(true);
      setPaymentAdviceList([]);
      const response = await accountsLedgerAPI.paymentAdvice({
        payad_users: user.users_users,
        payad_bsins: user.users_bsins,
        payad_srcnm: formDataPaymentAdvice.ledgr_trhed,
      });
      //response = { success, message, data }
      //console.log("paymentAdvice: ", response);
      if (!response.success) {
        notify({
          severity: "error",
          summary: "Payment Advice",
          detail: response.message,
          toast: true,
          notification: true,
          log: false,
        });
      } else if (response.data.length === 0) {
        notify({
          severity: "info",
          summary: "Payment Advice",
          detail: "No pending Payment Advice found",
          toast: true,
          notification: true,
          log: false,
        });
      } else {
        setPaymentAdviceList(response.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Payment Advice",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleAddPaymentAdvice = (rowData) => {
    //console.log("formDataPaymentAdvice2", formDataPaymentAdvice);
    // if (formDataPaymentAdvice.ledgr_cntct !== rowData.payad_cntct) {
    //   notify({
    //     severity: "error",
    //     summary: "Payment Advice",
    //     detail: "Unable to add, Select same Contact",
    //     toast: true,
    //     notification: true,
    //     log: false,
    //   });
    //   return;
    // }
    setPaymentAdviceSelectedList((prev) => [...prev, rowData]);
  };
  const handleRemovePaymentAdvice = (rowData) => {
    setPaymentAdviceSelectedList((prev) =>
      prev.filter((item) => item.payad_refid !== rowData.payad_refid),
    );
  };

  const handleSavePaymentAdvice = async () => {
    //console.log("formDataPaymentAdvice", formDataPaymentAdvice);
    //console.log("paymentAdviceSelectedList", paymentAdviceSelectedList);
    try {
      if (paymentAdviceSelectedList.length > 0) {
        const hasMismatch = paymentAdviceSelectedList.some(
          (item) => item.payad_cntct !== formDataPaymentAdvice.ledgr_cntct,
        );

        if (hasMismatch) {
          notify({
            severity: "error",
            summary: "Payment Advice",
            detail:
              "Only same Contact is allowed to create ledger, Select Contact",
            toast: true,
            notification: true,
            log: false,
          });
          return;
        }
      }

      //console.log("Passed");
      //return;
      const formDataNew = {
        ...formDataPaymentAdvice,
        id: formData.id || generateGuid(),
        ledgr_users: user.users_users,
        ledgr_bsins: user.users_bsins,
        ledgr_trdat: formatDateForAPI(new Date()),
        ledgr_cramt: 0,
        ledgr_isref: true,
        muser_id: user.users_users,
        suser_id: user.id,
        tmtb_payad: paymentAdviceSelectedList,
      };
      const newErrors = validate(formDataNew, tmtb_ledgr);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      //console.log("formDataNew: ", formDataNew);
      //return;
      const response =
        await accountsLedgerAPI.addLedgerPaymentAdvice(formDataNew);
      // //response = { success, message, data }
      console.log("response: ", response);
      if (response.success) {
        // Clear form & reload
        handleClear();
        setCurrentView("list");
        await loadLedger(); // make sure we wait for updated data
      }
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Add to Payment Advice List",
        detail: error?.message || "Failed to add to payment advice list",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //options
  const handleAddNewTransfer = () => {
    handleClear();
    setCurrentView("transfer");
    setFormData(dataModel_transfer);
  };

  const handleChangeTransfer = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formData, [field]: value },
      tmtb_ledgr_transfer,
    );
    setErrors(newErrors);
  };

  const handleSaveTransfer = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formData, tmtb_ledgr_transfer);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const amount = Number(formData.ledgr_dbamt) || 0;
      if (amount <= 0) {
        notify({
          severity: "error",
          summary: "Ledger",
          detail: "Transfer amount must be greater than 0",
          toast: true,
          notification: true,
          log: false,
        });
        return;
      }
      // Ensure id exists (for create)
      setIsBusy(true);
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        ledgr_users: user.users_users,
        ledgr_bsins: user.users_bsins,
        ledgr_trdat: formatDateForAPI(formData.ledgr_trdat),
        ledgr_isref: false,
        suser_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        //response = await accountsLedgerAPI.update(formDataNew);
      } else {
        response = await accountsLedgerAPI.createTransfer(formDataNew);
      }

      // Update toast using API message
      //console.log("response: ",response);

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Transfer - ${formData.ledgr_refno} ${
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
        // Clear form & reload
        handleClear();
        setCurrentView("list");
        await loadLedger(); // make sure we wait for updated data
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Ledger",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
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
    handleViewAdvice,
    //payment advice
    handleAddNewAdvice,
    formDataPaymentAdvice,
    handleChangePaymentAdvice,
    handleFindAdvice,
    paymentAdviceList,
    paymentAdviceSelectedList,
    handleAddPaymentAdvice,
    handleRemovePaymentAdvice,
    handleSavePaymentAdvice,
    //options
    handleAddNewTransfer,
    handleSaveTransfer,
    handleChangeTransfer,
  };
};
