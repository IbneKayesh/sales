const usePobooking = () => {
  const loadSettings = async () => {
    try {
      setIsBusy(true);
      const data = await settingsAPI.getByPageId("Purchase Booking");
      //console.log("Settings data:", data);

      const settingsObj = Object.fromEntries(
        data.map(({ setting_key, setting_value }) => [
          setting_key,
          setting_value,
        ])
      );

      setPageConfig((prevConfig) => ({
        ...prevConfig,
        is_posted: settingsObj["is_posted"] ?? prevConfig.is_posted,
        is_vat_payable:
          settingsObj["is_vat_payable"] ?? prevConfig.is_vat_payable,
        include_discount:
          settingsObj["include_discount"] ?? prevConfig.include_discount,
        include_vat: settingsObj["include_vat"] ?? prevConfig.include_vat,
      }));
    } catch (error) {
      console.error("Error fetching config line:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load config line from server",
      });
    } finally {
      setIsBusy(false);
    }
  };
};