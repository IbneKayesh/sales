import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useBusiness } from "@/hooks/auth/useBusiness";
import { Chip } from "primereact/chip";
import { getStorageData, setStorageData } from "@/utils/storage";

export default function ActiveBusiness({ visible, setVisible }) {
  const { dataList } = useBusiness();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = getStorageData();
    setUser(data.user);
  }, []);

  const handleSelectBusiness = (id, name) => {
    const new_user = { ...user, users_bsins: id, bsins_bname: name };
    setStorageData({ user: new_user });
    setVisible(false);
    //reload current page
    window.location.reload();
  };

  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Switch Business"
        visible={visible}
        style={{ width: "25vw" }}
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
              onClick={() =>
                handleSelectBusiness(business.id, business.bsins_bname)
              }
            />
          ))}
        </div>
      </Dialog>
    </div>
  );
}
