import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tm_role from "@/models/setup/tm_role.json";
const dataModel = generateDataModel(tm_role);
import { apiRequest } from "@/utils/api.js";
import { formatDate, formatDateForAPI } from "@/utils/datetime";

const useInvoice = () => {
  //hooks
  const { showToast, confirm, alert, isBusy, setIsBusy } = useAppUI();
  const [crTitle, setCrTitle] = useState("Invoice List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  //other states
  const [formDataSearch, setFormDataSearch] = useState({});
  const [aemp_id_Options, setAemp_id_Options] = useState([]);
  const [formDataList, setFormDataList] = useState([]);

  //functions
  const loadDropdowns = async () => {
    try {
      setIsBusy(true);
      const apiVersion = "/v2/";
      //tt_dlvm;tm_aemp;tm_dlrm
      const apiEndPoint = "/data?key=tm_aemp";
      const resp = await apiRequest(apiVersion, apiEndPoint, {});
      //console.log("resp", resp);
      setAemp_id_Options(resp.tm_aemp.data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };
  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadInvoices = async () => {
    try {
      setIsBusy(true);
      const reqBody = {
        ...formDataSearch,
        start_date: formatDateForAPI(formDataSearch.start_date),
        end_date: formatDateForAPI(formDataSearch.end_date),
      };
      //console.log("reqBody", reqBody);
      const apiVersion = "/v9/";
      //const keys = "tt_dlvm;tm_aemp;tm_dlrm";
      //const apiEndPoint = `/data?key=${keys}&&search_text=${reqBody.search_text || ""}&&start_date=${reqBody.start_date || ""}&&end_date=${reqBody.end_date || ""}&&aemp_srid=${reqBody.aemp_srid || ""}`;
      const apiEndPoint = `/data?key=tt_dlvm;tm_aemp;tm_dlrm`;
      const resp = await apiRequest(apiVersion, apiEndPoint, { body: reqBody });
      //console.log("resp", resp.tt_dlvm.data);
      setDataList(resp.tt_dlvm.data);
      setCrTitle("Invoice List");
      setCrView("list");
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tm_role);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setFormData(rowData);
    setCrTitle("Edit Role");
    setCrView("form");
  };
  const handleDelete = (rowData) => {
    confirm({
      message: `Do you want to delete this ${rowData.role_name}?`,
      header: "Delete Confirmation",
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
      const apiVersion = "/v7/";
      const apiEndPoint = `/destroy/${rowData.id}?key=tm_role`;
      const reqBody = { lfcl_id: rowData.lfcl_id == 1 ? 2 : 1 };
      const resp = await apiRequest(apiVersion, apiEndPoint, { body: reqBody });
      //console.log("resp", resp);
      if (resp.tm_role.status) {
        await loadInvoices();
        alert({
          message: `Role deleted successfully ${rowData.role_name}`,
          header: "Deleted",
        });
      } else {
        alert({
          message: resp.tm_role.message,
          header: "Error while Deleting",
        });
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Invoice List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Invoice");
    setCrView("search");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const reqBody = {
      search_text: "",
      start_date: yesterday,
      end_date: new Date(),
      aemp_srid: "",
    };
    setFormDataSearch(reqBody);
  };

  const handleRefreshClick = () => {
    setCrTitle("Invoice List");
    setCrView("list");
    loadInvoices();
  };

  const handleAddNewClick = () => {
    setCrTitle("Add Role");
    setCrView("form");
    setFormData(dataModel);
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tm_role);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      if (formData.id) {
        const apiVersion = "/v4/";
        const apiEndPoint = `/update/${formData.id}?key=tm_role`;
        const reqBody = formData;
        const resp = await apiRequest(apiVersion, apiEndPoint, {
          body: reqBody,
        });
        //console.log("resp", resp);
        if (resp.tm_role.status) {
          //await loadInvoices();
          setDataList((prevList) =>
            prevList.map((item) =>
              item.id === reqBody.id
                ? { ...item, ...reqBody } // merge updated fields
                : item,
            ),
          );
          alert({
            message: `Role edited successfully ${formData.role_name}`,
            header: "Edited",
          });
          setCrTitle("Invoice List");
          setCrView("list");
        } else {
          alert({
            message: resp.tm_role.message,
            header: "Error while Editing",
          });
        }
      } else {
        const apiVersion = "/v4/";
        const apiEndPoint = "/store?key=tm_role";
        const reqBody = formData;
        const resp = await apiRequest(apiVersion, apiEndPoint, {
          body: reqBody,
        });
        //console.log("resp", resp);
        if (resp.tm_role.status) {
          //await loadInvoices();
          setDataList((prev) => [...prev, reqBody]);
          alert({
            message: `Role saved successfully ${formData.role_name}`,
            header: "Saved",
          });
          setCrTitle("Invoice List");
          setCrView("list");
        } else {
          alert({
            message: resp.tm_role.message,
            header: "Error while Saving",
          });
        }
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChangeSearch = (field, value) => {
    setFormDataSearch((prev) => ({ ...prev, [field]: value }));
    //const newErrors = validate({ ...formData, [field]: value }, tm_role);
    //setErrors(newErrors);
  };

  const handleFindClick = async () => {
    await loadInvoices();
  };

  const handleViewInvoice = async (rowData) => {
    setFormData(rowData);
    //setCrTitle("View Invoice");
    setCrView("view");

    try {
      setIsBusy(true);
      const reqBody = { dlvm_id: rowData.id };
      //console.log("reqBody", reqBody);
      const apiVersion = "/v2/";
      const apiEndPoint = `/data?key=tt_dlvm_line`;
      const resp = await apiRequest(apiVersion, apiEndPoint, { body: reqBody });
      //console.log("resp", resp.tt_dlvm_line.data);
      setFormDataList(resp.tt_dlvm_line.data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleCloseViewClick = () => {
    setCrTitle("Invoice List");
    setCrView("list");
    setFormData(dataModel);
    setFormDataList([]);
  };

  return {
    //hooks
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    formDataSearch,
    aemp_id_Options,
    formDataList,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
    handleChangeSearch,
    handleFindClick,
    handleViewInvoice,
    handleCloseViewClick,
  };
};
export default useInvoice;
