import { useState, useEffect } from "react";
import { poinvoiceAPI } from "@/api/purchase/poinvoiceAPI";
import t_po_master from "@/models/purchase/t_po_master.json";
import validate from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";
import { settingsAPI } from "@/api/setup/settingsAPI";

const formDataModel = {
  master_id: "",
  shop_id: "1",
  contact_id: "",
  order_type: "Invoice",
  order_no: "[Auto SL]",
  order_date: new Date().toISOString().split("T")[0],
  order_note: "",
  order_amount: 0,
  discount_amount: 0,
  vat_amount: 0,
  is_vat_payable: 1,
  include_cost: 0,
  exclude_cost: 0,
  total_amount: 0,
  payable_amount: 0,
  paid_amount: 0,
  due_amount: 0,
  is_paid: "Unpaid",
  is_posted: 0,
  is_returned: 0,
  is_closed: 0,
  edit_stop: 0,
  credit_limit: 0,
};

const usePoinvoice = () => {
  const [pageConfig, setPageConfig] = useState({
    is_posted: 0,
    is_vat_payable: 0,
    include_discount: 0,
    include_vat: 0,
  });

  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list");
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [formData, setFormData] = useState(formDataModel);
  const [formDataList, setFormDataList] = useState([]);
  const [formDataPaymentList, setFormDataPaymentList] = useState([]);
  const [handleDelete, setHandleDelete] = useState(() => { });

  const loadBookingList = async (reloadDataSet = false) => {
    try {
      setIsBusy(true);
      const data = await poinvoiceAPI.getAll();
      setDataList(data);
      setIsBusy(false);

      if (reloadDataSet) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data from server",
      });
      setIsBusy(false);
    }
  };

  const loadSettings = async () => {
    try {
      setIsBusy(true);
      const data = await settingsAPI.getByPageId("Purchase Invoice");
      //console.log("Settings data:", data);

      const settingsObj = Object.fromEntries(
        data.map(({ setting_key, setting_value }) => [
          setting_key,
          setting_value,
        ])
      );

      setPageConfig((prevConfig) => ({
        ...prevConfig,
        is_posted: settingsObj["is_posted"] ?? prevConfig.is_posted,
        is_vat_payable:
          settingsObj["is_vat_payable"] ?? prevConfig.is_vat_payable,
        include_discount:
          settingsObj["include_discount"] ?? prevConfig.include_discount,
        include_vat: settingsObj["include_vat"] ?? prevConfig.include_vat,
      }));
    } catch (error) {
      console.error("Error fetching config line:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load config line from server",
      });
    } finally {
      setIsBusy(false);
    }
  };


  useEffect(() => {
    loadBookingList();
    loadSettings();
  }, []);

  const resetForm = () => {
    setFormData({
      ...formDataModel,
      is_posted: Number(pageConfig.is_posted),
      is_vat_payable: Number(pageConfig.is_vat_payable),
    });

    setFormDataList([]);
    setFormDataPaymentList([]);
  };


  const handleAddNew = () => {
    resetForm();
    setCurrentView("form");
  };

  const handleCancel = () => {
    resetForm();
    setCurrentView("list");
  };

  const handleChange = (field, value) => {
    //console.log("handleChange: " + field + " " + JSON.stringify(value));
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, t_po_master);
    setErrors(newErrors);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);
      const newErrors = validate(formData, t_po_master);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }


      const formDataNew = {
        ...formData,
        master_id: formData.master_id ? formData.master_id : generateGuid(),
        is_paid: "Paid",
        paid_amount: formData.payable_amount,
        due_amount: 0,
        details_create: formDataList,
        payments_create: formDataPaymentList,
      };

      if (formData.master_id) {
        const data = await poinvoiceAPI.update(formDataNew);
      } else {
        const data = await poinvoiceAPI.create(formDataNew);
      }

      const message = formData.master_id
        ? `"${formData.order_no}" Updated`
        : "Created";
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: `${message} successfully.`,
      });

      //return;

      setIsBusy(false);
      handleCancel();
      loadBookingList();


      //call update process
      await closingProcessAPI("Purchase Invoice", formData.order_no);

    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data from server",
      });
      setIsBusy(false);
    }
  };

  const fetchDetails = async (master_id) => {
    try {
      const data = await poinvoiceAPI.getDetails(master_id);
      setFormDataList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load from server",
      });
    }
  };

  const fetchPayments = async (master_id) => {
    try {
      const data = await poinvoiceAPI.getPayments(master_id);
      setFormDataPaymentList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load from server",
      });
    }
  };

  const handleEdit = async (data) => {
    setFormData(data);
    await fetchDetails(data.master_id);
    await fetchPayments(data.master_id);
    setCurrentView("form");
  };

  const fetchPendingInvoiceDetails = async (contact_id) => {
    //console.log("fetchPendingInvoiceDetails: " + contact_id);
    try {
      setIsBusy(true);
      const data = await poinvoiceAPI.getPendingInvoiceDetails(contact_id);
      setFormDataList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load from server",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return {
    pageConfig,
    toastBox,
    isBusy,
    currentView,
    errors,
    setErrors,
    dataList,
    formData,
    setFormData,
    formDataList,
    setFormDataList,
    formDataPaymentList,
    setFormDataPaymentList,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
    fetchPendingInvoiceDetails,
  };
};

export default usePoinvoice;
