import { Card } from "primereact/card";
import EntryComp from "./EntryComp";
import usePbooking from "@/hooks/purchase/usePbooking";

const BookingPage = () => {
  const { errors, formData, handleChange } = usePbooking();
  return (
    <Card className="bg-dark-200 border-round p-3">
      <EntryComp
        errors={errors}
        formData={formData}
        handleChange={handleChange}
      />
    </Card>
  );
};

export default BookingPage;
