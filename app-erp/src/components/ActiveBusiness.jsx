import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useBusinessSgd } from "@/hooks/setup/useBusinessSgd";
import { Chip } from "primereact/chip";
import { getStorageData, setStorageData } from "@/utils/storage";
import { useBusy, useNotification, useToast } from "@/hooks/useAppUI";

export default function ActiveBusiness({ visible, setVisible }) {
  const { showToast } = useToast();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const { dataList, handleGetAllActiveBusiness } = useBusinessSgd();
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    const data = getStorageData();
    setUser(data.user);
    setBusiness(data.business);

    handleGetAllActiveBusiness();
  }, []);

  const handleSelectBusiness = async (id) => {
    if (user.users_isrgs === false) {
      notify({
        severity: "error",
        summary: "Switch Business",
        detail: `You are not authorized to switch business - by ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });
    } else {
      setIsBusy(true);
      const new_user = { ...user, users_bsins: id };
      setStorageData({ user: new_user });

      const selectedBusiness = dataList.find((business) => business.id === id);
      setStorageData({ business: selectedBusiness });
      setVisible(false);
      setIsBusy(false);
      //reload current page
      window.location.reload();
    }
  };

  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Switch Business"
        visible={visible}
        style={{ minWidth: "25vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="m-0">
          {dataList.map((business) => (
            <Chip
              key={business.id}
              label={business.bsins_bname}
              icon="pi pi-home"
              className={
                user.users_bsins === business.id
                  ? "bg-gray-800 text-white m-2"
                  : "bg-gray-300 text-gray-600 m-2"
              }
              value={business.bsins_bname}
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectBusiness(business.id)}
            />
          ))}
        </div>
      </Dialog>
    </div>
  );
}
