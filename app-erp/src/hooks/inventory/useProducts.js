import { useState, useEffect } from "react";
import { productsAPI } from "@/api/inventory/productsAPI";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import tmib_items from "@/models/inventory/tmib_items.json";
import tmib_bitem from "@/models/inventory/tmib_bitem.json";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification, useToast } from "@/hooks/useAppUI";
import { formulaAPI } from "@/api/inventory/formulaAPI";
import tmib_frmla from "@/models/inventory/tmib_frmla.json";
import tmib_cnstk from "@/models/inventory/tmib_cnstk.json";

const dataModel = generateDataModel(tmib_items, { edit_stop: 0 });
const dataModelBItem = generateDataModel(tmib_bitem, { edit_stop: 0 });
const dataModelFormula = generateDataModel(tmib_frmla, { edit_stop: 0 });

export const useProducts = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [allData, setAllData] = useState([]);
  const [dataListAll, setDataListAll] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadProducts = async () => {
    try {
      setIsBusy(true);
      const response = await productsAPI.getAll({
        muser_id: user.users_users,
      });
      //response = { message, data }
      //console.log("response: " + JSON.stringify(response));
      setDataList(response.data);
      setDataListAll(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Product",
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
    loadProducts();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmib_items);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
    setErrors({});
    //BItem
    setFormDataBItem(dataModelBItem);
    setBItemList([]);
    setBItemListAll([]);
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
    //console.log("unit: " + JSON.stringify(unit));

    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      setIsBusy(true);

      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      const response = await productsAPI.delete(formDataNew);

      // Remove deleted item from local state
      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);

        const updatedListAll = dataListAll.filter((u) => u.id !== rowData.id);
        setDataListAll(updatedListAll);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Product - ${rowData.items_iname} ${
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
        summary: "Product",
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
    loadProducts();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { items_puofm, items_dfqty, items_suofm } = formData;

      if (items_puofm === items_suofm && Number(items_dfqty) > 1) {
        showToast(
          "warn",
          "Warning",
          "If Primary Unit and Secondary Unit are the same, Difference Qty must be 1.",
        );
        setIsBusy(false);
        return;
      } else if (items_puofm !== items_suofm && Number(items_dfqty) < 2) {
        showToast(
          "warn",
          "Warning",
          "If Primary Unit and Secondary Unit are different, Difference Qty must be greater than 1.",
        );
        return;
      }

      // Validate form
      const newErrors = validate(formData, tmib_items);
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
        muser_id: user.users_users,
        suser_id: user.id,
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await productsAPI.update(formDataNew);
      } else {
        response = await productsAPI.create(formDataNew);
      }
      //console.log("response: " + JSON.stringify(response));

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Product - ${formDataNew.items_iname} ${
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
        loadProducts();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Brand",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  // BItem add/edit/active/inactive
  const [formDataBItem, setFormDataBItem] = useState(dataModelBItem);

  const handleChangeBItem = (field, value) => {
    //console.log("handleChangeBItem: " + JSON.stringify(formDataBItem));
    setFormDataBItem((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataBItem, [field]: value },
      tmib_bitem,
    );
    setErrors(newErrors);
  };
  const handleFetchBItemSelectShop = async (itemId, businessId) => {
    //console.log("itemId: " + itemId);
    //console.log("businessId: " + businessId);
    //setFormDataBItem(dataModelBItem);

    try {
      setIsBusy(true);
      const response = await productsAPI.getBItem({
        bitem_items: itemId,
        bitem_bsins: businessId,
      });
      //response = { message, data }
      //console.log("response: " + JSON.stringify(response));

      if (response?.data) {
        setFormDataBItem({
          ...response.data,
          bitem_items: itemId,
          bitem_bsins: businessId,
        });
      } else {
        setFormDataBItem({
          ...dataModelBItem,
          bitem_items: itemId,
          bitem_bsins: businessId,
        });
      }
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Product Warehouse",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleSaveBItem = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formDataBItem, tmib_bitem);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const bitem_mpric = calculateApproxMargin();

      // Ensure id exists (for create)
      const formDataNewBItem = {
        ...formDataBItem,
        id: formDataBItem.id || generateGuid(),
        bitem_mpric: bitem_mpric,
        bitem_users: user.users_users,
        muser_id: user.users_users,
        suser_id: user.id,
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      // Call API and get { message, data }
      let response;
      if (formDataBItem.id) {
        response = await productsAPI.updateBItem(formDataNewBItem);
      } else {
        response = await productsAPI.createBItem(formDataNewBItem);
      }
      //console.log("response: " + JSON.stringify(response));

      // Update toast using API message

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Product Warehouse - ${
          response.success
            ? formDataBItem.id
              ? "modified"
              : "created"
            : formDataBItem.id
              ? "modification failed"
              : "creation failed"
        } by ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });

      //must clear business to prevent inserting same item in same business
      // setFormDataBItem((prev) => ({
      //   ...prev,
      //   id: "",
      //   bitem_bsins: "",
      // }));
      setFormDataBItem(dataModelBItem);
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Brand",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const calculateApproxMargin = () => {
    //sales price = MRP or DP Rate
    const sales_dp_mrp = formDataBItem.bitem_mcmrp
      ? formDataBItem.bitem_mcmrp
      : formDataBItem.bitem_dprat;

    //discount amount = on sales price
    const discount_amount = sales_dp_mrp * (formDataBItem.bitem_sddsp / 100);

    //vat amount = on sales price
    const vat_amount = 0; // sales_dp_mrp * (formData.items_sdvat / 100);

    //cost amount = on purchase price
    const cost_amount =
      formDataBItem.bitem_lprat * (formData.items_costp / 100);

    //margin = sales price - (purchase price + discount amount + vat amount + cost amount)
    const margin =
      sales_dp_mrp -
      (Number(formDataBItem.bitem_lprat) +
        Number(discount_amount) +
        Number(vat_amount) +
        Number(cost_amount));
    return margin;
  };

  // Business Items list, inventory stock
  const [BItemList, setBItemList] = useState([]);
  const [BItemListAll, setBItemListAll] = useState([]);

  const handleItemInventoryList = () => {
    setCurrentView("inventory");
  };

  const handleFetchBusinessItems = async (businessId) => {
    //console.log(businessId);
    //return;

    try {
      setIsBusy(true);
      setBItemList([]);
      setBItemListAll([]);
      const response = await productsAPI.getBusinessItems({
        muser_id: user.users_users,
        bitem_bsins: businessId,
      });
      //response = { message, data }
      //console.log("response: " + JSON.stringify(response));
      setBItemList(response.data);
      setBItemListAll(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Business Items",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleFilterBusinessItems = (filterType) => {
    //return;
    switch (filterType) {
      case "all":
        setBItemList(BItemListAll);
        break;
      case "low_stock":
        setBItemList(
          BItemListAll.filter(
            (i) => Number(i.bitem_gstkq) < Number(i.bitem_mnqty),
          ),
        );
        break;
      case "out_of_stock":
        setBItemList(
          BItemListAll.filter(
            (i) => Number(i.bitem_gstkq) === 0 && Number(i.bitem_istkq) === 0,
          ),
        );
        break;
      case "good_or_tracking_stock":
        setBItemList(
          BItemListAll.filter(
            (i) => Number(i.bitem_gstkq) > 0 || Number(i.bitem_istkq) > 0,
          ),
        );
        break;
      case "good_stock":
        setBItemList(BItemListAll.filter((i) => Number(i.bitem_gstkq) > 0));
        break;
      case "tracking_stock":
        setBItemList(BItemListAll.filter((i) => Number(i.bitem_istkq) > 0));
        break;
      case "bad_stock":
        setBItemList(BItemListAll.filter((i) => Number(i.bitem_bstkq) > 0));
        break;
      case "without_margin":
        setBItemList(BItemListAll.filter((i) => Number(i.bitem_mpric) === 0));
        break;
      case "purchase_bookings":
        setBItemList(BItemListAll.filter((i) => Number(i.bitem_pbqty) > 0));
        break;
      case "sales_bookings":
        setBItemList(BItemListAll.filter((i) => Number(i.bitem_sbqty) > 0));
        break;
      case "with_discount":
        setBItemList(BItemListAll.filter((i) => Number(i.bitem_sddsp) > 0));
        break;
      case "inactives":
        setBItemList(BItemListAll.filter((i) => i.bitem_actve === 0));
        break;
      default:
        setBItemList(BItemListAll);
        break;
    }
  };

  const handleFilterDataList = (filterType) => {
    //return;
    switch (filterType) {
      case "all":
        setDataList(dataListAll);
        break;
      case "tracking":
        setDataList(dataListAll.filter((i) => i.items_trcks === 1));
        break;
      case "vat":
        setDataList(dataListAll.filter((i) => Number(i.items_sdvat) > 0));
        break;
      case "without_cost":
        setDataList(dataListAll.filter((i) => Number(i.items_costp) === 0));
        break;
      case "without_barcode":
        setDataList(dataListAll.filter((i) => !i.items_bcode));
        break;
      case "without_hsn":
        setDataList(dataListAll.filter((i) => !i.items_hscod));
        break;
      case "inactives":
        setDataList(dataListAll.filter((i) => i.items_actve === 0));
        break;
      case "no_warehouse":
        setDataList(dataListAll.filter((i) => i.items_nofbi === 0));
        break;
      default:
        setDataList(dataListAll);
        break;
    }
  };

  const handleOtherFilterDataList =  (filterType) => {

    //console.log("filterType",filterType)
        switch (filterType) {
      case "all":
        setDataList(dataListAll);
        break;
      default:
        setDataList(dataListAll.filter((i) => i.items_ctgry === filterType));
        break;
    }
  }


  //Formula
  const [formDataFormula, setFormDataFormula] = useState(dataModelFormula);
  const [formulaList, setFormulaList] = useState([]);
  const handleFormula = async (rowData) => {
    //console.log("rowData: ",rowData);
    setFormData(rowData);
    setCurrentView("formula");
    setFormDataFormula({
      frmla_mitem: rowData.id,
      frmla_mtmqt: 1,
      frmla_sitem: "",
      frmla_stmqt: 1,
      frmla_costp: 0,
      frmla_inote: "",
      //options

      mitem_icode: rowData.items_icode,
      mitem_iname: rowData.items_iname,
      mitem_untnm: rowData.puofm_untnm,
    });

    setFormulaList([]);

    try {
      setIsBusy(true);
      const response = await formulaAPI.getByItem({
        frmla_users: user.users_users,
        frmla_mitem: rowData.id,
      });
      //response = { message, data }
      //console.log("response: " , response);
      setFormulaList(response.data);
      //setDataListAll(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Formula",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };
  const handleChangeFormula = (field, value) => {
    setFormDataFormula((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataFormula, [field]: value },
      tmib_frmla,
    );
    setErrors(newErrors);
  };
  const handleSaveFormula = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formDataFormula, tmib_frmla);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      // Ensure id exists (for create)
      const formDataNew = {
        ...formDataFormula,
        id: formDataFormula.id || generateGuid(),
        muser_id: user.users_users,
        suser_id: user.id,
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      // Call API and get { message, data }
      let response;
      if (formDataFormula.id) {
        response = await formulaAPI.update(formDataNew);
      } else {
        response = await formulaAPI.create(formDataNew);
      }
      //console.log("response: " + JSON.stringify(response));

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Formula - ${formDataNew.mitem_iname} ${
          response.success
            ? formDataFormula.id
              ? "modified"
              : "created"
            : formDataFormula.id
              ? "modification failed"
              : "creation failed"
        } by ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });

      if (response.success) {
        //in view mode in captured
        handleFormula(formData);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Formula",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteFormula = async (rowData) => {
    try {
      setIsBusy(true);

      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      const response = await formulaAPI.delete(formDataNew);

      // Remove deleted item from local state
      if (response.success) {
        //in view mode in captured
        handleFormula(formData);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Formula - ${rowData.sitem_iname} ${
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
        summary: "Formula",
        detail: error?.message || "Failed to delete data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //convert stock

  const handleConvertStock = async (rowData, bsins_id) => {
    //console.log("rowData: ", rowData, bsins_id);
    setFormData(rowData);
    setCurrentView("convert");
    // return;
    setFormDataFormula({
      cnstk_users: user.users_users,
      cnstk_bsins: user.users_bsins,
      cnstk_mitem: rowData.bitem_items,
      cnstk_mtmqt: 1, //from DB
      cnstk_mstkq: rowData.bitem_gstkq,
      cnstk_sitem: "list-item", //from DB
      cnstk_stmqt: 1, //from DB
      cnstk_sstkq: 0, //from DB
      cnstk_cnqty: 0, //from DB
      mitem_icode: rowData.items_icode,
      mitem_iname: rowData.items_iname,
      mitem_untnm: rowData.puofm_untnm,
    });
    setFormulaList([]);

    try {
      setIsBusy(true);
      const response = await formulaAPI.getByItemConvert({
        frmla_users: user.users_users,
        frmla_mitem: rowData.bitem_items,
        bitem_bsins: bsins_id,
      });

      //response = { message, data }
      //console.log("response: ", response);
      setFormulaList(response.data);
      //setDataListAll(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Formula",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleChangeConvert = (field, value) => {
    setFormDataFormula((prev) => ({ ...prev, [field]: value }));
    // const newErrors = validate(
    //   { ...formDataFormula, [field]: value },
    //   tmib_frmla,
    // );
    //setErrors(newErrors);
    setFormulaList((prev) =>
      prev.map((item) => {
        let cnstk_stmqt = (item.frmla_stmqt || 0) * (value || 0);
        const cnstk_mtmqt = (item.frmla_mtmqt || 0) * (value || 0);

        // Clamp to available stock
        // if (cnstk_stmqt > (item.cnstk_sstkq || 0)) {
        //   cnstk_stmqt = 0; // item.cnstk_sstkq || 0;
        // }

        return {
          ...item,
          cnstk_mtmqt: value,
          cnstk_stmqt,
          cnstk_cnqty: cnstk_mtmqt,
        };
      }),
    );
  };

  const handleSaveConvertStock = async (e) => {
    e.preventDefault();
    try {
      //console.log("formDataFormula: " + JSON.stringify(formDataFormula));
      //console.log("formulaList: " + JSON.stringify(formulaList));

      // Validate form
      const newErrors = validate(formDataFormula, tmib_cnstk);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        return;
      }
      //return;
      setIsBusy(true);
      // Ensure id exists (for create)
      const formDataNew = {
        ...formDataFormula,
        id: formDataFormula.id || generateGuid(),
        muser_id: user.users_users,
        suser_id: user.id,
        tmib_cnstk: formulaList,
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      // Call API and get { message, data }
      let response;
      if (formDataFormula.id) {
        //response = await formulaAPI.update(formDataNew);
      } else {
        response = await formulaAPI.convertStock(formDataNew);
      }
      //console.log("response: " + JSON.stringify(response));

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Formula - ${formDataNew.mitem_iname} ${
          response.success
            ? formDataFormula.id
              ? "modified"
              : "created"
            : formDataFormula.id
              ? "modification failed"
              : "creation failed"
        } by ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });

      if (response.success) {
        //in view mode in captured
        setFormDataFormula({});
        setFormulaList([]);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Formula",
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
    // BItem
    formDataBItem,
    handleChangeBItem,
    handleSaveBItem,
    handleFetchBItemSelectShop,
    // Business Items
    handleItemInventoryList,
    handleFetchBusinessItems,
    BItemList,
    handleFilterDataList,
    handleFilterBusinessItems,
    handleOtherFilterDataList,
    //Formula
    handleFormula,
    formDataFormula,
    handleChangeFormula,
    handleSaveFormula,
    formulaList,
    handleDeleteFormula,
    //convert stock
    handleConvertStock,
    handleChangeConvert,
    handleSaveConvertStock,
  };
};
