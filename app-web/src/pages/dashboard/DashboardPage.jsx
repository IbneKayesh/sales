import React from "react";
import BoxComp from "./BoxComp";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import useDashboard from "@/hooks/useDashboard";

const DashboardPage = () => {
  const {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    dzone_cntry_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
  } = useDashboard();

  return (
    <>
      {/* {JSON.stringify(formData)} */}

      <div className="p-2">
        <span className="font-semibold text-lg">{formData.title}</span>
        <span className="ml-2"> | {formData.subtitle}</span>

        <div className="grid my-2 w-full">
          {formData?.components?.map((item, index) => (
            <div className="md:col-6" key={index}>
              {JSON.stringify(item)}
              <BoxComp
                title={item.title}
                subtitle={item.subtitle}
                number={item.stats.value}
                subNumber={item.stats.change}
                onClick={() => console.log("clicked")}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
