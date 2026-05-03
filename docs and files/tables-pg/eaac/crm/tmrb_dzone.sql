--
-- Table structure for table tmrb_dzone
--

CREATE TABLE tmrb_dzone (
  id varchar(50) PRIMARY KEY,

  dzone_apusr varchar(50) NOT NULL,
  dzone_bsins varchar(50) NOT NULL,
  dzone_cntry varchar(50) NOT NULL,
  dzone_dcode varchar(50) NOT NULL,
  dzone_dname varchar(50) NOT NULL,

    -- default
  dzone_actve boolean NOT NULL DEFAULT true,
  dzone_crusr varchar(50) NOT NULL,
  dzone_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dzone_upusr varchar(50) NOT NULL,
  dzone_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dzone_rvnmr integer NOT NULL DEFAULT 1
);


      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Role Name</label>
        <InputText
          name="role_name"
          value={formData.role_name}
          onChange={(e) => onChange("role_name", e.target.value)}
          className={`w-full ${errors.role_name ? "p-invalid" : ""}`}
          placeholder={`Enter role name`}
        />
        <RequiredText text={errors.role_name} />
      </div>