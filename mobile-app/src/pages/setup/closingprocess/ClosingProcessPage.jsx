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
  const { updateBankTransaction, updateItem } = useClosingProcess();

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

  const handleUpdateItem = async () => {
    setLoadingItem(true);
    try {
      // Assuming a dummy id for now, replace with actual logic
      const id = "sgd";
      await updateItem(id);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Item updated successfully",
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update item",
      });
    } finally {
      setLoadingItem(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="p-4 max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Closing Process
          </h1>
          <p className="text-gray-300">
            Perform end-of-period updates for bank transactions and item data.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          <Card
            title="Update Bank Transactions"
            className="shadow-lg flex-1 min-h-[200px] flex flex-col"
            subTitle="Balance Reconciliation"
          >
            <div className="flex-grow">
              <p className="text-gray-700 mb-4">
                Update debit and credit balances for bank accounts and banks
                based on transactions.
              </p>
            </div>
            <Button
              label="Update Bank Transactions"
              icon="pi pi-refresh"
              loading={loadingBank}
              onClick={handleUpdateBankTransaction}
              className="w-full"
              severity="info"
            />
          </Card>
          <Card
            title="Update Item Data"
            className="shadow-lg flex-1 min-h-[200px] flex flex-col"
            subTitle="Comprehensive Calculations"
          >
            <div className="flex-grow">
              <p className="text-gray-700 mb-4">
                Calculate and update various item metrics including margins,
                orders, stock levels, and other derived values based on purchase
                and sales data.
              </p>
            </div>
            <Button
              label="Update Item Data"
              icon="pi pi-calculator"
              loading={loadingItem}
              onClick={handleUpdateItem}
              className="w-full"
              severity="success"
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default ClosingProcessPage;
