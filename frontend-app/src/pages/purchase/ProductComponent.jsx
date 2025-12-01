import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { useProducts } from "@/hooks/inventory/useProducts";

const ProductComponent = ({
    formDataOrderItems,
    setFormDataOrderItems,
    editingRows,
    setEditingRows,
}) => {
    const { productList } = useProducts();
    const [selectedItem, setSelectedItem] = useState({});
    const [itemQty, setItemQty] = useState(1);
    const [itemNote, setItemNote] = useState("");
    const [disabledItemAdd, setDisabledItemAdd] = useState(false);

    const handleAddItem = () => {
        if (!selectedItem) return;

        // Check if item is already added
        const existingItem = formDataOrderItems.find(
            (i) => i.product_id === selectedItem
        );
        if (existingItem) {
            // Item already exists, do not add duplicate
            setSelectedItem(null);
            return;
        }

        const item = itemsPurchase.find((i) => i.product_id === selectedItem);
        if (!item) return;

        const newRow = {
            po_details_id: generateGuid(), // Temporary ID for new items
            po_master_id: "sgd",
            product_id: selectedItem,
            product_name: item.product_name,
            product_price: item.product_price,
            product_qty: itemQty || 1,
            discount_percent: 0,
            discount_amount: 0,
            tax_percent: 0,
            tax_amount: 0,
            cost_price: item.product_price,
            total_amount: item.product_price * itemQty || 1, // Will be re-calculated on edit save,
            product_note: itemNote,
            ref_id: "",
            unit_difference_qty: item.unit_difference_qty,
            small_unit_name: item.small_unit_name,
            large_unit_name: item.large_unit_name,
            ismodified: 1, // Flag for new items
        };

        setFormDataOrderItems([...formDataOrderItems, newRow]);
        setSelectedItem(null);
        setItemQty(1);
    };


    const onRowEditSave = (event) => {
        let { newData, index } = event;
        // Calculate item_amount

        const discountAmount = newData.discount_amount;

        const itemAmount = newData.product_price * newData.product_qty;
        newData.total_amount = itemAmount - discountAmount;

        const discountPercent =
            itemAmount > 0
                ? Math.round((discountAmount / itemAmount) * 100 * 100) / 100
                : 0;
        newData.discount_percent = discountPercent;

        //cost rate will calculate by Effect
        // newData.cost_rate =
        //   (newData.discount_amount / newData.booking_qty || 0) + newData.item_rate;

        newData.ismodified = 1;

        let _localItems = [...formDataOrderItems];
        _localItems[index] = newData;
        setFormDataOrderItems(_localItems);
        setEditingRows([]);
    };

    const onRowEditCancel = (event) => {
        setEditingRows([]);
    };

    const onRowEditInit = (event) => {
        setEditingRows([event.data.id]);
    };

    const itemRateTemplate = (rowData) => {
        const formattedItemRate = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "BDT",
        }).format(rowData.product_price);
        const formattedCostRate = Number(rowData.cost_price).toFixed(2);
        return `${formattedItemRate} (${formattedCostRate})`;
    };

    const itemRateEditor = (options) => {
        return (
            <InputNumber
                value={options.value}
                onValueChange={(e) => options.editorCallback(e.value)}
                mode="currency"
                currency="BDT"
                locale="en-US"
                style={{ width: "120px" }}
                inputStyle={{ width: "100%" }}
            />
        );
    };
    return (
        <>
            {/* Child Editable Table */}
            <div className="flex align-items-center gap-2 mb-2">
                <Dropdown
                    value={selectedItem}
                    options={productList.map((item) => ({
                        label: item.product_name,
                        value: item.product_id,
                    }))}
                    onChange={(e) => setSelectedItem(e.value)}
                    placeholder="Select Item"
                    optionLabel="label"
                    optionValue="value"
                    className="w-full"
                    filter
                    showClear
                />
                <InputNumber
                    name="itemQty"
                    value={itemQty}
                    onValueChange={(e) => setItemQty(e.value)}
                    placeholder="Enter Qty"
                />
                <InputText
                    name="itemNote"
                    value={itemNote}
                    onChange={(e) => setItemNote(e.target.value)}
                    placeholder="Note"
                />
                <Button
                    label="Add"
                    icon="pi pi-plus"
                    onClick={handleAddItem}
                    size="small"
                    severity="info"
                    className="pr-5"
                    disabled={disabledItemAdd}
                />
            </div>
            <DataTable
                value={formDataOrderItems}
                editMode="row"
                dataKey="id"
                editingRows={editingRows}
                onRowEditSave={onRowEditSave}
                onRowEditCancel={onRowEditCancel}
                onRowEditInit={onRowEditInit}
                emptyMessage="No items found."
                className="bg-dark-300"
                size="small"
            >
                <Column
                    field="item_name"
                    header="Item Name"
                    footer={
                        <>
                            {formDataOrderItems.length} Items, {editingRows.length} Editing
                        </>
                    }
                />
                <Column
                    field="item_rate"
                    header="Rate"
                    body={itemRateTemplate}
                    editor={itemRateEditor}
                />
                <Column
                    field="product_qty"
                    header="Qty"
                    body={productQtyTemplate}
                    editor={numberEditor}
                    footer={totalProductQtyTemplate}
                />
                <Column
                    field="discount_amount"
                    header="Discount"
                    body={discountAmountTemplate}
                    editor={itemRateEditor}
                    footer={discountAmountFooterTemplate}
                />
                <Column
                    field="item_amount"
                    header="Amount"
                    body={itemAmountTemplate}
                    footer={itemAmountFooterTemplate}
                />
                <Column header="Bulk" body={convertedQtyTemplate} />
                <Column field="item_note" header="Note" editor={textEditor} />
                <Column
                    rowEditor
                    headerStyle={{ width: "5%", minWidth: "8rem" }}
                    bodyStyle={{ textAlign: "center" }}
                />
                <Column
                    header="Actions"
                    body={actionTemplate}
                    style={{ width: "120px" }}
                />
            </DataTable>
        </>
    );
};
export default ProductComponent;
