import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useBusiness } from "@/hooks/auth/useBusiness";
import { Chip } from "primereact/chip";
import { getStorageData, setStorageData } from "@/utils/storage";
import { useToast } from "@/hooks/useToast";

export default function ActiveBusiness({ visible, setVisible }) {
  const { showToast } = useToast();
  const { dataList } = useBusiness();
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    const data = getStorageData();
    setUser(data.user);
    setBusiness(data.business);
  }, []);

  const handleSelectBusiness = (id) => {
    if (user.users_isrgs === 0) {
      showToast("error", "Error", "You are not authorized to switch business");
    } else {
      const new_user = { ...user, users_bsins: id};
      setStorageData({ user: new_user });

      const selectedBusiness = dataList.find((business) => business.id === id);
      setStorageData({ business: selectedBusiness });
      setVisible(false);

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
