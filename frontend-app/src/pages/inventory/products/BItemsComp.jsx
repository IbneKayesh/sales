import { Chip } from "primereact/chip";
import { useBusiness } from "@/hooks/auth/useBusiness";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActiveRowCell from "@/components/ActiveRowCell";

const BItemsComp = ({ onFetchBusinessItems, dataList }) => {
  const { dataList: businessOptions } = useBusiness();
  const [selBusinessId, setSelBusinessId] = useState(null);

  const handleSelectBusiness = (id) => {
    setSelBusinessId(id);
    onFetchBusinessItems(id);
  };

  const action_BT = (rowData) => {
    return (
      <span
        className={`pi ${
          rowData.bitem_actve
            ? "pi-check-circle text-green-500"
            : "pi-times-circle text-red-500"
        }`}
      ></span>
    );
  };

  const items_iname_BT = (rowData) => {
    return (
      <>
        <ActiveRowCell
          text={rowData.items_iname}
          status={rowData.bitem_actve}
        />
        <span className="text-sm text-gray-600 ml-1">
          {rowData.items_idesc}
        </span>
      </>
    );
  };

  return (
    <>
      <div className="flex flex-wrap">
        {businessOptions.map((business) => (
          <Chip
            key={business.id}
            label={business.bsins_bname}
            icon="pi pi-home"
            className={
              selBusinessId === business.id
                ? "bg-gray-800 text-white mr-2"
                : "bg-gray-300 text-gray-600 mr-2"
            }
            value={business.bsins_bname}
            style={{ cursor: "pointer" }}
            onClick={() => handleSelectBusiness(business.id)}
          />
        ))}
      </div>
      <div className={`p-1 ${dataList?.length > 0 ? "" : "hidden"}`}>
        <DataTable
          value={dataList}
          paginator
          rows={15}
          rowsPerPageOptions={[15, 50, 100]}
          emptyMessage="No data found."
          size="small"
          rowHover
          showGridlines
        >
          <Column
            field="items_iname"
            header="Name"
            body={items_iname_BT}
            sortable
          />
          <Column field="bitem_lprat" header="Purchase Rate" sortable />
          <Column field="bitem_dprat" header="Distributor Rate" sortable />
          <Column field="bitem_mcmrp" header="MRP" sortable />
          <Column field="bitem_sddsp" header="Discount %" sortable />
          <Column field="bitem_snote" header="Note" sortable />
          <Column field="bitem_gstkq" header="Good Stock" sortable />
          <Column field="bitem_bstkq" header="Bad Stock" sortable />
          <Column field="bitem_mnqty" header="Minimum Stock" sortable />
          <Column field="bitem_mxqty" header="Maximum Stock" sortable />
          <Column field="bitem_pbqty" header="Purchase Booking" sortable />
          <Column field="bitem_sbqty" header="Sales Booking" sortable />
          <Column field="bitem_mpric" header="Margin Price" sortable />
          <Column header={dataList?.length + " rows"} body={action_BT} />
        </DataTable>
      </div>
    </>
  );
};

export default BItemsComp;
