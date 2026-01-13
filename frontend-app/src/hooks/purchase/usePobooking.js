const usePobooking = () => {
  const [pageConfig, setPageConfig] = useState({
    is_posted: 0,
    is_vat_payable: 0,
    include_discount: 0,
    include_vat: 0,
  });

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

  
  const resetForm = () => {
    setFormData({
      ...formDataModel,
      shop_id: user.shop_id,
      is_posted: Number(pageConfig.is_posted),
      is_vat_payable: Number(pageConfig.is_vat_payable),
    });

    setFormDataList([]);
    setFormDataPaymentList([]);
  };



  const handleSave = async (e) => {
    e.preventDefault();
    try {
      

      const paidStatus =
        Number(formData.payable_amount) === Number(formData.due_amount)
          ? "Unpaid"
          : Number(formData.due_amount) === 0
          ? "Paid"
          : "Partial";

      const formDataNew = {
        ...formData,
        master_id: formData.master_id ? formData.master_id : generateGuid(),
        is_paid: paidStatus,
        details_create: formDataList,
        payments_create: formDataPaymentList,
      };

          //call update process
      await closingProcessAPI("Purchase Booking", formData.order_no);

      handleCancel();
      loadBookingList();
    } catch (error) {

    } 
  };

  const fetchDetails = async (master_id) => {
    try {
      const data = await pobookingAPI.getDetails(master_id);
      setFormDataList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load from server",
      });
    }
  };

  const fetchPayments = async (master_id) => {
    try {
      const data = await pobookingAPI.getPayments(master_id);
      setFormDataPaymentList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load from server",
      });
    }
  };

  const handleEdit = async (data) => {
    setFormData(data);
    await fetchDetails(data.master_id);
    await fetchPayments(data.master_id);
    setCurrentView("form");
  };

  const handleCancelBooking = async (data) => {
    try {
      setIsBusy(true);
      const responseData = await pobookingAPI.cancelBooking(data.master_id);
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: `${data.order_no} successfully.`,
      });

      //call update process
      await closingProcessAPI("Purchase Booking Cancel", data.order_no);
      loadBookingList();
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data from server",
      });
    } finally {
      setIsBusy(false);
    }
  };

};