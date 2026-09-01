import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import { IconClose, IconCheck, IconActivity, IconChevronDown } from "@/icons";
import Dropdown from "@/components/Dropdown";
import NegativeValue from "@/components/common/NegativeValue";
import ConvertUOM from "@/components/common/ConvertUOM";

const ItemsList = ({
  cfColumns = [],
  listData,
  onEdit,
  onDelete,
  onPrice,
  //filter
  mcatg_Options,
  formData,
  onChange,
}) => {
  const dtColumns = [
    { key: "items_icode", header: "Code", width: "120px" },
    {
      key: "items_iname",
      header: "Item Name",
      width: "200px",
      body: (_, row) => {
        return (
          <span className={`${!row.items_actve && "text-red-500"}`}>
            {row.items_iname}
            {row.price_count > 0 && " "}
            {row.price_count > 0 && (
              <Chip
                variant={row.price_count > 0 ? "primary" : "secondary"}
                size="sm"
                style={{ marginLeft: "5px", fontWeight: 600 }}
              >
                {row.price_count} Price
              </Chip>
            )}
            {row.cntct_count > 0 && " "}
            {row.cntct_count > 0 && (
              <Chip
                variant={row.cntct_count > 0 ? "success" : "secondary"}
                size="sm"
                style={{ marginLeft: "5px", fontWeight: 600 }}
              >
                {row.cntct_count} Supplier
              </Chip>
            )}
          </span>
        );
      },
    },
    { key: "items_brcod", header: "Barcode", width: "80px" },
    { key: "items_hscod", header: "HS Code", width: "80px" },
    { key: "items_notes", header: "Notes", width: "80px" },
    {
      key: "items_szqty",
      header: "Size Unit",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {row.items_szqty} x {row.sunit_cname}
          </span>
        );
      },
    },
    {
      key: "runit_cname",
      header: "Unit",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {row.items_pkqty} x {row.runit_cname} = 1 {row.punit_cname}
          </span>
        );
      },
    },
    { key: "sgrup_cname", header: "Group", width: "80px" },
    { key: "items_itype", header: "Type", width: "80px" },
    { key: "scatg_cname", header: "Category", width: "80px" },
    { key: "brand_cname", header: "Brand", width: "80px" },
    {
      key: "items_tstck",
      header: "Track Stock",
      width: "80px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "items_smrgn",
      header: "Margin (%)",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.items_smrgn} />,
    },
    {
      key: "items_prvat",
      header: "Purchase VAT (%)",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.items_prvat} />,
    },
    { key: "items_ptvat", header: "Purchase VAT Type", width: "80px" },
    {
      key: "items_slvat",
      header: "Sales VAT (%)",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.items_slvat} />,
    },
    { key: "items_stvat", header: "Sales VAT Type", width: "80px" },
    {
      key: "items_stpur",
      header: "Stop Purchase",
      width: "80px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "items_stsal",
      header: "Stop Sale",
      width: "80px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "items_stnsf",
      header: "Stop Transfer",
      width: "80px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "items_stprc",
      header: "Stop Process",
      width: "80px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "price_gdstk",
      header: "Stock",
      width: "80px",
      body: (_, row) => {
        const lineStock = row.price_gdstk || 0 + row.price_bdstk || 0;
        return (
          <span className={`${lineStock > 0 && "text-green-500"}`}>
            {Number(row.price_gdstk).toFixed(2)} +{" "}
            {Number(row.price_bdstk).toFixed(2)} ={" "}
            {/* <NegativeValue value={Number(lineStock).toFixed(2)} /> */}
            <ConvertUOM
              qty={lineStock}
              dfQty={row.items_pkqty}
              pname={row.runit_cname}
              sname={row.punit_cname}
            />
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "150px",
      sortable: false,
      body: (_, row) => (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPrice(row);
            }}
            title="Price, Stock, Ledger"
          >
            <IconChevronDown size={14} />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.items_actve}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </>
      ),
    },
  ];
  return (
    <>
      <div className="grid mb-2">
        <div className="col-span-3">
          <Dropdown
            label="Category"
            options={mcatg_Options}
            value={formData.items_mcatg}
            onChange={(e) => onChange("items_mcatg", e.target.value)}
            //error={formErrors.items_scatg}
            placeholder="Select..."
            //disabled={readOnly}
            optionValue="id"
            optionLabel="mcatg_cname"
          />
        </div>
      </div>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={15}
        sortable
        searchable
        striped
        hoverable
        exportable
        exportFilename="data-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
        autofit
        cfColumns={cfColumns}
      />
    </>
  );
};
export default ItemsList;
