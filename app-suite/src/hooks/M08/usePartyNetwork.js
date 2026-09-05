import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_party from "@/models/M08/tmtb_party.json";
const dataModel = generateDataModel(tmtb_party);
import { coaNetworkAPI } from "@/api/M08/coaNetworkAPI.js";

const usePartyNetwork = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M08-M02-M003");
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [readOnly, setReadOnly] = useState(false);
  const [stopEdit, setStopEdit] = useState(false);
  const [listData, setListData] = useState([]);
  const [formData, setFormData] = useState(dataModel);
  const [listDataItem, setListDataItem] = useState([]);
  const [formDataItem, setFormDataItem] = useState({});
  const [formErrors, setFormErrors] = useState({});
  //others

  const getAllPartyNetwork = async () => {
    try {
      setIsBusy(true);
      const resp = await coaNetworkAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllPartyNetwork();
  }, []);

  const handleEdit = (rowData) => {};

  const handleDelete = async (rowData) => {};

  const handleSearch = async () => {
    getAllPartyNetwork();
  };

  return {
    isBusy,
    pgView,
    listData,
    //others
    //functions
    handleEdit,
    handleDelete,
    handleSearch,
  };
};
export default usePartyNetwork;
