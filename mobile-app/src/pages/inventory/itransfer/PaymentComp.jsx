import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import tmib_mtrsf from "@/models/inventory/tmib_mtrsf.json";

const PaymentComp = ({ errors, formData, handleChange, onShowExcludeCost }) => {
  return (
    <div className="grid mt-3">
      <div className="col-12 md:col-4">
        <div className="col-12 mb-3">
          <label htmlFor="mtrsf_trnte" className="block font-bold mb-2">
            {tmib_mtrsf.mtrsf_trnte.label}
          </label>
          <InputText
            id="mtrsf_trnte"
            name="mtrsf_trnte"
            value={formData.mtrsf_trnte}
            onChange={(e) => handleChange("mtrsf_trnte", e.target.value)}
            className={`w-full ${errors.mtrsf_trnte ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_mtrsf.mtrsf_trnte.label}`}
            disabled={formData.edit_stop}
            variant={formData.edit_stop ? "filled" : "outlined"}
          />
          {errors.mtrsf_trnte && (
            <small className="mb-3 text-red-500">{errors.mtrsf_trnte}</small>
          )}
        </div>

        {formData.mtrsf_ispst === 0 && (
          <Tag
            severity="danger"
            value="Not Posted"
            icon="pi pi-times"
            className="mr-1"
          />
        )}
      </div>
      {/* Payment Entry and List */}
      <div className="col-12 md:col-4"></div>
      {/* Financial Summary Information */}
      <div className="col-12 md:col-4">
        <div className="surface-card p-3 shadow-1 border-round-md border-left-3 border-primary h-full">
          <div className="flex align-items-center justify-content-between mb-3">
            <h5 className="m-0 font-bold text-900">Order Summary</h5>
            <i className="pi pi-briefcase text-primary text-xl" />
          </div>

          <div className="flex flex-column gap-3">
            <div className="flex justify-content-between">
              <span>Gross Amount (1)</span>
              <span className="font-bold text-900">
                {Number(formData.mtrsf_odamt).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-content-between">
              <div
                className="flex align-items-center gap-2 text-white bg-gray-500 p-1 border-round-md cursor-pointer"
                onClick={() => onShowExcludeCost()}
              >
                <i className="pi pi-plus-circle text-bold" />
                <span>Exclude Cost (2)</span>
              </div>
              <span className="font-bold">
                {Number(formData.mtrsf_excst || 0).toFixed(2)}
              </span>
            </div>

            <div className="border-top-1 border-200 my-2"></div>
            <div className="flex justify-content-between">
              <span>Total (3) [1+2]</span>
              <span className="font-bold text-900">
                {Number(formData.mtrsf_ttamt).toFixed(2)}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComp;
