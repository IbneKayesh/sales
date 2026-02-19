import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { useDefaultData } from "@/hooks/setup/useDefaultData.js";

const DefaultDataPage = () => {
  const { dataList, handleSave } = useDefaultData();

  const [settings, setSettings] = useState([]);

  useEffect(() => {
    //console.log("dataList: " + JSON.stringify(dataList));
    setSettings(dataList);
  }, [dataList]);

  //find with ucnfg_cname && ucnfg_label and change value of ucnfg_value
  const onSettingChange = (cname, label, newValue) => {
    const stringValue = newValue ? "1" : "0";

    setSettings((prev) => {
      const updatedSettings = prev.map((item) =>
        item.ucnfg_cname === cname && item.ucnfg_label === label
          ? { ...item, ucnfg_value: stringValue }
          : item,
      );

      // Find the updated item and send to API
      const updatedItem = updatedSettings.find(
        (s) => s.ucnfg_cname === cname && s.ucnfg_label === label,
      );
      if (updatedItem) {
        handleSave(updatedItem);
      }

      return updatedSettings;
    });
  };

  const SettingItem = ({ config }) => (
    <div className="flex align-items-center justify-content-between py-2 px-3 hover:surface-100 transition-colors transition-duration-150 border-round">
      <label
        className="cursor-pointer flex-grow-1"
        onClick={() =>
          onSettingChange(
            config.ucnfg_cname,
            config.ucnfg_label,
            config.ucnfg_value !== "1",
          )
        }
      >
        {config.ucnfg_notes}
      </label>
      <Checkbox
        onChange={(e) =>
          onSettingChange(config.ucnfg_cname, config.ucnfg_label, e.checked)
        }
        checked={config.ucnfg_value === "1"}
      />
    </div>
  );

  const SubGroup = ({ title, settings }) => (
    <div className="mb-3 surface-border border-1 border-round p-2 bg-gray-50">
      <h5 className="mt-0 mb-3 uppercase font-bold text-sm tracking-wider text-primary">
        {title}
      </h5>
      <div className="flex flex-column gap-1">
        {settings.map((s, index) => (
          <React.Fragment key={s.ucnfg_label}>
            <SettingItem config={s} />
            {index < settings.length - 1 && (
              <Divider className="my-1 opacity-50" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const CategoryCard = ({ category }) => {
    const categorySettings = settings.filter((s) => s.ucnfg_cname === category);
    const groups = [...new Set(categorySettings.map((s) => s.ucnfg_gname))];

    return (
      <div className="col-12 md:col-3">
        <Card title={category} className="shadow-2 border-round-xl h-full mt-0">
          {groups.map((group) => (
            <SubGroup
              key={group}
              title={group}
              settings={categorySettings.filter((s) => s.ucnfg_gname === group)}
            />
          ))}
        </Card>
      </div>
    );
  };

  return (
    <Card title="Default Data Setup" className="p-3">
      <div className="grid">
        <CategoryCard category="Purchase" />
        <CategoryCard category="Sales" />
      </div>
    </Card>
  );
};

export default DefaultDataPage;
