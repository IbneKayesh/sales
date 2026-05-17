import { InputNumber } from "primereact/inputnumber";
import RequiredText from "@/components/RequiredText";

const ItemsSumComp = ({ readOnly, formData, errors, onChange }) => {
  return (
    <div className="col-12 md:col-2">
      <label className="block font-bold mb-2">Amount</label>
      <InputNumber
        name="mrrmt_tramt"
        value={formData.mrrmt_tramt}
        onValueChange={(e) => onChange("mrrmt_tramt", e.value)}
        className={`w-full ${errors.mrrmt_tramt ? "p-invalid" : ""}`}
        placeholder="0.00"
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={6}
        disabled={true}
      />
      <RequiredText text={errors.mrrmt_tramt} />
      <label className="block font-bold mb-2">Item Discount</label>
      <InputNumber
        name="mrrmt_itmds"
        value={formData.mrrmt_itmds}
        onValueChange={(e) => onChange("mrrmt_itmds", e.value)}
        className={`w-full ${errors.mrrmt_itmds ? "p-invalid" : ""}`}
        placeholder="0.00"
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={6}
        disabled={true}
      />
      <RequiredText text={errors.mrrmt_itmds} />
      <label className="block font-bold mb-2 text-red-800">Invoice Discount</label>
      <InputNumber
        name="mrrmt_invds"
        value={formData.mrrmt_invds}
        onValueChange={(e) => onChange("mrrmt_invds", e.value)}
        className={`w-full ${errors.mrrmt_invds ? "p-invalid" : ""}`}
        placeholder="0.00"
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={6}
      />
      <RequiredText text={errors.mrrmt_invds} />
      <label className="block font-bold mb-2">VAT</label>
      <InputNumber
        name="mrrmt_vtamt"
        value={formData.mrrmt_vtamt}
        onValueChange={(e) => onChange("mrrmt_vtamt", e.value)}
        className={`w-full ${errors.mrrmt_vtamt ? "p-invalid" : ""}`}
        placeholder="0.00"
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={6}
        disabled={true}
      />
      <RequiredText text={errors.mrrmt_vtamt} />
      <label className="block font-bold mb-2">TAX</label>
      <InputNumber
        name="mrrmt_txamt"
        value={formData.mrrmt_txamt}
        onValueChange={(e) => onChange("mrrmt_txamt", e.value)}
        className={`w-full ${errors.mrrmt_txamt ? "p-invalid" : ""}`}
        placeholder="0.00"
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={6}
        disabled={true}
      />
      <RequiredText text={errors.mrrmt_txamt} />
      <label className="block font-bold mb-2">Include</label>
      <InputNumber
        name="mrrmt_icamt"
        value={formData.mrrmt_icamt}
        onValueChange={(e) => onChange("mrrmt_icamt", e.value)}
        className={`w-full ${errors.mrrmt_icamt ? "p-invalid" : ""}`}
        placeholder="0.00"
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={6}
        disabled={true}
      />
      <RequiredText text={errors.mrrmt_icamt} />
      <label className="block font-bold mb-2">Exclude</label>
      <InputNumber
        name="mrrmt_ecamt"
        value={formData.mrrmt_ecamt}
        onValueChange={(e) => onChange("mrrmt_ecamt", e.value)}
        className={`w-full ${errors.mrrmt_ecamt ? "p-invalid" : ""}`}
        placeholder="0.00"
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={6}
        disabled={true}
      />
      <RequiredText text={errors.mrrmt_ecamt} />
      <label className="block font-bold mb-2">Payable</label>
      <InputNumber
        name="mrrmt_pyamt"
        value={formData.mrrmt_pyamt}
        onValueChange={(e) => onChange("mrrmt_pyamt", e.value)}
        className={`w-full ${errors.mrrmt_pyamt ? "p-invalid" : ""}`}
        placeholder="0.00"
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={6}
        disabled={true}
      />
      <RequiredText text={errors.mrrmt_pyamt} />
      <label className="block font-bold mb-2">Paid</label>
      <InputNumber
        name="mrrmt_pdamt"
        value={formData.mrrmt_pdamt}
        onValueChange={(e) => onChange("mrrmt_pdamt", e.value)}
        className={`w-full ${errors.mrrmt_pdamt ? "p-invalid" : ""}`}
        placeholder="0.00"
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={6}
        disabled={true}
      />
      <RequiredText text={errors.mrrmt_pdamt} />
      <label className="block font-bold mb-2">Due</label>
      <InputNumber
        name="mrrmt_duamt"
        value={formData.mrrmt_duamt}
        onValueChange={(e) => onChange("mrrmt_duamt", e.value)}
        className={`w-full ${errors.mrrmt_duamt ? "p-invalid" : ""}`}
        placeholder="0.00"
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={6}
        disabled={true}
      />
      <RequiredText text={errors.mrrmt_duamt} />
    </div>
  );
};
export default ItemsSumComp;
