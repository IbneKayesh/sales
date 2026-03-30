import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

const SearchComp = ({
  formData,
  handleChange,
  handleSearch,
  searchOptions,
}) => (
  <div className="flex flex-wrap shadow-2 border-round-lg surface-card p-3 mb-3 gap-2 align-items-center">
    <div className="flex-1 hidden">
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-home"></i>
        </span>
        <InputText
          name="-"
          value={formData.test}
          onChange={handleChange}
          placeholder="Test"
          className="w-full p-inputtext-sm"
        />
      </div>
    </div>
    <div className="flex-1">
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-list"></i>
        </span>
        <InputText
          name="exptr_exctg"
          value={formData.exptr_exctg}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-inputtext-sm"
        />
      </div>
    </div>
    <div className="flex-1">
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-calendar"></i>
        </span>
        <Calendar
          name="exptr_trdat"
          value={
            formData.exptr_trdat
              ? new Date(formData.exptr_trdat)
              : null
          }
          onChange={handleChange}
          className="w-full"
          inputClassName="p-inputtext-sm"
          dateFormat="yy-mm-dd"
          placeholder="Date"
        />
      </div>
    </div>
    <div className="flex-1">
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-file"></i>
        </span>
        <InputText
          name="exptr_trnte"
          value={formData.exptr_trnte}
          onChange={handleChange}
          placeholder="Note"
          className="w-full p-inputtext-sm"
        />
      </div>
    </div>
    <div className="flex-1">
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-filter"></i>
        </span>
        <Dropdown
          name="search_option"
          value={formData.search_option}
          options={searchOptions}
          optionLabel="label"
          optionValue="name"
          onChange={(e) => handleChange(e)}
          className="w-full p-inputtext-sm"
          placeholder="Option"
          filter
          showClear
          checkmark={true}
        />
      </div>
    </div>
    <div className="flex gap-2 ml-auto">
      <Button
        label="Find"
        icon="pi pi-search"
        severity="info"
        size="small"
        onClick={() => handleSearch()}
      />
    </div>
  </div>
);

export default SearchComp;