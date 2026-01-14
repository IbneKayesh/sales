import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const SearchComp = ({
  searchBoxData,
  handleChangeSearchInput,
  setSearchBoxShow,
  handleSearch,
}) => (
  <div className="grid p-2 border-round-md shadow-3 surface-card mb-3">
    <div className="col-12 md:col-3">
      <InputText
        className="w-full"
        placeholder="Supplier Name"
        name="pmstr_cntct"
        value={searchBoxData.pmstr_cntct}
        onChange={handleChangeSearchInput}
      />
    </div>
    <div className="col-12">
      <div className="flex justify-content-end gap-2">
        <Button
          label="Close"
          icon="pi pi-times"
          severity="danger"
          size="small"
          onClick={() => setSearchBoxShow(false)}
        />
        <Button
          label="Find"
          icon="pi pi-search"
          severity="success"
          size="small"
          onClick={() => handleSearch()}
        />
      </div>
    </div>
  </div>
);

export default SearchComp;
