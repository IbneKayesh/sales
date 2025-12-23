import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useState } from "react";

const SearchBoxComponent = ({ showSearchBox, setShowSearchBox }) => {
  const [searchBoxData, setSearchBoxData] = useState({
    booking_no: "",
    dates: null,
    customer_name: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchBoxData({ ...searchBoxData, [name]: value });
  };
  const handleClickSearch = () => {
    console.log(searchBoxData);
  };

  return (
    <Dialog
      header={
        <>
          <span className="pi pi-search text-primary"></span>
          <span className="font-semibold text-lg"> Search</span>
        </>
      }
      visible={showSearchBox}
      onHide={() => {
        if (!showSearchBox) return;
        setShowSearchBox(false);
      }}
      position="top"
      style={{
        width: "50vw",
        borderRadius: "12px",
        backgroundImage:
          "radial-gradient(circle at left top, #e63030ff, #11a725ff)",
      }}
    >
      <div className="grid">
        <div className="col-4">
          <InputText
            className="w-full"
            placeholder="Booking No"
            name="booking_no"
            value={searchBoxData.booking_no}
            onChange={handleChange}
          />
        </div>
        <div className="col-4">
          <Calendar
            value={searchBoxData.dates}
            onChange={(e) =>
              setSearchBoxData({ ...searchBoxData, dates: e.value })
            }
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
            showButtonBar
            className="w-full"
            placeholder="Booking Date"
          />
        </div>
        <div className="col-4">
          <InputText
            className="w-full"
            placeholder="Customer Name / Mobile"
            name="customer_name"
            value={searchBoxData.customer_name}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex justify-content-end gap-2 mt-2">
        <Button
          label="Cancel"
          icon="pi pi-times"
          severity="danger"
          onClick={() => setShowSearchBox(false)}
        />
        <Button
          label="Search"
          icon="pi pi-search"
          severity="success"
          onClick={() => handleClickSearch()}
        />
      </div>
    </Dialog>
  );
};
export default SearchBoxComponent;
