import { useState } from "react";

const usePbooking = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return { errors, formData, handleChange };
};

export default usePbooking;