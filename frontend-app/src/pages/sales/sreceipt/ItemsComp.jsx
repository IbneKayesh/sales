import { useEffect, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import ConvertedBDTCurrency from "@/components/ConvertedBDTCurrency";
import ZeroRowCell from "@/components/ZeroRowCell";
import { parseAttributes } from "@/utils/jsonParser";

const ItemsComp = ({
  formData,
  formDataItemList,
  setFormDataItemList,
}) => {
  const [editingRows, setEditingRows] = useState([]);
  const [showExtraColumns, setShowExtraColumns] = useState(false);

  // Recalculate cost_price when extra costs change
  useEffect(() => {
    if (!formDataItemList || formDataItemList.length === 0) return;

    const extraCost =
      Number(formData.mrcpt_incst || 0) + Number(formData.mrcpt_excst || 0);

    // Calculate grand total qty of all items (before extra cost distribution)
    const grandTotalQty = formDataItemList.reduce(
      (sum, item) => sum + Number(item.crcpt_itqty || 0),
      0,
    );

    if (grandTotalQty === 0) return;

    // Calculate average extra cost per qty
    const avgExtraCostPerQty = extraCost / grandTotalQty;

    // Update each item's cost_price with distributed extra cost
    const updatedItems = formDataItemList.map((item) => {
      // Calculate base cost price (without extra cost)
      const baseCostPrice = Number(item.crcpt_itrat || 0);

      // Calculate extra cost per unit based on qty-weighted average
      const extraCostPerUnit = avgExtraCostPerQty;

      // Calculate final cost price per unit
      const finalCostPrice = baseCostPrice + extraCostPerUnit;

      return {
        ...item,
        crcpt_csrat: finalCostPrice,
      };
    });

    // Only update if there's an actual change to avoid infinite loops
    const hasChanged = updatedItems.some(
      (item, index) =>
        Number(item.crcpt_csrat) !==
        Number(formDataItemList[index].crcpt_csrat),
    );

    if (hasChanged) {
      setFormDataItemList(updatedItems);
    }
  }, [formData?.mrcpt_incst, formData?.mrcpt_excst, formDataItemList.length]);

  const items_iname_BT = (rowData) => {
    const parsedAttr = parseAttributes(rowData.crcpt_attrb);

    return (
      <div className="flex flex-column">
        {/* {JSON.stringify(rowData)} */}
        <span className="text-md">{`${rowData.items_icode} - ${rowData.items_iname}`}</span>
        {Object.keys(parsedAttr).length > 0 && (
          <span className="text-gray-500 text-sm">
            {Object.entries(parsedAttr)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </span>
        )}
      </div>
    );
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

  const crcpt_itrat_BT = (rowData) => {
    const formattedPrice = Number(rowData.crcpt_itrat).toFixed(2);
    const formattedCostPrice = Number(rowData.crcpt_csrat).toFixed(2);
    return (
      <>
        {formattedPrice}{" "}
        <span className="text-sm text-gray-500">({formattedCostPrice})</span>
      </>
    );
  };

  const crcpt_itqty_BT = (rowData) => {
    return (
      <>
        {Number(rowData.crcpt_itqty).toFixed(2)}{" "}
        <span className="text-gray-600">{rowData.puofm_untnm}</span>
      </>
    );
  };

  const crcpt_itqty_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.crcpt_itqty || 0), 0)
      .toFixed(2);
  };

  const crcpt_dspct_BT = (rowData) => {
    const formattedDiscount = Number(rowData.crcpt_dsamt).toFixed(2);
    const formattedDiscountPercent = Number(rowData.crcpt_dspct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.crcpt_dsamt}
        text={`${formattedDiscount} (${formattedDiscountPercent}%)`}
      />
    );
  };

  const crcpt_dspct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.crcpt_dsamt || 0), 0)
      .toFixed(2);
  };

  const crcpt_vtpct_BT = (rowData) => {
    const formattedVat = Number(rowData.crcpt_vtamt).toFixed(2);
    const formattedVatPercent = Number(rowData.crcpt_vtpct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.crcpt_vtamt}
        text={`${formattedVat} (${formattedVatPercent}%)`}
      />
    );
  };

  const crcpt_vtpct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.crcpt_vtamt || 0), 0)
      .toFixed(2);
  };

  const crcpt_ntamt_BT = (rowData) => {
    return Number(rowData.crcpt_ntamt).toFixed(2);
  };

  const amount = formDataItemList
    .reduce((sum, item) => sum + Number(item.crcpt_itamt || 0), 0)
    .toFixed(2);

  const netAmount = formDataItemList
    .reduce((sum, item) => sum + Number(item.crcpt_ntamt || 0), 0)
    .toFixed(2);

  const crcpt_ntamt_FT = () => {
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
      <>
        <ConvertedQtyComponent
          qty={rowData.crcpt_itqty}
          dfQty={rowData.items_dfqty}
          pname={rowData.puofm_untnm}
          sname={rowData.suofm_untnm}
        />
      </>
    );
  };

  const crcpt_rtqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.crcpt_rtqty} text={rowData.crcpt_rtqty} />
    );
  };

  const crcpt_slqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.crcpt_slqty} text={rowData.crcpt_slqty} />
    );
  };

  const crcpt_ohqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.crcpt_ohqty} text={rowData.crcpt_ohqty} />
    );
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete item "${rowData.items_iname}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setFormDataItemList((prev) =>
          prev.filter((item) => item.id !== rowData.id),
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
        min={0}
        minFractionDigits={2}
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
    let dsp = Number(newData.crcpt_dspct || 0);
    if (dsp < 0) dsp = 0;
    if (dsp > 100) dsp = 100;
    let vtp = Number(newData.crcpt_vtpct || 0);
    if (vtp < 0) vtp = 0;
    if (vtp > 1000) vtp = 100;

    const itemAmount = newData.crcpt_itqty * newData.crcpt_itrat;
    const discountAmount = (dsp / 100) * itemAmount;
    const vatAmount = (vtp / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / newData.crcpt_itqty;

    newData.crcpt_dspct = dsp;
    newData.crcpt_vtpct = vtp;

    newData.crcpt_itamt = itemAmount;
    newData.crcpt_dsamt = discountAmount;
    newData.crcpt_vtamt = vatAmount;
    newData.crcpt_csrat = costPrice;
    newData.crcpt_ntamt = totalAmount;

    newData.crcpt_rtqty = 0;
    newData.crcpt_slqty = 0;
    newData.crcpt_ohqty = newData.crcpt_itqty;

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
          field="crcpt_itrat"
          header="Price"
          body={crcpt_itrat_BT}
          editor={numberEditor}
        />
        <Column
          field="crcpt_itqty"
          header="Qty"
          body={crcpt_itqty_BT}
          footer={crcpt_itqty_FT}
          editor={numberEditor}
        />
        <Column
          field="crcpt_itamt"
          header="Amount"
          headerStyle={{ backgroundColor: "#49769bff" }}
          footer={amount}
          hidden={!showExtraColumns}
        />
        <Column
          field="crcpt_dspct"
          header="Discount"
          body={crcpt_dspct_BT}
          footer={crcpt_dspct_FT}
          editor={numberEditor}
        />
        <Column
          field="crcpt_vtpct"
          header="VAT"
          body={crcpt_vtpct_BT}
          footer={crcpt_vtpct_FT}
          editor={numberEditor}
        />
        <Column
          field="crcpt_ntamt"
          header="Sub Total"
          body={crcpt_ntamt_BT}
          footer={crcpt_ntamt_FT}
        />
        <Column field="crcpt_notes" header="Remarks" editor={textEditor} />
        <Column header="Bulk" body={bulk_BT} />
        <Column
          field="crcpt_rtqty"
          header="Returned"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={crcpt_rtqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="crcpt_slqty"
          header="Sales"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={crcpt_slqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="crcpt_ohqty"
          header="Stock"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={crcpt_ohqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          header={rowEditor_HT()}
          rowEditor
          headerStyle={{ minWidth: "20px" }}
        />
        {!formData.edit_stop && (
          <Column header="#" body={action_BT} style={{ width: "20px" }} />
        )}
      </DataTable>
    </div>
  );
};

export default ItemsComp;
