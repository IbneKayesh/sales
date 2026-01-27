import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useAttributesSgd } from "@/hooks/inventory/useAttributesSgd";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { formatDateForAPI } from "@/utils/datetime";

const AttributesComp = ({ visible, setVisible, formData, setFormData }) => {
  const [attributes, setAttributes] = useState({});
  const { dataList: attributesList, handleLoadAttributes } = useAttributesSgd();
  useEffect(() => {
    let initialAttributes = formData.cbkng_attrb || {};
    if (typeof initialAttributes === "string") {
      try {
        initialAttributes = JSON.parse(initialAttributes);
      } catch (e) {
        console.warn("Failed to parse attributes string:", e);
        initialAttributes = {};
      }
    }
    setAttributes(initialAttributes);
    handleLoadAttributes();
  }, []);

  useEffect(() => {
    setFormData({ ...formData, cbkng_attrb: attributes });
  }, [attributes]);

  return (
    <Dialog
      header="Attributes"
      visible={visible}
      style={{ minWidth: "50vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
    >
      <div className="m-0">
        {attributesList.map((attr) => (
          <div key={attr.id} className="flex flex-column mb-1">
            <label htmlFor={attr.attrb_aname} className="mb-1">
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
      </div>
    </Dialog>
  );
};

export default AttributesComp;
