import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useAttributesSgd } from "@/hooks/inventory/useAttributesSgd";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { formatDateForAPI } from "@/utils/datetime";
import { parseAttributes, stringifyAttributes } from "@/utils/jsonParser";

const AttributesComp = ({ visible, setVisible, formData, setFormData }) => {
  const [attributes, setAttributes] = useState(() =>
    parseAttributes(formData.cinvc_attrb),
  );
  
  const {
    isBusy,
    dataList: attributesList,
    handleGetAllAttribProduct,
  } = useAttributesSgd();

  useEffect(() => {
    handleGetAllAttribProduct(formData.cinvc_items);
  }, []);

  useEffect(() => {
    setFormData({ ...formData, cinvc_attrb: stringifyAttributes(attributes) });
  }, [attributes]);

  return (
    <Dialog
      header="Attributes"
      visible={visible}
      style={{ minWidth: "25vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
    >
      <div className="m-0">
        {/* {JSON.stringify(formData)} */}
        {attributesList?.map((attr) => (
          <div key={attr.id} className="flex flex-column mb-1">
            <label htmlFor={attr.attrb_aname} className="mb-1 font-bold">
              {attr.attrb_aname}
            </label>
            {attr.attrb_dtype === "text" ? (
              <InputText
                value={attributes[attr.attrb_aname] || ""}
                onChange={(e) =>
                  setAttributes({
                    ...attributes,
                    [attr.attrb_aname]: e.target.value,
                  })
                }
                placeholder="Enter value "
              />
            ) : null}
            {attr.attrb_dtype === "number" ? (
              <InputNumber
                value={attributes[attr.attrb_aname] || ""}
                onValueChange={(e) =>
                  setAttributes({
                    ...attributes,
                    [attr.attrb_aname]: e.value,
                  })
                }
                placeholder="Enter value"
              />
            ) : null}
            {attr.attrb_dtype === "date" ? (
              <Calendar
                value={
                  attributes[attr.attrb_aname]
                    ? new Date(attributes[attr.attrb_aname])
                    : null
                }
                onChange={(e) =>
                  setAttributes({
                    ...attributes,
                    [attr.attrb_aname]: formatDateForAPI(e.value),
                  })
                }
                dateFormat="yy-mm-dd"
                showIcon
              />
            ) : null}
          </div>
        ))}

        {attributesList.length === 0 && !isBusy && (
          <span className="text-red-500">Not attributes found</span>
        )}

        {isBusy && <span>Loading attributes...</span>}

        <span
          className="p-button p-button-sm mt-2"
          onClick={() => {
            if (!visible) return;
            setVisible(false);
          }}
        >
          Ok
        </span>
      </div>
    </Dialog>
  );
};

export default AttributesComp;
