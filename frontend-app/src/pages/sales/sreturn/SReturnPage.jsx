import { useSreturn } from "@/hooks/sales/useSreturn";

const SReturnPage = () => {
  const { isBusy, currentView, dataList, errors, formData } = useSreturn();
  return JSON.stringify(formData);
};
export default SReturnPage;
