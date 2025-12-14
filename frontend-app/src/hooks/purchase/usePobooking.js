import { useState, useEffect } from "react";
import { pobookingAPI } from "@/api/purchase/pobookingAPI";
import t_po_master from "@/models/purchase/t_po_master.json";
import validate from "@/models/validator";
import { generateGuid } from "@/utils/guid";

const formDataModel = {
  master_id: "",
  shop_id: "1",
  contact_id: "",
  order_type: "Booking",
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
};

const usePobooking = () => {
  const [configLine, setConfigLine] = useState({
    contact_id: "both",
    is_posted: 1,
    include_discount: 1,
    include_vat: 1,
  });
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("form");
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [formData, setFormData] = useState(formDataModel);
  const [formDataList, setFormDataList] = useState([]);
  const [formDataPaymentList, setFormDataPaymentList] = useState([]);
  const [handleEdit, setHandleEdit] = useState(() => {});
  const [handleDelete, setHandleDelete] = useState(() => {});

  const loadBookingList = async (reloadDataSet = false) => {
    try {
      setIsBusy(true);
      const data = await pobookingAPI.getAll();
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

  const loadConfigLine = async () => {
    // try {
    //   setIsBusy(true);
    //   const data = await pobookingAPI.getConfigLine();
    //   setConfigLine(data);
    //   setIsBusy(false);
    // } catch (error) {
    //   console.error("Error fetching config line:", error);
    //   setToastBox({
    //     severity: "error",
    //     summary: "Error",
    //     detail: "Failed to load config line from server",
    //   });
    //   setIsBusy(false);
    // }
  };

  useEffect(() => {
    loadBookingList();
    loadConfigLine();
  }, []);

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      contact_id: configLine?.contact_id,
      is_posted: configLine?.is_posted,
    }));
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

      const paidStatus =
        formData.payable_amount === formData.due_amount
          ? "Unpaid"
          : formData.due_amount === 0
          ? "Paid"
          : "Partial";

      const formDataNew = {
        ...formData,
        master_id: formData.master_id ? formData.master_id : generateGuid(),
        is_paid: paidStatus,
        details_create: formDataList,
        payments_create: formDataPaymentList,
      };

      if (formData.master_id) {
        const data = await pobookingAPI.update(formDataNew);
      } else {
        const data = await pobookingAPI.create(formDataNew);
      }

      const message = formData.master_id
        ? `"${formData.order_no}" Updated`
        : "Created";
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: `${message} successfully.`,
      });

      return;

      setIsBusy(false);
      handleCancel();
      loadBookingList();
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data from server",
      });
      setIsBusy(false);
    }
    //resetForm();
    //setCurrentView("list");
  };

  return {
    configLine,
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
  };
};

export default usePobooking;
