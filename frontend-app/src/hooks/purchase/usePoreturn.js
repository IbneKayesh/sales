import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { poreturnAPI } from "@/api/purchase/poreturnAPI";
import t_po_master from "@/models/purchase/t_po_master.json";
import validate from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";

const formDataModel = {
  master_id: "",
  shop_id: "1",
  contact_id: "",
  order_type: "Order",
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

const usePoreturn = () => {
  const [configLine, setConfigLine] = useState({
    contact_id: "both",
    is_posted: 1,
    include_discount: 1,
    include_vat: 1,
  });
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list");
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [formData, setFormData] = useState(formDataModel);
  const [formDataList, setFormDataList] = useState([]);
  const [formDataPaymentList, setFormDataPaymentList] = useState([]);
  const [handleDelete, setHandleDelete] = useState(() => {});

  const location = useLocation();
  const masterIdProp = location.state?.master_id; // read safely
  const sourceTypeProp = location.state?.source_type; // read safely
  const [newReturnData, setNewReturnData] = useState();

  const loadNewReturn = async (returnData) => {
    try {
      setIsBusy(true);
      const data = await poreturnAPI.getNewReturnMaster(returnData);
      console.log("loadNewReturn: " + JSON.stringify(data));
      setFormData(data);


const data_details = await poreturnAPI.getNewReturnDetails(returnData);
console.log("loadNewReturnDetails: " + JSON.stringify(data_details));
setFormDataList(data_details);


      setCurrentView("form");
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

  useEffect(() => {
    const data = {
      master_id: masterIdProp,
      order_type: sourceTypeProp,
    };
    setNewReturnData(data);
    if (masterIdProp && sourceTypeProp) {
      loadNewReturn(data);
    }
  }, [masterIdProp, sourceTypeProp]);

  const loadBookingList = async (reloadDataSet = false) => {
    try {
      setIsBusy(true);
      const data = await poreturnAPI.getAll();
      setDataList(data);

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
    } finally {
      setIsBusy(false);
    }
  };

  const loadConfigLine = async () => {
    // try {
    //   setIsBusy(true);
    //   const data = await poreturnAPI.getConfigLine();
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
        const data = await poreturnAPI.update(formDataNew);
      } else {
        const data = await poreturnAPI.create(formDataNew);
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

      handleCancel();
      loadBookingList();

      //call update process
      await closingProcessAPI("Purchase Order", formData.order_no);
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data from server",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const fetchDetails = async (master_id) => {
    try {
      const data = await poreturnAPI.getDetails(master_id);
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
      const data = await poreturnAPI.getPayments(master_id);
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

export default usePoreturn;
