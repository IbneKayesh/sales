import HeaderComp from "./HeaderComp";
import ItemsComp from "./ItemsComp";
import PaymentComp from "./PaymentComp";

const EntryComp = ({ errors, formData, handleChange }) => {
  return (
    <div>
      <HeaderComp
        errors={errors}
        formData={formData}
        handleChange={handleChange}
      />
      <ItemsComp />
      <PaymentComp />
    </div>
  );
};

export default EntryComp;
