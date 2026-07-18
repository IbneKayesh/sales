import { useEffect, useState } from "react";

const useChartOfAccounts = () => {
  const [pgView, setPgView] = useState({ button: "search", view: "SYS_LST_1" });
  const [formData, setFormData] = useState(null);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    setDataList([
      {
        name: "User",
      },
    ]);
  }, []);

  const handleSetView = (btn) => {
    if (btn === "SYS_BT_SRC_1") {
      setPgView({ button: btn, view: "SYS_VW_LST_1" });
    } else if (btn === "SYS_BT_ADD_1") {
      setPgView({ button: btn, view: "SYS_VW_FRM_1" });
    } else if (btn === "SYS_BT_CNL_1") {
      setPgView({ button: btn, view: "SYS_VW_LST_1" });
    } else {
      //do nothing
      //setPgView({ button: "search", view: "SYS_LST_1" });
    }
  };

  const handleEdit = (rowData) => {
    setPgView({ button: "SYS_BT_ADD_1", view: "SYS_VW_FRM_1" });
    setFormData(rowData);
  };

  return {
    pgView,
    formData,
    dataList,
    handleSetView,
    handleEdit,
  };
};
export default useChartOfAccounts;
