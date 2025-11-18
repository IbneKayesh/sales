import { closingProcessAPI } from "@/api/closingProcessAPI";

const useClosingProcess = () => {
  const updateBankTransaction = async (id) => {
    const response = await closingProcessAPI.updateBankTransaction(id);
    return response.data;
  };

  const updateItem = async (id) => {
    const response = await closingProcessAPI.updateItem(id);
    return response.data;
  };

  return {
    updateBankTransaction,
    updateItem,
  };
};

export default useClosingProcess;
