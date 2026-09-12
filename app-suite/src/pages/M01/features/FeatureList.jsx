import TreeDataTable from "@/components/TreeDataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconError, IconSuccess, IconPlus } from "@/icons";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Dropdown from "@/components/Dropdown";
import MultiSelect from "@/components/MultiSelect";
import { fetur_ttype_Options, fetur_tagno_Options } from "@/utils/vtable";
import { splitList } from "@/utils/misc";

// Colour per feature type, so the list reads at a glance
const ttype_Variants = {
  Developed: "primary",
  Pending: "warning",
  Live: "success",
  "On Test": "info",
  Hold: "danger",
};

const FeatureList = ({
  treeData,
  onEdit,
  onDelete,
  onAddChild,
  onStatus,
  //filters
  filterData,
  onFilterChange,
}) => {
  const dtColumns = [
    {
      key: "fetur_cname",
      header: "Name",
      width: "80px",
      render: (_, row) => {
        return (
          <>
            <span className={`${!row.fetur_actve && "text-red-500"}`}>
              {row.fetur_srial} ~ {row.fetur_cname}
            </span>
            {row.fetur_stats && (
              <Badge variant="success" className="ms-2">
                Done
              </Badge>
            )}
          </>
        );
      },
    },
    {
      key: "fetur_ttype",
      header: "Type",
      width: "100px",
      render: (val) => {
        if (!val) return "—";
        return (
          <Badge variant={ttype_Variants[val] || "muted"}>{val}</Badge>
        );
      },
    },
    {
      key: "fetur_tagno",
      header: "Tags",
      width: "140px",
      render: (val) => {
        const tags = splitList(val);
        if (tags.length === 0) return "—";
        return (
          <span className="d-inline-flex flex-wrap gap-1">
            {tags.map((t) => (
              <Chip key={t} variant="outline" size="sm">
                {t}
              </Chip>
            ))}
          </span>
        );
      },
    },
    { key: "fetur_descr", header: "Description", width: "80px" },
    { key: "fetur_notes", header: "Notes", width: "80px" },
    { key: "fetur_table", header: "Table", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <div className="d-inline-flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(row);
            }}
            title="Add Child"
          >
            <IconPlus size={14} className="text-success" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onStatus(row);
            }}
            title="Status"
          >
            {row.fetur_stats ? (
              <IconError size={14} className="text-danger" />
            ) : (
              <IconSuccess size={14} className="text-success" />
            )}
          </Button>
          <ActionButton
            rowData={row}
            actve={row.fetur_actve}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="grid mb-2">
        <div className="col-span-3">
          <Dropdown
            label="Type"
            options={fetur_ttype_Options}
            value={filterData?.fetur_ttype}
            onChange={(e) => onFilterChange("fetur_ttype", e.target.value)}
            placeholder="All types"
            clearable
            optionValue="value"
            optionLabel="label"
          />
        </div>
        <div className="col-span-3">
          <MultiSelect
            label="Tags"
            options={fetur_tagno_Options}
            value={filterData?.fetur_tagno}
            onChange={(e) => onFilterChange("fetur_tagno", e.target.value)}
            placeholder="All tags"
            optionValue="value"
            optionLabel="label"
          />
        </div>
      </div>
      <TreeDataTable
        columns={dtColumns}
        data={treeData}
        treeColumn={0}
        searchable
        expandable
        storageKey="M01-features-expanded"
        exportable
        exportFilename="data-export.csv"
        striped
        hoverable
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
      />
    </>
  );
};
export default FeatureList;
