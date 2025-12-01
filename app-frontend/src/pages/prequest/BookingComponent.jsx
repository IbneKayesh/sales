import React, { useState, useEffect, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { generateGuid } from "@/utils/guid";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import ConvertedBDTCurrency from "@/components/ConvertedBDTCurrency";
import t_po_master from "@/models/prequest/t_po_master.json"; 
import { useItems } from "@/hooks/inventory/useItems";
import { Accordion, AccordionTab } from "primereact/accordion";

const BookingComponent = ({
  isBusy,
  errors,
  setErrors,
  formData,
  setFormData,
  onChange,
  orderChildItems,
  setOrderChildItems,
  onSaveAll,
  formDataPaymentList,
  setFormDataPaymentList,
  paymentOptions,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);


  //find order summary
  useEffect(() => {
    const order_amount = orderChildItems?.reduce(
      (total, row) => total + (row.booking_qty || 0) * (row.item_rate || 0),
      0
    );
    const discount_amount = orderChildItems?.reduce(
      (total, row) => total + (row.discount_amount || 0),
      0
    );
    const total_amount = orderChildItems?.reduce(
      (total, row) => total + (row.item_amount || 0),
      0
    );

    const net_amount = (formData.cost_amount || 0) + total_amount;
    //console.log("net_amount " + net_amount);

    const paid_amount = formDataPaymentList
      ?.filter((row) => row.payment_type === formData.order_type)
      ?.reduce((total, row) => total + (row.payment_amount || 0), 0);

    const due_amount = net_amount - paid_amount;

    setFormData((prev) => ({
      ...prev,
      order_amount,
      discount_amount,
      total_amount: net_amount,
      paid_amount,
      due_amount,
    }));
  }, [orderChildItems, formDataPaymentList]);

  //find item wise costing rate
  const costRate = useMemo(() => {
    const totalBookingQty = orderChildItems.reduce(
      (sum, item) => sum + (item.booking_qty || 0),
      0
    );
    const discountAmount = orderChildItems.reduce(
      (sum, item) => sum + (item.discount_amount || 0),
      0
    );
    const otherCostAmount = formData.other_cost > 0 ? formData.other_cost : 0;
    const extraCostAmount = formData.cost_amount > 0 ? formData.cost_amount : 0;
    const total_cost = otherCostAmount + extraCostAmount;
    return (total_cost - discountAmount) / (totalBookingQty || 1);
  }, [orderChildItems, formData.other_cost, formData.cost_amount]);

  //update item wise costing rate
  useEffect(() => {
    //console.log("costRate " + costRate);
    setOrderChildItems((prevItems) =>
      prevItems.map((item) => {
        return {
          ...item,
          cost_rate: item.item_rate + costRate,
        };
      })
    );
  }, [costRate]);





  useEffect(() => {
    if (selectedItem) {
      setDisabledItemAdd(false);
    } else {
      setDisabledItemAdd(true);
    }
  }, [selectedItem]);

  useEffect(() => {
    handleFilterChange("allitems");
  }, []);



  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete item "${rowData.item_name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setOrderChildItems((prev) =>
          prev.filter((item) => item.id !== rowData.id)
        );
      },
      reject: () => {},
    });
  };



  const numberEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        style={{ width: "110px" }}
        inputStyle={{ width: "100%" }}
      />
    );
  };

  const textEditor = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        style={{ width: "110px" }}
        inputStyle={{ width: "100%" }}
      />
    );
  };

  const actionTemplate = (rowData) => {
    return (
      <span
        className="pi pi-trash text-red-600 text-bold px-2"
        onClick={() => handleDelete(rowData)}
      ></span>
    );
  };


  const bookingQtyTemplate = (rowData) => {
    return `${rowData.booking_qty} ${rowData.small_unit_name} (${rowData.order_qty})`;
  };

  const totalBookingQty = orderChildItems.reduce(
    (sum, item) => sum + (item.booking_qty || 0),
    0
  );

  const totalOrderQty = orderChildItems.reduce(
    (sum, item) => sum + (item.order_qty || 0),
    0
  );

  const totalBookingQtyTemplate = () => {
    return `${totalBookingQty} (${totalOrderQty})`;
  };

  const discountAmountTemplate = (rowData) => {
    const discountAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.discount_amount);

    return `${discountAmount} (${rowData.discount_percent}%)`;
  };

  const totalDiscountAmount = orderChildItems.reduce(
    (sum, item) => sum + (item.discount_amount || 0),
    0
  );

  const discountAmountFooterTemplate = (rowData) => {
    const discountAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(totalDiscountAmount);

    return `${discountAmount}`;
  };

  const itemAmountTemplate = (rowData) => {
    //console.log("rowData" + JSON.stringify(rowData))
    const itemAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.item_amount);

    const itemAmountF = rowData.item_rate * rowData.booking_qty;

    return `${itemAmount} (${itemAmountF})`;
  };

  const convertedQtyTemplate = (rowData) => {
    return (
      <>
        <ConvertedQtyComponent qty={rowData.booking_qty} rowData={rowData} /> (
        <ConvertedQtyComponent qty={rowData.order_qty} rowData={rowData} />)
      </>
    );
  };

  const totalItemAmount = orderChildItems.reduce(
    (sum, item) => sum + (item.item_amount || 0),
    0
  );

  const itemAmountFooterTemplate = () => {
    return <ConvertedBDTCurrency value={totalItemAmount} asWords={true} />;
  };

  const InvoiceHeader = () => {
    const contactName = contactsSupplier.find(
      (c) => c.value === formData.contact_id
    )?.label || <span className="text-red-500">No supplier selected</span>;

    const { order_no, order_date, is_posted } = formData;

    return (
      <span className="flex align-items-center gap-2 w-full">
        Invoice# {order_no}, Date# {order_date} for {contactName}
        {!is_posted && <span className="text-red-300">[Not posted]</span>}
      </span>
    );
  };

  const ProductsHeader = () => {
    return (
      <>
        <span className="flex align-items-center gap-2 w-full">
          Products# {orderChildItems.length}, Qty# {totalBookingQty}
        </span>
      </>
    );
  };

  const PaymentsHeader = () => {
    return (
      <>
        <span className="flex align-items-center gap-2 w-full">
          Total# {formData.total_amount} BDT, Paid#{" "}
          <span className="text-green-500">{formData.paid_amount}</span> BDT,
          Due#{" "}
          {formData.due_amount > 0 ? (
            <span className="text-red-500">{formData.due_amount}</span>
          ) : (
            <span className="text-green-500">{formData.due_amount}</span>
          )}{" "}
          BDT
        </span>
      </>
    );
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      {/* Master Form */}

      <Accordion multiple activeIndex={[0]}>
        <AccordionTab header={InvoiceHeader}>
          <div className="grid">


           
          </div>
        </AccordionTab>

        <AccordionTab header={ProductsHeader}>
 
        </AccordionTab>

        <AccordionTab header={PaymentsHeader}>
  


        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default BookingComponent;
