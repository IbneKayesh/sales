import { useEffect, useState } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tm_role from "@/models/setup/tm_role.json";
const dataModel = generateDataModel(tm_role);
import { apiRequest } from "@/utils/api.js";

const useColllectionView = () => {
  //hooks
  const { showToast, confirm, alert, isBusy, setIsBusy } = useAppUI();
  const [crTitle, setCrTitle] = useState("Collection List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  //other states
  const [formDataSearch, setFormDataSearch] = useState({});
  const [aemp_id_Options, setAemp_id_Options] = useState([]);
  const [clpt_id_Options, setClpt_id_Options] = useState([]);

  //functions
  const loadDropdowns = async () => {
    try {
      setIsBusy(true);
      const apiVersion = "/v2/";
      const apiEndPoint = "/data?key=tm_aemp;tm_clpt";
      const resp = await apiRequest(apiVersion, apiEndPoint, {});
      //console.log("resp", resp);
      setAemp_id_Options(resp.tm_aemp.data);
      setClpt_id_Options(resp.tm_clpt.data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadCollections = async () => {
    try {
      setIsBusy(true);
      const reqBody = formDataSearch;
      const apiVersion = "/v4/";
      const apiEndPoint = "/data?key=tt_ctrn_view";
      const resp = await apiRequest(apiVersion, apiEndPoint, { body: reqBody });
      //console.log("resp", resp);
      setDataList(resp.tt_ctrn_view.data);
      setCrTitle("Collection List");
      setCrView("list");
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (field, value) => {
    setFormDataSearch((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tm_role);
    setErrors(newErrors);
  };

  const handleBackClick = () => {
    setCrTitle("Collection List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Collections");
    setCrView("search");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const reqBody = {
      search_text: "",
      start_date: yesterday,
      end_date: new Date(),
      aemp_id: "",
      clpt_id: 0,
    };
    setFormDataSearch(reqBody);
  };

  const handleRefreshClick = () => {
    setCrTitle("Collection List");
    setCrView("list");
    loadCollections();
  };

  const handleFindClick = async () => {
    await loadCollections();
  };

  const handleView = async (rowData) => {
    try {
      setIsBusy(true);
      const apiVersion = "/v2/";
      const apiEndPoint = "/data?key=tt_camt_web";
      const reqBody = { ctrn_id: rowData.id };
      const resp = await apiRequest(apiVersion, apiEndPoint, { body: reqBody });
      //console.log("resp", resp.tt_camt_web.data);
      const formBody = {
        formData: rowData,
        formList: resp.tt_camt_web.data,
      };
      setFormData(formBody);
      setCrTitle("Collection View");
      setCrView("form");
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleCloseClick = () => {
    setCrTitle("Collection List");
    setCrView("list");
    setFormData({});
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
    clpt_id_Options,
    //functions
    handleChange,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleFindClick,
    handleView,
    handleCloseClick,
  };
};
export default useColllectionView;
