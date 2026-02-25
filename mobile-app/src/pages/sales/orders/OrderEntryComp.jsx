import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/datetime";
import { demoOptions } from "@/utils/vtable";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const OrderEntryComp = ({ formData, onBack }) => {
  const [errors, setSerros] = useState([]);
  const [dataList, setDataList] = useState([
    {
      code: 123,
      name: "Item 1",
      quantity: 1,
      price: 100,
    },
    {
      code: 124,
      name: "Item 2",
      quantity: 2,
      price: 200,
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState(1);
  const opRef = useRef(null);

  const action_BT = (rowData) => {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          className="lite-button lite-button-danger lite-button-sm"
          onClick={() => onBack()}
        >
          <span className="pi pi-trash text-xs text-white"></span>
        </button>
      </div>
    );
  };

  const removeItem = (code) => {
    setDataList(dataList.filter((item) => item.code !== code));
  };

  const onItemSelect = (e) => {
    setSelectedItem(e.value);
    setQty(1);
    opRef.current.show(e.originalEvent);
  };

  const addItem = () => {
    if (!selectedItem) return;

    const existingIndex = dataList.findIndex(
      (item) => item.code === selectedItem.value,
    );

    if (existingIndex >= 0) {
      // Update quantity if item exists
      const updatedList = [...dataList];
      updatedList[existingIndex].quantity += qty;
      setDataList(updatedList);
    } else {
      // Add new item
      setDataList([
        ...dataList,
        {
          code: selectedItem.value,
          name: selectedItem.label,
          quantity: qty,
          price: 100, // Default price, can be updated dynamically
        },
      ]);
    }

    opRef.current.hide();
  };

  return (
    <div className="lite-card">
      <div className="search-bar">
        <div className="flex items-center gap-2">
          <button
            className="lite-button lite-button-secondary lite-button-sm"
            onClick={() => onBack()}
          >
            <span className="pi pi-arrow-left mr-1 text-xs"></span>
            Back
          </button>
          <div className="flex flex-column">
            <span className="text-sm font-semibold">
              {formData.cnrut_srlno}. {formData.cntct_cntnm}
            </span>
            <span className="text-xs text-gray-600">
              {formData.rutes_dname}, {formData.rutes_rname}
            </span>
          </div>
        </div>
      </div>
      <div className="lite-card-divider"></div>
      {JSON.stringify(formData)}
      <div className="lite-card-item">
        <Dropdown
          name="fodrc_bitem"
          value={selectedItem}
          options={demoOptions}
          onChange={onItemSelect}
          className={`w-full`}
          placeholder={`Select item`}
          optionLabel="label"
          optionValue="value"
          filter
        />
        <OverlayPanel ref={opRef} showCloseIcon>
          <div className="flex flex-column gap-2">
            <label>Quantity</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="p-inputtext p-component w-full"
            />
            <Button
              label="OK"
              onClick={addItem}
              className="p-button-sm p-button-primary"
            />
          </div>
        </OverlayPanel>
      </div>
      <div className="lite-card-item">
        <DataTable value={dataList}>
          <Column field="code" header="Code"></Column>
          <Column field="name" header="Name"></Column>
          <Column field="quantity" header="Quantity"></Column>
          <Column field="price" header="Price"></Column>
          <Column header={dataList?.length + " rows"} body={action_BT} />
        </DataTable>
      </div>
    </div>
  );
};
export default OrderEntryComp;
