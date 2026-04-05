import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification, useToast } from "@/hooks/useAppUI";
import { sinvoiceAPI } from "@/api/sales/sinvoiceAPI";
import { sreturnAPI } from "@/api/sales/sreturnAPI";
import tmeb_mretn from "@/models/sales/tmeb_mretn.json";
import validate, { generateDataModel } from "@/models/validator";
import { stringifyAttributes } from "@/utils/jsonParser";
import { generateGuid } from "@/utils/guid";
import { formatDateForAPI } from "@/utils/datetime";

const dataModel = generateDataModel(tmeb_mretn, { edit_stop: 0 });

export const useSreturn = () => {
  //const location = useLocation();
  //const data = location.state;
  const { state } = useLocation();
  const data = state || {};

  const { user, business } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [dataList, setDataList] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);
  //const [formDataItemList, setFormDataItemList] = useState([]);

  //options
  const [formDataItemList, setFormDataItemList] = useState([]);
  const [formDataExpensesList, setFormDataExpensesList] = useState([]);
  const [formDataPaymentList, setFormDataPaymentList] = useState([]);

  const loadCreateReturn = async (state) => {
    //console.log("state", state);
    try {
      setIsBusy(true);
      //console.log("loadInvoice:");
      const response = await sinvoiceAPI.getReturn({
        minvc_users: user.users_users,
        minvc_bsins: user.users_bsins,
        minvc_refid: state,
      });
      //console.log("loadInvoice:", JSON.stringify(response));

      if (response.data && response.success) {
        setFormData(response.data);

        //details
        const responseDet = await sinvoiceAPI.getReturnDetails({
          minvc_refid: state,
        });
        setFormDataItemList(responseDet.data);

        setCurrentView("form");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "SI List",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadCreateReturn("7de9b196-c42c-4109-b635-2520da8ef464");
  }, []);

  // useEffect(() => {
  //   if (state) {
  //     loadCreateReturn(state);
  //   }
  // }, [state]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmeb_mretn);
    setErrors(newErrors);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // console.log("formData:", JSON.stringify(formData));
      // console.log("formDataItemList :", JSON.stringify(formDataItemList));
      // console.log("formDataExpensesList :", JSON.stringify(formDataExpensesList));
      // console.log("formDataPaymentList :", JSON.stringify(formDataPaymentList));

      // return;

      // Validate form
      const newErrors = validate(formData, tmeb_mretn);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      //0 :: Unpaid, 1 :: Paid, 2 :: Partial
      const paidStatus = 1 ;

      // console.log(
      //   "paidStatus:",
      //   paidStatus
      // );
      // return;

      const formDataItemListNew = formDataItemList.map((item) => ({
        ...item,
        cretn_attrb: stringifyAttributes(item.cretn_attrb),
      }));

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        mretn_users: user.users_users,
        mretn_bsins: user.users_bsins,
        mretn_trdat: formatDateForAPI(formData.mretn_trdat),
        mretn_ispad: paidStatus,
        user_id: user.id,
        tmeb_cretn: formDataItemListNew,
        tmeb_expns: formDataExpensesList,
        tmtb_rcvbl: formDataPaymentList,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await sreturnAPI.update(formDataNew);
      } else {
        response = await sreturnAPI.create(formDataNew);
      }

      //console.log("handleSave:", JSON.stringify(response));

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `SR - ${formDataNew.mretn_trnno} ${
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
        //handleClear();
        //setCurrentView("list");
        //await loadInvoice(); // make sure we wait for updated data
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "SR",
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
    currentView,
    dataList,
    errors,
    formData,
    handleChange,
    handleSave,
    //options
    formDataItemList,
    formDataExpensesList,
    formDataPaymentList,
    setFormDataItemList,
    setFormDataExpensesList,
    setFormDataPaymentList,
  };
};
