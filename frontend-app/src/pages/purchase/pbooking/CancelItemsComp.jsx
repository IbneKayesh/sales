import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import ConvertedBDTCurrency from "@/components/ConvertedBDTCurrency";
import ZeroRowCell from "@/components/ZeroRowCell";
import { Dialog } from "primereact/dialog";

const CancelItemsComp = ({
  visible,
  onHide,
  formData,
  formDataItemList,
  cancelledRows,
  setCancelledRows,
  onCancelBookingItems,
  setCancelledPayment,
}) => {
  useEffect(() => {
    const _cancelledRows = formDataItemList
      .filter((item) => item.bking_pnqty > 0)
      .map((item) => {
        const itemAmount = item.bking_pnqty * item.bking_bkrat;
        const discountAmount = (item.bking_dspct / 100) * itemAmount;
        const vatAmount = (item.bking_vtpct / 100) * itemAmount;
        const totalAmount = itemAmount - discountAmount + vatAmount;

        return {
          ...item,
          bking_bkqty: item.bking_pnqty,
          bking_itamt: itemAmount,
          bking_dsamt: discountAmount,
          bking_vtamt: vatAmount,
          bking_ntamt: totalAmount,
          bking_cnqty: item.bking_pnqty,
          bking_pnqty: 0,
        };
      });

    //console.log(_cancelledRows);
    setCancelledRows(_cancelledRows);
  }, [formDataItemList]);

  const items_iname_BT = (rowData) => {
    return `${rowData.items_icode} - ${rowData.items_iname}`;
  };

  const items_iname_FT = () => {
    return (
      <>
        <span>{cancelledRows.length} Items </span>
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
    return cancelledRows
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
    return cancelledRows
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
    return cancelledRows
      .reduce((sum, item) => sum + Number(item.bking_vtamt || 0), 0)
      .toFixed(2);
  };

  const bking_ntamt_BT = (rowData) => {
    return Number(rowData.bking_ntamt).toFixed(2);
  };

  const amount = cancelledRows
    .reduce((sum, item) => sum + Number(item.bking_itamt || 0), 0)
    .toFixed(2);

  const netAmount = cancelledRows
    .reduce((sum, item) => sum + Number(item.bking_ntamt || 0), 0)
    .toFixed(2);
  const bking_ntamt_FT = () => {
    return netAmount;
  };

  const dataTable_FT = () => {
    return <ConvertedBDTCurrency value={netAmount} asWords={true} />;
  };

  const cancelledAmount = formData.pmstr_vatpy ? netAmount : amount;
  const refundAmount =
    Number(formData.pmstr_pyamt) -
    Number(cancelledAmount) -
    Number(formData.pmstr_pdamt);

  const handleCancelBookingItems = () => {
    const refundFormData = {
      id: "",
      rcvpy_users: "",
      rcvpy_bsins: "",
      rcvpy_cntct: "",
      rcvpy_pymod: "Refund",
      rcvpy_trdat: new Date().toISOString().split("T")[0],
      rcvpy_refno: "",
      rcvpy_srcnm: formData.pmstr_odtyp,
      rcvpy_notes: "",
      rcvpy_pyamt: refundAmount,
    };
    setCancelledPayment(refundFormData);
    onCancelBookingItems(refundFormData);
  };

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 no-print">
      <Button
        label="Close"
        icon="pi pi-times"
        onClick={onHide}
        severity="secondary"
      />
      <Button
        label="Cancel Booking"
        icon="pi pi-save"
        onClick={() => handleCancelBookingItems()}
        severity="danger"
        raised
        disabled={cancelledRows.length === 0}
      />
    </div>
  );

  return (
    <Dialog
      header={"Cancel Booking Items"}
      visible={visible}
      onHide={onHide}
      footer={dialogFooter}
      style={{ width: "50%" }}
      contentStyle={{ padding: "2rem" }}
      closable={false}
    >
      <div>
        <DataTable
          value={cancelledRows}
          dataKey="id"
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
          <Column field="bking_bkrat" header="Price" body={bking_bkrat_BT} />
          <Column
            field="bking_bkqty"
            header="Qty"
            body={bking_bkqty_BT}
            footer={bking_bkqty_FT}
          />
          <Column field="bking_itamt" header="Amount" footer={amount} />
          <Column
            field="bking_dspct"
            header="Discount"
            body={bking_dspct_BT}
            footer={bking_dspct_FT}
          />
          <Column
            field="bking_vtpct"
            header="VAT"
            body={bking_vtpct_BT}
            footer={bking_vtpct_FT}
          />
          <Column
            field="bking_ntamt"
            header="Sub Total"
            body={bking_ntamt_BT}
            footer={bking_ntamt_FT}
          />
        </DataTable>
        <div className="surface-card p-4 shadow-2 border-round-lg border-left-4 border-primary mt-3">
          <div className="flex align-items-center justify-content-between mb-3">
            <span className="text-xl font-semibold text-900">
              Payment Summary
            </span>
            <i className="pi pi-wallet text-primary text-xl"></i>
          </div>

          <div className="flex flex-column gap-3">
            <div className="flex justify-content-between">
              <span className="text-600">Booking</span>
              <span className="font-bold text-900">{formData.pmstr_pyamt}</span>
            </div>

            <div className="flex justify-content-between">
              <span className="text-600">Payment</span>
              <span className="font-bold text-900">{formData.pmstr_pdamt}</span>
            </div>

            <div className="border-top-1 surface-border my-2"></div>

            <div className="flex justify-content-between">
              <span className="font-semibold text-700">Cancel Amount</span>
              <span className="font-bold text-red-500">{cancelledAmount}</span>
            </div>
            <div className="flex justify-content-between">
              <span className="font-semibold text-700">Refund Amount</span>
              <span className="font-bold text-red-500">{refundAmount}</span>
            </div>
            <span className="text-red-500 text-sm">
              * Additional payment will be refunded
            </span>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CancelItemsComp;
