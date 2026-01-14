import { Chip } from "primereact/chip";
import { useBusiness } from "@/hooks/auth/useBusiness";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActiveRowCell from "@/components/ActiveRowCell";
import ZeroRowCell from "@/components/ZeroRowCell";

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

  const bitem_lprat_BT = (rowData) => {
    return <ZeroRowCell value={rowData.bitem_lprat} text={rowData.bitem_lprat} />;
  };

  const bitem_dprat_BT = (rowData) => {
    return <ZeroRowCell value={rowData.bitem_dprat} text={rowData.bitem_dprat} />;
  };

  const bitem_mcmrp_BT = (rowData) => {
    return <ZeroRowCell value={rowData.bitem_mcmrp} text={rowData.bitem_mcmrp} />;
  };

  const bitem_sddsp_BT = (rowData) => {
    return <ZeroRowCell value={rowData.bitem_sddsp} text={rowData.bitem_sddsp} />;
  };

  const bitem_gstkq_BT = (rowData) => {
    return <ZeroRowCell value={rowData.bitem_gstkq} text={rowData.bitem_gstkq} />;
  };

  const bitem_bstkq_BT = (rowData) => {
    return <ZeroRowCell value={rowData.bitem_bstkq} text={rowData.bitem_bstkq} />;
  };

  const bitem_mnqty_BT = (rowData) => {
    return <ZeroRowCell value={rowData.bitem_mnqty} text={rowData.bitem_mnqty} />;
  };

  const bitem_mxqty_BT = (rowData) => {
    return <ZeroRowCell value={rowData.bitem_mxqty} text={rowData.bitem_mxqty} />;
  };

  const bitem_pbqty_BT = (rowData) => {
    return <ZeroRowCell value={rowData.bitem_pbqty} text={rowData.bitem_pbqty} />;
  };

  const bitem_sbqty_BT = (rowData) => {
    return <ZeroRowCell value={rowData.bitem_sbqty} text={rowData.bitem_sbqty} />;
  };

  const bitem_mpric_BT = (rowData) => {
    return <ZeroRowCell value={rowData.bitem_mpric} text={rowData.bitem_mpric} />;
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
          <Column field="bitem_lprat" header="Purchase Rate" sortable body={bitem_lprat_BT} />
          <Column field="bitem_dprat" header="Distributor Rate" sortable body={bitem_dprat_BT}/>
          <Column field="bitem_mcmrp" header="MRP" sortable body={bitem_mcmrp_BT}/>
          <Column field="bitem_sddsp" header="Discount %" sortable body={bitem_sddsp_BT}/>
          <Column field="bitem_snote" header="Note" sortable/>
          <Column field="bitem_gstkq" header="Good Stock" sortable body={bitem_gstkq_BT} />
          <Column field="bitem_bstkq" header="Bad Stock" sortable body={bitem_bstkq_BT} />
          <Column field="bitem_mnqty" header="Minimum Stock" sortable body={bitem_mnqty_BT} />
          <Column field="bitem_mxqty" header="Maximum Stock" sortable body={bitem_mxqty_BT} />
          <Column field="bitem_pbqty" header="Purchase Booking" sortable body={bitem_pbqty_BT} />
          <Column field="bitem_sbqty" header="Sales Booking" sortable body={bitem_sbqty_BT} />
          <Column field="bitem_mpric" header="Margin Price" sortable body={bitem_mpric_BT} />
          <Column header={dataList?.length + " rows"} body={action_BT} />
        </DataTable>
      </div>
    </>
  );
};

export default BItemsComp;
