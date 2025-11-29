import { closingProcessAPI } from "@/api/closingProcessAPI";

const useClosingProcess = () => {
  const processAll = async (id) => {
    console.log("caller Id " + id);
    if (["Purchase Add", "Purchase Edit", "Payment Add"].includes(id)) {
      const response = await closingProcessAPI.updatePurchase(id);
      const response2 = await closingProcessAPI.updateItem(id);
      return response.data;
    }
    if (id === "Item Stock") {
      const response = await closingProcessAPI.updateItem(id);
      return response.data;
    }
  };

  return {
    processAll,
  };
};

export default useClosingProcess;
