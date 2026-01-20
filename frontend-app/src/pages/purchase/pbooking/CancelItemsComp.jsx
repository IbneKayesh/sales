import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useProductsSgd } from "@/hooks/inventory/useProductsSgd";
import { generateGuid } from "@/utils/guid";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import ConvertedBDTCurrency from "@/components/ConvertedBDTCurrency";
import ZeroRowCell from "@/components/ZeroRowCell";

const CancelItemsComp = ({ formData, formDataItemList, setFormDataItemList }) => {

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
      const baseCostPrice = item.bking_itamt / item.bking_bkqty;

      // Calculate this item's share of extra cost (proportional to its total_amount)
      const extraCostShare = (item.bking_itamt / grandTotal) * extraCost;

      // Calculate final cost price per unit
      const finalCostPrice = baseCostPrice + extraCostShare / item.bking_bkqty;

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

  const bking_bkrat_BT = (rowData) => {
    const formattedPrice = Number(rowData.bking_bkrat).toFixed(2);
    const formattedCostPrice = Number(rowData.bking_csrat).toFixed(2);
    return (
      <>
        {formattedPrice}{" "}
        <span className="text-sm text-gray-500">({formattedCostPrice})</span>
      </>
    );
  };

  const bking_bkqty_BT = (rowData) => {
    return (
      <>
        {Number(rowData.bking_bkqty).toFixed(2)}{" "}
        <span className="text-gray-600">{rowData.puofm_untnm}</span>
      </>
    );
  };

  const bking_bkqty_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.bking_bkqty || 0), 0)
      .toFixed(2);
  };

  const bking_dspct_BT = (rowData) => {
    const formattedDiscount = Number(rowData.bking_dsamt).toFixed(2);
    const formattedDiscountPercent = Number(rowData.bking_dspct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.bking_dsamt}
        text={`${formattedDiscount} (${formattedDiscountPercent}%)`}
      />
    );
  };

  const bking_dspct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.bking_dsamt || 0), 0)
      .toFixed(2);
  };

  const bking_vtpct_BT = (rowData) => {
    const formattedVat = Number(rowData.bking_vtamt).toFixed(2);
    const formattedVatPercent = Number(rowData.bking_vtpct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.bking_vtamt}
        text={`${formattedVat} (${formattedVatPercent}%)`}
      />
    );
  };

  const bking_vtpct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.bking_vtamt || 0), 0)
      .toFixed(2);
  };

  const bking_ntamt_BT = (rowData) => {
    return Number(rowData.bking_ntamt).toFixed(2);
  };

  const amount = formDataItemList
    .reduce((sum, item) => sum + Number(item.bking_itamt || 0), 0)
    .toFixed(2);

  const netAmount = formDataItemList
    .reduce((sum, item) => sum + Number(item.bking_ntamt || 0), 0)
    .toFixed(2);
  const bking_ntamt_FT = () => {
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
        qty={rowData.bking_bkqty}
        dfQty={rowData.items_dfqty}
        pname={rowData.puofm_untnm}
        sname={rowData.suofm_untnm}
      />
    );
  };

  const bitem_gstkq_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_gstkq} text={rowData.bitem_gstkq} />
    );
  };

  const bking_cnqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bking_cnqty} text={rowData.bking_cnqty} />
    );
  };

  const bking_rcqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bking_rcqty} text={rowData.bking_rcqty} />
    );
  };

  const bking_pnqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bking_pnqty} text={rowData.bking_pnqty} />
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
    let dsp = Number(newData.bking_dspct || 0);
    if(dsp < 0) dsp = 0;
    if(dsp > 100) dsp = 100;
    let vtp = Number(newData.bking_vtpct || 0);
    if(vtp < 0) vtp = 0;
    if(vtp > 1000) vtp = 100;

    const itemAmount = newData.bking_bkqty * newData.bking_bkrat;
    const discountAmount = (dsp / 100) * itemAmount;
    const vatAmount = (vtp / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / newData.bking_bkqty;

    newData.bking_dspct = dsp;
    newData.bking_vtpct = vtp;

    newData.bking_itamt = itemAmount;
    newData.bking_dsamt = discountAmount;
    newData.bking_vtamt = vatAmount;
    newData.bking_csrat = costPrice;
    newData.bking_ntamt = totalAmount;

    newData.bking_cnqty = 0;
    newData.bking_rcqty = 0;
    newData.bking_pnqty = newData.bking_bkqty;

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
          field="bking_bkrat"
          header="Price"
          body={bking_bkrat_BT}
          editor={numberEditor}
        />
        <Column
          field="bking_bkqty"
          header="Qty"
          body={bking_bkqty_BT}
          footer={bking_bkqty_FT}
          editor={numberEditor}
        />
        <Column
          field="bking_itamt"
          header="Amount"
          headerStyle={{ backgroundColor: "#49769bff" }}
          footer={amount}
          hidden={!showExtraColumns}
        />
        <Column
          field="bking_dspct"
          header="Discount"
          body={bking_dspct_BT}
          footer={bking_dspct_FT}
          editor={numberEditor}
        />
        <Column
          field="bking_vtpct"
          header="VAT"
          body={bking_vtpct_BT}
          footer={bking_vtpct_FT}
          editor={numberEditor}
        />
        <Column
          field="bking_ntamt"
          header="Sub Total"
          body={bking_ntamt_BT}
          footer={bking_ntamt_FT}
        />
        <Column field="bking_notes" header="Remarks" editor={textEditor} />
        <Column header="Bulk" body={bulk_BT} />
        <Column
          field="bitem_gstkq"
          header="Stock"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={bitem_gstkq_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="bking_cnqty"
          header="Cancelled"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={bking_cnqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="bking_rcqty"
          header="Invoice"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={bking_rcqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="bking_pnqty"
          header="Available"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={bking_pnqty_BT}
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

export default CancelItemsComp;
