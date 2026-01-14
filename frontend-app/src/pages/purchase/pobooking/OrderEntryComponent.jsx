  return (
    <div className="p-1">
      <PrintViewComponent
        visible={showPrintDialog}
        onHide={() => setShowPrintDialog(false)}
        formData={formData}
        formDataList={formDataList}
        formDataPaymentList={formDataPaymentList}
      />
    </div>
  );