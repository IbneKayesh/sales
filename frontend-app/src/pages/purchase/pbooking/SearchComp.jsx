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
  <div className="grid shadow-2 border-round-lg surface-card p-3 mb-3">
    <div className="col-12 md:col-2">
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="pi pi-hashtag"></i>
        </span>
        <InputText
          name="pmstr_trnno"
          value={searchBoxData.pmstr_trnno}
          onChange={handleChangeSearchInput}
          placeholder="Transaction No"
        />
      </div>
    </div>
    <div className="col-12 md:col-2">
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
        </span>
        <InputText
          name="pmstr_cntct"
          value={searchBoxData.pmstr_cntct}
          onChange={handleChangeSearchInput}
          placeholder="Supplier Name"
        />
      </div>
    </div>
    <div className="col-12 md:col-2">
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="pi pi-calendar"></i>
        </span>
        <Calendar
          name="pmstr_trdat"
          value={
            searchBoxData.pmstr_trdat
              ? new Date(searchBoxData.pmstr_trdat)
              : null
          }
          onChange={handleChangeSearchInput}
          className={`w-full`}
          dateFormat="yy-mm-dd"
          placeholder={`Select date`}
          showClear
        />
      </div>
    </div>
    <div className="col-12 md:col-2">
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="pi pi-file"></i>
        </span>
        <InputText
          name="pmstr_refno"
          value={searchBoxData.pmstr_refno}
          onChange={handleChangeSearchInput}
          placeholder="Reference No"
        />
      </div>
    </div>
    <div className="col-12 md:col-2">
      <div className="p-inputgroup flex-1">
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
          className={`w-full`}
          placeholder={`Select an option`}
          filter
          showClear
        />
      </div>
    </div>
    <div className="col-12 md:col-2">
      <div className="flex justify-content-end gap-2">
        <Button
          label="Clear"
          icon="pi pi-filter-slash"
          severity="secondary"
          onClick={() => setSearchBoxShow(false)}
        />
        <Button
          label="Find"
          icon="pi pi-search"
          severity="info"
          onClick={() => handleSearch()}
        />
      </div>
    </div>
  </div>
);

export default SearchComp;
