import { useEffect, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import ConvertedBDTCurrency from "@/components/ConvertedBDTCurrency";
import ZeroRowCell from "@/components/ZeroRowCell";

const ItemsComp = ({ formData, formDataItemList, setFormDataItemList }) => {

  const [editingRows, setEditingRows] = useState([]);
  const [showExtraColumns, setShowExtraColumns] = useState(false);

  // Recalculate cost_price when extra costs change
  useEffect(() => {
    if (!formDataItemList || formDataItemList.length === 0) return;

    const extraCost = (formData.pmstr_incst || 0) + (formData.pmstr_excst || 0);

    // Calculate grand total of all items (before extra cost distribution)
    const grandTotal = formDataItemList.reduce(
      (sum, item) => sum + Number(item.pmstr_pyamt || 0),
      0
    );

    if (grandTotal === 0) return;

    // Update each item's cost_price with distributed extra cost
    const updatedItems = formDataItemList.map((item) => {
      // Calculate base cost price (without extra cost)
      const baseCostPrice = item.recpt_itamt / item.recpt_bkqty;

      // Calculate this item's share of extra cost (proportional to its total_amount)
      const extraCostShare = (item.recpt_itamt / grandTotal) * extraCost;

      // Calculate final cost price per unit
      const finalCostPrice = baseCostPrice + extraCostShare / item.recpt_bkqty;

      return {
        ...item,
        bking_csrat: finalCostPrice,
      };
    });

    // Only update if there's an actual change to avoid infinite loops
    const hasChanged = updatedItems.some(
      (item, index) => item.bking_csrat !== formDataItemList[index].bking_csrat
    );

    if (hasChanged) {
      setFormDataItemList(updatedItems);
    }
  }, [formData?.pmstr_incst, formData?.pmstr_excst, formDataItemList.length]);


  

  const items_iname_BT = (rowData) => {
    return `${rowData.items_icode} - ${rowData.items_iname}`;
  };

  const items_iname_FT = () => {
    return (
      <>
        <span>{formDataItemList.length} Items </span>
        {editingRows.length > 0 && (
          <span className="text-red-400">{editingRows.length} Editing</span>
        )}
      </>
    );
  };

  const recpt_bkrat_BT = (rowData) => {
    const formattedPrice = Number(rowData.recpt_bkrat).toFixed(2);
    const formattedCostPrice = Number(rowData.recpt_csrat).toFixed(2);
    return (
      <>
        {formattedPrice}{" "}
        <span className="text-sm text-gray-500">({formattedCostPrice})</span>
      </>
    );
  };

  const recpt_bkqty_BT = (rowData) => {
    return (
      <>
        {Number(rowData.recpt_bkqty).toFixed(2)}{" "}
        <span className="text-gray-600">{rowData.puofm_untnm}</span>
      </>
    );
  };

  const recpt_bkqty_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.recpt_bkqty || 0), 0)
      .toFixed(2);
  };

  const recpt_dspct_BT = (rowData) => {
    const formattedDiscount = Number(rowData.recpt_dsamt).toFixed(2);
    const formattedDiscountPercent = Number(rowData.recpt_dspct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.recpt_dsamt}
        text={`${formattedDiscount} (${formattedDiscountPercent}%)`}
      />
    );
  };

  const recpt_dspct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.recpt_dsamt || 0), 0)
      .toFixed(2);
  };

  const recpt_vtpct_BT = (rowData) => {
    const formattedVat = Number(rowData.recpt_vtamt).toFixed(2);
    const formattedVatPercent = Number(rowData.recpt_vtpct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.bking_vtamt}
        text={`${formattedVat} (${formattedVatPercent}%)`}
      />
    );
  };

  const recpt_vtpct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.recpt_vtamt || 0), 0)
      .toFixed(2);
  };

  const recpt_ntamt_BT = (rowData) => {
    return Number(rowData.recpt_ntamt).toFixed(2);
  };

  const amount = formDataItemList
    .reduce((sum, item) => sum + Number(item.recpt_itamt || 0), 0)
    .toFixed(2);

  const netAmount = formDataItemList
    .reduce((sum, item) => sum + Number(item.recpt_ntamt || 0), 0)
    .toFixed(2);
  const recpt_ntamt_FT = () => {
    return (
      <>
        {netAmount}
        {showExtraColumns ? (
          <span className="text-gray-500"> ({amount})</span>
        ) : null}
      </>
    );
  };

  const bulk_BT = (rowData) => {
    return (
      <ConvertedQtyComponent
        qty={rowData.recpt_bkqty}
        dfQty={rowData.items_dfqty}
        pname={rowData.puofm_untnm}
        sname={rowData.suofm_untnm}
      />
    );
  };

  const recpt_rtqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.recpt_rtqty} text={rowData.recpt_rtqty} />
    );
  };

  const recpt_slqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.recpt_slqty} text={rowData.recpt_slqty} />
    );
  };

  const recpt_ohqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.recpt_ohqty} text={rowData.recpt_ohqty} />
    );
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete item "${rowData.items_iname}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setFormDataItemList((prev) =>
          prev.filter((item) => item.id !== rowData.id)
        );
      },
      reject: () => {},
    });
  };

  const rowEditor_HT = () => (
    <span
      className={`pi ${
        showExtraColumns ? "pi-eye-slash text-red-300" : "pi-eye text-gray-300"
      }  px-2 hover:text-gray-500 cursor-pointer`}
      onClick={() => setShowExtraColumns((prev) => !prev)}
    />
  );

  const action_BT = (rowData) => {
    return (
      <span
        className="pi pi-trash text-red-600 text-bold px-2 hover:text-red-500 cursor-pointer"
        onClick={() => handleDelete(rowData)}
      ></span>
    );
  };

  const numberEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        style={{ minWidth: "40px", padding: "3px" }}
        inputStyle={{ width: "80%", padding: "3px" }}
        min={1}
      />
    );
  };
  const textEditor = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        style={{ minWidth: "40px", padding: "3px" }}
        inputStyle={{ width: "80%", padding: "3px" }}
      />
    );
  };

  const onRowEditSave = (event) => {
    let { newData, index } = event;
    // Calculate item_amount
    //console.log("onRowEditSave", newData);
    if(Number(newData.recpt_bkqty) > Number(newData.recpt_ohqty)){
      alert("Receipt quantity cannot be greater than Booking quantity");
      setEditingRows([]);
      return;
    }

    const itemAmount = newData.recpt_bkqty * newData.recpt_bkrat;
    const discountAmount = (newData.recpt_dspct / 100) * itemAmount;
    const vatAmount = (newData.recpt_vtpct / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / newData.recpt_bkqty;

    newData.recpt_itamt = itemAmount;
    newData.recpt_dsamt = discountAmount;
    newData.recpt_vtamt = vatAmount;
    newData.recpt_csrat = costPrice;
    newData.recpt_ntamt = totalAmount;

    newData.recpt_rtqty = 0;
    newData.recpt_slqty = 0;
    newData.recpt_ohqty = newData.recpt_bkqty;

    let _localItems = [...formDataItemList];
    _localItems[index] = newData;
    setFormDataItemList(_localItems);
    setEditingRows([]);
  };

  const onRowEditCancel = (event) => {
    setEditingRows([]);
  };
  const onRowEditInit = (event) => {
    setEditingRows([event.data.id]);
  };

  const dataTable_FT = () => {
    return <ConvertedBDTCurrency value={netAmount} asWords={true} />;
  };

  return (
    <div className="mt-4">
      <ConfirmDialog />  

      <DataTable
        value={formDataItemList}
        editMode={formData.edit_stop ? null : "row"}
        dataKey="id"
        editingRows={editingRows}
        onRowEditSave={onRowEditSave}
        onRowEditCancel={onRowEditCancel}
        onRowEditInit={onRowEditInit}
        emptyMessage="No items added yet."
        size="small"
        className="shadow-1"
        showGridlines
        footer={dataTable_FT}
      >
        <Column
          field="items_iname"
          header="Item"
          body={items_iname_BT}
          footer={items_iname_FT}
        />
        <Column
          field="recpt_bkrat"
          header="Price"
          body={recpt_bkrat_BT}
          //editor={numberEditor}
        />
        <Column
          field="recpt_bkqty"
          header="Qty"
          body={recpt_bkqty_BT}
          footer={recpt_bkqty_FT}
          editor={numberEditor}
        />
        <Column
          field="recpt_itamt"
          header="Amount"
          headerStyle={{ backgroundColor: "#49769bff" }}
          footer={amount}
          hidden={!showExtraColumns}
        />
        <Column
          field="recpt_dspct"
          header="Discount"
          body={recpt_dspct_BT}
          footer={recpt_dspct_FT}
        />
        <Column
          field="recpt_vtpct"
          header="VAT"
          body={recpt_vtpct_BT}
          footer={recpt_vtpct_FT}
        />
        <Column
          field="recpt_ntamt"
          header="Sub Total"
          body={recpt_ntamt_BT}
          footer={recpt_ntamt_FT}
        />
        <Column field="recpt_notes" header="Remarks" editor={textEditor} />
        <Column header="Bulk" body={bulk_BT} />
        <Column
          field="recpt_rtqty"
          header="Returned"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={recpt_rtqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="recpt_slqty"
          header="Sales"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={recpt_slqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="recpt_ohqty"
          header="Line Stock"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={recpt_ohqty_BT}
          hidden={!showExtraColumns}
        />
        {!formData.edit_stop && (
          <Column
            header={rowEditor_HT()}
            rowEditor
            headerStyle={{ minWidth: "20px" }}
          />
        )}
        {!formData.edit_stop && (
          <Column header="#" body={action_BT} style={{ width: "20px" }} />
        )}
      </DataTable>
    </div>
  );
};

export default ItemsComp;
