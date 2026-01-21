import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

const SearchComp = ({
  searchBoxData,
  handleChangeSearchInput,
  setSearchBoxShow,
  handleSearch,
  searchOptions,
}) => (
  <div className="flex flex-wrap shadow-2 border-round-lg surface-card p-3 mb-3 gap-2 align-items-center">
    <div className="flex-1">
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-hashtag"></i>
        </span>
        <InputText
          name="mbkng_trnno"
          value={searchBoxData.mbkng_trnno}
          onChange={handleChangeSearchInput}
          placeholder="Trn No"
          className="w-full p-inputtext-sm"
        />
      </div>
    </div>
    <div className="flex-1">
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
        </span>
        <InputText
          name="mbkng_cntct"
          value={searchBoxData.mbkng_cntct}
          onChange={handleChangeSearchInput}
          placeholder="Supplier"
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
          name="mbkng_trdat"
          value={
            searchBoxData.mbkng_trdat
              ? new Date(searchBoxData.mbkng_trdat)
              : null
          }
          onChange={handleChangeSearchInput}
          className="w-full"
          inputClassName="p-inputtext-sm"
          dateFormat="yy-mm-dd"
          placeholder="Date"
          showClear
        />
      </div>
    </div>
    <div className="flex-1">
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <i className="pi pi-file"></i>
        </span>
        <InputText
          name="mbkng_refno"
          value={searchBoxData.mbkng_refno}
          onChange={handleChangeSearchInput}
          placeholder="Ref No"
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
          value={searchBoxData.search_option}
          options={searchOptions}
          optionLabel="label"
          optionValue="name"
          onChange={(e) => handleChangeSearchInput(e)}
          className="w-full p-inputtext-sm"
          placeholder="Option"
          filter
          showClear
        />
      </div>
    </div>
    <div className="flex gap-2 ml-auto">
      <Button
        label="Clear"
        icon="pi pi-filter-slash"
        severity="secondary"
        size="small"
        onClick={() => setSearchBoxShow(false)}
      />
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
