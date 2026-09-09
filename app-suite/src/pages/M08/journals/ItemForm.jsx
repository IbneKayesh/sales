import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
import { ledger_types_Options } from "@/utils/vtable";
import InputLabel from "@/components/InputLabel";
import { amountInWords } from "@/utils/ntw.js";

const ItemForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onAddToList,
  chtac_Options,
  party_Options,
}) => {
  //Account Type	Normal Balance	+ Increase	− Decrease
  // ASSETS	Debit (Dr)	Debit (+)	Credit (−)
  // LIABILITIES	Credit (Cr)	Credit (+)	Debit (−)
  // EQUITY	Credit (Cr)	Credit (+)	Debit (−)
  // REVENUE	Credit (Cr)	Credit (+)	Debit (−)
  // EXPENSES	Debit (Dr)	Debit (+)	Credit (−)

  const isDebitNormal = formData.chtac_ntype === "Dr";
  const isCreditNormal = formData.chtac_ntype === "Cr";

  const drSign = isDebitNormal ? "+" : "-";
  const crSign = isCreditNormal ? "+" : "-";

  const drColor = isDebitNormal ? "text-green-600" : "text-red-500";
  const crColor = isCreditNormal ? "text-green-600" : "text-red-500";

  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Ledger Type"
            options={ledger_types_Options}
            value={formData.ledger_types}
            onChange={(e) => onChange("ledger_types", e.target.value)}
            error={formErrors.ledger_types}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="value"
            optionLabel="label"
          />
        </div>
        <div className="col-span-9">
          <Dropdown
            label="Ledger"
            options={chtac_Options}
            value={formData.jrnlc_chtac}
            onChange={(e) => onChange("jrnlc_chtac", e.target.value)}
            error={formErrors.jrnlc_chtac}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="chtac_cname"
            optionGrid="chtac_cname:Name,chtac_chtno:COA,party_count:Sub Ledger"
          />
        </div>
        <div className="col-span-8">
          <Dropdown
            label="Sub Ledger"
            options={party_Options}
            value={formData.jrnlc_party}
            onChange={(e) => onChange("jrnlc_party", e.target.value)}
            error={formErrors.jrnlc_party}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="party_cname"
            optionGrid="party_cname:Party,party_crbal:Balance,chtac_cname:Chart,party_ptype:Type"
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label={<span className={drColor}>Dr ({drSign})</span>}
            placeholder="Enter Dr"
            value={formData.jrnlc_drval}
            onChange={(e) => onChange("jrnlc_drval", e.target.value)}
            error={formErrors.jrnlc_drval}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label={<span className={crColor}>Cr ({crSign})</span>}
            placeholder="Enter Cr"
            value={formData.jrnlc_crval}
            onChange={(e) => onChange("jrnlc_crval", e.target.value)}
            error={formErrors.jrnlc_crval}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputText
            label="Description"
            placeholder="Enter description"
            value={formData.jrnlc_descr}
            onChange={(e) => onChange("jrnlc_descr", e.target.value)}
            error={formErrors.jrnlc_descr}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputLabel
            label="Amount in words"
            value={amountInWords(
              Number(formData.jrnlc_drval) > 0
                ? formData.jrnlc_drval
                : formData.jrnlc_crval,
            )}
          />
        </div>
      </div>
      <div className="form-actions">
        <Button
          variant="outline"
          onClick={() => onAddToList("NEXT")}
          disabled={isBusy || readOnly}
        >
          <IconPlus size={16} className="icon-left" />
          Add and Next
        </Button>
        <Button
          variant="outline"
          onClick={() => onAddToList("CLOSE")}
          disabled={isBusy || readOnly}
        >
          <IconPlus size={16} className="icon-left" />
          Add
        </Button>
      </div>
    </div>
  );
};
export default ItemForm;
