import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const SearchComp = ({
  formData,
  onChange,
  onSubmitClick,
  aemp_id_Options,
}) => {
  return (
    <div className="flex flex-wrap shadow-2 border-round-lg surface-card p-2 mb-2 gap-2 align-items-center">
      <div className="flex-1">
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-calendar"></i>
          </span>
          <Calendar
            name="start_date"
            value={formData.start_date ? new Date(formData.start_date) : null}
            onChange={(e) => onChange("start_date", e.value)}
            className="w-full"
            inputClassName="p-inputtext-sm"
            dateFormat="yy-mm-dd"
            placeholder="From Date"
            showClear
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-calendar"></i>
          </span>
          <Calendar
            name="end_date"
            value={formData.end_date ? new Date(formData.end_date) : null}
            onChange={(e) => onChange("end_date", e.value)}
            className="w-full"
            inputClassName="p-inputtext-sm"
            dateFormat="yy-mm-dd"
            placeholder="To Date"
            showClear
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Dropdown
            name="aemp_srid"
            value={formData.aemp_srid}
            options={aemp_id_Options}
            optionLabel="aemp_name"
            optionValue="acmp_id"
            onChange={(e) => onChange("aemp_srid", e.value)}
            className="w-full p-inputtext-sm"
            placeholder="SR"
            filter
            showClear
            checkmark={true}
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-search"></i>
          </span>
          <InputText
            name="search_text"
            value={formData.search_text}
            onChange={(e) => onChange("search_text", e.target.value)}
            placeholder="-Search-"
            className="w-full p-inputtext-sm"
          />
        </div>
      </div>
      <div className="flex gap-2 ml-auto">
        <Button
          label="Find"
          icon="pi pi-search"
          severity="info"
          size="small"
          onClick={() => onSubmitClick()}
        />
      </div>
    </div>
  );
};
export default SearchComp;
