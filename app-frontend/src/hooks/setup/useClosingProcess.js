import { closingProcessAPI } from "@/api/closingProcessAPI";

const useClosingProcess = () => {
  const updateBankTransaction = async (id) => {
    const response = await closingProcessAPI.updateBankTransaction(id);
    return response.data;
  };

  const updateItemProfit = async (id) => {
    const response = await closingProcessAPI.updateItemProfit(id);
    return response.data;
  };

  return {
    updateBankTransaction,
    updateItemProfit,
  };
};

export default useClosingProcess;
