import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";
import HeaderComp from "./efrm/HeaderComp";
import ItemsComp from "./efrm/ItemsComp";
import PaymComp from "./efrm/PaymComp";

const MrrFormComp = ({ formData, errors, onChange, migrn_cntct_Options, price_items_Options }) => {
  return (
    <>
      <HeaderComp
        formData={formData}
        errors={errors}
        onChange={onChange}
        migrn_cntct_Options={migrn_cntct_Options}
      />
      <ItemsComp 
        formData={formData}
        errors={errors}
        onChange={onChange}
        price_items_Options={price_items_Options}/>
      <PaymComp />
      {JSON.stringify(formData)}
      <div className="grid">
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2">LP Rate</label>
          <InputNumber
            name="price_lprat"
            value={formData.price_lprat}
            onValueChange={(e) => onChange("price_lprat", e.value)}
            className={`w-full ${errors.price_lprat ? "p-invalid" : ""}`}
            placeholder="0.00"
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={6}
          />
          <RequiredText text={errors.price_lprat} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2">DP Rate</label>
          <InputNumber
            name="price_dprat"
            value={formData.price_dprat}
            onValueChange={(e) => onChange("price_dprat", e.value)}
            className={`w-full ${errors.price_dprat ? "p-invalid" : ""}`}
            placeholder="0.00"
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={6}
          />
          <RequiredText text={errors.price_dprat} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2">TP Rate</label>
          <InputNumber
            name="price_tprat"
            value={formData.price_tprat}
            onValueChange={(e) => onChange("price_tprat", e.value)}
            className={`w-full ${errors.price_tprat ? "p-invalid" : ""}`}
            placeholder="0.00"
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={6}
          />
          <RequiredText text={errors.price_tprat} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2">MRP Rate</label>
          <InputNumber
            name="price_mrrat"
            value={formData.price_mrrat}
            onValueChange={(e) => onChange("price_mrrat", e.value)}
            className={`w-full ${errors.price_mrrat ? "p-invalid" : ""}`}
            placeholder="0.00"
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={6}
          />
          <RequiredText text={errors.price_mrrat} />
        </div>

        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2">Discount %</label>
          <InputNumber
            name="price_dspct"
            value={formData.price_dspct}
            onValueChange={(e) => onChange("price_dspct", e.value)}
            className={`w-full ${errors.price_dspct ? "p-invalid" : ""}`}
            placeholder="0.00"
            mode="decimal"
            minFractionDigits={2}
            suffix=" %"
          />
          <RequiredText text={errors.price_dspct} />
        </div>
        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2">Min Qty</label>
          <InputNumber
            name="price_mnqty"
            value={formData.price_mnqty}
            onValueChange={(e) => onChange("price_mnqty", e.value)}
            className={`w-full ${errors.price_mnqty ? "p-invalid" : ""}`}
            placeholder="0.00"
          />
          <RequiredText text={errors.price_mnqty} />
        </div>

        <div className="col-12 md:col-2">
          <label className="block font-bold mb-2">Max Qty</label>
          <InputNumber
            name="price_mxqty"
            value={formData.price_mxqty}
            onValueChange={(e) => onChange("price_mxqty", e.value)}
            className={`w-full ${errors.price_mxqty ? "p-invalid" : ""}`}
            placeholder="0.00"
          />
          <RequiredText text={errors.price_mxqty} />
        </div>
        <div className="col-12 md:col-10">
          <label className="block font-bold mb-2">Notes</label>
          <InputText
            name="price_notes"
            value={formData.price_notes}
            onChange={(e) => onChange("price_notes", e.target.value)}
            className={`w-full ${errors.price_notes ? "p-invalid" : ""}`}
            placeholder="Enter notes"
          />
          <RequiredText text={errors.price_notes} />
        </div>

        {formData.id && (
          <AuditFields
            active={formData.price_actve}
            createdBy={formData.crusr_cname}
            createdAt={formData.price_crdat}
            updatedBy={formData.upusr_cname}
            updatedAt={formData.price_updat}
            revNo={formData.price_rvnmr}
          />
        )}
      </div>
    </>
  );
};
export default MrrFormComp;
