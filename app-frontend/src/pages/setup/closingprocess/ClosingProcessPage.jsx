import React, { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import useClosingProcess from "@/hooks/setup/useClosingProcess";

const ClosingProcessPage = () => {
  const [loadingBank, setLoadingBank] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);
  const toast = useRef(null);
  const { updateBankTransaction, updateItemProfit } = useClosingProcess();

  const handleUpdateBankTransaction = async () => {
    setLoadingBank(true);
    try {
      // Assuming a dummy id for now, replace with actual logic
      const id = "sgd";
      await updateBankTransaction(id);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Bank transactions updated successfully",
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update bank transactions",
      });
    } finally {
      setLoadingBank(false);
    }
  };

  const handleUpdateItemProfit = async () => {
    setLoadingItem(true);
    try {
      // Assuming a dummy id for now, replace with actual logic
      const id = "sgd";
      await updateItemProfit(id);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Item profit updated successfully",
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update item profit",
      });
    } finally {
      setLoadingItem(false);
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h1 className="text-2xl font-bold mb-4">Closing Process</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Update Bank Transactions" className="shadow-lg">
          <p className="mb-4">Update debit and credit balances for bank accounts and banks based on transactions.</p>
          <Button
            label="Update Bank Transactions"
            icon="pi pi-refresh"
            loading={loadingBank}
            onClick={handleUpdateBankTransaction}
            className="w-full"
          />
        </Card>
        <Card title="Update Item Profit" className="shadow-lg">
          <p className="mb-4">Calculate and update approximate profit for items based on purchase and sales rates with discount.</p>
          <Button
            label="Update Item Profit"
            icon="pi pi-calculator"
            loading={loadingItem}
            onClick={handleUpdateItemProfit}
            className="w-full"
          />
        </Card>
      </div>
    </div>
  );
};

export default ClosingProcessPage;
