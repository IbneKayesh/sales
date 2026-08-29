import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { processAPI } from "@/api/M05/processAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmmb_promf from "@/models/M05/tmmb_promf.json";
const dataModel = generateDataModel(tmmb_promf);
import tmmb_prrpm from "@/models/M05/tmmb_prrpm.json";
const dataModelRM = generateDataModel(tmmb_prrpm);
import tmmb_prfoh from "@/models/M05/tmmb_prfoh.json";
const dataModelFOH = generateDataModel(tmmb_prfoh);
import tmmb_prsfg from "@/models/M05/tmmb_prsfg.json";
const dataModelSFG = generateDataModel(tmmb_prsfg);
import tmmb_prbtc from "@/models/M05/tmmb_prbtc.json";
const dataModelBatch = generateDataModel(tmmb_prbtc);
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { bomAPI } from "@/api/M05/bomAPI.js";
import { unitsAPI } from "@/api/M04/unitsAPI.js";
import { itemsAPI } from "@/api/M04/itemsAPI.js";
import { validNumber, divNumber } from "@/utils/misc.js";
import { generateGuid } from "@/utils/guid.js";
import { stockAPI } from "@/api/M04/stockAPI.js";

const useProcess = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M05-M02-M001");
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
  const [showModal, setShowModal] = useState({ show: false, modal: "" });
  const [modalTitle, setModalTitle] = useState({ title: "", subTitle: "" });

  const [listDataRMPM, setListDataRMPM] = useState([]);
  const [formDataRMPM, setFormDataRMPM] = useState(dataModelRM);

  const [listDataFOH, setListDataFOH] = useState([]);
  const [formDataFOH, setFormDataFOH] = useState(dataModelFOH);

  const [listDataSFGFG, setListDataSFGFG] = useState([]);
  const [formDataSFGFG, setFormDataSFGFG] = useState(dataModelSFG);

  const [listDataBatch, setListDataBatch] = useState([]);
  const [formDataBatch, setFormDataBatch] = useState(dataModelBatch);

  const [dpart_Options, setDpart_Options] = useState([]);
  const [bom_Options, setBom_Options] = useState([]);
  const [units_Options, setUnits_Options] = useState([]);
  const [items_Options, setItems_Options] = useState([]);
  const [items_store_Options, setItems_store_Options] = useState([]);
  const [stock_Options, setStock_Options] = useState([]);

  // ---------- Process Master ----------
  const getAllProcess = async () => {
    try {
      setIsBusy(true);
      const resp = await processAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllProcess();
  }, []);

  const getAllDepartments = async () => {
    if (dpart_Options.length > 0) {
      return;
    }
    try {
      const resp = await departmentAPI.getProduction({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {}
  };

  const getAllBOMByDepartment = async (id) => {
    try {
      const resp = await bomAPI.getByDepartment({ bommf_dpart: id });
      const list = resp.data || [];
      setBom_Options(list);
    } catch (error) {}
  };

  const getAllUnits = async () => {
    if (units_Options.length > 0) {
      return;
    }
    try {
      const resp = await unitsAPI.getAllActive({});
      const list = resp.data || [];
      setUnits_Options(list);
    } catch (error) {}
  };

  const getAllItems = async () => {
    try {
      const resp = await itemsAPI.getAllActive();
      const list = resp.data || [];
      setItems_store_Options(list);
    } catch (error) {}
  };

  const loadAllDetailsBOM = async (id) => {
    try {
      setIsBusy(true);
      const [rmResp, fohResp, sfgResp] = await Promise.all([
        bomAPI.getRMPMbyBOMForProcess({ borpm_bommf: id }),
        bomAPI.getFOHbyBOMForProcess({ bofoh_bommf: id }),
        bomAPI.getSFGFGbyBOMForProcess({ bosfg_bommf: id }),
      ]);
      setListDataRMPM(rmResp.data || []);
      setListDataFOH(fohResp.data || []);
      setListDataSFGFG(sfgResp.data || []);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmmb_promf);
    setFormErrors(newErrors);

    if (f === "promf_dpart") {
      await getAllBOMByDepartment(v);
    }

    if (f === "promf_bommf") {
      const bom = bom_Options.find((opt) => opt.id === v);
      setFormData((prev) => ({
        ...prev,
        promf_cname: bom?.bommf_cname || "Process 1",
        promf_prono: bom?.bommf_prono || 1,
      }));
      await loadAllDetailsBOM(v);
    }
  };

  const round2 = (n) => Math.round(Number(n) * 100) / 100;

  const recalcProcessQty_v1 = (prqty) => {
    if (!prqty) return;

    //RM/PM
    setListDataRMPM((prev) => {
      return prev.map((item) => {
        let reqQty = validNumber(item.prrpm_boqty) * validNumber(prqty);
        return {
          ...item,
          prrpm_rmqty: validNumber(reqQty),
          prrpm_rmval: validNumber(reqQty) * validNumber(item.prrpm_rmrat),
        };
      });
    });
    //FOH
    setListDataFOH((prev) => {
      return prev.map((item) => {
        let reqQty = validNumber(item.prfoh_boqty) * validNumber(prqty);
        return {
          ...item,
          prfoh_foqty: validNumber(reqQty),
          prfoh_foval: validNumber(reqQty) * validNumber(item.prfoh_forat),
        };
      });
    });
    //SFG
    setListDataSFGFG((prev) => {
      return prev.map((item) => {
        //console.log(item)
        const reqQty =
          item.prsfg_group === "MAIN"
            ? validNumber(prqty)
            : validNumber(item.prsfg_boqty) * validNumber(prqty);

        return {
          ...item,
          prsfg_fgqty: validNumber(reqQty),
          prsfg_fgval: validNumber(reqQty) * validNumber(item.prsfg_fgrat),
        };
      });
    });
  };

  const recalcOutputCost_v1 = () => {
    let newItems = [...(listDataSFGFG || [])];

    const totalRMPM = listDataRMPM.reduce(
      (sum, item) => sum + validNumber(item.prrpm_rmval),
      0,
    );
    const totalFOH = listDataFOH.reduce(
      (sum, item) => sum + validNumber(item.prfoh_foval),
      0,
    );
    const totalRMPMFOH = totalRMPM + totalFOH;

    newItems = newItems.map((item) => {
      const prsfg_rtrto = validNumber(item.prsfg_rtrto);
      return {
        ...item,
        prsfg_fgrat: (validNumber(totalRMPMFOH) * prsfg_rtrto) / 100,
      };
    });

    setListDataSFGFG(newItems);
  };

  const recalcProcessQty = (prqty) => {
    if (!prqty) return;

    // RM/PM
    setListDataRMPM((prevRMPM) => {
      const updatedRMPM = prevRMPM.map((item) => {
        const reqQty = validNumber(item.prrpm_boqty) * validNumber(prqty);

        return {
          ...item,
          prrpm_rmqty: reqQty.toFixed(4),
          prrpm_rmval: (reqQty * validNumber(item.prrpm_rmrat)).toFixed(4),
        };
      });

      // FOH
      setListDataFOH((prevFOH) => {
        const updatedFOH = prevFOH.map((item) => {
          const reqQty = validNumber(item.prfoh_boqty) * validNumber(prqty);

          return {
            ...item,
            prfoh_foqty: reqQty.toFixed(4),
            prfoh_foval: (reqQty * validNumber(item.prfoh_forat)).toFixed(4),
          };
        });

        // Calculate total RM/PM + FOH from the UPDATED values
        const totalRMPM = updatedRMPM.reduce(
          (sum, item) => sum + validNumber(item.prrpm_rmval),
          0,
        );

        const totalFOH = updatedFOH.reduce(
          (sum, item) => sum + validNumber(item.prfoh_foval),
          0,
        );

        const totalRMPMFOH = totalRMPM + totalFOH;

        // SFG / FG
        setListDataSFGFG((prevSFGFG) => {
          return prevSFGFG.map((item) => {
            const reqQty =
              item.prsfg_group === "MAIN"
                ? validNumber(prqty)
                : validNumber(item.prsfg_boqty) * validNumber(prqty);

            const prsfg_rtrto = validNumber(item.prsfg_rtrto);
            const prsfg_fgrat = (totalRMPMFOH * prsfg_rtrto) / 100 / reqQty;

            return {
              ...item,
              prsfg_fgqty: reqQty,
              // Recalculated output rate/value
              prsfg_fgrat: prsfg_fgrat.toFixed(4),
              prsfg_fgval: (reqQty * prsfg_fgrat).toFixed(4),
            };
          });
        });

        return updatedFOH;
      });

      return updatedRMPM;
    });
  };

  const getConsumptionStock = async (price_id) => {
    try {
      const resp = await stockAPI.getPriceStockForProcess({
        stock_dpart: formData.promf_dpart,
        stock_price: price_id,
      });
      const list = resp.data || [];
      setStock_Options(list);
      //console.log("list", list);
    } catch (error) {}
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setReadOnly(true);
    setFormData(rowData);
    loadAllDetails(rowData.id);
    getAllDepartments();
    getAllUnits();
  };

  const loadAllDetails = async (id) => {
    try {
      setIsBusy(true);
      const [rmResp, fohResp, sfgResp, batchResp] = await Promise.all([
        processAPI.getRMPMbyProcessId({ prrpm_promf: id }),
        processAPI.getFOHbyProcessId({ prfoh_promf: id }),
        processAPI.getSFGFGbyProcessId({ prsfg_promf: id }),
        processAPI.getBatchbyProcessId({ prbtc_promf: id }),
      ]);
      setListDataRMPM(rmResp.data || []);
      setListDataFOH(fohResp.data || []);
      setListDataSFGFG(sfgResp.data || []);
      setListDataBatch(batchResp.data || []);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.promf_actve;
    const dataName = rowData.promf_cname;
    const confirmation = await confirmBox({
      title: isActive ? "Deactivate" : "Activate",
      message: `Are you sure you want to ${
        isActive ? "deactivate" : "activate"
      } "${dataName}"?`,
      confirmText: isActive ? "Deactivate" : "Activate",
      variant: isActive ? "danger" : "success",
    });
    if (!confirmation) return;

    try {
      setIsBusy(true);
      const resp = await processAPI.delete(rowData);
      alertBox({
        title: resp.success
          ? isActive
            ? "Deactivated"
            : "Activated"
          : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllProcess();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllProcess();
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
    setListDataRMPM([]);
    setListDataFOH([]);
    setListDataSFGFG([]);
    setListDataBatch([]);
    getAllDepartments();
    getAllUnits();
    getAllItems();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmmb_promf);
      //console.log("newErrors",newErrors)
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      if (listDataRMPM.length === 0) {
        showToast("At least 1 Raw Material is required", { type: "warning" });
        return;
      }
      if (listDataFOH.length === 0) {
        showToast("At least 1 Factory Overhead is required", {
          type: "warning",
        });
        return;
      }
      if (listDataSFGFG.length === 0) {
        showToast("At least 1 SFG/FG is required", { type: "warning" });
        return;
      }

      const isNullEmpty = listDataRMPM.find(
        (f) => !f.prrpm_stock || String(f.prrpm_stock).trim() === "",
      );

      if (isNullEmpty) {
        showToast("RM/PM Stock is required", { type: "warning" });
        return;
      }

      const isShortStock = listDataRMPM.find(
        (f) => Number(f.stock_ohqty || 0) < Number(f.prrpm_rmqty || 0),
      );

      if (isShortStock) {
        showToast("RM/PM Stock is short", { type: "warning" });
        return;
      }

      const isSfgFgValue = listDataSFGFG.find(
        (f) => validNumber(f.prsfg_fgval) < 0.1,
      );
      if (isSfgFgValue) {
        showToast("Output value is underflow", {
          type: "warning",
        });
        return;
      }

      const reqBody = {
        ...formData,
        tmmb_prrpm: listDataRMPM,
        tmmb_prfoh: listDataFOH,
        tmmb_prsfg: listDataSFGFG,
        tmmb_prbtc: listDataBatch,
      };

      setIsBusy(true);
      const resp = await processAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllProcess();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- RM / PM ----------

  const handleChangeRMPM = (f, v) => {
    setFormDataRMPM((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataRMPM, [f]: v }, tmmb_prrpm);
    setFormErrors(newErrors);
    if (f === "prrpm_types") {
      const current_items = items_store_Options.filter(
        (item) => item.items_itype === v,
      );
      setItems_Options(current_items);
    }
  };

  const handleAddToListRMPM = () => {
    const newErrors = validate(formDataRMPM, tmmb_prrpm);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (
      ["", 0, "0", null, undefined].includes(formDataRMPM.prrpm_rmqty) &&
      ["", 0, "0", null, undefined].includes(formDataRMPM.prrpm_rmrto)
    ) {
      showToast("Qty or Ratio both are Empty", { type: "warning" });
      return;
    }
    const items_iname = items_Options.find(
      (opt) => opt.id === formDataRMPM.prrpm_items,
    );

    const units_cname = units_Options.find(
      (opt) => opt.id === formDataRMPM.prrpm_units,
    );

    const prrpm_rmval = round2(
      (Number(formDataRMPM.prrpm_rmqty) || 0) *
        (Number(formDataRMPM.prrpm_rmrat) || 0),
    );

    setListDataRMPM((prev) => [
      ...prev,
      {
        ...formDataRMPM,
        prrpm_rmval: prrpm_rmval,
        items_iname: items_iname?.items_iname || "Invalid Item",
        units_cname: units_cname?.units_cname || "Invalid Unit",
        prrpm_actve: true,
      },
    ]);
    setFormDataRMPM({});
    handleHideModal();
  };
  //mapping stock
  const handleEditRMPM = async (rowData) => {
    handleShowModal("RMPM_STOCK");
    setFormDataRMPM(rowData);
    //console.log(formData);
    await getConsumptionStock(rowData.prrpm_price);
  };

  const handleDeleteRMPM = async (rowData) => {
    const dataName = rowData.items_iname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataRMPM((prev) =>
      prev.filter((item) => item.prrpm_items !== rowData.prrpm_items),
    );
    showToast("Removed successfully", { type: "success" });
  };

  // ---------- FACTORY OVERHEAD ----------

  const handleChangeFOH = (f, v) => {
    setFormDataFOH((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataFOH, [f]: v }, tmmb_prfoh);
    setFormErrors(newErrors);
    if (f === "prfoh_types") {
      const current_items = items_store_Options.filter(
        (item) => item.items_itype === v,
      );
      setItems_Options(current_items);
    }
  };

  const handleAddToListFOH = () => {
    const newErrors = validate(formDataFOH, tmmb_prfoh);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (
      ["", 0, "0", null, undefined].includes(formDataFOH.prfoh_foqty) &&
      ["", 0, "0", null, undefined].includes(formDataFOH.prfoh_forto)
    ) {
      showToast("Qty or Ratio both are Empty", { type: "warning" });
      return;
    }
    const items_iname = items_store_Options.find(
      (opt) => opt.id === formDataFOH.prfoh_items,
    );

    const units_cname = units_Options.find(
      (opt) => opt.id === formDataFOH.prfoh_units,
    );

    const prfoh_foval = round2(
      (Number(formDataFOH.prfoh_foqty) || 0) *
        (Number(formDataFOH.prfoh_forat) || 0),
    );

    setListDataFOH((prev) => [
      ...prev,
      {
        ...formDataFOH,
        prfoh_foval: prfoh_foval,
        items_iname: items_iname?.items_iname || "Invalid Item",
        units_cname: units_cname?.units_cname || "Invalid Unit",
        prfoh_actve: true,
      },
    ]);
    setFormDataFOH({});
    handleHideModal();
  };

  const handleEditFOH = (rowData) => {
    handleShowModal("FOH");
    setFormDataFOH(rowData);
  };

  const handleDeleteFOH = async (rowData) => {
    const dataName = rowData.items_iname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataFOH((prev) =>
      prev.filter((item) => item.prfoh_items !== rowData.prfoh_items),
    );
    showToast("Removed successfully", { type: "success" });
  };

  // ---------- SFG /FG ----------

  const handleChangeSFG = (f, v) => {
    setFormDataSFGFG((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataSFGFG, [f]: v }, tmmb_prsfg);
    setFormErrors(newErrors);
    if (f === "prsfg_types") {
      const current_items = items_store_Options.filter(
        (item) => item.items_itype === v,
      );
      setItems_Options(current_items);
    }
  };

  const handleAddToListSFG = () => {
    const newErrors = validate(formDataSFGFG, tmmb_prsfg);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (
      ["", 0, "0", null, undefined].includes(formDataSFGFG.prsfg_fgqty) &&
      ["", 0, "0", null, undefined].includes(formDataSFGFG.prsfg_fgrto)
    ) {
      showToast("Qty or Ratio both are Empty", { type: "warning" });
      return;
    }
    const items_iname = items_store_Options.find(
      (opt) => opt.id === formDataSFGFG.prsfg_items,
    );

    const units_cname = units_Options.find(
      (opt) => opt.id === formDataSFGFG.prsfg_units,
    );

    const prsfg_fgval = round2(
      (Number(formDataSFGFG.prsfg_fgqty) || 0) *
        (Number(formDataSFGFG.prsfg_fgrat) || 0),
    );

    setListDataSFGFG((prev) => [
      ...prev,
      {
        ...formDataSFGFG,
        prsfg_fgval: prsfg_fgval,
        items_iname: items_iname?.items_iname || "Invalid Item",
        units_cname: units_cname?.units_cname || "Invalid Unit",
        prsfg_actve: true,
      },
    ]);
    setFormDataSFGFG({});
    handleHideModal();
  };

  const handleEditSFG = (rowData) => {
    handleShowModal("SFG");
    setFormDataSFGFG(rowData);
  };

  const handleDeleteSFG = async (rowData) => {
    const dataName = rowData.items_iname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataSFGFG((prev) =>
      prev.filter((item) => item.prsfg_items !== rowData.prsfg_items),
    );
    showToast("Removed successfully", { type: "success" });
  };

  const handleChangeSFGRow = (f, v, id) => {
    // console.log(f);
    // console.log(v);
    // console.log(id);
    setListDataSFGFG((prev) =>
      prev.map((row) => (row.prsfg_price === id ? { ...row, [f]: v } : row)),
    );
    recalcProcessQty(v);
  };
  // ---------- BATCH ----------

  const handleChangeBatch = (f, v, id) => {
    // console.log(f);
    // console.log(v);
    // console.log(id);
    // setFormDataBatch((prev) =>
    //   prev.map((row) => (row.id === id ? { ...row, [f]: v } : row)),
    // );
    // setFormDataBatch((prev) => ({ ...prev, [f]: v }));
    // const newErrors = validate({ ...formDataBatch, [f]: v }, tmmb_prbtc);
    // setFormErrors(newErrors);
    // if (f === "prbtc_types") {
    //   const current_items = items_store_Options.filter(
    //     (item) => item.items_itype === v,
    //   );
    //   setItems_Options(current_items);
    // }
    setFormDataBatch((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        const updatedRow = {
          ...row,
          [f]: v,
        };

        if (f === "prbtc_gdstk" || f === "prbtc_bdstk") {
          const qty =
            validNumber(updatedRow.prbtc_gdstk) +
            validNumber(updatedRow.prbtc_bdstk);

          updatedRow.prbtc_fgval = qty * validNumber(updatedRow.prbtc_fgrat);
        }

        return updatedRow;
      }),
    );
  };

  const handleAddToListBatch = async () => {
    // const newErrors = validate(formDataBatch, tmmb_prbtc);
    // setFormErrors(newErrors);
    // if (Object.keys(newErrors).length > 0) {
    //   return;
    // }
    // if (
    //   ["", 0, "0", null, undefined].includes(formDataBatch.prbtc_gaqty) &&
    //   ["", 0, "0", null, undefined].includes(formDataBatch.prbtc_gbqty)
    // ) {
    //   showToast("At least one Good Quantity is required", {
    //     type: "warning",
    //   });
    //   return;
    // }
    // const items_iname = items_store_Options.find(
    //   (opt) => opt.id === formDataBatch.prbtc_items,
    // );

    // const units_cname = units_Options.find(
    //   (opt) => opt.id === formDataBatch.prbtc_units,
    // );

    // const prbtc_pbval = round2(
    //   ((Number(formDataBatch.prbtc_gaqty) || 0) +
    //     (Number(formDataBatch.prbtc_gbqty) || 0)) *
    //     (Number(formDataBatch.prbtc_pbrat) || 0),
    // );

    // setListDataBatch((prev) => [
    //   ...prev,
    //   {
    //     ...formDataBatch,
    //     prbtc_pbval: prbtc_pbval,
    //     items_iname: items_iname?.items_iname || "Invalid Item",
    //     units_cname: units_cname?.units_cname || "Invalid Unit",
    //     prbtc_actve: true,
    //   },
    // ]);
    // setFormDataBatch({});
    // handleHideModal();
    try {
      const newErrors = validate(formData, tmmb_promf);
      //console.log("newErrors",newErrors)
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const isShortStock = formDataBatch.find(
        (f) =>
          validNumber(f.prbtc_gdstk) + validNumber(f.prbtc_bdstk) >
          validNumber(f.avail_fgqty),
      );
      if (isShortStock) {
        const gdQty = validNumber(isShortStock.prbtc_gdstk);
        const bdQty = validNumber(isShortStock.prbtc_bdstk);
        const availableQty = validNumber(isShortStock.avail_fgqty);
        const overflowQty = availableQty - (gdQty + bdQty);
        showToast(overflowQty + " complete Qty is overflow", {
          type: "warning",
        });
        return;
      }

      const reqBody = {
        ...formData,
        tmmb_prbtc: formDataBatch,
      };

      //console.log(reqBody);
      //return;

      setIsBusy(true);
      const resp = await processAPI.insertBatch(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        //setPgView("SYS_VW_LST_1");
        //setFormData(dataModel);
        //getAllProcess();
        loadAllDetailsBOM(formData.id);
        handleHideModal();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleEditBatch = (rowData) => {
    handleShowModal("Batch");
    setFormDataBatch(rowData);
  };

  //modal
  const handleShowModal = (modal) => {
    if (modal === "RMPM") {
      setFormDataRMPM(dataModelRM);
    } else if (modal === "FOH") {
      setFormDataFOH(dataModelFOH);
    } else if (modal === "SFG") {
      setFormDataSFGFG(dataModelSFG);
    } else if (modal === "Batch") {
      const list = listDataSFGFG.map((item) => ({
        id: generateGuid(),
        prbtc_bosfg: item.prsfg_bosfg,
        prbtc_prsfg: item.id,
        prbtc_items: item.prsfg_items,
        prbtc_price: item.prsfg_price,
        prbtc_units: item.prsfg_units,
        prbtc_itype: item.prsfg_itype,
        prbtc_group: item.prsfg_group,
        prbtc_brcod: "",
        prbtc_batch: "",
        prbtc_srial: "",
        prbtc_gdstk: 0,
        prbtc_bdstk: 0,
        prbtc_fgrat: item.prsfg_fgrat,
        prbtc_fgval: 0,
        prbtc_dpart: formData.promf_dpart,
        prbtc_wkshf: "work-shift",
        prbtc_emply: "emply",
        avail_fgqty:
          validNumber(item.prsfg_fgqty) - validNumber(item.avail_fgqty), //avail qty
        price_cname: item.price_cname,
        units_cname: item.units_cname,
      }));
      setFormDataBatch(list);
    } else if (modal === "RMPM_STOCK") {
      //setFormDataBatch(dataModelBatch);
    }

    setShowModal({ show: true, modal: modal });
    switch (modal) {
      case "RMPM":
        setModalTitle({
          title: "Add RM/PM",
          subTitle: "Raw Material / Packing Material",
        });
        break;
      case "FOH":
        setModalTitle({
          title: "Add FOH",
          subTitle: "Factory Overhead",
        });
        break;
      case "SFG":
        setModalTitle({
          title: "Add SFG/FG",
          subTitle: "Semi-Finished / Finished Goods",
        });
        break;
      case "Batch":
        setModalTitle({
          title: "Add Batch Output",
          subTitle: "Batch Output Entry",
        });
        break;
      case "RMPM_STOCK":
        setModalTitle({
          title: "Add RM/PM Stock",
          subTitle: "RM/PM Stock Entry",
        });
        break;
      default:
        setModalTitle({ title: "", subTitle: "" });
    }
  };
  const handleHideModal = () => {
    setShowModal({ show: false, modal: "" });
    setModalTitle({ title: "", subTitle: "" });
  };

  const handleDeleteBatch = async (rowData) => {
    const dataName = rowData.items_iname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataBatch((prev) =>
      prev.filter((item) => item.prbtc_items !== rowData.prbtc_items),
    );
    showToast("Removed successfully", { type: "success" });
  };

  //stock
  const handleChangeStock = (f, v) => {
    // console.log("f", f);
    //console.log("v", v);
    const stock = stock_Options.find((opt) => opt.stock_id === v);
    // console.log("stock_Options", stock_Options);
    // console.log("stock", stock);

    setFormDataRMPM((prev) => ({ ...prev, stock_id: v }));

    // setFormDataRMPM((prev) => ({
    //   ...prev,
    //   prrpm_stock: stock?.stock_id || "",
    //   stock_ohqty: stock?.stock_ohqty || 0,
    // }));

    // Update matching item in the list
    //in a Single BOM, a price  item can be only onece
    setListDataRMPM((prev) =>
      prev.map((item) =>
        item.prrpm_price === stock?.price_id || ""
          ? {
              ...item,
              prrpm_stock: v,
              prrpm_rmrat: validNumber(stock?.stock_cprat),
              prrpm_rmval:
                validNumber(stock?.stock_cprat) * validNumber(item.prrpm_rmqty),
              stock_id: v,
              stock_ohqty: stock?.stock_ohqty || 0,
            }
          : item,
      ),
    );
  };

  const handleAddToListStock = () => {
    handleHideModal();
    //recalcOutputCost();
  };

  return {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    listDataRMPM,
    formDataRMPM,
    listDataFOH,
    formDataFOH,
    listDataSFGFG,
    formDataSFGFG,
    listDataBatch,
    formDataBatch,
    dpart_Options,
    bom_Options,
    units_Options,
    items_Options,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //other
    handleChangeRMPM,
    handleAddToListRMPM,
    handleEditRMPM,
    handleDeleteRMPM,
    //foh
    handleChangeFOH,
    handleAddToListFOH,
    handleEditFOH,
    handleDeleteFOH,
    //sfg
    handleChangeSFG,
    handleAddToListSFG,
    handleEditSFG,
    handleDeleteSFG,
    handleChangeSFGRow,
    //stock
    stock_Options,
    handleChangeStock,
    handleAddToListStock,
    //batch
    handleChangeBatch,
    handleAddToListBatch,
    handleEditBatch,
    handleDeleteBatch,
  };
};
export default useProcess;
