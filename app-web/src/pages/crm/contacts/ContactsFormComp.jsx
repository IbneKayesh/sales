import { useState } from "react";
import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import AuditFields from "@/components/AuditFields";
import ContactsAddressComp from "./ContactsAddressComp";

const ContactsFormComp = ({
  formData,
  errors,
  onChange,
  cntct_ctype_Options,
  cntct_sorce_Options,
  cntct_trtry_Options,
  cntct_tarea_Options,
  cntct_dzone_Options,
  dzone_cntry_Options,
  cntct_crncy_Options,
  cntct_price_Options,
  //contact address
  formDataAddress,
  onChangeAddress,
  onSubmitAddressClick,
  dataListAddress,
  onEditAddress,
  onDeleteAddress,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Type</label>
        <Dropdown
          name="cntct_ctype"
          value={formData.cntct_ctype}
          onChange={(e) => onChange("cntct_ctype", e.value)}
          options={cntct_ctype_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.cntct_ctype ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter type`}
          filter
          showClear
        />
        <RequiredText text={errors.cntct_ctype} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Type</label>
        <Dropdown
          name="cntct_sorce"
          value={formData.cntct_sorce}
          onChange={(e) => onChange("cntct_sorce", e.value)}
          options={cntct_sorce_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.cntct_sorce ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter source`}
          filter
          showClear
        />
        <RequiredText text={errors.cntct_sorce} />
      </div>
      <div className="col-12 md:col-4">
        <label className="block font-bold mb-2 text-red-800">Name</label>
        <InputText
          name="cntct_cntnm"
          value={formData.cntct_cntnm}
          onChange={(e) => onChange("cntct_cntnm", e.target.value)}
          className={`w-full ${errors.cntct_cntnm ? "p-invalid" : ""}`}
          placeholder={`Enter name`}
        />
        <RequiredText text={errors.cntct_cntnm} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Person Name</label>
        <InputText
          name="cntct_cntps"
          value={formData.cntct_cntps}
          onChange={(e) => onChange("cntct_cntps", e.target.value)}
          className={`w-full ${errors.cntct_cntps ? "p-invalid" : ""}`}
          placeholder={`Enter person name`}
        />
        <RequiredText text={errors.cntct_cntps} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Contact No</label>
        <InputText
          name="cntct_cntno"
          value={formData.cntct_cntno}
          onChange={(e) => onChange("cntct_cntno", e.target.value)}
          className={`w-full ${errors.cntct_cntno ? "p-invalid" : ""}`}
          placeholder={`Enter contact no`}
        />
        <RequiredText text={errors.cntct_cntno} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Email</label>
        <InputText
          name="cntct_email"
          value={formData.cntct_email}
          onChange={(e) => onChange("cntct_email", e.target.value)}
          className={`w-full ${errors.cntct_email ? "p-invalid" : ""}`}
          placeholder={`Enter Email`}
        />
        <RequiredText text={errors.cntct_email} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">TIN</label>
        <InputText
          name="cntct_tinno"
          value={formData.cntct_tinno}
          onChange={(e) => onChange("cntct_tinno", e.target.value)}
          className={`w-full ${errors.cntct_tinno ? "p-invalid" : ""}`}
          placeholder={`Enter TIN`}
        />
        <RequiredText text={errors.cntct_tinno} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Trade</label>
        <InputText
          name="cntct_trade"
          value={formData.cntct_trade}
          onChange={(e) => onChange("cntct_trade", e.target.value)}
          className={`w-full ${errors.cntct_trade ? "p-invalid" : ""}`}
          placeholder={`Enter Trade`}
        />
        <RequiredText text={errors.cntct_trade} />
      </div>
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2">Office Address</label>
        <InputTextarea
          name="cntct_ofadr"
          value={formData.cntct_ofadr}
          onChange={(e) => onChange("cntct_ofadr", e.target.value)}
          rows={5}
          cols={30}
          className={`w-full ${errors.cntct_ofadr ? "p-invalid" : ""}`}
          placeholder={`Enter office address`}
        />
        <RequiredText text={errors.cntct_ofadr} />
      </div>
      <div className="col-12 md:col-4">
        <label className="block font-bold mb-2">Factory Address</label>
        <InputTextarea
          name="cntct_fcadr"
          value={formData.cntct_fcadr}
          onChange={(e) => onChange("cntct_fcadr", e.target.value)}
          rows={5}
          cols={30}
          className={`w-full ${errors.cntct_fcadr ? "p-invalid" : ""}`}
          placeholder={`Enter factory address`}
        />
        <RequiredText text={errors.cntct_fcadr} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Country</label>
        <Dropdown
          name="cntct_cntry"
          value={formData.cntct_cntry}
          onChange={(e) => onChange("cntct_cntry", e.value)}
          options={dzone_cntry_Options}
          optionLabel="label_text"
          optionValue="value_text"
          className={`w-full ${errors.cntct_cntry ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter country`}
          filter
          showClear
        />
        <RequiredText text={errors.cntct_cntry} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">D/Zone</label>
        <Dropdown
          name="cntct_dzone"
          value={formData.cntct_dzone}
          onChange={(e) => onChange("cntct_dzone", e.value)}
          options={cntct_dzone_Options}
          optionLabel="dzone_dname"
          optionValue="id"
          className={`w-full ${errors.cntct_dzone ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter d/zone`}
          filter
          showClear
        />
        <RequiredText text={errors.cntct_dzone} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">T/Area</label>
        <Dropdown
          name="cntct_tarea"
          value={formData.cntct_tarea}
          onChange={(e) => onChange("cntct_tarea", e.value)}
          options={cntct_tarea_Options}
          optionLabel="tarea_tname"
          optionValue="id"
          className={`w-full ${errors.cntct_tarea ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter t/area`}
          filter
          showClear
        />
        <RequiredText text={errors.cntct_tarea} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Territory</label>
        <Dropdown
          name="cntct_trtry"
          value={formData.cntct_trtry}
          onChange={(e) => onChange("cntct_trtry", e.value)}
          options={cntct_trtry_Options}
          optionLabel="trtry_wname"
          optionValue="id"
          className={`w-full ${errors.cntct_trtry ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter territory`}
          filter
          showClear
        />
        <RequiredText text={errors.cntct_trtry} />
      </div>

      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Other Address</label>
        <Dropdown
          name="cntct_cntad"
          value={formData.cntct_cntad}
          onChange={(e) => onChange("cntct_cntad", e.value)}
          options={dataListAddress}
          optionLabel="cntad_ofadr"
          optionValue="id"
          className={`w-full ${errors.cntct_cntad ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter address`}
          filter
          showClear
        />
        <RequiredText text={errors.cntct_cntad} />
      </div>

      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Currency</label>
        <Dropdown
          name="cntct_crncy"
          value={formData.cntct_crncy}
          onChange={(e) => onChange("cntct_crncy", e.value)}
          options={cntct_crncy_Options}
          optionLabel="label_text"
          optionValue="value_text"
          className={`w-full ${errors.cntct_crncy ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter currency`}
          filter
          showClear
        />
        <RequiredText text={errors.cntct_crncy} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Price</label>
        <Dropdown
          name="cntct_price"
          value={formData.cntct_price}
          onChange={(e) => onChange("cntct_price", e.value)}
          options={cntct_price_Options}
          optionLabel="price_mname"
          optionValue="id"
          className={`w-full ${errors.cntct_price ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter price`}
          filter
          showClear
        />
        <RequiredText text={errors.cntct_price} />
      </div>      
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Discount %</label>
        <InputText
          name="cntct_dspct"
          value={formData.cntct_dspct}
          onChange={(e) => onChange("cntct_dspct", e.target.value)}
          className={`w-full ${errors.cntct_dspct ? "p-invalid" : ""}`}
          placeholder={`Enter Discount %`}
        />
        <RequiredText text={errors.cntct_dspct} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">
          Credit Limit
        </label>
        <InputText
          name="cntct_crlmt"
          value={formData.cntct_crlmt}
          onChange={(e) => onChange("cntct_crlmt", e.target.value)}
          className={`w-full ${errors.cntct_crlmt ? "p-invalid" : ""}`}
          placeholder={`Enter Credit Limit`}
        />
        <RequiredText text={errors.cntct_crlmt} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">
          Current Balance
        </label>
        <InputText
          name="cntct_crbal"
          value={formData.cntct_crbal}
          onChange={(e) => onChange("cntct_crbal", e.target.value)}
          className={`w-full ${errors.cntct_crbal ? "p-invalid" : ""}`}
          placeholder={`Enter Current Balance`}
        />
        <RequiredText text={errors.cntct_crbal} />
      </div>

      <div className="col-12 p-card p-3 mt-3">
        <h4 className="mt-0 mb-3 text-red-800">Contact Addresses</h4>
        <ContactsAddressComp
          formData={formDataAddress}
          errors={errors}
          onChange={onChangeAddress}
          onSaveClick={onSubmitAddressClick}
          dataList={dataListAddress}
          onEdit={onEditAddress}
          onDelete={onDeleteAddress}
        />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.cntct_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.cntct_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.cntct_updat}
          revNo={formData.cntct_rvnmr}
        />
      )}
    </div>
  );
};
export default ContactsFormComp;
