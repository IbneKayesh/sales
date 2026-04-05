import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { useInstallations } from "@/hooks/setup/useInstallations.js";

const InstallationsPage = () => {
  const { dataList, handleSave } = useInstallations();

  // Group data by istal_level
  const groupedData = (dataList || []).reduce((acc, current) => {
    const level = current.istal_level || 0;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(current);
    return acc;
  }, {});

  const sortedLevels = Object.keys(groupedData).sort(
    (a, b) => Number(a) - Number(b),
  );

  const isLevelCompleted = (level) => {
    return groupedData[level].every((item) => !!item.ustal_scode);
  };

  const isLevelEnabled = (level) => {
    const levelIndex = sortedLevels.indexOf(level.toString());
    if (levelIndex <= 0) return true;
    // Enabled only if all previous levels are completed
    for (let i = 0; i < levelIndex; i++) {
      if (!isLevelCompleted(sortedLevels[i])) return false;
    }
    return true;
  };

  const InstallationItem = ({ item, isLocked }) => (
    <div className="flex align-items-center justify-content-between py-3 px-2 border-round hover:surface-50 transition-colors transition-duration-150">
      <div className="flex flex-column gap-1 flex-grow-1 mr-3">
        <div className="flex align-items-center">
          <span className="font-bold text-900">{item.istal_sname}</span>
          {isLocked && !item.ustal_scode && (
            <i className="pi pi-lock ml-2 text-400 text-xs" title="Complete lower levels first"></i>
          )}
        </div>
        <span className="text-600 text-sm">{item.istal_notes}</span>
      </div>
      <div className="flex align-items-center gap-3">
        {item.ustal_scode ? (
          <div className="text-right">
            <Tag
              value="Installed"
              severity="success"
              className="mb-1 bg-green-500"
            />
            <div className="text-xs text-500">
              {item.ustal_crdat
                ? new Date(item.ustal_crdat).toLocaleDateString()
                : "Installed"}
            </div>
          </div>
        ) : (
          <Button
            label="Install"
            icon="pi pi-download"
            disabled={isLocked}
            className="p-button-sm p-button-outlined p-button-rounded"
            onClick={() => handleSave(item)}
          />
        )}
      </div>
    </div>
  );

  return (
    <Card title="Database Installations" className="shadow-2 border-round-xl p-3">
      <div className="grid">
        {sortedLevels.map((level) => {
          const enabled = isLevelEnabled(level);
          const completed = isLevelCompleted(level);

          return (
            <div key={level} className="col-12 md:col-6 lg:col-4 p-3">
              <div
                className={`surface-border border-1 border-round p-3 h-full bg-white shadow-1 transition-all transition-duration-300 ${!enabled ? "opacity-60" : ""}`}
              >
                <div className="flex align-items-center justify-content-between mb-4">
                  <h5
                    className={`m-0 font-bold uppercase tracking-wider flex align-items-center ${enabled ? "text-primary" : "text-400"}`}
                  >
                    <i
                      className={`pi ${enabled ? "pi-list" : "pi-lock"} mr-2`}
                    ></i>
                    Level {level}
                  </h5>
                  <div className="flex gap-2">
                    {completed && <Tag severity="success" icon="pi pi-check" rounded />}
                    <Tag
                      value={`${groupedData[level].length} Items`}
                      severity={enabled ? "info" : "secondary"}
                      rounded
                    />
                  </div>
                </div>
                <div className="flex flex-column gap-1">
                  {groupedData[level].map((item, index) => (
                    <React.Fragment key={item.istal_scode}>
                      <InstallationItem item={item} isLocked={!enabled} />
                      {index < groupedData[level].length - 1 && (
                        <Divider className="my-1 opacity-50" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {!dataList ||
          (dataList.length === 0 && (
            <div className="col-12 text-center p-8 m-5 surface-100 border-round-xl">
              <i
                className="pi pi-box mb-3 text-400"
                style={{ fontSize: "3rem" }}
              ></i>
              <p className="text-600 font-medium">
                No installation records found.
              </p>
            </div>
          ))}
      </div>
    </Card>
  );
};

export default InstallationsPage;
